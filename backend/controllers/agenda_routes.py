from flask import Blueprint
from controllers.agenda_controller import AgendaController

agenda_bp = Blueprint('agenda_bp', __name__)

# Vincula as rotas do blueprint aos métodos do controller
agenda_bp.add_url_rule('/agendas', view_func=AgendaController.criar, methods=['POST'])
agenda_bp.add_url_rule('/agendas', view_func=AgendaController.listar, methods=['GET'])
agenda_bp.add_url_rule('/agendas/<int:idAgenda>', view_func=AgendaController.buscar_por_id, methods=['GET'])
agenda_bp.add_url_rule('/agendas/<int:idAgenda>', view_func=AgendaController.atualizar, methods=['PUT'])
agenda_bp.add_url_rule('/agendas/<int:idAgenda>', view_func=AgendaController.deletar, methods=['DELETE'])