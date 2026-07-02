// Tela de Usuários: lista, cria, edita e remove usando a API /usuarios.
//
// ATENÇÃO: este arquivo assume que o to_dict() do seu Model Usuario
// devolve a chave "idUsuario" para o identificador. Se o seu to_dict()
// usar outro nome (ex: "id"), troque a função pegarId() abaixo — é a
// única linha que precisa mudar.

const USUARIOS_URL = '/usuarios';

function pegarId(usuario) {
  return usuario.idUsuario ?? usuario.id;
}

async function carregarUsuarios() {
  const corpo = document.getElementById('usuarios-corpo');
  corpo.innerHTML = '<tr><td colspan="7" class="empty">Carregando...</td></tr>';

  try {
    const usuarios = await api.get(USUARIOS_URL);

    if (!usuarios || usuarios.length === 0) {
      corpo.innerHTML = '<tr><td colspan="7" class="empty">Nenhum usuário cadastrado ainda.</td></tr>';
      return;
    }

    corpo.innerHTML = usuarios.map((usuario) => `
      <tr>
        <td>${pegarId(usuario)}</td>
        <td>${usuario.cpf ?? '—'}</td>
        <td>${usuario.email ?? '—'}</td>
        <td>${usuario.telefone ?? '—'}</td>
        <td>${usuario.endereco ?? '—'}</td>
        <td>${usuario.dataNascimento ?? '—'}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" onclick='editarUsuario(${JSON.stringify(usuario)})'>Editar</button>
            <button class="btn-icon danger" onclick="removerUsuario(${pegarId(usuario)})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="7" class="empty">Erro ao carregar: ${erro.message}</td></tr>`;
  }
}

function limparFormularioUsuario() {
  document.getElementById('form-usuario').reset();
  document.getElementById('usuario-id').value = '';
  document.getElementById('modal-usuario-titulo').textContent = 'Novo usuário';
  document.getElementById('usuario-cpf').disabled = false;
}

function editarUsuario(usuario) {
  document.getElementById('usuario-id').value = pegarId(usuario);
  document.getElementById('usuario-cpf').value = usuario.cpf ?? '';
  document.getElementById('usuario-cpf').disabled = true; // CPF geralmente não deve mudar
  document.getElementById('usuario-email').value = usuario.email ?? '';
  document.getElementById('usuario-telefone').value = usuario.telefone ?? '';
  document.getElementById('usuario-endereco').value = usuario.endereco ?? '';
  document.getElementById('usuario-data-nascimento').value = usuario.dataNascimento ?? '';
  document.getElementById('usuario-senha').value = '';
  document.getElementById('modal-usuario-titulo').textContent = 'Editar usuário';
  abrirModal('modal-usuario');
}

async function removerUsuario(id) {
  if (!confirm('Tem certeza que deseja excluir este usuário? Isso também remove o perfil vinculado.')) return;

  try {
    await api.del(`${USUARIOS_URL}/${id}`);
    showToast('Usuário excluído.');
    carregarUsuarios();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-novo-usuario').addEventListener('click', () => {
  limparFormularioUsuario();
  abrirModal('modal-usuario');
});

document.getElementById('btn-cancelar-usuario').addEventListener('click', () => {
  fecharModal('modal-usuario');
});

document.getElementById('form-usuario').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = document.getElementById('usuario-id').value;
  const senha = document.getElementById('usuario-senha').value;

  const dados = {
    cpf: document.getElementById('usuario-cpf').value,
    email: document.getElementById('usuario-email').value,
    telefone: document.getElementById('usuario-telefone').value,
    endereco: document.getElementById('usuario-endereco').value,
    dataNascimento: document.getElementById('usuario-data-nascimento').value,
  };
  if (senha) dados.senha = senha;

  try {
    if (id) {
      // Atualização: o AtualizarUsuarioService não aceita cpf/dataNascimento,
      // então mandamos só os campos que ele realmente usa.
      await api.put(`${USUARIOS_URL}/${id}`, {
        email: dados.email,
        telefone: dados.telefone,
        endereco: dados.endereco,
        ...(senha ? { senha } : {}),
      });
      showToast('Usuário atualizado.');
    } else {
      if (!senha) {
        showToast('Informe uma senha para criar o usuário.', 'error');
        return;
      }
      await api.post(USUARIOS_URL, dados);
      showToast('Usuário criado.');
    }

    fecharModal('modal-usuario');
    carregarUsuarios();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarUsuarios();
