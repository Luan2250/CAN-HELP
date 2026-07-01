# app/controllers/usuario_controller.py
from flask import request, jsonify
from services.usuario.criar_usuario_service import CriarUsuarioService

class UsuarioController:
    @staticmethod
    def criar():
        # Captura os dados enviados no formato JSON (cpf, email, telefone, senha, etc.)
        dados = request.get_json()
        
        # Executa o serviço de criação passando os dados recebidos
        usuario = CriarUsuarioService.executar(dados)
        
        # Retorna o usuário criado convertido em dicionário com o status HTTP 201 (Created)
        return jsonify(usuario.to_dict()), 201