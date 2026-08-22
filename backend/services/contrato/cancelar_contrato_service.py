from models.contrato import Contrato
from models.agenda import Agenda
from models.tarefa import Tarefa
from models.itensContrato import ItensContrato

class CancelarContratoService:

    @staticmethod
    def cancelar_por_cliente(idContrato, id_usuario_requisitante):
        contrato = Contrato.buscar_por_id(idContrato)
        if not contrato:
            raise ValueError("Contrato não encontrado")

        if id_usuario_requisitante != contrato.idCliente:
            raise ValueError("Apenas o cliente pode cancelar este contrato")

        if contrato.statusContrato not in ['pendente', 'aceito']:
            if contrato.statusContrato == 'cancelado_cliente':
                raise ValueError("Este contrato já foi cancelado pelo cliente")
            elif contrato.statusContrato == 'cancelado_cuidador':
                raise ValueError("Este contrato já foi cancelado pelo cuidador")
            elif contrato.statusContrato == 'concluido':
                raise ValueError("Não é possível cancelar um contrato concluído")
            elif contrato.statusContrato == 'recusado':
                raise ValueError("Não é possível cancelar um contrato recusado")

        contrato.atualizar(statusContrato='cancelado_cliente')

        CancelarContratoService._cancelar_agendas_tarefas(idContrato)

        return contrato

    @staticmethod
    def cancelar_por_cuidador(idContrato, id_usuario_requisitante):
        contrato = Contrato.buscar_por_id(idContrato)
        if not contrato:
            raise ValueError("Contrato não encontrado")

        if id_usuario_requisitante != contrato.idCuidador:
            raise ValueError("Apenas o cuidador pode cancelar este contrato")

        if contrato.statusContrato not in ['pendente', 'aceito']:
            if contrato.statusContrato == 'cancelado_cliente':
                raise ValueError("Este contrato já foi cancelado pelo cliente")
            elif contrato.statusContrato == 'cancelado_cuidador':
                raise ValueError("Este contrato já foi cancelado pelo cuidador")
            elif contrato.statusContrato == 'concluido':
                raise ValueError("Não é possível cancelar um contrato concluído")
            elif contrato.statusContrato == 'recusado':
                raise ValueError("Não é possível cancelar um contrato recusado")

        contrato.atualizar(statusContrato='cancelado_cuidador')

        CancelarContratoService._cancelar_agendas_tarefas(idContrato)

        return contrato

    @staticmethod
    def _cancelar_agendas_tarefas(idContrato):
        agendas = Agenda.query.filter_by(idContrato=idContrato).all()

        for agenda in agendas:
            tarefas = Tarefa.query.filter_by(idAgenda=agenda.idAgenda).all()
            for tarefa in tarefas:
                tarefa.atualizar(notificacao=False)
            agenda.atualizar(notificacao=False)

    @staticmethod
    def verificar_possibilidade_cancelamento(idContrato):
        contrato = Contrato.buscar_por_id(idContrato)
        if not contrato:
            return {"pode_cancelar": False, "motivo": "Contrato não encontrado"}

        if contrato.statusContrato == 'pendente':
            return {
                "pode_cancelar": True,
                "motivo": "Contrato pendente - pode ser cancelado",
                "quem_pode_cancelar": ["cliente", "cuidador"]
            }
        elif contrato.statusContrato == 'aceito':
            return {
                "pode_cancelar": True,
                "motivo": "Contrato aceito - pode ser cancelado antes da conclusão",
                "quem_pode_cancelar": ["cliente", "cuidador"]
            }
        elif contrato.statusContrato == 'cancelado_cliente':
            return {"pode_cancelar": False, "motivo": "Contrato já cancelado pelo cliente"}
        elif contrato.statusContrato == 'cancelado_cuidador':
            return {"pode_cancelar": False, "motivo": "Contrato já cancelado pelo cuidador"}
        elif contrato.statusContrato == 'concluido':
            return {"pode_cancelar": False, "motivo": "Contrato já concluído"}
        elif contrato.statusContrato == 'recusado':
            return {"pode_cancelar": False, "motivo": "Contrato recusado"}

        return {"pode_cancelar": False, "motivo": "Status desconhecido"}