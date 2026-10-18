/**
 * CONFIGURAÇÃO CENTRAL DO SITE
 * ------------------------------------------------------------------
 * Todos os dados do profissional, contatos, endereço, tratamentos,
 * conteúdos editáveis e identidade visual ficam aqui.
 *
 * REGRA: nenhum dado profissional foi inventado. Campos com `null`
 * ainda NÃO foram confirmados e precisam ser preenchidos.
 *
 * `previewMode: true`  -> a página mostra marcadores visíveis
 *                         ("dado pendente") para revisão interna.
 * `previewMode: false` -> campos `null` simplesmente não aparecem
 *                         (use esta opção na versão publicada).
 */

export type Treatment = {
  /** Nome exibido na lista */
  name: string;
  /** Breve descrição (sem promessas de resultado) */
  description: string;
  /** Imagem opcional (caminho em /public) */
  image?: string | null;
  /** true somente quando o profissional confirmar que realiza o procedimento */
  confirmed: boolean;
};

export type GalleryPhoto = {
  src: string | null;
  alt: string;
  /** Formato do espaço na composição editorial */
  shape: "tall" | "wide" | "landscape" | "panorama";
};

export const site = {
  previewMode: true,

  /* ----------------------------------------------------------------
   * DADOS PROFISSIONAIS — PENDENTES
   * -------------------------------------------------------------- */
  professional: {
    name: null as string | null, // PENDENTE: nome do profissional
    /** Profissão genérica do prompt; especialidade só quando confirmada */
    profession: "Cirurgião-Dentista",
    specialty: null as string | null, // PENDENTE (seguir normas CFO/CRO)
    cro: null as string | null, // PENDENTE: ex. "CRO-UF 00000"
    /** Parágrafos adicionais da apresentação, apenas com dados reais */
    bio: [] as string[],
    /** Formação/qualificações comprovadas */
    qualifications: [] as string[],
    photo: null as string | null, // PENDENTE: /media/profissional.webp
  },

  clinic: {
    /** NOME FICTÍCIO, a pedido do Pedro (2026-10-18). Substituir pelo nome real. */
    name: "Aurea Odontologia" as string | null,
    nameIsFictional: true,
    logo: null as string | null, // PENDENTE: /media/logo.svg
  },

  contact: {
    /** Apenas dígitos com DDI e DDD, ex. "5511999999999" */
    whatsapp: null as string | null, // PENDENTE
    phone: null as string | null, // PENDENTE: formato de exibição
    instagram: null as string | null, // PENDENTE: usuário sem @
    email: null as string | null,
  },

  address: {
    street: null as string | null, // PENDENTE: rua e número
    complement: null as string | null,
    district: null as string | null,
    city: null as string | null, // PENDENTE
    state: null as string | null, // PENDENTE: UF
    zip: null as string | null,
    /** Só incorporar o mapa depois de o endereço ser confirmado */
    confirmed: false,
  },

  /** Horários reais, ex. { days: "Segunda a sexta", time: "8h às 18h" } */
  hours: [] as { days: string; time: string }[], // PENDENTE

  emergency: {
    /** null = não confirmado. A seção só é publicada com `true`. */
    offered: null as boolean | null,
    availability: null as string | null, // ex. "Segunda a sábado, 8h às 20h"
    is24h: false,
  },

  /* ----------------------------------------------------------------
   * TRATAMENTOS
   * Os itens abaixo são PLACEHOLDERS ADMINISTRATIVOS (confirmed: false).
   * Eles aparecem só no modo prévia, marcados como exemplo.
   * Troque por tratamentos reais e marque confirmed: true.
   * -------------------------------------------------------------- */
  treatments: [
    {
      name: "Tratamento 01",
      description:
        "Descrição breve do primeiro cuidado oferecido. Substituir pelo tratamento confirmado pelo profissional.",
      confirmed: false,
    },
    {
      name: "Tratamento 02",
      description:
        "Espaço para apresentar um procedimento com linguagem clara, sem promessas de resultado.",
      confirmed: false,
    },
    {
      name: "Tratamento 03",
      description:
        "Cada item aceita nome, descrição, imagem opcional e link de agendamento próprio.",
      confirmed: false,
    },
    {
      name: "Tratamento 04",
      description:
        "Itens não confirmados ficam ocultos automaticamente quando o modo prévia é desligado.",
      confirmed: false,
    },
    {
      name: "Tratamento 05",
      description:
        "A ordem da lista segue a ordem deste arquivo de configuração.",
      confirmed: false,
    },
  ] as Treatment[],

  /* ----------------------------------------------------------------
   * MÍDIA — sem fotos ou vídeos reais ainda
   * -------------------------------------------------------------- */
  hero: {
    video: null as string | null, // PENDENTE: /media/hero.mp4
    videoMobile: null as string | null, // opcional, enquadramento vertical
    poster: null as string | null, // PENDENTE: /media/hero-poster.webp
    photo: null as string | null, // usado se não houver vídeo
  },

  gallery: [
    { src: null, alt: "Fotografia do consultório 01", shape: "tall" },
    { src: null, alt: "Fotografia do consultório 02", shape: "landscape" },
    { src: null, alt: "Fotografia do consultório 03", shape: "landscape" },
    { src: null, alt: "Fotografia do consultório 04", shape: "panorama" },
  ] as GalleryPhoto[],

  /** Fonte pública de avaliações reais (ex. perfil no Google), se houver */
  reviewsUrl: null as string | null,

  /* ----------------------------------------------------------------
   * MENSAGENS DE WHATSAPP (codificadas automaticamente nos links)
   * -------------------------------------------------------------- */
  messages: {
    booking: "Olá! Encontrei seu site e gostaria de agendar uma consulta.",
    emergency:
      "Olá! Preciso de atendimento odontológico de urgência. Poderia me orientar sobre a disponibilidade?",
  },

  /* ----------------------------------------------------------------
   * SEO
   * -------------------------------------------------------------- */
  seo: {
    siteUrl: null as string | null, // PENDENTE: domínio, ex. "https://..."
  },

  /* ----------------------------------------------------------------
   * IDENTIDADE VISUAL (proposta, sem marca definida)
   * As mesmas cores estão em src/app/globals.css (:root).
   * -------------------------------------------------------------- */
  brand: {
    primary: "#581C2B",
    primaryDeep: "#32111C",
    accent: "#C5A46D",
    accentSoft: "#E0CCAA",
    background: "#F7F4EE",
    text: "#292321",
  },
};

export type Site = typeof site;
