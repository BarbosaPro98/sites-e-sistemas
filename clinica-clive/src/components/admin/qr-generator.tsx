"use client";

import { useId, useMemo, useRef, useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { AlertTriangle, Check, Download, ExternalLink, FileCode2, ShieldCheck, Smartphone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const PRESETS = [
  { id: "verde", name: "Verde Clive", fg: "#1f4a40", bg: "#fbf8f2" },
  { id: "preto", name: "Preto clássico", fg: "#111111", bg: "#ffffff" },
  { id: "dourado", name: "Dourado escuro", fg: "#5e4423", bg: "#fbf8f2" },
  { id: "oliva", name: "Verde-oliva", fg: "#3b4520", bg: "#ffffff" },
] as const;

const EXPORT_SIZE = 1024;
const MARGIN_MODULES = 4; // zona de silêncio recomendada pela norma do QR Code
const PLACARD_TITLE = "Escaneie e comece sua experiência de autocuidado";

function luminance(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function contrastRatio(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

function parseUrl(value: string) {
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:" ? u : null;
  } catch {
    return null;
  }
}

function download(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function QrGenerator({ defaultUrl }: { defaultUrl: string }) {
  const uid = useId();
  const [url, setUrl] = useState(defaultUrl);
  const [fg, setFg] = useState<string>(PRESETS[0].fg);
  const [bg, setBg] = useState<string>(PRESETS[0].bg);
  const [saved, setSaved] = useState<"png" | "svg" | null>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const svgWrap = useRef<HTMLDivElement>(null);

  const parsed = parseUrl(url);
  const value = parsed?.toString() ?? defaultUrl;
  const isLocal = parsed ? /^(localhost|127\.|0\.0\.0\.0|192\.168\.|10\.)/.test(parsed.hostname) : false;
  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);
  const inverted = luminance(fg) > luminance(bg);
  const activePreset = PRESETS.find((p) => p.fg === fg && p.bg === bg)?.id;
  const displayUrl = value.replace(/^https?:\/\//, "").replace(/\/$/, "");

  function flash(kind: "png" | "svg") {
    setSaved(kind);
    window.setTimeout(() => setSaved((k) => (k === kind ? null : k)), 2000);
  }

  function downloadPng() {
    const source = canvasWrap.current?.querySelector("canvas");
    if (!source) return;
    // O componente multiplica o canvas pela densidade da tela; redesenha em exatamente 1024 × 1024.
    const out = document.createElement("canvas");
    out.width = EXPORT_SIZE;
    out.height = EXPORT_SIZE;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(source, 0, 0, EXPORT_SIZE, EXPORT_SIZE);
    download(out.toDataURL("image/png"), "qrcode-clinica-clive-1024.png");
    flash("png");
  }

  function downloadSvg() {
    const svg = svgWrap.current?.querySelector("svg");
    if (!svg) return;
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(svg);
    const blobUrl = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
    download(blobUrl, "qrcode-clinica-clive.svg");
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    flash("svg");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Configuração */}
      <section className="space-y-6 rounded-3xl border border-border bg-card p-5 sm:p-6" aria-labelledby={`${uid}-config`}>
        <h2 id={`${uid}-config`} className="sr-only">
          Configuração
        </h2>

        <div className="space-y-2">
          <Label htmlFor={`${uid}-url`}>Endereço do formulário</Label>
          <Input
            id={`${uid}-url`}
            type="url"
            inputMode="url"
            spellCheck={false}
            autoComplete="off"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            aria-invalid={!parsed}
            aria-describedby={`${uid}-url-hint`}
            className="h-12"
          />
          <div id={`${uid}-url-hint`} className="space-y-1.5 text-sm">
            {!parsed ? (
              <p role="alert" className="font-medium text-destructive">
                Digite um endereço completo, começando com https://. Enquanto isso, o QR Code usa o endereço padrão.
              </p>
            ) : isLocal ? (
              <p className="flex gap-1.5 font-medium text-amber-800">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                Este endereço só abre neste computador. Antes de imprimir, use o domínio de produção.
              </p>
            ) : (
              <p className="text-muted-foreground">
                É para onde o celular do participante vai.{" "}
                <a href={value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
                  Testar link <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              </p>
            )}
          </div>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-base font-semibold">Cores</legend>
          <div className="grid grid-cols-2 gap-2.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setFg(p.fg);
                  setBg(p.bg);
                }}
                aria-pressed={activePreset === p.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition-[border-color,box-shadow] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25",
                  activePreset === p.id ? "border-primary shadow-[inset_0_0_0_1px_var(--primary)]" : "border-border hover:border-input",
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border" style={{ background: p.bg }}>
                  <span className="size-4 rounded-[3px]" style={{ background: p.fg }} />
                </span>
                {p.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <ColorField id={`${uid}-fg`} label="Módulos" value={fg} onChange={setFg} />
            <ColorField id={`${uid}-bg`} label="Fundo" value={bg} onChange={setBg} />
          </div>
          <ContrastNote ratio={ratio} inverted={inverted} />
        </fieldset>

        <div className="flex items-start gap-3 rounded-2xl bg-muted px-4 py-3 text-sm">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <p>
            <span className="font-semibold">Correção de erro alta (nível H).</span>{" "}
            <span className="text-muted-foreground">
              O código continua legível mesmo com até 30% danificado, com reflexo de sol ou sujeira na placa.
            </span>
          </p>
        </div>

        <div className="space-y-2.5">
          <p className="text-base font-semibold">Arquivos para a gráfica</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Button size="lg" onClick={downloadPng} disabled={!parsed}>
              {saved === "png" ? <Check aria-hidden="true" /> : <Download aria-hidden="true" />}
              PNG 1024 × 1024
            </Button>
            <Button size="lg" variant="accent" onClick={downloadSvg} disabled={!parsed}>
              {saved === "svg" ? <Check aria-hidden="true" /> : <FileCode2 aria-hidden="true" />}
              SVG vetorial
            </Button>
          </div>
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {saved ? "Download iniciado." : "Para impressão, prefira o SVG: ele não perde nitidez em nenhum tamanho. Imprima com pelo menos 4 × 4 cm."}
          </p>
        </div>

        {/* Fontes de exportação, fora da tela */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0">
          <div ref={canvasWrap}>
            <QRCodeCanvas value={value} size={EXPORT_SIZE} level="H" fgColor={fg} bgColor={bg} marginSize={MARGIN_MODULES} />
          </div>
          <div ref={svgWrap}>
            <QRCodeSVG
              value={value}
              size={EXPORT_SIZE}
              level="H"
              fgColor={fg}
              bgColor={bg}
              marginSize={MARGIN_MODULES}
              title={`QR Code: ${site.name}`}
            />
          </div>
        </div>
      </section>

      {/* Prévia da placa de mesa */}
      <section aria-labelledby={`${uid}-preview`} className="rounded-3xl border border-dashed border-input bg-muted/50 p-5 sm:p-8">
        <h2 id={`${uid}-preview`} className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Prévia da placa de mesa
        </h2>
        <div className="mt-5 flex justify-center">
          <div className="relative w-full max-w-[22rem]">
            <article className="relative aspect-[148/210] overflow-hidden rounded-[1.75rem] bg-deep px-7 pb-7 pt-8 text-center text-primary-foreground shadow-[0_30px_60px_-25px_rgb(18_48_42/0.6)] grain">
              <div className="flex h-full flex-col items-center">
                <div className="flex w-full items-center justify-between">
                  <Logo tone="light" className="text-[0.8rem]" />
                  <span className="rounded-full border border-accent/50 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-accent">
                    {site.event}
                  </span>
                </div>
                <p className="mt-6 font-display text-[1.65rem] leading-[1.08] text-balance">
                  Escaneie e comece sua <em className="text-accent">experiência de autocuidado</em>
                </p>
                <div className="mt-5 w-[72%] rounded-2xl p-2 shadow-lg ring-1 ring-black/5" style={{ background: bg }}>
                  <QRCodeSVG value={value} level="H" fgColor={fg} bgColor={bg} marginSize={2} className="block h-auto w-full" title={PLACARD_TITLE} />
                </div>
                <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-medium text-primary-foreground/80">
                  <Smartphone className="size-3.5 text-accent" aria-hidden="true" />
                  Aponte a câmera do celular
                </p>
                <p className="mt-1 max-w-full truncate text-[0.65rem] tracking-wide text-primary-foreground/55">{displayUrl}</p>
              </div>
            </article>
            {/* Base da placa */}
            <div aria-hidden="true" className="mx-auto h-3 w-[86%] rounded-b-2xl bg-deep/70" />
          </div>
        </div>
        <p className="mt-5 text-center text-xs text-muted-foreground">Proporção A5 (14,8 × 21 cm). A placa é só uma prévia; os downloads trazem apenas o QR Code.</p>
      </section>
    </div>
  );
}

function ColorField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border px-3 py-2">
      <input
        id={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="size-9 shrink-0 cursor-pointer rounded-lg border border-border bg-transparent p-0.5"
      />
      <label htmlFor={id} className="min-w-0 text-sm">
        <span className="block font-medium">{label}</span>
        <span className="block font-mono text-xs uppercase text-muted-foreground">{value}</span>
      </label>
    </div>
  );
}

function ContrastNote({ ratio, inverted }: { ratio: number; inverted: boolean }) {
  const r = ratio.toFixed(1).replace(".", ",");
  if (inverted) {
    return (
      <p role="alert" className="flex gap-1.5 text-sm font-medium text-destructive">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Os módulos estão mais claros que o fundo. Muitos celulares não leem QR Code invertido.
      </p>
    );
  }
  if (ratio < 4.5) {
    return (
      <p role="alert" className="flex gap-1.5 text-sm font-medium text-destructive">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Contraste {r}:1 é baixo demais. Escureça os módulos ou clareie o fundo.
      </p>
    );
  }
  if (ratio < 7) {
    return (
      <p className="flex gap-1.5 text-sm font-medium text-amber-800">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Contraste {r}:1. Funciona, mas sob sol forte o ideal é 7:1 ou mais.
      </p>
    );
  }
  return (
    <p className="flex gap-1.5 text-sm text-emerald-800">
      <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      Contraste {r}:1, ótimo para leitura ao ar livre.
    </p>
  );
}
