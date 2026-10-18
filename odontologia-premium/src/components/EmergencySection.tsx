"use client";

import { ArrowUpRight } from "lucide-react";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { showEmergency, whatsappLink } from "@/lib/links";
import { Eyebrow, Headline, MagneticLink, Pending, btn } from "./ui";

export default function EmergencySection() {
  if (!showEmergency()) return null;
  const c = content.emergency;
  const e = site.emergency;
  return (
    <section aria-label={c.eyebrow} className="grain relative overflow-hidden bg-ink-deep py-28 text-cream md:py-40">
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-7">
          <Eyebrow className="text-accent">{c.eyebrow}</Eyebrow>
          <Headline lines={c.lines} className="mt-8 text-[clamp(2.5rem,5vw,5rem)]" />
          <p data-reveal="fade" className="mt-8 max-w-lg text-lg leading-relaxed text-cream/70">
            {c.text}
          </p>
          {e.offered === true && (e.availability || e.is24h) && (
            <p data-reveal="fade" className="mt-6 text-sm uppercase tracking-[0.2em] text-accent-soft">
              {e.is24h ? "Atendimento 24 horas" : e.availability}
            </p>
          )}
          {e.offered === null && (
            <Pending label="Seção publicada apenas se a urgência for confirmada, com horário real" className="mt-6 text-accent-soft" />
          )}
          <div data-reveal="fade" className="mt-12">
            <MagneticLink href={whatsappLink("emergency")} external className={btn.gold}>
              {c.cta}
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </MagneticLink>
          </div>
        </div>

        {/* Elegant circular emblem */}
        <div className="relative mx-auto aspect-square w-[min(78vw,380px)] md:col-span-4 md:col-start-9" aria-hidden>
          <svg viewBox="0 0 300 300" className="h-full w-full">
            <defs>
              <path id="em-c" d="M150,150 m-118,0 a118,118 0 1,1 236,0 a118,118 0 1,1 -236,0" />
            </defs>
            <circle cx="150" cy="150" r="146" fill="none" stroke="#c5a46d" strokeOpacity="0.35" strokeWidth="0.6" />
            <circle cx="150" cy="150" r="96" fill="none" stroke="#c5a46d" strokeOpacity="0.6" strokeWidth="0.6" />
            <g style={{ transformOrigin: "150px 150px", animation: "em-spin 40s linear infinite" }}>
              <text fill="#e0ccaa" fontSize="11" letterSpacing="6" style={{ fontFamily: "var(--font-manrope)", textTransform: "uppercase" }}>
                <textPath href="#em-c">orientação · disponibilidade · cuidado · orientação · disponibilidade ·</textPath>
              </text>
            </g>
            <path d="M150 122v56M122 150h56" stroke="#c5a46d" strokeWidth="1" />
          </svg>
          <span data-dot-anchor="emergency" data-dot-mode="halo" className="absolute left-1/2 top-1/2 block h-px w-px" />
          <style>{`@keyframes em-spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    </section>
  );
}
