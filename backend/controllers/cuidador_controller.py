# app/controllers/cuidador_controller.py
from flask import request, jsonify
from services.cuidador.criar_cuidador_service import CriarCuidadorService
from services.cuidador.listar_cuidador_service import ListarCuidadorService
from services.cuidador.buscar_cuidador_service import BuscarCuidadorService
from services.cuidador.atualizar_cuidador_service import AtualizarCuidadorService
from services.cuidador.deletar_cuidador_service import DeletarCuidadorService

class CuidadorController:

    @staticmethod
    def criar():
        dados = request.get_json()
        cuidador = CriarCuidadorService.executar(dados)
        return jsonify(cuidador.to_dict()), 201

    @staticmethod
    def listar():
        cuidadores = ListarCuidadorService.executar()
        return jsonify([p.to_dict() for p in cuidadores]), 200

    @staticmethod
    def buscar_por_id(id_usuario):
        cuidador = BuscarCuidadorService.executar(id_usuario)
        if not cuidador:
            return jsonify({"erro": "cuidador não encontrado"}), 404
        return jsonify(cuidador.to_dict()), 200

    @staticmethod
    def atualizar(id_usuario):
        dados = request.get_json()
        cuidador_atualizado = AtualizarCuidadorService.executar(id_usuario, dados)
        if not cuidador_atualizado:
            return jsonify({"erro": "cuidador não encontrado"}), 404
        return jsonify(cuidador_atualizado.to_dict()), 200

    @staticmethod
    def deletar(id_usuario):
        sucesso = DeletarCuidadorService.executar(id_usuario)
        if not sucesso:
            return jsonify({"erro": "cuidador não encontrado"}), 404
        return jsonify({"mensagem": "cuidador deletado com sucesso"}), 200