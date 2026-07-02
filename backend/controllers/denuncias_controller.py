# app/controllers/denuncias_controller.py
from flask import request, jsonify
from services.denuncias.criar_denuncias_service import CriardenunciasService

class CriardenunciasService:
    @staticmethod
    def criar():
        # Captura os dados enviados no formato JSON (cpf, email, telefone, senha, etc.)
        dados = request.get_json()
        
        # Executa o serviço de criação passando os dados recebidos
        denuncias = CriardenunciasService.executar(dados)
        
        # Retorna o usuário criado convertido em dicionário com o status HTTP 201 (Created)
        return jsonify(denuncias.to_dict()), 201