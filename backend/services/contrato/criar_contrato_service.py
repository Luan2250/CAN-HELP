# app/services/contrato/criar_contrato_service.py
from models.contrato import Contrato

class CriarContratoService:
    @staticmethod
    def executar(dados):
        novo_contrato = Contrato(
            idContrato=dados.get('idContrato'), # Vincula ao ID do usuário que já existe
            dataContrato=dados.get('dataContrato'),
            dataAtendimento=dados.get('dataAtendimento'),
            localizacao=dados.get('localizacao'),
            nomeAuxiliado=dados.get('nomeAuxiliado'),
            statusContrato=dados.get('statusContrato'),
            valorFinal=dados.get('valorFinal')
        )
        novo_contrato.salvar()
        return novo_contrato

class ListarContratoService:
    @staticmethod
    def executar():
        return Contrato.listar_todos()