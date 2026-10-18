"use client";

import { ArrowUpRight } from "lucide-react";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { whatsappLink } from "@/lib/links";
import { Headline, HoverLine, MagneticLink } from "./ui";

export default function FinalCTA() {
  const c = content.finalCta;
  return (
    <section aria-label="Agendamento" className="grain relative overflow-hidden bg-primary-deep py-32 text-center text-cream md:py-48">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_70%,rgba(197,164,109,0.18),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <Headline lines={c.lines} className="mx-auto max-w-6xl text-[clamp(2.3rem,5vw,5.4rem)]" />
        <p data-reveal="fade" className="mx-auto mt-8 max-w-md text-lg text-cream/70">
          {c.subtitle}
        </p>

        <div className="relative mt-16 inline-block">
          {/* Destination of the narrative dot: it lands here and becomes light */}
          <span data-dot-anchor="end" data-dot-mode="end" className="absolute left-1/2 top-1/2 block h-px w-px" aria-hidden />
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              opacity: "var(--dot-end, 0)",
              transform: "translate(-50%, -50%) scale(calc(0.3 + var(--dot-end, 0) * 0.9))",
              background: "radial-gradient(circle, rgba(224,204,170,0.5) 0%, rgba(197,164,109,0.2) 38%, transparent 70%)",
            }}
          />
          <MagneticLink
            href={whatsappLink("booking")}
            external
            strength={0.4}
            className="group relative z-10 inline-flex items-center gap-4 bg-accent px-10 py-6 text-sm font-semibold uppercase tracking-[0.24em] text-primary-deep transition-colors duration-500 hover:bg-accent-soft md:px-14 md:py-7"
          >
            {c.cta}
            <ArrowUpRight size={18} strokeWidth={1.5} className="transition-transform duration-500 group-hover:rotate-45" />
          </MagneticLink>
        </div>

        {site.emergency.offered === true && (
          <p className="mt-10">
            <a href={whatsappLink("emergency")} target="_blank" rel="noopener noreferrer" className="group relative inline-flex pb-1 text-sm uppercase tracking-[0.2em] text-accent-soft">
              Atendimento de urgência
              <HoverLine />
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
