# app/services/cuidador/criar_cuidador_service.py
from models.cuidador import Cuidador  
from models.cliente import Cliente


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

        if Cliente.buscar_por_id('idUsuario'):
            raise ValueError("Este usuário já está cadastrado como cliente.")

        #teste
        
        # Chama o método salvar que criamos na Model (Active Record)
        novo_cuidador.salvar()
        
        return novo_cuidador