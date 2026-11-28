/* ==========================================================================
   TOTEM PH.D SPORTS · lógica do autoatendimento
   --------------------------------------------------------------------------
   • Planos, preços, benefícios e tempos: edite somente o objeto CONFIG.
   • Pagamento real (TEF / Pix): edite a função processarPagamento().
   ========================================================================== */
(() => {
  'use strict';

  const CONFIG = {
    academia: 'PH.D Sports',
    segundosInatividade: 60, // sem toque por esse tempo → pergunta "ainda está aí?"
    segundosAviso: 15,       // contagem regressiva antes de apagar tudo e recomeçar
    segundosRetorno: 25,     // tela de sucesso volta sozinha para o início
    idadeMinima: 18,         // menores de idade finalizam na recepção
    minutosPix: 10,          // validade exibida para o QR Code Pix
    modoDemonstracao: true,  // true = simula o pagamento aprovado (para apresentação)

    beneficios: [
      { id: 'musculacao', texto: 'Musculação e cardio' },
      { id: 'aulas', texto: 'Aulas coletivas' },
      { id: 'app', texto: 'App com treino personalizado' },
      { id: 'avaliacao', texto: 'Avaliação física' },
      { id: 'kit', texto: 'Kit boas-vindas' },
      { id: 'amigo', texto: 'Leve um amigo 1x por mês' },
    ],

    // Valores de EXEMPLO: troque pela tabela real da academia.
    planos: [
      {
        id: 'mensal', nome: 'Mensal', meses: 1, preco: 129.90, adesao: 49.90,
        inclui: ['musculacao', 'aulas', 'app'],
      },
      {
        id: 'trimestral', nome: 'Trimestral', meses: 3, preco: 114.90, adesao: 29.90,
        inclui: ['musculacao', 'aulas', 'app', 'avaliacao'],
      },
      {
        id: 'semestral', nome: 'Semestral', meses: 6, preco: 99.90, adesao: 0, selo: 'Mais vendido',
        inclui: ['musculacao', 'aulas', 'app', 'avaliacao', 'kit'],
      },
      {
        id: 'anual', nome: 'Anual', meses: 12, preco: 89.90, adesao: 0, selo: 'Melhor preço', destaque: true,
        inclui: ['musculacao', 'aulas', 'app', 'avaliacao', 'kit', 'amigo'],
      },
    ],
  };

  /* ------------------------------------------------------------------ util */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const stage = $('#stage');
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const fmt = (v) => brl.format(v).replace(/ /g, ' ');
  const fmtCurto = (v) => fmt(v).replace(/,00$/, '');
  const icone = (id) => `<svg class="ic" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const menosMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const timers = {};
  function limparTimer(nome) {
    clearTimeout(timers[nome]);
    clearInterval(timers[nome]);
    delete timers[nome];
  }

  function chacoalhar(el) {
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
  }

  /* ----------------------------------------------------------------- estado */
  const novoEstado = () => ({
    plano: null,
    dados: { nome: '', cpf: '', nasc: '', tel: '', email: '' },
    tocados: {},
    aceite: false,
    novidades: true,
    metodo: null,
    matricula: null,
    pagando: false,
  });
  let estado = novoEstado();
  let telaAtual = 'inicio';

  /* ------------------------------------------------------- escala do palco */
  function ajustarEscala() {
    const s = Math.min(innerWidth / 1080, innerHeight / 1920);
    stage.style.setProperty('--s', s);
  }
  addEventListener('resize', ajustarEscala);
  ajustarEscala();

  /* ----------------------------------------------------------------- relógio */
  const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  function atualizarRelogio() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const txt = `${DIAS[d.getDay()]}, ${d.getDate()} ${MESES[d.getMonth()]} · ${hh}:${mm}`;
    $$('[data-clock]').forEach((el) => { el.textContent = txt; });
  }
  atualizarRelogio();
  setInterval(atualizarRelogio, 15000);

  /* --------------------------------------------------------------- navegação */
  const PASSO = { planos: 1, dados: 2, pagamento: 3, sucesso: 4 };
  const aoEntrar = {};
  const aoSair = {};

  function irPara(tela) {
    if (tela === telaAtual) return;
    aoSair[telaAtual]?.();
    $(`.screen[data-screen="${telaAtual}"]`).classList.remove('is-active');
    $(`.screen[data-screen="${tela}"]`).classList.add('is-active');
    $(`.screen[data-screen="${tela}"] .screen__body`)?.scrollTo(0, 0);
    telaAtual = tela;
    stage.dataset.screen = tela;
    atualizarStepper();
    aoEntrar[tela]?.();
    agendarInatividade();
  }

  function atualizarStepper() {
    const p = PASSO[telaAtual] || 0;
    $$('#stepper li').forEach((li) => {
      const n = Number(li.dataset.step);
      const feito = n < p || p === 4;
      li.classList.toggle('is-done', feito);
      li.classList.toggle('is-current', n === p && p !== 4);
      li.querySelector('.dot').innerHTML = feito ? icone('check') : String(n);
    });
  }

  /* ============================================================== 0 · INÍCIO */
  (function precoMinimo() {
    const min = Math.min(...CONFIG.planos.map((p) => p.preco));
    const [int, dec] = min.toFixed(2).split('.');
    $('[data-min-int]').textContent = Number(int).toLocaleString('pt-BR');
    $('[data-min-dec]').textContent = `,${dec}`;
  })();

  /* ============================================================== 1 · PLANOS */
  const precoReferencia = Math.max(...CONFIG.planos.map((p) => p.preco));

  function renderPlanos() {
    $('#plans').innerHTML = CONFIG.planos.map((p) => {
      const [int, dec] = p.preco.toFixed(2).split('.');
      const economia = (precoReferencia - p.preco) * p.meses;
      const tags = [
        p.adesao
          ? `<span class="tag tag--blue">Adesão ${fmt(p.adesao)}</span>`
          : '<span class="tag tag--green">Adesão grátis</span>',
        economia > 0.5 ? `<span class="tag tag--yellow">Economize ${fmtCurto(economia)}</span>` : '',
      ].join('');
      const lista = CONFIG.beneficios.map((b) => {
        const ok = p.inclui.includes(b.id);
        return `<li class="${ok ? '' : 'is-off'}">${icone(ok ? 'check' : 'minus')}${b.texto}</li>`;
      }).join('');

      return `
        <div class="plan ${p.destaque ? 'plan--dark' : ''}" role="radio" tabindex="0"
             aria-checked="false" data-plano="${p.id}" aria-label="Plano ${p.nome}, ${fmt(p.preco)} por mês">
          ${p.selo ? `<span class="plan__badge">${icone('star')}${p.selo}</span>` : ''}
          <span class="plan__radio">${icone('check')}</span>
          <span class="plan__name">${p.nome}</span>
          <span class="plan__term">${p.meses === 1 ? 'Sem fidelidade' : `Fidelidade de ${p.meses} meses`}</span>
          <span class="plan__price">
            <span class="cur">R$</span><span class="int">${Number(int).toLocaleString('pt-BR')}</span><span class="dec">,${dec}</span><span class="per">/mês</span>
          </span>
          <span class="plan__tags">${tags}</span>
          <ul class="plan__list">${lista}</ul>
        </div>`;
    }).join('');
  }

  function selecionarPlano(id) {
    estado.plano = CONFIG.planos.find((p) => p.id === id) || null;
    $$('.plan').forEach((el) => el.setAttribute('aria-checked', String(el.dataset.plano === id)));
    atualizarRodapePlanos();
  }

  function atualizarRodapePlanos() {
    const p = estado.plano;
    $('#planos-info').innerHTML = p
      ? `Plano <b>${p.nome}</b><strong>${fmt(p.preco)}/mês</strong>`
      : 'Toque em um plano para selecionar';
    $('[data-action="avancar-planos"]').classList.toggle('is-off', !p);
  }

  /* =============================================================== 2 · DADOS */
  const CAMPOS = [
    { id: 'nome', label: 'Nome completo', teclado: 'nome', max: 60, largura: 'full', ph: 'Como está no seu documento' },
    { id: 'cpf', label: 'CPF', teclado: 'num', max: 11, largura: 'half', padrao: '###.###.###-##', ph: '000.000.000-00' },
    { id: 'nasc', label: 'Nascimento', teclado: 'num', max: 8, largura: 'half', padrao: '##/##/####', ph: 'DD/MM/AAAA' },
    { id: 'tel', label: 'WhatsApp (com DDD)', teclado: 'num', max: 11, largura: 'full', padrao: '(##) #####-####', ph: '(00) 00000-0000' },
    { id: 'email', label: 'E-mail', teclado: 'email', max: 60, largura: 'full', ph: 'seuemail@exemplo.com' },
  ];

  const PERMITIDO = {
    nome: /^[\p{L}' ]$/u,
    email: /^[a-z0-9@._+-]$/i,
    num: /^\d$/,
  };

  function cpfValido(c) {
    if (!/^\d{11}$/.test(c) || /^(\d)\1{10}$/.test(c)) return false;
    for (let t = 9; t < 11; t++) {
      let soma = 0;
      for (let i = 0; i < t; i++) soma += Number(c[i]) * (t + 1 - i);
      if (((soma * 10) % 11) % 10 !== Number(c[t])) return false;
    }
    return true;
  }

  function validarNascimento(v) {
    if (v.length < 8) return 'Use o formato DD/MM/AAAA.';
    const d = Number(v.slice(0, 2));
    const m = Number(v.slice(2, 4));
    const a = Number(v.slice(4));
    const data = new Date(a, m - 1, d);
    const hoje = new Date();
    if (data.getFullYear() !== a || data.getMonth() !== m - 1 || data.getDate() !== d || a < 1900 || data > hoje) {
      return 'Data inválida. Confira dia, mês e ano.';
    }
    let idade = hoje.getFullYear() - a;
    if (hoje.getMonth() < m - 1 || (hoje.getMonth() === m - 1 && hoje.getDate() < d)) idade--;
    if (idade < CONFIG.idadeMinima) {
      return `Menores de ${CONFIG.idadeMinima} anos finalizam a matrícula na recepção, com um responsável.`;
    }
    return '';
  }

  const VALIDAR = {
    nome: (v) => {
      const partes = v.trim().split(/\s+/).filter(Boolean);
      return partes.length >= 2 && v.trim().length >= 5 ? '' : 'Digite seu nome e sobrenome.';
    },
    cpf: (v) => (v.length < 11 ? 'O CPF tem 11 números.' : cpfValido(v) ? '' : 'CPF inválido. Confira os números.'),
    nasc: validarNascimento,
    tel: (v) => (v.length < 11 ? 'Informe o DDD + os 9 dígitos do celular.'
      : /^[1-9]{2}9\d{8}$/.test(v) ? '' : 'Número de celular inválido.'),
    email: (v) => (/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i.test(v) ? '' : 'E-mail inválido. Exemplo: nome@gmail.com'),
  };

  const erroDe = (id) => VALIDAR[id](estado.dados[id]);

  function aplicarPadrao(digitos, padrao) {
    let out = '';
    let i = 0;
    for (const ch of padrao) {
      if (i >= digitos.length) break;
      out += ch === '#' ? digitos[i++] : ch;
    }
    return out;
  }

  const PARTICULAS = new Set(['da', 'de', 'do', 'das', 'dos', 'e']);
  function formatarNome(v) {
    return v.split(' ').map((w, i) => {
      if (!w) return w;
      const l = w.toLocaleLowerCase('pt-BR');
      if (i > 0 && PARTICULAS.has(l)) return l;
      return l.charAt(0).toLocaleUpperCase('pt-BR') + l.slice(1);
    }).join(' ');
  }

  function valorExibido(c) {
    const v = estado.dados[c.id];
    if (c.padrao) return aplicarPadrao(v, c.padrao);
    if (c.id === 'nome') return formatarNome(v);
    return v;
  }

  function renderCampos() {
    $('#form').innerHTML = CAMPOS.map((c) => `
      <div class="field-wrap field-wrap--${c.largura}">
        <button type="button" class="field" data-field="${c.id}">
          <span class="field__label">${c.label}</span>
          <span class="field__value"><span class="field__text" data-ph="${c.ph}"></span><span class="field__caret"></span></span>
          <span class="field__ok">${icone('check')}</span>
        </button>
        <span class="field__error" data-error="${c.id}"></span>
      </div>`).join('');
  }

  function atualizarCampo(id) {
    const c = CAMPOS.find((x) => x.id === id);
    const el = $(`.field[data-field="${id}"]`);
    const erro = erroDe(id);
    const mostrarErro = estado.tocados[id] ? erro : '';
    $('.field__text', el).textContent = valorExibido(c);
    el.classList.toggle('is-valid', !erro);
    el.classList.toggle('is-error', Boolean(mostrarErro));
    const msg = $(`[data-error="${id}"]`);
    msg.textContent = mostrarErro;
    msg.classList.toggle('is-on', Boolean(mostrarErro));
  }

  function atualizarRodapeDados() {
    const faltam = CAMPOS.filter((c) => erroDe(c.id)).length;
    const ok = faltam === 0 && estado.aceite;
    $('[data-action="avancar-dados"]').classList.toggle('is-off', !ok);
    $('#dados-info').innerHTML = ok
      ? '<b>Tudo certo!</b>'
      : faltam ? `Faltam <b>${faltam} ${faltam === 1 ? 'campo' : 'campos'}</b>` : 'Aceite o <b>contrato</b> para seguir';
  }

  /* ------------------------------------------------------- teclado virtual */
  const TECLADOS = {
    nome: [
      ['Á', 'Â', 'Ã', 'É', 'Ê', 'Í', 'Ó', 'Ô', 'Õ', 'Ú'],
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M', "'", { k: 'apagar', w: 2 }],
      [{ k: 'espaco', w: 4 }, { k: 'proximo', w: 2 }],
    ],
    email: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '@'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm', '.', { k: 'apagar', w: 2 }],
      ['-', '_', { t: '@gmail.com', w: 2.4 }, { t: '@hotmail.com', w: 2.8 }, { t: '.com', w: 1.3 }, { t: '.br', w: 1 }, { k: 'proximo', w: 2.4 }],
    ],
    num: [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      [{ k: 'apagar' }, '0', { k: 'proximo' }],
    ],
  };

  let campoAtivo = null;

  function renderTeclado() {
    const c = campoAtivo;
    const ultimo = CAMPOS.indexOf(c) === CAMPOS.length - 1;
    const keys = $('#kb-keys');
    keys.className = `kb__keys kb__keys--${c.teclado}`;
    keys.innerHTML = TECLADOS[c.teclado].map((linha) => `<div class="kb__row">${linha.map((k) => {
      if (typeof k === 'string') return `<button type="button" class="key" data-key="${k}">${k}</button>`;
      const w = k.w ? ` style="flex-grow:${k.w}"` : '';
      if (k.t) return `<button type="button" class="key key--text" data-key="${k.t}"${w}>${k.t}</button>`;
      if (k.k === 'apagar') return `<button type="button" class="key key--fn" data-kb="apagar" aria-label="Apagar"${w}>${icone('backspace')}</button>`;
      if (k.k === 'espaco') return `<button type="button" class="key key--fn" data-kb="espaco"${w}>Espaço</button>`;
      return `<button type="button" class="key key--go" data-kb="proximo"${w}>${ultimo ? 'Concluir' : 'Próximo'}${icone(ultimo ? 'check' : 'arrow-right')}</button>`;
    }).join('')}</div>`).join('');
    $('#kb-label').textContent = c.label;
  }

  function focarCampo(id) {
    limparTimer('auto');
    if (campoAtivo && campoAtivo.id !== id) {
      estado.tocados[campoAtivo.id] = true;
      atualizarCampo(campoAtivo.id);
    }
    campoAtivo = CAMPOS.find((c) => c.id === id);
    $$('.field').forEach((f) => f.classList.toggle('is-focus', f.dataset.field === id));
    renderTeclado();
    stage.classList.add('kb-open');
    $('#kb').setAttribute('aria-hidden', 'false');

    // Rola só o necessário para o campo não ficar escondido atrás do teclado
    const body = $('#dados-body');
    const campo = $(`.field[data-field="${id}"]`).parentElement;
    requestAnimationFrame(() => {
      const topoTeclado = 1920 - $('#kb').offsetHeight;
      const areaVisivel = topoTeclado - body.offsetTop - 30;
      const topo = campo.offsetTop;
      const base = topo + campo.offsetHeight;
      let alvo = body.scrollTop;
      if (base > alvo + areaVisivel) alvo = base - areaVisivel;
      if (topo - 20 < alvo) alvo = Math.max(0, topo - 20);
      if (alvo !== body.scrollTop) body.scrollTo({ top: alvo, behavior: menosMovimento ? 'auto' : 'smooth' });
    });
  }

  function fecharTeclado() {
    if (campoAtivo) {
      estado.tocados[campoAtivo.id] = true;
      atualizarCampo(campoAtivo.id);
    }
    campoAtivo = null;
    $$('.field').forEach((f) => f.classList.remove('is-focus'));
    stage.classList.remove('kb-open');
    $('#kb').setAttribute('aria-hidden', 'true');
    atualizarRodapeDados();
  }

  function digitar(texto) {
    const c = campoAtivo;
    if (!c) return;
    const regra = PERMITIDO[c.teclado];
    if (![...texto].every((ch) => regra.test(ch))) return;

    let v = estado.dados[c.id];
    let t = texto;
    if (c.id === 'nome') {
      t = t.toLocaleLowerCase('pt-BR');
      if (t === ' ' && (v === '' || v.endsWith(' '))) return;
    }
    if (c.id === 'email') {
      t = t.toLowerCase();
      if (t.includes('@') && v.includes('@')) return;
    }
    if (v.length + t.length > c.max) return;

    v += t;
    estado.dados[c.id] = v;
    estado.tocados[c.id] = false;
    atualizarCampo(c.id);
    atualizarRodapeDados();

    // Campos numéricos: ao completar, valida e avança sozinho
    if (c.teclado === 'num' && v.length === c.max) {
      estado.tocados[c.id] = true;
      atualizarCampo(c.id);
      if (!erroDe(c.id)) timers.auto = setTimeout(proximoCampo, 260);
      else chacoalhar($(`.field[data-field="${c.id}"]`));
    }
  }

  function apagar() {
    const c = campoAtivo;
    if (!c) return;
    estado.dados[c.id] = estado.dados[c.id].slice(0, -1);
    estado.tocados[c.id] = false;
    atualizarCampo(c.id);
    atualizarRodapeDados();
  }

  function proximoCampo() {
    const c = campoAtivo;
    if (!c) return;
    estado.tocados[c.id] = true;
    atualizarCampo(c.id);
    if (erroDe(c.id)) {
      chacoalhar($(`.field[data-field="${c.id}"]`));
      return;
    }
    const pendente = CAMPOS.find((x) => x !== c && erroDe(x.id) && CAMPOS.indexOf(x) > CAMPOS.indexOf(c))
      || CAMPOS.find((x) => x !== c && erroDe(x.id));
    if (pendente) focarCampo(pendente.id);
    else fecharTeclado();
  }

  // Teclado físico (útil para testar no computador)
  document.addEventListener('keydown', (e) => {
    if (!campoAtivo) return;
    if (e.key === 'Backspace') { e.preventDefault(); apagar(); }
    else if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); proximoCampo(); }
    else if (e.key === 'Escape') fecharTeclado();
    else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) { e.preventDefault(); digitar(e.key); }
  });

  /* =========================================================== 3 · PAGAMENTO */
  const NOME_METODO = { pix: 'Pix', credito: 'Cartão de crédito', debito: 'Cartão de débito' };
  const totalHoje = () => estado.plano.preco + estado.plano.adesao;

  function dataProximaCobranca() {
    const hoje = new Date();
    const alvo = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
    const ultimoDia = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate();
    alvo.setDate(Math.min(hoje.getDate(), ultimoDia));
    return alvo.toLocaleDateString('pt-BR');
  }

  function renderResumo() {
    const p = estado.plano;
    const adesaoBase = Math.max(...CONFIG.planos.map((x) => x.adesao));
    $('#summary').innerHTML = `
      <div class="summary__plan">
        <span class="summary__eyebrow">Seu plano</span>
        <strong>Plano ${p.nome}</strong>
        <span>${p.meses === 1 ? 'Sem fidelidade' : `${p.meses} meses`} · <b class="nowrap">${fmt(p.preco)}/mês</b></span>
        <button type="button" class="summary__change" data-action="trocar-plano">${icone('refresh')}Trocar plano</button>
      </div>
      <dl class="summary__lines">
        <div><dt>1ª mensalidade</dt><dd>${fmt(p.preco)}</dd></div>
        <div><dt>Taxa de adesão</dt>${p.adesao
          ? `<dd>${fmt(p.adesao)}</dd>`
          : `<dd class="is-free">${adesaoBase ? `<s>${fmt(adesaoBase)}</s>` : ''}Grátis</dd>`}</div>
        <div><dt>Próxima mensalidade</dt><dd>${dataProximaCobranca()}</dd></div>
        <div class="total"><dt>Total hoje</dt><dd>${fmt(totalHoje())}</dd></div>
      </dl>`;
  }

  function gerarQR() {
    const N = 29;
    let seed = (Date.now() % 2147483646) + 1;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const cantos = [[0, 0], [0, N - 7], [N - 7, 0]];
    const meio = (N - 1) / 2;
    let rects = '';
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        let on = null;
        for (const [fr, fc] of cantos) {
          if (r >= fr && r < fr + 7 && c >= fc && c < fc + 7) {
            const y = r - fr;
            const x = c - fc;
            on = y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4);
          }
        }
        if (on === null) {
          const separador = (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
          const centro = Math.abs(r - meio) <= 4 && Math.abs(c - meio) <= 4;
          on = !separador && !centro && rnd() > 0.5;
        }
        if (on) rects += `<rect x="${c}" y="${r}" width="1.04" height="1.04"/>`;
      }
    }
    return `<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" aria-label="QR Code Pix"><g fill="#0B2559">${rects}</g></svg>`;
  }

  function renderPainel() {
    const m = estado.metodo;
    const painel = $('#pay-panel');
    limparTimer('pix');

    if (!m) {
      painel.innerHTML = `<div class="pay-empty">${icone('hand')}Escolha uma forma de pagamento acima</div>`;
    } else if (m === 'pix') {
      painel.innerHTML = `
        <div class="pay-grid">
          <div class="qr">${gerarQR()}<span class="qr__logo">${icone('logo')}</span></div>
          <div class="pay-steps">
            <h3>Pague com Pix</h3>
            <ol>
              <li><b>1</b><span>Abra o app do seu banco</span></li>
              <li><b>2</b><span>Escolha <strong>Pix › Pagar com QR Code</strong></span></li>
              <li><b>3</b><span>Aponte a câmera para o código ao lado</span></li>
            </ol>
            <div class="pay-note">${icone('clock')}<span>Código válido por <strong data-pix-timer></strong></span></div>
            ${CONFIG.modoDemonstracao ? '<span class="demo-tag">QR Code ilustrativo · modo demonstração</span>' : ''}
          </div>
        </div>`;
      let restante = CONFIG.minutosPix * 60;
      const el = $('[data-pix-timer]');
      const tick = () => {
        el.textContent = `${String(Math.floor(restante / 60)).padStart(2, '0')}:${String(restante % 60).padStart(2, '0')}`;
        if (restante-- <= 0) { limparTimer('pix'); renderPainel(); }
      };
      tick();
      timers.pix = setInterval(tick, 1000);
    } else {
      const credito = m === 'credito';
      painel.innerHTML = `
        <div class="pay-grid">
          <div class="pos">
            <span class="pos__waves">${icone('tap')}</span>
            <div class="pos__device">
              <div class="pos__screen">${icone('card')}</div>
              <div class="pos__keys">${'<i></i>'.repeat(12)}</div>
            </div>
            <span class="pos__card"></span>
          </div>
          <div class="pay-steps">
            <h3>${NOME_METODO[m]}</h3>
            <ol>
              <li><b>1</b><span>Toque em <strong>Pagar</strong> aqui embaixo</span></li>
              <li><b>2</b><span>Insira ou aproxime o cartão na <strong>maquininha ao lado</strong></span></li>
              <li><b>3</b><span>Digite a senha, se for pedida</span></li>
            </ol>
            <div class="pay-note">${icone('shield')}<span>${credito
              ? `Cobrança <strong>recorrente</strong>: só ${fmt(estado.plano.preco)} por mês no seu limite.`
              : 'As próximas mensalidades chegam por <strong>Pix no seu WhatsApp</strong>.'}</span></div>
          </div>
        </div>`;
    }

    const btn = $('#btn-pagar');
    btn.classList.toggle('is-off', !m);
    btn.innerHTML = m === 'pix'
      ? `Já fiz o Pix${icone('check')}`
      : `Pagar ${m ? fmt(totalHoje()) : ''}${icone('arrow-right')}`;
    $('#pagamento-info').innerHTML = m ? `<b>${NOME_METODO[m]}</b>` : 'Selecione a forma de pagamento';
  }

  function selecionarMetodo(m) {
    estado.metodo = m;
    $$('.method').forEach((el) => el.setAttribute('aria-checked', String(el.dataset.metodo === m)));
    renderPainel();
  }

  /**
   * Integração de pagamento.
   * No modo demonstração, aprova automaticamente após alguns segundos.
   * Para produção, troque o trecho abaixo pela chamada ao seu TEF
   * (Stone, Cielo, PagBank, SiTef...) ou à API Pix do seu banco/gateway,
   * resolvendo a Promise com { aprovado: true } ou rejeitando com um Error.
   */
  function processarPagamento(pedido) {
    if (CONFIG.modoDemonstracao) {
      return new Promise((resolve) => {
        timers.pagamento = setTimeout(() => resolve({ aprovado: true, pedido }), pedido.metodo === 'pix' ? 2200 : 4200);
      });
    }
    return fetch('/api/pagamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido),
    }).then((r) => {
      if (!r.ok) throw new Error('Pagamento não autorizado.');
      return r.json();
    });
  }

  function overlay({ anim, titulo, texto, acoes = '' }) {
    $('#overlay-anim').innerHTML = anim;
    $('#overlay-title').textContent = titulo;
    $('#overlay-text').innerHTML = texto;
    $('#overlay-actions').innerHTML = acoes;
    $('#overlay').classList.add('is-open');
  }
  const fecharOverlay = () => $('#overlay').classList.remove('is-open');

  async function pagar() {
    const m = estado.metodo;
    estado.pagando = true;
    limparTimer('idle');

    overlay(m === 'pix'
      ? { anim: '<div class="spinner"></div>', titulo: 'Confirmando seu Pix…', texto: 'Isso leva só alguns segundos.' }
      : {
        anim: `<div class="pos" style="transform:scale(.62);height:240px">${$('.pos')?.innerHTML || ''}</div>`,
        titulo: 'Use a maquininha ao lado',
        texto: `Insira ou aproxime seu cartão de <strong>${m === 'credito' ? 'crédito' : 'débito'}</strong> e siga as instruções.`,
      });

    try {
      await processarPagamento({
        plano: estado.plano.id,
        valor: Number(totalHoje().toFixed(2)),
        metodo: m,
        cliente: { ...estado.dados, nome: formatarNome(estado.dados.nome.trim()) },
        novidades: estado.novidades,
      });
      overlay({
        anim: `<div class="result result--ok">${icone('check')}</div>`,
        titulo: 'Pagamento aprovado!',
        texto: 'Preparando sua matrícula…',
      });
      timers.pagamento = setTimeout(() => {
        fecharOverlay();
        estado.pagando = false;
        irPara('sucesso');
      }, 1500);
    } catch (err) {
      estado.pagando = false;
      overlay({
        anim: `<div class="result result--fail">${icone('close')}</div>`,
        titulo: 'Pagamento não aprovado',
        texto: `${err.message || 'Algo deu errado.'} Tente novamente ou escolha outra forma de pagamento.`,
        acoes: `<button type="button" class="btn btn--ghost" data-action="fechar-overlay">Outra forma</button>
                <button type="button" class="btn btn--primary" data-action="pagar">Tentar de novo</button>`,
      });
    }
  }

  /* ============================================================= 4 · SUCESSO */
  function renderSucesso() {
    const p = estado.plano;
    const d = estado.dados;
    const set = (k, v) => { $(`[data-s="${k}"]`).textContent = v; };
    estado.matricula = estado.matricula || String(Math.floor(100000 + Math.random() * 900000));

    set('nome', formatarNome(d.nome.trim()).split(' ')[0]);
    set('matricula', estado.matricula);
    set('plano', `Plano ${p.nome}`);
    set('mensal', `${fmt(p.preco)}`);
    set('pago', fmt(totalHoje()));
    set('metodo', NOME_METODO[estado.metodo]);
    set('proxima', dataProximaCobranca());
    set('tel', `(${d.tel.slice(0, 2)}) ${d.tel[2]}••••-${d.tel.slice(7)}`);

    const avaliacao = p.inclui.includes('avaliacao');
    $('#next').innerHTML = [
      ['scan', 'Cadastre sua biometria', 'Passe na recepção para liberar seu acesso na catraca.'],
      ['phone', 'Baixe o app', 'Seu treino e a agenda de aulas na palma da mão.'],
      avaliacao
        ? ['clipboard', 'Agende sua avaliação', 'A avaliação física já está inclusa no seu plano.']
        : ['heart', 'Conheça o espaço', 'Um professor apresenta a academia no seu 1º treino.'],
    ].map(([ic, t, s]) => `<li><span class="next__ic">${icone(ic)}</span><strong>${t}</strong><p>${s}</p></li>`).join('');

    // Contagem para voltar ao início
    let n = CONFIG.segundosRetorno;
    set('count', n);
    const ring = $('.mini-ring');
    ring.classList.remove('is-running');
    ring.style.setProperty('--dur', `${n}s`);
    void ring.offsetWidth;
    ring.classList.add('is-running');
    timers.retorno = setInterval(() => {
      n -= 1;
      set('count', Math.max(n, 0));
      if (n <= 0) reiniciar();
    }, 1000);

    confete();
  }

  function confete() {
    if (menosMovimento) return;
    const cv = $('#confete');
    const ctx = cv.getContext('2d');
    const cores = ['#1F5FD6', '#3478F0', '#93B8FF', '#FFC21A', '#FFD23F', '#0B2559'];
    const pecas = Array.from({ length: 170 }, () => ({
      x: 540 + (Math.random() - 0.5) * 240,
      y: 420,
      vx: (Math.random() - 0.5) * 30,
      vy: -Math.random() * 30 - 12,
      g: 0.65 + Math.random() * 0.35,
      w: 10 + Math.random() * 12,
      h: 6 + Math.random() * 10,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      c: cores[Math.floor(Math.random() * cores.length)],
    }));
    const inicio = performance.now();
    (function quadro(t) {
      const passou = t - inicio;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.globalAlpha = Math.max(0, Math.min(1, (4200 - passou) / 900));
      for (const p of pecas) {
        p.vy += p.g;
        p.vx *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 2);
        ctx.restore();
      }
      if (passou < 4200 && telaAtual === 'sucesso') requestAnimationFrame(quadro);
      else ctx.clearRect(0, 0, cv.width, cv.height);
    })(inicio);
  }

  /* ========================================================== INATIVIDADE */
  function agendarInatividade() {
    limparTimer('idle');
    if (telaAtual === 'inicio' || telaAtual === 'sucesso' || estado.pagando) return;
    if ($('#modal-ajuda').classList.contains('is-open')) return;
    timers.idle = setTimeout(avisarInatividade, CONFIG.segundosInatividade * 1000);
  }

  function avisarInatividade() {
    if (campoAtivo) fecharTeclado();
    let n = CONFIG.segundosAviso;
    const num = $('#idle-count');
    const ring = $('#countdown');
    num.textContent = n;
    ring.classList.remove('is-running');
    ring.style.setProperty('--dur', `${n}s`);
    $('#modal-inativo').classList.add('is-open');
    void ring.offsetWidth;
    ring.classList.add('is-running');
    timers.aviso = setInterval(() => {
      n -= 1;
      num.textContent = Math.max(n, 0);
      if (n <= 0) reiniciar();
    }, 1000);
  }

  document.addEventListener('pointerdown', () => {
    if (!$('#modal-inativo').classList.contains('is-open')) agendarInatividade();
  }, true);

  /* ============================================================= REINICIAR */
  function reiniciar() {
    Object.keys(timers).forEach(limparTimer);
    campoAtivo = null;
    stage.classList.remove('kb-open');
    $$('.modal.is-open').forEach((m) => m.classList.remove('is-open'));
    fecharOverlay();

    estado = novoEstado();
    renderPlanos();
    atualizarRodapePlanos();
    renderCampos();
    CAMPOS.forEach((c) => atualizarCampo(c.id));
    $$('.check').forEach((el) => el.setAttribute('aria-checked', String(Boolean(estado[el.dataset.check]))));
    atualizarRodapeDados();
    $$('.method').forEach((el) => el.setAttribute('aria-checked', 'false'));
    $('.mini-ring').classList.remove('is-running');

    irPara('inicio');
  }

  /* ======================================================= ENTRADA/SAÍDA */
  aoEntrar.pagamento = () => { renderResumo(); renderPainel(); };
  aoSair.pagamento = () => limparTimer('pix');
  aoSair.dados = () => { if (campoAtivo) fecharTeclado(); };
  aoEntrar.sucesso = renderSucesso;
  aoSair.sucesso = () => limparTimer('retorno');

  /* ============================================================== CLIQUES */
  const VOLTAR = { planos: 'inicio', dados: 'planos', pagamento: 'dados' };

  const ACOES = {
    comecar: () => irPara('planos'),
    voltar: () => irPara(VOLTAR[telaAtual] || 'inicio'),
    'trocar-plano': () => irPara('planos'),
    'avancar-planos': () => {
      if (estado.plano) irPara('dados');
      else chacoalhar($('#plans'));
    },
    'avancar-dados': () => {
      const invalido = CAMPOS.find((c) => erroDe(c.id));
      if (invalido) {
        CAMPOS.forEach((c) => { estado.tocados[c.id] = true; atualizarCampo(c.id); });
        focarCampo(invalido.id);
        chacoalhar($(`.field[data-field="${invalido.id}"]`));
        return;
      }
      if (!estado.aceite) {
        chacoalhar($('[data-check="aceite"]'));
        return;
      }
      irPara('pagamento');
    },
    pagar: () => {
      if (!estado.metodo) { chacoalhar($('#methods')); return; }
      pagar();
    },
    'fechar-overlay': () => { fecharOverlay(); agendarInatividade(); },
    finalizar: () => reiniciar(),
    ajuda: () => {
      // Ponto de integração: avise a recepção (WebSocket, API, campainha…)
      limparTimer('idle');
      $('#modal-ajuda').classList.add('is-open');
    },
    'fechar-ajuda': () => { $('#modal-ajuda').classList.remove('is-open'); agendarInatividade(); },
    continuar: () => {
      limparTimer('aviso');
      $('#modal-inativo').classList.remove('is-open');
      agendarInatividade();
    },
    recomecar: () => reiniciar(),
  };

  stage.addEventListener('click', (e) => {
    const plano = e.target.closest('[data-plano]');
    if (plano) { selecionarPlano(plano.dataset.plano); return; }

    const metodo = e.target.closest('[data-metodo]');
    if (metodo) { selecionarMetodo(metodo.dataset.metodo); return; }

    const campo = e.target.closest('[data-field]');
    if (campo) { focarCampo(campo.dataset.field); return; }

    const check = e.target.closest('[data-check]');
    if (check) {
      const k = check.dataset.check;
      estado[k] = !estado[k];
      check.setAttribute('aria-checked', String(estado[k]));
      atualizarRodapeDados();
      return;
    }

    const tecla = e.target.closest('[data-key]');
    if (tecla) { digitar(tecla.dataset.key); return; }

    const fn = e.target.closest('[data-kb]');
    if (fn) {
      const k = fn.dataset.kb;
      if (k === 'apagar') apagar();
      else if (k === 'espaco') digitar(' ');
      else if (k === 'proximo') proximoCampo();
      else if (k === 'fechar') fecharTeclado();
      return;
    }

    const acao = e.target.closest('[data-action]');
    if (acao && ACOES[acao.dataset.action]) ACOES[acao.dataset.action]();
  });

  // Tocar fora dos campos (na área do formulário) fecha o teclado
  $('#dados-body').addEventListener('click', (e) => {
    if (campoAtivo && !e.target.closest('[data-field]') && !e.target.closest('[data-check]')) fecharTeclado();
  });

  // Teclas Enter/Espaço nos cards (acessibilidade com teclado físico)
  stage.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-plano]')) {
      e.preventDefault();
      selecionarPlano(e.target.dataset.plano);
    }
  });

  // Modo quiosque: sem menu de contexto e sem zoom por gesto
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('gesturestart', (e) => e.preventDefault());

  /* ================================================================ INÍCIO */
  reiniciar();

  // Exposto para integrações e testes
  window.TOTEM = { CONFIG, irPara, reiniciar, estado: () => estado };
})();
