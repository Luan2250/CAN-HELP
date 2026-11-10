// Ajudantes compartilhados para trocar "digite o ID" por listas de seleção.
//
// A ideia: o usuário escolhe pelo NOME (cliente, cuidador, serviço, contrato...)
// e o <select> continua devolvendo o ID como value. Assim a API e o banco não
// mudam em nada: o front só traduz ID <-> texto legível.
//
// Depende de: app.js (api) e auth.js (getUsuarioLogado). Carregue depois deles.

const ref = {
  perfis: [],
  clientes: [],
  cuidadores: [],
  servicos: [],
  contratos: [],
  agendas: [],
};

// Escapa texto vindo do banco antes de colocar em innerHTML.
function esc(texto) {
  return String(texto ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function dataBR(iso) {
  if (!iso) return '—';
  const [a, m, d] = String(iso).slice(0, 10).split('-');
  return d && m && a ? `${d}/${m}/${a}` : iso;
}

function moedaBR(valor) {
  return `R$ ${Number(valor ?? 0).toFixed(2).replace('.', ',')}`;
}

// Busca de uma vez só tudo o que as telas precisam para mostrar nomes.
// allSettled: se uma rota falhar, as outras listas continuam funcionando.
async function carregarReferencias(quais = Object.keys(ref)) {
  const rotas = {
    perfis: '/perfis',
    clientes: '/clientes',
    cuidadores: '/cuidadores',
    servicos: '/listasServicos',
    contratos: '/contratos',
    agendas: '/agendas',
  };

  const chaves = quais.filter((k) => rotas[k]);
  const resultados = await Promise.allSettled(chaves.map((k) => api.get(rotas[k])));

  resultados.forEach((r, i) => {
    ref[chaves[i]] = r.status === 'fulfilled' && Array.isArray(r.value) ? r.value : [];
  });
}

// ---------- ID -> texto legível ----------

function nomeUsuario(id) {
  const perfil = ref.perfis.find((p) => Number(p.idUsuario) === Number(id));
  return perfil?.nome || `Usuário #${id}`;
}

function nomeServico(id) {
  const s = ref.servicos.find((x) => Number(x.idServico) === Number(id));
  return s?.tipoServico || `Serviço #${id}`;
}

function buscarContrato(id) {
  return ref.contratos.find((c) => Number(c.idContrato) === Number(id));
}

function buscarAgenda(id) {
  return ref.agendas.find((a) => Number(a.idAgenda) === Number(id));
}

const STATUS_CONTRATO = {
  pendente: 'Pendente',
  aceito: 'Aceito',
  recusado: 'Recusado',
  cancelado_cliente: 'Cancelado (cliente)',
  cancelado_cuidador: 'Cancelado (cuidador)',
  concluido: 'Concluído',
};

// "Maria ↔ João" — quem participa do contrato.
function participantesContrato(c) {
  return `${nomeUsuario(c.idCliente)} ↔ ${nomeUsuario(c.idCuidador)}`;
}

// "15/11/2026 · Maria ↔ João · Pendente (#12)"
function rotuloContrato(c) {
  const status = STATUS_CONTRATO[c.statusContrato] ?? c.statusContrato ?? '';
  return `${dataBR(c.dataAtendimento)} · ${participantesContrato(c)} · ${status} (#${c.idContrato})`;
}

// Só "Maria ↔ João" (para cards onde a data/status já aparecem ao lado).
function rotuloContratoCurto(id) {
  const c = buscarContrato(id);
  return c ? participantesContrato(c) : `Contrato #${id}`;
}

// Texto curto para tabelas/cards quando só temos o idContrato.
function rotuloContratoPorId(id) {
  const c = buscarContrato(id);
  return c ? rotuloContrato(c) : `Contrato #${id}`;
}

// "15/11/2026 08:00 · Consulta médica — Maria ↔ João"
function rotuloAgenda(a) {
  const hora = a.horaAgenda ? String(a.horaAgenda).slice(0, 5) : '';
  const c = buscarContrato(a.idContrato);
  const quem = c ? ` — ${participantesContrato(c)}` : '';
  return `${dataBR(a.dataAgenda)} ${hora} · ${a.ocasiao ?? 'Compromisso'}${quem}`;
}

function rotuloAgendaPorId(id) {
  const a = buscarAgenda(id);
  return a ? rotuloAgenda(a) : `Agenda #${id}`;
}

// ---------- <select> ----------

// Se duas pessoas têm o mesmo nome na lista, acrescenta "(#id)" só nelas.
function desambiguarNomes(itens) {
  const contagem = {};
  itens.forEach((i) => { contagem[i.nome] = (contagem[i.nome] || 0) + 1; });
  return itens.map((i) => (contagem[i.nome] > 1 ? { ...i, nome: `${i.nome} (#${i.id})` } : i));
}

// itens: array de objetos. valor/rotulo: funções que dizem o que cada item vira.
// opcoes.desabilitar(item) -> true deixa a opção visível porém não selecionável.
function preencherSelect(select, itens, { valor, rotulo, placeholder = 'Selecione...', desabilitar } = {}) {
  const anterior = select.value;

  select.innerHTML = `<option value="" disabled selected>${esc(placeholder)}</option>` +
    itens.map((item) => {
      const off = desabilitar && desabilitar(item) ? ' disabled' : '';
      return `<option value="${esc(valor(item))}"${off}>${esc(rotulo(item))}</option>`;
    }).join('');

  // Mantém a escolha anterior se ela ainda existir (ex.: recarregar a lista).
  if (anterior && [...select.options].some((o) => o.value === anterior && !o.disabled)) {
    select.value = anterior;
  }

  if (itens.length === 0) {
    select.options[0].textContent = 'Nada cadastrado ainda';
  }
}

// Se o usuário logado estiver na lista, devolve o id dele (para pré-selecionar).
function usuarioLogadoEm(ids) {
  const u = typeof getUsuarioLogado === 'function' ? getUsuarioLogado() : null;
  if (!u) return null;
  return ids.map(Number).includes(Number(u.idUsuario)) ? String(u.idUsuario) : null;
}

// ---------- selects prontos reaproveitados pelas telas ----------

function selectClientes(select) {
  const itens = desambiguarNomes(
    ref.clientes.map((c) => ({ id: c.idUsuario, nome: nomeUsuario(c.idUsuario) })),
  ).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  preencherSelect(select, itens, {
    valor: (i) => i.id, rotulo: (i) => i.nome, placeholder: 'Selecione o cliente',
  });
}

function selectCuidadores(select) {
  const itens = desambiguarNomes(ref.cuidadores.map((c) => ({
    id: c.idUsuario,
    nome: nomeUsuario(c.idUsuario),
    valor: c.valorServico,
  }))).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  preencherSelect(select, itens, {
    valor: (i) => i.id,
    rotulo: (i) => `${i.nome} — ${moedaBR(i.valor)}`,
    placeholder: 'Selecione o cuidador',
  });
}

function selectServicos(select) {
  preencherSelect(select, ref.servicos, {
    valor: (s) => s.idServico,
    rotulo: (s) => `${s.tipoServico} — ${moedaBR(s.precoBase)}`,
    placeholder: 'Selecione o serviço',
  });
}

function selectContratos(select, placeholder = 'Selecione o contrato') {
  const itens = [...ref.contratos].sort((a, b) =>
    String(b.dataAtendimento).localeCompare(String(a.dataAtendimento)));
  preencherSelect(select, itens, {
    valor: (c) => c.idContrato, rotulo: rotuloContrato, placeholder,
  });
}

function selectAgendas(select) {
  const itens = [...ref.agendas].sort((a, b) =>
    `${b.dataAgenda} ${b.horaAgenda}`.localeCompare(`${a.dataAgenda} ${a.horaAgenda}`));
  preencherSelect(select, itens, {
    valor: (a) => a.idAgenda, rotulo: rotuloAgenda, placeholder: 'Selecione o compromisso',
  });
}

// Qualquer usuário que tenha perfil (usado onde não importa se é cliente ou cuidador).
function selectUsuarios(select, placeholder = 'Selecione o usuário') {
  const itens = desambiguarNomes(
    ref.perfis.map((p) => ({ id: p.idUsuario, nome: p.nome || `Usuário #${p.idUsuario}` })),
  ).sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  preencherSelect(select, itens, {
    valor: (i) => i.id, rotulo: (i) => i.nome, placeholder,
  });
}