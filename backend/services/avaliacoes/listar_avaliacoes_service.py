from models.avaliacoes import Avaliacoes

class ListarAvaliacoesService:
    @staticmethod
    def executar():
        return Avaliacoes.listar_todos()