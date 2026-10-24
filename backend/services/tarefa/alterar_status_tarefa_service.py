from repositories.agenda_tarefas_repository import AgendaTarefasRepository

class AlterarStatusTarefaService:
    @staticmethod
    def executar(id_usuario, id_tarefa, dados):
        status = dados.get('statusTarefa')
        if status not in ('pendente', 'concluida'):
            raise ValueError("Status deve ser 'pendente' ou 'concluida'.")

        linha = AgendaTarefasRepository.buscar_tarefa(id_usuario, id_tarefa)
        if not linha:
            return None
        tarefa = linha[0]
        tarefa.atualizar(statusTarefa=status)
        return tarefa