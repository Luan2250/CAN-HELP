# app/controllers/agenda_controller.py
from flask import request, jsonify
from services.agenda.criar_agenda_service import CriarAgendaService
from services.agenda.listar_agenda_service import ListarAgendaService
from services.agenda.buscar_agenda_service import BuscarAgendaService
from services.agenda.atualizar_agenda_service import AtualizarAgendaService
from services.agenda.deletar_agenda_service import DeletarAgendaService

class AgendaController:
    
    @staticmethod
    def criar():
        dados = request.get_json()
        agenda = CriarAgendaService.executar(dados)
        return jsonify(agenda.to_dict()), 201

    @staticmethod
    def listar():
        # Executa o serviço que busca todos os usuários
        agendas = ListarAgendaService.executar()
        # Converte a lista de objetos Model para uma lista de dicionários JSON
        return jsonify([u.to_dict() for u in agendas]), 200

    @staticmethod
    def buscar_por_id(idAgenda):
        agenda = BuscarAgendaService.executar(idAgenda)
        if not agenda:
            return jsonify({"erro": "Agenda não encontrado"}), 404
        return jsonify(agenda.to_dict()), 200

    @staticmethod
    def atualizar(idAgenda):
        dados = request.get_json()
        agenda_atualizada = AtualizarAgendaService.executar(idAgenda, dados)
        if not agenda_atualizada:
            return jsonify({"erro": "Agenda não encontrado"}), 404
        return jsonify(agenda_atualizada.to_dict()), 200

    @staticmethod
    def deletar(idAgenda):
        sucesso = DeletarAgendaService.executar(idAgenda)
        if not sucesso:
            return jsonify({"erro": "Agenda não encontrado"}), 404
        return jsonify({"mensagem": "Agenda deletado com sucesso"}), 200