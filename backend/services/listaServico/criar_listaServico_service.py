# app/services/listaServico/criar_listaServico_service.py
from models.listaServicos import ListaServicos

class CriarListaServicosService:
    @staticmethod
    def executar(dados):
        novo_servico = ListaServicos(
            tipoServico=dados.get('tipoServico')
        )

        novo_servico.salvar()

        return novo_servico
