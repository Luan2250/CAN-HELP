# app/controllers/usuario_controller.py
from flask import request, jsonify
from services.usuario.criar_usuario_service import CriarUsuarioService
from services.usuario.listar_usuario_service import ListarUsuariosService
from services.usuario.buscar_usuario_service import BuscarUsuarioService
from services.usuario.atualizar_usuario_service import AtualizarUsuarioService
from services.usuario.deletar_usuario_service import DeletarUsuarioService
from services.usuario.verificar_tipo_service import VerificarTipoUsuarioService

class UsuarioController:

    @staticmethod
    def criar():
        dados = request.get_json()
        try:
            usuario = CriarUsuarioService.executar(dados)
            return jsonify(usuario.to_dict()), 201
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            return jsonify({"erro": "Erro interno ao criar usuário"}), 500

    @staticmethod
    def listar():
        usuarios = ListarUsuariosService.executar()
        return jsonify([u.to_dict() for u in usuarios]), 200

    @staticmethod
    def buscar_por_id(id_usuario):
        usuario = BuscarUsuarioService.executar(id_usuario)
        if not usuario:
            return jsonify({"erro": "Usuário não encontrado"}), 404
        return jsonify(usuario.to_dict()), 200

    @staticmethod
    def atualizar(id_usuario):
        dados = request.get_json()
        usuario_atualizado = AtualizarUsuarioService.executar(id_usuario, dados)
        if not usuario_atualizado:
            return jsonify({"erro": "Usuário não encontrado"}), 404
        return jsonify(usuario_atualizado.to_dict()), 200

    @staticmethod
    def deletar(id_usuario):
        sucesso = DeletarUsuarioService.executar(id_usuario)
        if not sucesso:
            return jsonify({"erro": "Usuário não encontrado"}), 404
        return jsonify({"mensagem": "Usuário deletado com sucesso"}), 200

    @staticmethod
    def verificar_tipo(id_usuario):
        resultado = VerificarTipoUsuarioService.execute(id_usuario)
        if not resultado:
            return jsonify({"erro": "usuário não encontrado"}), 404
        return jsonify(resultado), 200