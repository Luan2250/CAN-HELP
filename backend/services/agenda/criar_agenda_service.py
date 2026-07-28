from models.agenda import Agenda

class CriarAgendaService:
    @staticmethod
    def executar(dados):
        novo_agenda = Agenda(
            dataAgenda=dados.get('dataAgenda'),
            horaAgenda=dados.get('horaAgenda'),
            ocasiao=dados.get('ocasiao'),
            notificacao=dados.get('notificacao')
        )
        
        novo_agenda.salvar()
        
        return novo_agenda