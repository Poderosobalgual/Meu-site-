import { NextResponse } from "next/server";
import { Resend } from "resend";
import * as Sentry from "@sentry/nextjs";
import { agendamentoSchema, escapeHtml } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { verificarTurnstile } from "@/lib/turnstile";
import { servicos, site } from "@/lib/site";

export const runtime = "nodejs";

const canais = { whatsapp: "WhatsApp", ligacao: "Ligação", email: "E-mail" } as const;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconhecido";

  // Bloqueia pedidos de outros sites
  const origem = req.headers.get("origin");
  if (origem && new URL(origem).host !== req.headers.get("host")) {
    return NextResponse.json({ erro: "Origem não permitida." }, { status: 403 });
  }

  if (!rateLimit(ip).ok) {
    return NextResponse.json({ erro: "Muitas tentativas. Tente de novo em alguns minutos." }, { status: 429 });
  }

  const tamanho = Number(req.headers.get("content-length") ?? 0);
  if (tamanho > 10_000) {
    return NextResponse.json({ erro: "Pedido grande demais." }, { status: 413 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ erro: "Dados inválidos." }, { status: 400 });
  }

  const parsed = agendamentoSchema.safeParse(json);
  if (!parsed.success) {
    const primeiro = parsed.error.issues[0];
    return NextResponse.json(
      { erro: primeiro?.message ?? "Dados inválidos.", campo: primeiro?.path[0] },
      { status: 422 },
    );
  }
  const d = parsed.data;

  if (!(await verificarTurnstile(d.turnstileToken, ip))) {
    return NextResponse.json({ erro: "Não conseguimos confirmar que você não é um robô. Recarregue a página." }, { status: 400 });
  }

  const servico = servicos.find((s) => s.id === d.servico)!;
  const dataBR = new Date(`${d.data}T12:00:00-03:00`).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: "America/Sao_Paulo",
  });

  const linhas: [string, string][] = [
    ["Nome", d.nome],
    ["Serviço", `${servico.nome} (R$ ${servico.preco})`],
    ["Dia", dataBR],
    ["Horário", d.hora],
    ["Confirmar por", canais[d.canal]],
    ["Telefone", d.telefone || "—"],
    ["E-mail", d.email || "—"],
    ["Estilo do quiz", d.estilo || "—"],
  ];

  const html = `<div style="font-family:Arial,sans-serif;max-width:520px">
<h2 style="color:#9a7a3a">Novo pedido de agendamento</h2>
<table cellpadding="8" style="border-collapse:collapse;width:100%">
${linhas.map(([k, v]) => `<tr><td style="border-bottom:1px solid #eee;color:#666">${k}</td><td style="border-bottom:1px solid #eee"><b>${escapeHtml(v)}</b></td></tr>`).join("")}
</table>
<p style="color:#888;font-size:12px">Enviado pelo site ${escapeHtml(site.url)}. O cliente aceitou a Política de Privacidade.</p></div>`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[dev] Agendamento recebido (RESEND_API_KEY ausente):", linhas);
      return NextResponse.json({ ok: true, dev: true });
    }
    Sentry.captureMessage("RESEND_API_KEY não configurada");
    return NextResponse.json({ erro: "Agendamento indisponível no momento. Chame no WhatsApp." }, { status: 503 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? `Site <onboarding@resend.dev>`,
      to: [process.env.EMAIL_TO ?? site.email],
      replyTo: d.email || undefined,
      subject: `Agendamento: ${d.nome.slice(0, 40)} · ${d.data} ${d.hora}`,
      html,
      text: linhas.map(([k, v]) => `${k}: ${v}`).join("\n"),
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (e) {
    Sentry.captureException(e);
    return NextResponse.json({ erro: "Não foi possível enviar agora. Tente de novo ou chame no WhatsApp." }, { status: 502 });
  }
}
