
exigirLogin();

const AGENDA_URL = '/minha-agenda';

function esc(texto) {
  const d = document.createElement('div');
  d.textContent = texto ?? '';
  return d.innerHTML;
}

function dataBR(iso) {
  return iso.split('-').reverse().join('/');
}

async function carregarAgenda() {
  const corpo = document.getElementById('agenda-corpo');
  const params = new URLSearchParams();
  const inicio = document.getElementById('filtro-inicio').value;
  const fim = document.getElementById('filtro-fim').value;
  const status = document.getElementById('filtro-status').value;
  if (inicio) params.set('inicio', inicio);
  if (fim) params.set('fim', fim);
  if (status) params.set('status', status);

  try {
    const tarefas = await api.get(AGENDA_URL + (params.toString() ? '?' + params : ''));
    if (!tarefas || tarefas.length === 0) {
      corpo.innerHTML = '<tr><td colspan="7" class="empty">Nenhuma tarefa encontrada.</td></tr>';
      return;
    }
    corpo.innerHTML = tarefas.map((t) => {
      const hora = t.horaTarefa.slice(0, 5);
      const concluida = t.statusTarefa === 'concluida';
      return `
      <tr>
        <td>${dataBR(t.dataAgenda)}</td>
        <td>${hora}</td>
        <td>${esc(t.descricao)}</td>
        <td>${esc(t.ocasiao)}</td>
        <td>${esc(t.nomeAuxiliado)}</td>
        <td>${concluida ? 'Concluída' : 'Pendente'}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" onclick="alterarStatus(${t.idTarefa}, '${concluida ? 'pendente' : 'concluida'}')">${concluida ? 'Reabrir' : 'Concluir'}</button>
            <button class="btn-icon" onclick="alterarHorario(${t.idTarefa}, '${hora}')">Horário</button>
            <button class="btn-icon" onclick="moverTarefa(${t.idTarefa}, '${t.dataAgenda}')">Mover</button>
            <button class="btn-icon danger" onclick="excluirTarefa(${t.idTarefa})">Excluir</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="7" class="empty">Erro ao carregar: ${esc(erro.message)}</td></tr>`;
  }
}

async function executar(acao, mensagem) {
  try {
    await acao();
    showToast(mensagem);
    carregarAgenda();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

function alterarStatus(id, novoStatus) {
  executar(() => api.patch(`${AGENDA_URL}/${id}/status`, { statusTarefa: novoStatus }), 'Status atualizado.');
}

function alterarHorario(id, horaAtual) {
  const hora = prompt('Novo horário (HH:MM):', horaAtual);
  if (!hora) return;
  executar(() => api.patch(`${AGENDA_URL}/${id}/horario`, { horaTarefa: hora }), 'Horário atualizado.');
}

function moverTarefa(id, dataAtual) {
  const data = prompt('Mover para a data (AAAA-MM-DD):', dataAtual);
  if (!data) return;
  executar(() => api.patch(`${AGENDA_URL}/${id}/mover`, { dataAgenda: data }), 'Tarefa movida.');
}

function excluirTarefa(id) {
  if (!confirm('Excluir esta tarefa?')) return;
  executar(() => api.del(`${AGENDA_URL}/${id}`), 'Tarefa excluída.');
}

document.getElementById('form-filtros').addEventListener('submit', (e) => {
  e.preventDefault();
  carregarAgenda();
});

document.getElementById('btn-limpar').addEventListener('click', () => {
  document.getElementById('form-filtros').reset();
  carregarAgenda();
});

carregarAgenda();