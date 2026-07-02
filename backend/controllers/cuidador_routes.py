from flask import Blueprint
from controllers.cuidador_controller import CuidadorController

cuidador_bp = Blueprint('cuidador_bp', __name__)

cuidador_bp.add_url_rule('/cuidadores', view_func=CuidadorController.criar, methods=['POST'])
cuidador_bp.add_url_rule('/cuidadores', view_func=CuidadorController.listar, methods=['GET'])
cuidador_bp.add_url_rule('/cuidadores/<int:id_usuario>', view_func=CuidadorController.buscar_por_id, methods=['GET'])
cuidador_bp.add_url_rule('/cuidadores/<int:id_usuario>', view_func=CuidadorController.atualizar, methods=['PUT'])
cuidador_bp.add_url_rule('/cuidadores/<int:id_usuario>', view_func=CuidadorController.deletar, methods=['DELETE'])