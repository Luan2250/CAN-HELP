
const CHAT_POLL_MS = 3500;
const CHAT_ID_STORAGE_KEY = 'canhelp_chat_id_usuario';
let chatMeuId = null;
let chatContratoId = null;
let chatAssinatura = '';
let chatTimerConversas = null;
let chatTimerMensagens = null;

function chatEsc(valor) {
  const el = document.createElement('span');
  el.textContent = valor == null ? '' : String(valor);
  return el.innerHTML;
}
function chatUsuario() {
  try { return typeof getUsuarioLogado === 'function' ? getUsuarioLogado() : JSON.parse(localStorage.getItem('canhelp_usuario') || 'null'); }
  catch (_) { return null; }
}
function chatData(valor) {
  if (!valor) return '';
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
}
function chatStatus(texto) {
  const el = document.getElementById('chat-status-message');
  if (el) el.textContent = texto;
}
function chatDesabilitarEnvio(mensagem) {
  const input = document.getElementById('message-input');
  const btn = document.querySelector('.send-button');
  input.disabled = true; btn.disabled = true;
  input.placeholder = mensagem || 'Selecione uma conversa para escrever...';
}
function chatHabilitarEnvio() {
  document.getElementById('message-input').disabled = false;
  document.querySelector('.send-button').disabled = false;
  document.getElementById('message-input').placeholder = 'Digite sua mensagem...';
}
function chatDefinirUsuario(id, origem='teste') {
  chatMeuId = Number(id);
  if (!Number.isInteger(chatMeuId) || chatMeuId < 1) { showToast('ID de usuário inválido.', 'error'); return; }
  localStorage.setItem(CHAT_ID_STORAGE_KEY, String(chatMeuId));
  document.getElementById('chat-usuario-atual').textContent =
    origem === 'login' ? `Conectado como ${chatUsuario()?.email || 'usuário'} · ID ${chatMeuId}` : `Modo de teste · usuário #${chatMeuId}`;
  document.getElementById('chat-id-usuario').value = chatMeuId;
  chatContratoId = null; chatAssinatura = '';
  document.getElementById('chat-painel-topo').textContent = 'Selecione uma conversa';
  document.getElementById('conversation-body').innerHTML = '<div class="welcome-message"><div class="welcome-bubble">💬</div><h3>Escolha uma conversa</h3><p>Selecione um contrato na lista ao lado para visualizar as mensagens.</p></div>';
  chatDesabilitarEnvio();
  carregarConversasCanHelp();
}
async function carregarConversasCanHelp() {
  const lista = document.getElementById('chat-lista-conversas');
  if (!chatMeuId) { lista.innerHTML = '<div class="chat-empty-list">Entre na sua conta para visualizar suas conversas.</div>'; return; }
  try {
    const conversas = await api.get(`/usuarios/${chatMeuId}/conversas`);
    if (!Array.isArray(conversas) || !conversas.length) {
      lista.innerHTML = '<div class="chat-empty-list">Nenhuma conversa encontrada. As conversas aparecem após existir um contrato entre cliente e cuidador.</div>';
      return;
    }
    lista.innerHTML = conversas.map(c => `
      <button type="button" class="chat-conversa-item ${Number(c.idContrato)===chatContratoId?'active':''}"
        data-contrato="${Number(c.idContrato)}" data-outro="${Number(c.idOutroUsuario)}"
        data-nome="${chatEsc(c.nomeOutroUsuario || 'Usuário')}" data-papel="${chatEsc(c.papelOutroUsuario || 'Contato')}">
        <span class="chat-avatar-mini">${chatEsc((c.nomeOutroUsuario || 'CH').slice(0,2).toUpperCase())}</span>
        <span class="chat-conversa-texto">
          <strong>${chatEsc(c.nomeOutroUsuario || 'Usuário')}</strong>
          <small>${chatEsc(c.ultimaMensagem || 'Nenhuma mensagem ainda')}</small>
          <small>Contrato #${Number(c.idContrato)} · ${chatEsc(c.nomeAuxiliado || 'Atendimento')}</small>
        </span>
        ${Number(c.naoLidas)>0?`<span class="chat-badge">${Number(c.naoLidas)}</span>`:''}
      </button>`).join('');
    lista.querySelectorAll('.chat-conversa-item').forEach(btn => btn.addEventListener('click', () => selecionarConversaCanHelp(
      Number(btn.dataset.contrato), Number(btn.dataset.outro), btn.dataset.nome, btn.dataset.papel
    )));
  } catch (e) {
    lista.innerHTML = `<div class="chat-empty-list">Não foi possível carregar as conversas: ${chatEsc(e.message)}</div>`;
  }
}
function selecionarConversaCanHelp(idContrato, idOutro, nome, papel) {
  chatContratoId = idContrato; chatAssinatura = '';
  document.getElementById('chat-painel-topo').innerHTML = `
    <div class="conversation-avatar">${chatEsc((nome || 'CH').slice(0,2).toUpperCase())}</div>
    <div class="conversation-contact"><h2>${chatEsc(nome)}</h2><p><span class="status-dot"></span>${chatEsc(papel)} · Contrato #${idContrato}</p></div>
    <span class="secure-label">♧ CanHelp</span>`;
  chatHabilitarEnvio();
  document.querySelectorAll('.chat-conversa-item').forEach(el => el.classList.toggle('active', Number(el.dataset.contrato)===idContrato));
  document.getElementById('conversation-body').innerHTML = '<div class="date-divider"><span>Mensagens</span></div><div class="chat-messages-list" id="chat-messages-list"></div>';
  carregarMensagensCanHelp();
}
async function carregarMensagensCanHelp() {
  if (!chatMeuId || !chatContratoId) return;
  const container = document.getElementById('chat-messages-list');
  if (!container) return;
  try {
    const mensagens = await api.get(`/contratos/${chatContratoId}/mensagens`);
    const lista = Array.isArray(mensagens) ? mensagens : [];
    const assinatura = JSON.stringify(lista.map(m => [m.idMensagem,m.lida,m.texto]));
    if (assinatura !== chatAssinatura) {
      chatAssinatura = assinatura;
      container.innerHTML = lista.length ? lista.map(m => {
        const minha = Number(m.idRemetente) === chatMeuId;
        return `<div class="chat-message ${minha?'mine':'theirs'}"><div>${chatEsc(m.texto)}</div><time>${chatData(m.dataEnvio)}</time></div>`;
      }).join('') : '<div class="chat-empty-messages">Ainda não há mensagens. Envie a primeira! 👋</div>';
      const body = document.getElementById('conversation-body');
      body.scrollTop = body.scrollHeight;
    }
    await api.patch(`/contratos/${chatContratoId}/mensagens/lidas`, {idUsuario:chatMeuId});
    await carregarConversasCanHelp();
  } catch (e) { chatStatus(`Erro ao carregar mensagens: ${e.message}`); }
}
async function enviarMensagemCanHelp(texto) {
  if (!chatContratoId || !chatMeuId) return;
  try {
    await api.post('/mensagens', {idContrato:chatContratoId,idRemetente:chatMeuId,texto});
    chatAssinatura = '';
    await carregarMensagensCanHelp();
  } catch (e) { showToast(e.message,'error'); }
}
document.getElementById('btn-usar-id')?.addEventListener('click', () => {
  const id = Number(document.getElementById('chat-id-usuario').value);
  if (id) chatDefinirUsuario(id,'teste');
  else showToast('Informe um ID válido.','error');
});
document.getElementById('message-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const input = document.getElementById('message-input');
  const texto = input.value.trim();
  if (!texto) return;
  input.value = '';
  await enviarMensagemCanHelp(texto);
});
document.addEventListener('DOMContentLoaded', () => {
  const usuario = chatUsuario();
  if (usuario && usuario.idUsuario) chatDefinirUsuario(usuario.idUsuario,'login');
  else {
    const salvo = Number(localStorage.getItem(CHAT_ID_STORAGE_KEY));
    if (salvo) chatDefinirUsuario(salvo,'teste');
    else chatStatus('Faça login para acessar suas conversas. Para demonstração entre duas contas, use Opções de teste e informe o ID do usuário.');
  }
  chatTimerConversas = setInterval(carregarConversasCanHelp, CHAT_POLL_MS);
  chatTimerMensagens = setInterval(carregarMensagensCanHelp, CHAT_POLL_MS);
});
