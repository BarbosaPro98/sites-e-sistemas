import type { Metadata } from "next";
import { HeartPulse, Timer } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LeadForm } from "@/components/cadastro/lead-form";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Cadastro Corrida AMB",
  description: "Cadastre-se no stand da Clínica Clive na Corrida AMB.",
};

export default function CadastroPage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="relative overflow-hidden bg-deep pb-24 text-primary-foreground grain">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4 px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <Logo tone="light" className="text-base" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent">
            <Timer className="size-3.5" aria-hidden="true" />
            {site.event}
          </span>
        </div>

        <div className="mx-auto max-w-xl px-5 pt-10">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/70">
            <HeartPulse className="size-4 text-accent" aria-hidden="true" />
            Stand {site.name}
          </p>
          <h1 className="mt-4 font-display text-[2.6rem] leading-[1.02] text-balance sm:text-5xl">
            Sua experiência de <em className="text-accent">autocuidado</em> começa aqui!
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-primary-foreground/80">
            Leva menos de um minuto. Conte o que você procura e nossa equipe prepara um atendimento pensado para você.
          </p>
        </div>

        {/* Linha de chegada decorativa */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 bottom-10 h-40 w-72 text-accent/25"
          viewBox="0 0 300 160"
          fill="none"
        >
          <path d="M0 140 C 80 140, 120 30, 300 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 8" />
          <path d="M0 155 C 90 150, 140 60, 300 50" stroke="currentColor" strokeWidth="1" />
        </svg>
      </header>

      <main className="relative z-10 mx-auto -mt-16 max-w-xl px-3 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-5">
        <div className="rounded-[2rem] border border-border bg-card/95 px-5 py-8 shadow-[0_24px_60px_-30px_rgb(18_48_42/0.45)] backdrop-blur sm:px-8">
          <LeadForm />
        </div>
      </main>
    </div>
  );
}
