
from flask import Blueprint
from controllers.listaServico_controller import ListaServicosController

listaServico_bp = Blueprint('listaServico_bp', __name__)

listaServico_bp.add_url_rule('/listasServicos', view_func=ListaServicosController.criar, methods=['POST'])
listaServico_bp.add_url_rule('/listasServicos', view_func=ListaServicosController.listar, methods=['GET'])
listaServico_bp.add_url_rule('/listasServicos/<int:idServico>', view_func=ListaServicosController.buscar_por_id, methods=['GET'])
listaServico_bp.add_url_rule('/listasServicos/<int:idServico>', view_func=ListaServicosController.atualizar, methods=['PUT'])
listaServico_bp.add_url_rule('/listasServicos/<int:idServico>', view_func=ListaServicosController.deletar, methods=['DELETE'])