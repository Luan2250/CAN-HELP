from models.notificacao import Notificacao

class ListarNotificacoesService:
    @staticmethod
    def executar(id_usuario):
        notificacoes = Notificacao.listar_por_usuario(id_usuario)
        return {
            "naoLidas": Notificacao.contar_nao_lidas(id_usuario),
            "notificacoes": [n.to_dict() for n in notificacoes]
        }