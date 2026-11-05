exigirLogin();

const HISTORICO_URL = '/meu-historico';
let historicoCompleto = [];
let historicoVisivel = [];

const NOMES_STATUS = {
  pendente: 'Pendente',
  aceito: 'Aceito (em andamento)',
  recusado: 'Recusado',
  cancelado_cliente: 'Cancelado pelo cliente',
  cancelado_cuidador: 'Cancelado pelo cuidador',
  concluido: 'Concluído',
};

function esc(texto) {
  const d = document.createElement('div');
  d.textContent = texto ?? '';
  return d.innerHTML;
}

function dataBR(iso) {
  return iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—';
}

function reais(valor) {
  return 'R$ ' + Number(valor ?? 0).toFixed(2).replace('.', ',');
}

function outraParte(item) {
  return item.papel === 'cliente' ? item.nomeCuidador : item.nomeCliente;
}

function desenharHistorico() {
  const corpo = document.getElementById('historico-corpo');
  const status = document.getElementById('filtro-status').value;
  const papel = document.getElementById('filtro-papel').value;

  historicoVisivel = historicoCompleto.filter((item) =>
    (!status || item.statusContrato === status) && (!papel || item.papel === papel));

  if (historicoVisivel.length === 0) {
    corpo.innerHTML = '<tr><td colspan="8" class="empty">Nenhum serviço encontrado.</td></tr>';
    return;
  }

  corpo.innerHTML = historicoVisivel.map((item, i) => `
    <tr>
      <td>${dataBR(item.dataAtendimento)}</td>
      <td>${item.papel === 'cliente' ? 'Cliente' : 'Cuidador'}</td>
      <td>${esc(outraParte(item))}</td>
      <td>${esc(item.nomeAuxiliado)}</td>
      <td>${esc(item.servicosContratados)}</td>
      <td>${esc(NOMES_STATUS[item.statusContrato] || item.statusContrato)}</td>
      <td>${reais(item.valorFinal)}</td>
      <td><div class="row-actions"><button class="btn-icon" onclick="abrirContrato(${i})">Detalhes</button></div></td>
    </tr>
  `).join('');
}

async function carregarHistorico() {
  const corpo = document.getElementById('historico-corpo');
  try {
    historicoCompleto = await api.get(HISTORICO_URL) || [];
    desenharHistorico();
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="8" class="empty">Erro ao carregar: ${esc(erro.message)}</td></tr>`;
  }
}

function abrirContrato(indice) {
  const item = historicoVisivel[indice];
  if (!item) return;
  document.getElementById('ct-titulo').textContent = `Contrato #${item.idContrato}`;
  document.getElementById('ct-cliente').textContent = item.nomeCliente;
  document.getElementById('ct-cuidador').textContent = item.nomeCuidador;
  document.getElementById('ct-auxiliado').textContent = item.nomeAuxiliado;
  document.getElementById('ct-local').textContent = item.localizacao || '—';
  document.getElementById('ct-contratado').textContent = dataBR(item.dataContrato);
  document.getElementById('ct-atendimento').textContent = dataBR(item.dataAtendimento);
  document.getElementById('ct-servicos').textContent = item.servicosContratados;
  document.getElementById('ct-status').textContent = NOMES_STATUS[item.statusContrato] || item.statusContrato;
  document.getElementById('ct-valor').textContent = reais(item.valorFinal);
  abrirModal('modal-contrato');
}

document.getElementById('filtro-status').addEventListener('change', desenharHistorico);
document.getElementById('filtro-papel').addEventListener('change', desenharHistorico);
document.getElementById('btn-limpar').addEventListener('click', () => {
  document.getElementById('form-filtros').reset();
  desenharHistorico();
});
document.getElementById('btn-fechar-contrato').addEventListener('click', () => fecharModal('modal-contrato'));

carregarHistorico();
