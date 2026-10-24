# app/controllers/denuncias_controller.py
from flask import request, jsonify
from services.denuncias.criar_denuncias_service import CriardenunciasService
from services.denuncias.listar_denuncias_service import ListarDenunciasService
from services.denuncias.buscar_denuncias_service import BuscarDenunciasService
from services.denuncias.atualizar_denuncias_service import AtualizarDenunciasService
from services.denuncias.deletar_denuncias_service import DeletarDenunciasService

class DenunciaController:
    @staticmethod
    def criar():
        dados = request.get_json()
        denuncia = CriardenunciasService.executar(dados)
        return jsonify(denuncia.to_dict()), 201

    @staticmethod
    def listar():
        denuncias = ListarDenunciasService.executar()
        return jsonify([d.to_dict() for d in denuncias]), 200

    @staticmethod
    def buscar_por_id(idDenuncia):
        denuncia = BuscarDenunciasService.executar(idDenuncia)
        if denuncia is None:
            return jsonify({'erro': 'Denúncia não encontrada'}), 404
        return jsonify(denuncia.to_dict()), 200

    @staticmethod
    def atualizar(idDenuncia):
        dados = request.get_json()
        denuncia = AtualizarDenunciasService.executar(idDenuncia, dados)
        if denuncia is None:
            return jsonify({'erro': 'Denúncia não encontrada'}), 404
        return jsonify(denuncia.to_dict()), 200

    @staticmethod
    def deletar(idDenuncia):
        sucesso = DeletarDenunciasService.executar(idDenuncia)
        if not sucesso:
            return jsonify({'erro': 'Denúncia não encontrada'}), 404
        return '', 204
