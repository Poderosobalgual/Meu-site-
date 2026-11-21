import Link from "next/link";

export function LegalPage({ titulo, atualizado, children }: { titulo: string; atualizado: string; children: React.ReactNode }) {
  return (
    <article className="wrap max-w-3xl pb-24 pt-36 leading-relaxed text-[#cfcdc8] [&_a]:text-ouro [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-12 [&_h2]:scroll-mt-28 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-ouro [&_li]:mb-2 [&_p]:mb-4 [&_table]:my-4 [&_table]:w-full [&_table]:text-sm [&_td]:border [&_td]:border-linha [&_td]:p-3 [&_td]:align-top [&_th]:border [&_th]:border-linha [&_th]:bg-cartao [&_th]:p-3 [&_th]:text-left [&_th]:text-texto [&_ul]:list-disc [&_ul]:pl-6">
      <Link href="/" className="text-sm !no-underline">← Voltar ao site</Link>
      <h1 className="mt-6 font-serif text-5xl text-texto">{titulo}</h1>
      <p className="mb-10 mt-2 text-sm text-mudo">Última atualização: {atualizado}</p>
      {children}
    </article>
  );
}
