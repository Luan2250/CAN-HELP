# app/controllers/contrato_controller.py
from flask import request, jsonify
from services.contrato.criar_contrato_service import CriarContratoService
from services.contrato.listar_contrato_service import ListarContratoService
from services.contrato.buscar_contrato_service import BuscarContratoService
from services.contrato.atualizar_contrato_service import AtualizarContratoService
from services.contrato.deletar_contrato_service import DeletarContratoService

class ContratoController:

    @staticmethod
    def criar():
        dados = request.get_json()
        contrato = CriarContratoService.executar(dados)
        return jsonify(contrato.to_dict()), 201

    @staticmethod
    def listar():
        contratos = ListarContratoService.executar()
        return jsonify([p.to_dict() for p in contratos]), 200

    @staticmethod
    def buscar_por_id(id_contrato): # Alterado para id_contrato
        contrato = BuscarContratoService.executar(id_contrato)
        if not contrato:
            return jsonify({"erro": "contrato não encontrado"}), 404
        return jsonify(contrato.to_dict()), 200

    @staticmethod
    def atualizar(id_contrato): # Alterado para id_contrato
        dados = request.get_json()
        contrato_atualizado = AtualizarContratoService.executar(id_contrato, dados)
        if not contrato_atualizado:
            return jsonify({"erro": "contrato não encontrado"}), 404
        return jsonify(contrato_atualizado.to_dict()), 200

    @staticmethod
    def deletar(id_contrato): # Alterado para id_contrato
        sucesso = DeletarContratoService.executar(id_contrato)
        if not sucesso:
            return jsonify({"erro": "contrato não encontrado"}), 404
        return jsonify({"mensagem": "contrato deletado com sucesso"}), 200