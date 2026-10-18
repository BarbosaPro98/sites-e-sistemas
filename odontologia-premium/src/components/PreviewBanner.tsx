"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { site } from "@/config/site";

/** Visible only in preview mode: explains the dashed "pending data" markers. */
export default function PreviewBanner() {
  const [open, setOpen] = useState(true);
  if (!site.previewMode || !open) return null;
  return (
    <div role="note" className="fixed bottom-5 left-5 z-40 flex max-w-[min(22rem,calc(100vw-7rem))] items-start gap-3 bg-cream/95 p-4 text-xs leading-relaxed text-ink shadow-[0_10px_30px_-12px_rgba(31,10,17,0.45)] ring-1 ring-accent/50 backdrop-blur md:bottom-8 md:left-8">
      <p>
        <strong className="font-semibold text-primary">Prévia com dados de exemplo.</strong> Os marcadores ◇ indicam
        dados do profissional ainda não confirmados. Nada aqui foi inventado.
      </p>
      <button type="button" onClick={() => setOpen(false)} aria-label="Fechar aviso" className="-m-1 p-1 text-muted hover:text-ink">
        <X size={14} />
      </button>
    </div>
  );
}
