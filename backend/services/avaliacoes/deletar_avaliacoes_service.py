from models.avaliacoes import Avaliacoes

class DeletarAvaliacoesService:
    @staticmethod
    def executar(idAvaliacao):
        avaliacoes = Avaliacoes.buscar_por_id(idAvaliacao)
        if not avaliacoes:
            return False
        
        avaliacoes.deletar()
        return True