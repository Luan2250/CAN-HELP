from flask import request, jsonify, g
from controllers.auth_decorator import exigir_autenticacao
from services.lembrete.criar_lembrete_service import CriarLembreteService
from services.lembrete.listar_lembretes_service import ListarLembretesService
 
class LembreteController:
 
    @staticmethod
    @exigir_autenticacao
    def criar():
        dados = request.get_json(silent=True) or {}
        try:
            lembrete = CriarLembreteService.executar(g.id_usuario, dados)
            return jsonify(lembrete.to_dict()), 201
        except ValueError as e:
            return jsonify({'erro': str(e)}), 400
 
    @staticmethod
    @exigir_autenticacao
    def listar():
        lembretes = ListarLembretesService.executar(g.id_usuario)
        return jsonify([l.to_dict() for l in lembretes]), 200