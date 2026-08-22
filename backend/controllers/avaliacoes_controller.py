# app/controllers/avaliacoes_controller.py
from flask import request, jsonify
from services.avaliacoes.criar_avaliacoes_service import CriarAvaliacoesService
from services.avaliacoes.listar_avaliacoes_service import ListarAvaliacoesService
from services.avaliacoes.buscar_avaliacoes_service import BuscarAvaliacoesService
from services.avaliacoes.atualizar_avaliacoes_service import AtualizarAvaliacoesService
from services.avaliacoes.deletar_avaliacoes_service import DeletarAvaliacoesService

class AvaliacoesController:
    
    @staticmethod
    def criar():
        dados = request.get_json()
        try:
            avaliacao = CriarAvaliacoesService.executar(dados)
            return jsonify(avaliacao.to_dict()), 201
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            return jsonify({"erro": "Erro interno ao criar avaliação"}), 500

    @staticmethod
    def listar():
        avaliacoes = ListarAvaliacoesService.executar()
        return jsonify([a.to_dict() for a in avaliacoes]), 200

    @staticmethod
    def buscar_por_id(idAvaliacao):
        avaliacao = BuscarAvaliacoesService.executar(idAvaliacao)
        if not avaliacao:
            return jsonify({"erro": "Avaliação não encontrada"}), 404
        return jsonify(avaliacao.to_dict()), 200

    @staticmethod
    def atualizar(idAvaliacao):
        dados = request.get_json()
        try:
            avaliacao_atualizada = AtualizarAvaliacoesService.executar(idAvaliacao, dados)
            if not avaliacao_atualizada:
                return jsonify({"erro": "Avaliação não encontrada"}), 404
            return jsonify(avaliacao_atualizada.to_dict()), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400

    @staticmethod
    def deletar(idAvaliacao):
        sucesso = DeletarAvaliacoesService.executar(idAvaliacao)
        if not sucesso:
            return jsonify({"erro": "Avaliação não encontrada"}), 404
        return jsonify({"mensagem": "Avaliação deletada com sucesso"}), 200