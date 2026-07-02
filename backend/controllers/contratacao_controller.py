# app/controllers/contratacao_controller.py
from flask import request, jsonify
from services.contratacao.criar_contratacao_service import CriarContratacaoService

class CriarContratacaoService:
    @staticmethod
    def criar():
        # Captura os dados enviados no formato JSON (cpf, email, telefone, senha, etc.)
        dados = request.get_json()
        
        # Executa o serviço de criação passando os dados recebidos
        contratacao = CriarContratacaoService.executar(dados)
        
        # Retorna o usuário criado convertido em dicionário com o status HTTP 201 (Created)
        return jsonify(contratacao.to_dict()), 201