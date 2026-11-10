
const QTD_INICIAL = 8; 

const listaEl = document.getElementById('home-cuidadores');
const campoEl = document.getElementById('home-busca');
const formEl = document.getElementById('home-form-busca');
const contadorEl = document.getElementById('home-contador');
const verTodosEl = document.getElementById('home-ver-todos');

let todosCuidadores = [];

function esc(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}


function normalizar(texto) {
  return String(texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function numero(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

function inicial(nome) {
  return (String(nome ?? '').trim()[0] || '?').toUpperCase();
}

function cartao(c) {
  const id = Number(c.idUsuario);
  const nome = c.nome || 'Cuidador';
  const local = [c.cidade, c.estado].filter(Boolean).join(' / ') || 'Localização não informada';
  const nota = numero(c.notaMedia);
  const preco = numero(c.valorServico).toFixed(2).replace('.', ',');
  const foto = c.fotoURL
    ? `<img src="${esc(c.fotoURL)}" alt="Foto de ${esc(nome)}" onerror="this.remove()">`
    : '';
  const bio = c.bio ? `<p class="home-cuidador-bio">${esc(c.bio)}</p>` : '';
  const disponibilidade = c.disponibilidade
    ? `<span class="home-tag">${esc(c.disponibilidade)}</span>`
    : '';

  return `
    <article class="home-cuidador">
      <div class="home-cuidador-topo">
        <div class="home-avatar">${esc(inicial(nome))}${foto}</div>
        <div>
          <h3>${esc(nome)}</h3>
          <p class="home-cuidador-local">${esc(local)}</p>
        </div>
      </div>
      ${bio}
      <div class="home-cuidador-meta">
        <span class="home-tag">${nota ? `⭐ ${nota.toFixed(1)}` : 'Sem avaliações'}</span>
        <span class="home-tag home-tag--preco">R$ ${preco}</span>
        ${disponibilidade}
      </div>
      <a class="home-btn-perfil" href="perfil-cuidador.html?id=${encodeURIComponent(id)}">Ver perfil</a>
    </article>`;
}


function selecionar(cuidadores, termo) {
  const t = normalizar(termo.trim());
  if (!t) return cuidadores.slice(0, QTD_INICIAL);
  return cuidadores.filter((c) =>
    [c.nome, c.cidade, c.estado, c.bio].some((v) => normalizar(v).includes(t))
  );
}

function desenhar() {
  const termo = campoEl.value;
  const lista = selecionar(todosCuidadores, termo);
  const buscando = termo.trim() !== '';

  verTodosEl.href = buscando
    ? `buscar-cuidador.html?busca=${encodeURIComponent(termo.trim())}`
    : 'buscar-cuidador.html';

  if (todosCuidadores.length === 0) {
    listaEl.innerHTML = '<div class="home-estado"><strong>Nenhum cuidador cadastrado ainda.</strong>Quando alguém se cadastrar como cuidador, aparecerá aqui.</div>';
    contadorEl.textContent = '';
    return;
  }

  if (lista.length === 0) {
    listaEl.innerHTML = `<div class="home-estado"><strong>Nenhum cuidador encontrado para "${esc(termo.trim())}".</strong>Tente outro nome ou cidade, ou use a busca com filtros.</div>`;
    contadorEl.textContent = '0 resultados';
    return;
  }

  listaEl.innerHTML = lista.map(cartao).join('');
  contadorEl.textContent = buscando
    ? `${lista.length} ${lista.length === 1 ? 'resultado' : 'resultados'} para "${termo.trim()}"`
    : `Mostrando ${lista.length} de ${todosCuidadores.length} cuidadores`;
}

async function carregar() {
  listaEl.innerHTML = '<div class="home-estado">Carregando cuidadores...</div>';
  contadorEl.textContent = '';

  try {

    const resposta = await api.get('/cuidadores/filtrar?ordenar=nota');
    todosCuidadores = Array.isArray(resposta) ? resposta : [];
    desenhar();
  } catch (erro) {
    listaEl.innerHTML = `
      <div class="home-estado">
        <strong>Não foi possível carregar os cuidadores.</strong>
        ${esc(erro.message)}<br>
        <button type="button" id="home-tentar-de-novo">Tentar de novo</button>
      </div>`;
    document.getElementById('home-tentar-de-novo').addEventListener('click', carregar);
  }
}


campoEl.addEventListener('input', desenhar);
formEl.addEventListener('submit', (evento) => {
  evento.preventDefault();
  desenhar();
});

carregar();