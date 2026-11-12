export const TIMEZONE = "America/Sao_Paulo";

const dateTimeFmt = new Intl.DateTimeFormat("pt-BR", {
  timeZone: TIMEZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const dayKeyFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE });

export function formatDateTime(d: Date) {
  return dateTimeFmt.format(d).replace(",", "");
}

/** Chave AAAA-MM-DD no fuso de São Paulo, para contar leads do dia. */
export function dayKey(d: Date) {
  return dayKeyFmt.format(d);
}
