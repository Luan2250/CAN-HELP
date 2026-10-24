from extensions import db
from models.notificacao import Notificacao

class CriarNotificacaoService:
    @staticmethod
    def executar(id_usuario, mensagem, id_contrato=None):
        try:
            notificacao = Notificacao(
                idUsuario=id_usuario,
                mensagem=mensagem,
                idContrato=id_contrato
            )
            notificacao.salvar()
            return notificacao
        except Exception:
            db.session.rollback()
            return None