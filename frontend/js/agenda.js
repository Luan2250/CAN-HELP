// Tela de Agenda: lista, cria, edita e remove usando a API /agendas.
//
// ATENÇÃO: os nomes de campo abaixo (idAgenda, idContrato, dataAgenda,
// horaAgenda, ocasiao, notificacao) seguem o CanHelp.sql. Se o to_dict()
// do seu Model Agenda usar nomes diferentes, ajusta aqui.

const AGENDA_URL = '/agendas';

async function carregarAgenda() {
  const corpo = document.getElementById('agenda-corpo');
  corpo.innerHTML = '<tr><td colspan="7" class="empty">Carregando...</td></tr>';

  try {
    const itens = await api.get(AGENDA_URL);

    if (!itens || itens.length === 0) {
      corpo.innerHTML = '<tr><td colspan="7" class="empty">Nenhum compromisso cadastrado ainda.</td></tr>';
      return;
    }

    corpo.innerHTML = itens.map((item) => `
      <tr>
        <td>${item.idAgenda}</td>
        <td>${item.idContrato}</td>
        <td>${item.dataAgenda ?? '—'}</td>
        <td>${item.horaAgenda ?? '—'}</td>
        <td>${item.ocasiao ?? '—'}</td>
        <td>${item.notificacao ? 'Sim' : 'Não'}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" onclick='editarAgenda(${JSON.stringify(item)})'>Editar</button>
            <button class="btn-icon danger" onclick="removerAgenda(${item.idAgenda})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="7" class="empty">Erro ao carregar: ${erro.message}</td></tr>`;
  }
}

function limparFormularioAgenda() {
  document.getElementById('form-agenda').reset();
  document.getElementById('agenda-id').value = '';
  document.getElementById('agenda-id-contrato').disabled = false;
  document.getElementById('agenda-notificacao').checked = true;
  document.getElementById('modal-agenda-titulo').textContent = 'Novo compromisso';
}

function editarAgenda(item) {
  document.getElementById('agenda-id').value = item.idAgenda;
  document.getElementById('agenda-id-contrato').value = item.idContrato;
  document.getElementById('agenda-id-contrato').disabled = true;
  document.getElementById('agenda-data').value = item.dataAgenda ?? '';
  document.getElementById('agenda-hora').value = item.horaAgenda ?? '';
  document.getElementById('agenda-ocasiao').value = item.ocasiao ?? '';
  document.getElementById('agenda-notificacao').checked = !!item.notificacao;
  document.getElementById('modal-agenda-titulo').textContent = 'Editar compromisso';
  abrirModal('modal-agenda');
}

async function removerAgenda(id) {
  if (!confirm('Tem certeza que deseja excluir este compromisso? As tarefas vinculadas também serão removidas.')) return;
  try {
    await api.del(`${AGENDA_URL}/${id}`);
    showToast('Compromisso excluído.');
    carregarAgenda();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-novo-agenda').addEventListener('click', () => {
  limparFormularioAgenda();
  abrirModal('modal-agenda');
});

document.getElementById('btn-cancelar-agenda').addEventListener('click', () => {
  fecharModal('modal-agenda');
});

document.getElementById('form-agenda').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = document.getElementById('agenda-id').value;
  const dados = {
    idContrato: document.getElementById('agenda-id-contrato').value,
    dataAgenda: document.getElementById('agenda-data').value,
    horaAgenda: document.getElementById('agenda-hora').value,
    ocasiao: document.getElementById('agenda-ocasiao').value,
    notificacao: document.getElementById('agenda-notificacao').checked,
  };

  try {
    if (id) {
      await api.put(`${AGENDA_URL}/${id}`, {
        dataAgenda: dados.dataAgenda,
        horaAgenda: dados.horaAgenda,
        ocasiao: dados.ocasiao,
        notificacao: dados.notificacao,
      });
      showToast('Compromisso atualizado.');
    } else {
      await api.post(AGENDA_URL, dados);
      showToast('Compromisso criado.');
    }

    fecharModal('modal-agenda');
    carregarAgenda();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarAgenda();