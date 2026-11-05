# app/services/listaServico/atualizar_listaServico_service.py
from models.listaServicos import ListaServicos

class AtualizarListaServicosService:
    @staticmethod
    def executar(id_servico, dados):
        servico = ListaServicos.buscar_por_id(id_servico)
        if not servico:
            return None

        preco_base = dados.get('precoBase')
        if preco_base not in (None, ''):
            try:
                preco_base = float(preco_base)
            except (TypeError, ValueError):
                raise ValueError("O preço base deve ser um número.")
            if preco_base < 0:
                raise ValueError("O preço base não pode ser negativo.")
        else:
            preco_base = None  # não veio preço: mantém o que já está no banco

        servico.atualizar(
            tipoServico=dados.get('tipoServico'),
            precoBase=preco_base
        )
        return servico