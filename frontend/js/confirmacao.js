
const params = new URLSearchParams(window.location.search);
let solicitacao = {};
try { solicitacao = JSON.parse(localStorage.getItem('canhelpSolicitacao') || '{}'); } catch (_) {}
const pegar = (chave, padrao = '') => solicitacao[chave] ?? params.get(chave) ?? padrao;


function mensagem(id, texto) {
  const el = document.getElementById(id);
  if (el) el.textContent = texto;
}
function formatarValor(valor) {
  if (valor === '' || valor == null || !Number.isFinite(Number(valor))) return 'A combinar';
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function preencherResumo() {
  const data = pegar('dataAtendimento', pegar('dataAgenda', ''));
  const dataFormatada = data ? data.split('-').reverse().join('/') : 'A definir';
  const servico = pegar('descricaoServico', pegar('tipoServico', pegar('servico', 'Serviço selecionado')));
  const valor = formatarValor(pegar('valorFinal', pegar('valorServico', '')));
  const campos = {
    'resumo-cuidador': pegar('nomeCuidador', 'Cuidador selecionado'),
    'resumo-valor': valor,
    'resumo-data': dataFormatada,
    'resumo-servico': servico
  };
  Object.entries(campos).forEach(([id, texto]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = texto;
  });
}

document.getElementById('btn-confirmar')?.addEventListener('click', () => {

});
preencherResumo();
