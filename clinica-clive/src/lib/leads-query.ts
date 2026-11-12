import "server-only";
import { and, desc, like, or, sql, type SQL } from "drizzle-orm";
import { db, ensureSchema } from "@/db";
import { leads } from "@/db/schema";
import { TRATAMENTO_LABEL } from "./lead-options";
import { dayKey } from "./datetime";

export type LeadFilters = { tratamento?: string; q?: string };

export function normalizeFilters(params: Record<string, string | string[] | undefined>): LeadFilters {
  const pick = (k: string) => {
    const v = params[k];
    return (Array.isArray(v) ? v[0] : v)?.trim() || undefined;
  };
  const tratamento = pick("tratamento");
  return {
    tratamento: tratamento && TRATAMENTO_LABEL[tratamento] ? tratamento : undefined,
    q: pick("q")?.slice(0, 80),
  };
}

function whereFor({ tratamento, q }: LeadFilters) {
  const conds: SQL[] = [];
  if (tratamento) {
    conds.push(sql`exists (select 1 from json_each(${leads.tratamentos}) where json_each.value = ${tratamento})`);
  }
  if (q) {
    const digits = q.replace(/\D/g, "");
    const byName = like(leads.nome, `%${q}%`);
    conds.push(digits.length >= 3 ? (or(byName, like(leads.whatsapp, `%${digits}%`)) as SQL) : byName);
  }
  return conds.length ? and(...conds) : undefined;
}

export async function listLeads(filters: LeadFilters) {
  await ensureSchema();
  return db.select().from(leads).where(whereFor(filters)).orderBy(desc(leads.createdAt));
}

/** Total geral e quantidade de interessados por tratamento (sem filtros). */
export async function leadStats() {
  await ensureSchema();
  const all = await db.select({ tratamentos: leads.tratamentos, createdAt: leads.createdAt }).from(leads);
  const porTratamento: Record<string, number> = {};
  const today = dayKey(new Date());
  let hoje = 0;
  for (const l of all) {
    for (const t of l.tratamentos) porTratamento[t] = (porTratamento[t] ?? 0) + 1;
    if (dayKey(l.createdAt) === today) hoje++;
  }
  return { total: all.length, hoje, porTratamento };
}
