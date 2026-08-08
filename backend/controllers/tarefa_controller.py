from flask import request, jsonify
from services.tarefa.criar_tarefa_service import CriarTarefaService
from services.tarefa.listar_tarefa_service import ListarTarefaService
from services.tarefa.buscar_tarefa_service import BuscarTarefaService
from services.tarefa.atualizar_tarefa_service import AtualizarTarefaService
from services.tarefa.deletar_tarefa_service import DeletarTarefaService

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