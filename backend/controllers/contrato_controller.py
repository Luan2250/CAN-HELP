# app/controllers/contrato_controller.py
from flask import request, jsonify
from services.contrato.criar_contrato_service import CriarContratoService
from services.contrato.listar_contrato_service import ListarContratoService
from services.contrato.buscar_contrato_service import BuscarContratoService
from services.contrato.atualizar_contrato_service import AtualizarContratoService
from services.contrato.deletar_contrato_service import DeletarContratoService
from services.contrato.relatorio_contratos_service import RelatorioContratosService


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
    def buscar_por_id(idContrato):
        contrato = BuscarContratoService.executar(idContrato)
        if not contrato:
            return jsonify({"erro": "contrato não encontrado"}), 404
        return jsonify(contrato.to_dict()), 200

    @staticmethod
    def atualizar(idContrato):
        dados = request.get_json()
        contrato_atualizado = AtualizarContratoService.executar(idContrato, dados)
        if not contrato_atualizado:
            return jsonify({"erro": "contrato não encontrado"}), 404
        return jsonify(contrato_atualizado.to_dict()), 200

    @staticmethod
    def deletar(idContrato):
        sucesso = DeletarContratoService.executar(idContrato)
        if not sucesso:
            return jsonify({"erro": "contrato não encontrado"}), 404
        return jsonify({"mensagem": "contrato deletado com sucesso"}), 200

    @staticmethod
    def relatorio_cliente(id_cliente):
        try:
            resultado = RelatorioContratosService.execute(id_cliente)
            return jsonify(resultado), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            return jsonify({"erro": "Erro interno ao gerar relatório"}), 500