# app/services/usuario/listar_usuarios_service.py
from models.usuario import Usuario

class ListarUsuariosService:
    @staticmethod
    def executar():
        # Usa o método estático que você já criou na sua Model
        return Usuario.listar_todos()