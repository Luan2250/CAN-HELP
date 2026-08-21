# app/controllers/contrato_controller.py
from flask import request, jsonify
from services.contrato.criar_contrato_service import CriarContratoService
from services.contrato.listar_contrato_service import ListarContratoService
from services.contrato.buscar_contrato_service import BuscarContratoService
from services.contrato.atualizar_contrato_service import AtualizarContratoService
from services.contrato.deletar_contrato_service import DeletarContratoService
from services.contrato.relatorio_contratos_service import RelatorioContratosService
from services.contrato.atualizar_status_contrato_service import AtualizarStatusContratoService
from services.contrato.listar_contratos_por_status_service import ListarContratosPorStatusService
from services.contrato.cancelar_contrato_service import CancelarContratoService


class ContratoController:

    @staticmethod
    def criar():
        dados = request.get_json()
        
        try:
            contrato = CriarContratoService.executar(dados)
            
            # Buscar serviços vinculados
            from models.itensContrato import ItensContrato
            itens = ItensContrato.buscar_por_contrato(contrato.idContrato)
            
            return jsonify({
                "mensagem": "Solicitação de ajuda criada com sucesso",
                "contrato": contrato.to_dict(),
                "servicos": [item.to_dict() for item in itens]
            }), 201
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            import traceback
            traceback.print_exc()
            return jsonify({"erro": "Erro interno ao criar solicitação"}), 500

    @staticmethod
    def listar():
        contratos = ListarContratoService.executar()
        return jsonify([c.to_dict() for c in contratos]), 200

    @staticmethod
    def listar_solicitacoes():
        id_usuario = request.args.get('id_usuario', default=None, type=int)
        tipo_usuario = request.args.get('tipo_usuario', default=None)
        status = request.args.get('status', default=None)
        
        try:
            contratos = CriarContratoService.listar_solicitacoes(
                id_usuario=id_usuario,
                tipo_usuario=tipo_usuario,
                status=status
            )
            return jsonify([c.to_dict() for c in contratos]), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400

    @staticmethod
    def buscar_por_id(idContrato):
        contrato = BuscarContratoService.executar(idContrato)
        if not contrato:
            return jsonify({"erro": "Contrato não encontrado"}), 404
        return jsonify(contrato.to_dict()), 200

    @staticmethod
    def atualizar(idContrato):
        dados = request.get_json()
        
        try:
            contrato = AtualizarContratoService.executar(idContrato, dados)
            if not contrato:
                return jsonify({"erro": "Contrato não encontrado"}), 404
            return jsonify(contrato.to_dict()), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400

    @staticmethod
    def deletar(idContrato):
        sucesso = DeletarContratoService.executar(idContrato)
        if not sucesso:
            return jsonify({"erro": "Contrato não encontrado"}), 404
        return jsonify({"mensagem": "Contrato deletado com sucesso"}), 200

    @staticmethod
    def relatorio_cliente(id_cliente):
        #Endpoint para gerar relatório de contratos do cliente
        try:
            resultado = RelatorioContratosService.execute(id_cliente)
            return jsonify(resultado), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            return jsonify({"erro": "Erro interno ao gerar relatório"}), 500

    @staticmethod
    def atualizar_status(idContrato):
        #Endpoint para atualizar o status de um contrato
        dados = request.get_json()
        novo_status = dados.get('statusContrato')
        
        if not novo_status:
            return jsonify({"erro": "Status é obrigatório"}), 400
        
        try:
            contrato = AtualizarStatusContratoService.executar(idContrato, novo_status)
            return jsonify(contrato.to_dict()), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            return jsonify({"erro": "Erro interno ao atualizar status"}), 500

    @staticmethod
    def listar_por_status():
        #Endpoint para listar contratos por status e/ou usuário
        status = request.args.get('status', default=None)
        id_usuario = request.args.get('id_usuario', default=None, type=int)
        tipo_usuario = request.args.get('tipo_usuario', default=None)
        
        try:
            contratos = ListarContratosPorStatusService.executar(
                status=status,
                id_usuario=id_usuario,
                tipo_usuario=tipo_usuario
            )
            return jsonify([c.to_dict() for c in contratos]), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            return jsonify({"erro": "Erro interno ao listar contratos"}), 500

    @staticmethod
    def acompanhar_status(idContrato):
        #Endpoint para acompanhar o status de um contrato específico
        contrato = BuscarContratoService.executar(idContrato)
        if not contrato:
            return jsonify({"erro": "Contrato não encontrado"}), 404
        
        return jsonify({
            "idContrato": contrato.idContrato,
            "status": contrato.statusContrato,
            "dataContrato": contrato.dataContrato.isoformat() if contrato.dataContrato else None,
            "dataAtendimento": contrato.dataAtendimento.isoformat() if contrato.dataAtendimento else None,
            "nomeAuxiliado": contrato.nomeAuxiliado,
            "localizacao": contrato.localizacao,
            "valorFinal": float(contrato.valorFinal),
            "informacoes_adicionais": {
                "pode_cancelar": contrato.statusContrato in ['pendente', 'aceito'],
                "pode_concluir": contrato.statusContrato == 'aceito',
                "mensagem_status": AtualizarStatusContratoService._mensagem_status(contrato.statusContrato)
            }
        }), 200

    @staticmethod
    def cancelar_por_cliente(idContrato):
        #Endpoint para cliente cancelar contrato
        dados = request.get_json()
        id_usuario_requisitante = dados.get('id_usuario_requisitante')
        
        if not id_usuario_requisitante:
            return jsonify({"erro": "ID do usuário é obrigatório"}), 400
        
        try:
            contrato = CancelarContratoService.cancelar_por_cliente(
                idContrato, 
                int(id_usuario_requisitante)
            )
            return jsonify({
                "mensagem": "Contrato cancelado com sucesso",
                "contrato": contrato.to_dict()
            }), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            return jsonify({"erro": "Erro interno ao cancelar contrato"}), 500
    
    @staticmethod
    def cancelar_por_cuidador(idContrato):
        #Endpoint para cuidador cancelar contrato
        dados = request.get_json()
        id_usuario_requisitante = dados.get('id_usuario_requisitante')
        
        if not id_usuario_requisitante:
            return jsonify({"erro": "ID do usuário é obrigatório"}), 400
        
        try:
            contrato = CancelarContratoService.cancelar_por_cuidador(
                idContrato, 
                int(id_usuario_requisitante)
            )
            return jsonify({
                "mensagem": "Contrato cancelado com sucesso",
                "contrato": contrato.to_dict()
            }), 200
        except ValueError as e:
            return jsonify({"erro": str(e)}), 400
        except Exception as e:
            return jsonify({"erro": "Erro interno ao cancelar contrato"}), 500
    
    @staticmethod
    def verificar_cancelamento(idContrato):
        #Endpoint para verificar se contrato pode ser cancelado
        try:
            resultado = CancelarContratoService.verificar_possibilidade_cancelamento(idContrato)
            return jsonify(resultado), 200
        except Exception as e:
            return jsonify({"erro": "Erro interno ao verificar cancelamento"}), 500