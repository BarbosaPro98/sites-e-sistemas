"use client";

import { useCallback, useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { createLead } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { site } from "@/config/site";
import { AUTORIZACAO_WHATSAPP, INTERESSE_MEDICINA, TRATAMENTOS } from "@/lib/lead-options";
import { leadSchema, type LeadFieldErrors, type LeadInput } from "@/lib/lead-schema";
import { maskPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

const FIELD_ORDER: (keyof LeadInput)[] = ["nome", "whatsapp", "tratamentos", "autorizaWhatsapp", "interesseMedicina"];

export function LeadForm() {
  const router = useRouter();
  useEffect(() => {
    router.prefetch("/clinica");
  }, [router]);
  const uid = useId();
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tratamentos, setTratamentos] = useState<string[]>([]);
  const [autorizaWhatsapp, setAutoriza] = useState<string>("");
  const [interesseMedicina, setMedicina] = useState<string>("");
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const empresaRef = useRef<HTMLInputElement>(null);
  const refs = useRef<Partial<Record<keyof LeadInput, HTMLElement | null>>>({});

  const id = (name: string) => `${uid}-${name}`;
  const goToClinic = useCallback(() => router.push("/clinica"), [router]);

  function clearError(field: keyof LeadInput) {
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  function focusFirstError(fieldErrors: LeadFieldErrors) {
    const first = FIELD_ORDER.find((f) => fieldErrors[f]);
    if (!first) return;
    const el = refs.current[first];
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusable = el?.matches("input,button") ? el : el?.querySelector<HTMLElement>("input,button");
    focusable?.focus({ preventScroll: true });
  }

  function toggleTratamento(value: string, checked: boolean) {
    setTratamentos((list) => (checked ? [...list, value] : list.filter((v) => v !== value)));
    clearError("tratamentos");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const payload: LeadInput = {
      nome,
      whatsapp,
      tratamentos: tratamentos as LeadInput["tratamentos"],
      autorizaWhatsapp: (autorizaWhatsapp || undefined) as LeadInput["autorizaWhatsapp"],
      interesseMedicina: interesseMedicina as LeadInput["interesseMedicina"],
    };

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const fe: LeadFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof LeadInput;
        if (!fe[key]) fe[key] = issue.message;
      }
      setErrors(fe);
      focusFirstError(fe);
      return;
    }

    startTransition(async () => {
      const result = await createLead({ ...payload, empresa: empresaRef.current?.value ?? "" }).catch(() => ({
        ok: false as const,
        message: "Sem conexão no momento. Tente enviar de novo em alguns segundos.",
      }));
      if (result.ok) {
        setDone(true);
        return;
      }
      if ("fieldErrors" in result && result.fieldErrors) {
        setErrors(result.fieldErrors);
        focusFirstError(result.fieldErrors);
      }
      setFormError(result.message);
    });
  }

  return (
    <>
    {done && <SuccessCard onGo={goToClinic} />}
    <form onSubmit={handleSubmit} noValidate className="space-y-8" aria-describedby={formError ? id("form-error") : undefined}>
      {/* Honeypot anti-spam */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("empresa")}>Empresa</label>
        <input ref={empresaRef} id={id("empresa")} name="empresa" tabIndex={-1} autoComplete="off" />
      </div>

      <Field number={1} required error={errors.nome} errorId={id("nome-error")}>
        <Label htmlFor={id("nome")}>Qual seu nome completo?</Label>
        <Input
          ref={(el) => {
            refs.current.nome = el;
          }}
          id={id("nome")}
          name="nome"
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          placeholder="Ex.: Maria Oliveira Santos"
          value={nome}
          maxLength={120}
          onChange={(e) => {
            setNome(e.target.value);
            clearError("nome");
          }}
          aria-required="true"
          aria-invalid={Boolean(errors.nome)}
          aria-describedby={errors.nome ? id("nome-error") : undefined}
        />
      </Field>

      <Field number={2} required error={errors.whatsapp} errorId={id("whatsapp-error")}>
        <Label htmlFor={id("whatsapp")}>Qual seu WhatsApp?</Label>
        <Input
          ref={(el) => {
            refs.current.whatsapp = el;
          }}
          id={id("whatsapp")}
          name="whatsapp"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          enterKeyHint="next"
          placeholder="(11) 91234-5678"
          value={whatsapp}
          onChange={(e) => {
            setWhatsapp(maskPhone(e.target.value));
            clearError("whatsapp");
          }}
          aria-required="true"
          aria-invalid={Boolean(errors.whatsapp)}
          aria-describedby={errors.whatsapp ? id("whatsapp-error") : undefined}
        />
      </Field>

      <Field number={3} required error={errors.tratamentos} errorId={id("tratamentos-error")}>
        <fieldset
          ref={(el) => {
            refs.current.tratamentos = el;
          }}
          aria-describedby={cn(id("tratamentos-hint"), errors.tratamentos && id("tratamentos-error"))}
          aria-invalid={Boolean(errors.tratamentos)}
        >
          <legend className="text-base font-semibold leading-snug">Quais tratamentos despertam seu interesse?</legend>
          <p id={id("tratamentos-hint")} className="mt-1 text-sm text-muted-foreground">
            Selecione quantas opções desejar.
          </p>
          <div className="mt-4 grid gap-2.5">
            {TRATAMENTOS.map((t) => {
              const checked = tratamentos.includes(t.value);
              return (
                <label
                  key={t.value}
                  className={cn(
                    "flex min-h-14 cursor-pointer items-center gap-3.5 rounded-2xl border bg-card px-4 py-3 text-[0.95rem] leading-snug transition-[border-color,background-color,box-shadow]",
                    checked
                      ? "border-primary bg-primary/[0.06] shadow-[inset_0_0_0_1px_var(--primary)]"
                      : "border-border hover:border-input",
                    errors.tratamentos && !checked && "border-destructive/50",
                  )}
                >
                  <Checkbox
                    name="tratamentos"
                    value={t.value}
                    checked={checked}
                    onCheckedChange={(v) => toggleTratamento(t.value, v === true)}
                  />
                  <span className={cn(checked && "font-semibold text-primary")}>{t.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </Field>

      <Field number={4} optional>
        <fieldset
          ref={(el) => {
            refs.current.autorizaWhatsapp = el;
          }}
        >
          <legend className="text-base font-semibold leading-snug">
            Você autoriza receber mensagens da Clínica Clive pelo WhatsApp, incluindo novidades, informações sobre
            tratamentos e ofertas especiais?
          </legend>
          <ChoiceGroup
            name="autorizaWhatsapp"
            options={AUTORIZACAO_WHATSAPP}
            value={autorizaWhatsapp}
            onChange={setAutoriza}
            className="mt-4 grid-cols-2"
          />
        </fieldset>
      </Field>

      <Field number={5} required error={errors.interesseMedicina} errorId={id("medicina-error")}>
        <fieldset
          ref={(el) => {
            refs.current.interesseMedicina = el;
          }}
          aria-describedby={errors.interesseMedicina ? id("medicina-error") : undefined}
          aria-invalid={Boolean(errors.interesseMedicina)}
        >
          <legend className="text-base font-semibold leading-snug">
            Você tem interesse em cursar Medicina ou conhece alguém que tenha?
          </legend>
          <ChoiceGroup
            name="interesseMedicina"
            options={INTERESSE_MEDICINA}
            value={interesseMedicina}
            invalid={Boolean(errors.interesseMedicina)}
            onChange={(v) => {
              setMedicina(v);
              clearError("interesseMedicina");
            }}
            className="mt-4"
          />
        </fieldset>
      </Field>

      <div className="space-y-3 pt-2">
        {formError && (
          <p id={id("form-error")} role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {formError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full text-base" disabled={pending || done}>
          {pending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" /> Enviando…
            </>
          ) : (
            <>
              Quero começar meu autocuidado <ArrowRight aria-hidden="true" />
            </>
          )}
        </Button>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Seus dados são usados apenas pela {site.name} para contato sobre os tratamentos de seu interesse.
        </p>
      </div>
    </form>
    </>
  );
}

function Field({
  number,
  required,
  optional,
  error,
  errorId,
  children,
}: {
  number: number;
  required?: boolean;
  optional?: boolean;
  error?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        <span className="font-display text-base not-italic tracking-normal text-accent">{String(number).padStart(2, "0")}</span>
        {required && <span>Obrigatório</span>}
        {optional && <span>Opcional</span>}
      </div>
      <div className="space-y-2.5">{children}</div>
      {error && (
        <p id={errorId} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function ChoiceGroup({
  name,
  options,
  value,
  onChange,
  invalid,
  className,
}: {
  name: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  className?: string;
}) {
  return (
    <RadioGroup name={name} value={value} onValueChange={onChange} className={className}>
      {options.map((o) => {
        const checked = value === o.value;
        return (
          <label
            key={o.value}
            className={cn(
              "flex min-h-14 cursor-pointer items-center gap-3.5 rounded-2xl border bg-card px-4 py-3 text-[0.95rem] leading-snug transition-[border-color,background-color,box-shadow]",
              checked ? "border-primary bg-primary/[0.06] shadow-[inset_0_0_0_1px_var(--primary)]" : "border-border hover:border-input",
              invalid && !checked && "border-destructive/50",
            )}
          >
            <RadioGroupItem value={o.value} />
            <span className={cn(checked && "font-semibold text-primary")}>{o.label}</span>
          </label>
        );
      })}
    </RadioGroup>
  );
}

function SuccessCard({ onGo }: { onGo: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
    const t = window.setTimeout(onGo, site.redirectDelayMs);
    return () => window.clearTimeout(t);
  }, [onGo]);

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-deep/60 p-4 backdrop-blur-sm duration-300">
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sucesso-titulo"
      aria-live="polite"
      className="animate-in fade-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-[2rem] bg-deep px-6 py-10 text-center text-primary-foreground shadow-2xl duration-500 grain"
    >
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/20 ring-1 ring-accent/40">
        <CheckCircle2 className="size-8 text-accent" aria-hidden="true" />
      </div>
      <h2 id="sucesso-titulo" ref={headingRef} tabIndex={-1} className="mt-6 font-display text-3xl leading-tight outline-none text-balance">
        Cadastro realizado com sucesso!
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-primary-foreground/85">
        Obrigado por participar. Aproveite sua experiência com a Clínica Clive!
      </p>
      <Button variant="accent" size="lg" className="mt-8 w-full text-base" onClick={onGo}>
        <Sparkles aria-hidden="true" /> Conhecer a Clínica Clive
      </Button>
      <div className="mt-5 h-1 overflow-hidden rounded-full bg-primary-foreground/15" aria-hidden="true">
        <div
          className="h-full origin-left bg-accent"
          style={{ animation: `clive-progress ${site.redirectDelayMs}ms linear forwards` }}
        />
      </div>
      <p className="mt-3 text-xs text-primary-foreground/70">Redirecionando automaticamente…</p>
      <style>{`@keyframes clive-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}`}</style>
    </div>
    </div>
  );
}
