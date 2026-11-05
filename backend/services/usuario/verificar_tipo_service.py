from repositories.tipoUsuario_repository import TipoUsuarioRepository

class VerificarTipoUsuarioService:
    @staticmethod
    def execute(id_usuario):
        return TipoUsuarioRepository.identificar_tipo(id_usuario)