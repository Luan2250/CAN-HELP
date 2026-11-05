from flask import jsonify, g
from controllers.auth_decorator import exigir_autenticacao
from services.notificacao.listar_notificacoes_service import ListarNotificacoesService
from services.notificacao.marcar_notificacao_lida_service import MarcarNotificacaoLidaService
from services.notificacao.marcar_todas_lidas_service import MarcarTodasLidasService

class NotificacaoController:

    @staticmethod
    @exigir_autenticacao
    def listar():
        return jsonify(ListarNotificacoesService.executar(g.id_usuario)), 200

    @staticmethod
    @exigir_autenticacao
    def marcar_lida(idNotificacao):
        notificacao = MarcarNotificacaoLidaService.executar(g.id_usuario, idNotificacao)
        if notificacao is None:
            return jsonify({"erro": "Notificação não encontrada"}), 404
        return jsonify(notificacao.to_dict()), 200

    @staticmethod
    @exigir_autenticacao
    def marcar_todas_lidas():
        MarcarTodasLidasService.executar(g.id_usuario)
        return jsonify({"mensagem": "Notificações marcadas como lidas"}), 200