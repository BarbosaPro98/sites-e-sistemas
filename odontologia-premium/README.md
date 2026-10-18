# Landing page odontológica premium

Feita a partir de `/mnt/project-files/prompts/odontologia-premium.md`.
Stack: Next.js (export estático), React, TypeScript, Tailwind CSS 4, GSAP + ScrollTrigger,
Motion for React, Three.js + React Three Fiber + Drei, Lenis, Lucide.

## Onde preencher os dados
- `src/config/site.ts`: dados profissionais, contatos, endereço, horários, urgência,
  tratamentos, fotos/vídeo, SEO e cores. Campos `null` estão PENDENTES.
- `src/config/content.ts`: textos editáveis. `{palavra}` vira caligrafia.
- `src/app/globals.css` (`:root`): variáveis de cor.
- Mídia real vai em `public/media/` e é referenciada no `site.ts`.

O nome "Aurea Odontologia" é FICTÍCIO (pedido do Pedro). Os demais dados não foram inventados.

## Modo prévia
`previewMode: true` mostra marcadores ◇ nos dados pendentes e exemplos de tratamentos.
Para publicar, preencha os dados reais e use `previewMode: false`: campos vazios somem,
a seção de urgência só aparece com `emergency.offered: true` e o site passa a permitir indexação.

## Comandos
    npm install
    npm run dev        # desenvolvimento
    npm run build      # gera ./out (site estático)
    node scripts/relative-export.mjs   # cópia com caminhos relativos em ./preview
