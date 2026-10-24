from datetime import datetime
from models.cliente import Cliente
from models.perfil import Perfil
from models.listaServicos import ListaServicos
from repositories.cuidadorImediato_repository import CuidadorImediatoRepository
from services.contrato.criar_contrato_service import CriarContratoService


class SolicitarAjudaImediataService:
    @staticmethod
    def executar(id_cliente, dados):
        if not Cliente.buscar_por_id(id_cliente):
            raise ValueError("Apenas clientes podem solicitar ajuda imediata")

        localizacao = (dados.get('localizacao') or '').strip()
        if not localizacao:
            raise ValueError("Localização é obrigatória")

        nome_auxiliado = (dados.get('nomeAuxiliado') or '').strip()
        if not nome_auxiliado:
            raise ValueError("Nome do auxiliado é obrigatório")

        cidade = (dados.get('cidade') or '').strip() or None

        servicos = dados.get('servicos')
        if not isinstance(servicos, list) or not servicos:
            raise ValueError("Informe ao menos um serviço em 'servicos' (lista de ids)")
        try:
            servicos = list(dict.fromkeys(int(s) for s in servicos))
        except (ValueError, TypeError):
            raise ValueError("A lista 'servicos' deve conter apenas ids numéricos")

        valor = 0.0
        for id_servico in servicos:
            servico = ListaServicos.buscar_por_id(id_servico)
            if not servico:
                raise ValueError(f"Serviço com ID {id_servico} não encontrado")
            valor += float(servico.precoBase)
        if valor <= 0:
            raise ValueError("Não foi possível calcular o valor da solicitação")

        agora = datetime.now()
        id_cuidador = CuidadorImediatoRepository.buscar_melhor_disponivel(
            agora.date(), id_cliente, cidade
        )
        if id_cuidador is None:
            raise ValueError("Nenhum cuidador disponível no momento. Tente novamente em instantes")

        contrato = CriarContratoService.executar({
            'idCliente': id_cliente,
            'idCuidador': id_cuidador,
            'dataAtendimento': agora.strftime('%Y-%m-%d'),
            'horaAtendimento': agora.strftime('%H:%M'),
            'ocasiao': 'Ajuda imediata',
            'localizacao': localizacao,
            'nomeAuxiliado': nome_auxiliado,
            'valorFinal': valor,
            'servicos': servicos,
            'imediato': True
        })

        perfil = Perfil.buscar_por_id(id_cuidador)
        return contrato, (perfil.nome if perfil else None)