const FILTRAR_URL = '/cuidadores/filtrar';
let cuidadoresEncontrados = [];

function esc(texto) {
  const d = document.createElement('div');
  d.textContent = texto ?? '';
  return d.innerHTML;
}

function reais(valor) {
  return 'R$ ' + Number(valor ?? 0).toFixed(2).replace('.', ',');
}

function montarParametros() {
  const campos = {
    cidade: 'filtro-cidade',
    estado: 'filtro-estado',
    valor_max: 'filtro-valor-max',
    nota_min: 'filtro-nota-min',
    data: 'filtro-data',
    ordenar: 'filtro-ordenar',
  };
  const params = new URLSearchParams();
  for (const [nome, id] of Object.entries(campos)) {
    const valor = document.getElementById(id).value.trim();
    if (valor) params.set(nome, valor); 
  }
  return params;
}

function dataBR(iso) {
  return iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—';
}

async function carregarAvaliacoes(idUsuario) {
  const resumo = document.getElementById('det-avaliacoes-resumo');
  const lista = document.getElementById('det-avaliacoes-lista');
  resumo.textContent = 'Carregando avaliações...';
  lista.innerHTML = '';

  try {
    const dados = await api.get(`/usuarios/${idUsuario}/avaliacoes`);

    if (dados.total === 0) {
      resumo.textContent = 'Este cuidador ainda não recebeu avaliações.';
      return;
    }

    resumo.textContent = `Nota média ${dados.media.toFixed(1)} · ${dados.total} ${dados.total === 1 ? 'avaliação' : 'avaliações'}`;
    lista.innerHTML = dados.avaliacoes.map((av) => `
      <div style="padding:8px 0; border-top:1px solid var(--line);">
        <strong>${esc(av.nomeAvaliador)}</strong> · ${av.nota}/5 · ${dataBR(av.dataAvaliacao)}
        <div>${esc(av.comentario) || '<em>Sem comentário.</em>'}</div>
      </div>
    `).join('');
  } catch (erro) {
    resumo.textContent = 'Não foi possível carregar as avaliações: ' + erro.message;
  }
}

async function buscarCuidadores() {
  const corpo = document.getElementById('busca-corpo');
  corpo.innerHTML = '<tr><td colspan="6" class="empty">Carregando...</td></tr>';
  const params = montarParametros();

  try {
    cuidadoresEncontrados = await api.get(FILTRAR_URL + (params.toString() ? '?' + params : '')) || [];

    if (cuidadoresEncontrados.length === 0) {
      corpo.innerHTML = '<tr><td colspan="6" class="empty">Nenhum cuidador encontrado com esses filtros.</td></tr>';
      return;
    }

    corpo.innerHTML = cuidadoresEncontrados.map((c, i) => `
      <tr>
        <td>${esc(c.nome)}</td>
        <td>${esc(c.cidade)}${c.estado ? ' / ' + esc(c.estado) : ''}</td>
        <td>${reais(c.valorServico)}</td>
        <td>${c.notaMedia ? Number(c.notaMedia).toFixed(1) : 'Sem avaliações'}</td>
        <td>${esc(c.disponibilidade) || '—'}</td>
        <td><div class="row-actions"><button class="btn-icon" onclick="abrirDetalhes(${i})">Detalhes</button></div></td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="6" class="empty">Erro ao buscar: ${esc(erro.message)}</td></tr>`;
  }
}

function abrirDetalhes(indice) {
  const c = cuidadoresEncontrados[indice];
  if (!c) return;
  document.getElementById('det-nome').textContent = c.nome || 'Cuidador';
  document.getElementById('det-bio').textContent = c.bio || 'Sem descrição.';
  document.getElementById('det-local').textContent = [c.cidade, c.estado].filter(Boolean).join(' / ') || '—';
  document.getElementById('det-valor').textContent = reais(c.valorServico);
  document.getElementById('det-nota').textContent = c.notaMedia ? Number(c.notaMedia).toFixed(1) : 'Sem avaliações';
  document.getElementById('det-disp').textContent = c.disponibilidade || '—';
  abrirModal('modal-detalhes');
}

document.getElementById('form-filtros').addEventListener('submit', (evento) => {
  evento.preventDefault();
  buscarCuidadores();
});

document.getElementById('btn-limpar').addEventListener('click', () => {
  document.getElementById('form-filtros').reset();
  buscarCuidadores();
});

document.getElementById('btn-fechar-detalhes').addEventListener('click', () => fecharModal('modal-detalhes'));

buscarCuidadores();
