from models.contrato import Contrato
from services.contrato.atualizar_status_contrato_service import AtualizarStatusContratoService

class AtualizarContratoService:
    @staticmethod
    def executar(idContrato, dados):
        contrato = Contrato.buscar_por_id(idContrato)
        if not contrato:
            return None

        # O status não muda direto: passa pelas regras de transição
        # (e gera a notificação), que ficam no AtualizarStatusContratoService.
        novo_status = dados.get('statusContrato')
        if novo_status and novo_status != contrato.statusContrato:
            AtualizarStatusContratoService.executar(idContrato, novo_status)

        contrato.atualizar(
            dataContrato=dados.get('dataContrato'),
            dataAtendimento=dados.get('dataAtendimento'),
            localizacao=dados.get('localizacao'),
            nomeAuxiliado=dados.get('nomeAuxiliado'),
            valorFinal=dados.get('valorFinal')
        )
        return contrato