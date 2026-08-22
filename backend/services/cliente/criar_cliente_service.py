# app/services/cliente/criar_cliente_service.py
from models.cliente import Cliente
from models.cuidador import Cuidador

class CriarClienteService:
    @staticmethod
    def executar(dados):
        if not dados.get('idUsuario'):
            raise ValueError("ID do usuário é obrigatório")

        if Cuidador.buscar_por_id(dados.get('idUsuario')):
            raise ValueError("Este usuário já está cadastrado como cuidador.")

        novo_cliente = Cliente(
            idUsuario=dados.get('idUsuario')
        )

        novo_cliente.salvar()

        return novo_cliente

