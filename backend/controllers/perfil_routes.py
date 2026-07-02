
from flask import Blueprint
from controllers.perfil_controller import PerfilController

perfil_bp = Blueprint('perfil_bp', __name__)

perfil_bp.add_url_rule('/perfis', view_func=PerfilController.criar, methods=['POST'])
 perfil_bp.add_url_rule('/perfis', view_func=PerfilController.listar, methods=['GET'])
 perfil_bp.add_url_rule('/perfis/<int:id_usuario>', view_func=PerfilController.buscar_por_id, methods=['GET'])
 perfil_bp.add_url_rule('/perfis/<int:id_usuario>', view_func=PerfilController.atualizar, methods=['PUT'])
 perfil_bp.add_url_rule('/perfis/<int:id_usuario>', view_func=PerfilController.deletar, methods=['DELETE'])