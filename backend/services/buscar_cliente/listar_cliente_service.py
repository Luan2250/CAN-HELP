from models.cliente import Cliente

class ListarClienteService:
    @staticmethod
    def executar():
        return Cliente.listar_todos()