// Tela de Cuidadores: lista, cria, edita e remove usando a API /cuidadores.

const CUIDADORES_URL = '/cuidadores';

async function carregarCuidadores() {
  const corpo = document.getElementById('cuidadores-corpo');
  corpo.innerHTML = '<tr><td colspan="6" class="empty">Carregando...</td></tr>';

  try {
    const cuidadores = await api.get(CUIDADORES_URL);

    if (!cuidadores || cuidadores.length === 0) {
      corpo.innerHTML = '<tr><td colspan="6" class="empty">Nenhum cuidador cadastrado ainda.</td></tr>';
      return;
    }

    corpo.innerHTML = cuidadores.map((cuidador) => `
      <tr>
        <td>${cuidador.idUsuario}</td>
        <td>${cuidador.certificado ?? '—'}</td>
        <td>${cuidador.orgaoEmissor ?? '—'}</td>
        <td>R$ ${Number(cuidador.valorServico ?? 0).toFixed(2)}</td>
        <td>${cuidador.disponibilidade ?? '—'}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" onclick='editarCuidador(${JSON.stringify(cuidador)})'>Editar</button>
            <button class="btn-icon danger" onclick="removerCuidador(${cuidador.idUsuario})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="6" class="empty">Erro ao carregar: ${erro.message}</td></tr>`;
  }
}

function limparFormularioCuidador() {
  document.getElementById('form-cuidador').reset();
  document.getElementById('cuidador-id-original').value = '';
  document.getElementById('cuidador-id-usuario').disabled = false;
  document.getElementById('modal-cuidador-titulo').textContent = 'Novo cuidador';
}

function editarCuidador(cuidador) {
  document.getElementById('cuidador-id-original').value = cuidador.idUsuario;
  document.getElementById('cuidador-id-usuario').value = cuidador.idUsuario;
  document.getElementById('cuidador-id-usuario').disabled = true;
  document.getElementById('cuidador-certificado').value = cuidador.certificado ?? '';
  document.getElementById('cuidador-orgao-emissor').value = cuidador.orgaoEmissor ?? '';
  document.getElementById('cuidador-valor-servico').value = cuidador.valorServico ?? '';
  document.getElementById('cuidador-disponibilidade').value = cuidador.disponibilidade ?? '';
  document.getElementById('modal-cuidador-titulo').textContent = 'Editar cuidador';
  abrirModal('modal-cuidador');
}

async function removerCuidador(idUsuario) {
  if (!confirm('Tem certeza que deseja excluir este cuidador? Contratos vinculados também serão removidos.')) return;
  try {
    await api.del(`${CUIDADORES_URL}/${idUsuario}`);
    showToast('Cuidador excluído.');
    carregarCuidadores();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-novo-cuidador').addEventListener('click', () => {
  limparFormularioCuidador();
  abrirModal('modal-cuidador');
});

document.getElementById('btn-cancelar-cuidador').addEventListener('click', () => {
  fecharModal('modal-cuidador');
});

document.getElementById('form-cuidador').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const idOriginal = document.getElementById('cuidador-id-original').value;
  const dados = {
    idUsuario: document.getElementById('cuidador-id-usuario').value,
    certificado: document.getElementById('cuidador-certificado').value,
    orgaoEmissor: document.getElementById('cuidador-orgao-emissor').value,
    valorServico: document.getElementById('cuidador-valor-servico').value,
    disponibilidade: document.getElementById('cuidador-disponibilidade').value,
  };

  try {
    if (idOriginal) {
      await api.put(`${CUIDADORES_URL}/${idOriginal}`, {
        certificado: dados.certificado,
        orgaoEmissor: dados.orgaoEmissor,
        valorServico: dados.valorServico,
        disponibilidade: dados.disponibilidade,
      });
      showToast('Cuidador atualizado.');
    } else {
      await api.post(CUIDADORES_URL, dados);
      showToast('Cuidador criado.');
    }

    fecharModal('modal-cuidador');
    carregarCuidadores();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarCuidadores();
