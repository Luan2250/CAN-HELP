// Tela de Itens do Contrato: lista (todos ou filtrado por contrato), cria e remove.
// Não tem edição: o vínculo contrato+serviço é criado ou removido, não editado.

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
        <td>${item.idContrato}</td>
        <td>${item.idServico}</td>
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

carregarItens();