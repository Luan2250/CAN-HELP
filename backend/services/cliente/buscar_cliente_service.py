from models.cliente import Cliente

class BuscarClienteService:
    @staticmethod
    def executar(id_usuario):
        return Cliente.buscar_por_id(id_usuario)