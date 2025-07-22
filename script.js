
// Busca sites da API
fetch('http://localhost:3000/api/sites')
  .then(res => res.json())
  .then(sites => {
    const container = document.getElementById('sites-container');
    sites.forEach(site => {
      const div = document.createElement('div');
      div.className = 'site';
      div.innerHTML = `
        <h3>${site.nome}</h3>
        <p>Preço: R$${site.preco}</p>
        <button onclick="comprar(${site.id})">Comprar</button>
      `;
      container.appendChild(div);
    });
  });

function comprar(id) {
  fetch('http://localhost:3000/api/comprar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ siteId: id, cliente: "João Silva" }),
  })
  .then(res => res.json())
  .then(data => alert(data.mensagem));
}
