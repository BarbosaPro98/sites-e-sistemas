import "server-only";
import { TRATAMENTO_LABEL } from "./lead-options";
import { dayKey } from "./datetime";
import { fetchLeads, type LeadRecord } from "./lead-store";

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

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function applyFilters(all: LeadRecord[], { tratamento, q }: LeadFilters) {
  const term = q ? fold(q) : "";
  const digits = q ? q.replace(/\D/g, "") : "";
  return all.filter((l) => {
    if (tratamento && !l.tratamentos.includes(tratamento)) return false;
    if (term) {
      const byName = fold(l.nome).includes(term);
      const byPhone = digits.length >= 3 && l.whatsapp.includes(digits);
      if (!byName && !byPhone) return false;
    }
    return true;
  });
}

export async function listLeads(filters: LeadFilters) {
  return applyFilters(await fetchLeads(), filters);
}

/** Total geral, leads de hoje (fuso de São Paulo) e interessados por tratamento. */
export function leadStats(all: LeadRecord[]) {
  const today = dayKey(new Date());
  const porTratamento: Record<string, number> = {};
  let hoje = 0;
  for (const l of all) {
    for (const t of l.tratamentos) porTratamento[t] = (porTratamento[t] ?? 0) + 1;
    if (dayKey(l.createdAt) === today) hoje++;
  }
  return { total: all.length, hoje, porTratamento };
}
