"use client";
import { useRef } from "react";

export function ClubCard() {
  const ref = useRef<HTMLDivElement>(null);
  const mover = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
  };
  return (
    <div
      ref={ref}
      onMouseMove={mover}
      onMouseLeave={() => ref.current && (ref.current.style.transform = "")}
      role="img"
      aria-label="Cartão de membro do Clube d'Ouro"
      className="cartao-brilho relative flex aspect-[1.6] flex-col justify-between rounded-2xl border border-ouro/40 bg-gradient-to-br from-[#232018] via-[#0e0e0f] to-[#2a2416] p-7 shadow-[0_30px_80px_rgba(0,0,0,.6)] transition-transform duration-200 ease-out"
    >
      <div className="flex justify-between text-xs tracking-[0.25em] text-ouro"><span>CLUBE D&apos;OURO</span><span>MEMBRO</span></div>
      <p className="font-serif text-3xl">Seu Nome</p>
      <div className="flex justify-between text-xs text-mudo"><span>Nº 0247</span><span>Válido o ano todo</span></div>
    </div>
  );
}
