// Tela de Tarefas: lista, cria, edita e remove usando a API /tarefas.

const TAREFAS_URL = '/tarefas';

function formatarStatusTarefa(status) {
  return status === 'concluida' ? 'Concluída' : 'Pendente';
}

async function carregarTarefas() {
  const corpo = document.getElementById('tarefas-corpo');
  corpo.innerHTML = '<tr><td colspan="6" class="empty">Carregando...</td></tr>';

  try {
    const tarefas = await api.get(TAREFAS_URL);

    if (!tarefas || tarefas.length === 0) {
      corpo.innerHTML = '<tr><td colspan="6" class="empty">Nenhuma tarefa cadastrada ainda.</td></tr>';
      return;
    }

    corpo.innerHTML = tarefas.map((tarefa) => `
      <tr>
        <td>${tarefa.idTarefa}</td>
        <td>${tarefa.idAgenda}</td>
        <td>${(tarefa.descricao ?? '—').toString().slice(0, 50)}</td>
        <td>${tarefa.horaTarefa ?? '—'}</td>
        <td>${formatarStatusTarefa(tarefa.statusTarefa)}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" onclick='editarTarefa(${JSON.stringify(tarefa)})'>Editar</button>
            <button class="btn-icon danger" onclick="removerTarefa(${tarefa.idTarefa})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="6" class="empty">Erro ao carregar: ${erro.message}</td></tr>`;
  }
}

function limparFormularioTarefa() {
  document.getElementById('form-tarefa').reset();
  document.getElementById('tarefa-id').value = '';
  document.getElementById('tarefa-id-agenda').disabled = false;
  document.getElementById('tarefa-notificacao').checked = true;
  document.getElementById('modal-tarefa-titulo').textContent = 'Nova tarefa';
}

function editarTarefa(tarefa) {
  document.getElementById('tarefa-id').value = tarefa.idTarefa;
  document.getElementById('tarefa-id-agenda').value = tarefa.idAgenda;
  document.getElementById('tarefa-id-agenda').disabled = true;
  document.getElementById('tarefa-descricao').value = tarefa.descricao ?? '';
  document.getElementById('tarefa-hora').value = tarefa.horaTarefa ?? '';
  document.getElementById('tarefa-status').value = tarefa.statusTarefa ?? 'pendente';
  document.getElementById('tarefa-notificacao').checked = !!tarefa.notificacao;
  document.getElementById('modal-tarefa-titulo').textContent = 'Editar tarefa';
  abrirModal('modal-tarefa');
}

async function removerTarefa(id) {
  if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
  try {
    await api.del(`${TAREFAS_URL}/${id}`);
    showToast('Tarefa excluída.');
    carregarTarefas();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-nova-tarefa').addEventListener('click', () => {
  limparFormularioTarefa();
  abrirModal('modal-tarefa');
});

document.getElementById('btn-cancelar-tarefa').addEventListener('click', () => {
  fecharModal('modal-tarefa');
});

document.getElementById('form-tarefa').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = document.getElementById('tarefa-id').value;
  const dados = {
    idAgenda: document.getElementById('tarefa-id-agenda').value,
    descricao: document.getElementById('tarefa-descricao').value,
    horaTarefa: document.getElementById('tarefa-hora').value,
    statusTarefa: document.getElementById('tarefa-status').value,
    notificacao: document.getElementById('tarefa-notificacao').checked,
  };

  try {
    if (id) {
      await api.put(`${TAREFAS_URL}/${id}`, {
        descricao: dados.descricao,
        horaTarefa: dados.horaTarefa,
        statusTarefa: dados.statusTarefa,
        notificacao: dados.notificacao,
      });
      showToast('Tarefa atualizada.');
    } else {
      await api.post(TAREFAS_URL, dados);
      showToast('Tarefa criada.');
    }

    fecharModal('modal-tarefa');
    carregarTarefas();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarTarefas();