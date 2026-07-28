from models.avaliacoes import Avaliacoes

class CriarAvaliacoesService:
    @staticmethod
    def executar(dados):
        novo_avaliacoes = Avaliacoes(
            tipoAvaliador=dados.get('tipoAvaliador'),
            nota=dados.get('nota'),
            comentario=dados.get('comentario'),
            gorjeta=dados.get('gorjeta'),
            dataAvaliacao=dados.get('dataAvaliacao')
        )
        
        novo_avaliacoes.salvar()
        
        return novo_avaliacoes