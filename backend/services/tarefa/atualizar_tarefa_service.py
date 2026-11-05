from models.tarefa import Tarefa

class AtualizarTarefaService:
    @staticmethod
    def executar(idTarefa, dados):
        tarefa = Tarefa.buscar_por_id(idTarefa)
        if not tarefa:
            return None

        tarefa.atualizar(
            descricao=dados.get('descricao'),
            horaTarefa=dados.get('horaTarefa'),
            notificacao=dados.get('notificacao'),
            statusTarefa=dados.get('statusTarefa')
        )
        return tarefa