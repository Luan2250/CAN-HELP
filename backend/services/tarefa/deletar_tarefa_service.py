from models.tarefa import Tarefa

class DeletarTarefaService:
    @staticmethod
    def executar(idTarefa):

        tarefa = Tarefa.buscar_por_id(idTarefa)
        if not tarefa:
            return False
    
        tarefa.deletar()
        return True