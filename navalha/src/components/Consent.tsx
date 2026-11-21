"use client";
import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Escolha = "todos" | "essenciais" | null;
type Ctx = { escolha: Escolha; decidir: (e: Exclude<Escolha, null>) => void; abrir: () => void };

const ConsentContext = createContext<Ctx>({ escolha: null, decidir: () => {}, abrir: () => {} });
const CHAVE = "navalha-consentimento-v1";

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [escolha, setEscolha] = useState<Escolha>(null);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    let salvo: string | null = null;
    try { salvo = localStorage.getItem(CHAVE); } catch {}
    if (salvo === "todos" || salvo === "essenciais") setEscolha(salvo);
    else {
      const t = setTimeout(() => setAberto(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const decidir = useCallback((e: "todos" | "essenciais") => {
    try { localStorage.setItem(CHAVE, e); } catch {}
    setEscolha(e);
    setAberto(false);
    if (e === "essenciais") {
      // Remove cookies do Google Analytics se o usuário retirar o consentimento
      document.cookie.split(";").forEach((c) => {
        const nome = c.split("=")[0].trim();
        if (nome.startsWith("_ga")) document.cookie = `${nome}=; Max-Age=0; path=/; domain=.${location.hostname.replace(/^www\./, "")}`;
      });
    }
  }, []);

  return (
    <ConsentContext.Provider value={{ escolha, decidir, abrir: () => setAberto(true) }}>
      {children}
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby="cookie-titulo"
        aria-hidden={!aberto}
        className={`fixed inset-x-3 bottom-3 z-[120] max-w-md rounded-2xl border border-linha bg-cartao/95 p-5 text-sm text-[#cfcdc8] shadow-2xl backdrop-blur transition-transform duration-700 sm:left-5 sm:right-auto sm:bottom-5 ${aberto ? "translate-y-0" : "pointer-events-none translate-y-[140%]"}`}
      >
        <p id="cookie-titulo" className="mb-1 font-serif text-2xl text-texto">Sua privacidade importa</p>
        <p>
          Usamos o essencial para o site funcionar. Com sua permissão, também usamos o Google Analytics (para entender as visitas) e o
          mapa do Google. Saiba mais na <Link href="/privacidade#cookies" className="text-ouro underline">Política de Cookies</Link>.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn px-5 py-2.5" onClick={() => decidir("todos")} tabIndex={aberto ? 0 : -1}>Aceitar todos</button>
          <button className="btn-ghost px-5 py-2.5" onClick={() => decidir("essenciais")} tabIndex={aberto ? 0 : -1}>Só essenciais</button>
        </div>
      </div>
    </ConsentContext.Provider>
  );
}

export const useConsent = () => useContext(ConsentContext);

export function BotaoPreferencias() {
  const { abrir } = useConsent();
  return <button onClick={abrir} className="text-left hover:text-ouro">Preferências de cookies</button>;
}
