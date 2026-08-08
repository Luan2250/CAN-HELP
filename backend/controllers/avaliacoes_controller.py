
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
        avaliacoes = CriarAvaliacoesService.executar(dados)
        return jsonify(avaliacoes.to_dict()), 201

    @staticmethod
    def listar():
        avaliacoess = ListarAvaliacoesService.executar()
        return jsonify([u.to_dict() for u in avaliacoess]), 200

    @staticmethod
    def buscar_por_id(idAvaliacao):
        avaliacoes = BuscarAvaliacoesService.executar(idAvaliacao)
        if not avaliacoes:
            return jsonify({"erro": "Avaliação não encontrada"}), 404
        return jsonify(avaliacoes.to_dict()), 200

    @staticmethod
    def atualizar(idAvaliacao):
        dados = request.get_json()
        avaliacoes_atualizado = AtualizarAvaliacoesService.executar(idAvaliacao, dados)
        if not avaliacoes_atualizado:
            return jsonify({"erro": "Avaliação não encontrada"}), 404
        return jsonify(avaliacoes_atualizado.to_dict()), 200

    @staticmethod
    def deletar(idAvaliacao):
        sucesso = DeletarAvaliacoesService.executar(idAvaliacao)
        if not sucesso:
            return jsonify({"erro": "Avaliação não encontrada"}), 404
        return jsonify({"mensagem": "Avaliação deletada com sucesso"}), 200