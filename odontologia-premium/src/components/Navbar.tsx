"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { nav } from "@/config/content";
import { site } from "@/config/site";
import { displayName, whatsappLink } from "@/lib/links";
import { MagneticLink, btn } from "./ui";

type LenisLike = { stop: () => void; start: () => void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

export function Wordmark({ light = true }: { light?: boolean }) {
  const name = displayName();
  if (site.clinic.logo)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={site.clinic.logo} alt={name ?? "Logotipo"} className="h-9 w-auto" />;
  return (
    <span className={`flex flex-col leading-none ${light ? "text-cream" : "text-ink"}`}>
      <span className="font-display text-[1.55rem] tracking-tight">{name ?? "Odontologia"}</span>
      <span className="eyebrow mt-1 !text-[0.55rem] !tracking-[0.38em] text-accent">
        {site.professional.profession}
      </span>
    </span>
  );
}

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  useEffect(() => {
    if (!open) return;
    lenis()?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis()?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={false}
        animate={{
          backgroundColor: scrolled ? "rgba(50,17,28,0.72)" : "rgba(50,17,28,0)",
          backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
          paddingTop: scrolled ? 14 : 26,
          paddingBottom: scrolled ? 14 : 26,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="border-b border-transparent data-[s=true]:border-white/10"
        data-s={scrolled}
      >
        <nav
          aria-label="Principal"
          className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10"
        >
          <a href="#inicio" aria-label="Início" className="shrink-0">
            <Wordmark />
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {nav.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  className="group relative py-1 text-[0.72rem] font-medium uppercase tracking-[0.24em] text-cream/80 transition-colors hover:text-cream"
                >
                  {n.label}
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-lux)] group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <MagneticLink
              href={whatsappLink("booking")}
              external
              className={`${btn.gold} hidden !px-5 !py-3 sm:inline-flex`}
            >
              Agendar
            </MagneticLink>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid h-11 w-11 place-items-center text-cream lg:hidden"
            >
              <Menu strokeWidth={1.25} />
            </button>
          </div>
        </nav>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="grain fixed inset-0 z-[60] flex flex-col bg-primary-deep px-6 pb-10 pt-6 text-cream"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between">
              <Wordmark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="grid h-11 w-11 place-items-center"
                autoFocus
              >
                <X strokeWidth={1.25} />
              </button>
            </div>
            <ul className="mt-16 flex flex-col gap-2">
              {nav.map((n, i) => (
                <motion.li
                  key={n.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-white/10 py-4 font-display text-5xl"
                  >
                    <span className="eyebrow !text-[0.6rem] text-accent">0{i + 1}</span>
                    {n.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto">
              <a href={whatsappLink("booking")} target="_blank" rel="noopener noreferrer" className={`${btn.gold} w-full`}>
                Agendar minha consulta
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

