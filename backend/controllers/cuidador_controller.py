# app/controllers/cuidador_controller.py
from flask import request, jsonify
from services.cuidador.criar_cuidador_service import CriarCuidadorService

class CriarCuidadorService:
    @staticmethod
    def criar():
        # Captura os dados enviados no formato JSON (cpf, email, telefone, senha, etc.)
        dados = request.get_json()
        
        # Executa o serviço de criação passando os dados recebidos
        cuidador = CriarCuidadorService.executar(dados)
        
        # Retorna o usuário criado convertido em dicionário com o status HTTP 201 (Created)
        return jsonify(cuidador.to_dict()), 201