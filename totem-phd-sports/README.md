# Totem de autoatendimento · PH.D Sports

Modelo de totem touch para **vender planos de academia** direto na recepção, com fundo suave em azul e amarelo.
Feito para tela vertical Full HD (**1080 × 1920**). Em telas de outro tamanho, o layout é escalado automaticamente.

## Fluxo de atendimento

1. **Tela de descanso**: chama atenção com o preço "a partir de" e o botão *Toque para começar*.
2. **Planos**: Mensal, Trimestral, Semestral e Anual, com benefícios, adesão e economia de cada um.
3. **Seus dados**: nome, CPF, nascimento, WhatsApp e e-mail, digitados em **teclado virtual próprio**
   (letras com acento, numérico e atalhos de e-mail). Valida CPF, celular, e-mail e idade mínima.
4. **Pagamento**: Pix (QR Code com tempo de validade), crédito recorrente ou débito na maquininha.
5. **Pronto!**: número da matrícula, resumo e próximos passos. Volta ao início sozinho.

Também tem:

- botão **"Precisa de ajuda?"** em todas as etapas (chama um consultor);
- **aviso de inatividade**: sem toque por 60 s, pergunta se a pessoa ainda está ali e, se não responder, **apaga os dados** e recomeça (LGPD);
- relógio, etapas numeradas e animações suaves (reduzidas se o sistema pedir menos movimento).

## Como abrir

Basta abrir `index.html` no navegador. Para usar no totem, rode o Chrome em modo quiosque:

```bash
chrome --kiosk --disable-pinch --overscroll-history-navigation=0 "file:///caminho/para/totem-phd-sports/index.html"
```

> A fonte Montserrat vem do Google Fonts. Sem internet, o totem usa a fonte do sistema e continua funcionando.

## Como personalizar

Tudo que muda com frequência está no objeto `CONFIG`, no começo do `totem.js`:

| O quê | Onde |
| --- | --- |
| Planos, preços, adesão, selos ("Mais vendido") | `CONFIG.planos` |
| Lista de benefícios | `CONFIG.beneficios` (cada plano marca os seus em `inclui`) |
| Tempos de inatividade e retorno | `segundosInatividade`, `segundosAviso`, `segundosRetorno` |
| Idade mínima para matrícula no totem | `idadeMinima` |
| Simular pagamento (apresentação) | `modoDemonstracao: true` |

- **Cores**: variáveis no topo do `totem.css` (`--navy`, `--blue-*`, `--yellow-*`).
- **Logo**: o logo atual é provisório (ícone de haltere + "PH.D Sports"). Troque o conteúdo de `.logo` no `index.html` pela imagem oficial.
- **Preços**: os valores atuais são **exemplos**. Ajuste para a tabela real antes de usar.

## Integrações (produção)

- **Pagamento**: troque o corpo de `processarPagamento()` em `totem.js` pela chamada ao TEF da maquininha
  (Stone, Cielo, PagBank, SiTef…) ou à API Pix do seu banco/gateway. Basta resolver a Promise quando aprovar
  e rejeitar com um `Error` quando recusar; a tela de erro já está pronta.
- **Chamar consultor**: a ação `ajuda` em `totem.js` é o ponto para avisar a recepção (API, WebSocket, campainha).
- `window.TOTEM` expõe `CONFIG`, `irPara()`, `reiniciar()` e `estado()` para testes e integrações.
