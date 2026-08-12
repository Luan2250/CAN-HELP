<<<<<<< HEAD

=======
// Tela de Perfis: lista, cria, edita e remove usando a API /perfis.
// idUsuario é a PK de Perfil (mesmo dado do Usuario vinculado).
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e

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

<<<<<<< HEAD

function mostrarBlocoCriacao(mostrar) {
  document.getElementById('bloco-dados-usuario').style.display = mostrar ? 'block' : 'none';
  document.getElementById('bloco-tipo').style.display = mostrar ? 'block' : 'none';


  document.getElementById('perfil-cpf').required = mostrar;
  document.getElementById('perfil-email').required = mostrar;
  document.getElementById('perfil-telefone').required = mostrar;
  document.getElementById('perfil-data-nascimento').required = mostrar;
  document.getElementById('perfil-senha').required = mostrar;
  document.getElementById('perfil-tipo').required = mostrar;
}

function limparFormularioPerfil() {
  document.getElementById('form-perfil').reset();
  document.getElementById('perfil-id-original').value = '';
  document.getElementById('campos-cuidador').style.display = 'none';
  document.getElementById('modal-perfil-titulo').textContent = 'Novo perfil';
  mostrarBlocoCriacao(true); 
=======
function limparFormularioPerfil() {
  document.getElementById('form-perfil').reset();
  document.getElementById('perfil-id-original').value = '';
  document.getElementById('perfil-id-usuario').disabled = false;
  document.getElementById('modal-perfil-titulo').textContent = 'Novo perfil';
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e
}

function editarPerfil(perfil) {
  document.getElementById('perfil-id-original').value = perfil.idUsuario;
<<<<<<< HEAD
=======
  document.getElementById('perfil-id-usuario').value = perfil.idUsuario;
  document.getElementById('perfil-id-usuario').disabled = true; // é a PK, não muda na edição
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e
  document.getElementById('perfil-nome').value = perfil.nome ?? '';
  document.getElementById('perfil-foto-url').value = perfil.fotoURL ?? '';
  document.getElementById('perfil-cidade').value = perfil.cidade ?? '';
  document.getElementById('perfil-estado').value = perfil.estado ?? '';
  document.getElementById('perfil-bio').value = perfil.bio ?? '';
  document.getElementById('modal-perfil-titulo').textContent = 'Editar perfil';
<<<<<<< HEAD
  mostrarBlocoCriacao(false); // modo editar: esconde dados de usuário e tipo
=======
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e
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

<<<<<<< HEAD
document.getElementById('perfil-foto-arquivo').addEventListener('change', (evento) => {
  const arquivo = evento.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = () => {
    document.getElementById('perfil-foto-preview').src = leitor.result;
    document.getElementById('perfil-foto-preview').style.display = 'block';
    document.getElementById('perfil-foto-url').value = leitor.result;
  };
  leitor.readAsDataURL(arquivo);
});

=======
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e
document.getElementById('btn-novo-perfil').addEventListener('click', () => {
  limparFormularioPerfil();
  abrirModal('modal-perfil');
});

document.getElementById('btn-cancelar-perfil').addEventListener('click', () => {
  fecharModal('modal-perfil');
});

<<<<<<< HEAD
document.getElementById('perfil-tipo').addEventListener('change', (e) => {
  document.getElementById('campos-cuidador').style.display =
    e.target.value === 'cuidador' ? 'block' : 'none';
});



=======
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e
document.getElementById('form-perfil').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const idOriginal = document.getElementById('perfil-id-original').value;

<<<<<<< HEAD
  try {
    if (idOriginal) {
      await api.put(`${PERFIS_URL}/${idOriginal}`, {
        nome: document.getElementById('perfil-nome').value,
        fotoURL: document.getElementById('perfil-foto-url').value,
        cidade: document.getElementById('perfil-cidade').value,
        estado: document.getElementById('perfil-estado').value,
        bio: document.getElementById('perfil-bio').value,
      });
      showToast('Perfil atualizado.');
    } else {
      const tipo = document.getElementById('perfil-tipo').value;

      const dados = {
        cpf: document.getElementById('perfil-cpf').value,
        email: document.getElementById('perfil-email').value,
        telefone: document.getElementById('perfil-telefone').value,
        endereco: document.getElementById('perfil-endereco').value,
        dataNascimento: document.getElementById('perfil-data-nascimento').value,
        senha: document.getElementById('perfil-senha').value,
        nome: document.getElementById('perfil-nome').value,
        fotoURL: document.getElementById('perfil-foto-url').value,
        cidade: document.getElementById('perfil-cidade').value,
        estado: document.getElementById('perfil-estado').value,
        bio: document.getElementById('perfil-bio').value,
        tipo: tipo,
      };

      if (tipo === 'cuidador') {
        dados.certificado = document.getElementById('perfil-certificado').value;
        dados.orgaoEmissor = document.getElementById('perfil-orgao').value;
        dados.valorServico = document.getElementById('perfil-valor').value || 0;
      }

=======
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
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e
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