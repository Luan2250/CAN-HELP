from models.tarefa import Tarefa

class BuscarTarefaService:
    @staticmethod
    def executar(idTarefa):
        return Tarefa.buscar_por_id(idTarefa)