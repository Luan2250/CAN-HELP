from models.contrato import Contrato

class ListarContratoService:
    @staticmethod
    def executar():
        return Contrato.listar_todos()