"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { content } from "@/config/content";
import { site } from "@/config/site";
import { fullAddress } from "@/lib/links";
import { Eyebrow, Headline, Pending } from "./ui";

type QA = { q: string; a: ReactNode | null };

function buildFaq(): QA[] {
  const addr = fullAddress();
  const hours = site.hours.map((h) => `${h.days}: ${h.time}`).join(" · ");
  const e = site.emergency;
  const pending = (label: string) => (site.previewMode ? <Pending label={label} className="text-primary" /> : null);
  return [
    {
      q: "Como posso agendar uma consulta?",
      a: "Você pode entrar em contato diretamente pelos canais oficiais do consultório, inclusive pelo WhatsApp nesta página.",
    },
    { q: "Onde fica o consultório?", a: addr ?? pending("Endereço confirmado") },
    { q: "Qual é o horário de atendimento?", a: hours || pending("Horários reais de atendimento") },
    {
      q: "Existe atendimento de urgência?",
      a:
        e.offered === true
          ? `Sim. ${e.is24h ? "Atendimento 24 horas." : e.availability ?? "Entre em contato para saber a disponibilidade."}`
          : e.offered === false
            ? null
            : pending("Confirmar se há atendimento de urgência"),
    },
    {
      q: "Como posso saber quais tratamentos são indicados para mim?",
      a: "A indicação depende de uma avaliação odontológica individualizada.",
    },
  ].filter((x) => x.a !== null);
}

function Item({ qa, open, onToggle }: { qa: QA; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <div className="border-b border-ink/12">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-7 text-left"
        >
          <span className={`font-display text-[clamp(1.5rem,2.4vw,2.2rem)] leading-tight transition-colors duration-500 ${open ? "text-primary" : "text-primary-deep group-hover:text-primary"}`}>
            {qa.q}
          </span>
          <span aria-hidden className="relative grid h-10 w-10 shrink-0 place-items-center border border-ink/15 transition-colors duration-500 group-hover:border-accent">
            <span className="absolute h-px w-3.5 bg-primary" />
            <motion.span animate={{ rotate: open ? 90 : 0, opacity: open ? 0 : 1 }} transition={{ duration: 0.35 }} className="absolute h-3.5 w-px bg-primary" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="max-w-2xl pb-8 text-lg leading-relaxed text-muted">{qa.a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const c = content.faq;
  const faq = buildFaq();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-label={c.eyebrow} className="bg-cream-2 py-28 md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <Eyebrow className="text-primary">{c.eyebrow}</Eyebrow>
          <Headline lines={c.lines} className="mt-8 text-[clamp(2.4rem,4.4vw,4.4rem)] text-primary-deep" />
        </div>
        <div className="border-t border-ink/12 md:col-span-7 md:col-start-6">
          {faq.map((qa, i) => (
            <Item key={qa.q} qa={qa} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}
