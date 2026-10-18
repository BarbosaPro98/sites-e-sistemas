"use client";

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global motion system:
 * - Lenis smooth scroll wired into the GSAP ticker / ScrollTrigger (no hijacking).
 * - Declarative scroll reveals through data attributes, so every section
 *   shares the same easing and timing:
 *     data-reveal="lines"  serif headline, line by line (+ calligraphic word)
 *     data-reveal="fade"   fade + translateY
 *     data-reveal="draw-x" | "draw-y"  decorative line drawn with scroll
 *     data-reveal="clip"   clip-path image reveal, child [data-zoom] zooms out
 *     data-parallax="12"   subtle parallax (yPercent)
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -10 } });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    const ctx = gsap.context(() => {
      if (reduce) return;
      const ease = "expo.out";

      gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
        const lines = el.querySelectorAll(".line-inner");
        const scripts = el.querySelectorAll("[data-script]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        tl.from(lines, { yPercent: 115, rotate: 1.5, duration: 1.4, ease, stagger: 0.12 });
        if (scripts.length)
          tl.fromTo(
            scripts,
            { clipPath: "inset(-20% 100% -40% 0)", filter: "blur(6px)" },
            { clipPath: "inset(-20% -10% -40% 0)", filter: "blur(0px)", duration: 1.6, ease: "power2.inOut", clearProps: "clipPath,filter" },
            "-=0.9",
          );
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 28,
          duration: 1.2,
          ease,
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="draw-x"]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 55%", scrub: 0.6 },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="draw-y"]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 60%", scrub: 0.6 },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
        const zoom = el.querySelector("[data-zoom]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        tl.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
        );
        if (zoom) tl.from(zoom, { scale: 1.3, duration: 2.2, ease }, 0);
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amt = Number(el.dataset.parallax || 10);
        gsap.fromTo(
          el,
          { yPercent: -amt },
          {
            yPercent: amt,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });

    // Layout can shift once fonts and images load.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
