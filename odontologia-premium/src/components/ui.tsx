"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { site } from "@/config/site";

/** Splits "{word}" markers into the calligraphic accent span. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\{[^}]+\})/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("{") ? (
          <span key={i} className="script" data-script>
            {p.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

type HeadingTag = "h1" | "h2" | "h3";

/** Serif headline revealed line by line on scroll (see MotionProvider). */
export function Headline({
  lines,
  as: Tag = "h2",
  className = "",
  reveal = true,
}: {
  lines: string[];
  as?: HeadingTag;
  className?: string;
  reveal?: boolean;
}) {
  return (
    <Tag className={`font-display ${className}`} data-reveal={reveal ? "lines" : undefined}>
      {lines.map((l, i) => (
        <span key={i} className="line-mask">
          <span className="line-inner">
            <Rich text={l} />
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-4 ${className}`} data-reveal="fade">
      <span aria-hidden className="h-px w-10 bg-current opacity-60" />
      {children}
    </p>
  );
}

/** Visible marker for unconfirmed data. Renders nothing outside preview mode. */
export function Pending({ label, className = "" }: { label: string; className?: string }) {
  if (!site.previewMode) return null;
  return (
    <span className={`pending-chip ${className}`}>
      <span aria-hidden>◇</span> {label}
    </span>
  );
}

/** Button with a discreet magnetic pull towards the pointer. */
export function MagneticLink({
  href,
  children,
  className = "",
  strength = 0.28,
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function onMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.97 }}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(rest as object)}
    >
      {children}
    </motion.a>
  );
}

/** Primary pill-less button styles (sharp, editorial). */
export const btn = {
  gold:
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden bg-accent px-7 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-primary-deep transition-colors duration-500 hover:bg-accent-soft",
  ghostLight:
    "group relative inline-flex items-center justify-center gap-3 border border-white/35 px-7 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-white transition-colors duration-500 hover:border-accent hover:text-accent-soft",
  dark:
    "group relative inline-flex items-center justify-center gap-3 bg-primary px-7 py-4 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-cream transition-colors duration-500 hover:bg-primary-deep",
  line:
    "group relative inline-flex items-center gap-3 pb-1 text-[0.78rem] font-semibold uppercase tracking-[0.2em]",
};

/** Underline that expands on hover (used inside .group). */
export function HoverLine({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`absolute bottom-0 left-0 h-px w-full origin-left scale-x-[0.35] bg-current transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-x-100 ${className}`}
    />
  );
}
