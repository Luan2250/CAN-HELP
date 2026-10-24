
from sqlalchemy import or_
from extensions import db
from models.tarefa import Tarefa
from models.agenda import Agenda
from models.contrato import Contrato

class AgendaTarefasRepository:

    @staticmethod
    def _base(id_usuario):
        """Tarefa + Agenda + Contrato, só dos contratos em que o usuário é cliente ou cuidador."""
        return (db.session.query(Tarefa, Agenda, Contrato)
                .join(Agenda, Tarefa.idAgenda == Agenda.idAgenda)
                .join(Contrato, Agenda.idContrato == Contrato.idContrato)
                .filter(or_(Contrato.idCliente == id_usuario, Contrato.idCuidador == id_usuario)))

    @staticmethod
    def listar(id_usuario, inicio=None, fim=None, status=None):
        consulta = AgendaTarefasRepository._base(id_usuario)
        if inicio:
            consulta = consulta.filter(Agenda.dataAgenda >= inicio)
        if fim:
            consulta = consulta.filter(Agenda.dataAgenda <= fim)
        if status:
            consulta = consulta.filter(Tarefa.statusTarefa == status)
        return consulta.order_by(Agenda.dataAgenda, Tarefa.horaTarefa).all()

    @staticmethod
    def buscar_tarefa(id_usuario, id_tarefa):
        """Retorna (tarefa, agenda, contrato) se a tarefa for do usuário; senão None."""
        return AgendaTarefasRepository._base(id_usuario).filter(Tarefa.idTarefa == id_tarefa).first()

    @staticmethod
    def buscar_agenda_na_data(id_contrato, data):
        return (Agenda.query
                .filter_by(idContrato=id_contrato, dataAgenda=data)
                .order_by(Agenda.horaAgenda)
                .first())