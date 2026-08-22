# app/controllers/cuidador_controller.py
from flask import request, jsonify
from services.cuidador.criar_cuidador_service import CriarCuidadorService
from services.cuidador.listar_cuidador_service import ListarCuidadorService
from services.cuidador.buscar_cuidador_service import BuscarCuidadorService
from services.cuidador.atualizar_cuidador_service import AtualizarCuidadorService
from services.cuidador.deletar_cuidador_service import DeletarCuidadorService
from services.cuidador.filtrar_cuidadores_service import FiltrarCuidadoresService
from services.cuidador.cuidadores_disponiveis_service import CuidadoresDisponiveisService

class CuidadorController:

    @staticmethod
    def criar():
        dados = request.get_json()
        try:
            cuidador = CriarCuidadorService.executar(dados)
            return jsonify(cuidador.to_dict()), 201
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            return jsonify({"erro": "Erro interno ao criar cuidador"}), 500

    @staticmethod
    def listar():
        cuidadores = ListarCuidadorService.executar()
        return jsonify([p.to_dict() for p in cuidadores]), 200

    @staticmethod
    def buscar_por_id(id_usuario):
        cuidador = BuscarCuidadorService.executar(id_usuario)
        if not cuidador:
            return jsonify({"erro": "cuidador não encontrado"}), 404
        return jsonify(cuidador.to_dict()), 200

    @staticmethod
    def atualizar(id_usuario):
        dados = request.get_json()
        cuidador_atualizado = AtualizarCuidadorService.executar(id_usuario, dados)
        if not cuidador_atualizado:
            return jsonify({"erro": "cuidador não encontrado"}), 404
        return jsonify(cuidador_atualizado.to_dict()), 200

    @staticmethod
    def deletar(id_usuario):
        sucesso = DeletarCuidadorService.executar(id_usuario)
        if not sucesso:
            return jsonify({"erro": "cuidador não encontrado"}), 404
        return jsonify({"mensagem": "cuidador deletado com sucesso"}), 200

    @staticmethod
    def buscar_cuidadores():
        cidade = request.args.get('cidade', default=None)
        ordem_nota_raw = request.args.get('ordem_nota', default='false')

        ordenar_por_nota = ordem_nota_raw.lower() == 'true'

        try:
            resultado = FiltrarCuidadoresService.execute(cidade, ordenar_por_nota)
            return jsonify(resultado), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 400

    @staticmethod
    def buscar_disponiveis():
        data = request.args.get('data', default=None)
        try:
            resultado = CuidadoresDisponiveisService.execute(data)
            return jsonify(resultado), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400