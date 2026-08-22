from models.contrato import Contrato
from repositories.mensagem_repository import MensagemRepository


class ListarMensagensService:
    @staticmethod
    def executar(idContrato):
        contrato = Contrato.buscar_por_id(idContrato)
        if not contrato:
            raise ValueError("Contrato não encontrado")

        return MensagemRepository.listar_por_contrato(idContrato)
