"use server";

import { and, eq, gte } from "drizzle-orm";
import { db, ensureSchema } from "@/db";
import { leads } from "@/db/schema";
import { leadSchema, type LeadFieldErrors, type LeadInput } from "@/lib/lead-schema";
import { site } from "@/config/site";

export type CreateLeadResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: LeadFieldErrors };

/** Janela para ignorar envios repetidos do mesmo WhatsApp (duplo toque, reenvio). */
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

export async function createLead(input: LeadInput & { empresa?: string }): Promise<CreateLeadResult> {
  // Honeypot: campo invisível que só robôs preenchem.
  if (input.empresa) return { ok: true };

  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: LeadFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LeadInput | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Revise os campos destacados.", fieldErrors };
  }

  const data = parsed.data;

  try {
    await ensureSchema();

    const recent = await db
      .select({ id: leads.id })
      .from(leads)
      .where(
        and(
          eq(leads.whatsapp, data.whatsapp),
          gte(leads.createdAt, new Date(Date.now() - DUPLICATE_WINDOW_MS)),
        ),
      )
      .limit(1);

    if (recent.length > 0) {
      await db
        .update(leads)
        .set({
          nome: data.nome,
          tratamentos: data.tratamentos,
          autorizaWhatsapp: data.autorizaWhatsapp ?? null,
          interesseMedicina: data.interesseMedicina,
        })
        .where(eq(leads.id, recent[0].id));
      return { ok: true };
    }

    await db.insert(leads).values({
      nome: data.nome,
      whatsapp: data.whatsapp,
      tratamentos: data.tratamentos,
      autorizaWhatsapp: data.autorizaWhatsapp ?? null,
      interesseMedicina: data.interesseMedicina,
      origem: site.leadSource,
      createdAt: new Date(),
    });

    return { ok: true };
  } catch (err) {
    console.error("[createLead] falha ao salvar lead", err);
    return {
      ok: false,
      message: "Não conseguimos salvar seu cadastro agora. Verifique sua conexão e tente novamente.",
    };
  }
}
