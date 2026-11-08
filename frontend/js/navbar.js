// Barra de navegação ÚNICA do CanHelp.
// Todas as páginas usam este arquivo, então o menu é sempre o mesmo.
// Só muda a área da conta: visitante vê "Entrar" e "Criar conta";
// quem está logado vê "Notificações", "Minha área" e "Sair" (sem Entrar/Criar conta).
(function () {
  const cabecalho = document.getElementById('site-header');
  if (!cabecalho) return;

  const paginaAtual = (location.pathname.split('/').pop() || 'home.html').toLowerCase();

  const LINKS_PRINCIPAIS = [
    ['home.html', 'Início'],
    ['buscar-cuidador.html', 'Buscar cuidador'],
    ['agenda.html', 'Agenda'],
    ['servicos.html', 'Serviços'],
    ['chat.html', 'Chat'],
  ];

  const LINKS_MINHA_AREA = [
    ['contratos.html', 'Contratos'],
    ['itens-contrato.html', 'Serviços do contrato'],
    ['tarefas.html', 'Tarefas'],
    ['minha-agenda.html', 'Minha agenda'],
    ['historico.html', 'Histórico'],
    ['avaliacoes.html', 'Avaliações'],
    ['lembretes.html', 'Lembretes'],
    ['meu-perfil.html', 'Meu perfil'],
    ['meus-contratos.html', 'Meus contratos'],
  ];

  function esc(texto) {
    const d = document.createElement('div');
    d.textContent = texto ?? '';
    return d.innerHTML;
  }

  function usuarioLogado() {
    try {
      return JSON.parse(localStorage.getItem('canhelp_usuario') || 'null');
    } catch (erro) {
      return null;
    }
  }

  function link(href, texto, classeExtra = '', id = '') {
    const ativo = paginaAtual === href ? ' active' : '';
    const idAttr = id ? ` id="${id}"` : '';
    return `<a href="${href}" class="nav-link${classeExtra}${ativo}"${idAttr}>${esc(texto)}</a>`;
  }

  function montar(usuario) {
    const principais = LINKS_PRINCIPAIS.map(([href, texto]) => link(href, texto)).join('');

    let conta;
    if (usuario) {
      const naMinhaArea = LINKS_MINHA_AREA.some(([href]) => href === paginaAtual);
      conta = `
        ${link('notificacoes.html', 'Notificações', '', 'nav-notificacoes')}
        <details class="nav-more">
          <summary class="nav-link nav-summary${naMinhaArea ? ' active' : ''}">Minha área</summary>
          <div class="nav-dropdown" aria-label="Páginas do usuário">
            ${LINKS_MINHA_AREA.map(([href, texto]) => link(href, texto, ' nav-dropdown-link')).join('')}
          </div>
        </details>
        <a href="#" class="nav-link" id="nav-sair">Sair (${esc(usuario.email)})</a>`;
    } else {
      conta = `${link('login.html', 'Entrar')}${link('cadastro.html', 'Criar conta')}`;
    }

    return `
      <div class="topbar-inner">
        <a class="brand" href="home.html">
          <span class="brand-mark">CH</span>
          <span class="brand-name">CanHelp</span>
        </a>
        <nav class="nav" aria-label="Navegação principal">
          ${principais}
          ${conta}
        </nav>
      </div>`;
  }

  const usuario = usuarioLogado();
  cabecalho.innerHTML = montar(usuario);

  // Sair
  const botaoSair = document.getElementById('nav-sair');
  if (botaoSair) {
    botaoSair.addEventListener('click', (evento) => {
      evento.preventDefault();
      if (typeof logout === 'function') {
        logout();
      } else {
        localStorage.removeItem('canhelp_usuario');
        location.href = 'login.html';
      }
    });
  }


  document.addEventListener('click', (evento) => {
    const menu = cabecalho.querySelector('.nav-more');
    if (menu && menu.open && !menu.contains(evento.target)) menu.open = false;
  });


  if (usuario) {
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof atualizarContadorNotificacoes === 'function') {
        atualizarContadorNotificacoes();
        setInterval(atualizarContadorNotificacoes, 30000);
      }
    });
  }
})();