// Todos os dados do negócio ficam aqui. Troque pelos dados reais antes de publicar.
export const site = {
  nome: "Navalha d'Ouro",
  razaoSocial: "Navalha d'Ouro Barbearia LTDA",
  cnpj: "00.000.000/0001-00",
  descricao:
    "Barbearia em Curitiba especializada em corte masculino, barba de navalha e degradê. Agende online em segundos e conheça o Clube d'Ouro.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://navalhadeouro.com.br").replace(/\/$/, ""),
  whatsapp: "5541988063503",
  telefone: "(41) 98806-3503",
  email: "contato@navalhadeouro.com.br",
  emailPrivacidade: "privacidade@navalhadeouro.com.br",
  instagram: "https://instagram.com/navalhadeouro",
  instagramUser: "@navalhadeouro",
  endereco: {
    rua: "Rua Exemplo, 123",
    bairro: "Centro",
    cidade: "Curitiba",
    uf: "PR",
    cep: "80000-000",
  },
  geo: { lat: -25.4296, lng: -49.2713 },
  fundacao: 2015,
  horarios: [
    { dias: "Segunda a sexta", abre: "09:00", fecha: "20:00", schema: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    { dias: "Sábado", abre: "08:00", fecha: "18:00", schema: ["Saturday"] },
  ],
  atualizacaoLegal: "21 de novembro de 2026",
} as const;

export const servicos = [
  { id: "corte", nome: "Corte assinatura", descricao: "Consultoria, lavagem e finalização", preco: 55, minutos: 45 },
  { id: "barba", nome: "Barba de navalha", descricao: "Toalha quente e óleos essenciais", preco: 45, minutos: 30 },
  { id: "ritual", nome: "Ritual completo", descricao: "Corte, barba e massagem facial", preco: 90, minutos: 75 },
  { id: "degrade", nome: "Degradê", descricao: "Do zero ao topo, sem marcas", preco: 50, minutos: 40 },
  { id: "pigmentacao", nome: "Pigmentação", descricao: "Cobertura natural e duradoura", preco: 35, minutos: 20 },
  { id: "sobrancelha", nome: "Sobrancelha", descricao: "Alinhamento discreto na navalha", preco: 20, minutos: 10 },
] as const;

export type ServicoId = (typeof servicos)[number]["id"];

export const whatsappLink = (texto?: string) =>
  `https://wa.me/${site.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
