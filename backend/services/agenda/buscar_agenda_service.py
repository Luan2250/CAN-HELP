from models.agenda import Agenda

class BuscarAgendaService:
    @staticmethod
    def executar(idAgenda):
        return Agenda.buscar_por_id(idAgenda)