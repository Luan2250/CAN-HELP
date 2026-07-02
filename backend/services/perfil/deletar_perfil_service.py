from models.perfil import Perfil

class DeletarPerfilService:
    @staticmethod
    def executar(id_usuario):
        perfil = Perfil.buscar_por_id(id_usuario)
        if not perfil:
            return False
        
        perfil.deletar()
        return True