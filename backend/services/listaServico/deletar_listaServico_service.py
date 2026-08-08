# app/services/listaServico/deletar_listaServico_service.py
from models.listaServicos import ListaServicos

class DeletarListaServicosService:
    @staticmethod
    def executar(id_servico):
        servico = ListaServicos.buscar_por_id(id_servico)
        if not servico:
            return False

        servico.deletar()
        return True
