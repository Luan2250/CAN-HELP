// Tela de Clientes: lista, cria e remove usando a API /clientes.
// Não tem edição porque a Model Cliente só tem idUsuario (nada a alterar).

const CLIENTES_URL = '/clientes';

async function carregarClientes() {
  const corpo = document.getElementById('clientes-corpo');
  corpo.innerHTML = '<tr><td colspan="2" class="empty">Carregando...</td></tr>';

  try {
    const clientes = await api.get(CLIENTES_URL);

    if (!clientes || clientes.length === 0) {
      corpo.innerHTML = '<tr><td colspan="2" class="empty">Nenhum cliente cadastrado ainda.</td></tr>';
      return;
    }

    corpo.innerHTML = clientes.map((cliente) => `
      <tr>
        <td>${cliente.idUsuario}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon danger" onclick="removerCliente(${cliente.idUsuario})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="2" class="empty">Erro ao carregar: ${erro.message}</td></tr>`;
  }
}

async function removerCliente(idUsuario) {
  if (!confirm('Tem certeza que deseja excluir este cliente? Contratos vinculados também serão removidos.')) return;

  try {
    await api.del(`${CLIENTES_URL}/${idUsuario}`);
    showToast('Cliente excluído.');
    carregarClientes();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-novo-cliente').addEventListener('click', () => {
  document.getElementById('form-cliente').reset();
  abrirModal('modal-cliente');
});

document.getElementById('btn-cancelar-cliente').addEventListener('click', () => {
  fecharModal('modal-cliente');
});

document.getElementById('form-cliente').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const idUsuario = document.getElementById('cliente-id-usuario').value;

  try {
    await api.post(CLIENTES_URL, { idUsuario });
    showToast('Cliente criado.');
    fecharModal('modal-cliente');
    carregarClientes();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarClientes();
