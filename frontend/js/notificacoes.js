// Tela de Notificações: lista as notificações do usuário logado e permite marcar como lidas.

exigirLogin();

function esc(texto) {
  const d = document.createElement('div');
  d.textContent = texto ?? '';
  return d.innerHTML;
}

function quando(iso) {
  if (!iso) return '—';
  const [data, hora] = iso.split('T');
  return data.split('-').reverse().join('/') + ' ' + (hora || '').slice(0, 5);
}

async function carregarNotificacoes() {
  const corpo = document.getElementById('notificacoes-corpo');
  try {
    const dados = await api.get('/notificacoes');

    if (dados.notificacoes.length === 0) {
      corpo.innerHTML = '<tr><td colspan="3" class="empty">Você ainda não tem notificações.</td></tr>';
    } else {
      corpo.innerHTML = dados.notificacoes.map((n) => `
        <tr style="${n.lida ? '' : 'font-weight:600;'}">
          <td>${quando(n.dataCriacao)}</td>
          <td>${esc(n.mensagem)}</td>
          <td>
            ${n.lida ? '' : `<div class="row-actions"><button class="btn-icon" onclick="marcarComoLida(${n.idNotificacao})">Marcar como lida</button></div>`}
          </td>
        </tr>
      `).join('');
    }

    atualizarContadorNotificacoes();
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="3" class="empty">Erro ao carregar: ${esc(erro.message)}</td></tr>`;
  }
}

async function marcarComoLida(id) {
  try {
    await api.patch(`/notificacoes/${id}/lida`, {});
    carregarNotificacoes();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-marcar-todas').addEventListener('click', async () => {
  try {
    await api.patch('/notificacoes/lidas', {});
    showToast('Tudo marcado como lido.');
    carregarNotificacoes();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarNotificacoes();