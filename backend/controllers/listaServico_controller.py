# app/controllers/listaServico_controller.py
from flask import request, jsonify
from services.listaServico.criar_listaServico_service import CriarlistaServicosService

class CriarlistaServicosService:
    @staticmethod
    def criar():
        # Captura os dados enviados no formato JSON (cpf, email, telefone, senha, etc.)
        dados = request.get_json()
        
        # Executa o serviço de criação passando os dados recebidos
        listaServico = CriarlistaServicosService.executar(dados)
        
        # Retorna o usuário criado convertido em dicionário com o status HTTP 201 (Created)
        return jsonify(listaServico.to_dict()), 201