from models.cliente import cliente

class BuscarClienteService:
    @staticmethod
    def executar(id_usuario):
        return cliente.buscar_por_id(id_usuario)