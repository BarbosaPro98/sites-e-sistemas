"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { whatsappLink } from "@/lib/links";
import { HoverLine, MagneticLink, Pending, Rich, btn } from "./ui";

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const c = content.hero;
  const { name, profession } = site.professional;
  const { video, videoMobile, poster, photo } = site.hero;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from("[data-h='bg']", { autoAlpha: 0, scale: 1.12, duration: 2.4, ease: "power2.out" })
        .add(() => {
          videoRef.current?.play().catch(() => {});
        }, 0.3)
        .from("[data-h='eyebrow']", { autoAlpha: 0, y: 14, duration: 1.2 }, 0.5)
        .from("[data-h='title'] .line-inner", { yPercent: 115, rotate: 2, duration: 1.6, stagger: 0.13 }, 0.65)
        .fromTo(
          "[data-h='title'] [data-script]",
          { clipPath: "inset(-20% 100% -40% 0)", filter: "blur(8px)", y: 8 },
          { clipPath: "inset(-20% -10% -40% 0)", filter: "blur(0px)", y: 0, duration: 1.9, ease: "power2.inOut", clearProps: "clipPath,filter" },
          1.35,
        )
        .from("[data-h='sub']", { autoAlpha: 0, y: 26, duration: 1.3 }, 1.7)
        .from("[data-h='cta'] > *", { autoAlpha: 0, y: 22, duration: 1.1, stagger: 0.12 }, 1.9)
        .from("[data-h='cue']", { autoAlpha: 0, duration: 1 }, 2.3)
        .from("[data-h='meta']", { autoAlpha: 0, duration: 1.2 }, 2.3);

      // Discreet cinematic drift of the background while leaving the hero.
      gsap.to("[data-h='bg']", {
        yPercent: 12,
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="inicio"
      ref={root}
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-primary-deep text-cream"
    >
      {/* Background: real video > real photo > abstract composition */}
      <div data-h="bg" className="absolute inset-0" aria-hidden>
        {video ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster={poster ?? undefined}
          >
            {videoMobile && <source src={videoMobile} media="(max-width: 767px)" type="video/mp4" />}
            <source src={video} type="video/mp4" />
          </video>
        ) : photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <HeroAbstract />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(50,17,28,0.92)_0%,rgba(88,28,43,0.62)_55%,rgba(50,17,28,0.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary-deep to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pb-28 pt-36 md:px-10">
        <p data-h="eyebrow" className="eyebrow flex flex-wrap items-center gap-3 text-accent-soft">
          <span aria-hidden className="h-px w-10 bg-accent" />
          {name ? (
            <span>{name}</span>
          ) : (
            <Pending label="Nome do profissional" className="!tracking-normal text-accent-soft" />
          )}
          <span aria-hidden>—</span>
          <span>{profession}</span>
        </p>

        <h1
          data-h="title"
          className="font-display mt-8 max-w-[14ch] text-[clamp(3.1rem,9.2vw,9.5rem)] text-cream"
        >
          {c.lines.map((l, i) => (
            <span key={i} className="line-mask">
              <span className="line-inner">
                <Rich text={l} />
              </span>
            </span>
          ))}
        </h1>

        <p data-h="sub" className="mt-8 max-w-md text-base leading-relaxed text-cream/75 md:text-lg">
          {c.subtitle}
        </p>

        <div data-h="cta" className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <MagneticLink href={whatsappLink("booking")} external className={btn.gold}>
            {c.primaryCta}
            <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:rotate-45" />
          </MagneticLink>
          <a href="#sobre" className={`${btn.line} self-start text-cream sm:ml-4 sm:self-auto`}>
            {c.secondaryCta}
            <HoverLine className="bg-accent" />
          </a>
        </div>

        {site.emergency.offered === true && (
          <p data-h="sub" className="mt-8 flex items-center gap-3 text-sm text-cream/70">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            Atendimento de urgência
            {site.emergency.is24h ? " 24 horas" : site.emergency.availability ? ` · ${site.emergency.availability}` : ""}
          </p>
        )}
      </div>

      {/* Scroll cue: the narrative dot is born here */}
      <div data-h="cue" className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="eyebrow !text-[0.58rem] text-cream/60">Role</span>
        <span className="relative block h-14 w-px overflow-hidden bg-white/15">
          <span className="scroll-cue-line absolute inset-0 bg-accent" />
        </span>
        <span data-dot-anchor="hero" className="block h-2 w-2" aria-hidden />
      </div>

      {!video && !photo && site.previewMode && (
        <div data-h="meta" className="absolute bottom-8 right-5 z-10 hidden md:right-10 md:block">
          <Pending label="Vídeo ou foto real do profissional" className="text-cream/70" />
        </div>
      )}
    </section>
  );
}

/** Abstract luxury backdrop used until real footage is supplied. No fake imagery. */
function HeroAbstract() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_38%,#7a2a3d_0%,#4a1825_38%,#2a0e17_75%)]">
      <svg
        className="absolute right-[-18%] top-1/2 h-[140vmin] w-[140vmin] -translate-y-1/2 opacity-60 md:right-[-6%]"
        viewBox="0 0 800 800"
        fill="none"
      >
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E0CCAA" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#C5A46D" stopOpacity="0.25" />
            <stop offset="1" stopColor="#C5A46D" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <g style={{ transformOrigin: "400px 400px", animation: "spin 90s linear infinite" }}>
          <circle cx="400" cy="400" r="360" stroke="url(#gold)" strokeWidth="0.6" />
          <circle cx="400" cy="400" r="300" stroke="url(#gold)" strokeWidth="0.4" strokeDasharray="2 10" />
          <ellipse cx="400" cy="400" rx="240" ry="360" stroke="url(#gold)" strokeWidth="0.5" />
          <circle cx="760" cy="400" r="4" fill="#C5A46D" />
        </g>
        <circle cx="400" cy="400" r="180" stroke="#E0CCAA" strokeOpacity="0.25" strokeWidth="0.5" />
      </svg>
      <div className="absolute right-[18%] top-[30%] h-[40vmin] w-[40vmin] rounded-full bg-accent/10 blur-[90px]" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
