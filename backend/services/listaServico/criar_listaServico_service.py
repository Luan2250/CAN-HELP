# app/services/listaServico/criar_listaServico_service.py
from models.listaServicos import listaServicos

class CriarlistaServicosService:
    @staticmethod
    def executar(dados):
        novo_listaServicos = listaServicos(
            fotoURL=dados.get('fotoURL'),
            nome=dados.get('nome'),
            bio=dados.get('bio'),
            cidade=dados.get('cidade'),
            estado=dados.get('estado')
        )
        
        # Chama o método salvar que criamos na Model (Active Record)
        novo_listaServicos.salvar()
        
        return novo_listaServicos