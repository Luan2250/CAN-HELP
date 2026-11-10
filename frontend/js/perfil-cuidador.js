

const parametros =
    new URLSearchParams(window.location.search);

const idUsuario =
    parametros.get('id');




const PERFIS_URL = '/perfis';

const CUIDADORES_URL = '/cuidadores';

const AVALIACOES_URL = '/avaliacoess';




async function carregarPerfilCuidador() {

    const nomeElemento =
        document.getElementById('perfil-nome');

    const descricaoElemento =
        document.getElementById('perfil-descricao');

    const fotoElemento =
    document.querySelector('.foto-perfil img');

 

    if (!idUsuario) {
        const titulo = document.getElementById('perfil-nome');
        const descricao = document.getElementById('perfil-descricao');
        if (titulo) titulo.textContent = 'Perfil de cuidador';
        if (descricao) descricao.textContent = 'Para visualizar um perfil, escolha um cuidador na página Buscar cuidador.';
        document.querySelectorAll('#btn-solicitar, #btn-chat, #btn-avaliar').forEach((botao) => {
            botao.disabled = true;
        });
        showToast('Selecione um cuidador na busca para visualizar o perfil.', 'info');
        return;
    }


    try {

     

        const perfil =
            await api.get(
                `${PERFIS_URL}/${idUsuario}`
            );


        if (!perfil) {

            showToast(
                'Perfil não encontrado.',
                'error'
            );

            return;
        }


 

        if (nomeElemento) {

            nomeElemento.textContent =
                perfil.nome ?? 'Cuidador';

        }


        if (descricaoElemento) {

            descricaoElemento.textContent =
                perfil.bio ??
                'Este cuidador ainda não possui uma descrição.';

        }



            if (fotoElemento) {

                fotoElemento.src = perfil.fotoURL || 'img/user.png';

                fotoElemento.onerror = () => {
                    fotoElemento.onerror = null;
                    fotoElemento.src = 'img/user.png';
                };

            }


  

        const dadosPerfil =
            document.querySelector('.perfil-dados');


        if (dadosPerfil) {

            const spans =
                dadosPerfil.querySelectorAll('span');


            if (spans[1]) {

                const cidade =
                    perfil.cidade ?? '';

                const estado =
                    perfil.estado ?? '';


                let localizacao =
                    'Localização não informada';


                if (cidade && estado) {

                    localizacao =
                        `${cidade}, ${estado}`;

                } else if (cidade) {

                    localizacao =
                        cidade;

                } else if (estado) {

                    localizacao =
                        estado;

                }


                spans[1].textContent =
                    `📍 ${localizacao}`;

            }

        }



        const cuidadores =
            await api.get(CUIDADORES_URL);


        const cuidador =
            (cuidadores || []).find(
                (item) =>
                    Number(item.idUsuario) ===
                    Number(idUsuario)
            );


        if (cuidador) {

   

            const precoElemento =
                document.querySelector('.perfil-preco');


            if (precoElemento) {

                const valor =
                    Number(
                        cuidador.valorServico ?? 0
                    );


                precoElemento.textContent =
                    `R$ ${valor.toFixed(2)}/h`;

            }




            const dadosPerfilCuidador =
                document.querySelector('.perfil-dados');


            if (dadosPerfilCuidador) {

                const spans =
                    dadosPerfilCuidador.querySelectorAll('span');


                if (spans[2]) {

                    spans[2].textContent =
                        `🟢 ${
                            cuidador.disponibilidade ??
                            'Não informada'
                        }`;

                }

            }


 

            const experienciaBox =
                document.querySelector('.experiencia-box');


            if (experienciaBox) {

                const divs =
                    experienciaBox.querySelectorAll('div');


          

                if (divs[0]) {

                    divs[0].innerHTML = `
                        <strong>
                            Certificado:
                        </strong>

                        <span>
                            ${cuidador.certificado ?? 'Não informado'}
                        </span>
                    `;

                }



                if (divs[1]) {

                    divs[1].innerHTML = `
                        <strong>
                            Órgão emissor:
                        </strong>

                        <span>
                            ${cuidador.orgaoEmissor ?? 'Não informado'}
                        </span>
                    `;

                }



                if (divs[2]) {

                    divs[2].innerHTML = `
                        <strong>
                            Disponível:
                        </strong>

                        <span>
                            ${cuidador.disponibilidade ?? 'Não informada'}
                        </span>
                    `;

                }

            }

        }


  

        const avaliacoes =
            await api.get(AVALIACOES_URL);


        const avaliacoesDoCuidador =
            (avaliacoes || []).filter(
                (avaliacao) =>
                    Number(avaliacao.idAvaliado) ===
                    Number(idUsuario)
            );


     

        let media = 0;


        if (avaliacoesDoCuidador.length > 0) {

            const soma =
                avaliacoesDoCuidador.reduce(
                    (total, avaliacao) => {

                        return (
                            total +
                            Number(
                                avaliacao.nota ?? 0
                            )
                        );

                    },
                    0
                );


            media =
                soma /
                avaliacoesDoCuidador.length;

        }



        const dadosPerfilNota =
            document.querySelector('.perfil-dados');


        if (dadosPerfilNota) {

            const spans =
                dadosPerfilNota.querySelectorAll('span');


            if (spans[0]) {

                spans[0].innerHTML = `
                    ⭐ <strong>
                        ${
                            media > 0
                                ? media.toFixed(1)
                                : 'Sem avaliações'
                        }
                    </strong>
                `;

            }

        }



        const caixasPerfil =
            document.querySelectorAll(
                '.perfil-box'
            );


        const caixaAvaliacoes =
            caixasPerfil[
                caixasPerfil.length - 1
            ];


        if (caixaAvaliacoes) {

            const linhas =
                caixaAvaliacoes.querySelectorAll(
                    '.avaliacao-linha'
                );


            if (avaliacoesDoCuidador.length === 0) {

                linhas.forEach(
                    (linha, indice) => {

                        if (indice === 0) {

                            linha.style.display =
                                'block';

                            linha.textContent =
                                'Nenhuma avaliação ainda.';

                        } else {

                            linha.style.display =
                                'none';

                        }

                    }
                );

            } else {

                linhas.forEach(
                    (linha, indice) => {

                        const avaliacao =
                            avaliacoesDoCuidador[
                                indice
                            ];


                        if (!avaliacao) {

                            linha.style.display =
                                'none';

                            return;

                        }


                        linha.style.display =
                            'block';


                        const comentario =
                            avaliacao.comentario
                            ? ` ${avaliacao.comentario}`
                            : '';


                        linha.textContent =
                            `⭐ ${avaliacao.nota}${comentario}`;

                    }
                );

            }

        }


    } catch (erro) {

        console.error(
            'Erro ao carregar perfil:',
            erro
        );


        showToast(
            `Erro ao carregar perfil: ${erro.message}`,
            'error'
        );

    }

}



document
    .getElementById('btn-solicitar')
    .addEventListener('click', () => {

        if (!idUsuario) {

            showToast(
                'ID do cuidador não informado.',
                'error'
            );

            return;
        }


        window.location.href =
            `servicos.html?idCuidador=${idUsuario}`;

    });



document
    .getElementById('btn-chat')
    .addEventListener('click', () => {

        window.location.href =
            `chat.html?idCuidador=${encodeURIComponent(idUsuario)}`;

    });


document
    .getElementById('btn-avaliar')
    .addEventListener('click', () => {

        showToast(
            'Área de avaliação ainda não está disponível.'
        );

    });



carregarPerfilCuidador();