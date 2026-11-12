import { cn } from "@/lib/utils";

/**
 * Marca tipográfica provisória da Clínica Clive.
 * PENDENTE: substituir pelo arquivo oficial do logo (public/logo.svg) quando a clínica enviar.
 */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-2 leading-none",
        tone === "light" ? "text-primary-foreground" : "text-primary",
        className,
      )}
    >
      <span className="font-display text-[1.9em] italic tracking-tight">Clive</span>
      <span className="text-[0.62em] font-semibold uppercase tracking-[0.32em] opacity-80">Clínica</span>
    </span>
  );
}
