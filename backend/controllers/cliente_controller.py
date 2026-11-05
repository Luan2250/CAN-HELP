# app/controllers/cliente_controller.py
from flask import request, jsonify
from services.cliente.criar_cliente_service import CriarClienteService
from services.cliente.listar_cliente_service import ListarClienteService
from services.cliente.buscar_cliente_service import BuscarClienteService
from services.cliente.deletar_cliente_service import DeletarClienteService

class ClienteController:

    @staticmethod
    def criar():
        dados = request.get_json()
        try:
            cliente = CriarClienteService.executar(dados)
            return jsonify(cliente.to_dict()), 201
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            return jsonify({"erro": "Erro interno ao criar cliente"}), 500

    @staticmethod
    def listar():
        clientes = ListarClienteService.executar()
        return jsonify([p.to_dict() for p in clientes]), 200

    @staticmethod
    def buscar_por_id(id_usuario):
        cliente = BuscarClienteService.executar(id_usuario)
        if not cliente:
            return jsonify({"erro": "Cliente não encontrado"}), 404
        return jsonify(cliente.to_dict()), 200

    @staticmethod
    def deletar(id_usuario):
        sucesso = DeletarClienteService.executar(id_usuario)
        if not sucesso:
            return jsonify({"erro": "Cliente não encontrado"}), 404
        return jsonify({"mensagem": "Cliente deletado com sucesso"}), 200