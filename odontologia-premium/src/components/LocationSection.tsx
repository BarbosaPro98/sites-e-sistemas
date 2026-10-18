"use client";

import { MapPin } from "lucide-react";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { mapsEmbed, mapsLink, whatsappLink } from "@/lib/links";
import { Eyebrow, Headline, HoverLine, MagneticLink, Pending, btn } from "./ui";

export default function LocationSection() {
  const c = content.location;
  const a = site.address;
  const embed = mapsEmbed();
  const link = mapsLink();
  const lines = a.city ? ["Esperamos por você", `em {${a.city}}.`] : c.lines;

  return (
    <section id="contato" className="bg-cream py-28 md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:grid-cols-12 md:px-10">
        <div className="flex flex-col md:col-span-5">
          <Eyebrow className="text-primary">{c.eyebrow}</Eyebrow>
          <Headline lines={lines} className="mt-8 text-[clamp(2.6rem,5vw,5rem)] text-primary-deep" />

          <dl className="mt-12 space-y-7">
            <div data-reveal="fade">
              <dt className="eyebrow !text-[0.6rem] text-muted">Endereço</dt>
              <dd className="mt-2 text-lg text-ink">
                {a.confirmed && a.street ? (
                  <>
                    {a.street}
                    {a.complement && <>, {a.complement}</>}
                    <br />
                    {[a.district, a.city && `${a.city} - ${a.state ?? ""}`, a.zip].filter(Boolean).join(" · ")}
                  </>
                ) : (
                  <Pending label="Endereço, complemento, cidade e UF" className="text-primary" />
                )}
              </dd>
            </div>
            <div data-reveal="fade">
              <dt className="eyebrow !text-[0.6rem] text-muted">Horários</dt>
              <dd className="mt-2 text-lg text-ink">
                {site.hours.length ? (
                  <ul>
                    {site.hours.map((h) => (
                      <li key={h.days}>
                        {h.days} <span className="text-muted">· {h.time}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Pending label="Horários de atendimento" className="text-primary" />
                )}
              </dd>
            </div>
          </dl>

          <div data-reveal="fade" className="mt-12 flex flex-wrap items-center gap-8">
            <MagneticLink href={whatsappLink("booking")} external className={btn.dark}>
              Agendar consulta
            </MagneticLink>
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className={`${btn.line} text-primary`}>
                Ver localização
                <HoverLine />
              </a>
            ) : (
              site.previewMode && (
                <span className={`${btn.line} cursor-not-allowed text-muted/70`} aria-disabled="true">
                  Ver localização (após confirmar endereço)
                </span>
              )
            )}
          </div>
        </div>

        <div className="md:col-span-7">
          <div data-reveal="clip" className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:h-full md:min-h-[520px]">
            {embed ? (
              <iframe
                title={`Mapa: ${site.clinic.name ?? site.professional.name ?? "consultório"}`}
                src={embed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[0.4] sepia-[0.15]"
              />
            ) : (
              <div className="photo-placeholder absolute inset-0 flex flex-col items-center justify-center gap-5" data-zoom>
                <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-40" aria-hidden preserveAspectRatio="none">
                  <path d="M0 210 C120 180 160 240 260 200 S360 120 400 140" stroke="#581c2b" strokeOpacity="0.35" fill="none" />
                  <path d="M80 0 L140 300 M0 90 L400 120 M300 0 L250 300" stroke="#581c2b" strokeOpacity="0.18" fill="none" />
                </svg>
                <MapPin className="relative text-primary" strokeWidth={1} size={36} aria-hidden />
                <Pending label="Mapa incorporado após confirmar o endereço" className="relative text-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
