import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { ConsentProvider } from "@/components/Consent";
import { Analytics } from "@/components/Analytics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { RevealObserver } from "@/components/Reveal";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "700"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Navalha d'Ouro · Barbearia em Curitiba | Corte, Barba e Degradê", template: "%s · Navalha d'Ouro" },
  description: site.descricao,
  applicationName: site.nome,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "pt_BR", siteName: site.nome, url: "/" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0b0b0c", colorScheme: "dark" };

const e = site.endereco;
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  "@id": `${site.url}/#barbearia`,
  name: site.nome,
  legalName: site.razaoSocial,
  description: site.descricao,
  url: site.url,
  logo: `${site.url}/icon.svg`,
  image: `${site.url}/opengraph-image`,
  telephone: "+" + site.whatsapp,
  email: site.email,
  priceRange: "R$ 20 - R$ 129",
  foundingDate: String(site.fundacao),
  address: { "@type": "PostalAddress", streetAddress: e.rua, addressLocality: e.cidade, addressRegion: e.uf, postalCode: e.cep, addressCountry: "BR" },
  geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
  openingHoursSpecification: site.horarios.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.schema, opens: h.abre, closes: h.fecha })),
  sameAs: [site.instagram],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#conteudo" className="fixed left-3 top-3 z-[200] -translate-y-24 rounded-lg bg-ouro px-4 py-2 font-bold text-[#111] focus:translate-y-0">
          Pular para o conteúdo
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <ConsentProvider>
          <Header />
          <main id="conteudo">{children}</main>
          <Footer />
          <WhatsAppButton />
          <Analytics />
          <RevealObserver />
        </ConsentProvider>
      </body>
    </html>
  );
}
