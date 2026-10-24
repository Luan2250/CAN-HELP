# app/services/listaServico/listar_listaServico_service.py
from models.listaServicos import ListaServicos

class ListarListaServicosService:
    @staticmethod
    def executar():
        return ListaServicos.listar_todos()
