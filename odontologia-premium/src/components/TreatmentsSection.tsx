"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Plus } from "lucide-react";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { visibleTreatments, whatsappLink } from "@/lib/links";
import type { SceneState } from "./DentalThreeScene";
import { Eyebrow, Headline, MagneticLink, Pending, btn } from "./ui";

const DentalThreeScene = dynamic(() => import("./DentalThreeScene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function TreatmentsSection() {
  const c = content.treatments;
  const items = visibleTreatments();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sceneState = useRef<SceneState>({ scroll: 0, kick: 0 });
  const [selected, setSelected] = useState(0);
  const [mount3D, setMount3D] = useState(false);
  const [inView, setInView] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [lowPower, setLowPower] = useState(false);

  // Lazy-load WebGL only when the section approaches, pause it when away.
  useEffect(() => {
    setWebgl(hasWebGL());
    setLowPower(
      window.matchMedia("(max-width: 767px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4,
    );
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setMount3D(true);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll-synced perspective.
  useEffect(() => {
    if (!section.current) return;
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => (sceneState.current.scroll = self.progress),
    });
    return () => st.kill();
  }, []);

  function select(i: number) {
    if (i === selected) return;
    sceneState.current.kick += (i > selected ? 1 : -1) * 0.7;
    setSelected(i);
  }

  return (
    <section
      id="tratamentos"
      ref={section}
      className="grain relative overflow-hidden bg-[linear-gradient(180deg,var(--c-primary)_0%,var(--c-primary-deep)_100%)] py-28 text-cream md:py-40"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow className="text-accent">{c.eyebrow}</Eyebrow>
            <Headline lines={c.lines} className="mt-8 text-[clamp(2.6rem,5.6vw,5.8rem)]" />
          </div>
          <p data-reveal="fade" className="self-end text-lg leading-relaxed text-cream/70 md:col-span-4 md:col-start-9">
            {c.subtitle}
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
          {/* 3D stage */}
          <div className="relative md:col-span-6">
            <div ref={stage} className="relative aspect-square w-full md:sticky md:top-[12vh] md:aspect-auto md:h-[76vh]">
              <div aria-hidden className="absolute inset-[12%] rounded-full bg-accent/10 blur-[80px]" />
              {webgl === false ? (
                <ToothFallback />
              ) : (
                mount3D && <DentalThreeScene state={sceneState} active={inView} lowPower={lowPower} />
              )}
              <span data-dot-anchor="treatments" data-dot-mode="expand" className="absolute left-[78%] top-[42%] block h-px w-px" aria-hidden />
            </div>
          </div>

          {/* Editorial numbered list */}
          <div className="md:col-span-6 md:pt-[8vh]">
            {site.previewMode && items.some((t) => !t.confirmed) && (
              <Pending label="Exemplos ilustrativos: substituir pelos tratamentos confirmados" className="mb-8 text-accent-soft" />
            )}

            {items.length === 0 ? (
              <p className="max-w-md text-lg leading-relaxed text-cream/75">
                A indicação de cada cuidado depende de uma avaliação odontológica individualizada.
              </p>
            ) : (
              <ol className="border-t border-white/12">
                {items.map((t, i) => {
                  const open = i === selected;
                  return (
                    <li key={t.name} className="border-b border-white/12">
                      <h3>
                        <button
                          type="button"
                          aria-expanded={open}
                          aria-controls={`trat-${i}`}
                          onClick={() => select(i)}
                          onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
                          className="group flex w-full items-baseline gap-6 py-7 text-left"
                        >
                          <span className={`eyebrow !text-[0.62rem] transition-colors duration-500 ${open ? "text-accent" : "text-cream/40"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`font-display flex-1 text-[clamp(1.9rem,3.2vw,3rem)] transition-[color,transform] duration-700 ease-[var(--ease-lux)] ${
                              open ? "translate-x-2 text-accent-soft" : "text-cream/75 group-hover:text-cream"
                            }`}
                          >
                            {t.name}
                          </span>
                          <Plus
                            aria-hidden
                            size={18}
                            strokeWidth={1.25}
                            className={`shrink-0 transition-transform duration-500 ${open ? "rotate-45 text-accent" : "text-cream/50"}`}
                          />
                        </button>
                      </h3>
                      <span
                        aria-hidden
                        className={`-mt-px block h-px origin-left bg-accent transition-transform duration-[900ms] ease-[var(--ease-lux)] ${open ? "scale-x-100" : "scale-x-0"}`}
                      />
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            id={`trat-${i}`}
                            role="region"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-6 pb-8 pl-[3.1rem] pt-5 sm:flex-row sm:items-end sm:justify-between">
                              {t.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={t.image} alt={t.name} className="h-28 w-40 object-cover" loading="lazy" />
                              )}
                              <p className="max-w-sm leading-relaxed text-cream/70">{t.description}</p>
                              <a
                                href={whatsappLink("booking")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent hover:text-accent-soft"
                              >
                                Agendar <ArrowUpRight size={14} strokeWidth={1.5} />
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ol>
            )}

            <div data-reveal="fade" className="mt-14">
              <MagneticLink href={whatsappLink("booking")} external className={btn.gold}>
                Agendar uma avaliação
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Static fallback when WebGL is unavailable. */
function ToothFallback() {
  return (
    <svg viewBox="0 0 200 240" className="absolute inset-0 m-auto h-3/4 w-3/4" aria-hidden>
      <defs>
        <radialGradient id="porc" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#efe7da" />
          <stop offset="1" stopColor="#bfae95" />
        </radialGradient>
      </defs>
      <path
        d="M40 70c0-34 22-46 40-40 12 4 28 4 40 0 18-6 40 6 40 40 0 22-8 36-14 52-6 18-6 56-20 84-6 12-16 8-18-6-4-26-6-46-18-46s-14 20-18 46c-2 14-12 18-18 6-14-28-14-66-20-84-6-16-14-30-14-52z"
        fill="url(#porc)"
      />
      <ellipse cx="100" cy="120" rx="92" ry="22" fill="none" stroke="#c5a46d" strokeWidth="0.8" transform="rotate(-12 100 120)" />
    </svg>
  );
}
