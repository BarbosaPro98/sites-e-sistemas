import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  ClipboardList,
  Droplets,
  Footprints,
  HeartHandshake,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Timer,
  Waves,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { InstagramIcon, WhatsappIcon } from "@/components/brand/social-icons";
import { Button } from "@/components/ui/button";
import { contactUrl, hasWhatsapp, site } from "@/config/site";

export const metadata: Metadata = {
  title: "Estética avançada, saúde integrativa e performance",
  description:
    "Ultraformer MPT, tratamento para lipedema, soroterapia e protocolos corporais e faciais com avaliação personalizada na Clínica Clive.",
};

const ctaLabel = hasWhatsapp ? "Agendar pelo WhatsApp" : "Agendar pelo Instagram";

const destaques = [
  {
    icon: ScanFace,
    tag: "Rosto",
    title: "Ultraformer MPT",
    text: "Ultrassom microfocado de última geração para estímulo de colágeno, firmeza e contorno facial, sem cortes e com retorno rápido à rotina.",
  },
  {
    icon: Waves,
    tag: "Corpo",
    title: "Tratamento para lipedema",
    text: "Abordagem especializada e individualizada para quem convive com dor, inchaço e acúmulo de gordura nas pernas e braços.",
  },
  {
    icon: Droplets,
    tag: "Performance",
    title: "Soroterapia e bem-estar",
    text: "Protocolos endovenosos prescritos após avaliação, pensados para recuperação pós-treino, disposição e vitalidade.",
  },
];

const outros = [
  "Preenchimento facial e Botox",
  "Flacidez facial e corporal",
  "Gordura localizada e emagrecimento",
  "Celulite e tratamentos corporais",
];

const etapas = [
  {
    icon: ClipboardList,
    title: "Avaliação personalizada",
    text: "Escutamos seus objetivos, sua rotina de treinos e seu histórico para entender o que o seu corpo pede.",
  },
  {
    icon: Sparkles,
    title: "Protocolo sob medida",
    text: "Combinamos tecnologia e cuidado integrativo em um plano feito para você, com etapas claras.",
  },
  {
    icon: HeartHandshake,
    title: "Acompanhamento contínuo",
    text: "Ajustamos o plano a cada retorno. Autocuidado é constância, como um bom treino.",
  },
];

function CtaButtons({ invert = false }: { invert?: boolean }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg" variant={invert ? "accent" : "default"} className="text-base">
        <a href={contactUrl()} target="_blank" rel="noopener noreferrer">
          {hasWhatsapp ? <WhatsappIcon className="size-5" /> : <InstagramIcon className="size-5" />}
          {ctaLabel}
        </a>
      </Button>
      <Button
        asChild
        size="lg"
        variant="outline"
        className={invert ? "border-primary-foreground/30 text-base text-primary-foreground hover:bg-primary-foreground/10" : "text-base"}
      >
        <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
          <InstagramIcon className="size-5" />
          {site.instagramHandle}
        </a>
      </Button>
    </div>
  );
}

export default function ClinicaPage() {
  return (
    <div className="min-h-dvh bg-background">
      {/* Faixa do evento */}
      <a
        href="#beneficio"
        className="block bg-accent px-4 py-2.5 text-center text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
      >
        <Timer className="mr-1.5 inline size-4 align-[-3px]" aria-hidden="true" />
        Participante da {site.event}: você tem um benefício exclusivo. <span className="underline underline-offset-2">Ver agora</span>
      </a>

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3" aria-label="Principal">
          <Link href="/clinica" aria-label={`${site.name}, início`} className="rounded-lg">
            <Logo className="text-sm" />
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button asChild variant="ghost" size="icon" className="sm:hidden">
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Clínica Clive">
                <InstagramIcon className="size-5" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
                <InstagramIcon /> Instagram
              </a>
            </Button>
            <Button asChild size="sm">
              <a href={contactUrl()} target="_blank" rel="noopener noreferrer">
                Agendar avaliação
              </a>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-12 md:grid-cols-[1.15fr_0.85fr] md:items-center md:pb-24 md:pt-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Footprints className="size-3.5 text-accent" aria-hidden="true" />
                Depois da {site.event}
              </p>
              <h1 className="mt-6 font-display text-[2.75rem] leading-[1.02] text-balance text-primary sm:text-6xl lg:text-7xl">
                Você cruzou a linha de chegada. <em className="text-accent">Agora, cuide do corpo</em> que te levou até lá.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                A mesma disciplina que te fez correr hoje merece um cuidado à altura. Na {site.name}, estética avançada,
                saúde integrativa e medicina se unem para a sua autoestima e a sua performance seguirem em movimento.
              </p>
              <div className="mt-8">
                <CtaButtons />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">Avaliação individual, sem compromisso de fechar tratamento.</p>
            </div>

            {/* Composição visual: cartão de "resultado da prova" */}
            <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
              <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-accent/30 via-transparent to-primary/15 blur-2xl" />
              <div className="rotate-[-3deg] rounded-[2rem] bg-deep p-7 text-primary-foreground shadow-2xl grain">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-primary-foreground/60">
                  <span>{site.event}</span>
                  <span>Nº Você</span>
                </div>
                <p className="mt-10 font-display text-5xl leading-none">Próxima</p>
                <p className="font-display text-5xl italic leading-none text-accent">etapa:</p>
                <p className="mt-3 text-lg text-primary-foreground/85">autocuidado contínuo</p>
                <div className="mt-10 grid grid-cols-3 gap-3 border-t border-primary-foreground/15 pt-5 text-center text-xs">
                  <div>
                    <ScanFace className="mx-auto mb-1.5 size-5 text-accent" />
                    Rosto
                  </div>
                  <div>
                    <Waves className="mx-auto mb-1.5 size-5 text-accent" />
                    Corpo
                  </div>
                  <div>
                    <Droplets className="mx-auto mb-1.5 size-5 text-accent" />
                    Energia
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-4 rotate-[4deg] rounded-2xl border border-border bg-card px-4 py-3 shadow-lg">
                <p className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <ShieldCheck className="size-4 text-accent" /> Protocolos seguros
                </p>
                <p className="text-xs text-muted-foreground">Indicação após avaliação</p>
              </div>
            </div>
          </div>
        </section>

        {/* AUTORIDADE E TECNOLOGIA */}
        <section className="bg-card py-20 md:py-28" aria-labelledby="tecnologia-title">
          <div className="mx-auto max-w-6xl px-5">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Tecnologia e ciência</p>
              <h2 id="tecnologia-title" className="mt-3 font-display text-4xl leading-tight text-balance text-primary sm:text-5xl">
                Protocolos modernos, indicados com critério.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Cada tratamento começa com uma avaliação. Assim, a tecnologia certa entra no momento certo, com
                segurança e um plano que respeita o seu corpo.
              </p>
            </div>

            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {destaques.map(({ icon: Icon, tag, title, text }) => (
                <li
                  key={title}
                  className="group flex flex-col rounded-[1.75rem] border border-border bg-background p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{tag}</span>
                  </div>
                  <h3 className="mt-8 font-display text-3xl leading-tight text-primary">{title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <span className="mr-1 text-sm font-semibold text-foreground">Também cuidamos de:</span>
              {outros.map((o) => (
                <span key={o} className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
                  {o}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-20 md:py-28" aria-labelledby="metodo-title">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Como funciona</p>
            <h2 id="metodo-title" className="mt-3 max-w-2xl font-display text-4xl leading-tight text-balance text-primary sm:text-5xl">
              Um cuidado que acompanha o seu ritmo.
            </h2>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {etapas.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="relative border-t border-border pt-6">
                  <span className="font-display text-5xl text-accent/70">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Icon className="size-5 text-primary" aria-hidden="true" />
                    {title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PROVA SOCIAL E COMUNIDADE */}
        <section className="px-3 pb-20 sm:px-5 md:pb-28" aria-labelledby="comunidade-title">
          <div className="mx-auto grid max-w-6xl gap-10 overflow-hidden rounded-[2.5rem] bg-muted p-8 md:grid-cols-2 md:items-center md:p-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Comunidade Clive</p>
              <h2 id="comunidade-title" className="mt-3 font-display text-4xl leading-tight text-balance text-primary sm:text-5xl">
                Veja de perto quem cuida de você.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                No nosso Instagram você acompanha resultados reais de pacientes, os bastidores da clínica e os
                especialistas que conduzem cada protocolo. Siga e faça parte de quem escolheu se cuidar com
                constância.
              </p>
              <Button asChild size="lg" className="mt-8 text-base">
                <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon className="size-5" /> Seguir {site.instagramHandle}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
            </div>
            <a
              href={site.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-3 gap-2.5"
              aria-label="Abrir o Instagram da Clínica Clive"
            >
              {[
                ["Resultados", "bg-primary text-primary-foreground"],
                ["Bastidores", "bg-card text-primary"],
                ["Especialistas", "bg-accent text-accent-foreground"],
                ["Dicas", "bg-card text-primary"],
                ["Rotina", "bg-deep text-primary-foreground"],
                ["Bem-estar", "bg-card text-primary"],
              ].map(([label, cls], i) => (
                <span
                  key={label}
                  className={`flex aspect-square flex-col justify-end rounded-2xl p-3 text-xs font-semibold shadow-sm transition-transform duration-300 group-hover:scale-[1.02] ${cls} ${i % 2 ? "translate-y-4" : ""}`}
                >
                  <InstagramIcon className="mb-auto size-4 opacity-60" />
                  {label}
                </span>
              ))}
            </a>
          </div>
        </section>

        {/* ESCASSEZ E URGÊNCIA */}
        <section id="beneficio" className="scroll-mt-20 px-3 pb-20 sm:px-5 md:pb-28" aria-labelledby="beneficio-title">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-deep px-7 py-12 text-primary-foreground grain md:px-14 md:py-16">
            <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-accent-foreground">
                  <Timer className="size-3.5" aria-hidden="true" /> Exclusivo {site.event}
                </p>
                <h2 id="beneficio-title" className="mt-6 font-display text-4xl leading-tight text-balance sm:text-5xl">
                  Você se cadastrou no stand. <em className="text-accent">Seu benefício está garantido.</em>
                </h2>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-primary-foreground/85">{site.eventBenefit}</p>
                <p className="mt-3 text-sm text-primary-foreground/65">
                  Condição válida para os participantes cadastrados no evento e por tempo limitado. As vagas de
                  avaliação na agenda são limitadas, então garanta seu horário enquanto a energia da prova está em alta.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur">
                <CalendarCheck className="size-8 text-accent" aria-hidden="true" />
                <p className="mt-4 text-lg font-semibold">Agende agora sua avaliação personalizada</p>
                <p className="mt-1 text-sm text-primary-foreground/70">
                  Diga que veio da {site.event} para ativar o benefício.
                </p>
                <Button asChild size="lg" variant="accent" className="mt-6 w-full text-base">
                  <a href={contactUrl()} target="_blank" rel="noopener noreferrer">
                    {hasWhatsapp ? <WhatsappIcon className="size-5" /> : <InstagramIcon className="size-5" />}
                    Quero meu benefício
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 pb-28 sm:flex-row sm:items-center sm:justify-between sm:pb-10">
          <div>
            <Logo className="text-sm" />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Estética avançada, saúde integrativa e performance. Resultados variam de pessoa para pessoa e todo
              tratamento depende de avaliação.
            </p>
          </div>
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <InstagramIcon className="size-5" /> {site.instagramHandle}
          </a>
        </div>
      </footer>

      {/* CTA fixo no celular */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur sm:hidden">
        <Button asChild size="lg" className="w-full text-base">
          <a href={contactUrl()} target="_blank" rel="noopener noreferrer">
            {hasWhatsapp ? <WhatsappIcon className="size-5" /> : <InstagramIcon className="size-5" />}
            {ctaLabel}
          </a>
        </Button>
      </div>
    </div>
  );
}
