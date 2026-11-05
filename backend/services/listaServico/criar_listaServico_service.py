# app/services/listaServico/criar_listaServico_service.py
from models.listaServicos import ListaServicos

class CriarListaServicosService:
    @staticmethod
    def executar(dados):
        preco_base = dados.get('precoBase')
        try:
            preco_base = float(preco_base) if preco_base not in (None, '') else 0.00
        except (TypeError, ValueError):
            raise ValueError("O preço base deve ser um número.")
        if preco_base < 0:
            raise ValueError("O preço base não pode ser negativo.")

        novo_servico = ListaServicos(
            tipoServico=dados.get('tipoServico'),
            precoBase=preco_base
        )

        novo_servico.salvar()

        return novo_servico