// Tela de Chat (RF09): lista as conversas (uma por contrato) do usuário
// logado e permite trocar mensagens em tempo quase real (polling).

const CHAT_ID_STORAGE_KEY = 'canhelp_chat_id_usuario';
const CHAT_POLL_MS = 3500;

let meuId = null;
let contratoSelecionado = null;
let outroUsuarioSelecionado = null;
let ultimaAssinaturaMensagens = '';
let pollConversasTimer = null;
let pollMensagensTimer = null;

function obterIdUsuarioInicial() {
  const usuarioLogado = getUsuarioLogado();
  if (usuarioLogado && usuarioLogado.idUsuario) {
    return usuarioLogado.idUsuario;
  }
  const salvo = localStorage.getItem(CHAT_ID_STORAGE_KEY);
  return salvo ? Number(salvo) : null;
}

function formatarHora(isoString) {
  if (!isoString) return '';
  const data = new Date(isoString);
  if (Number.isNaN(data.getTime())) return '';
  return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

async function carregarConversas(manterSelecao = true) {
  const lista = document.getElementById('chat-lista-conversas');

  if (!meuId) {
    lista.innerHTML = '<div class="chat-vazio">Informe seu ID de usuário acima para ver suas conversas.</div>';
    return;
  }

  try {
    const conversas = await api.get(`/usuarios/${meuId}/conversas`);

    if (!conversas || conversas.length === 0) {
      lista.innerHTML = '<div class="chat-vazio">Nenhuma conversa ainda. Conversas aparecem aqui a partir de um contrato entre cliente e cuidador.</div>';
      return;
    }

    lista.innerHTML = conversas.map((conversa) => `
      <button type="button" class="chat-conversa-item ${contratoSelecionado === conversa.idContrato ? 'active' : ''}"
              data-id-contrato="${conversa.idContrato}"
              data-id-outro="${conversa.idOutroUsuario}"
              data-nome-outro="${escapeHtml(conversa.nomeOutroUsuario)}"
              data-papel-outro="${conversa.papelOutroUsuario}">
        <span class="chat-conversa-nome">
          <span>${escapeHtml(conversa.nomeOutroUsuario)}</span>
          ${conversa.naoLidas > 0 ? `<span class="chat-badge">${conversa.naoLidas}</span>` : ''}
        </span>
        <span class="chat-conversa-preview">${conversa.ultimaMensagem ? escapeHtml(conversa.ultimaMensagem) : 'Nenhuma mensagem ainda'}</span>
        <span class="chat-conversa-status">Contrato #${conversa.idContrato} · ${conversa.nomeAuxiliado}</span>
      </button>
    `).join('');

    lista.querySelectorAll('.chat-conversa-item').forEach((botao) => {
      botao.addEventListener('click', () => {
        selecionarConversa(
          Number(botao.dataset.idContrato),
          Number(botao.dataset.idOutro),
          botao.dataset.nomeOutro,
          botao.dataset.papelOutro
        );
      });
    });
  } catch (erro) {
    lista.innerHTML = `<div class="chat-vazio">Erro ao carregar conversas: ${erro.message}</div>`;
  }
}

function selecionarConversa(idContrato, idOutroUsuario, nomeOutro, papelOutro) {
  contratoSelecionado = idContrato;
  outroUsuarioSelecionado = idOutroUsuario;
  ultimaAssinaturaMensagens = '';

  document.getElementById('chat-painel-topo').innerHTML = `
    ${escapeHtml(nomeOutro)}
    <div class="chat-painel-sub">${papelOutro === 'cuidador' ? 'Cuidador' : 'Cliente'} · Contrato #${idContrato}</div>
  `;
  document.getElementById('chat-form').style.display = 'flex';

  document.querySelectorAll('.chat-conversa-item').forEach((el) => {
    el.classList.toggle('active', Number(el.dataset.idContrato) === idContrato);
  });

  carregarMensagens();
}

async function carregarMensagens() {
  if (!contratoSelecionado || !meuId) return;

  const container = document.getElementById('chat-mensagens');

  try {
    const mensagens = await api.get(`/contratos/${contratoSelecionado}/mensagens`);

    // Evita re-renderizar (e perder o scroll) se nada mudou desde o último polling.
    const assinatura = JSON.stringify(mensagens.map((m) => [m.idMensagem, m.lida]));
    if (assinatura === ultimaAssinaturaMensagens) return;
    ultimaAssinaturaMensagens = assinatura;

    if (mensagens.length === 0) {
      container.innerHTML = '<div class="chat-vazio">Nenhuma mensagem ainda. Diga oi! 👋</div>';
    } else {
      container.innerHTML = mensagens.map((mensagem) => {
        const ehMinha = Number(mensagem.idRemetente) === Number(meuId);
        return `
          <div class="chat-bolha ${ehMinha ? 'chat-bolha-eu' : 'chat-bolha-outro'}">
            ${escapeHtml(mensagem.texto)}
            <span class="chat-bolha-hora">${formatarHora(mensagem.dataEnvio)}</span>
          </div>
        `;
      }).join('');
      container.scrollTop = container.scrollHeight;
    }

    // Marca como lidas as mensagens que o outro usuário me mandou.
    await fetch(`${API_BASE}/contratos/${contratoSelecionado}/mensagens/lidas`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUsuario: meuId })
    });

    carregarConversas();
  } catch (erro) {
    container.innerHTML = `<div class="chat-vazio">Erro ao carregar mensagens: ${erro.message}</div>`;
  }
}

async function enviarMensagem(texto) {
  if (!contratoSelecionado || !meuId) return;

  try {
    await api.post('/mensagens', {
      idContrato: contratoSelecionado,
      idRemetente: meuId,
      texto
    });
    ultimaAssinaturaMensagens = ''; // força re-render na próxima checagem
    await carregarMensagens();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

function iniciarPolling() {
  clearInterval(pollConversasTimer);
  clearInterval(pollMensagensTimer);

  pollConversasTimer = setInterval(() => carregarConversas(), CHAT_POLL_MS);
  pollMensagensTimer = setInterval(() => carregarMensagens(), CHAT_POLL_MS);
}

function definirUsuario(id) {
  meuId = id;
  localStorage.setItem(CHAT_ID_STORAGE_KEY, String(id));
  document.getElementById('chat-usuario-atual').textContent = `Usando como usuário #${id}`;
  document.getElementById('chat-id-usuario').value = id;
  contratoSelecionado = null;
  document.getElementById('chat-form').style.display = 'none';
  document.getElementById('chat-painel-topo').textContent = 'Selecione uma conversa';
  document.getElementById('chat-mensagens').innerHTML = '<div class="chat-vazio">Selecione uma conversa à esquerda.</div>';
  carregarConversas();
}

document.getElementById('btn-usar-id').addEventListener('click', () => {
  const valor = Number(document.getElementById('chat-id-usuario').value);
  if (!valor) {
    showToast('Informe um ID de usuário válido.', 'error');
    return;
  }
  definirUsuario(valor);
});

document.getElementById('chat-form').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const input = document.getElementById('chat-input-texto');
  const texto = input.value.trim();
  if (!texto) return;
  input.value = '';
  enviarMensagem(texto);
});

// Inicialização
const idInicial = obterIdUsuarioInicial();
if (idInicial) {
  definirUsuario(idInicial);
}
iniciarPolling();
