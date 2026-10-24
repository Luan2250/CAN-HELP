from datetime import datetime
from repositories.agenda_tarefas_repository import AgendaTarefasRepository

class ConsultarAgendaTarefasService:
    @staticmethod
    def executar(id_usuario, inicio=None, fim=None, status=None):
        try:
            data_inicio = datetime.strptime(inicio, '%Y-%m-%d').date() if inicio else None
            data_fim = datetime.strptime(fim, '%Y-%m-%d').date() if fim else None
        except ValueError:
            raise ValueError('Datas devem estar no formato AAAA-MM-DD.')
        if data_inicio and data_fim and data_inicio > data_fim:
            raise ValueError('A data inicial não pode ser maior que a final.')
        if status and status not in ('pendente', 'concluida'):
            raise ValueError("Status deve ser 'pendente' ou 'concluida'.")

        linhas = AgendaTarefasRepository.listar(id_usuario, data_inicio, data_fim, status)
        return [{
            **tarefa.to_dict(),
            'dataAgenda': agenda.dataAgenda.isoformat(),
            'ocasiao': agenda.ocasiao,
            'idContrato': contrato.idContrato,
            'nomeAuxiliado': contrato.nomeAuxiliado
        } for tarefa, agenda, contrato in linhas]