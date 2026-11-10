from models.mensagem import Mensagem


class DeletarMensagemService:
    @staticmethod
    def executar(idMensagem, idUsuario=None):
        mensagem = Mensagem.buscar_por_id(idMensagem)
        if not mensagem:
            return False
        if idUsuario is not None and int(idUsuario) != mensagem.idRemetente:
            raise ValueError("Apenas quem enviou a mensagem pode excluí-la")

        mensagem.deletar()
        return True
