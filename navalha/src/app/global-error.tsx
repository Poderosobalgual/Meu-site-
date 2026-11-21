"use client";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => { Sentry.captureException(error); }, [error]);
  return (
    <html lang="pt-BR">
      <body style={{ background: "#0b0b0c", color: "#ecebe8", fontFamily: "system-ui", display: "grid", placeItems: "center", minHeight: "100vh", textAlign: "center", margin: 0 }}>
        <div>
          <h1 style={{ fontSize: "3rem", color: "#c9a45c" }}>Erro 500</h1>
          <p>O site teve um problema inesperado. Tente recarregar a página.</p>
          <a href="/" style={{ color: "#c9a45c" }}>Voltar ao início</a>
        </div>
      </body>
    </html>
  );
}
