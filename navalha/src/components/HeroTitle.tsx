"use client";
import { useEffect, useRef } from "react";

const partes = [
  { t: "A arte do ", ouro: false },
  { t: "corte perfeito", ouro: true },
];

export function HeroTitle() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const h = ref.current;
    if (!h || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight) return;
      h.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      h.style.opacity = String(1 - window.scrollY / (window.innerHeight * 0.9));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  let i = 0;
  return (
    <h1 ref={ref} className="font-serif text-6xl font-medium leading-[0.95] sm:text-7xl md:text-8xl lg:text-[7rem]">
      <span className="sr-only">Navalha d&apos;Ouro: barbearia em Curitiba. A arte do corte perfeito.</span>
      <span aria-hidden="true">
        {partes.map((p) => (
          <span key={p.t} className={p.ouro ? "italic text-ouro" : ""}>
            {[...p.t].map((c) => (
              <span key={i} className="letra" style={{ animationDelay: `${i++ * 35}ms` }}>
                {c === " " ? " " : c}
              </span>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}
