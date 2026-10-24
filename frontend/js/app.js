// Funções compartilhadas de acesso à API e feedback visual (toast).
const API_BASE = 'http://127.0.0.1:5000';

async function apiRequest(caminho, opcoes = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const usuario = typeof getUsuarioLogado === 'function' ? getUsuarioLogado() : null;
  if (usuario && usuario.token) headers['Authorization'] = 'Bearer ' + usuario.token;

  const resposta = await fetch(API_BASE + caminho, { ...opcoes, headers });

  if (resposta.status === 204) return null;

  let corpo = null;
  try {
    corpo = await resposta.json();
  } catch (err) {
    corpo = null;
  }

  if (!resposta.ok) {
    // Token inválido/expirado: encerra a sessão (só se havia alguém logado).
    if (resposta.status === 401 && usuario && typeof logout === 'function') logout();
    const mensagem = (corpo && (corpo.erro || corpo.message)) || `Erro ${resposta.status}`;
    throw new Error(mensagem);
  }

  return corpo;
}

const api = {
  get: (caminho) => apiRequest(caminho),
  post: (caminho, dados) => apiRequest(caminho, { method: 'POST', body: JSON.stringify(dados) }),
  put: (caminho, dados) => apiRequest(caminho, { method: 'PUT', body: JSON.stringify(dados) }),
  patch: (caminho, dados) => apiRequest(caminho, { method: 'PATCH', body: JSON.stringify(dados) }),
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

// Destaca no menu o link da página atual.
document.addEventListener('DOMContentLoaded', () => {
  const paginaAtual = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach((link) => {
    if (link.getAttribute('href') === paginaAtual) link.classList.add('active');
  });
});