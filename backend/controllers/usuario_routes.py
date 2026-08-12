from flask import Blueprint
from controllers.usuario_controller import UsuarioController

usuario_bp = Blueprint('usuario_bp', __name__)

# Vincula as rotas do blueprint aos métodos do controller
usuario_bp.add_url_rule('/usuarios', view_func=UsuarioController.criar, methods=['POST'])
usuario_bp.add_url_rule('/usuarios', view_func=UsuarioController.listar, methods=['GET'])
usuario_bp.add_url_rule('/usuarios/<int:id_usuario>/tipo', view_func=UsuarioController.verificar_tipo, methods=['GET'])
usuario_bp.add_url_rule('/usuarios/<int:id_usuario>', view_func=UsuarioController.buscar_por_id, methods=['GET'])
usuario_bp.add_url_rule('/usuarios/<int:id_usuario>', view_func=UsuarioController.atualizar, methods=['PUT'])
usuario_bp.add_url_rule('/usuarios/<int:id_usuario>', view_func=UsuarioController.deletar, methods=['DELETE'])