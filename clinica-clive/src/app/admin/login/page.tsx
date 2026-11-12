import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Acesso da equipe", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-[2rem] border border-border bg-card p-8 shadow-xl">
        <Logo className="text-sm" />
        <h1 className="mt-6 font-display text-3xl text-primary">CRM do evento</h1>
        <p className="mt-1 text-sm text-muted-foreground">Área restrita à equipe da Clínica Clive.</p>
        <div className="mt-6">
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
