# app/services/usuario/login_usuario_service.py
from models.usuario import Usuario

class LoginUsuarioService:
    @staticmethod
    def executar(email, senha):
        usuario = Usuario.buscar_por_email(email)

        if not usuario:
            return None  # email não cadastrado

        if not usuario.verificar_senha(senha):
            return None  # senha incorreta

        return usuario