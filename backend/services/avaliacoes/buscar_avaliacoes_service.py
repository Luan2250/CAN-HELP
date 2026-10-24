from models.avaliacoes import Avaliacoes

class BuscarAvaliacoesService:
    @staticmethod
    def executar(idAvaliacao):
        return Avaliacoes.buscar_por_id(idAvaliacao)