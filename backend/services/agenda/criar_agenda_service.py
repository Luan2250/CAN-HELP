from models.agenda import Agenda

class CriarAgendaService:
    @staticmethod
    def executar(dados):
        novo_agenda = Agenda(
            idContrato=dados.get('idContrato'),
            dataAgenda=dados.get('dataAgenda'),
            horaAgenda=dados.get('horaAgenda'),
            ocasiao=dados.get('ocasiao'),
            notificacao=dados.get('notificacao', True)
        )

        novo_agenda.salvar()

        return novo_agenda