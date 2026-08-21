# Arquivo único de rotas, no lugar dos antigos *_routes.py (um por entidade).
# Fica ao lado de app.py e extensions.py dentro de backend/.
from flask import Blueprint
from controllers.usuario_controller import UsuarioController
from controllers.perfil_controller import PerfilController
from controllers.cliente_controller import ClienteController
from controllers.cuidador_controller import CuidadorController
from controllers.contrato_controller import ContratoController
from controllers.agenda_controller import AgendaController
from controllers.tarefa_controller import TarefaController
from controllers.avaliacoes_controller import AvaliacoesController
from controllers.denuncias_controller import DenunciaController
from controllers.listaServico_controller import ListaServicosController
from controllers.itensContrato_controller import ItensContratoController

# Agenda

agenda_bp = Blueprint('agenda_bp', __name__)

agenda_bp.add_url_rule('/agendas', view_func=AgendaController.criar, methods=['POST'])
agenda_bp.add_url_rule('/agendas', view_func=AgendaController.listar, methods=['GET'])
agenda_bp.add_url_rule('/agendas/<int:idAgenda>', view_func=AgendaController.buscar_por_id, methods=['GET'])
agenda_bp.add_url_rule('/agendas/<int:idAgenda>', view_func=AgendaController.atualizar, methods=['PUT'])
agenda_bp.add_url_rule('/agendas/<int:idAgenda>', view_func=AgendaController.deletar, methods=['DELETE'])

# Avaliações

avaliacoes_bp = Blueprint('avaliacoes_bp', __name__)

avaliacoes_bp.add_url_rule('/avaliacoess', view_func=AvaliacoesController.criar, methods=['POST'])
avaliacoes_bp.add_url_rule('/avaliacoess', view_func=AvaliacoesController.listar, methods=['GET'])
avaliacoes_bp.add_url_rule('/avaliacoess/<int:idAvaliacao>', view_func=AvaliacoesController.buscar_por_id, methods=['GET'])
avaliacoes_bp.add_url_rule('/avaliacoess/<int:idAvaliacao>', view_func=AvaliacoesController.atualizar, methods=['PUT'])
avaliacoes_bp.add_url_rule('/avaliacoess/<int:idAvaliacao>', view_func=AvaliacoesController.deletar, methods=['DELETE'])

# Cliente

cliente_bp = Blueprint('cliente_bp', __name__)

cliente_bp.add_url_rule('/clientes', view_func=ClienteController.criar, methods=['POST'])
cliente_bp.add_url_rule('/clientes', view_func=ClienteController.listar, methods=['GET'])
cliente_bp.add_url_rule('/clientes/<int:id_usuario>', view_func=ClienteController.buscar_por_id, methods=['GET'])
cliente_bp.add_url_rule('/clientes/<int:id_usuario>', view_func=ClienteController.deletar, methods=['DELETE'])

# Contrato

contrato_bp = Blueprint('contrato_bp', __name__)

contrato_bp.add_url_rule('/contratos', view_func=ContratoController.criar, methods=['POST'])
contrato_bp.add_url_rule('/contratos', view_func=ContratoController.listar, methods=['GET'])
contrato_bp.add_url_rule('/clientes/<int:id_cliente>/relatorio-contratos', view_func=ContratoController.relatorio_cliente, methods=['GET'])
contrato_bp.add_url_rule('/contratos/<int:idContrato>', view_func=ContratoController.buscar_por_id, methods=['GET'])
contrato_bp.add_url_rule('/contratos/<int:idContrato>', view_func=ContratoController.atualizar, methods=['PUT'])
contrato_bp.add_url_rule('/contratos/<int:idContrato>', view_func=ContratoController.deletar, methods=['DELETE'])
contrato_bp.add_url_rule('/contratos/<int:idContrato>/status', view_func=ContratoController.atualizar_status,  methods=['PATCH'])

contrato_bp.add_url_rule('/contratos/acompanhar', view_func=ContratoController.listar_por_status, methods=['GET'])
contrato_bp.add_url_rule('/contratos/<int:idContrato>/acompanhar', view_func=ContratoController.acompanhar_status, methods=['GET'])
contrato_bp.add_url_rule('/contratos/<int:idContrato>/cancelar', view_func=ContratoController.cancelar_por_cliente, methods=['POST'])
contrato_bp.add_url_rule('/contratos/<int:idContrato>/cancelar-cuidador', view_func=ContratoController.cancelar_por_cuidador, methods=['POST'])
contrato_bp.add_url_rule('/contratos/<int:idContrato>/verificar-cancelamento', view_func=ContratoController.verificar_cancelamento, methods=['GET'])

# Cuidador

cuidador_bp = Blueprint('cuidador_bp', __name__)

cuidador_bp.add_url_rule('/cuidadores', view_func=CuidadorController.criar, methods=['POST'])
cuidador_bp.add_url_rule('/cuidadores', view_func=CuidadorController.listar, methods=['GET'])
cuidador_bp.add_url_rule('/cuidadores/busca', view_func=CuidadorController.buscar_cuidadores, methods=['GET'])
cuidador_bp.add_url_rule('/cuidadores/disponiveis', view_func=CuidadorController.buscar_disponiveis, methods=['GET'])
cuidador_bp.add_url_rule('/cuidadores/<int:id_usuario>', view_func=CuidadorController.buscar_por_id, methods=['GET'])
cuidador_bp.add_url_rule('/cuidadores/<int:id_usuario>', view_func=CuidadorController.atualizar, methods=['PUT'])
cuidador_bp.add_url_rule('/cuidadores/<int:id_usuario>', view_func=CuidadorController.deletar, methods=['DELETE'])

# Denuncias

denuncia_bp = Blueprint('denuncia_bp', __name__)

denuncia_bp.add_url_rule('/denuncias', view_func=DenunciaController.criar, methods=['POST'])
denuncia_bp.add_url_rule('/denuncias', view_func=DenunciaController.listar, methods=['GET'])
denuncia_bp.add_url_rule('/denuncias/<int:idDenuncia>', view_func=DenunciaController.buscar_por_id, methods=['GET'])
denuncia_bp.add_url_rule('/denuncias/<int:idDenuncia>', view_func=DenunciaController.atualizar, methods=['PUT'])
denuncia_bp.add_url_rule('/denuncias/<int:idDenuncia>', view_func=DenunciaController.deletar, methods=['DELETE'])

# Lista Serviço

listaServico_bp = Blueprint('listaServico_bp', __name__)

listaServico_bp.add_url_rule('/listasServicos', view_func=ListaServicosController.criar, methods=['POST'])
listaServico_bp.add_url_rule('/listasServicos', view_func=ListaServicosController.listar, methods=['GET'])
listaServico_bp.add_url_rule('/listasServicos/<int:idServico>', view_func=ListaServicosController.buscar_por_id, methods=['GET'])
listaServico_bp.add_url_rule('/listasServicos/<int:idServico>', view_func=ListaServicosController.atualizar, methods=['PUT'])
listaServico_bp.add_url_rule('/listasServicos/<int:idServico>', view_func=ListaServicosController.deletar, methods=['DELETE'])

# Perfil

perfil_bp = Blueprint('perfil_bp', __name__)

perfil_bp.add_url_rule('/perfis', view_func=PerfilController.criar, methods=['POST'])
perfil_bp.add_url_rule('/perfis', view_func=PerfilController.listar, methods=['GET'])
perfil_bp.add_url_rule('/perfis/<int:id_usuario>', view_func=PerfilController.buscar_por_id, methods=['GET'])
perfil_bp.add_url_rule('/perfis/<int:id_usuario>', view_func=PerfilController.atualizar, methods=['PUT'])
perfil_bp.add_url_rule('/perfis/<int:id_usuario>', view_func=PerfilController.deletar, methods=['DELETE'])

# Tarefa

tarefa_bp = Blueprint('tarefa_bp', __name__)

tarefa_bp.add_url_rule('/tarefas', view_func=TarefaController.criar, methods=['POST'])
tarefa_bp.add_url_rule('/tarefas', view_func=TarefaController.listar, methods=['GET'])
tarefa_bp.add_url_rule('/tarefas/<int:idTarefa>', view_func=TarefaController.buscar_por_id, methods=['GET'])
tarefa_bp.add_url_rule('/tarefas/<int:idTarefa>', view_func=TarefaController.atualizar, methods=['PUT'])
tarefa_bp.add_url_rule('/tarefas/<int:idTarefa>', view_func=TarefaController.deletar, methods=['DELETE'])

# Usuario
usuario_bp = Blueprint('usuario_bp', __name__)

usuario_bp.add_url_rule('/usuarios', view_func=UsuarioController.criar, methods=['POST'])
usuario_bp.add_url_rule('/usuarios', view_func=UsuarioController.listar, methods=['GET'])
usuario_bp.add_url_rule('/usuarios/<int:id_usuario>/tipo', view_func=UsuarioController.verificar_tipo, methods=['GET'])
usuario_bp.add_url_rule('/usuarios/<int:id_usuario>', view_func=UsuarioController.buscar_por_id, methods=['GET'])
usuario_bp.add_url_rule('/usuarios/<int:id_usuario>', view_func=UsuarioController.atualizar, methods=['PUT'])
usuario_bp.add_url_rule('/usuarios/<int:id_usuario>', view_func=UsuarioController.deletar, methods=['DELETE'])

# Itens Contrato

itensContrato_bp = Blueprint('itensContrato_bp', __name__)

itensContrato_bp.add_url_rule('/itensContrato', view_func=ItensContratoController.criar, methods=['POST'])
itensContrato_bp.add_url_rule('/itensContrato', view_func=ItensContratoController.listar, methods=['GET'])
# Busca por contrato: devolve a lista de serviços daquele contrato específico.
itensContrato_bp.add_url_rule('/itensContrato/<int:idContrato>', view_func=ItensContratoController.buscar_por_contrato, methods=['GET'])
# Delete precisa dos DOIS ids na URL, já que a PK é composta.
itensContrato_bp.add_url_rule('/itensContrato/<int:idContrato>/<int:idServico>', view_func=ItensContratoController.deletar, methods=['DELETE'])