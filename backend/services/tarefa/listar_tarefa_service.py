from models.tarefa import Tarefa

class ListarTarefaService:
    @staticmethod
    def executar():
        return Tarefa.listar_todos()