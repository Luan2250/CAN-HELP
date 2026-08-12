# app/services/cliente/criar_cliente_service.py
from models.cliente import Cliente  

class CriarClienteService:
    @staticmethod
    def executar(dados):
        novo_cliente = Cliente(
            idUsuario=dados.get('idUsuario')
        )
        
        # Chama o método salvar que criamos na Model (Active Record)
        novo_cliente.salvar()
        
        return novo_cliente


class ListarClienteService:
    @staticmethod
    def executar():
        return Cliente.listar_todos()