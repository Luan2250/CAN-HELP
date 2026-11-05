/* =====================================================
   TAREFAS
===================================================== */

const TAREFAS_URL = '/tarefas';

let tarefas = [];


/* =====================================================
   CARREGAR
===================================================== */

async function carregarTarefas() {

    const corpo =
        document.getElementById('tarefas-corpo');


    corpo.innerHTML = `
        <div class="tarefas-loading">
            Carregando...
        </div>
    `;


    try {

        const dados =
            await api.get(TAREFAS_URL);


        tarefas =
            dados || [];


        if (tarefas.length === 0) {

            corpo.innerHTML = `
                <div class="tarefas-empty">
                    Nenhuma tarefa cadastrada ainda.
                </div>
            `;

            return;
        }


        renderizarTarefas(tarefas);

    } catch (erro) {

        console.error(erro);

        corpo.innerHTML = `
            <div class="tarefas-erro">
                Erro ao carregar: ${erro.message}
            </div>
        `;

    }

}


/* =====================================================
   RENDERIZAR
===================================================== */

function renderizarTarefas(lista) {

    const corpo =
        document.getElementById('tarefas-corpo');


    if (!lista || lista.length === 0) {

        corpo.innerHTML = `
            <div class="tarefas-empty">
                Nenhuma tarefa encontrada.
            </div>
        `;

        return;
    }


    corpo.innerHTML =
        lista.map((tarefa) => `

            <article class="tarefa-card">


                <div class="tarefa-hora">

                    ⏰

                    ${
                        tarefa.horaTarefa
                            ? tarefa.horaTarefa.substring(0, 5)
                            : '--:--'
                    }

                </div>


                <div class="tarefa-conteudo">

                    <h2>
                        ${tarefa.descricao ?? 'Tarefa'}
                    </h2>


                    <p>
                        Agenda:
                        ${tarefa.idAgenda ?? '—'}
                    </p>


                    <span
                        class="
                            tarefa-status
                            ${tarefa.statusTarefa === 'concluida'
                                ? 'concluida'
                                : 'pendente'
                            }
                        "
                    >

                        ${
                            tarefa.statusTarefa === 'concluida'
                                ? '✓ Concluída'
                                : '○ Pendente'
                        }

                    </span>


                    ${
                        tarefa.notificacao
                            ? `
                                <span class="tarefa-notificacao">
                                    🔔 Notificação ativa
                                </span>
                              `
                            : `
                                <span class="tarefa-notificacao">
                                    🔕 Sem notificação
                                </span>
                              `
                    }

                </div>


                <div class="tarefa-acoes">

                    <button
                        type="button"
                        class="btn-tarefa"
                        onclick='editarTarefa(${JSON.stringify(tarefa)})'
                    >
                        Editar
                    </button>


                    <button
                        type="button"
                        class="btn-tarefa danger"
                        onclick="removerTarefa(${tarefa.idTarefa})"
                    >
                        Excluir
                    </button>

                </div>

            </article>

        `).join('');

}


/* =====================================================
   LIMPAR
===================================================== */

function limparFormularioTarefa() {

    document
        .getElementById('form-tarefa')
        .reset();


    document
        .getElementById('tarefa-id')
        .value = '';


    document
        .getElementById('tarefa-id-agenda')
        .disabled = false;


    document
        .getElementById('tarefa-notificacao')
        .checked = true;


    document
        .getElementById('tarefa-status')
        .value = 'pendente';


    document
        .getElementById('modal-tarefa-titulo')
        .textContent =
        'Nova tarefa';

}


/* =====================================================
   EDITAR
===================================================== */

function editarTarefa(tarefa) {

    document
        .getElementById('tarefa-id')
        .value =
        tarefa.idTarefa;


    document
        .getElementById('tarefa-id-agenda')
        .value =
        tarefa.idAgenda;


    document
        .getElementById('tarefa-id-agenda')
        .disabled = true;


    document
        .getElementById('tarefa-descricao')
        .value =
        tarefa.descricao ?? '';


    document
        .getElementById('tarefa-hora')
        .value =
        tarefa.horaTarefa
            ? tarefa.horaTarefa.substring(0, 5)
            : '';


    document
        .getElementById('tarefa-status')
        .value =
        tarefa.statusTarefa ?? 'pendente';


    document
        .getElementById('tarefa-notificacao')
        .checked =
        !!tarefa.notificacao;


    document
        .getElementById('modal-tarefa-titulo')
        .textContent =
        'Editar tarefa';


    abrirModal('modal-tarefa');

}


/* =====================================================
   REMOVER
===================================================== */

async function removerTarefa(id) {

    if (
        !confirm(
            'Tem certeza que deseja excluir esta tarefa?'
        )
    ) {

        return;
    }


    try {

        await api.del(
            `${TAREFAS_URL}/${id}`
        );


        showToast(
            'Tarefa excluída.'
        );


        carregarTarefas();

    } catch (erro) {

        showToast(
            erro.message,
            'error'
        );

    }

}


/* =====================================================
   NOVA TAREFA
===================================================== */

document
    .getElementById('btn-nova-tarefa')
    .addEventListener('click', () => {

        limparFormularioTarefa();

        abrirModal('modal-tarefa');

    });


/* =====================================================
   CANCELAR
===================================================== */

document
    .getElementById('btn-cancelar-tarefa')
    .addEventListener('click', () => {

        fecharModal('modal-tarefa');

    });


/* =====================================================
   SALVAR
===================================================== */

document
    .getElementById('form-tarefa')
    .addEventListener('submit', async (evento) => {

        evento.preventDefault();


        const id =
            document
                .getElementById('tarefa-id')
                .value;


        const dados = {

            idAgenda:
                document
                    .getElementById('tarefa-id-agenda')
                    .value,

            descricao:
                document
                    .getElementById('tarefa-descricao')
                    .value,

            horaTarefa:
                document
                    .getElementById('tarefa-hora')
                    .value,

            statusTarefa:
                document
                    .getElementById('tarefa-status')
                    .value,

            notificacao:
                document
                    .getElementById('tarefa-notificacao')
                    .checked

        };


        try {

            if (id) {

                await api.put(
                    `${TAREFAS_URL}/${id}`,
                    {
                        descricao:
                            dados.descricao,

                        horaTarefa:
                            dados.horaTarefa,

                        statusTarefa:
                            dados.statusTarefa,

                        notificacao:
                            dados.notificacao
                    }
                );


                showToast(
                    'Tarefa atualizada.'
                );

            } else {

                await api.post(
                    TAREFAS_URL,
                    dados
                );


                showToast(
                    'Tarefa criada.'
                );

            }


            fecharModal(
                'modal-tarefa'
            );


            carregarTarefas();

        } catch (erro) {

            showToast(
                erro.message,
                'error'
            );

        }

    });


/* =====================================================
   FILTRO TODAS
===================================================== */

document
    .getElementById('filtro-todas')
    .addEventListener('click', () => {

        ativarFiltro(
            'filtro-todas'
        );

        renderizarTarefas(
            tarefas
        );

    });


/* =====================================================
   FILTRO PENDENTES
===================================================== */

document
    .getElementById('filtro-pendentes')
    .addEventListener('click', () => {

        ativarFiltro(
            'filtro-pendentes'
        );


        const resultado =
            tarefas.filter(
                (tarefa) =>
                    tarefa.statusTarefa !== 'concluida'
            );


        renderizarTarefas(
            resultado
        );

    });


/* =====================================================
   FILTRO CONCLUÍDAS
===================================================== */

document
    .getElementById('filtro-concluidas')
    .addEventListener('click', () => {

        ativarFiltro(
            'filtro-concluidas'
        );


        const resultado =
            tarefas.filter(
                (tarefa) =>
                    tarefa.statusTarefa === 'concluida'
            );


        renderizarTarefas(
            resultado
        );

    });


/* =====================================================
   ATIVAR FILTRO
===================================================== */

function ativarFiltro(id) {

    document
        .querySelectorAll('.filtro-tarefa')
        .forEach((botao) => {

            botao.classList.remove(
                'ativo'
            );

        });


    document
        .getElementById(id)
        .classList.add(
            'ativo'
        );

}


/* =====================================================
   INICIAR
===================================================== */

carregarTarefas();