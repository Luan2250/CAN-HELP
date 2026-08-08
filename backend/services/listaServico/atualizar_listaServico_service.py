# app/services/listaServico/atualizar_listaServico_service.py
from models.listaServicos import ListaServicos

class AtualizarListaServicosService:
    @staticmethod
    def executar(id_servico, dados):
        servico = ListaServicos.buscar_por_id(id_servico)
        if not servico:
            return None

        servico.atualizar(
            tipoServico=dados.get('tipoServico')
        )
        return servico
