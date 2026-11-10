const formCadastro = document.getElementById('form-cadastro');
const feedbackCadastro = document.getElementById('cadastro-feedback');
const tipoCadastro = document.getElementById('cadastro-tipo');
const camposCuidador = document.getElementById('campos-cuidador');
const certificadoInput = document.getElementById('cadastro-certificado');
const orgaoInput = document.getElementById('cadastro-orgao-emissor');
const valorServicoInput = document.getElementById('cadastro-valor-servico');

function atualizarCamposPorTipo() {
  const ehCuidador = tipoCadastro.value === 'cuidador';
  camposCuidador.hidden = !ehCuidador;
  certificadoInput.required = ehCuidador;
  orgaoInput.required = ehCuidador;
  valorServicoInput.required = ehCuidador;
}

tipoCadastro.addEventListener('change', atualizarCamposPorTipo);
atualizarCamposPorTipo();

formCadastro.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  feedbackCadastro.classList.remove('success');
  feedbackCadastro.textContent = '';

  const cpf = document.getElementById('cadastro-cpf').value.replace(/\D/g, '');
  const email = document.getElementById('cadastro-email').value.trim();
  const telefone = document.getElementById('cadastro-telefone').value.trim();
  const endereco = document.getElementById('cadastro-endereco').value.trim();
  const dataNascimento = document.getElementById('cadastro-nascimento').value;
  const senha = document.getElementById('cadastro-senha').value;
  const confirmarSenha = document.getElementById('cadastro-confirmar-senha').value;
  const tipo = tipoCadastro.value;

  if (cpf.length !== 11) {
    feedbackCadastro.textContent = 'Digite um CPF com 11 números.';
    document.getElementById('cadastro-cpf').focus();
    return;
  }
  if (senha.length < 6) {
    feedbackCadastro.textContent = 'A senha precisa ter pelo menos 6 caracteres.';
    document.getElementById('cadastro-senha').focus();
    return;
  }
  if (senha !== confirmarSenha) {
    feedbackCadastro.textContent = 'As senhas não coincidem.';
    document.getElementById('cadastro-confirmar-senha').focus();
    return;
  }
  if (tipo === 'cuidador' && (!certificadoInput.value.trim() || !orgaoInput.value.trim())) {
    feedbackCadastro.textContent = 'Para cadastrar como cuidador, informe o certificado e o órgão emissor.';
    return;
  }

  const dados = {
    tipo,
    nome: document.getElementById('cadastro-nome').value.trim(),
    bio: document.getElementById('cadastro-bio').value.trim() || null,
    cidade: document.getElementById('cadastro-cidade').value.trim() || null,
    estado: document.getElementById('cadastro-estado').value.trim() || null,
    cpf,
    email,
    telefone,
    endereco: endereco || null,
    dataNascimento,
    senha
  };

  if (tipo === 'cuidador') {
    dados.certificado = certificadoInput.value.trim();
    dados.orgaoEmissor = orgaoInput.value.trim();
    dados.valorServico = Number(valorServicoInput.value || 0);
    dados.disponibilidade = document.getElementById('cadastro-disponibilidade').value.trim() || null;
  }

  const botao = formCadastro.querySelector('button[type="submit"]');
  botao.disabled = true;
  botao.textContent = 'Criando conta...';

  try {
   
    const resultado = await api.post('/perfis', dados);
    feedbackCadastro.classList.add('success');
    feedbackCadastro.textContent = `Conta de ${tipo === 'cliente' ? 'cliente' : 'cuidador(a)'} criada com sucesso! Agora você pode entrar.`;
    formCadastro.reset();
    tipoCadastro.value = 'cliente';
    atualizarCamposPorTipo();
    let link = formCadastro.querySelector('.cadastro-login-link');
    if (!link) {
      link = document.createElement('a');
      link.href = 'index.html';
      link.className = 'guest-link cadastro-login-link';
      link.textContent = 'Ir para entrar no CanHelp';
      link.style.marginTop = '8px';
      feedbackCadastro.insertAdjacentElement('afterend', link);
    }
    botao.textContent = 'Conta criada';
  } catch (erro) {
    feedbackCadastro.textContent = `Não foi possível criar a conta: ${erro.message}. Verifique se a API está conectada.`;
    botao.disabled = false;
    botao.textContent = 'Criar conta';
  }
});
