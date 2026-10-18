import { site } from "@/config/site";
import { cityLabel, displayName, fullAddress, instagramLink } from "./links";

/** SEO strings built only from confirmed data, with neutral fallbacks. */
export function seoTitle() {
  const name = displayName();
  const city = cityLabel();
  const prof = site.professional.profession;
  if (name && city) return `${name} | ${prof} em ${city}`;
  if (name) return `${name} | ${prof}`;
  return `${prof} | Odontologia`;
}

export function seoDescription() {
  const name = displayName();
  const city = site.address.city;
  if (name && city)
    return `Conheça o atendimento odontológico de ${name} em ${city}. Agende sua consulta pelo WhatsApp.`;
  return "Odontologia com atenção aos detalhes, cuidado individualizado e dedicação ao seu sorriso. Agende sua consulta pelo WhatsApp.";
}

export function seoKeywords() {
  const { city, state } = site.address;
  if (!city) return [];
  const k = [
    `dentista em ${city}`,
    `consultório odontológico ${city}`,
    `cirurgião-dentista ${city}`,
    state ? `dentista em ${city} ${state}` : null,
    site.emergency.offered === true ? `urgência odontológica ${city}` : null,
  ];
  return k.filter(Boolean) as string[];
}

/** schema.org Dentist, emitted only when there is a confirmed name. */
export function structuredData() {
  const name = displayName();
  // No structured data for previews or fictional names: only confirmed data.
  if (!name || site.previewMode || site.clinic.nameIsFictional) return null;
  const a = site.address;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name,
  };
  if (site.seo.siteUrl) data.url = site.seo.siteUrl;
  if (site.contact.phone) data.telephone = site.contact.phone;
  if (fullAddress())
    data.address = {
      "@type": "PostalAddress",
      streetAddress: [a.street, a.complement].filter(Boolean).join(", "),
      addressLocality: a.city,
      addressRegion: a.state,
      postalCode: a.zip ?? undefined,
      addressCountry: "BR",
    };
  const insta = instagramLink();
  if (insta) data.sameAs = [insta];
  return data;
}
