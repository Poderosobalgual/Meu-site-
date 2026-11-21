"use client";
import Script from "next/script";
import { useConsent } from "./Consent";

// Google Analytics 4: só é carregado depois que o visitante clica em "Aceitar todos".
export function Analytics() {
  const { escolha } = useConsent();
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id || escolha !== "todos") return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
