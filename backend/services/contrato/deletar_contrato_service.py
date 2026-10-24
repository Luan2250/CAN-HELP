from models.contrato import Contrato

class DeletarContratoService:
    @staticmethod
    def executar(idContrato):
        contrato = Contrato.buscar_por_id(idContrato)
        if not contrato:
            return False
        
        contrato.deletar()
        return True