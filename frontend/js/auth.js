
function salvarUsuarioLogado(usuario) {
  localStorage.setItem('canhelp_usuario', JSON.stringify(usuario));
}

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
    location.href = 'login.html';
  }
  return usuario;
}

async function atualizarContadorNotificacoes() {
  const link = document.getElementById('nav-notificacoes');
  if (!link) return;

  try {
    const dados = await api.get('/notificacoes');
    link.textContent = dados.naoLidas > 0 ? `Notificações (${dados.naoLidas})` : 'Notificações';
  } catch (erro) {
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const usuario = getUsuarioLogado();
  if (!usuario) return;

  const linkLogin = nav.querySelector('a[href="login.html"]');
  if (linkLogin) linkLogin.remove();

  if (!nav.querySelector('a[href="lembretes.html"]')) {
    const linkLembretes = document.createElement('a');
    linkLembretes.href = 'lembretes.html';
    linkLembretes.className = 'nav-link';
    linkLembretes.textContent = 'Lembretes';
    if (location.pathname.endsWith('lembretes.html')) linkLembretes.classList.add('active');
    nav.appendChild(linkLembretes);
  }

   if (!nav.querySelector('a[href="minha-agenda.html"]')) {
    const l = document.createElement('a');
    l.href = 'minha-agenda.html';
    l.className = 'nav-link';
    l.textContent = 'Minha agenda';
    if (location.pathname.endsWith('minha-agenda.html')) l.classList.add('active');
    nav.appendChild(l);
  }

  if (!nav.querySelector('a[href="notificacoes.html"]')) {
    const linkNotificacoes = document.createElement('a');
    linkNotificacoes.href = 'notificacoes.html';
    linkNotificacoes.id = 'nav-notificacoes';
    linkNotificacoes.className = 'nav-link';
    linkNotificacoes.textContent = 'Notificações';
    if (location.pathname.endsWith('notificacoes.html')) linkNotificacoes.classList.add('active');
    nav.appendChild(linkNotificacoes);
  }

  if (!document.getElementById('nav-sair')) {
    const linkSair = document.createElement('a');
    linkSair.href = '#';
    linkSair.id = 'nav-sair';
    linkSair.className = 'nav-link';
    linkSair.textContent = `Sair (${usuario.email})`;
    linkSair.addEventListener('click', (evento) => {
      evento.preventDefault();
      logout();
    });
    nav.appendChild(linkSair);
  }

  atualizarContadorNotificacoes();
  setInterval(atualizarContadorNotificacoes, 30000);
});