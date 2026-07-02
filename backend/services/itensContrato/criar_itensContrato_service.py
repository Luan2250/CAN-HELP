# app/services/itensContrato/criar_itensContrato_service.py
from models.itensContrato import ItensContrato

class CriarItensContratoService:
    @staticmethod
    def executar(dados):
        novo_itensContrato = ItensContrato(
            id_contrato = dados.get('idContrato'),
            id_servico = dados.get('idServico')
        )
        
        # Chama o método salvar que criamos na Model (Active Record)
        novo_itensContrato.salvar()
        
        return novo_itensContrato