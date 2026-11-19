// ===== CONFIGURE AQUI =====
// Coloque seu número com DDI e DDD, só números. Ex: 5511999998888
const WHATSAPP = '5500000000000';

// Lista de modelos de site. Para adicionar um novo, crie o arquivo em /modelos e coloque aqui.
const modelos = [
  { nome: 'Barbearia', descricao: 'Serviços, preços, horários e agendamento pelo WhatsApp.', link: 'modelos/barbearia.html', icone: '💈' },
];

// Mostra os modelos na página
const lista = document.getElementById('modelos-lista');
modelos.forEach(m => {
  const card = document.createElement('a');
  card.className = 'card modelo';
  card.href = m.link;
  card.target = '_blank';
  card.innerHTML = `<div class="icone">${m.icone}</div><h3>${m.nome}</h3><p>${m.descricao}</p><span class="ver">Ver modelo →</span>`;
  lista.appendChild(card);
});

// Formulário abre o WhatsApp com a mensagem pronta
document.getElementById('form-contato').addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const negocio = document.getElementById('negocio').value;
  const msg = `Olá! Meu nome é ${nome} e tenho um(a) ${negocio}. Quero um orçamento de site.`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
});

document.getElementById('ano').textContent = new Date().getFullYear();
