# Clínica Clive · Captação de leads na Corrida AMB

App Next.js (App Router + TypeScript + Tailwind + componentes no padrão shadcn/ui) para captar leads pelo QR Code do stand da Clínica Clive na Corrida AMB.

## Rotas

| Rota | O que faz |
| --- | --- |
| `/` e `/cadastro` | Formulário mobile-first. Valida, salva no CRM com data/hora e origem `Corrida AMB`, mostra a confirmação e redireciona para `/clinica` em 2,5 s. |
| `/clinica` | Landing page de conversão (hero, tecnologia, comunidade no Instagram, benefício do evento). |
| `/admin/crm` | CRM protegido por senha: totais, busca, filtro por tratamento e exportação CSV. `/admin` redireciona para cá. |
| `/admin/crm/export` | Download do CSV (respeita os filtros ativos; abre direto no Excel em português). |

## Onde está cada parte

- Schema do banco: `src/db/schema.ts` (Drizzle, tabela `leads`). A tabela é criada sozinha no primeiro acesso (`ensureSchema` em `src/db/index.ts`).
- Server Action de salvamento: `src/app/actions.ts` (validação com Zod em `src/lib/lead-schema.ts`, honeypot anti-spam e proteção contra envio duplicado).
- Formulário: `src/app/page.tsx` + `src/components/cadastro/lead-form.tsx` (máscara em `src/lib/phone.ts`).
- Landing page: `src/app/clinica/page.tsx`.
- Painel: `src/app/admin/crm/page.tsx`; login em `src/app/admin/login`; proteção em `src/middleware.ts`.
- Textos e links da clínica: `src/config/site.ts`.

## Rodar localmente

```bash
cp .env.example .env.local   # defina ADMIN_PASSWORD
npm install
npm run dev
```

Os leads ficam em `data/leads.db` (SQLite).

## Produção

Hospedagens serverless (como a Vercel) não guardam arquivos, então use um banco libSQL gerenciado (Turso, plano gratuito): crie o banco e defina `DATABASE_URL` (`libsql://...`) e `DATABASE_AUTH_TOKEN`. Defina também `ADMIN_PASSWORD`. Para trocar por Supabase/Postgres, basta portar `src/db/schema.ts` para `pg-core` e trocar o driver em `src/db/index.ts`.

## Pendências antes do evento

- Número do WhatsApp da clínica (`NEXT_PUBLIC_CLINIC_WHATSAPP`). Sem ele, os botões levam ao Instagram.
- Texto real do benefício para participantes (`NEXT_PUBLIC_EVENT_BENEFIT`).
- Logo oficial (hoje há uma marca tipográfica provisória em `src/components/brand/logo.tsx`) e fotos da clínica.
- Gerar o QR Code apontando para o domínio final (`https://seu-dominio/`).
