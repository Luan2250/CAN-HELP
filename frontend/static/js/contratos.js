// Tela de Contratos: lista, cria, edita e remove usando a API /contratos.

const CONTRATOS_URL = '/contratos';

function formatarStatus(status) {
  const mapa = {
    pendente: 'Pendente',
    aceito: 'Aceito',
    recusado: 'Recusado',
    cancelado_cliente: 'Cancelado (cliente)',
    cancelado_cuidador: 'Cancelado (cuidador)',
    concluido: 'Concluído',
  };
  return mapa[status] ?? status ?? '—';
}

async function carregarContratos() {
  const corpo = document.getElementById('contratos-corpo');
  corpo.innerHTML = '<tr><td colspan="7" class="empty">Carregando...</td></tr>';

  try {
    const contratos = await api.get(CONTRATOS_URL);

    if (!contratos || contratos.length === 0) {
      corpo.innerHTML = '<tr><td colspan="7" class="empty">Nenhum contrato cadastrado ainda.</td></tr>';
      return;
    }

    corpo.innerHTML = contratos.map((contrato) => `
      <tr>
        <td>${contrato.idContrato}</td>
        <td>${contrato.idCliente}</td>
        <td>${contrato.idCuidador}</td>
        <td>${contrato.dataAtendimento ?? '—'}</td>
        <td>${formatarStatus(contrato.statusContrato)}</td>
        <td>R$ ${Number(contrato.valorFinal ?? 0).toFixed(2)}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" onclick='editarContrato(${JSON.stringify(contrato)})'>Editar</button>
            <button class="btn-icon danger" onclick="removerContrato(${contrato.idContrato})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="7" class="empty">Erro ao carregar: ${erro.message}</td></tr>`;
  }
}

function limparFormularioContrato() {
  document.getElementById('form-contrato').reset();
  document.getElementById('contrato-id').value = '';
  document.getElementById('modal-contrato-titulo').textContent = 'Novo contrato';
  document.getElementById('contrato-id-cliente').disabled = false;
  document.getElementById('contrato-id-cuidador').disabled = false;
}

function editarContrato(contrato) {
  document.getElementById('contrato-id').value = contrato.idContrato;
  document.getElementById('contrato-id-cliente').value = contrato.idCliente;
  document.getElementById('contrato-id-cliente').disabled = true;
  document.getElementById('contrato-id-cuidador').value = contrato.idCuidador;
  document.getElementById('contrato-id-cuidador').disabled = true;
  document.getElementById('contrato-data-atendimento').value = contrato.dataAtendimento ?? '';
  document.getElementById('contrato-localizacao').value = contrato.localizacao ?? '';
  document.getElementById('contrato-nome-auxiliado').value = contrato.nomeAuxiliado ?? '';
  document.getElementById('contrato-status').value = contrato.statusContrato ?? 'pendente';
  document.getElementById('contrato-valor-final').value = contrato.valorFinal ?? '';
  document.getElementById('modal-contrato-titulo').textContent = 'Editar contrato';
  abrirModal('modal-contrato');
}

async function removerContrato(id) {
  if (!confirm('Tem certeza que deseja excluir este contrato?')) return;

  try {
    await api.del(`${CONTRATOS_URL}/${id}`);
    showToast('Contrato excluído.');
    carregarContratos();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-novo-contrato').addEventListener('click', () => {
  limparFormularioContrato();
  abrirModal('modal-contrato');
});

document.getElementById('btn-cancelar-contrato').addEventListener('click', () => {
  fecharModal('modal-contrato');
});

document.getElementById('form-contrato').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = document.getElementById('contrato-id').value;

  const dados = {
    idCliente: document.getElementById('contrato-id-cliente').value,
    idCuidador: document.getElementById('contrato-id-cuidador').value,
    dataAtendimento: document.getElementById('contrato-data-atendimento').value,
    localizacao: document.getElementById('contrato-localizacao').value,
    nomeAuxiliado: document.getElementById('contrato-nome-auxiliado').value,
    statusContrato: document.getElementById('contrato-status').value,
    valorFinal: document.getElementById('contrato-valor-final').value,
  };

  try {
    if (id) {
      await api.put(`${CONTRATOS_URL}/${id}`, {
        dataAtendimento: dados.dataAtendimento,
        localizacao: dados.localizacao,
        nomeAuxiliado: dados.nomeAuxiliado,
        statusContrato: dados.statusContrato,
        valorFinal: dados.valorFinal,
      });
      showToast('Contrato atualizado.');
    } else {
      await api.post(CONTRATOS_URL, dados);
      showToast('Contrato criado.');
    }

    fecharModal('modal-contrato');
    carregarContratos();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarContratos();
