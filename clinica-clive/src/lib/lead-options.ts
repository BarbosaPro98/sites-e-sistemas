export const TRATAMENTOS = [
  { value: "ultraformer-mpt", label: "Ultraformer MPT – Rejuvenescimento facial" },
  { value: "preenchimento-botox", label: "Preenchimento facial e Botox" },
  { value: "flacidez", label: "Flacidez facial e corporal" },
  { value: "gordura-emagrecimento", label: "Gordura localizada e emagrecimento" },
  { value: "celulite-corporal", label: "Celulite e tratamentos corporais" },
  { value: "lipedema", label: "Tratamento para lipedema" },
  { value: "soroterapia", label: "Soroterapia e bem-estar" },
] as const;

export const AUTORIZACAO_WHATSAPP = [
  { value: "sim", label: "Sim, autorizo." },
  { value: "nao", label: "Não autorizo." },
] as const;

export const INTERESSE_MEDICINA = [
  { value: "tenho-interesse", label: "Sim, tenho interesse." },
  { value: "sem-interesse", label: "Não tenho interesse." },
  { value: "ja-curso", label: "Já curso Medicina." },
  { value: "conheco-alguem", label: "Conheço alguém que tem interesse em cursar Medicina." },
  { value: "quero-informacoes", label: "Gostaria de receber mais informações sobre o curso." },
] as const;

export type TratamentoValue = (typeof TRATAMENTOS)[number]["value"];
export type AutorizacaoValue = (typeof AUTORIZACAO_WHATSAPP)[number]["value"];
export type MedicinaValue = (typeof INTERESSE_MEDICINA)[number]["value"];

const toMap = <T extends readonly { value: string; label: string }[]>(list: T) =>
  Object.fromEntries(list.map((o) => [o.value, o.label])) as Record<string, string>;

export const TRATAMENTO_LABEL = toMap(TRATAMENTOS);
export const AUTORIZACAO_LABEL = toMap(AUTORIZACAO_WHATSAPP);
export const MEDICINA_LABEL = toMap(INTERESSE_MEDICINA);
