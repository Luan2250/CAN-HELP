// Funções de sessão do usuário logado. Guardamos em localStorage porque
// esse frontend roda sozinho no navegador, sem servidor gerenciando sessão.
//
// Isso ainda NÃO é autenticação por token/JWT (fica pra uma próxima etapa se
// o projeto pedir rotas protegidas de verdade); por ora, é o suficiente pra
// saber "quem está logado" e usar isso nas próximas funcionalidades.

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

// Chame essa função no topo de páginas que exigem login.
function exigirLogin() {
  const usuario = getUsuarioLogado();
  if (!usuario) {
    location.href = 'login.html';
  }
  return usuario;
}

// Ajusta o menu automaticamente em toda página que incluir esse arquivo:
// - Se tem usuário logado: troca o link "Login" por "Sair (email)".
// - Se não tem: deixa o link "Login" como está.
// Assim não precisamos editar o <nav> de cada uma das 12 páginas na mão.
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const usuario = getUsuarioLogado();
  const linkLogin = nav.querySelector('a[href="login.html"]');

  if (usuario) {
    if (linkLogin) linkLogin.remove();

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
  }
});