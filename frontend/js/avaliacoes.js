const AVALIACOES_URL = '/avaliacoess';




const parametros =
    new URLSearchParams(
        window.location.search
    );

const idAvaliadoURL =
    parametros.get('idAvaliado');


let avaliacoes = [];




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
                        ${esc(nomeUsuario(avaliacao.idAvaliador))}
                    </td>

                    <td>
                        ${esc(nomeUsuario(avaliacao.idAvaliado))}
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




function tipoDoUsuario(idUsuario) {
    return ref.cuidadores.some(
        (c) => Number(c.idUsuario) === Number(idUsuario)
    ) ? 'cuidador' : 'cliente';
}


function atualizarAvaliados(idForcado = null) {

    const avaliador =
        document.getElementById('avaliacao-id-avaliador').value;

    const tipo =
        document.getElementById('avaliacao-tipo-avaliador').value;

    const selectAvaliado =
        document.getElementById('avaliacao-id-avaliado');

   
    if (selectAvaliado.disabled) return;


    let ids = [];

    if (avaliador) {

        ids = ref.contratos
            .filter((c) =>
                c.statusContrato === 'concluido' &&
                Number(
                    tipo === 'cliente' ? c.idCliente : c.idCuidador
                ) === Number(avaliador)
            )
            .map((c) =>
                Number(tipo === 'cliente' ? c.idCuidador : c.idCliente)
            );
    }

    const forcado = idForcado ?? idAvaliadoURL;

    if (forcado && !ids.includes(Number(forcado))) {
        ids.push(Number(forcado));
    }

    ids = [...new Set(ids)];

    const itens = ids
        .map((id) => ({ id, nome: nomeUsuario(id) }))
        .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    preencherSelect(selectAvaliado, itens, {
        valor: (i) => i.id,
        rotulo: (i) => i.nome,
        placeholder: avaliador
            ? 'Selecione quem será avaliado'
            : 'Escolha o avaliador primeiro',
    });

    if (avaliador && itens.length === 0) {
        selectAvaliado.options[0].textContent =
            'Nenhum serviço concluído com este usuário';
    }

    if (forcado) {
        selectAvaliado.value = String(forcado);
    }
}


function prepararSelectsAvaliacao(
    idAvaliador = null,
    idAvaliado = null,
    tipo = null
) {

    const selectAvaliador =
        document.getElementById('avaliacao-id-avaliador');

    const selectTipo =
        document.getElementById('avaliacao-tipo-avaliador');


    selectUsuarios(selectAvaliador, 'Selecione o avaliador');

    const escolhido =
        idAvaliador ??
        usuarioLogadoEm(ref.perfis.map((p) => p.idUsuario));

    if (escolhido) {
        selectAvaliador.value = String(escolhido);
        selectTipo.value = tipo ?? tipoDoUsuario(escolhido);
    }

    atualizarAvaliados(idAvaliado);
}


document
    .getElementById('avaliacao-id-avaliador')
    .addEventListener('change', (evento) => {

     
        document.getElementById('avaliacao-tipo-avaliador').value =
            tipoDoUsuario(evento.target.value);

        atualizarAvaliados();
    });


document
    .getElementById('avaliacao-tipo-avaliador')
    .addEventListener('change', () => atualizarAvaliados());




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


    prepararSelectsAvaliacao();


    

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



function editarAvaliacao(avaliacao) {

    prepararSelectsAvaliacao(
        avaliacao.idAvaliador,
        avaliacao.idAvaliado,
        avaliacao.tipoAvaliador ?? 'cliente'
    );


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




            if (!idAvaliador) {

                showToast(
                    'Selecione o avaliador.',
                    'error'
                );

                return;
            }


            if (!idAvaliado) {

                showToast(
                    'Selecione quem será avaliado.',
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



async function iniciarAvaliacoes() {

    await carregarReferencias(
        ['perfis', 'clientes', 'cuidadores', 'contratos']
    );

    prepararSelectsAvaliacao();

    carregarAvaliacoes();
}

iniciarAvaliacoes();