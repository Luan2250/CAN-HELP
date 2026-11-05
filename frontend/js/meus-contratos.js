const usuarioAtual = typeof getUsuarioLogado === 'function' ? getUsuarioLogado() : null;
const statusNome = {pendente:'Pendente',aceito:'Aceito',recusado:'Recusado',cancelado_cliente:'Cancelado pelo cliente',cancelado_cuidador:'Cancelado pelo cuidador',concluido:'Concluído'};
function escaparContrato(v){const e=document.createElement('span');e.textContent=v??'';return e.innerHTML;}
function idUsuarioAtual(){return Number(usuarioAtual?.idUsuario||usuarioAtual?.id_usuario||0);}
async function nomePerfil(id){try{const p=await api.get(`/perfis/${id}`);return p?.nome||p?.perfil?.nome||`Usuário #${id}`;}catch(_){return `Usuário #${id}`;}}
async function carregarMeusContratos(){
 const status=document.getElementById('meus-contratos-status'), lista=document.getElementById('meus-contratos-lista');
 if(!usuarioAtual){status.textContent='Faça login para visualizar seus contratos.';return;}
 const id=idUsuarioAtual(); if(!id){status.textContent='Não foi possível identificar o usuário conectado.';return;}
 try{
  const todos=await api.get('/contratos');
  const meus=(Array.isArray(todos)?todos:[]).filter(c=>Number(c.idCliente)===id||Number(c.idCuidador)===id);
  if(!meus.length){status.textContent='Você ainda não possui contratos.';lista.innerHTML='<div class="contrato-vazio">Quando você contratar ou aceitar um atendimento, ele aparecerá aqui.</div>';return;}
  status.textContent=`Encontramos ${meus.length} ${meus.length===1?'contrato':'contratos'} vinculados à sua conta.`;
  const cards=await Promise.all(meus.map(async c=>{
   const souCliente=Number(c.idCliente)===id, outroId=souCliente?c.idCuidador:c.idCliente;
   const nome=await nomePerfil(outroId);
   const podeCancelar=['pendente','aceito'].includes(c.statusContrato);
   const acao=souCliente?'cancelar':'cancelar-cuidador';
   return `<article class="contrato-card"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><h2>${souCliente?'Cuidador':'Cliente'}: ${escaparContrato(nome)}</h2><span class="status-pill">${escaparContrato(statusNome[c.statusContrato]||c.statusContrato||'—')}</span></div>
   <p>Contrato #${Number(c.idContrato)}</p><div class="linha"><span>Data do atendimento</span><strong>${escaparContrato(c.dataAtendimento||'A definir')}</strong></div>
   <div class="linha"><span>Local</span><strong>${escaparContrato(c.localizacao||'Não informado')}</strong></div>
   <div class="linha"><span>Auxiliado</span><strong>${escaparContrato(c.nomeAuxiliado||'—')}</strong></div>
   <div class="linha"><span>Valor</span><strong>R$ ${Number(c.valorFinal||0).toFixed(2).replace('.',',')}</strong></div>
   <div class="contrato-acoes"><button class="btn-chat-contrato" onclick="location.href='chat.html'">Abrir chat</button><button class="btn-cancelar-contrato" ${podeCancelar?'':'disabled'} data-id="${Number(c.idContrato)}" data-acao="${acao}">${podeCancelar?'Cancelar serviço':'Cancelamento indisponível'}</button></div></article>`;
  }));
  lista.innerHTML=cards.join('');
  lista.querySelectorAll('.btn-cancelar-contrato:not(:disabled)').forEach(btn=>btn.addEventListener('click',()=>cancelarMeuContrato(Number(btn.dataset.id),btn.dataset.acao)));
 }catch(e){status.textContent=`Não foi possível carregar seus contratos: ${e.message}`;}
}
async function cancelarMeuContrato(id,acao){
 if(!confirm(`Deseja realmente cancelar o contrato #${id}? Essa ação não poderá ser desfeita.`))return;
 try{
  await api.post(`/contratos/${id}/${acao}`,{id_usuario_requisitante:idUsuarioAtual()});
  showToast('Serviço cancelado com sucesso.');
  carregarMeusContratos();
 }catch(e){showToast(e.message,'error');}
}
carregarMeusContratos();
