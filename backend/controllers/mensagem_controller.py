from flask import request, jsonify
from services.mensagem.criar_mensagem_service import CriarMensagemService
from services.mensagem.listar_mensagens_service import ListarMensagensService
from services.mensagem.marcar_lidas_service import MarcarLidasService
from services.mensagem.deletar_mensagem_service import DeletarMensagemService
from services.mensagem.listar_conversas_service import ListarConversasService


class MensagemController:

    @staticmethod
    def criar():
        dados = request.get_json()
        try:
            mensagem = CriarMensagemService.executar(dados)
            return jsonify(mensagem.to_dict()), 201
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            return jsonify({"erro": "Erro interno ao enviar mensagem"}), 500

    @staticmethod
    def listar_por_contrato(idContrato):
        try:
            mensagens = ListarMensagensService.executar(idContrato)
            return jsonify(mensagens), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 404

    @staticmethod
    def marcar_lidas(idContrato):
        dados = request.get_json() or {}
        idUsuario = dados.get('idUsuario')
        try:
            resultado = MarcarLidasService.executar(idContrato, idUsuario)
            return jsonify(resultado), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400

    @staticmethod
    def deletar(idMensagem):
        dados = request.get_json(silent=True) or {}
        idUsuario = dados.get('idUsuario')
        try:
            sucesso = DeletarMensagemService.executar(idMensagem, idUsuario)
            if not sucesso:
                return jsonify({"erro": "Mensagem não encontrada"}), 404
            return jsonify({"mensagem": "Mensagem excluída com sucesso"}), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 403

    @staticmethod
    def listar_conversas(idUsuario):
        conversas = ListarConversasService.executar(idUsuario)
        return jsonify(conversas), 200
