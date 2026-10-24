from models.cliente import Cliente

class DeletarClienteService:
    @staticmethod
    def executar(id_usuario):
        cliente = Cliente.buscar_por_id(id_usuario)
        if not cliente:
            return False
        
        cliente.deletar()
        return True