# app/services/contratacao/criar_contratacao_service.py
from models.contratacao import Contratacao  

class CriarContratacaoService:
    @staticmethod
    def executar(dados):

        novo_contratacao = Contratacao(
            dataContratacao=dados.get('dataContratacao'),
            dataAtendimento=dados.get('dataAtendimento'),
            localizacao=dados.get('localizacao', 0.00),
            nomeAuxiliado=dados.get('nomeAuxiliado')
        )
        
        # Chama o método salvar que criamos na Model (Active Record)
        novo_contratacao.salvar()
        
        return novo_contratacao