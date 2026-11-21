"use client";
import { useEffect, useState } from "react";

type P = { left: number; dur: number; delay: number; size: number };

export function Particles() {
  const [ps, setPs] = useState<P[]>([]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPs(Array.from({ length: 26 }, () => ({ left: Math.random() * 100, dur: 8 + Math.random() * 10, delay: -Math.random() * 15, size: 1 + Math.random() * 2.5 })));
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {ps.map((p, i) => (
        <span key={i} className="particula" style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />
      ))}
    </div>
  );
}
