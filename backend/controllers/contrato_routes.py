from flask import Blueprint
from controllers.contrato_controller import ContratoController

contrato_bp = Blueprint('contrato_bp', __name__)

contrato_bp.add_url_rule('/contratos', view_func=ContratoController.criar, methods=['POST'])
contrato_bp.add_url_rule('/contratos', view_func=ContratoController.listar, methods=['GET'])
contrato_bp.add_url_rule('/contratos/<int:id_usuario>', view_func=ContratoController.buscar_por_id, methods=['GET'])
contrato_bp.add_url_rule('/contratos/<int:id_usuario>', view_func=ContratoController.atualizar, methods=['PUT'])
contrato_bp.add_url_rule('/contratos/<int:id_usuario>', view_func=ContratoController.deletar, methods=['DELETE'])