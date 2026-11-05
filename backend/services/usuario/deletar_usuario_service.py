# app/services/usuario/deletar_usuario_service.py
from models.usuario import Usuario

class DeletarUsuarioService:
    @staticmethod
    def executar(id_usuario):
        # 1. Localiza o registro
        usuario = Usuario.buscar_por_id(id_usuario)
        if not usuario:
            return False
        
        # 2. Invoca o método de exclusão da Model (Active Record)
        usuario.deletar()
        return True