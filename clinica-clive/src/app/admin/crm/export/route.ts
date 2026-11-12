import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { AUTORIZACAO_LABEL, MEDICINA_LABEL, TRATAMENTO_LABEL } from "@/lib/lead-options";
import { listLeads, normalizeFilters } from "@/lib/leads-query";
import { formatDateTime } from "@/lib/datetime";
import { formatPhone } from "@/lib/phone";

export const dynamic = "force-dynamic";

function csvCell(value: string) {
  // Evita injeção de fórmula no Excel e escapa aspas.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const jar = await cookies();
  if (!(await isValidSession(jar.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const filters = normalizeFilters(Object.fromEntries(req.nextUrl.searchParams));
  const rows = await listLeads(filters);

  const header = ["ID", "Data/hora", "Nome", "WhatsApp", "Tratamentos", "Autoriza WhatsApp", "Interesse em Medicina", "Origem"];
  const lines = rows.map((l) =>
    [
      String(l.id),
      formatDateTime(l.createdAt),
      l.nome,
      formatPhone(l.whatsapp),
      l.tratamentos.map((t) => TRATAMENTO_LABEL[t] ?? t).join(" | "),
      l.autorizaWhatsapp ? AUTORIZACAO_LABEL[l.autorizaWhatsapp] ?? l.autorizaWhatsapp : "Não respondeu",
      MEDICINA_LABEL[l.interesseMedicina] ?? l.interesseMedicina,
      l.origem,
    ]
      .map(csvCell)
      .join(";"),
  );

  // BOM + ";" para abrir corretamente no Excel em português.
  const csv = "﻿" + [header.map(csvCell).join(";"), ...lines].join("\r\n");
  const stamp = new Date().toISOString().slice(0, 10);
  const suffix = filters.tratamento ? `-${filters.tratamento}` : "";

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-corrida-amb${suffix}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
