"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/#clube", label: "Clube" },
  { href: "/#estilo", label: "Seu estilo" },
  { href: "/#local", label: "Onde estamos" },
];

export function Header() {
  const [solido, setSolido] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setSolido(window.scrollY > 60);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgresso(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${solido || menu ? "border-b border-linha bg-fundo/80 py-3 backdrop-blur-xl" : "py-6"}`}>
      <div className="absolute left-0 top-0 h-0.5 bg-gradient-to-r from-ouro to-ouro-claro" style={{ width: `${progresso}%` }} aria-hidden="true" />
      <div className="wrap flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold tracking-wide" aria-label="Navalha d'Ouro, página inicial">
          Navalha <span className="text-ouro">d&apos;Ouro</span>
        </Link>
        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-mudo transition hover:text-ouro">{l.label}</a>
          ))}
          <a href="/#agendar" className="btn px-5 py-2.5">Agendar</a>
        </nav>
        <button
          className="rounded-lg border border-linha px-3 py-2 text-sm md:hidden"
          aria-expanded={menu}
          aria-controls="menu-movel"
          onClick={() => setMenu((m) => !m)}
        >
          {menu ? "Fechar" : "Menu"}
        </button>
      </div>
      {menu && (
        <nav id="menu-movel" aria-label="Menu móvel" className="wrap mt-4 flex flex-col gap-4 pb-4 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenu(false)} className="text-lg">{l.label}</a>
          ))}
          <a href="/#agendar" onClick={() => setMenu(false)} className="btn">Agendar horário</a>
        </nav>
      )}
    </header>
  );
}
