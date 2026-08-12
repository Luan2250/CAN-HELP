from flask import Blueprint
from controllers.tarefa_controller import TarefaController

tarefa_bp = Blueprint('tarefa_bp', __name__)

# Vincula as rotas do blueprint aos métodos do controller
tarefa_bp.add_url_rule('/tarefas', view_func=TarefaController.criar, methods=['POST'])
tarefa_bp.add_url_rule('/tarefas', view_func=TarefaController.listar, methods=['GET'])
tarefa_bp.add_url_rule('/tarefas/<int:idTarefa>', view_func=TarefaController.buscar_por_id, methods=['GET'])
tarefa_bp.add_url_rule('/tarefas/<int:idTarefa>', view_func=TarefaController.atualizar, methods=['PUT'])
tarefa_bp.add_url_rule('/tarefas/<int:idTarefa>', view_func=TarefaController.deletar, methods=['DELETE'])