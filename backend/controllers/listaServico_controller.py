# app/controllers/listaServico_controller.py
from flask import request, jsonify
from services.listaServico.criar_listaServico_service import CriarListaServicosService
from services.listaServico.listar_listaServico_service import ListarListaServicosService
from services.listaServico.buscar_listaServico_service import BuscarListaServicosService
from services.listaServico.atualizar_listaServico_service import AtualizarListaServicosService
from services.listaServico.deletar_listaServico_service import DeletarListaServicosService

class ListaServicosController:
    @staticmethod
    def criar():
        dados = request.get_json()
        servico = CriarListaServicosService.executar(dados)
        return jsonify(servico.to_dict()), 201

    @staticmethod
    def listar():
        servicos = ListarListaServicosService.executar()
        return jsonify([s.to_dict() for s in servicos]), 200

    @staticmethod
    def buscar_por_id(idServico):
        servico = BuscarListaServicosService.executar(idServico)
        if servico is None:
            return jsonify({'erro': 'Serviço não encontrado'}), 404
        return jsonify(servico.to_dict()), 200

    @staticmethod
    def atualizar(idServico):
        dados = request.get_json()
        servico = AtualizarListaServicosService.executar(idServico, dados)
        if servico is None:
            return jsonify({'erro': 'Serviço não encontrado'}), 404
        return jsonify(servico.to_dict()), 200

    @staticmethod
    def deletar(idServico):
        sucesso = DeletarListaServicosService.executar(idServico)
        if not sucesso:
            return jsonify({'erro': 'Serviço não encontrado'}), 404
        return '', 204
