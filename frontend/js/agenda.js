

const AGENDA_URL = '/agendas';

let agendas = [];




function formatarData(data) {

    if (!data) {
        return 'Data não informada';
    }

    const partes = data.split('-');

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}



function ehHoje(data) {

    if (!data) {
        return false;
    }

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(hoje.getMonth() + 1).padStart(2, '0');

    const dia =
        String(hoje.getDate()).padStart(2, '0');

    return data === `${ano}-${mes}-${dia}`;
}



function ehAmanha(data) {

    if (!data) {
        return false;
    }

    const amanha = new Date();

    amanha.setDate(
        amanha.getDate() + 1
    );

    const ano =
        amanha.getFullYear();

    const mes =
        String(amanha.getMonth() + 1).padStart(2, '0');

    const dia =
        String(amanha.getDate()).padStart(2, '0');

    return data === `${ano}-${mes}-${dia}`;
}



function tituloDoDia(data) {

    if (ehHoje(data)) {
        return `Hoje - ${formatarData(data)}`;
    }

    if (ehAmanha(data)) {
        return `Amanhã - ${formatarData(data)}`;
    }

    return formatarData(data);
}


async function carregarAgenda() {

    const corpo =
        document.getElementById('agenda-corpo');

    corpo.innerHTML = `
        <div class="agenda-loading">
            Carregando...
        </div>
    `;


    try {

        const itens =
            await api.get(AGENDA_URL);


        agendas = itens || [];


        if (agendas.length === 0) {

            corpo.innerHTML = `
                <div class="agenda-empty">
                    Nenhum compromisso cadastrado ainda.
                </div>
            `;

            return;
        }


        renderizarAgenda(agendas);

    } catch (erro) {

        console.error(erro);

        corpo.innerHTML = `
            <div class="agenda-erro">
                Erro ao carregar: ${erro.message}
            </div>
        `;
    }
}



function agruparPorData(lista) {

    const grupos = {};


    lista.forEach((item) => {

        const data =
            item.dataAgenda || 'sem-data';


        if (!grupos[data]) {

            grupos[data] = [];

        }


        grupos[data].push(item);

    });


    return grupos;
}



function renderizarAgenda(lista) {

    const corpo =
        document.getElementById('agenda-corpo');


    if (!lista || lista.length === 0) {

        corpo.innerHTML = `
            <div class="agenda-empty">
                Nenhum compromisso encontrado.
            </div>
        `;

        return;
    }


    const grupos =
        agruparPorData(lista);


    const datas =
        Object.keys(grupos).sort();


    corpo.innerHTML =
        datas.map((data) => {

            const itensDoDia =
                grupos[data];


            return `

                <section class="agenda-dia">

                    <div class="agenda-dia-titulo">

                        <span>
                            📅
                        </span>

                        <span>
                            ${tituloDoDia(data)}
                        </span>

                    </div>


                    ${itensDoDia.map((item) => `

                        <article class="agenda-item">


                            <div class="agenda-hora">

                                ⏰

                                ${item.horaAgenda
                                    ? item.horaAgenda.substring(0, 5)
                                    : '--:--'
                                }

                            </div>


                            <div>

                                <div class="agenda-ocasiao">

                                    ${item.ocasiao ?? 'Compromisso'}

                                </div>


                                <div class="agenda-contrato">

                                    Contrato:
                                    ${item.idContrato ? esc(rotuloContratoCurto(item.idContrato)) : '—'}

                                </div>

                            </div>


                            <div>

                                <div class="agenda-notificacao">

                                    ${
                                        item.notificacao
                                            ? '🔔 Notificação ativa'
                                            : '🔕 Notificação desativada'
                                    }

                                </div>


                                <div class="agenda-acoes">

                                    <button
                                        type="button"
                                        class="btn-agenda"
                                        onclick='editarAgenda(${JSON.stringify(item)})'
                                    >
                                        Editar
                                    </button>


                                    <button
                                        type="button"
                                        class="btn-agenda danger"
                                        onclick="removerAgenda(${item.idAgenda})"
                                    >
                                        Excluir
                                    </button>

                                </div>

                            </div>

                        </article>

                    `).join('')}

                </section>

            `;

        }).join('');
}




function limparFormularioAgenda() {

    document
        .getElementById('form-agenda')
        .reset();


    document
        .getElementById('agenda-id')
        .value = '';


    document
        .getElementById('agenda-id-contrato')
        .disabled = false;


    document
        .getElementById('agenda-notificacao')
        .checked = true;


    document
        .getElementById('modal-agenda-titulo')
        .textContent =
        'Novo compromisso';
}



function editarAgenda(item) {

    document
        .getElementById('agenda-id')
        .value =
        item.idAgenda;


    document
        .getElementById('agenda-id-contrato')
        .value =
        item.idContrato ?? '';


    document
        .getElementById('agenda-id-contrato')
        .disabled = true;


    document
        .getElementById('agenda-data')
        .value =
        item.dataAgenda ?? '';


    document
        .getElementById('agenda-hora')
        .value =
        item.horaAgenda
            ? item.horaAgenda.substring(0, 5)
            : '';


    document
        .getElementById('agenda-ocasiao')
        .value =
        item.ocasiao ?? '';


    document
        .getElementById('agenda-notificacao')
        .checked =
        !!item.notificacao;


    document
        .getElementById('modal-agenda-titulo')
        .textContent =
        'Editar compromisso';


    abrirModal('modal-agenda');
}




async function removerAgenda(id) {

    if (
        !confirm(
            'Tem certeza que deseja excluir este compromisso?'
        )
    ) {
        return;
    }


    try {

        await api.del(
            `${AGENDA_URL}/${id}`
        );


        showToast(
            'Compromisso excluído.'
        );


        carregarAgenda();

    } catch (erro) {

        showToast(
            erro.message,
            'error'
        );

    }
}




document
    .getElementById('btn-novo-agenda')
    .addEventListener('click', () => {

        limparFormularioAgenda();

        abrirModal('modal-agenda');

    });




document
    .getElementById('btn-cancelar-agenda')
    .addEventListener('click', () => {

        fecharModal('modal-agenda');

    });



document
    .getElementById('form-agenda')
    .addEventListener('submit', async (evento) => {

        evento.preventDefault();


        const id =
            document
                .getElementById('agenda-id')
                .value;


        const dados = {

            idContrato:
                document
                    .getElementById('agenda-id-contrato')
                    .value,

            dataAgenda:
                document
                    .getElementById('agenda-data')
                    .value,

            horaAgenda:
                document
                    .getElementById('agenda-hora')
                    .value,

            ocasiao:
                document
                    .getElementById('agenda-ocasiao')
                    .value,

            notificacao:
                document
                    .getElementById('agenda-notificacao')
                    .checked

        };


        try {

            if (id) {

                await api.put(
                    `${AGENDA_URL}/${id}`,
                    {

                        dataAgenda:
                            dados.dataAgenda,

                        horaAgenda:
                            dados.horaAgenda,

                        ocasiao:
                            dados.ocasiao,

                        notificacao:
                            dados.notificacao

                    }
                );


                showToast(
                    'Compromisso atualizado.'
                );

            } else {

                await api.post(
                    AGENDA_URL,
                    dados
                );


                showToast(
                    'Compromisso criado.'
                );

            }


            fecharModal(
                'modal-agenda'
            );


            carregarAgenda();

        } catch (erro) {

            showToast(
                erro.message,
                'error'
            );

        }

    });



document
    .getElementById('btn-filtrar-data')
    .addEventListener('click', () => {

        const data =
            document
                .getElementById('filtro-data')
                .value;


        if (!data) {

            renderizarAgenda(
                agendas
            );

            return;
        }


        const filtradas =
            agendas.filter(
                (item) =>
                    item.dataAgenda === data
            );


        renderizarAgenda(
            filtradas
        );

    });


document
    .getElementById('btn-limpar-data')
    .addEventListener('click', () => {

        document
            .getElementById('filtro-data')
            .value = '';


        renderizarAgenda(
            agendas
        );

    });




async function iniciarAgenda() {


    await carregarReferencias(['perfis', 'contratos']);

    selectContratos(
        document.getElementById('agenda-id-contrato')
    );

    carregarAgenda();
}

iniciarAgenda();