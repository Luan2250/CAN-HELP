

const ITENS_URL = '/itensContrato';

async function carregarItens(idContratoFiltro = null) {
  const corpo = document.getElementById('itens-corpo');
  corpo.innerHTML = '<tr><td colspan="3" class="empty">Carregando...</td></tr>';

  try {
    const caminho = idContratoFiltro ? `${ITENS_URL}/${idContratoFiltro}` : ITENS_URL;
    const itens = await api.get(caminho);

    if (!itens || itens.length === 0) {
      corpo.innerHTML = '<tr><td colspan="3" class="empty">Nenhum item encontrado.</td></tr>';
      return;
    }

    corpo.innerHTML = itens.map((item) => `
      <tr>
        <td>${esc(rotuloContratoPorId(item.idContrato))}</td>
        <td>${esc(nomeServico(item.idServico))}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon danger" onclick="removerItem(${item.idContrato}, ${item.idServico})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="3" class="empty">Erro ao carregar: ${erro.message}</td></tr>`;
  }
}

async function removerItem(idContrato, idServico) {
  if (!confirm('Tem certeza que deseja remover este serviço do contrato?')) return;
  try {
    await api.del(`${ITENS_URL}/${idContrato}/${idServico}`);
    showToast('Item removido.');
    carregarItens();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-novo-item').addEventListener('click', () => {
  document.getElementById('form-item').reset();
  abrirModal('modal-item');
});


document.getElementById('item-id-contrato').addEventListener('change', async (e) => {
  const selectServico = document.getElementById('item-id-servico');
  let jaVinculados = [];
  try {
    const itens = await api.get(`${ITENS_URL}/${e.target.value}`);
    jaVinculados = (itens || []).map((i) => Number(i.idServico));
  } catch (_) {
    jaVinculados = [];
  }
  preencherSelect(selectServico, ref.servicos, {
    valor: (s) => s.idServico,
    rotulo: (s) => `${s.tipoServico} — ${moedaBR(s.precoBase)}${jaVinculados.includes(Number(s.idServico)) ? ' (já vinculado)' : ''}`,
    placeholder: 'Selecione o serviço',
    desabilitar: (s) => jaVinculados.includes(Number(s.idServico)),
  });
});

document.getElementById('btn-cancelar-item').addEventListener('click', () => {
  fecharModal('modal-item');
});

document.getElementById('form-item').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const idContrato = document.getElementById('item-id-contrato').value;
  const idServico = document.getElementById('item-id-servico').value;

  try {
    await api.post(ITENS_URL, { idContrato, idServico });
    showToast('Serviço vinculado ao contrato.');
    selectServicos(document.getElementById('item-id-servico'));
    fecharModal('modal-item');
    carregarItens();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

document.getElementById('btn-filtrar').addEventListener('click', () => {
  const id = document.getElementById('filtro-id-contrato').value;
  if (id) carregarItens(id);
});

document.getElementById('btn-limpar-filtro').addEventListener('click', () => {
  document.getElementById('filtro-id-contrato').value = '';
  carregarItens();
});

async function iniciarItens() {
  await carregarReferencias(['perfis', 'contratos', 'servicos']);
  selectContratos(document.getElementById('item-id-contrato'));
  selectServicos(document.getElementById('item-id-servico'));
  selectContratos(document.getElementById('filtro-id-contrato'), 'Escolha um contrato');
  carregarItens();
}

iniciarItens();