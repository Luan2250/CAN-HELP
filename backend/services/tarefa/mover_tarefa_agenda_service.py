from datetime import datetime
from repositories.agenda_tarefas_repository import AgendaTarefasRepository

class MoverTarefaAgendaService:
    @staticmethod
    def executar(id_usuario, id_tarefa, dados):
        try:
            data = datetime.strptime(dados.get('dataAgenda') or '', '%Y-%m-%d').date()
        except ValueError:
            raise ValueError('Data inválida. Use o formato AAAA-MM-DD.')

        linha = AgendaTarefasRepository.buscar_tarefa(id_usuario, id_tarefa)
        if not linha:
            return None
        tarefa, _agenda, contrato = linha

        # A tarefa só pode ir para uma agenda do MESMO contrato, na data pedida.
        destino = AgendaTarefasRepository.buscar_agenda_na_data(contrato.idContrato, data)
        if not destino:
            raise ValueError('Não há agenda deste contrato nessa data.')

        tarefa.mover_para_agenda(destino.idAgenda)
        return tarefa