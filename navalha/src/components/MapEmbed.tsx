"use client";
import { useState } from "react";
import { useConsent } from "./Consent";
import { site } from "@/lib/site";

export function MapEmbed() {
  const { escolha } = useConsent();
  const [liberado, setLiberado] = useState(false);
  const e = site.endereco;
  const q = encodeURIComponent(`${e.rua}, ${e.bairro}, ${e.cidade} - ${e.uf}`);

  if (escolha === "todos" || liberado) {
    return (
      <iframe
        title={`Mapa: ${site.nome}`}
        src={`https://www.google.com/maps?q=${q}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full min-h-[340px] w-full rounded-3xl border-0 [filter:grayscale(1)_invert(.92)_contrast(.9)]"
      />
    );
  }
  return (
    <div className="grid h-full min-h-[340px] place-items-center rounded-3xl border border-dashed border-linha bg-cartao p-8 text-center text-sm text-mudo">
      <div>
        <p>O mapa é fornecido pelo Google, que pode usar cookies.</p>
        <button className="btn-ghost mt-5" onClick={() => setLiberado(true)}>Mostrar mapa</button>
      </div>
    </div>
  );
}
