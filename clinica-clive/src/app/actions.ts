"use server";

import { saveLead } from "@/lib/lead-store";
import { leadSchema, type LeadFieldErrors, type LeadInput } from "@/lib/lead-schema";
import { site } from "@/config/site";

export type CreateLeadResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: LeadFieldErrors };

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

  try {
    await saveLead(parsed.data, site.leadSource);
    return { ok: true };
  } catch (err) {
    console.error("[createLead] falha ao salvar lead", err);
    return {
      ok: false,
      message: "Não conseguimos salvar seu cadastro agora. Verifique sua conexão e tente novamente.",
    };
  }
}
