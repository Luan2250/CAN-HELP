
const SERVICOS_URL = '/listasServicos';

const parametros =
    new URLSearchParams(window.location.search);

const idCuidador =
    parametros.get('idCuidador');

let servicos = [];

let servicoSelecionado = null;


/* =====================================================
   ÍCONES (PNG DA PASTA IMG)
===================================================== */

function pegarIcone(nome) {

    const chave = (nome || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    let arquivo = null;

    if (chave.includes('transporte') || chave.includes('carro')) {
        arquivo = 'transporte.png';

    } else if (chave.includes('banho') || chave.includes('higiene')) {
        arquivo = 'banho.png';

    } else if (
        chave.includes('alimentacao') ||
        chave.includes('refeicao')
    ) {
        arquivo = 'alimentacao.png';

    } else if (
        chave.includes('acompanhamento') ||
        chave.includes('companhia')
    ) {
        arquivo = 'companhia.png';

    } else if (
        chave.includes('compra') ||
        chave.includes('supermercado')
    ) {
        arquivo = 'compras.png';

    } else if (
        chave.includes('farmacia') ||
        chave.includes('remedio')
    ) {
        arquivo = 'farmacia.png';

    } else if (chave.includes('medic')) {
        arquivo = 'medicacao.png';
    }

    if (!arquivo) {
        return '';
    }

    return `
        <img
            src="img/svg/${arquivo}"
            alt="${nome}"
            class="img-icone-servico"
        >
    `;
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

                <div class="servico-icone">
                    ${pegarIcone(servico.tipoServico)}
                </div>

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