from repositories.agenda_tarefas_repository import AgendaTarefasRepository

class ExcluirTarefaAgendaService:
    @staticmethod
    def executar(id_usuario, id_tarefa):
        linha = AgendaTarefasRepository.buscar_tarefa(id_usuario, id_tarefa)
        if not linha:
            return False
        linha[0].deletar()
        return True