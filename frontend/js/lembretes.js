
exigirLogin();

const LEMBRETES_URL = '/lembretes';

function esc(texto) {
  const d = document.createElement('div');
  d.textContent = texto ?? '';
  return d.innerHTML;
}

async function carregarLembretes() {
  const corpo = document.getElementById('lembretes-corpo');
  try {
    const lembretes = await api.get(LEMBRETES_URL);
    if (!lembretes || lembretes.length === 0) {
      corpo.innerHTML = '<tr><td colspan="4" class="empty">Nenhum lembrete criado ainda.</td></tr>';
      return;
    }
    corpo.innerHTML = lembretes.map((l) => `
      <tr>
        <td>${l.dataLembrete.split('-').reverse().join('/')}</td>
        <td>${l.horaLembrete}</td>
        <td>${esc(l.titulo)}</td>
        <td>${esc(l.descricao) || '—'}</td>
      </tr>
    `).join('');
  } catch (erro) {
    corpo.innerHTML = `<tr><td colspan="4" class="empty">Erro ao carregar: ${esc(erro.message)}</td></tr>`;
  }
}

document.getElementById('btn-novo-lembrete').addEventListener('click', () => {
  document.getElementById('form-lembrete').reset();
  abrirModal('modal-lembrete');
});

document.getElementById('btn-cancelar-lembrete').addEventListener('click', () => {
  fecharModal('modal-lembrete');
});

document.getElementById('form-lembrete').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  try {
    await api.post(LEMBRETES_URL, {
      titulo: document.getElementById('lembrete-titulo').value,
      descricao: document.getElementById('lembrete-descricao').value,
      dataLembrete: document.getElementById('lembrete-data').value,
      horaLembrete: document.getElementById('lembrete-hora').value,
    });
    showToast('Lembrete criado.');
    fecharModal('modal-lembrete');
    carregarLembretes();
  } catch (erro) {
    showToast(erro.message, 'error');
  }
});

carregarLembretes();