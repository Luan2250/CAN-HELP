/* =====================================================
   SERVIÇOS
===================================================== */

const SERVICOS_URL = '/listasServicos';

const parametros =
    new URLSearchParams(window.location.search);

const idCuidador =
    parametros.get('idCuidador');

let servicos = [];

let servicoSelecionado = null;


/* =====================================================
   ÍCONES
===================================================== */

const iconesServicos = {
    'transporte': '🚗',
    'banho': '🛁',
    'alimentação': '🍴',
    'alimentacao': '🍴',
    'acompanhamento': '👥',
    'compras': '🛒',
    'farmácia': '💊',
    'farmacia': '💊',
    'lazer': '🎭'
};


/* =====================================================
   PEGAR ÍCONE
===================================================== */

function pegarIcone(nome) {

    const chave =
        nome
            .toLowerCase()
            .trim();

    return (
        iconesServicos[chave] ||
        '🛠️'
    );
}


/* =====================================================
   CARREGAR SERVIÇOS
===================================================== */

async function carregarServicos() {

    const grid =
        document.getElementById('servicos-grid');

    grid.innerHTML = `
        <div class="carregando-servicos">
            Carregando serviços...
        </div>
    `;

    try {

        const dados =
            await api.get(SERVICOS_URL);

        servicos = dados || [];

        if (servicos.length === 0) {

            grid.innerHTML = `
                <div class="vazio-servicos">
                    Nenhum serviço cadastrado ainda.
                </div>
            `;

            return;
        }

        renderizarServicos();

    } catch (erro) {

        console.error(erro);

        grid.innerHTML = `
            <div class="erro-servicos">
                Erro ao carregar: ${erro.message}
            </div>
        `;
    }
}


/* =====================================================
   RENDERIZAR
===================================================== */

function renderizarServicos() {

    const grid =
        document.getElementById('servicos-grid');

    grid.innerHTML =
        servicos.map((servico) => `

            <button
                type="button"
                class="servico-item"
                data-id="${servico.idServico}"
            >

                <span class="servico-icone">
                    ${pegarIcone(servico.tipoServico)}
                </span>

                <span class="servico-nome">
                    ${servico.tipoServico}
                </span>

            </button>

        `).join('');

    document
        .querySelectorAll('.servico-item')
        .forEach((botao) => {

            botao.addEventListener('click', () => {

                selecionarServico(
                    Number(botao.dataset.id)
                );

            });

        });
}


/* =====================================================
   SELECIONAR SERVIÇO
===================================================== */

function selecionarServico(idServico) {

    servicoSelecionado =
        servicos.find(
            (servico) =>
                Number(servico.idServico) ===
                Number(idServico)
        );

    document
        .querySelectorAll('.servico-item')
        .forEach((botao) => {

            botao.classList.remove('selecionado');

        });

    const botaoSelecionado =
        document.querySelector(
            `.servico-item[data-id="${idServico}"]`
        );

    if (botaoSelecionado) {

        botaoSelecionado.classList.add(
            'selecionado'
        );

    }

    document.getElementById(
        'btn-continuar'
    ).disabled = false;
}


/* =====================================================
   CONTINUAR
===================================================== */

document
    .getElementById('btn-continuar')
    .addEventListener('click', () => {

        if (!servicoSelecionado) {

            showToast(
                'Selecione um serviço.',
                'error'
            );

            return;
        }

        if (!idCuidador) {

            showToast(
                'Cuidador não informado.',
                'error'
            );

            return;
        }

        const idServico = servicoSelecionado.idServico;

        // Guarda apenas os dados disponíveis nesta etapa para a tela de resumo.
        // A data, endereço, pessoa auxiliada e valor final dependem de definição no fluxo.
        const solicitacao = {
            idCuidador,
            idServico,
            tipoServico: servicoSelecionado.tipoServico || 'Serviço selecionado'
        };
        localStorage.setItem('canhelpSolicitacao', JSON.stringify(solicitacao));

        window.location.href =
            `confirmacao.html?idCuidador=${encodeURIComponent(idCuidador)}&idServico=${encodeURIComponent(idServico)}`;

    });


/* =====================================================
   INICIAR
===================================================== */

carregarServicos();