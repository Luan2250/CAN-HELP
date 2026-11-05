
const usuarioLogado = exigirLogin();

async function carregarMeuPerfil() {
  try {
    const perfil = await api.get(`/perfis/${usuarioLogado.idUsuario}`);

    document.getElementById('meu-nome').value = perfil.nome ?? '';
    document.getElementById('meu-cidade').value = perfil.cidade ?? '';
    document.getElementById('meu-estado').value = perfil.estado ?? '';
    document.getElementById('meu-bio').value = perfil.bio ?? '';
    document.getElementById('meu-foto-url').value = perfil.fotoURL ?? '';

    if (perfil.fotoURL) {
      const preview = document.getElementById('meu-foto-preview');
      preview.src = perfil.fotoURL;
      preview.style.display = 'block';
    }
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

carregarMeuPerfil();

document.getElementById('form-meu-perfil').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  try {
    await api.put(`/perfis/${usuarioLogado.idUsuario}`, {
      nome: document.getElementById('meu-nome').value,
      fotoURL: document.getElementById('meu-foto-url').value,
      cidade: document.getElementById('meu-cidade').value,
      estado: document.getElementById('meu-estado').value,
      bio: document.getElementById('meu-bio').value,
    });
    showToast('Perfil atualizado.');
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

const TAMANHO_MAXIMO_FOTO = 2 * 1024 * 1024; // 2 MB

document.getElementById('meu-foto-arquivo').addEventListener('change', (evento) => {
  const arquivo = evento.target.files[0];
  if (!arquivo) return;

  if (!arquivo.type.startsWith('image/')) {
    showToast('Escolha um arquivo de imagem.', 'error');
    evento.target.value = '';
    return;
  }

  if (arquivo.size > TAMANHO_MAXIMO_FOTO) {
    showToast('A foto deve ter no máximo 2 MB.', 'error');
    evento.target.value = '';
    return;
  }

  const leitor = new FileReader();
  leitor.onload = () => {
    document.getElementById('meu-foto-preview').src = leitor.result;
    document.getElementById('meu-foto-preview').style.display = 'block';
    document.getElementById('meu-foto-url').value = leitor.result;
  };
  leitor.readAsDataURL(arquivo);
});