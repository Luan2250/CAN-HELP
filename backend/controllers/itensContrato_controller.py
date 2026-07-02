# app/controllers/itensContrato_controller.py
from flask import request, jsonify
from services.itensContrato.criar_itensContrato_service import CriarItensContratoService

class CriarItensContratoService:
    @staticmethod
    def criar():
        # Captura os dados enviados no formato JSON (cpf, email, telefone, senha, etc.)
        dados = request.get_json()
        
        # Executa o serviço de criação passando os dados recebidos
        itensContrato = CriarItensContratoService.executar(dados)
        
        return jsonify(itensContrato.to_dict()), 201