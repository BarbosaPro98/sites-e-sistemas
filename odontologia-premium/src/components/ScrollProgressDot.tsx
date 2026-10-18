"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Narrative dot.
 * Sections mark waypoints with `data-dot-anchor` (+ optional `data-dot-mode`):
 *   expand  -> grows with a halo near the 3D object
 *   halo    -> soft pulse
 *   handoff -> hides while a section-local dot takes over (pinned journey)
 *   end     -> final destination, turns into a luminous detail behind the CTA
 * A smooth path (vertical tangents, so y is monotonic) is built through the
 * waypoints in document space. The dot sits on that path at the height of the
 * reading line (55% of the viewport), so it follows real scroll in both
 * directions. A short gold trail is drawn behind it.
 * Desktop only; mobile gets a simplified progress rail.
 */

type Anchor = { x: number; y: number; mode: string };
type Sample = { l: number; x: number; y: number };

const READ_LINE = 0.55;

export default function ScrollProgressDot() {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const railDot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktopMq = window.matchMedia("(min-width: 768px)");
    let anchors: Anchor[] = [];
    let samples: Sample[] = [];
    let total = 0;
    let cur = -1;

    function measure() {
      const p = path.current;
      if (!p || !wrap.current || !svg.current) return;
      const sx = window.scrollX;
      const sy = window.scrollY;
      anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-dot-anchor]"))
        .filter((el) => el.getClientRects().length > 0)
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2 + sx, y: r.top + r.height / 2 + sy, mode: el.dataset.dotMode ?? "" };
        })
        .sort((a, b) => a.y - b.y);
      if (anchors.length < 2) return;

      let d = `M${anchors[0].x},${anchors[0].y}`;
      for (let i = 1; i < anchors.length; i++) {
        const a = anchors[i - 1];
        const b = anchors[i];
        if (a.mode === "handoff") {
          d += ` M${b.x},${b.y}`; // gap: a section-local dot carries the story here
        } else {
          const my = (a.y + b.y) / 2;
          d += ` C${a.x},${my} ${b.x},${my} ${b.x},${b.y}`;
        }
      }
      const h = anchors[anchors.length - 1].y + 40;
      wrap.current.style.height = `${h}px`;
      svg.current.setAttribute("viewBox", `0 0 ${document.documentElement.clientWidth} ${h}`);
      p.setAttribute("d", d);
      trail.current?.setAttribute("d", d);
      total = p.getTotalLength();
      const n = Math.min(3000, Math.max(400, Math.round(total / 6)));
      samples = [];
      for (let i = 0; i <= n; i++) {
        const l = (i / n) * total;
        const pt = p.getPointAtLength(l);
        samples.push({ l, x: pt.x, y: pt.y });
      }
      cur = -1;
    }

    /** Path length whose point sits at document height y (binary search). */
    function lengthAtY(y: number) {
      let lo = 0;
      let hi = samples.length - 1;
      if (y <= samples[0].y) return 0;
      if (y >= samples[hi].y) return total;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (samples[mid].y < y) lo = mid;
        else hi = mid;
      }
      const a = samples[lo];
      const b = samples[hi];
      const t = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
      return a.l + (b.l - a.l) * t;
    }

    function pointAt(l: number) {
      const i = Math.min(samples.length - 1, Math.max(0, Math.round((l / total) * (samples.length - 1))));
      return samples[i];
    }

    function proximity(y: number, mode: string, range: number) {
      let best = 0;
      for (const a of anchors) {
        if (a.mode !== mode) continue;
        best = Math.max(best, 1 - Math.min(1, Math.abs(y - a.y) / range));
      }
      return best;
    }

    function update() {
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (railDot.current) railDot.current.style.top = `${progress * 100}%`;

      if (!desktopMq.matches || samples.length < 2 || !dot.current) return;
      const target = lengthAtY(window.scrollY + vh * READ_LINE);
      cur = cur < 0 || reduce ? target : cur + (target - cur) * 0.14;
      const pt = pointAt(cur);
      dot.current.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;

      // Trail: a short stretch of path drawn behind the dot.
      const tail = vh * 0.5;
      trail.current?.setAttribute("stroke-dasharray", `${Math.min(tail, cur)} ${total + tail}`);
      trail.current?.setAttribute("stroke-dashoffset", `${-Math.max(0, cur - tail)}`);

      // Section behaviours.
      let hidden = 0;
      for (let i = 0; i < anchors.length - 1; i++) {
        if (anchors[i].mode === "handoff" && pt.y >= anchors[i].y - 2 && pt.y <= anchors[i + 1].y + 2) hidden = 1;
      }
      const fadeNear = Math.max(
        proximity(pt.y, "handoff", vh * 0.18),
        hidden,
      );
      const expand = proximity(pt.y, "expand", vh * 0.4);
      const pulse = proximity(pt.y, "halo", vh * 0.35);
      const end = Math.pow(1 - Math.min(1, (total - cur) / (vh * 0.35)), 2);

      dot.current.style.opacity = String((1 - fadeNear) * (1 - end * 0.95));
      if (trail.current) trail.current.style.opacity = String((1 - fadeNear) * (1 - end) * 0.55);
      const core = dot.current.firstElementChild as HTMLElement;
      core.style.transform = `scale(${1 + expand * 1.6 + end * 1.2})`;
      if (halo.current) {
        halo.current.style.opacity = String(Math.max(expand, pulse) * 0.9);
        halo.current.style.transform = `scale(${1 + expand * 3 + pulse * 2})`;
      }
      // The CTA renders the luminous detail behind its button from this value.
      document.documentElement.style.setProperty("--dot-end", end.toFixed(3));
    }

    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        measure();
        update();
      });
    };

    measure();
    gsap.ticker.add(update);
    ScrollTrigger.addEventListener("refresh", schedule);
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    document.fonts?.ready.then(schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    // Images loading late change layout.
    const imgs = Array.from(document.images).filter((i) => !i.complete);
    imgs.forEach((i) => i.addEventListener("load", schedule, { once: true }));

    return () => {
      gsap.ticker.remove(update);
      ScrollTrigger.removeEventListener("refresh", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      ro.disconnect();
      imgs.forEach((i) => i.removeEventListener("load", schedule));
    };
  }, []);

  return (
    <>
      {/* Desktop narrative path */}
      <div
        ref={wrap}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-30 hidden w-full overflow-hidden md:block"
      >
        <svg ref={svg} className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path ref={path} fill="none" stroke="transparent" />
          <path ref={trail} fill="none" stroke="#c5a46d" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <div ref={dot} className="absolute left-0 top-0 will-change-transform">
          <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(197,164,109,0.55)] transition-transform duration-300" />
          <div ref={halo} className="absolute -left-3 -top-3 h-6 w-6 rounded-full border border-accent/70 opacity-0" />
        </div>
      </div>

      {/* Mobile: simplified progress rail */}
      <div aria-hidden className="pointer-events-none fixed bottom-[18%] right-2 top-[18%] z-30 w-px bg-accent/20 md:hidden">
        <div ref={railDot} className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_2px_rgba(197,164,109,0.5)]" />
      </div>
    </>
  );
}
