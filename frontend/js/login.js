// Login integrado à API do Backend (POST /login).
const formLogin = document.getElementById('form-login');
const inputEmail = document.getElementById('login-email');
const inputSenha = document.getElementById('login-senha');
const toggleSenha = document.getElementById('toggle-senha');
const feedbackLogin = document.getElementById('login-feedback');

if (toggleSenha && inputSenha) toggleSenha.addEventListener('click', () => {
  const mostrar = inputSenha.type === 'password';
  inputSenha.type = mostrar ? 'text' : 'password';
  toggleSenha.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
  toggleSenha.setAttribute('aria-pressed', String(mostrar));
});

if (formLogin) formLogin.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  feedbackLogin.textContent = '';
  if (!inputEmail.value.trim() || !inputSenha.value) {
    feedbackLogin.textContent = 'Preencha o e-mail e a senha para continuar.'; return;
  }
  if (!inputEmail.validity.valid) {
    feedbackLogin.textContent = 'Digite um endereço de e-mail válido.'; inputEmail.focus(); return;
  }
  const botao = formLogin.querySelector('[type="submit"]');
  botao.disabled = true; botao.textContent = 'Entrando...';
  try {
    const usuario = await api.post('/login', { email: inputEmail.value.trim(), senha: inputSenha.value });
    localStorage.setItem('canhelp_usuario', JSON.stringify(usuario));
    // Compatibilidade com páginas de autenticação usadas no projeto de referência.
    localStorage.setItem('canhelp_chat_id_usuario', String(usuario.idUsuario));
    feedbackLogin.textContent = 'Login realizado!';
    feedbackLogin.classList.add('success');
    const destino = sessionStorage.getItem('canhelp_destino_apos_login');
    sessionStorage.removeItem('canhelp_destino_apos_login');
    location.href = destino || 'home.html';
  } catch (erro) {
    feedbackLogin.textContent = `Não foi possível entrar: ${erro.message}`;
    feedbackLogin.classList.remove('success');
  } finally { botao.disabled = false; botao.textContent = 'Entrar'; }
});
