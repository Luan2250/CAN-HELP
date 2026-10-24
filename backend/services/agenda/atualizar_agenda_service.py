from models.agenda import Agenda

class AtualizarAgendaService:
    @staticmethod
    def executar(idAgenda, dados):
        
        agenda = Agenda.buscar_por_id(idAgenda)
        if not agenda:
            return None
        
        # 2. Passa os dados novos para o método atualizar() da própria Model
        agenda.atualizar(
            dataAgenda=dados.get('dataAgenda'),
            horaAgenda=dados.get('horaAgenda'),
            ocasiao=dados.get('ocasiao'),
            notificacao=dados.get('notificacao')
        )
        return agenda