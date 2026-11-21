"use client";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function Erro({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { Sentry.captureException(error); }, [error]);
  return (
    <section className="grid min-h-[80svh] place-items-center px-5 pt-24 text-center">
      <div>
        <p className="font-serif text-[8rem] leading-none text-ouro">500</p>
        <h1 className="mt-4 font-serif text-4xl">Algo deu errado do nosso lado</h1>
        <p className="mb-8 mt-3 text-mudo">Já fomos avisados do problema. Tente de novo ou chame a gente no WhatsApp.</p>
        <button onClick={reset} className="btn">Tentar de novo</button>
      </div>
    </section>
  );
}
