// Tela de Perfis: lista, cria, edita e remove usando a API /perfis.
// idUsuario é a PK de Perfil (mesmo dado do Usuario vinculado).

const PERFIS_URL = '/perfis';

async function carregarPerfis() {
  const corpo = document.getElementById('perfis-corpo');
  corpo.innerHTML = '<tr><td colspan="6" class="empty">Carregando...</td></tr>';

  try {
    const perfis = await api.get(PERFIS_URL);

    if (!perfis || perfis.length === 0) {
      corpo.innerHTML = '<tr><td colspan="6" class="empty">Nenhum perfil cadastrado ainda.</td></tr>';
      return;
    }

    corpo.innerHTML = perfis.map((perfil) => `
      <tr>
        <td>${perfil.idUsuario}</td>
        <td>${perfil.nome ?? '—'}</td>
        <td>${perfil.cidade ?? '—'}</td>
        <td>${perfil.estado ?? '—'}</td>
        <td>${(perfil.bio ?? '—').toString().slice(0, 40)}${perfil.bio && perfil.bio.length > 40 ? '…' : ''}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" onclick='editarPerfil(${JSON.stringify(perfil)})'>Editar</button>
            <button class="btn-icon danger" onclick="removerPerfil(${perfil.idUsuario})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="6" class="empty">Erro ao carregar: ${erro.message}</td></tr>`;
  }
}

function limparFormularioPerfil() {
  document.getElementById('form-perfil').reset();
  document.getElementById('perfil-id-original').value = '';
  document.getElementById('perfil-id-usuario').disabled = false;
  document.getElementById('modal-perfil-titulo').textContent = 'Novo perfil';
}

function editarPerfil(perfil) {
  document.getElementById('perfil-id-original').value = perfil.idUsuario;
  document.getElementById('perfil-id-usuario').value = perfil.idUsuario;
  document.getElementById('perfil-id-usuario').disabled = true; // é a PK, não muda na edição
  document.getElementById('perfil-nome').value = perfil.nome ?? '';
  document.getElementById('perfil-foto-url').value = perfil.fotoURL ?? '';
  document.getElementById('perfil-cidade').value = perfil.cidade ?? '';
  document.getElementById('perfil-estado').value = perfil.estado ?? '';
  document.getElementById('perfil-bio').value = perfil.bio ?? '';
  document.getElementById('modal-perfil-titulo').textContent = 'Editar perfil';
  abrirModal('modal-perfil');
}

async function removerPerfil(idUsuario) {
  if (!confirm('Tem certeza que deseja excluir este perfil?')) return;
  try {
    await api.del(`${PERFIS_URL}/${idUsuario}`);
    showToast('Perfil excluído.');
    carregarPerfis();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-novo-perfil').addEventListener('click', () => {
  limparFormularioPerfil();
  abrirModal('modal-perfil');
});

document.getElementById('btn-cancelar-perfil').addEventListener('click', () => {
  fecharModal('modal-perfil');
});

document.getElementById('form-perfil').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const idOriginal = document.getElementById('perfil-id-original').value;

  const dados = {
    idUsuario: document.getElementById('perfil-id-usuario').value,
    nome: document.getElementById('perfil-nome').value,
    fotoURL: document.getElementById('perfil-foto-url').value,
    cidade: document.getElementById('perfil-cidade').value,
    estado: document.getElementById('perfil-estado').value,
    bio: document.getElementById('perfil-bio').value,
  };

  try {
    if (idOriginal) {
      await api.put(`${PERFIS_URL}/${idOriginal}`, {
        nome: dados.nome,
        fotoURL: dados.fotoURL,
        cidade: dados.cidade,
        estado: dados.estado,
        bio: dados.bio,
      });
      showToast('Perfil atualizado.');
    } else {
      await api.post(PERFIS_URL, dados);
      showToast('Perfil criado.');
    }

    fecharModal('modal-perfil');
    carregarPerfis();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarPerfis();