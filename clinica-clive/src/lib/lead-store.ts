import "server-only";
import { and, desc, eq, gte } from "drizzle-orm";
import type { LeadData } from "./lead-schema";

/** Lead como o painel enxerga, independente de onde está guardado. */
export type LeadRecord = {
  id: string;
  nome: string;
  whatsapp: string;
  tratamentos: string[];
  autorizaWhatsapp: string | null;
  interesseMedicina: string;
  origem: string;
  createdAt: Date;
};

/** Janela para ignorar envios repetidos do mesmo WhatsApp (duplo toque, reenvio). */
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

/**
 * Onde os leads ficam:
 * - Vercel Blob (privado) quando BLOB_READ_WRITE_TOKEN existe, como no deploy da Vercel;
 * - libSQL/SQLite via Drizzle nos demais casos (arquivo local ou Turso com DATABASE_URL).
 */
export const storageKind = process.env.BLOB_READ_WRITE_TOKEN && !process.env.DATABASE_URL ? "blob" : "sql";

export async function saveLead(data: LeadData, origem: string) {
  return storageKind === "blob" ? blobSave(data, origem) : sqlSave(data, origem);
}

export async function fetchLeads(): Promise<LeadRecord[]> {
  const rows = storageKind === "blob" ? await blobList() : await sqlList();
  return rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/* ---------------- SQL (Drizzle + libSQL) ---------------- */

async function sqlSave(data: LeadData, origem: string) {
  const { db, ensureSchema } = await import("@/db");
  const { leads } = await import("@/db/schema");
  await ensureSchema();
  const fields = {
    nome: data.nome,
    tratamentos: data.tratamentos,
    autorizaWhatsapp: data.autorizaWhatsapp ?? null,
    interesseMedicina: data.interesseMedicina,
  };
  const recent = await db
    .select({ id: leads.id })
    .from(leads)
    .where(and(eq(leads.whatsapp, data.whatsapp), gte(leads.createdAt, new Date(Date.now() - DUPLICATE_WINDOW_MS))))
    .orderBy(desc(leads.createdAt))
    .limit(1);
  if (recent.length > 0) {
    await db.update(leads).set(fields).where(eq(leads.id, recent[0].id));
    return;
  }
  await db.insert(leads).values({ ...fields, whatsapp: data.whatsapp, origem, createdAt: new Date() });
}

async function sqlList(): Promise<LeadRecord[]> {
  const { db, ensureSchema } = await import("@/db");
  const { leads } = await import("@/db/schema");
  await ensureSchema();
  const rows = await db.select().from(leads);
  return rows.map((r) => ({ ...r, id: String(r.id) }));
}

/* ---------------- Vercel Blob (privado) ---------------- */
// Um arquivo JSON por lead: leads/<whatsapp>/<timestamp>.json

type StoredLead = Omit<LeadRecord, "id" | "createdAt"> & { createdAt: string };

async function blobSave(data: LeadData, origem: string) {
  const { list, put } = await import("@vercel/blob");
  const prefix = `leads/${data.whatsapp}/`;
  const existing = await list({ prefix, limit: 100 });
  const latest = existing.blobs.sort((a, b) => b.pathname.localeCompare(a.pathname))[0];
  const latestTs = latest ? Number(latest.pathname.slice(prefix.length).replace(".json", "")) : 0;
  const now = Date.now();
  const reuse = latest && now - latestTs < DUPLICATE_WINDOW_MS;
  const ts = reuse ? latestTs : now;

  const body: StoredLead = {
    nome: data.nome,
    whatsapp: data.whatsapp,
    tratamentos: data.tratamentos,
    autorizaWhatsapp: data.autorizaWhatsapp ?? null,
    interesseMedicina: data.interesseMedicina,
    origem,
    createdAt: new Date(ts).toISOString(),
  };
  await put(`${prefix}${ts}.json`, JSON.stringify(body), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function blobList(): Promise<LeadRecord[]> {
  const { get, list } = await import("@vercel/blob");
  const paths: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "leads/", cursor, limit: 1000 });
    paths.push(...page.blobs.map((b) => b.pathname));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  const out: LeadRecord[] = [];
  const CONCURRENCY = 16;
  for (let i = 0; i < paths.length; i += CONCURRENCY) {
    const chunk = await Promise.all(
      paths.slice(i, i + CONCURRENCY).map(async (pathname) => {
        try {
          const res = await get(pathname, { access: "private", useCache: false });
          if (!res || res.statusCode !== 200) return null;
          const lead = JSON.parse(await new Response(res.stream).text()) as StoredLead;
          return { ...lead, id: pathname, createdAt: new Date(lead.createdAt) } satisfies LeadRecord;
        } catch (err) {
          console.error("[blobList] falha ao ler", pathname, err);
          return null;
        }
      }),
    );
    for (const l of chunk) if (l) out.push(l);
  }
  return out;
}
