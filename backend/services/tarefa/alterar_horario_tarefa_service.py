# backend/services/tarefa/alterar_horario_tarefa_service.py
from datetime import datetime
from repositories.agenda_tarefas_repository import AgendaTarefasRepository

class AlterarHorarioTarefaService:
    @staticmethod
    def executar(id_usuario, id_tarefa, dados):
        try:
            hora = datetime.strptime(dados.get('horaTarefa') or '', '%H:%M').time()
        except ValueError:
            raise ValueError('Hora inválida. Use o formato HH:MM.')

        linha = AgendaTarefasRepository.buscar_tarefa(id_usuario, id_tarefa)
        if not linha:
            return None
        tarefa = linha[0]
        tarefa.atualizar(horaTarefa=hora)
        return tarefa