# services/perfil/deletar_perfil_service.py
from models.usuario import Usuario

class DeletarPerfilService:
    @staticmethod
    def executar(id_usuario):
        usuario = Usuario.buscar_por_id(id_usuario)
        if not usuario:
            return False
        usuario.deletar()  # CASCADE cuida de Perfil, Cliente/Cuidador, Contratos, etc.
        return True

    