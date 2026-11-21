"use client";
import { useState } from "react";

const perguntas = [
  { q: "Qual o formato do seu rosto?", o: ["Redondo", "Quadrado", "Oval", "Alongado"] },
  { q: "Quanto tempo você gasta arrumando o cabelo?", o: ["Nada, acordo e saio", "Uns 5 minutos", "Gosto de caprichar"] },
  { q: "Qual vibe você quer passar?", o: ["Clássico e elegante", "Moderno e ousado", "Discreto e prático"] },
];

const estilos: Record<string, { nome: string; texto: string }> = {
  "Clássico e elegante": { nome: "Side Part Executivo", texto: "Risca lateral marcada, laterais curtas e topo com volume. Sofisticação do escritório ao jantar." },
  "Moderno e ousado": { nome: "Mid Fade Texturizado", texto: "Degradê médio com topo texturizado. Atual, marcante e cheio de personalidade." },
  "Discreto e prático": { nome: "Crew Cut", texto: "Curto, limpo e alinhado. Zero manutenção e sempre com cara de barbearia." },
};

export function StyleQuiz() {
  const [resp, setResp] = useState<string[]>([]);
  const fim = resp.length === perguntas.length;
  const estilo = fim ? estilos[resp[2]] : null;

  const agendar = () => {
    if (!estilo) return;
    window.dispatchEvent(new CustomEvent("estilo-escolhido", { detail: estilo.nome }));
    document.getElementById("agendar")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="rev mx-auto mt-12 max-w-2xl rounded-3xl border border-linha bg-cartao p-7 text-center sm:p-10" aria-live="polite">
      {!fim ? (
        <div key={resp.length} className="animate-[sobe_.5s_ease]">
          <p className="tag">Pergunta {resp.length + 1} de {perguntas.length}</p>
          <h3 className="mb-6 font-serif text-3xl">{perguntas[resp.length].q}</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {perguntas[resp.length].o.map((o) => (
              <button key={o} onClick={() => setResp([...resp, o])} className="rounded-full border border-linha px-5 py-3 transition hover:border-ouro hover:text-ouro">
                {o}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-[sobe_.5s_ease]">
          <p className="tag">Seu corte ideal</p>
          <h3 className="font-serif text-4xl text-ouro">{estilo!.nome}</h3>
          <p className="mx-auto mb-6 mt-3 max-w-md text-mudo">
            {estilo!.texto}
            {resp[1] === "Nada, acordo e saio" && " Vamos adaptar para ficar bom sem precisar de pomada."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={agendar} className="btn">Agendar esse corte →</button>
            <button onClick={() => setResp([])} className="btn-ghost">Refazer</button>
          </div>
        </div>
      )}
    </div>
  );
}
