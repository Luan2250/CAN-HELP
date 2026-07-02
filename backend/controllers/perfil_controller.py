# app/controllers/perfil_controller.py
from flask import request, jsonify
from services.perfil.criar_perfil_service import CriarPerfilService
from services.perfil.listar_perfil_service import ListarPerfilService
from services.perfil.buscar_perfil_service import BuscarPerfilService
from services.perfil.atualizar_perfil_service import AtualizarPerfilService
from services.perfil.deletar_perfil_service import DeletarPerfilService

class PerfilController:

    @staticmethod
    def criar():
        dados = request.get_json()
        # O JSON enviado deve conter o 'idUsuario' para vincular ao Usuário correspondente
        perfil = CriarPerfilService.executar(dados)
        return jsonify(perfil.to_dict()), 201

    @staticmethod
    def listar():
        perfis = ListarPerfilService.executar()
        return jsonify([p.to_dict() for p in perfis]), 200

    @staticmethod
    def buscar_por_id(id_usuario):
        # Como o idUsuario é a PK do Perfil, buscamos diretamente por ele
        perfil = BuscarPerfilService.executar(id_usuario)
        if not perfil:
            return jsonify({"erro": "Perfil não encontrado"}), 404
        return jsonify(perfil.to_dict()), 200

    @staticmethod
    def atualizar(id_usuario):
        dados = request.get_json()
        perfil_atualizado = AtualizarPerfilService.executar(id_usuario, dados)
        if not perfil_atualizado:
            return jsonify({"erro": "Perfil não encontrado"}), 404
        return jsonify(perfil_atualizado.to_dict()), 200

    @staticmethod
    def deletar(id_usuario):
        sucesso = DeletarPerfilService.executar(id_usuario)
        if not sucesso:
            return jsonify({"erro": "Perfil não encontrado"}), 404
        return jsonify({"mensagem": "Perfil deletado com sucesso"}), 200