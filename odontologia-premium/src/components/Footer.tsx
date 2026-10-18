import { nav } from "@/config/content";
import { site } from "@/config/site";
import { cityLabel, displayName, fullAddress, instagramLink, phoneLink, whatsappLink } from "@/lib/links";
import { Wordmark } from "./Navbar";

export default function Footer() {
  const p = site.professional;
  const name = displayName();
  const insta = instagramLink();
  const tel = phoneLink();
  const addr = fullAddress() ?? cityLabel();
  const e = site.emergency;

  return (
    <footer className="bg-ink-deep text-cream/70">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 pb-12 pt-24 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <Wordmark />
          <p className="mt-6 text-sm leading-relaxed">
            {p.profession}
            {p.cro && <> · {p.cro}</>}
          </p>
          {site.previewMode && !p.cro && (
            <p className="mt-3 text-xs text-accent-soft/80">◇ Prévia: nome e CRO pendentes</p>
          )}
        </div>

        <nav aria-label="Rodapé" className="md:col-span-2 md:col-start-6">
          <p className="eyebrow !text-[0.6rem] text-accent">Navegação</p>
          <ul className="mt-5 space-y-3 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-cream">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4 md:col-start-9">
          <p className="eyebrow !text-[0.6rem] text-accent">Contato</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a href={whatsappLink("booking")} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
                WhatsApp{site.contact.whatsapp ? "" : " (número pendente)"}
              </a>
            </li>
            {tel && (
              <li>
                <a href={tel} className="hover:text-cream">
                  {site.contact.phone}
                </a>
              </li>
            )}
            {insta && (
              <li>
                <a href={insta} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
                  Instagram @{site.contact.instagram}
                </a>
              </li>
            )}
            {addr && <li>{addr}</li>}
            {site.hours.map((h) => (
              <li key={h.days}>
                {h.days} · {h.time}
              </li>
            ))}
            {e.offered === true && <li>Urgências: {e.is24h ? "24 horas" : e.availability ?? "consulte"}</li>}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-white/10 px-5 py-8 text-xs md:flex-row md:justify-between md:px-10">
        <p>
          © {new Date().getFullYear()} {name ?? p.profession}. Todos os direitos reservados.
        </p>
        {p.cro && <p>Responsável técnico: {p.name} · {p.cro}</p>}
      </div>
    </footer>
  );
}
