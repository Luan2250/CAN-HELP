from models.contrato import Contrato

class BuscarContratoService:
    @staticmethod
    def executar(idContrato):
        return Contrato.buscar_por_id(idContrato)