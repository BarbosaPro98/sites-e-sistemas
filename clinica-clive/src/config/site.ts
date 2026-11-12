/**
 * Dados institucionais da Clínica Clive.
 * Itens marcados como PENDENTE precisam ser confirmados com a clínica
 * e configurados por variável de ambiente antes do evento.
 */
/** WhatsApp da clínica com DDI e DDD: (71) 98606-7207. Pode ser trocado por NEXT_PUBLIC_CLINIC_WHATSAPP. */
const whatsappNumber = (process.env.NEXT_PUBLIC_CLINIC_WHATSAPP || "5571986067207").replace(/\D/g, "");

export const site = {
  name: "Clínica Clive",
  event: "Corrida AMB",
  leadSource: "Corrida AMB",
  instagramHandle: "@clinicaclive",
  instagramUrl: "https://www.instagram.com/clinicaclive/",
  whatsappNumber,
  whatsappMessage:
    "Olá! Fiz meu cadastro no stand da Clínica Clive na Corrida AMB e gostaria de agendar minha avaliação personalizada.",
  /** PENDENTE: descrever o benefício real oferecido aos participantes (ex.: condição especial na avaliação). */
  eventBenefit:
    process.env.NEXT_PUBLIC_EVENT_BENEFIT ??
    "Condição exclusiva na sua avaliação personalizada para quem se cadastrou no stand da Corrida AMB.",
  /** Segundos até o redirecionamento após o cadastro. */
  redirectDelayMs: 2500,
};

/** Link de contato principal: WhatsApp quando configurado, senão o Instagram da clínica. */
export function contactUrl() {
  if (site.whatsappNumber) {
    return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`;
  }
  return site.instagramUrl;
}

export const hasWhatsapp = Boolean(site.whatsappNumber);
