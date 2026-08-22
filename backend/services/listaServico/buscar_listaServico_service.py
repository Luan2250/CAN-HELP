# app/services/listaServico/buscar_listaServico_service.py
from models.listaServicos import ListaServicos

class BuscarListaServicosService:
    @staticmethod
    def executar(id_servico):
        return ListaServicos.buscar_por_id(id_servico)
