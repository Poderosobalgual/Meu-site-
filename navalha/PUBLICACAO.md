# Como colocar o site no ar (passo a passo para iniciantes)

Tempo total: cerca de 1 a 2 horas, mais até 24 horas esperando o domínio propagar.

---

## 1. Criar as contas (todas grátis para começar)

| Serviço | Para quê | Link |
|---|---|---|
| GitHub | guardar o código | https://github.com |
| Vercel | hospedar o site | https://vercel.com (entre com o GitHub) |
| Registro.br | comprar o domínio .com.br | https://registro.br |
| Resend | enviar os agendamentos por e-mail | https://resend.com |
| Cloudflare | captcha Turnstile | https://dash.cloudflare.com |
| Sentry (opcional) | avisar quando o site der erro | https://sentry.io |
| Google Analytics (opcional) | contar visitas | https://analytics.google.com |

---

## 2. GitHub
O código já está no seu repositório `Meu-site-`, na pasta `navalha/`. Se o código estiver num branch separado, junte ao `main` (pull request → Merge) para a Vercel publicar a partir dele.

## 3. Vercel (hospedagem)
1. Em https://vercel.com, clique em **Add New → Project**.
2. Escolha o repositório **Meu-site-** e clique em **Import**.
3. Em **Root Directory**, clique em **Edit** e escolha a pasta **`navalha`**. Esse passo é importante.
4. O Framework fica como **Next.js** automaticamente.
5. Abra **Environment Variables** e cadastre as variáveis do passo 6. Pode cadastrar depois também.
6. Clique em **Deploy**. Em cerca de 1 minuto o site estará no ar num endereço `xxxx.vercel.app`.

A partir de agora, **todo `git push` no branch principal publica o site sozinho**. Branches diferentes viram links de prévia.

## 4. Domínio no Registro.br
1. Em https://registro.br, pesquise `navalhadeouro.com.br` (ou o nome que quiser).
2. Faça o cadastro com CPF ou CNPJ e pague (cerca de **R$ 40 por ano**).
3. Depois de ativo, entre em **Meus domínios → seu domínio → DNS → Editar zona** (use os DNS do próprio Registro.br).

## 5. Apontar o domínio para a Vercel (DNS)
1. Na Vercel: **Project → Settings → Domains → Add** e digite `navalhadeouro.com.br`.
2. Adicione também `www.navalhadeouro.com.br`, configurado para **redirecionar para** `navalhadeouro.com.br`.
3. A Vercel mostra os registros. No Registro.br, crie:

| Tipo | Nome | Valor |
|---|---|---|
| A | (vazio / @) | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

> Use os valores exatos que a Vercel mostrar na tela, porque eles podem mudar.

4. Espere de 10 minutos a 24 horas. Quando a Vercel mostrar **Valid Configuration**, está pronto.

**HTTPS:** a Vercel gera o certificado sozinha, de graça, e redireciona todo acesso `http://` para `https://`. O site também envia o cabeçalho HSTS. O `www` já é redirecionado para o domínio principal (painel da Vercel + `next.config.ts`).

## 6. Variáveis de ambiente (chaves secretas)
Na Vercel: **Settings → Environment Variables**. Cadastre cada uma e marque **Production** e **Preview**. **Nunca** coloque essas chaves no código nem no GitHub.

| Variável | Onde conseguir |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://navalhadeouro.com.br` |
| `RESEND_API_KEY` | Resend → API Keys → Create |
| `EMAIL_FROM` | `Site Navalha d'Ouro <site@navalhadeouro.com.br>` (depois de verificar o domínio no Resend, passo 8) |
| `EMAIL_TO` | o e-mail que vai receber os agendamentos |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `TURNSTILE_SECRET_KEY` | Cloudflare → Turnstile → Add widget → domínio `navalhadeouro.com.br`, modo **Managed** |
| `NEXT_PUBLIC_GA_ID` | Google Analytics → Admin → Fluxo de dados → ID `G-XXXXXXX` |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry → Create Project → Next.js → copie o DSN |
| `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | Sentry → Settings (opcional: deixa os erros legíveis) |

Depois de salvar, vá em **Deployments → ⋯ → Redeploy** para valer.

## 7. E-mail profissional (contato@seudominio)
Opções:
- **Zoho Mail**: plano grátis para 1 domínio (até 5 contas) ou cerca de R$ 6/usuário/mês.
- **Google Workspace**: cerca de R$ 30/usuário/mês, com Gmail profissional.

O serviço escolhido mostra os registros para criar no **Registro.br → DNS**:

| Tipo | Nome | Para quê |
|---|---|---|
| MX | (vazio) | receber e-mails (valores do Zoho ou Google) |
| TXT | (vazio) | **SPF**: `v=spf1 include:zoho.com include:amazonses.com ~all` (troque `zoho.com` por `_spf.google.com` se usar Google; `amazonses.com` é do Resend) |
| TXT | (nome indicado) | **DKIM**: assinatura do provedor de e-mail |
| TXT | `_dmarc` | **DMARC**: `v=DMARC1; p=quarantine; rua=mailto:contato@navalhadeouro.com.br` |

> Só pode existir **um** registro SPF. Junte os `include:` numa linha só.

## 8. Resend (envio dos agendamentos)
1. Resend → **Domains → Add Domain** → `navalhadeouro.com.br`.
2. Crie no Registro.br os registros que ele mostrar (DKIM e SPF do subdomínio `send`).
3. Quando ficar **Verified**, use `site@navalhadeouro.com.br` no `EMAIL_FROM`.
4. Faça um agendamento de teste no site e confira se o e-mail chegou.

## 9. Monitoramento
**UptimeRobot (avisa se o site cair):**
1. Crie uma conta grátis em https://uptimerobot.com.
2. **Add New Monitor** → tipo **HTTP(s)** → URL `https://navalhadeouro.com.br` → intervalo 5 minutos.
3. Em **Alert Contacts**, coloque seu e-mail e o app no celular.

**Sentry:** com o DSN configurado, os erros aparecem em sentry.io. Ative os alertas por e-mail em **Alerts**.

## 10. Google
**Search Console (aparecer no Google):**
1. Em https://search.google.com/search-console, adicione uma propriedade do tipo **Domínio** (`navalhadeouro.com.br`).
2. Copie o registro TXT de verificação e crie no Registro.br. Depois clique em **Verificar**.
3. Vá em **Sitemaps** e envie `sitemap.xml`.
4. Em **Inspeção de URL**, cole a página inicial e clique em **Solicitar indexação**.

**Google Meu Negócio (Perfil da Empresa):**
1. Em https://business.google.com, cadastre a barbearia com o **mesmo** nome, endereço e telefone do site.
2. Categoria: **Barbearia**. Coloque o link do site e o de agendamento (`https://navalhadeouro.com.br/#agendar`).
3. Faça a verificação (vídeo, ligação ou carta) e coloque fotos e horários.
4. Peça avaliações aos clientes. É isso que faz a barbearia subir no Google Maps.

---

# ✅ Checklist antes de divulgar

**Dados**
- [ ] `src/lib/site.ts` com nome, razão social, **CNPJ**, endereço, CEP, telefone, e-mails e horários reais
- [ ] Preços e serviços conferidos
- [ ] Coordenadas (`geo`) do endereço real (no Google Maps, clique com o botão direito no local)
- [ ] Depoimentos reais (ou retire a seção). Depoimentos inventados podem ser considerados propaganda enganosa
- [ ] Números da faixa (cortes, nota, barbeiros) verdadeiros
- [ ] Fotos reais na galeria, em `.webp` e com texto `alt`

**Legal**
- [ ] Política de Privacidade e Termos revisados (de preferência por um advogado)
- [ ] E-mail `privacidade@` criado e funcionando
- [ ] Regras do Clube d'Ouro definidas por escrito

**Funcionamento**
- [ ] Agendamento de teste chegou no e-mail
- [ ] Captcha aparece e funciona no domínio real
- [ ] Botões de WhatsApp abrem a conversa certa
- [ ] Banner de cookies: "Só essenciais" não carrega o Analytics; "Aceitar todos" carrega
- [ ] Página 404 aparece num endereço inexistente
- [ ] Testado no celular (Android e iPhone), tablet e computador

**Técnico**
- [ ] `https://` com cadeado; `http://` e `www` redirecionam
- [ ] Lighthouse acima de 90 (Chrome → F12 → Lighthouse)
- [ ] Prévia bonita ao colar o link no WhatsApp
- [ ] https://securityheaders.com com nota A
- [ ] `npm audit` sem vulnerabilidades
- [ ] Search Console verificado e sitemap enviado
- [ ] UptimeRobot e alertas do Sentry ativos
- [ ] SPF, DKIM e DMARC válidos (teste em https://mxtoolbox.com)

---

# 💰 Custos estimados

| Item | Custo |
|---|---|
| Domínio .com.br (Registro.br) | **R$ 40/ano** |
| Hospedagem Vercel (plano Hobby) | **Grátis**\* |
| Resend (até 3.000 e-mails/mês) | **Grátis** |
| Cloudflare Turnstile | **Grátis** |
| Sentry (até 5.000 erros/mês) | **Grátis** |
| Google Analytics, Search Console, Meu Negócio | **Grátis** |
| UptimeRobot (50 monitores) | **Grátis** |
| E-mail profissional: Zoho grátis ou Google Workspace | **R$ 0** ou **cerca de R$ 30/mês** |

**Total mínimo: cerca de R$ 40 por ano.** Com Google Workspace: cerca de R$ 400 por ano.

\* O plano Hobby da Vercel é para **uso não comercial**. Para um negócio, o certo é o **Vercel Pro** (cerca de US$ 20/mês, ~R$ 110/mês) ou publicar grátis na **Netlify** ou na **Cloudflare Pages**, que permitem uso comercial no plano gratuito. Confira os termos atuais de cada um antes de decidir.

Preços aproximados de novembro de 2026. Confira nos sites oficiais.

---

# Decisões que tomei (e por quê)
- **Next.js + Tailwind + Vercel**, como você pediu. O site é quase todo estático (carrega rápido) e só o agendamento roda no servidor.
- **Sem banco de dados (Supabase)**: o agendamento vai direto para o seu e-mail, o que é mais simples e barato. Se um dia quiser uma agenda que bloqueia horários de verdade ou login de clientes, aí sim vale o Supabase.
- **Sem login**: o site não precisa. Por isso não há senhas para guardar.
- **Modo escuro fixo**: a identidade preta e dourada é a marca, então não há modo claro.
- **CSP com `'unsafe-inline'` nos scripts**: o Next.js precisa disso em páginas estáticas. A alternativa (nonce) deixaria todas as páginas mais lentas. O resto da política é restritivo.
- **Limite de envios em memória** (5 por IP a cada 10 minutos). Para muito tráfego, troque por Upstash Redis (instruções no arquivo `rate-limit.ts`).
- **O mapa do Google só carrega com consentimento**, porque ele coloca cookies.
- **A imagem de prévia (1200×630) é gerada pelo código.** Se quiser usar uma foto, salve `src/app/opengraph-image.jpg` e apague o `.tsx`.
