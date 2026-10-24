from models.notificacao import Notificacao

class MarcarTodasLidasService:
    @staticmethod
    def executar(id_usuario):
        Notificacao.marcar_todas_lidas(id_usuario)