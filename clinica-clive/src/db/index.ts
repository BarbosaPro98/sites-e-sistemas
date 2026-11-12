import "server-only";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

/**
 * Banco: libSQL (SQLite). Em desenvolvimento usa o arquivo local ./data/leads.db.
 * Em produção, aponte DATABASE_URL para um banco Turso (libsql://...) e
 * informe DATABASE_AUTH_TOKEN, já que hospedagens serverless não guardam arquivos.
 */
const url = process.env.DATABASE_URL ?? "file:./data/leads.db";

const globalForDb = globalThis as unknown as { libsql?: Client; schemaReady?: Promise<void> };

const client =
  globalForDb.libsql ?? createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
if (process.env.NODE_ENV !== "production") globalForDb.libsql = client;

export const db = drizzle(client, { schema });

/** Cria a tabela na primeira execução, para o app funcionar sem passo manual de migração. */
export function ensureSchema() {
  globalForDb.schemaReady ??= client
    .batch(
      [
        `CREATE TABLE IF NOT EXISTS leads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          whatsapp TEXT NOT NULL,
          tratamentos TEXT NOT NULL,
          autoriza_whatsapp TEXT,
          interesse_medicina TEXT NOT NULL,
          origem TEXT NOT NULL DEFAULT 'Corrida AMB',
          created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
        )`,
        `CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at)`,
        `CREATE INDEX IF NOT EXISTS leads_origem_idx ON leads (origem)`,
      ],
      "write",
    )
    .then(() => undefined)
    .catch((err) => {
      globalForDb.schemaReady = undefined;
      throw err;
    });
  return globalForDb.schemaReady;
}
