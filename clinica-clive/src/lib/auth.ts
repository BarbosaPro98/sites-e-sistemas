/**
 * Autenticação simples por senha única para a equipe da clínica.
 * A senha fica em ADMIN_PASSWORD; o cookie guarda um hash HMAC dela, nunca a senha.
 * Funciona no runtime Edge (middleware) e no Node (Server Actions e rotas).
 */
export const SESSION_COOKIE = "clive_admin";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 horas

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function isAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

async function hmac(value: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function sessionToken() {
  return hmac(`clive-admin:${process.env.ADMIN_PASSWORD ?? ""}`);
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function isValidSession(cookieValue: string | undefined) {
  if (!isAuthConfigured() || !cookieValue) return false;
  return safeEqual(cookieValue, await sessionToken());
}

export async function checkPassword(password: string) {
  if (!isAuthConfigured()) return false;
  const [a, b] = await Promise.all([hmac(`pw:${password}`), hmac(`pw:${process.env.ADMIN_PASSWORD}`)]);
  return safeEqual(a, b);
}
