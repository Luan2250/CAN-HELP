from models.denuncias import Denuncias

class CriardenunciasService:
    @staticmethod
    def executar(dados):
        novo_denuncias = Denuncias(
            idDenunciante=dados.get('idDenunciante'),
            idDenunciado=dados.get('idDenunciado'),
            tipoDenunciante=dados.get('tipoDenunciante'),
            descricao=dados.get('descricao'),
            penalidade=dados.get('penalidade', 'Nenhuma'),
            statusDenuncia=dados.get('statusDenuncia', 'pendente')
        )
        
        novo_denuncias.salvar()
        
        return novo_denuncias