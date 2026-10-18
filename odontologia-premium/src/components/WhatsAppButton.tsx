"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { whatsappLink } from "@/lib/links";

/** Floating WhatsApp access, shown after the hero and hidden near the final CTA. */
export default function WhatsAppButton() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setShow(v > window.innerHeight * 0.85 && v < max - window.innerHeight * 1.1);
  });
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={whatsappLink("booking")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Agendar pelo WhatsApp"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-primary-deep/90 py-3 pl-3 pr-5 text-cream shadow-[0_10px_30px_-10px_rgba(31,10,17,0.6)] ring-1 ring-accent/40 backdrop-blur md:bottom-8 md:right-8"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-primary-deep">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.86 9.86 0 0 0 12.04 2zm5.8 14.07c-.24.68-1.42 1.3-1.95 1.35-.5.05-1.13.07-1.83-.12-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3s.75-2.13 1.02-2.42c.26-.29.58-.36.77-.36h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.3-.13.59.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.42.29.14.46.12.62-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.65-.14.26.1 1.68.79 1.97.94.29.14.48.22.55.34.07.12.07.7-.17 1.38z" />
            </svg>
          </span>
          <span className="hidden text-[0.7rem] font-semibold uppercase tracking-[0.2em] sm:inline">Agendar</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
