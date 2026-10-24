from models.notificacao import Notificacao

class MarcarNotificacaoLidaService:
    @staticmethod
    def executar(id_usuario, id_notificacao):
        notificacao = Notificacao.buscar_por_id(id_notificacao)

        if not notificacao or notificacao.idUsuario != id_usuario:
            return None

        notificacao.marcar_lida()
        return notificacao