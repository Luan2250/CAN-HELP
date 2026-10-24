# app/controllers/itensContrato_controller.py
from flask import request, jsonify
from services.itensContrato.criar_itensContrato_service import CriarItensContratoService
from services.itensContrato.listar_itensContrato_service import ListarItensContratoService
from services.itensContrato.buscar_itensContrato_service import BuscarItensContratoService
from services.itensContrato.deletar_itensContrato_service import DeletarItensContratoService

class ItensContratoController:
    @staticmethod
    def criar():
        dados = request.get_json()
        item = CriarItensContratoService.executar(dados)
        return jsonify(item.to_dict()), 201

    @staticmethod
    def listar():
        itens = ListarItensContratoService.executar()
        return jsonify([i.to_dict() for i in itens]), 200

    @staticmethod
    def buscar_por_contrato(idContrato):
        # Retorna a lista de serviços vinculados a esse contrato.
        itens = BuscarItensContratoService.executar(idContrato)
        return jsonify([i.to_dict() for i in itens]), 200

    @staticmethod
    def deletar(idContrato, idServico):
        sucesso = DeletarItensContratoService.executar(idContrato, idServico)
        if not sucesso:
            return jsonify({'erro': 'Item de contrato não encontrado'}), 404
        return '', 204