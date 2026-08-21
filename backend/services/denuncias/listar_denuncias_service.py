# app/services/denuncias/listar_denuncias_service.py
from models.denuncias import Denuncias

class ListarDenunciasService:
    @staticmethod
    def executar():
        return Denuncias.listar_todos()
