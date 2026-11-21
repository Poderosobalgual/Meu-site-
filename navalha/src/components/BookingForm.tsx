"use client";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { servicos, whatsappLink } from "@/lib/site";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

type Canal = "whatsapp" | "ligacao" | "email";
type Estado = { tipo: "ocioso" } | { tipo: "enviando" } | { tipo: "ok" } | { tipo: "erro"; msg: string; campo?: string };

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function horariosDoDia(data: string) {
  if (!data) return [];
  const d = new Date(`${data}T00:00`);
  const dia = d.getDay();
  if (dia === 0) return [];
  const [ini, fim] = dia === 6 ? [8, 18] : [9, 20];
  const agora = new Date();
  const lista: { h: string; ok: boolean }[] = [];
  for (let x = ini; x < fim; x++) {
    for (const m of [0, 30]) {
      const slot = new Date(d);
      slot.setHours(x, m);
      lista.push({ h: `${String(x).padStart(2, "0")}:${m ? "30" : "00"}`, ok: slot.getTime() > agora.getTime() + 30 * 60 * 1000 });
    }
  }
  return lista;
}

export function BookingForm() {
  const [nome, setNome] = useState("");
  const [servico, setServico] = useState<string>(servicos[0].id);
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [canal, setCanal] = useState<Canal>("whatsapp");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [aceite, setAceite] = useState(false);
  const [estilo, setEstilo] = useState("");
  const [estado, setEstado] = useState<Estado>({ tipo: "ocioso" });
  const [token, setToken] = useState("");
  const tsRef = useRef<HTMLDivElement>(null);
  const tsId = useRef<string | undefined>(undefined);

  const { min, max } = useMemo(() => {
    const hoje = new Date();
    const lim = new Date();
    lim.setDate(lim.getDate() + 30);
    return { min: iso(hoje), max: iso(lim) };
  }, []);

  const horas = useMemo(() => horariosDoDia(data), [data]);
  const domingo = data && new Date(`${data}T00:00`).getDay() === 0;
  const s = servicos.find((x) => x.id === servico)!;

  useEffect(() => {
    const ouvir = (e: Event) => setEstilo((e as CustomEvent<string>).detail);
    window.addEventListener("estilo-escolhido", ouvir);
    return () => window.removeEventListener("estilo-escolhido", ouvir);
  }, []);

  const renderTurnstile = () => {
    if (!SITE_KEY || !window.turnstile || !tsRef.current || tsId.current) return;
    tsId.current = window.turnstile.render(tsRef.current, {
      sitekey: SITE_KEY,
      theme: "dark",
      language: "pt-br",
      callback: (t: string) => setToken(t),
      "expired-callback": () => setToken(""),
    });
  };

  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const honeypot = (e.currentTarget.elements.namedItem("empresa") as HTMLInputElement).value;
    if (!aceite) return setEstado({ tipo: "erro", msg: "Aceite a Política de Privacidade para continuar.", campo: "aceite" });
    if (!hora) return setEstado({ tipo: "erro", msg: "Escolha um horário.", campo: "hora" });
    if (SITE_KEY && !token) return setEstado({ tipo: "erro", msg: "Aguarde a verificação anti-robô terminar." });

    setEstado({ tipo: "enviando" });
    try {
      const r = await fetch("/api/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, servico, data, hora, canal, telefone, email, estilo, aceite, turnstileToken: token, empresa: honeypot }),
      });
      const json = (await r.json().catch(() => ({}))) as { erro?: string; campo?: string };
      if (!r.ok) {
        setEstado({ tipo: "erro", msg: json.erro ?? "Algo deu errado. Tente de novo.", campo: json.campo });
      } else {
        setEstado({ tipo: "ok" });
      }
    } catch {
      setEstado({ tipo: "erro", msg: "Sem conexão. Verifique sua internet e tente de novo." });
    } finally {
      window.turnstile?.reset(tsId.current);
      setToken("");
    }
  };

  if (estado.tipo === "ok") {
    return (
      <div className="rev on rounded-3xl border border-ouro/50 bg-cartao p-8 text-center" role="status">
        <p className="font-serif text-4xl text-ouro">Pedido recebido!</p>
        <p className="mt-3 text-mudo">
          Obrigado, {nome.split(" ")[0]}. Vamos confirmar seu horário de {data.split("-").reverse().join("/")} às {hora}{" "}
          {canal === "email" ? "por e-mail" : canal === "ligacao" ? "por ligação" : "pelo WhatsApp"} em breve.
        </p>
        <button className="btn-ghost mt-6" onClick={() => { setEstado({ tipo: "ocioso" }); setHora(""); }}>Fazer outro agendamento</button>
      </div>
    );
  }

  const erroEm = (c: string) => estado.tipo === "erro" && estado.campo === c;

  return (
    <form onSubmit={enviar} noValidate className="rev rev-dir rounded-3xl border border-linha bg-cartao p-6 sm:p-9" aria-describedby="form-status">
      {SITE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="lazyOnload" onReady={renderTurnstile} />
      )}

      {/* Campo-isca anti-spam: escondido de pessoas */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="empresa">Não preencha</label>
        <input id="empresa" name="empresa" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mb-6">
        <label htmlFor="nome" className="rotulo">Seu nome</label>
        <input id="nome" className="campo" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como podemos te chamar?" autoComplete="name" required minLength={2} maxLength={80} aria-invalid={erroEm("nome")} />
      </div>

      <div className="mb-6">
        <label htmlFor="servico" className="rotulo">Serviço</label>
        <select id="servico" className="campo" value={servico} onChange={(e) => setServico(e.target.value)}>
          {servicos.map((x) => <option key={x.id} value={x.id}>{x.nome} · R$ {x.preco}</option>)}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="data" className="rotulo">Dia</label>
        <input id="data" type="date" className="campo [color-scheme:dark]" min={min} max={max} value={data} onChange={(e) => { setData(e.target.value); setHora(""); }} required aria-invalid={erroEm("data")} />
      </div>

      <fieldset className="mb-6">
        <legend className="rotulo">Horário</legend>
        {!data && <p className="text-sm text-mudo">Escolha um dia primeiro.</p>}
        {domingo && <p className="text-sm text-[#e8907f]">Fechado aos domingos. Escolha outro dia.</p>}
        <div className="flex flex-wrap gap-2">
          {horas.map(({ h, ok }) => (
            <button
              type="button"
              key={h}
              disabled={!ok}
              aria-pressed={hora === h}
              onClick={() => setHora(h)}
              className={`rounded-lg border px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:line-through disabled:opacity-30 ${hora === h ? "border-ouro bg-ouro font-bold text-[#111]" : "border-linha bg-fundo hover:border-ouro"}`}
            >
              {h}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="rotulo">Como quer confirmar?</legend>
        <div className="flex flex-wrap gap-2">
          {([["whatsapp", "💬 WhatsApp"], ["ligacao", "📞 Me liguem"], ["email", "✉️ E-mail"]] as const).map(([v, l]) => (
            <button type="button" key={v} aria-pressed={canal === v} onClick={() => setCanal(v)}
              className={`rounded-lg border px-4 py-2.5 text-sm transition ${canal === v ? "border-ouro bg-ouro font-bold text-[#111]" : "border-linha bg-fundo hover:border-ouro"}`}>
              {l}
            </button>
          ))}
        </div>
      </fieldset>

      {canal === "email" ? (
        <div className="mb-6">
          <label htmlFor="email" className="rotulo">Seu e-mail</label>
          <input id="email" type="email" className="campo" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" autoComplete="email" maxLength={120} aria-invalid={erroEm("email")} />
        </div>
      ) : (
        <div className="mb-6">
          <label htmlFor="telefone" className="rotulo">Seu telefone (com DDD)</label>
          <input id="telefone" type="tel" inputMode="tel" className="campo" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(41) 90000-0000" autoComplete="tel" maxLength={20} aria-invalid={erroEm("telefone")} />
        </div>
      )}

      <label className="mb-5 flex cursor-pointer items-start gap-3 text-sm text-mudo">
        <input type="checkbox" checked={aceite} onChange={(e) => setAceite(e.target.checked)} className="mt-1 h-4 w-4 flex-none accent-ouro" aria-invalid={erroEm("aceite")} />
        <span>
          Li e concordo com a <Link href="/privacidade" className="text-ouro underline" target="_blank">Política de Privacidade</Link> e autorizo o uso dos meus dados apenas para agendar e confirmar meu horário.
        </span>
      </label>

      <div className="mb-5 rounded-xl border border-dashed border-linha bg-fundo p-4 text-sm text-mudo" aria-live="polite">
        <b className="text-texto">{nome || "Você"}</b> · {s.nome} (R$ {s.preco}){estilo && ` · estilo ${estilo}`}
        <br />
        {data ? new Date(`${data}T00:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" }) : "Dia a escolher"}
        {hora && <> às <b className="text-texto">{hora}</b></>}
      </div>

      <div ref={tsRef} className="mb-4 min-h-[65px]" />

      <p id="form-status" role="alert" className="mb-4 min-h-[1.25rem] text-sm text-[#e8907f]">
        {estado.tipo === "erro" && estado.msg}
      </p>

      <button type="submit" className="btn w-full" disabled={estado.tipo === "enviando"}>
        {estado.tipo === "enviando" ? "Enviando..." : "Confirmar reserva"}
      </button>
      <p className="mt-4 text-center text-xs text-mudo">
        Prefere conversar? <a className="text-ouro underline" href={whatsappLink("Olá! Quero agendar um horário.")} target="_blank" rel="noopener noreferrer">Chame no WhatsApp</a>
      </p>
    </form>
  );
}
