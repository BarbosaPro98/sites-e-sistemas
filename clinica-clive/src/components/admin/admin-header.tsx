import Link from "next/link";
import { LogOut, QrCode, Users } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/crm", label: "Leads", icon: Users },
  { href: "/admin/qrcode", label: "QR Code", icon: QrCode },
] as const;

export function AdminHeader({ active }: { active: (typeof links)[number]["href"] }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Logo className="text-sm" />
          <span className="hidden h-5 w-px bg-border sm:block" />
          <nav aria-label="Painel" className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={active === href ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-semibold transition-colors",
                  active === href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="sm" aria-label="Sair">
            <LogOut aria-hidden="true" /> <span className="hidden sm:inline">Sair</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
