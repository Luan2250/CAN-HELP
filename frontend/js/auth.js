function getUsuarioLogado() {
  const dados = localStorage.getItem('canhelp_usuario');
  return dados ? JSON.parse(dados) : null;
}

function logout() {
  localStorage.removeItem('canhelp_usuario');
  location.href = 'login.html';
}

function exigirLogin() {
  const usuario = getUsuarioLogado();
  if (!usuario) {
    const destino = location.pathname.split('/').pop() + location.search + location.hash;
    if (destino && destino !== 'login.html' && destino !== 'index.html') {
      sessionStorage.setItem('canhelp_destino_apos_login', destino);
    }
    location.replace('login.html');
    return null;
  }
  return usuario;
}

function chaveNotificacoesLidas() {
  const usuario = getUsuarioLogado();
  return usuario ? `notificacoes_lidas_${usuario.idUsuario}` : null;
}

function lerNotificacoesLidas() {
  try {
    return new Set(JSON.parse(localStorage.getItem(chaveNotificacoesLidas())) || []);
  } catch (erro) {
    return new Set();
  }
}

function salvarNotificacoesLidas(lidas) {
  localStorage.setItem(chaveNotificacoesLidas(), JSON.stringify([...lidas]));
}

async function atualizarContadorNotificacoes() {
  const link = document.getElementById('nav-notificacoes');
  if (!link) return;

  try {
    const dados = await api.get('/notificacoes');
    const lidas = lerNotificacoesLidas();
    const naoLidas = dados.notificacoes.filter((n) => !lidas.has(n.id)).length;
    link.textContent = naoLidas > 0 ? `Notificações (${naoLidas})` : 'Notificações';
  } catch (erro) {
  }
}