// Tela de Denúncias: lista, cria, edita e remove usando a API /denuncias.

const DENUNCIAS_URL = '/denuncias';

async function carregarDenuncias() {
  const corpo = document.getElementById('denuncias-corpo');
  corpo.innerHTML = '<tr><td colspan="6" class="empty">Carregando...</td></tr>';

  try {
    const denuncias = await api.get(DENUNCIAS_URL);

    if (!denuncias || denuncias.length === 0) {
      corpo.innerHTML = '<tr><td colspan="6" class="empty">Nenhuma denúncia registrada ainda.</td></tr>';
      return;
    }

    corpo.innerHTML = denuncias.map((d) => `
      <tr>
        <td>${d.idDenuncia}</td>
        <td>${d.idDenunciante}</td>
        <td>${d.idDenunciado}</td>
        <td>${d.tipoDenunciante ?? '—'}</td>
        <td>${d.statusDenuncia ?? '—'}</td>
        <td>
          <div class="row-actions">
            <button class="btn-icon" onclick='editarDenuncia(${JSON.stringify(d)})'>Editar</button>
            <button class="btn-icon danger" onclick="removerDenuncia(${d.idDenuncia})">Excluir</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="6" class="empty">Erro ao carregar: ${erro.message}</td></tr>`;
  }
}

function limparFormularioDenuncia() {
  document.getElementById('form-denuncia').reset();
  document.getElementById('denuncia-id').value = '';
  document.getElementById('denuncia-id-denunciante').disabled = false;
  document.getElementById('denuncia-id-denunciado').disabled = false;
  document.getElementById('modal-denuncia-titulo').textContent = 'Nova denúncia';
}

function editarDenuncia(d) {
  document.getElementById('denuncia-id').value = d.idDenuncia;
  document.getElementById('denuncia-id-denunciante').value = d.idDenunciante;
  document.getElementById('denuncia-id-denunciante').disabled = true;
  document.getElementById('denuncia-id-denunciado').value = d.idDenunciado;
  document.getElementById('denuncia-id-denunciado').disabled = true;
  document.getElementById('denuncia-tipo-denunciante').value = d.tipoDenunciante ?? 'cliente';
  document.getElementById('denuncia-descricao').value = d.descricao ?? '';
  document.getElementById('denuncia-status').value = d.statusDenuncia ?? 'pendente';
  document.getElementById('denuncia-penalidade').value = d.penalidade ?? '';
  document.getElementById('modal-denuncia-titulo').textContent = 'Editar denúncia';
  abrirModal('modal-denuncia');
}

async function removerDenuncia(id) {
  if (!confirm('Tem certeza que deseja excluir esta denúncia?')) return;
  try {
    await api.del(`${DENUNCIAS_URL}/${id}`);
    showToast('Denúncia excluída.');
    carregarDenuncias();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
}

document.getElementById('btn-nova-denuncia').addEventListener('click', () => {
  limparFormularioDenuncia();
  abrirModal('modal-denuncia');
});

document.getElementById('btn-cancelar-denuncia').addEventListener('click', () => {
  fecharModal('modal-denuncia');
});

document.getElementById('form-denuncia').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = document.getElementById('denuncia-id').value;
  const dados = {
    idDenunciante: document.getElementById('denuncia-id-denunciante').value,
    idDenunciado: document.getElementById('denuncia-id-denunciado').value,
    tipoDenunciante: document.getElementById('denuncia-tipo-denunciante').value,
    descricao: document.getElementById('denuncia-descricao').value,
    statusDenuncia: document.getElementById('denuncia-status').value,
    penalidade: document.getElementById('denuncia-penalidade').value,
  };

  try {
    if (id) {
      await api.put(`${DENUNCIAS_URL}/${id}`, {
        descricao: dados.descricao,
        statusDenuncia: dados.statusDenuncia,
        penalidade: dados.penalidade,
      });
      showToast('Denúncia atualizada.');
    } else {
      await api.post(DENUNCIAS_URL, dados);
      showToast('Denúncia criada.');
    }

    fecharModal('modal-denuncia');
    carregarDenuncias();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarDenuncias();