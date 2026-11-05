from flask import request, jsonify, g
from controllers.auth_decorator import exigir_autenticacao
from services.tarefa.criar_tarefa_service import CriarTarefaService
from services.tarefa.listar_tarefa_service import ListarTarefaService
from services.tarefa.buscar_tarefa_service import BuscarTarefaService
from services.tarefa.atualizar_tarefa_service import AtualizarTarefaService
from services.tarefa.deletar_tarefa_service import DeletarTarefaService
from services.tarefa.consultar_agenda_tarefa_service import ConsultarAgendaTarefasService
from services.tarefa.alterar_status_tarefa_service import AlterarStatusTarefaService
from services.tarefa.alterar_horario_tarefa_service import AlterarHorarioTarefaService
from services.tarefa.mover_tarefa_agenda_service import MoverTarefaAgendaService
from services.tarefa.excluir_tarefa_agenda_service import ExcluirTarefaAgendaService

class TarefaController:
    
    @staticmethod
    def criar():
        dados = request.get_json()
        tarefa = CriarTarefaService.executar(dados)
        return jsonify(tarefa.to_dict()), 201

    @staticmethod
    def listar():
        tarefas = ListarTarefaService.executar()
        return jsonify([u.to_dict() for u in tarefas]), 200

    @staticmethod
    def buscar_por_id(idTarefa):
        tarefa = BuscarTarefaService.executar(idTarefa)
        if not tarefa:
            return jsonify({"erro": "Tarefa não encontrada"}), 404
        return jsonify(tarefa.to_dict()), 200

    @staticmethod
    def atualizar(idTarefa):
        dados = request.get_json()
        tarefa_atualizado = AtualizarTarefaService.executar(idTarefa, dados)
        if not tarefa_atualizado:
            return jsonify({"erro": "Tarefa não encontrada"}), 404
        return jsonify(tarefa_atualizado.to_dict()), 200

    @staticmethod
    def deletar(idTarefa):
        sucesso = DeletarTarefaService.executar(idTarefa)
        if not sucesso:
            return jsonify({"erro": "Tarefa não encontrada"}), 404
        return jsonify({"mensagem": "Tarefa deletada com sucesso"}), 200

    # ---- RF13: agenda do usuário autenticado (o usuário vem do token) ----

    @staticmethod
    @exigir_autenticacao
    def minha_agenda():
        try:
            itens = ConsultarAgendaTarefasService.executar(
                g.id_usuario,
                request.args.get('inicio'),
                request.args.get('fim'),
                request.args.get('status'))
            return jsonify(itens), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400

    @staticmethod
    @exigir_autenticacao
    def alterar_status(idTarefa):
        dados = request.get_json(silent=True) or {}
        try:
            tarefa = AlterarStatusTarefaService.executar(g.id_usuario, idTarefa, dados)
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        if not tarefa:
            return jsonify({"erro": "Tarefa não encontrada"}), 404
        return jsonify(tarefa.to_dict()), 200

    @staticmethod
    @exigir_autenticacao
    def alterar_horario(idTarefa):
        dados = request.get_json(silent=True) or {}
        try:
            tarefa = AlterarHorarioTarefaService.executar(g.id_usuario, idTarefa, dados)
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        if not tarefa:
            return jsonify({"erro": "Tarefa não encontrada"}), 404
        return jsonify(tarefa.to_dict()), 200

    @staticmethod
    @exigir_autenticacao
    def mover_agenda(idTarefa):
        dados = request.get_json(silent=True) or {}
        try:
            tarefa = MoverTarefaAgendaService.executar(g.id_usuario, idTarefa, dados)
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        if not tarefa:
            return jsonify({"erro": "Tarefa não encontrada"}), 404
        return jsonify(tarefa.to_dict()), 200

    @staticmethod
    @exigir_autenticacao
    def excluir_da_agenda(idTarefa):
        if not ExcluirTarefaAgendaService.executar(g.id_usuario, idTarefa):
            return jsonify({"erro": "Tarefa não encontrada"}), 404
        return jsonify({"mensagem": "Tarefa excluída com sucesso"}), 200