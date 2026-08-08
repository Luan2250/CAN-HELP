#app/controllers/itensContrato_routes.py
from flask import Blueprint
from controllers.itensContrato_controller import ItensContratoController
 
itensContrato_bp = Blueprint('itensContrato_bp', __name__)
 
itensContrato_bp.add_url_rule('/itensContrato', view_func=ItensContratoController.criar, methods=['POST'])
itensContrato_bp.add_url_rule('/itensContrato', view_func=ItensContratoController.listar, methods=['GET'])
# Busca por contrato: devolve a lista de serviços daquele contrato específico.
itensContrato_bp.add_url_rule('/itensContrato/<int:idContrato>', view_func=ItensContratoController.buscar_por_contrato, methods=['GET'])
# Delete precisa dos DOIS ids na URL, já que a PK é composta.
itensContrato_bp.add_url_rule('/itensContrato/<int:idContrato>/<int:idServico>', view_func=ItensContratoController.deletar, methods=['DELETE'])
 