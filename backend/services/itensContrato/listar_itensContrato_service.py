# app/services/itensContrato/listar_itensContrato_service.py
from models.itensContrato import ItensContrato

class ListarItensContratoService:
    @staticmethod
    def executar():
        return ItensContrato.listar_todos()