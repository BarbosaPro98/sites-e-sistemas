import { z } from "zod";
import { AUTORIZACAO_WHATSAPP, INTERESSE_MEDICINA, TRATAMENTOS } from "./lead-options";
import { isValidBrMobile, onlyDigits } from "./phone";

const tratamentoValues = TRATAMENTOS.map((t) => t.value) as [string, ...string[]];
const autorizacaoValues = AUTORIZACAO_WHATSAPP.map((t) => t.value) as [string, ...string[]];
const medicinaValues = INTERESSE_MEDICINA.map((t) => t.value) as [string, ...string[]];

export const leadSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Informe seu nome completo.")
    .max(120, "O nome pode ter até 120 caracteres.")
    .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, "Informe nome e sobrenome."),
  whatsapp: z
    .string()
    .trim()
    .refine(isValidBrMobile, "Informe um WhatsApp válido no formato (XX) XXXXX-XXXX.")
    .transform(onlyDigits),
  tratamentos: z
    .array(z.enum(tratamentoValues))
    .min(1, "Selecione pelo menos um tratamento.")
    .transform((list) => Array.from(new Set(list))),
  autorizaWhatsapp: z.enum(autorizacaoValues).optional(),
  interesseMedicina: z.enum(medicinaValues, { error: "Escolha uma opção." }),
});

export type LeadInput = z.input<typeof leadSchema>;
export type LeadData = z.output<typeof leadSchema>;
export type LeadFieldErrors = Partial<Record<keyof LeadInput, string>>;
