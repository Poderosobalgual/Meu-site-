import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/Legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Regras de uso do site, agendamentos, cancelamentos e do Clube d'Ouro da barbearia Navalha d'Ouro.",
  alternates: { canonical: "/termos" },
};

export default function Termos() {
  return (
    <LegalPage titulo="Termos de Uso" atualizado={site.atualizacaoLegal}>
      <h2>1. Aceitação</h2>
      <p>Ao usar este site, você concorda com estes Termos e com a nossa <Link href="/privacidade">Política de Privacidade</Link>. O site pertence à {site.razaoSocial}, CNPJ {site.cnpj}.</p>

      <h2>2. Agendamentos</h2>
      <ul>
        <li>O pedido feito pelo site é uma <strong>solicitação de reserva</strong>. O horário só fica garantido depois da nossa confirmação.</li>
        <li>Os horários mostrados no site são uma referência e podem mudar conforme a agenda real.</li>
        <li>Pedimos que você chegue com 5 minutos de antecedência. Atrasos acima de 15 minutos podem exigir remarcação.</li>
      </ul>

      <h2>3. Cancelamento e remarcação</h2>
      <p>Você pode cancelar ou remarcar sem custo até <strong>2 horas antes</strong> do horário, pelo WhatsApp {site.telefone}. Faltas repetidas sem aviso podem levar à exigência de confirmação antecipada nos próximos agendamentos.</p>

      <h2>4. Preços e pagamento</h2>
      <p>Os preços estão em reais e podem mudar sem aviso prévio. Vale o preço em vigor no dia do atendimento. O pagamento é feito presencialmente, por Pix, cartão ou dinheiro.</p>

      <h2>5. Clube d&apos;Ouro (assinatura)</h2>
      <ul>
        <li>A assinatura é mensal, com renovação automática, e pode ser cancelada a qualquer momento. O cancelamento vale até o fim do período já pago.</li>
        <li>O benefício de serviços ilimitados é pessoal e intransferível, limitado a um atendimento por dia.</li>
        <li>As regras completas são entregues por escrito no momento da adesão, conforme o Código de Defesa do Consumidor.</li>
      </ul>

      <h2>6. Quiz de estilo</h2>
      <p>A recomendação do quiz é uma sugestão automática e não substitui a avaliação do barbeiro no atendimento.</p>

      <h2>7. Uso adequado do site</h2>
      <p>Não é permitido enviar informações falsas, usar robôs, tentar burlar as proteções do site ou fazer agendamentos em nome de outras pessoas sem autorização.</p>

      <h2>8. Propriedade intelectual</h2>
      <p>Textos, marca, logotipo e layout deste site pertencem à {site.nome} e não podem ser copiados sem autorização.</p>

      <h2>9. Responsabilidade</h2>
      <p>Fazemos o possível para manter o site no ar e com informações corretas, mas ele pode ficar indisponível temporariamente. Não respondemos por serviços de terceiros, como WhatsApp e Google Maps.</p>

      <h2>10. Direitos do consumidor</h2>
      <p>Nada nestes Termos limita os seus direitos previstos no Código de Defesa do Consumidor (Lei nº 8.078/1990).</p>

      <h2>11. Lei e foro</h2>
      <p>Estes Termos seguem as leis brasileiras. Eventuais conflitos serão resolvidos no foro do domicílio do consumidor.</p>
      <p>Contato: <a href={`mailto:${site.email}`}>{site.email}</a> · WhatsApp {site.telefone}.</p>
    </LegalPage>
  );
}
