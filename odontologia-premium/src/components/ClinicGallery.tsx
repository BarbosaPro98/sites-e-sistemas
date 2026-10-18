"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { content } from "@/config/content";
import { site, type GalleryPhoto } from "@/config/site";
import { Eyebrow, Headline, Pending } from "./ui";

function Photo({ photo, onOpen, className = "", aspect }: { photo: GalleryPhoto; onOpen: () => void; className?: string; aspect: string }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ampliar: ${photo.alt}`}
      className={`group relative block w-full overflow-hidden text-left ${className}`}
    >
      <div data-reveal="clip" className={`relative w-full overflow-hidden ${aspect}`}>
        <div data-zoom className="absolute inset-[-6%]">
          <div data-parallax="5" className="h-full w-full transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.04]">
            {photo.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <div className="photo-placeholder flex h-full w-full items-end p-[9%]">
                <Pending label={photo.alt} className="text-primary" />
              </div>
            )}
          </div>
        </div>
        <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center bg-cream/80 text-primary-deep opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 size={15} strokeWidth={1.5} aria-hidden />
        </span>
      </div>
    </button>
  );
}

export default function ClinicGallery() {
  const c = content.gallery;
  const photos = site.gallery;
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length));

  useEffect(() => {
    const dlg = dialog.current;
    if (!dlg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setIndex(null);
    dlg.addEventListener("keydown", onKey);
    dlg.addEventListener("close", onClose);
    return () => {
      dlg.removeEventListener("keydown", onKey);
      dlg.removeEventListener("close", onClose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!photos.length) return null;
  const current = index !== null ? photos[index] : null;

  return (
    <section id="consultorio" className="relative overflow-hidden bg-cream-2 py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          {/* Tall photo */}
          <div className="relative md:col-span-5">
            <Photo photo={photos[0]} onOpen={() => open(0)} aspect="aspect-[3/4]" />
            <span data-dot-anchor="gallery-a" className="absolute -right-6 top-[18%] hidden h-px w-px md:block" aria-hidden />
          </div>

          <div className="flex flex-col md:col-span-6 md:col-start-7">
            <Eyebrow className="text-primary">{c.eyebrow}</Eyebrow>
            <Headline lines={c.lines} className="mt-8 text-[clamp(2.6rem,5vw,5rem)] text-primary-deep" />
            <p data-reveal="fade" className="mt-8 max-w-md text-lg leading-relaxed text-muted">
              {c.text}
            </p>
            {site.previewMode && photos.some((p) => !p.src) && (
              <Pending label="Fotografias reais do consultório (não geramos imagens fictícias)" className="mt-6 text-muted" />
            )}

            <div className="relative mt-14 grid grid-cols-2 gap-5 md:mt-auto md:pt-16">
              <span data-dot-anchor="gallery-b" className="absolute -right-4 top-0 hidden h-px w-px md:block" aria-hidden />
              {photos[1] && <Photo photo={photos[1]} onOpen={() => open(1)} aspect="aspect-[4/3]" />}
              {photos[2] && <Photo photo={photos[2]} onOpen={() => open(2)} aspect="aspect-[4/3]" className="md:translate-y-14" />}
            </div>
          </div>
        </div>

        {/* Connecting ornament */}
        <div aria-hidden className="relative my-16 flex items-center gap-4 md:my-28 md:ml-[8%]">
          <span className="h-2 w-2 rounded-full border border-accent" />
          <span data-reveal="draw-x" className="block h-px flex-1 bg-accent/50" />
          <span data-dot-anchor="gallery-c" className="block h-px w-px" />
        </div>

        {photos[3] && (
          <div className="md:ml-[8%]">
            <Photo photo={photos[3]} onOpen={() => open(3)} aspect="aspect-[16/10] md:aspect-[21/9]" />
          </div>
        )}
        {photos.slice(4).length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-3">
            {photos.slice(4).map((p, i) => (
              <Photo key={i} photo={p} onOpen={() => open(i + 4)} aspect="aspect-[4/3]" />
            ))}
          </div>
        )}
      </div>

      {/* Accessible lightbox */}
      <dialog
        ref={dialog}
        aria-label="Galeria do consultório"
        className="m-auto h-[100svh] max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-ink-deep/90 backdrop:backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        {current && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-5 md:p-16" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="relative aspect-[4/3] max-h-[72vh] w-full max-w-5xl overflow-hidden">
              {current.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.src} alt={current.alt} className="h-full w-full object-contain" />
              ) : (
                <div className="photo-placeholder-dark flex h-full w-full items-center justify-center">
                  <Pending label={current.alt} className="text-accent-soft" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-6 text-cream">
              <button type="button" onClick={() => step(-1)} aria-label="Foto anterior" className="grid h-12 w-12 place-items-center border border-white/20 hover:border-accent">
                <ChevronLeft size={18} strokeWidth={1.25} />
              </button>
              <p className="eyebrow !text-[0.62rem] text-cream/70" aria-live="polite">
                {String((index ?? 0) + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
              </p>
              <button type="button" onClick={() => step(1)} aria-label="Próxima foto" className="grid h-12 w-12 place-items-center border border-white/20 hover:border-accent">
                <ChevronRight size={18} strokeWidth={1.25} />
              </button>
            </div>
            <button type="button" onClick={close} aria-label="Fechar galeria" className="absolute right-5 top-5 grid h-12 w-12 place-items-center text-cream hover:text-accent">
              <X strokeWidth={1.25} />
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
