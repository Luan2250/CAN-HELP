from flask import Blueprint
from controllers.cliente_controller import ClienteController

cliente_bp = Blueprint('cliente_bp', __name__)

cliente_bp.add_url_rule('/clientes', view_func=ClienteController.criar, methods=['POST'])
cliente_bp.add_url_rule('/clientes', view_func=ClienteController.listar, methods=['GET'])
cliente_bp.add_url_rule('/clientes/<int:id_usuario>', view_func=ClienteController.buscar_por_id, methods=['GET'])
cliente_bp.add_url_rule('/clientes/<int:id_usuario>', view_func=ClienteController.deletar, methods=['DELETE'])