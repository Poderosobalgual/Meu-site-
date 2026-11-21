import Link from "next/link";

export const metadata = { title: "Página não encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="grid min-h-[80svh] place-items-center px-5 pt-24 text-center">
      <div>
        <p className="font-serif text-[8rem] leading-none text-ouro motion-safe:animate-bounce">404</p>
        <h1 className="mt-4 font-serif text-4xl">Esse corte não existe por aqui</h1>
        <p className="mb-8 mt-3 text-mudo">A página que você procura foi movida ou nunca existiu.</p>
        <Link href="/" className="btn">Voltar ao início</Link>
      </div>
    </section>
  );
}
