import { z } from "zod";
import { servicos } from "./site";

// Mensagens de erro padrão em português
z.config(z.locales.pt());

const ids = servicos.map((s) => s.id) as [string, ...string[]];

// Remove caracteres de controle e tags HTML; limita tamanho.
const texto = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/<[^>]*>/g, ""));

export const agendamentoSchema = z
  .object({
    nome: z.string({ message: "Digite seu nome." }).trim().max(80).transform((v) => v.replace(/[\u0000-\u001F\u007F]/g, " ").replace(/<[^>]*>/g, "")).pipe(z.string().min(2, "Digite seu nome.")),
    servico: z.enum(ids, { message: "Escolha um serviço." }),
    data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Escolha o dia."),
    hora: z.string().regex(/^([01]\d|2[0-3]):(00|30)$/, "Escolha um horário."),
    canal: z.enum(["whatsapp", "ligacao", "email"]),
    telefone: texto(20).optional().default(""),
    email: z.union([z.literal(""), z.email("E-mail inválido.").max(120)]).optional().default(""),
    estilo: texto(60).optional().default(""),
    aceite: z.literal(true, { message: "Aceite a Política de Privacidade para continuar." }),
    turnstileToken: z.string().max(2048).optional().default(""),
    // Campo-isca invisível: robôs preenchem, humanos não.
    empresa: z.string().max(0, "Dados inválidos.").optional().default(""),
  })
  .superRefine((d, ctx) => {
    const tel = d.telefone.replace(/\D/g, "");
    if ((d.canal === "whatsapp" || d.canal === "ligacao") && (tel.length < 10 || tel.length > 13)) {
      ctx.addIssue({ code: "custom", path: ["telefone"], message: "Informe um telefone com DDD." });
    }
    if (d.canal === "email" && !d.email) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "Informe seu e-mail." });
    }
    const dia = new Date(`${d.data}T12:00:00-03:00`);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + 31);
    if (Number.isNaN(dia.getTime()) || dia < hoje || dia > limite) {
      ctx.addIssue({ code: "custom", path: ["data"], message: "Escolha uma data nos próximos 30 dias." });
    } else if (dia.getUTCDay() === 0) {
      ctx.addIssue({ code: "custom", path: ["data"], message: "Fechado aos domingos." });
    }
  });

export type Agendamento = z.infer<typeof agendamentoSchema>;

/** Escapa texto antes de colocar em HTML (proteção contra XSS no e-mail). */
export function escapeHtml(v: string) {
  return v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
