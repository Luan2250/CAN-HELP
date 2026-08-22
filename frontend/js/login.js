document.getElementById('form-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;
  const erroEl = document.getElementById('login-erro');
  erroEl.style.display = 'none';

  try {
    const usuario = await api.post('/login', { email, senha });
    salvarUsuarioLogado(usuario);
    showToast(`Bem-vindo(a), ${usuario.email}!`);
    location.href = 'index.html';
  } catch (erro) {
    erroEl.textContent = erro.message;
    erroEl.style.display = 'block';
  }
});

// Se já ta logado, nadave ficar na tela de login
if (getUsuarioLogado()) {
  location.href = 'index.html';
}