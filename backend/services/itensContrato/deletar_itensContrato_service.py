# app/services/itensContrato/deletar_itensContrato_service.py
from models.itensContrato import ItensContrato

class DeletarItensContratoService:
    @staticmethod
    def executar(id_contrato, id_servico):
        item = ItensContrato.buscar_por_id(id_contrato, id_servico)
        if not item:
            return False

        item.deletar()
        return True