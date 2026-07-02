// Funções compartilhadas de acesso à API e feedback visual (toast).
//
// O frontend roda num servidor Flask separado do backend (portas diferentes),
// então as chamadas fetch precisam apontar pra URL completa do backend,
// e o backend precisa ter CORS habilitado (veja instruções no chat).
const API_BASE = 'http://127.0.0.1:5000';

async function apiRequest(path, options = {}) {
  const response = await fetch(API_BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (response.status === 204) return null;

  let body = null;
  try {
    body = await response.json();
  } catch (err) {
    body = null;
  }

  if (!response.ok) {
    const mensagem = (body && (body.erro || body.message)) || `Erro ${response.status}`;
    throw new Error(mensagem);
  }

  return body;
}

const api = {
  get: (path) => apiRequest(path),
  post: (path, dados) => apiRequest(path, { method: 'POST', body: JSON.stringify(dados) }),
  put: (path, dados) => apiRequest(path, { method: 'PUT', body: JSON.stringify(dados) }),
  del: (path) => apiRequest(path, { method: 'DELETE' }),
};

function showToast(mensagem, tipo = 'ok') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = mensagem;
  toast.className = 'toast show' + (tipo === 'error' ? ' error' : '');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function abrirModal(id) {
  document.getElementById(id).classList.add('open');
}

function fecharModal(id) {
  document.getElementById(id).classList.remove('open');
}
