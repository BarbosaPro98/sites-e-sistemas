"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { whatsappLink } from "@/lib/links";
import { Eyebrow, Headline, MagneticLink, Pending, btn } from "./ui";

export default function AboutSection() {
  const c = content.about;
  const p = site.professional;
  const ring = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ring.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = gsap.to(ring.current, {
      rotate: 220,
      ease: "none",
      scrollTrigger: { trigger: ring.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    return () => {
      t.scrollTrigger?.kill();
      t.kill();
    };
  }, []);

  return (
    <section id="sobre" className="relative overflow-hidden bg-cream py-28 md:py-44">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-5 md:grid-cols-12 md:gap-10 md:px-10">
        {/* Photo */}
        <div className="relative md:col-span-6 lg:col-span-5">
          <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden">
            <div data-zoom className="absolute inset-[-8%]">
              <div data-parallax="6" className="h-full w-full">
                {p.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.photo}
                    alt={`Fotografia de ${p.name ?? "profissional"}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="photo-placeholder flex h-full w-full items-end p-[12%]">
                    <Pending label="Fotografia profissional" className="text-primary" />
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Offset frame */}
          <div aria-hidden className="pointer-events-none absolute -bottom-6 -right-6 hidden h-full w-full border border-accent/60 md:block" />
          <svg
            ref={ring}
            aria-hidden
            viewBox="0 0 200 200"
            className="absolute -right-10 -top-10 h-32 w-32 text-primary md:-right-16 md:h-40 md:w-40"
          >
            <defs>
              <path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
            </defs>
            <text fill="currentColor" fontSize="12.5" letterSpacing="4.2" className="uppercase" style={{ fontFamily: "var(--font-manrope)" }}>
              <textPath href="#circ">atenção · escuta · cuidado · detalhe ·</textPath>
            </text>
            <circle cx="100" cy="100" r="3" fill="#C5A46D" />
          </svg>
        </div>

        {/* Text, with the vertical line the narrative dot travels along */}
        <div className="relative md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7 md:pt-24">
          <div aria-hidden className="absolute -left-2 top-0 hidden h-full w-px md:-left-10 md:block">
            <span data-dot-anchor="about-top" className="absolute left-0 top-0 block h-px w-px" />
            <span data-reveal="draw-y" className="block h-full w-px bg-accent/50" />
            <span data-dot-anchor="about-bottom" className="absolute bottom-0 left-0 block h-px w-px" />
          </div>

          <Eyebrow className="text-primary">{c.eyebrow}</Eyebrow>
          <Headline lines={c.lines} className="mt-8 text-[clamp(2.6rem,5.4vw,5.4rem)] text-primary-deep" />
          <p data-reveal="fade" className="mt-10 max-w-lg text-lg leading-relaxed text-muted">
            {c.text}
          </p>
          {p.bio.map((b) => (
            <p key={b} data-reveal="fade" className="mt-5 max-w-lg leading-relaxed text-muted">
              {b}
            </p>
          ))}

          <dl data-reveal="fade" className="mt-12 grid max-w-lg grid-cols-2 gap-px border-y border-ink/10">
            <div className="py-5 pr-4">
              <dt className="eyebrow !text-[0.6rem] text-muted">Profissional</dt>
              <dd className="mt-2 font-display text-2xl text-primary-deep">
                {p.name ?? <Pending label="Nome" className="text-primary" />}
              </dd>
            </div>
            <div className="border-l border-ink/10 py-5 pl-6">
              <dt className="eyebrow !text-[0.6rem] text-muted">Registro</dt>
              <dd className="mt-2 font-display text-2xl text-primary-deep">
                {p.cro ?? <Pending label="CRO" className="text-primary" />}
              </dd>
            </div>
          </dl>
          {p.qualifications.length > 0 && (
            <ul className="mt-8 max-w-lg space-y-2 text-sm text-muted">
              {p.qualifications.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          )}

          <div data-reveal="fade" className="mt-12 flex flex-wrap items-center gap-8">
            <MagneticLink href={whatsappLink("booking")} external className={btn.dark}>
              {c.cta}
            </MagneticLink>
            {site.previewMode && !p.bio.length && (
              <Pending label="Formação e trajetória: somente dados confirmados" className="text-muted" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

