exigirLogin();

const ROTULOS = {
  contrato: 'Contrato',
  lembrete: 'Lembrete',
  tarefa: 'Tarefa',
  avaliacao: 'Avaliação',
  mensagem: 'Mensagem',
};

function esc(texto) {
  const d = document.createElement('div');
  d.textContent = texto ?? '';
  return d.innerHTML;
}

function quandoBR(quando) {
 
  if (!quando) return '—';
  const [data, hora] = quando.split(' ');
  return data.split('-').reverse().join('/') + ' ' + (hora || '').slice(0, 5);
}

let notificacoesAtuais = [];

function desenharNotificacoes() {
  const corpo = document.getElementById('notificacoes-corpo');
  const lidas = lerNotificacoesLidas();

  if (notificacoesAtuais.length === 0) {
    corpo.innerHTML = '<tr><td colspan="3" class="empty">Você ainda não tem notificações.</td></tr>';
    return;
  }

  corpo.innerHTML = notificacoesAtuais.map((n) => {
    const lida = lidas.has(n.id);
    const rotulo = ROTULOS[n.categoria] || 'Aviso';
    return `
      <tr style="${lida ? '' : 'font-weight:600;'}">
        <td>${quandoBR(n.quando)}</td>
        <td>
          <span style="font-size:.72rem; letter-spacing:.04em; text-transform:uppercase; opacity:.65;">${rotulo}</span><br>
          ${esc(n.mensagem)}
        </td>
        <td>
          <div class="row-actions">
            <a class="btn-icon" href="${esc(n.link)}" data-acao="abrir" data-id="${esc(n.id)}">Abrir</a>
            ${lida ? '' : `<button class="btn-icon" data-acao="lida" data-id="${esc(n.id)}">Marcar como lida</button>`}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function marcarComoLida(id) {
  const lidas = lerNotificacoesLidas();
  lidas.add(id);
  salvarNotificacoesLidas(lidas);
}

async function carregarNotificacoes() {
  const corpo = document.getElementById('notificacoes-corpo');
  try {
    const dados = await api.get('/notificacoes');
    notificacoesAtuais = dados.notificacoes;
    desenharNotificacoes();
    atualizarContadorNotificacoes();
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="3" class="empty">Erro ao carregar: ${esc(erro.message)}</td></tr>`;
  }
}


document.getElementById('notificacoes-corpo').addEventListener('click', (evento) => {
  const alvo = evento.target.closest('[data-acao]');
  if (!alvo) return;

  marcarComoLida(alvo.dataset.id);
  if (alvo.dataset.acao === 'lida') {
    desenharNotificacoes();
    atualizarContadorNotificacoes();
  }
});

document.getElementById('btn-marcar-todas').addEventListener('click', () => {
  notificacoesAtuais.forEach((n) => marcarComoLida(n.id));
  showToast('Tudo marcado como lido.');
  desenharNotificacoes();
  atualizarContadorNotificacoes();
});

carregarNotificacoes();