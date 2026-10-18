import { site } from "@/config/site";

const enc = encodeURIComponent;

/** Link de WhatsApp com mensagem codificada. Sem número confirmado,
 *  usa o seletor de contatos do WhatsApp (somente para prévia). */
export function whatsappLink(kind: "booking" | "emergency" = "booking") {
  const text = enc(site.messages[kind]);
  const number = site.contact.whatsapp?.replace(/\D/g, "");
  return number ? `https://wa.me/${number}?text=${text}` : `https://wa.me/?text=${text}`;
}

export function instagramLink() {
  const u = site.contact.instagram?.replace(/^@/, "");
  return u ? `https://www.instagram.com/${u}/` : null;
}

export function phoneLink() {
  const p = site.contact.phone?.replace(/\D/g, "");
  return p ? `tel:+${p.startsWith("55") ? p : `55${p}`}` : null;
}

export function fullAddress() {
  const a = site.address;
  if (!a.confirmed || !a.street || !a.city) return null;
  return [a.street, a.complement, a.district, `${a.city} - ${a.state ?? ""}`, a.zip]
    .filter(Boolean)
    .join(", ");
}

export function mapsLink() {
  const addr = fullAddress();
  return addr ? `https://www.google.com/maps/search/?api=1&query=${enc(addr)}` : null;
}

export function mapsEmbed() {
  const addr = fullAddress();
  return addr ? `https://www.google.com/maps?q=${enc(addr)}&output=embed` : null;
}

export function displayName() {
  return site.professional.name ?? site.clinic.name;
}

export function cityLabel() {
  const { city, state } = site.address;
  return city ? `${city}${state ? ` ${state}` : ""}` : null;
}

/** Treatments visible on the page: confirmed ones, plus examples in preview. */
export function visibleTreatments() {
  return site.treatments.filter((t) => t.confirmed || site.previewMode);
}

/** Urgency section shows only when confirmed (or as a marked example in preview). */
export function showEmergency() {
  return site.emergency.offered === true || (site.previewMode && site.emergency.offered === null);
}
