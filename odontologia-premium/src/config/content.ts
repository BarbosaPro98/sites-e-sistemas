/**
 * CONTEÚDOS EDITÁVEIS
 * Textos institucionais da página. Nenhum texto afirma formação,
 * especialidade, estrutura ou resultado não confirmados.
 * Em headlines, a palavra entre chaves {assim} recebe a caligrafia.
 */

export const nav = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Tratamentos", href: "#tratamentos" },
  { label: "Consultório", href: "#consultorio" },
  { label: "Contato", href: "#contato" },
];

export const content = {
  hero: {
    lines: ["A excelência está", "em cada detalhe", "do seu {sorriso}."],
    subtitle:
      "Odontologia com atenção aos detalhes, cuidado individualizado e dedicação ao seu sorriso.",
    primaryCta: "Agendar minha consulta",
    secondaryCta: "Conheça o profissional",
  },
  about: {
    eyebrow: "Conheça o profissional",
    lines: ["O cuidado começa", "muito antes do {sorriso}."],
    text: "Cada atendimento é uma oportunidade de oferecer atenção, escuta e um cuidado odontológico pensado para as necessidades de cada paciente.",
    cta: "Agendar uma avaliação",
  },
  treatments: {
    eyebrow: "Tratamentos",
    lines: ["Cada sorriso merece", "um cuidado {único}."],
    subtitle: "Conheça os cuidados e tratamentos odontológicos disponíveis.",
  },
  differentials: {
    eyebrow: "Atendimento",
    lines: ["Uma experiência pensada", "nos {detalhes}."],
    /** Temas editoriais sugeridos no prompt, sujeitos à confirmação */
    items: [
      {
        title: "Atenção individualizada",
        text: "Tempo para ouvir, entender o que você procura e esclarecer cada dúvida.",
        shape: "sphere",
      },
      {
        title: "Planejamento do atendimento",
        text: "Cada etapa é conversada com você antes de acontecer.",
        shape: "ring",
      },
      {
        title: "Cuidado em cada etapa",
        text: "Atenção que acompanha o atendimento do início ao fim.",
        shape: "capsule",
      },
      {
        title: "Acolhimento e orientação",
        text: "Informações claras para você decidir com tranquilidade.",
        shape: "arch",
      },
    ],
  },
  gallery: {
    eyebrow: "Consultório",
    lines: ["Um ambiente pensado", "para {acolher} você."],
    text: "Conheça o espaço de atendimento e saiba mais sobre a estrutura do consultório.",
  },
  journey: {
    eyebrow: "Experiência do paciente",
    lines: ["Seu cuidado,", "em cada {etapa}."],
    steps: [
      {
        title: "Primeiro contato",
        text: "Entre em contato para obter informações e solicitar seu agendamento.",
      },
      {
        title: "Avaliação",
        text: "Um momento dedicado à compreensão das suas necessidades odontológicas.",
      },
      {
        title: "Planejamento",
        text: "As possibilidades de cuidado são discutidas conforme a avaliação profissional.",
      },
      {
        title: "Acompanhamento",
        text: "Orientações e acompanhamento conforme as necessidades do tratamento.",
      },
    ],
  },
  emergency: {
    eyebrow: "Urgências odontológicas",
    lines: ["Imprevistos acontecem.", "O cuidado não pode {esperar}."],
    text: "Precisa de atendimento odontológico de urgência? Entre em contato para receber orientações sobre a disponibilidade.",
    cta: "Solicitar atendimento de urgência",
  },
  trust: {
    eyebrow: "Transparência",
    lines: ["Informações que você", "pode {verificar}."],
  },
  faq: {
    eyebrow: "Dúvidas frequentes",
    lines: ["Algumas respostas", "para {você}."],
  },
  location: {
    eyebrow: "Localização",
    lines: ["Esperamos", "por {você}."],
  },
  finalCta: {
    lines: ["O primeiro passo para o seu", "novo {sorriso} começa aqui."],
    subtitle: "Entre em contato e agende sua avaliação odontológica.",
    cta: "Agendar minha consulta",
  },
};
