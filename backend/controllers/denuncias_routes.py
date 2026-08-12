
from flask import Blueprint
from controllers.denuncias_controller import DenunciaController

denuncia_bp = Blueprint('denuncia_bp', __name__)

denuncia_bp.add_url_rule('/denuncias', view_func=DenunciaController.criar, methods=['POST'])
denuncia_bp.add_url_rule('/denuncias', view_func=DenunciaController.listar, methods=['GET'])
denuncia_bp.add_url_rule('/denuncias/<int:idDenuncia>', view_func=DenunciaController.buscar_por_id, methods=['GET'])
denuncia_bp.add_url_rule('/denuncias/<int:idDenuncia>', view_func=DenunciaController.atualizar, methods=['PUT'])
denuncia_bp.add_url_rule('/denuncias/<int:idDenuncia>', view_func=DenunciaController.deletar, methods=['DELETE'])