# app/services/usuario/buscar_usuario_service.py
from models.usuario import Usuario

class BuscarUsuarioService:
    @staticmethod
    def executar(id_usuario):
        # Usa o método de busca por ID que está na sua Model
        return Usuario.buscar_por_id(id_usuario)