from models.contrato import Contrato

class AtualizarContratoService:
    @staticmethod
    def executar(idContrato, dados):
        contrato = Contrato.buscar_por_id(idContrato)
        if not contrato:
            return None
        
        contrato.atualizar(
            dataContrato=dados.get('dataContrato'),
            dataAtendimento=dados.get('dataAtendimento'),
            localizacao=dados.get('localizacao'),
            nomeAuxiliado=dados.get('nomeAuxiliado'),
            statusContrato=dados.get('statusContrato'),
            valorFinal=dados.get('valorFinal')
        )
        return contrato