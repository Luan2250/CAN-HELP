# app/services/denuncias/deletar_denuncias_service.py
from models.denuncias import Denuncias

class DeletarDenunciasService:
    @staticmethod
    def executar(id_denuncia):
        denuncia = Denuncias.buscar_por_id(id_denuncia)
        if not denuncia:
            return False

        denuncia.deletar()
        return True
