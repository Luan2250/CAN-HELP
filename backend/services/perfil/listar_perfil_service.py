from models.perfil import Perfil

class ListarPerfilService:
    @staticmethod
    def executar():
        return Perfil.listar_todos()