// Tela de Lista de Serviços: lista, cria, edita e remove usando /listasServicos.

const SERVICOS_URL = '/listasServicos';

async function carregarServicos() {
  const corpo = document.getElementById('servicos-corpo');
  corpo.innerHTML = '<tr><td colspan="3" class="empty">Carregando...</td></tr>';

  try {
    const servicos = await api.get(SERVICOS_URL);

    if (!servicos || servicos.length === 0) {
      corpo.innerHTML = '<tr><td colspan="3" class="empty">Nenhum serviço cadastrado ainda.</td></tr>';
      return;
    }

    corpo.innerHTML = servicos.map((s) => `
      <tr>
        <td>${s.idServico}</td>
        <td>${s.tipoServico ?? '—'}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" onclick='editarServico(${JSON.stringify(s)})'>Editar</button>
            <button class="btn-icon danger" onclick="removerServico(${s.idServico})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="3" class="empty">Erro ao carregar: ${erro.message}</td></tr>`;
  }
}

function limparFormularioServico() {
  document.getElementById('form-servico').reset();
  document.getElementById('servico-id').value = '';
  document.getElementById('modal-servico-titulo').textContent = 'Novo serviço';
}

function editarServico(s) {
  document.getElementById('servico-id').value = s.idServico;
  document.getElementById('servico-tipo').value = s.tipoServico ?? '';
  document.getElementById('modal-servico-titulo').textContent = 'Editar serviço';
  abrirModal('modal-servico');
}

async function removerServico(id) {
  if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
  try {
    await api.del(`${SERVICOS_URL}/${id}`);
    showToast('Serviço excluído.');
    carregarServicos();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-novo-servico').addEventListener('click', () => {
  limparFormularioServico();
  abrirModal('modal-servico');
});

document.getElementById('btn-cancelar-servico').addEventListener('click', () => {
  fecharModal('modal-servico');
});

document.getElementById('form-servico').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = document.getElementById('servico-id').value;
  const tipoServico = document.getElementById('servico-tipo').value;

  try {
    if (id) {
      await api.put(`${SERVICOS_URL}/${id}`, { tipoServico });
      showToast('Serviço atualizado.');
    } else {
      await api.post(SERVICOS_URL, { tipoServico });
      showToast('Serviço criado.');
    }

    fecharModal('modal-servico');
    carregarServicos();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarServicos();