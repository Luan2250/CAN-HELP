# app/services/itensContrato/buscar_itensContrato_service.py
from models.itensContrato import ItensContrato

class BuscarItensContratoService:
    @staticmethod
    def executar(id_contrato):
        return ItensContrato.buscar_por_contrato(id_contrato)