"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, isAuthConfigured, SESSION_COOKIE, SESSION_MAX_AGE, sessionToken } from "@/lib/auth";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { error: "Acesso ainda não configurado. Defina ADMIN_PASSWORD nas variáveis de ambiente." };
  }
  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 600)); // desacelera tentativas
    return { error: "Senha incorreta." };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, await sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: SESSION_MAX_AGE,
  });

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin/") && !next.startsWith("//") ? next : "/admin/crm");
}

export async function logout() {
  const jar = await cookies();
  jar.delete({ name: SESSION_COOKIE, path: "/admin" });
  redirect("/admin/login");
}
