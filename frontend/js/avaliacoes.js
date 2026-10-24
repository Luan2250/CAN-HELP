// Tela de Avaliações: lista, cria, edita e remove usando a API.
//
// ATENÇÃO: a rota usada aqui é '/avaliacoess' (com dois "s"), exatamente
// como está no seu avaliacoes_routes.py. Se isso for um typo no backend
// e você corrigir para '/avaliacoes', troque a constante abaixo também.
const AVALIACOES_URL = '/avaliacoess';

async function carregarAvaliacoes() {
  const corpo = document.getElementById('avaliacoes-corpo');
  corpo.innerHTML = '<tr><td colspan="7" class="empty">Carregando...</td></tr>';

  try {
    const avaliacoes = await api.get(AVALIACOES_URL);

    if (!avaliacoes || avaliacoes.length === 0) {
      corpo.innerHTML = '<tr><td colspan="7" class="empty">Nenhuma avaliação registrada ainda.</td></tr>';
      return;
    }

    corpo.innerHTML = avaliacoes.map((av) => `
      <tr>
        <td>${av.idAvaliacao}</td>
        <td>${av.idAvaliador}</td>
        <td>${av.idAvaliado}</td>
        <td>${av.tipoAvaliador ?? '—'}</td>
        <td>${av.nota ?? '—'}</td>
        <td>R$ ${Number(av.gorjeta ?? 0).toFixed(2)}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" onclick='editarAvaliacao(${JSON.stringify(av)})'>Editar</button>
            <button class="btn-icon danger" onclick="removerAvaliacao(${av.idAvaliacao})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="7" class="empty">Erro ao carregar: ${erro.message}</td></tr>`;
  }
}

function limparFormularioAvaliacao() {
  document.getElementById('form-avaliacao').reset();
  document.getElementById('avaliacao-id').value = '';
  document.getElementById('avaliacao-id-avaliador').disabled = false;
  document.getElementById('avaliacao-id-avaliado').disabled = false;
  document.getElementById('modal-avaliacao-titulo').textContent = 'Nova avaliação';
}

function editarAvaliacao(av) {
  document.getElementById('avaliacao-id').value = av.idAvaliacao;
  document.getElementById('avaliacao-id-avaliador').value = av.idAvaliador;
  document.getElementById('avaliacao-id-avaliador').disabled = true;
  document.getElementById('avaliacao-id-avaliado').value = av.idAvaliado;
  document.getElementById('avaliacao-id-avaliado').disabled = true;
  document.getElementById('avaliacao-tipo-avaliador').value = av.tipoAvaliador ?? 'cliente';
  document.getElementById('avaliacao-nota').value = av.nota ?? '';
  document.getElementById('avaliacao-comentario').value = av.comentario ?? '';
  document.getElementById('avaliacao-gorjeta').value = av.gorjeta ?? 0;
  document.getElementById('modal-avaliacao-titulo').textContent = 'Editar avaliação';
  abrirModal('modal-avaliacao');
}

async function removerAvaliacao(id) {
  if (!confirm('Tem certeza que deseja excluir esta avaliação?')) return;
  try {
    await api.del(`${AVALIACOES_URL}/${id}`);
    showToast('Avaliação excluída.');
    carregarAvaliacoes();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-nova-avaliacao').addEventListener('click', () => {
  limparFormularioAvaliacao();
  abrirModal('modal-avaliacao');
});

document.getElementById('btn-cancelar-avaliacao').addEventListener('click', () => {
  fecharModal('modal-avaliacao');
});

document.getElementById('form-avaliacao').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = document.getElementById('avaliacao-id').value;
  const dados = {
    idAvaliador: document.getElementById('avaliacao-id-avaliador').value,
    idAvaliado: document.getElementById('avaliacao-id-avaliado').value,
    tipoAvaliador: document.getElementById('avaliacao-tipo-avaliador').value,
    nota: document.getElementById('avaliacao-nota').value,
    comentario: document.getElementById('avaliacao-comentario').value,
    gorjeta: document.getElementById('avaliacao-gorjeta').value,
  };

  try {
    if (id) {
      await api.put(`${AVALIACOES_URL}/${id}`, {
        nota: dados.nota,
        comentario: dados.comentario,
        gorjeta: dados.gorjeta,
      });
      showToast('Avaliação atualizada.');
    } else {
      await api.post(AVALIACOES_URL, dados);
      showToast('Avaliação criada.');
    }

    fecharModal('modal-avaliacao');
    carregarAvaliacoes();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarAvaliacoes();