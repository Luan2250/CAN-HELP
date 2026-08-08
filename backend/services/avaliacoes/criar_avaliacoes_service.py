from models.avaliacoes import Avaliacoes

class CriarAvaliacoesService:
    @staticmethod
    def executar(dados):
        novo_avaliacoes = Avaliacoes(
            idAvaliador=dados.get('idAvaliador'),
            idAvaliado=dados.get('idAvaliado'),
            tipoAvaliador=dados.get('tipoAvaliador'),
            nota=dados.get('nota'),
            comentario=dados.get('comentario'),
            gorjeta=dados.get('gorjeta', 0.00)
        )
        
        novo_avaliacoes.salvar()
        
        return novo_avaliacoes