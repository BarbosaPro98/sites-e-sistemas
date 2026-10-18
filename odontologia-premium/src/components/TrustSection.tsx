"use client";

import { ArrowUpRight } from "lucide-react";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { cityLabel, fullAddress, instagramLink } from "@/lib/links";
import { Eyebrow, Headline, Pending } from "./ui";

/** Only verifiable facts. Rows without confirmed data are hidden once published. */
export default function TrustSection() {
  const c = content.trust;
  const p = site.professional;
  const contacts = [site.contact.phone, site.contact.instagram && `@${site.contact.instagram}`]
    .filter(Boolean)
    .join(" · ");
  const rows: { label: string; value: string | null; pending: string; href?: string | null }[] = [
    { label: "Profissional", value: p.name, pending: "Nome completo" },
    { label: "Registro profissional", value: p.cro, pending: "Número do CRO" },
    { label: "Especialidade", value: p.specialty, pending: "Somente se registrada no CRO" },
    { label: "Endereço", value: fullAddress() ?? cityLabel(), pending: "Endereço confirmado" },
    { label: "Contatos oficiais", value: contacts || null, pending: "Telefone e Instagram", href: instagramLink() },
    { label: "Formação", value: p.qualifications.join(" · ") || null, pending: "Formação comprovada" },
    { label: "Avaliações públicas", value: site.reviewsUrl ? "Ver na fonte original" : null, pending: "Link da fonte original, se houver", href: site.reviewsUrl },
  ];
  const visible = rows.filter((r) => r.value || site.previewMode);
  if (!visible.length) return null;

  return (
    <section aria-label={c.eyebrow} className="bg-cream py-28 md:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <Eyebrow className="text-primary">{c.eyebrow}</Eyebrow>
          <Headline lines={c.lines} className="mt-8 text-[clamp(2.3rem,4vw,4rem)] text-primary-deep" />
        </div>
        <dl className="md:col-span-7 md:col-start-6">
          {visible.map((r) => (
            <div key={r.label} data-reveal="fade" className="grid grid-cols-1 gap-2 border-b border-ink/10 py-6 sm:grid-cols-[14rem_1fr] sm:items-baseline">
              <dt className="eyebrow !text-[0.62rem] text-muted">{r.label}</dt>
              <dd className="font-display text-2xl text-primary-deep">
                {r.value ? (
                  r.href ? (
                    <a href={r.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-primary">
                      {r.value} <ArrowUpRight size={16} strokeWidth={1.25} />
                    </a>
                  ) : (
                    r.value
                  )
                ) : (
                  <Pending label={r.pending} className="text-primary" />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
