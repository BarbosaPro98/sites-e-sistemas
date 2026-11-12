import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Tabela de leads do CRM.
 * `tratamentos` guarda um array JSON com os slugs escolhidos (ver src/lib/lead-options.ts).
 */
export const leads = sqliteTable(
  "leads",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nome: text("nome").notNull(),
    whatsapp: text("whatsapp").notNull(),
    tratamentos: text("tratamentos", { mode: "json" }).$type<string[]>().notNull(),
    autorizaWhatsapp: text("autoriza_whatsapp"),
    interesseMedicina: text("interesse_medicina").notNull(),
    origem: text("origem").notNull().default("Corrida AMB"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => [index("leads_created_at_idx").on(t.createdAt), index("leads_origem_idx").on(t.origem)],
);

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
