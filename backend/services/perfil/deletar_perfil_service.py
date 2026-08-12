<<<<<<< HEAD
# services/perfil/deletar_perfil_service.py
from models.usuario import Usuario
=======
from models.perfil import Perfil
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e

class DeletarPerfilService:
    @staticmethod
    def executar(id_usuario):
<<<<<<< HEAD
        usuario = Usuario.buscar_por_id(id_usuario)
        if not usuario:
            return False
        usuario.deletar()  # CASCADE cuida de Perfil, Cliente/Cuidador, Contratos, etc.
        return True

    
=======
        perfil = Perfil.buscar_por_id(id_usuario)
        if not perfil:
            return False
        
        perfil.deletar()
        return True
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e
