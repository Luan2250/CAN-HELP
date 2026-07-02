# app/controllers/cliente_controller.py
from flask import request, jsonify
from services.cliente.criar_cliente_service import CriarClienteService

class CriarClienteService:
    @staticmethod
    def criar():
        # Captura os dados enviados no formato JSON (cpf, email, telefone, senha, etc.)
        dados = request.get_json()
        
        # Executa o serviço de criação passando os dados recebidos
        cliente = CriarClienteService.executar(dados)
        
        # Retorna o usuário criado convertido em dicionário com o status HTTP 201 (Created)
        return jsonify(cliente.to_dict()), 201