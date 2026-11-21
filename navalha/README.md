# Navalha d'Ouro · Site da barbearia

Site institucional com agendamento online, feito em **Next.js 16 + Tailwind CSS**, pronto para publicar na **Vercel**.

## O que tem
- Página inicial com serviços, Clube d'Ouro (assinatura), quiz de estilo, galeria, depoimentos e mapa
- Agendamento online que envia o pedido para o seu e-mail (Resend), com captcha (Cloudflare Turnstile), limite de envios e campo-isca contra robôs
- Botão flutuante de WhatsApp
- Política de Privacidade e Termos de Uso (LGPD), banner de cookies que bloqueia o Google Analytics e o mapa até o aceite
- SEO: títulos e descrições por página, Open Graph e Twitter Card com imagem 1200×630 gerada automaticamente, sitemap.xml, robots.txt, Schema.org (BarberShop), favicon, apple-touch-icon e manifest
- Cabeçalhos de segurança (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Páginas 404 e 500 personalizadas, Sentry para erros
- Animações que respeitam quem desativa movimento no aparelho

## Estrutura
```
navalha/
├── next.config.ts          # cabeçalhos de segurança, redirecionamento www, Sentry
├── tailwind.config.ts      # cores e fontes da marca
├── .env.example            # modelo das variáveis de ambiente (copie para .env.local)
├── PUBLICACAO.md           # passo a passo para colocar no ar + checklist + custos
└── src/
    ├── instrumentation.ts          # Sentry (servidor)
    ├── instrumentation-client.ts   # Sentry (navegador)
    ├── lib/
    │   ├── site.ts         # ⭐ TODOS os dados do negócio (nome, CNPJ, endereço, preços...)
    │   ├── validation.ts   # validação e limpeza dos dados do formulário
    │   ├── rate-limit.ts   # limite de envios por IP
    │   └── turnstile.ts    # verificação do captcha
    ├── components/         # cabeçalho, rodapé, cookies, formulário, quiz, mapa...
    └── app/
        ├── page.tsx        # página inicial
        ├── privacidade/    # Política de Privacidade
        ├── termos/         # Termos de Uso
        ├── api/agendamento/route.ts   # recebe o formulário e envia o e-mail
        ├── not-found.tsx · error.tsx · global-error.tsx   # 404 e 500
        ├── sitemap.ts · robots.ts · manifest.ts
        └── opengraph-image.tsx · twitter-image.tsx · icon.svg · apple-icon.tsx
```

## Rodar no seu computador
Precisa do **Node.js 20 ou mais novo** (https://nodejs.org).

```bash
cd navalha
npm install
cp .env.example .env.local     # no Windows: copy .env.example .env.local
npm run dev
```
Abra http://localhost:3000.

Sem a chave do Resend, os agendamentos aparecem só no terminal (modo de teste). Com as chaves de teste do Turnstile que já estão no `.env.example`, o captcha sempre aprova.

## Comandos
| Comando | Para quê |
|---|---|
| `npm run dev` | rodar em modo de desenvolvimento |
| `npm run build` | gerar a versão de produção |
| `npm start` | rodar a versão de produção |
| `npm run typecheck` | conferir erros de tipo |
| `npm audit` | conferir vulnerabilidades nas dependências |

## Como trocar os dados
Quase tudo fica em `src/lib/site.ts`: nome, CNPJ, endereço, telefone, e-mails, horários e serviços com preços. Os textos das seções ficam em `src/app/page.tsx`.

Para colocar fotos: salve em `public/fotos/` (formato `.webp` ou `.jpg`) e troque os quadros da galeria em `page.tsx` pelo componente `<Image>` do Next.js. O comentário no código mostra o modelo.
