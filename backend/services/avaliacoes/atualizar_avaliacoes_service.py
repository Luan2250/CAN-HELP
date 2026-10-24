from models.avaliacoes import Avaliacoes

class AtualizarAvaliacoesService:
    @staticmethod
    def executar(idAvaliacao, dados):
        avaliacoes = Avaliacoes.buscar_por_id(idAvaliacao)
        if not avaliacoes:
            return None
        
        avaliacoes.atualizar(
            tipoAvaliador=dados.get('tipoAvaliador'),
            nota=dados.get('nota'),
            comentario=dados.get('comentario'),
            gorjeta=dados.get('gorjeta'),
            dataAvaliacao=dados.get('dataAvaliacao')
        )
        return avaliacoes