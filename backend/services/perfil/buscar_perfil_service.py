from models.perfil import Perfil

class BuscarPerfilService:
    @staticmethod
    def executar(id_usuario):
        return Perfil.buscar_por_id(id_usuario)