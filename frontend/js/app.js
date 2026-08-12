// Funções compartilhadas de acesso à API e feedback visual (toast).
// Esse arquivo é incluído em TODAS as páginas — não repita essas funções
// dentro dos JS de cada tela, só chame api.get/post/put/del a partir delas.

const API_BASE = 'http://127.0.0.1:5000'; // porta do seu backend Flask

async function apiRequest(caminho, opcoes = {}) {
  const resposta = await fetch(API_BASE + caminho, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });

  if (resposta.status === 204) return null;

  let corpo = null;
  try {
    corpo = await resposta.json();
  } catch (err) {
    corpo = null;
  }

  if (!resposta.ok) {
    const mensagem = (corpo && (corpo.erro || corpo.message)) || `Erro ${resposta.status}`;
    throw new Error(mensagem);
  }

  return corpo;
}

const api = {
  get: (caminho) => apiRequest(caminho),
  post: (caminho, dados) => apiRequest(caminho, { method: 'POST', body: JSON.stringify(dados) }),
  put: (caminho, dados) => apiRequest(caminho, { method: 'PUT', body: JSON.stringify(dados) }),
  del: (caminho) => apiRequest(caminho, { method: 'DELETE' }),
};

function showToast(mensagem, tipo = 'ok') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensagem;
  toast.className = 'toast show' + (tipo === 'error' ? ' error' : '');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
}

function abrirModal(id) {
  document.getElementById(id).classList.add('open');
}

function fecharModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Destaca no menu o link da página atual (substitui o "active" que o Jinja fazia).
document.addEventListener('DOMContentLoaded', () => {
  const paginaAtual = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    if (link.getAttribute('href') === paginaAtual) link.classList.add('active');
  });
});