from flask import jsonify, g
from controllers.auth_decorator import exigir_autenticacao
from services.notificacao.listar_notificacoes_service import ListarNotificacoesService

class NotificacaoController:

    @staticmethod
    @exigir_autenticacao
    def listar():
        return jsonify(ListarNotificacoesService.executar(g.id_usuario)), 200