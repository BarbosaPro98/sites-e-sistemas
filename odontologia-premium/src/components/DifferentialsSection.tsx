"use client";

import { motion } from "motion/react";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { Eyebrow, Headline, Pending } from "./ui";

type Shape = "sphere" | "ring" | "capsule" | "arch";

/** Small sculptural objects rendered with CSS shading (no extra WebGL scene). */
function Sculpt({ shape, delay }: { shape: Shape; delay: number }) {
  const float = {
    animate: { y: [0, -8, 0], rotate: [0, 3, 0] },
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const, delay },
  };
  const porcelain =
    "radial-gradient(circle at 32% 28%, #ffffff 0%, #f4eee4 32%, #d9ccb8 70%, #a8977d 100%)";
  const gold =
    "conic-gradient(from 210deg, #8c6f3e, #e0ccaa, #c5a46d, #f5ead6, #9b7b45, #c5a46d, #8c6f3e)";
  return (
    <motion.div {...float} className="relative h-28 w-28" aria-hidden>
      <div className="absolute inset-x-4 bottom-0 h-3 rounded-[50%] bg-primary-deep/15 blur-md" />
      {shape === "sphere" && (
        <div className="absolute inset-3 rounded-full shadow-[inset_-10px_-14px_24px_rgba(88,28,43,0.18)]" style={{ background: porcelain }} />
      )}
      {shape === "ring" && (
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: gold,
            WebkitMask: "radial-gradient(circle, transparent 54%, #000 56%)",
            mask: "radial-gradient(circle, transparent 54%, #000 56%)",
            transform: "rotateX(62deg)",
          }}
        />
      )}
      {shape === "ring" && (
        <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-[70%] rounded-full" style={{ background: porcelain }} />
      )}
      {shape === "capsule" && (
        <div className="absolute inset-x-8 inset-y-1 rotate-[24deg] rounded-full shadow-[inset_-8px_-10px_18px_rgba(88,28,43,0.2)]" style={{ background: porcelain }}>
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2" style={{ background: gold }} />
        </div>
      )}
      {shape === "arch" && (
        <div
          className="absolute inset-x-4 bottom-3 top-3 rounded-t-full"
          style={{
            background: gold,
            WebkitMask: "radial-gradient(ellipse 34% 62% at 50% 100%, transparent 98%, #000 100%)",
            mask: "radial-gradient(ellipse 34% 62% at 50% 100%, transparent 98%, #000 100%)",
          }}
        />
      )}
    </motion.div>
  );
}

export default function DifferentialsSection() {
  const c = content.differentials;
  return (
    <section className="relative bg-cream py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Eyebrow className="text-primary">{c.eyebrow}</Eyebrow>
            <Headline lines={c.lines} className="mt-8 text-[clamp(2.6rem,5.4vw,5.4rem)] text-primary-deep" />
          </div>
          {site.previewMode && <Pending label="Pilares sugeridos: confirmar com o profissional" className="text-muted" />}
        </div>

        <ul className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4">
          {c.items.map((it, i) => (
            <motion.li
              key={it.title}
              whileHover="hover"
              className="group relative px-0 pb-10 pt-10 sm:px-8 sm:first:pl-0 lg:border-l lg:border-ink/10 lg:first:border-l-0"
            >
              <span data-reveal="draw-x" aria-hidden className="absolute left-0 right-0 top-0 block h-px bg-ink/15 sm:left-8 sm:group-first:left-0" />
              <span className="eyebrow !text-[0.6rem] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <motion.div variants={{ hover: { scale: 1.06, rotate: -4 } }} transition={{ type: "spring", stiffness: 180, damping: 14 }} className="mt-8 w-fit">
                <Sculpt shape={it.shape as Shape} delay={i * 0.6} />
              </motion.div>
              <h3 data-reveal="fade" className="font-display mt-8 text-[2rem] leading-tight text-primary-deep">
                {it.title}
              </h3>
              <p data-reveal="fade" className="mt-4 max-w-xs leading-relaxed text-muted">
                {it.text}
              </p>
              <span aria-hidden className="mt-8 block h-px w-10 origin-left bg-accent transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-x-[2.4]" />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
