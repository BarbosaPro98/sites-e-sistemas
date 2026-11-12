import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { QrGenerator } from "@/components/admin/qr-generator";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";

export const metadata: Metadata = { title: "QR Code do stand", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** URL pública do formulário: NEXT_PUBLIC_SITE_URL ou, na falta dela, o domínio em que o painel está aberto. */
async function defaultFormUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/+$/, "") + "/";
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}/`;
}

export default async function QrCodePage() {
  const jar = await cookies();
  if (!(await isValidSession(jar.get(SESSION_COOKIE)?.value))) redirect("/admin/login");

  return (
    <div className="min-h-dvh bg-background">
      <AdminHeader active="/admin/qrcode" />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="font-display text-4xl text-primary">QR Code do stand</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Gere o código que leva ao formulário de cadastro, confira como fica na placa de mesa e baixe os arquivos para a gráfica.
        </p>
        <div className="mt-6">
          <QrGenerator defaultUrl={await defaultFormUrl()} />
        </div>
      </main>
    </div>
  );
}
