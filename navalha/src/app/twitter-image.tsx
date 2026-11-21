import { ImageResponse } from "next/og";

export const alt = "Navalha d'Ouro: barbearia em Curitiba. A arte do corte perfeito.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Gera automaticamente a imagem de prévia (WhatsApp, Instagram, Facebook, X).
export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 50% 30%, #3a2f1a, #0b0b0c 65%)", color: "#ecebe8", fontFamily: "serif" }}>
        <div style={{ fontSize: 26, letterSpacing: 10, color: "#c9a45c" }}>BARBEARIA · CURITIBA</div>
        <div style={{ fontSize: 110, marginTop: 20, display: "flex" }}>
          Navalha&nbsp;<span style={{ color: "#c9a45c" }}>d&apos;Ouro</span>
        </div>
        <div style={{ fontSize: 40, marginTop: 20, color: "#a3a19c", fontStyle: "italic" }}>A arte do corte perfeito</div>
      </div>
    ),
    size,
  );
}
