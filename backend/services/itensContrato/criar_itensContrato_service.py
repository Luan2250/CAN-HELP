# app/services/itensContrato/criar_itensContrato_service.py
from models.itensContrato import ItensContrato

class CriarItensContratoService:
    @staticmethod
    def executar(dados):
        novo_item = ItensContrato(
            idContrato=dados.get('idContrato'),
            idServico=dados.get('idServico')
        )

        novo_item.salvar()

        return novo_item