# app/services/denuncias/buscar_denuncias_service.py
from models.denuncias import Denuncias

class BuscarDenunciasService:
    @staticmethod
    def executar(id_denuncia):
        return Denuncias.buscar_por_id(id_denuncia)
