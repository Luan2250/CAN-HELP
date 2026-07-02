# app/services/denuncias/criar_denuncias_service.py
from models.denuncias import denuncias

class CriardenunciasService:
    @staticmethod
    def executar(dados):
        novo_denuncias = denuncias(
idContratacao=dados.get('idContratacao'),
            idDenunciante=dados.get('idDenunciante'),
            idDenunciado=dados.get('idDenunciado'),
            tipoDenunciante=dados.get('tipoDenunciante'),
            descricao=dados.get('descricao'),           
            penalidade=dados.get('penalidade', 'Nenhuma'),
            statusDenuncia=dados.get('statusDenuncia', 'pendente')
        )
        
        novo_denuncias.salvar()
        
        return novo_denuncias