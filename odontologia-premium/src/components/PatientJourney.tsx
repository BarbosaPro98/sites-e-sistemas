"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content } from "@/config/content";
import { Eyebrow, Headline } from "./ui";

/**
 * Pinned storytelling (desktop): the section holds while a horizontal
 * timeline fills and the narrative dot travels across the four steps.
 * Mobile: vertical timeline scrubbed by normal scroll, no pinning.
 */
export default function PatientJourney() {
  const c = content.journey;
  const pin = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pin.current;
    if (!el) return;
    const steps = gsap.utils.toArray<HTMLElement>("[data-step]", el);
    const fill = el.querySelectorAll<HTMLElement>("[data-fill]");
    const dots = el.querySelectorAll<HTMLElement>("[data-local-dot]");

    const setProgress = (p: number, axis: "x" | "y") => {
      fill.forEach((f) => (f.style.transform = axis === "x" ? `scaleX(${p})` : `scaleY(${p})`));
      dots.forEach((d) => {
        if (axis === "x") d.style.left = `${p * 100}%`;
        else d.style.top = `${p * 100}%`;
      });
      const active = Math.min(steps.length - 1, Math.floor(p * steps.length + 0.12));
      steps.forEach((s, i) => s.setAttribute("data-active", String(i <= active && p > 0.02)));
    };

    const mm = gsap.matchMedia();
    mm.add(
      {
        desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { desktop, mobile } = ctx.conditions as Record<string, boolean>;
        if (desktop) {
          ScrollTrigger.create({
            trigger: el,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: true,
            onUpdate: (self) => setProgress(self.progress, "x"),
          });
        } else if (mobile) {
          ScrollTrigger.create({
            trigger: el.querySelector("[data-track-v]"),
            start: "top 70%",
            end: "bottom 55%",
            scrub: true,
            onUpdate: (self) => setProgress(self.progress, "y"),
          });
        } else {
          setProgress(1, window.innerWidth >= 1024 ? "x" : "y");
        }
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section aria-labelledby="jornada-title" className="relative bg-cream">
      {/* Hand-off sentinels for the global narrative dot */}
      <div className="mx-auto max-w-[1440px] px-5 md:px-10" aria-hidden>
        <span data-dot-anchor="journey-in" data-dot-mode="handoff" className="block h-px w-px" />
      </div>

      <div ref={pin} className="flex min-h-[100svh] flex-col justify-center py-24 lg:py-0">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
          <Eyebrow className="text-primary">{c.eyebrow}</Eyebrow>
          <div id="jornada-title">
            <Headline lines={c.lines} className="mt-8 text-[clamp(2.6rem,5.4vw,5.4rem)] text-primary-deep" />
          </div>

          {/* Desktop: horizontal */}
          <div className="relative mt-20 hidden lg:block">
            <div className="relative h-px w-full bg-ink/12">
              <span data-fill className="absolute inset-0 block origin-left scale-x-0 bg-accent" />
              <span data-local-dot className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: "0%" }} aria-hidden>
                <span className="relative block h-2 w-2 rounded-full bg-accent shadow-[0_0_14px_3px_rgba(197,164,109,0.55)]" />
              </span>
            </div>
            <ol className="mt-12 grid grid-cols-4 gap-10">
              {c.steps.map((s, i) => (
                <li key={s.title} data-step data-active="false" className="group/step relative">
                  <span aria-hidden className="absolute -top-[3.25rem] left-0 block h-3 w-3 -translate-x-1/2 rounded-full border border-ink/25 bg-cream transition-colors duration-500 group-data-[active=true]/step:border-accent group-data-[active=true]/step:bg-accent" />
                  <span className="font-display text-6xl text-ink/15 transition-colors duration-700 group-data-[active=true]/step:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-4 text-3xl text-ink/40 transition-colors duration-700 group-data-[active=true]/step:text-primary-deep">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-xs leading-relaxed text-muted opacity-40 transition-opacity duration-700 group-data-[active=true]/step:opacity-100">
                    {s.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Mobile / tablet: vertical */}
          <div data-track-v className="relative mt-16 pl-10 lg:hidden">
            <div className="absolute bottom-2 left-[5px] top-2 w-px bg-ink/12">
              <span data-fill className="absolute inset-0 block origin-top scale-y-0 bg-accent" />
              <span data-local-dot className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: "0%" }} aria-hidden>
                <span className="block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_3px_rgba(197,164,109,0.55)]" />
              </span>
            </div>
            <ol className="space-y-12">
              {c.steps.map((s, i) => (
                <li key={s.title} data-step data-active="false" className="group/step">
                  <span className="font-display text-5xl text-ink/20 transition-colors duration-700 group-data-[active=true]/step:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-2 text-3xl text-primary-deep">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] px-5 md:px-10" aria-hidden>
        <span data-dot-anchor="journey-out" className="ml-auto block h-px w-px" />
      </div>
    </section>
  );
}
