import Link from "next/link";
import { site, whatsappLink } from "@/lib/site";
import { BotaoPreferencias } from "./Consent";

export function Footer() {
  const e = site.endereco;
  return (
    <footer className="border-t border-linha pb-28 pt-16 text-sm text-mudo">
      <div className="wrap grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl font-bold text-texto">Navalha <span className="text-ouro">d&apos;Ouro</span></p>
          <p className="mt-3">Barbearia e cuidado masculino desde {site.fundacao}.</p>
          <p className="mt-3">{site.razaoSocial}<br />CNPJ {site.cnpj}</p>
        </div>
        <div>
          <h2 className="tag">Visite</h2>
          <address className="not-italic">{e.rua} · {e.bairro}<br />{e.cidade} · {e.uf} · {e.cep}</address>
          <ul className="mt-3 space-y-1">
            {site.horarios.map((h) => <li key={h.dias}>{h.dias}: {h.abre}–{h.fecha}</li>)}
            <li>Domingo: fechado</li>
          </ul>
        </div>
        <div>
          <h2 className="tag">Contato</h2>
          <ul className="space-y-2">
            <li><a className="hover:text-ouro" href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp {site.telefone}</a></li>
            <li><a className="hover:text-ouro" href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><a className="hover:text-ouro" href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram {site.instagramUser}</a></li>
          </ul>
        </div>
        <div>
          <h2 className="tag">Legal</h2>
          <ul className="space-y-2">
            <li><Link className="hover:text-ouro" href="/privacidade">Política de Privacidade</Link></li>
            <li><Link className="hover:text-ouro" href="/termos">Termos de Uso</Link></li>
            <li><Link className="hover:text-ouro" href="/privacidade#cookies">Política de Cookies</Link></li>
            <li><BotaoPreferencias /></li>
            <li><Link className="hover:text-ouro" href="/privacidade#direitos">Seus direitos (LGPD)</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap mt-12 flex flex-col gap-2 border-t border-linha pt-6 text-xs sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {site.nome}. Todos os direitos reservados.</p>
        <p>Encarregado de dados (DPO): <a className="text-ouro" href={`mailto:${site.emailPrivacidade}`}>{site.emailPrivacidade}</a></p>
      </div>
    </footer>
  );
}
