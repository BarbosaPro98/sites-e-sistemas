import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Download, LogOut, Search, Users, CalendarDays, MessageCircleCheck, X } from "lucide-react";
import { logout } from "../actions";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { AUTORIZACAO_LABEL, MEDICINA_LABEL, TRATAMENTO_LABEL, TRATAMENTOS } from "@/lib/lead-options";
import { leadStats, listLeads, normalizeFilters } from "@/lib/leads-query";
import { formatDateTime } from "@/lib/datetime";
import { formatPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "CRM Corrida AMB", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function buildQuery(params: { tratamento?: string; q?: string }) {
  const sp = new URLSearchParams();
  if (params.tratamento) sp.set("tratamento", params.tratamento);
  if (params.q) sp.set("q", params.q);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default async function CrmPage({ searchParams }: { searchParams: SearchParams }) {
  const jar = await cookies();
  if (!(await isValidSession(jar.get(SESSION_COOKIE)?.value))) redirect("/admin/login");

  const filters = normalizeFilters(await searchParams);
  const [rows, stats] = await Promise.all([listLeads(filters), leadStats()]);
  const autorizados = rows.filter((r) => r.autorizaWhatsapp === "sim").length;
  const hasFilters = Boolean(filters.tratamento || filters.q);

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo className="text-sm" />
            <span className="hidden h-5 w-px bg-border sm:block" />
            <span className="hidden text-sm font-semibold text-muted-foreground sm:block">CRM · Corrida AMB</span>
          </div>
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut aria-hidden="true" /> Sair
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl text-primary">Leads captados</h1>
            <p className="text-sm text-muted-foreground">Cadastros feitos pelo QR Code no stand. Atualize a página para ver novos leads.</p>
          </div>
          <Button asChild variant="accent">
            <a href={`/admin/crm/export${buildQuery(filters)}`} download>
              <Download aria-hidden="true" /> Exportar CSV{hasFilters ? " (filtrado)" : ""}
            </a>
          </Button>
        </div>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Resumo">
          <Stat icon={Users} label="Total de leads" value={stats.total} />
          <Stat icon={CalendarDays} label="Cadastrados hoje" value={stats.hoje} />
          <Stat icon={Search} label="Nesta lista" value={rows.length} />
          <Stat icon={MessageCircleCheck} label="Autorizam WhatsApp (lista)" value={autorizados} />
        </section>

        <section className="space-y-3 rounded-3xl border border-border bg-card p-4 sm:p-5" aria-label="Filtros">
          <form method="get" className="flex flex-col gap-2 sm:flex-row">
            {filters.tratamento && <input type="hidden" name="tratamento" value={filters.tratamento} />}
            <label htmlFor="q" className="sr-only">
              Buscar por nome ou WhatsApp
            </label>
            <Input id="q" name="q" defaultValue={filters.q} placeholder="Buscar por nome ou WhatsApp" className="h-11 rounded-full" />
            <Button type="submit" variant="outline" className="shrink-0">
              <Search aria-hidden="true" /> Buscar
            </Button>
          </form>
          <nav aria-label="Filtrar por tratamento" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible">
            <FilterChip href={`/admin/crm${buildQuery({ q: filters.q })}`} active={!filters.tratamento} label="Todos" count={stats.total} />
            {TRATAMENTOS.map((t) => (
              <FilterChip
                key={t.value}
                href={`/admin/crm${buildQuery({ q: filters.q, tratamento: t.value })}`}
                active={filters.tratamento === t.value}
                label={t.label}
                count={stats.porTratamento[t.value] ?? 0}
              />
            ))}
          </nav>
          {hasFilters && (
            <Link href="/admin/crm" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              <X className="size-4" aria-hidden="true" /> Limpar filtros
            </Link>
          )}
        </section>

        {rows.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-input bg-card px-6 py-16 text-center">
            <p className="font-display text-2xl text-primary">{hasFilters ? "Nenhum lead com esses filtros" : "Nenhum lead ainda"}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {hasFilters ? "Tente outro tratamento ou limpe a busca." : "Os cadastros feitos pelo QR Code aparecem aqui em tempo real."}
            </p>
          </div>
        ) : (
          <>
            {/* Tabela no desktop */}
            <div className="hidden overflow-hidden rounded-3xl border border-border bg-card md:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Data</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Tratamentos</TableHead>
                    <TableHead>Autoriza</TableHead>
                    <TableHead>Medicina</TableHead>
                    <TableHead>Origem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground tabular-nums">{formatDateTime(l.createdAt)}</TableCell>
                      <TableCell className="font-semibold">{l.nome}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <a href={`https://wa.me/55${l.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-primary tabular-nums hover:underline">
                          {formatPhone(l.whatsapp)}
                        </a>
                      </TableCell>
                      <TableCell>
                        <TreatmentList list={l.tratamentos} />
                      </TableCell>
                      <TableCell>
                        <ConsentBadge value={l.autorizaWhatsapp} />
                      </TableCell>
                      <TableCell className="max-w-48 text-muted-foreground">{MEDICINA_LABEL[l.interesseMedicina] ?? l.interesseMedicina}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{l.origem}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Cartões no celular */}
            <ul className="grid gap-3 md:hidden">
              {rows.map((l) => (
                <li key={l.id} className="rounded-3xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{l.nome}</p>
                      <a href={`https://wa.me/55${l.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary tabular-nums hover:underline">
                        {formatPhone(l.whatsapp)}
                      </a>
                    </div>
                    <ConsentBadge value={l.autorizaWhatsapp} />
                  </div>
                  <div className="mt-3">
                    <TreatmentList list={l.tratamentos} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Medicina:</span> {MEDICINA_LABEL[l.interesseMedicina] ?? l.interesseMedicina}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground tabular-nums">
                    {formatDateTime(l.createdAt)} · {l.origem}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-5">
      <Icon className="size-5 text-accent" aria-hidden="true" />
      <p className="mt-3 text-3xl font-semibold leading-none tracking-tight text-primary tabular-nums">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

function FilterChip({ href, active, label, count }: { href: string; active: boolean; label: string; count: number }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-input",
      )}
    >
      {label}
      <span className={cn("rounded-full px-1.5 text-xs tabular-nums", active ? "bg-primary-foreground/20" : "bg-muted")}>{count}</span>
    </Link>
  );
}

function TreatmentList({ list }: { list: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {list.map((t) => (
        <Badge key={t}>{TRATAMENTO_LABEL[t] ?? t}</Badge>
      ))}
    </div>
  );
}

function ConsentBadge({ value }: { value: string | null }) {
  if (value === "sim") return <Badge variant="success">Autoriza</Badge>;
  if (value === "nao") return <Badge variant="muted">{AUTORIZACAO_LABEL.nao.replace(".", "")}</Badge>;
  return <Badge variant="outline">Sem resposta</Badge>;
}
