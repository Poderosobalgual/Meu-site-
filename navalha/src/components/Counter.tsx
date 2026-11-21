"use client";
import { useEffect, useRef, useState } from "react";

export function Counter({ valor, decimais = 0, sufixo = "" }: { valor: number; decimais?: number; sufixo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [atual, setAtual] = useState(valor);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAtual(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const passo = (t: number) => {
        const k = Math.min((t - t0) / 1800, 1);
        setAtual(valor * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [valor]);

  const texto = decimais
    ? atual.toLocaleString("pt-BR", { minimumFractionDigits: decimais, maximumFractionDigits: decimais })
    : Math.round(atual).toLocaleString("pt-BR");
  return <span ref={ref}>{texto}{sufixo}</span>;
}
