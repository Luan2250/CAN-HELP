/* =====================================================
   AVALIAÇÕES
===================================================== */

const AVALIACOES_URL = '/avaliacoess';


/* =====================================================
   ID DO AVALIADO VINDO DA URL

   Exemplo:

   avaliacoes.html?idAvaliado=5
===================================================== */

const parametros =
    new URLSearchParams(
        window.location.search
    );

const idAvaliadoURL =
    parametros.get('idAvaliado');


let avaliacoes = [];


/* =====================================================
   FORMATAR NOTA
===================================================== */

function formatarNota(nota) {

    if (nota === null || nota === undefined) {
        return '—';
    }

    const numero =
        Number(nota);

    if (!Number.isFinite(numero)) {
        return '—';
    }

    return `⭐ ${numero}`;
}


/* =====================================================
   CARREGAR AVALIAÇÕES
===================================================== */

async function carregarAvaliacoes() {

    const corpo =
        document.getElementById(
            'avaliacoes-corpo'
        );


    corpo.innerHTML = `
        <tr>
            <td
                colspan="8"
                class="empty"
            >
                Carregando...
            </td>
        </tr>
    `;


    try {

        const dados =
            await api.get(
                AVALIACOES_URL
            );


        avaliacoes =
            dados || [];


        /* =============================================
           SE VEIO DO PERFIL DO CUIDADOR
        ============================================== */

        if (idAvaliadoURL) {

            avaliacoes =
                avaliacoes.filter(
                    (avaliacao) =>
                        Number(
                            avaliacao.idAvaliado
                        ) ===
                        Number(idAvaliadoURL)
                );

        }


        if (avaliacoes.length === 0) {

            corpo.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        class="empty"
                    >
                        ${
                            idAvaliadoURL
                                ? 'Nenhuma avaliação registrada para este cuidador ainda.'
                                : 'Nenhuma avaliação registrada ainda.'
                        }
                    </td>
                </tr>
            `;

            return;
        }


        renderizarAvaliacoes(
            avaliacoes
        );


    } catch (erro) {

        console.error(
            'Erro ao carregar avaliações:',
            erro
        );


        corpo.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="empty"
                >
                    Erro ao carregar: ${erro.message}
                </td>
            </tr>
        `;
    }
}


/* =====================================================
   RENDERIZAR
===================================================== */

function renderizarAvaliacoes(lista) {

    const corpo =
        document.getElementById(
            'avaliacoes-corpo'
        );


    if (!lista || lista.length === 0) {

        corpo.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    class="empty"
                >
                    Nenhuma avaliação encontrada.
                </td>
            </tr>
        `;

        return;
    }


    corpo.innerHTML =
        lista.map(
            (avaliacao) => `

                <tr>

                    <td>
                        ${avaliacao.idAvaliacao}
                    </td>

                    <td>
                        ${avaliacao.idAvaliador}
                    </td>

                    <td>
                        ${avaliacao.idAvaliado}
                    </td>

                    <td>
                        ${avaliacao.tipoAvaliador ?? '—'}
                    </td>

                    <td>
                        ${formatarNota(avaliacao.nota)}
                    </td>

                    <td>
                        ${
                            avaliacao.comentario
                                ? avaliacao.comentario
                                : '—'
                        }
                    </td>

                    <td>
                        R$
                        ${
                            Number(
                                avaliacao.gorjeta ?? 0
                            ).toFixed(2)
                        }
                    </td>

                    <td>

                        <div class="row-actions">

                            <button
                                type="button"
                                class="btn-icon"
                                onclick='editarAvaliacao(${JSON.stringify(avaliacao)})'
                            >
                                Editar
                            </button>


                            <button
                                type="button"
                                class="btn-icon danger"
                                onclick="removerAvaliacao(${avaliacao.idAvaliacao})"
                            >
                                Excluir
                            </button>

                        </div>

                    </td>

                </tr>

            `
        ).join('');
}


/* =====================================================
   LIMPAR FORMULÁRIO
===================================================== */

function limparFormularioAvaliacao() {

    document
        .getElementById(
            'form-avaliacao'
        )
        .reset();


    document
        .getElementById(
            'avaliacao-id'
        )
        .value = '';


    document
        .getElementById(
            'avaliacao-id-avaliador'
        )
        .disabled = false;


    document
        .getElementById(
            'avaliacao-id-avaliado'
        )
        .disabled = false;


    document
        .getElementById(
            'avaliacao-gorjeta'
        )
        .value = '0';


    document
        .getElementById(
            'avaliacao-tipo-avaliador'
        )
        .value = 'cliente';


    document
        .getElementById(
            'modal-avaliacao-titulo'
        )
        .textContent =
        'Nova avaliação';


    document
        .getElementById(
            'modal-avaliacao-descricao'
        )
        .textContent =
        'Preencha os dados para registrar uma avaliação.';


    /*
     * Se a página veio do perfil,
     * já coloca o cuidador selecionado.
     */

    if (idAvaliadoURL) {

        document
            .getElementById(
                'avaliacao-id-avaliado'
            )
            .value =
            idAvaliadoURL;


        document
            .getElementById(
                'avaliacao-id-avaliado'
            )
            .disabled = true;


        document
            .getElementById(
                'modal-avaliacao-descricao'
            )
            .textContent =
            'Avalie o cuidador selecionado.';

    }

}


/* =====================================================
   EDITAR
===================================================== */

function editarAvaliacao(avaliacao) {

    document
        .getElementById(
            'avaliacao-id'
        )
        .value =
        avaliacao.idAvaliacao;


    document
        .getElementById(
            'avaliacao-id-avaliador'
        )
        .value =
        avaliacao.idAvaliador;


    document
        .getElementById(
            'avaliacao-id-avaliador'
        )
        .disabled = true;


    document
        .getElementById(
            'avaliacao-id-avaliado'
        )
        .value =
        avaliacao.idAvaliado;


    document
        .getElementById(
            'avaliacao-id-avaliado'
        )
        .disabled = true;


    document
        .getElementById(
            'avaliacao-tipo-avaliador'
        )
        .value =
        avaliacao.tipoAvaliador ??
        'cliente';


    document
        .getElementById(
            'avaliacao-nota'
        )
        .value =
        avaliacao.nota ?? '';


    document
        .getElementById(
            'avaliacao-comentario'
        )
        .value =
        avaliacao.comentario ?? '';


    document
        .getElementById(
            'avaliacao-gorjeta'
        )
        .value =
        avaliacao.gorjeta ?? 0;


    document
        .getElementById(
            'modal-avaliacao-titulo'
        )
        .textContent =
        'Editar avaliação';


    document
        .getElementById(
            'modal-avaliacao-descricao'
        )
        .textContent =
        'Edite os dados da avaliação.';


    abrirModal(
        'modal-avaliacao'
    );
}


/* =====================================================
   REMOVER
===================================================== */

async function removerAvaliacao(id) {

    if (
        !confirm(
            'Tem certeza que deseja excluir esta avaliação?'
        )
    ) {

        return;
    }


    try {

        await api.del(
            `${AVALIACOES_URL}/${id}`
        );


        showToast(
            'Avaliação excluída.'
        );


        carregarAvaliacoes();


    } catch (erro) {

        showToast(
            erro.message,
            'error'
        );

    }
}


/* =====================================================
   NOVA AVALIAÇÃO
===================================================== */

document
    .getElementById(
        'btn-nova-avaliacao'
    )
    .addEventListener(
        'click',
        () => {

            limparFormularioAvaliacao();

            abrirModal(
                'modal-avaliacao'
            );

        }
    );


/* =====================================================
   CANCELAR
===================================================== */

document
    .getElementById(
        'btn-cancelar-avaliacao'
    )
    .addEventListener(
        'click',
        () => {

            fecharModal(
                'modal-avaliacao'
            );

        }
    );


/* =====================================================
   VALIDAR NOTA
===================================================== */

document
    .getElementById(
        'avaliacao-nota'
    )
    .addEventListener(
        'input',
        (evento) => {

            let nota =
                Number(
                    evento.target.value
                );


            if (nota > 5) {

                evento.target.value = 5;

            }


            if (nota < 1 && evento.target.value !== '') {

                evento.target.value = 1;

            }

        }
    );


/* =====================================================
   SUBMIT
===================================================== */

document
    .getElementById(
        'form-avaliacao'
    )
    .addEventListener(
        'submit',
        async (evento) => {

            evento.preventDefault();


            const id =
                document
                    .getElementById(
                        'avaliacao-id'
                    )
                    .value;


            const idAvaliador =
                document
                    .getElementById(
                        'avaliacao-id-avaliador'
                    )
                    .value;


            const idAvaliado =
                document
                    .getElementById(
                        'avaliacao-id-avaliado'
                    )
                    .value;


            const nota =
                document
                    .getElementById(
                        'avaliacao-nota'
                    )
                    .value;


            const comentario =
                document
                    .getElementById(
                        'avaliacao-comentario'
                    )
                    .value;


            const gorjeta =
                document
                    .getElementById(
                        'avaliacao-gorjeta'
                    )
                    .value;


            const tipoAvaliador =
                document
                    .getElementById(
                        'avaliacao-tipo-avaliador'
                    )
                    .value;


            /* =========================================
               VALIDAÇÕES
            ========================================== */

            if (!idAvaliador) {

                showToast(
                    'Informe o ID do avaliador.',
                    'error'
                );

                return;
            }


            if (!idAvaliado) {

                showToast(
                    'Informe o ID do avaliado.',
                    'error'
                );

                return;
            }


            const notaNumero =
                Number(nota);


            if (
                !Number.isInteger(notaNumero) ||
                notaNumero < 1 ||
                notaNumero > 5
            ) {

                showToast(
                    'A nota deve ser de 1 a 5.',
                    'error'
                );

                return;
            }


            const dados = {

                idAvaliador:
                    Number(idAvaliador),

                idAvaliado:
                    Number(idAvaliado),

                tipoAvaliador:
                    tipoAvaliador,

                nota:
                    notaNumero,

                comentario:
                    comentario,

                gorjeta:
                    Number(gorjeta || 0)

            };


            try {

                /* =====================================
                   EDITAR
                ====================================== */

                if (id) {

                    await api.put(
                        `${AVALIACOES_URL}/${id}`,
                        {

                            tipoAvaliador:
                                dados.tipoAvaliador,

                            nota:
                                dados.nota,

                            comentario:
                                dados.comentario,

                            gorjeta:
                                dados.gorjeta

                        }
                    );


                    showToast(
                        'Avaliação atualizada.'
                    );

                }


                /* =====================================
                   CRIAR
                ====================================== */

                else {

                    await api.post(
                        AVALIACOES_URL,
                        dados
                    );


                    showToast(
                        'Avaliação criada.'
                    );

                }


                fecharModal(
                    'modal-avaliacao'
                );


                carregarAvaliacoes();


            } catch (erro) {

                console.error(
                    erro
                );


                showToast(
                    erro.message,
                    'error'
                );

            }

        }
    );


/* =====================================================
   INICIAR
===================================================== */

carregarAvaliacoes();