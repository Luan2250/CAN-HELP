# app/services/cuidador/criar_cuidador_service.py
from models.cuidador import Cuidador  

class CriarCuidadorService:
    @staticmethod
    def executar(dados):
        novo_cuidador = Cuidador(
            idUsuario=dados.get('idUsuario'),
            certificado=dados.get('certificado'),
            orgaoEmissor=dados.get('orgaoEmissor'),
            valorServico=dados.get('valorServico', 0.00),
            disponibilidade=dados.get('disponibilidade')
        )
        
        # Chama o método salvar que criamos na Model (Active Record)
        novo_cuidador.salvar()
        
        return novo_cuidador