# app/services/usuario/atualizar_usuario_service.py
from models.usuario import Usuario

class AtualizarUsuarioService:
    @staticmethod
    def executar(id_usuario, dados):
        # 1. Busca o usuário existente através da Model
        usuario = Usuario.buscar_por_id(id_usuario)
        if not usuario:
            return None
        
        # 2. Passa os dados novos para o método atualizar() da própria Model
        usuario.atualizar(
            endereco=dados.get('endereco'),
            telefone=dados.get('telefone'),
            email=dados.get('email'),
            senha=dados.get('senha')
        )
        return usuario