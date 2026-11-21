import type { Metadata } from "next";
import { LegalPage } from "@/components/Legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Navalha d'Ouro coleta, usa e protege seus dados pessoais, conforme a LGPD (Lei 13.709/2018).",
  alternates: { canonical: "/privacidade" },
};

export default function Privacidade() {
  const e = site.endereco;
  return (
    <LegalPage titulo="Política de Privacidade" atualizado={site.atualizacaoLegal}>
      <p className="rounded-r-xl border-l-4 border-ouro bg-cartao p-4 text-mudo">
        Resumo: só pedimos os dados necessários para marcar seu horário. Não vendemos seus dados e você pode pedir para apagá-los a qualquer momento.
      </p>

      <h2 id="quem">1. Quem somos</h2>
      <p>Esta política vale para o site <strong>{site.url.replace("https://", "")}</strong>, da <strong>{site.razaoSocial}</strong>, CNPJ {site.cnpj}, com sede na {e.rua}, {e.bairro}, {e.cidade}/{e.uf}, CEP {e.cep}. Para a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018), somos o <strong>controlador</strong> dos seus dados pessoais.</p>
      <p>Nosso <strong>encarregado pelo tratamento de dados (DPO)</strong> atende pelo e-mail <a href={`mailto:${site.emailPrivacidade}`}>{site.emailPrivacidade}</a>.</p>

      <h2 id="dados">2. Quais dados coletamos</h2>
      <table>
        <thead><tr><th>Dado</th><th>Quando</th></tr></thead>
        <tbody>
          <tr><td>Nome, telefone e/ou e-mail</td><td>Ao preencher o formulário de agendamento</td></tr>
          <tr><td>Serviço, dia, horário e estilo escolhidos</td><td>No agendamento</td></tr>
          <tr><td>Respostas do quiz de estilo</td><td>Ficam só no seu navegador e não são enviadas, a menos que você agende o corte sugerido</td></tr>
          <tr><td>Endereço IP e dados técnicos de acesso</td><td>Automaticamente, para segurança (anti-spam) e registro de erros</td></tr>
          <tr><td>Dados de navegação (páginas vistas, aparelho, cidade aproximada)</td><td>Somente se você aceitar os cookies de análise (Google Analytics)</td></tr>
        </tbody>
      </table>
      <p>Não coletamos dados sensíveis (como saúde, religião ou biometria) nem dados bancários pelo site.</p>

      <h2 id="uso">3. Para que usamos e base legal</h2>
      <table>
        <thead><tr><th>Finalidade</th><th>Base legal (art. 7º da LGPD)</th></tr></thead>
        <tbody>
          <tr><td>Marcar, confirmar, remarcar ou cancelar seu horário</td><td>Procedimentos preliminares de contrato, a pedido do titular (inciso V)</td></tr>
          <tr><td>Responder dúvidas e pedidos sobre o Clube d&apos;Ouro</td><td>Procedimentos preliminares de contrato (inciso V)</td></tr>
          <tr><td>Proteger o site contra spam e ataques (captcha, limite de envios)</td><td>Legítimo interesse (inciso IX)</td></tr>
          <tr><td>Medir visitas para melhorar o site</td><td>Consentimento (inciso I), que pode ser retirado a qualquer momento</td></tr>
          <tr><td>Cumprir obrigações fiscais e legais</td><td>Cumprimento de obrigação legal (inciso II)</td></tr>
        </tbody>
      </table>

      <h2 id="compartilhamento">4. Com quem compartilhamos</h2>
      <p>Não vendemos nem alugamos seus dados. Eles são tratados por fornecedores que nos ajudam a operar o site (operadores, na linguagem da LGPD):</p>
      <ul>
        <li><strong>Vercel</strong>: hospedagem do site;</li>
        <li><strong>Resend</strong>: envio do seu pedido de agendamento para o nosso e-mail;</li>
        <li><strong>Cloudflare Turnstile</strong>: verificação anti-robô no formulário;</li>
        <li><strong>Sentry</strong>: registro de erros técnicos do site;</li>
        <li><strong>Google</strong>: Analytics e mapa, somente se você permitir;</li>
        <li><strong>WhatsApp (Meta)</strong>: se você escolher falar conosco por lá;</li>
        <li><strong>Autoridades públicas</strong>, quando exigido por lei ou ordem judicial.</li>
      </ul>
      <p>Alguns desses fornecedores armazenam dados fora do Brasil, em geral nos Estados Unidos. Essas transferências seguem o art. 33 da LGPD, com cláusulas contratuais de proteção de dados.</p>

      <h2 id="tempo">5. Por quanto tempo guardamos</h2>
      <p>Os dados do agendamento ficam guardados por até <strong>12 meses</strong> depois do último atendimento, para histórico de cliente. Depois disso, são apagados ou anonimizados, exceto quando a lei exigir guardar por mais tempo (por exemplo, documentos fiscais, por 5 anos). Os dados do Google Analytics são mantidos por 14 meses.</p>

      <h2 id="direitos">6. Seus direitos</h2>
      <p>Pelo art. 18 da LGPD, você pode, a qualquer momento e de graça:</p>
      <ul>
        <li>confirmar se tratamos seus dados e ter acesso a eles;</li>
        <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
        <li>pedir anonimização, bloqueio ou eliminação de dados desnecessários;</li>
        <li>pedir a portabilidade dos dados a outro fornecedor;</li>
        <li>pedir a eliminação dos dados tratados com base no seu consentimento;</li>
        <li>saber com quem compartilhamos seus dados;</li>
        <li>revogar o consentimento;</li>
        <li>reclamar à Autoridade Nacional de Proteção de Dados (<a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">ANPD</a>).</li>
      </ul>
      <p>Para exercer seus direitos, escreva para <a href={`mailto:${site.emailPrivacidade}`}>{site.emailPrivacidade}</a>. Respondemos em até 15 dias.</p>

      <h2 id="cookies">7. Cookies</h2>
      <p>Cookies e tecnologias parecidas (como o armazenamento local do navegador) são pequenos arquivos guardados no seu aparelho.</p>
      <table>
        <thead><tr><th>Tipo</th><th>Para que serve</th><th>Precisa de permissão?</th></tr></thead>
        <tbody>
          <tr><td>Essenciais</td><td>Lembrar sua escolha sobre cookies e proteger o formulário contra robôs (Cloudflare)</td><td>Não, são necessários para o site funcionar</td></tr>
          <tr><td>Análise (Google Analytics: _ga, _ga_*)</td><td>Contar visitas e entender quais páginas são mais vistas, com IP anonimizado</td><td>Sim, só carregam se você clicar em &quot;Aceitar todos&quot;</td></tr>
          <tr><td>Terceiros (Google Maps)</td><td>Mostrar o mapa da barbearia</td><td>Sim, só com &quot;Aceitar todos&quot; ou ao clicar em &quot;Mostrar mapa&quot;</td></tr>
        </tbody>
      </table>
      <p>Não usamos cookies de publicidade. Você pode mudar sua escolha a qualquer momento em &quot;Preferências de cookies&quot;, no rodapé do site, ou apagar os cookies nas configurações do navegador.</p>

      <h2 id="seguranca">8. Segurança</h2>
      <p>Usamos conexão criptografada (HTTPS), cabeçalhos de segurança, verificação anti-robô, limite de envios e acesso restrito aos dados. Se houver um incidente de segurança relevante, avisaremos você e a ANPD, como manda a lei.</p>

      <h2 id="menores">9. Menores de idade</h2>
      <p>Agendamentos para menores de 18 anos devem ser feitos pelos pais ou responsáveis, que fornecem os dados em nome da criança ou adolescente (art. 14 da LGPD).</p>

      <h2 id="contato">10. Contato e alterações</h2>
      <p>Podemos atualizar esta política. A data da última versão fica no topo da página, e mudanças importantes serão avisadas no site.</p>
      <p>Dúvidas: <a href={`mailto:${site.emailPrivacidade}`}>{site.emailPrivacidade}</a> · WhatsApp {site.telefone}.</p>
    </LegalPage>
  );
}
