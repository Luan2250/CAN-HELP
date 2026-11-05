/* Busca de cuidadores integrada à rota avançada do Backend. */
const RESULTADOS = document.getElementById('resultados-cuidadores');
let cuidadoresCarregados = [];

function escaparHTML(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function valorNumero(valor) {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

function obterNota(c) {
  return valorNumero(c.notaMedia ?? c.avaliacao ?? c.nota ?? 0);
}

function renderizarCuidadores(lista) {
  if (!lista.length) {
    RESULTADOS.innerHTML = '<div class="sem-resultados"><strong>Nenhum cuidador encontrado.</strong><p>Tente remover alguns filtros ou buscar outra cidade.</p></div>';
    return;
  }

  RESULTADOS.innerHTML = `<div class="cuidadores-grid">${lista.map((c) => {
    const id = Number(c.idUsuario ?? c.id_usuario ?? c.id);
    const nome = escaparHTML(c.nome || c.nomePerfil || 'Cuidador');
    const cidade = escaparHTML([c.cidade, c.estado].filter(Boolean).join(' / ') || 'Localização não informada');
    const nota = obterNota(c);
    const preco = valorNumero(c.valorServico ?? c.valor_servico);
    const disponibilidade = escaparHTML(c.disponibilidade || 'Consulte disponibilidade');
    const foto = c.fotoURL || c.foto_url;
    const avatar = foto
      ? `<img src="${escaparHTML(foto)}" alt="Foto de ${nome}" onerror="this.remove()">`
      : '<span aria-hidden="true">👩‍⚕️</span>';

    return `<article class="cuidador-card">
      <div class="cuidador-foto">${avatar}</div>
      <div class="cuidador-info">
        <div class="cuidador-topo"><div>
          <h2>${nome}</h2>
          <div class="cuidador-dados">
            <span>⭐ ${nota ? nota.toFixed(1) : 'Sem avaliações'}</span>
            <span>📍 ${cidade}</span>
          </div>
        </div><div class="cuidador-preco">R$ ${preco.toFixed(2).replace('.', ',')}</div></div>
        <div class="cuidador-detalhes">
          <div><span>Certificado</span><strong>${escaparHTML(c.certificado || 'Não informado')}</strong></div>
          <div><span>Órgão emissor</span><strong>${escaparHTML(c.orgaoEmissor || c.orgao_emissor || 'Não informado')}</strong></div>
          <div><span>Disponibilidade</span><strong>${disponibilidade}</strong></div>
        </div>
        <div class="cuidador-acoes">
          <button type="button" class="btn-visualizar" ${Number.isFinite(id) && id > 0 ? `onclick="visualizarCuidador(${id})"` : 'disabled'}>VER PERFIL</button>
        </div>
      </div>
    </article>`;
  }).join('')}</div>`;
}

function filtrarTextoLocal() {
  const termo = document.getElementById('campo-busca').value.trim().toLocaleLowerCase('pt-BR');
  const lista = !termo ? cuidadoresCarregados : cuidadoresCarregados.filter((c) =>
    [c.nome, c.cidade, c.estado, c.bio, c.certificado, c.disponibilidade]
      .some((v) => String(v ?? '').toLocaleLowerCase('pt-BR').includes(termo))
  );
  renderizarCuidadores(lista);
}

async function carregarCuidadores(evento) {
  if (evento) evento.preventDefault();
  RESULTADOS.innerHTML = '<div class="carregando">Buscando cuidadores...</div>';

  const params = new URLSearchParams();
  const campos = {
    cidade: document.getElementById('filtro-cidade').value.trim(),
    estado: document.getElementById('filtro-estado').value.trim().toUpperCase(),
    valor_max: document.getElementById('filtro-valor').value,
    nota_min: document.getElementById('filtro-nota').value,
    data: document.getElementById('filtro-data').value,
    ordenar: document.getElementById('filtro-ordenar').value
  };
  Object.entries(campos).forEach(([chave, valor]) => {
    if (valor !== '') params.set(chave, valor);
  });

  try {
    const query = params.toString();
    const resposta = await api.get('/cuidadores/filtrar' + (query ? `?${query}` : ''));
    cuidadoresCarregados = Array.isArray(resposta)
      ? resposta
      : (resposta?.cuidadores || resposta?.dados || []);
    filtrarTextoLocal();
  } catch (erro) {
    RESULTADOS.innerHTML = `<div class="erro"><strong>Não foi possível carregar os cuidadores.</strong><p>${escaparHTML(erro.message)}</p><small>Confira se o Backend está rodando em http://127.0.0.1:5000 e se o MySQL está conectado.</small></div>`;
  }
}

function visualizarCuidador(idUsuario) {
  window.location.href = `perfil-cuidador.html?id=${encodeURIComponent(idUsuario)}`;
}

document.getElementById('form-filtros').addEventListener('submit', carregarCuidadores);
document.getElementById('btn-buscar').addEventListener('click', filtrarTextoLocal);
document.getElementById('campo-busca').addEventListener('input', filtrarTextoLocal);

document.getElementById('btn-limpar-filtros').addEventListener('click', () => {
  document.getElementById('form-filtros').reset();
  document.getElementById('campo-busca').value = '';
  document.querySelectorAll('[data-quick]').forEach((b) => b.classList.remove('ativo'));
  carregarCuidadores();
});

document.querySelectorAll('[data-quick]').forEach((botao) => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('[data-quick]').forEach((b) => b.classList.remove('ativo'));
    botao.classList.add('ativo');
    const tipo = botao.dataset.quick;
    document.getElementById('filtro-ordenar').value = tipo === 'disponibilidade' ? '' : tipo;
    if (tipo === 'disponibilidade') {
      const data = document.getElementById('filtro-data');
      if (!data.value) data.value = new Date().toISOString().slice(0, 10);
    }
    carregarCuidadores();
  });
});

carregarCuidadores();
