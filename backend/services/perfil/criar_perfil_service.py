# app/services/perfil/criar_perfil_service.py
from models.perfil import Perfil

class CriarPerfilService:
    @staticmethod
    def executar(dados):
        novo_perfil = Perfil(
            idUsuario=dados.get('idUsuario'), # Vincula ao ID do usuário que já existe
            fotoURL=dados.get('fotoURL'),
            nome=dados.get('nome'),
            bio=dados.get('bio'),
            cidade=dados.get('cidade'),
            estado=dados.get('estado')
        )
        novo_perfil.salvar()
        return novo_perfil
        from models.perfil import Perfil

class ListarPerfilService:
    @staticmethod
    def executar():
        return Perfil.listar_todos()