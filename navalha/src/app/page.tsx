import { servicos, site } from "@/lib/site";
import { HeroTitle } from "@/components/HeroTitle";
import { Particles } from "@/components/Particles";
import { Counter } from "@/components/Counter";
import { ClubCard } from "@/components/ClubCard";
import { StyleQuiz } from "@/components/StyleQuiz";
import { BookingForm } from "@/components/BookingForm";
import { MapEmbed } from "@/components/MapEmbed";

const numeros = [
  { v: 12000, s: "+", l: "Cortes feitos" },
  { v: 4.9, d: 1, l: "Nota no Google" },
  { v: 6, l: "Barbeiros" },
  { v: new Date().getFullYear() - site.fundacao, l: "Anos de casa" },
];

const depoimentos = [
  { t: "Melhor degradê da cidade. E o café é coisa séria.", a: "Cliente desde 2019" },
  { t: "Entrei no clube e nunca mais fiquei sem horário.", a: "Membro do Clube d'Ouro" },
  { t: "O quiz acertou em cheio. Mudou meu visual.", a: "Novo cliente" },
];

const galeria = [
  "Foto 1200×900: fachada da barbearia à noite",
  "Foto 1200×900: barbeiro finalizando um degradê",
  "Foto 1200×900: interior, cadeiras e espelhos",
  "Foto 1200×900: barba sendo feita com toalha quente",
];

const marquee = ["Corte assinatura", "Barba de navalha", "Ritual completo", "Clube d'Ouro", "Café coado na hora"];

export default function Home() {
  const e = site.endereco;
  return (
    <>
      {/* HERO */}
      <section className="relative grid min-h-[100svh] place-items-center overflow-hidden px-5 pb-20 pt-32 text-center [background:radial-gradient(ellipse_at_50%_30%,rgba(201,164,92,.16),transparent_60%)]">
        <Particles />
        <div className="relative">
          <p className="tag">Barbearia em Curitiba · Desde {site.fundacao}</p>
          <HeroTitle />
          <p className="mx-auto mb-10 mt-7 max-w-xl text-lg text-mudo">
            Um ritual de cuidado masculino no centro de Curitiba. Ambiente reservado, café coado na hora e barbeiros que tratam cada detalhe como assinatura.
          </p>
          <div className="flex flex-wrap justify-center gap-3 motion-safe:animate-[sobe_1s_.6s_both]">
            <a href="#agendar" className="btn">Reservar horário →</a>
            <a href="#estilo" className="btn-ghost">Descobrir meu estilo</a>
          </div>
        </div>
      </section>

      {/* LETREIRO */}
      <div className="overflow-hidden whitespace-nowrap border-y border-linha py-5" aria-hidden="true">
        <div className="letreiro inline-block font-serif text-3xl italic text-mudo">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i}><span className="mx-7">{m}</span><span className="not-italic text-ouro">✦</span></span>
          ))}
        </div>
      </div>

      {/* NÚMEROS */}
      <section aria-label="Números da barbearia" className="grid grid-cols-2 border-b border-linha md:grid-cols-4">
        {numeros.map((n, i) => (
          <div key={n.l} className="rev border-linha px-3 py-10 text-center [&:not(:last-child)]:border-r" style={{ transitionDelay: `${i * 120}ms` }}>
            <p className="font-serif text-5xl text-ouro"><Counter valor={n.v} decimais={n.d} sufixo={n.s} /></p>
            <p className="mt-1 text-xs uppercase tracking-widest text-mudo">{n.l}</p>
          </div>
        ))}
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="scroll-mt-24 py-28">
        <div className="wrap">
          <p className="tag rev">O cardápio</p>
          <h2 className="titulo rev">Serviços <em className="text-ouro">assinados</em></h2>
          <ul className="mt-12 grid gap-px border border-linha bg-linha md:grid-cols-2 lg:grid-cols-3">
            {servicos.map((s, i) => (
              <li key={s.id} className="rev group relative flex items-end justify-between gap-4 overflow-hidden bg-fundo p-8 transition hover:bg-fundo2" style={{ transitionDelay: `${(i % 3) * 120}ms` }}>
                <div>
                  <h3 className="font-serif text-2xl">{s.nome}</h3>
                  <p className="text-sm text-mudo">{s.descricao} · {s.minutos} min</p>
                </div>
                <p className="whitespace-nowrap font-serif text-3xl text-ouro transition group-hover:scale-110">R$ {s.preco}</p>
                <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 w-0 bg-ouro transition-all duration-500 group-hover:w-full" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CLUBE */}
      <section id="clube" className="scroll-mt-24 bg-fundo2 py-28">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <div className="rev rev-esq"><ClubCard /></div>
          <div className="rev rev-dir">
            <p className="tag">Assinatura mensal</p>
            <h2 className="titulo">Seja <em className="text-ouro">membro</em>, não cliente.</h2>
            <p className="mt-4 text-mudo">Para quem leva o visual a sério: você nunca mais paga por corte e ainda tem regalias exclusivas.</p>
            <ul className="my-7 divide-y divide-linha">
              {["Cortes e barba ilimitados (1 por dia)", "Horário prioritário: os melhores horários são seus", "Uma bebida da casa por visita", "Leve um amigo grátis no seu aniversário"].map((b) => (
                <li key={b} className="flex gap-3 py-3 text-[#cfcdc8]"><span className="text-ouro" aria-hidden="true">✦</span>{b}</li>
              ))}
            </ul>
            <p className="font-serif text-5xl text-ouro">R$ 129<span className="font-sans text-base text-mudo"> /mês</span></p>
            <a className="btn mt-6" href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Olá! Quero ser membro do Clube d'Ouro. Como funciona?")}`} target="_blank" rel="noopener noreferrer">
              Quero ser membro →
            </a>
          </div>
        </div>
      </section>

      {/* QUIZ */}
      <section id="estilo" className="scroll-mt-24 py-28 text-center">
        <div className="wrap">
          <p className="tag rev">Consultoria grátis</p>
          <h2 className="titulo rev">Qual corte combina <em className="text-ouro">com você?</em></h2>
          <p className="rev mt-4 text-mudo">Responda 3 perguntas e receba a sugestão do nosso mestre barbeiro.</p>
          <StyleQuiz />
        </div>
      </section>

      {/* GALERIA (placeholders) */}
      <section aria-label="Galeria" className="pb-28">
        <div className="wrap grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galeria.map((g, i) => (
            // Troque cada div por <Image src="/fotos/x.webp" alt="..." width={1200} height={900} sizes="(max-width:640px) 100vw, 25vw" />
            <div key={g} role="img" aria-label={g.split(": ")[1]} className="rev grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-linha bg-cartao p-4 text-center text-xs text-mudo" style={{ transitionDelay: `${i * 100}ms` }}>
              {g}
            </div>
          ))}
        </div>
      </section>

      {/* AGENDAR */}
      <section id="agendar" className="scroll-mt-24 bg-fundo2 py-28">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div className="rev rev-esq">
            <p className="tag">Agendamento online</p>
            <h2 className="titulo">Reserve seu <em className="text-ouro">horário</em></h2>
            <p className="mb-6 mt-4 text-mudo">Escolha o serviço, o dia e o horário. Depois diga como prefere confirmar: a gente cuida do resto.</p>
            <ul className="space-y-1 text-mudo">
              {site.horarios.map((h) => <li key={h.dias}>{h.dias} · {h.abre} às {h.fecha}</li>)}
              <li>Domingo · fechado</li>
            </ul>
          </div>
          <BookingForm />
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-28">
        <div className="wrap">
          <p className="tag rev">Quem já sentou na cadeira</p>
          <h2 className="titulo rev">O que dizem <em className="text-ouro">por aí</em></h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {depoimentos.map((d, i) => (
              <figure key={d.a} className="rev rounded-2xl border border-linha bg-cartao p-7 transition duration-500 hover:-translate-y-2 hover:border-ouro" style={{ transitionDelay: `${i * 150}ms` }}>
                <blockquote className="font-serif text-2xl italic">&ldquo;{d.t}&rdquo;</blockquote>
                <figcaption className="mt-4 text-xs uppercase tracking-widest text-ouro">— {d.a}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL */}
      <section id="local" className="scroll-mt-24 pb-28">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="rev rev-esq">
            <p className="tag">Onde estamos</p>
            <h2 className="titulo">Venha nos <em className="text-ouro">visitar</em></h2>
            <p className="mt-6 text-mudo"><b className="block text-texto">Endereço</b>{e.rua} · {e.bairro}<br />{e.cidade} · {e.uf}</p>
            <p className="mt-5 text-mudo"><b className="block text-texto">Contato</b>{site.telefone}<br />{site.instagramUser}</p>
          </div>
          <div className="rev rev-dir"><MapEmbed /></div>
        </div>
      </section>
    </>
  );
}
