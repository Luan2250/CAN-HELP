from models.agenda import Agenda

class DeletarAgendaService:
    @staticmethod
    def executar(idAgenda):
        agenda = Agenda.buscar_por_id(idAgenda)
        if not agenda:
            return False
        
        agenda.deletar()
        return True