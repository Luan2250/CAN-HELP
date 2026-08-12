from flask import Blueprint
from controllers.avaliacoes_controller import AvaliacoesController

avaliacoes_bp = Blueprint('avaliacoes_bp', __name__)

# Vincula as rotas do blueprint aos métodos do controller
avaliacoes_bp.add_url_rule('/avaliacoess', view_func=AvaliacoesController.criar, methods=['POST'])
avaliacoes_bp.add_url_rule('/avaliacoess', view_func=AvaliacoesController.listar, methods=['GET'])
avaliacoes_bp.add_url_rule('/avaliacoess/<int:idAvaliacao>', view_func=AvaliacoesController.buscar_por_id, methods=['GET'])
avaliacoes_bp.add_url_rule('/avaliacoess/<int:idAvaliacao>', view_func=AvaliacoesController.atualizar, methods=['PUT'])
avaliacoes_bp.add_url_rule('/avaliacoess/<int:idAvaliacao>', view_func=AvaliacoesController.deletar, methods=['DELETE'])