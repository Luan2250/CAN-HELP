from models.agenda import Agenda

class ListarAgendaService:
    @staticmethod
    def executar():
        return Agenda.listar_todos()