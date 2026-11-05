from repositories.conversas_repository import ConversasRepository


class ListarConversasService:
    @staticmethod
    def executar(idUsuario):
        return ConversasRepository.listar_por_usuario(idUsuario)
