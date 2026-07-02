# app/services/perfil/criar_perfil_service.py
from models.perfil import Perfil

class CriarPerfilService:
    @staticmethod
    def executar(dados):
        novo_perfil = Perfil(
            idUsuario=dados.get('idUsuario'),
            fotoURL=dados.get('fotoURL'),
            nome=dados.get('nome'),
            bio=dados.get('bio'),
            cidade=dados.get('cidade'),
            estado=dados.get('estado')
        )
        novo_perfil.salvar()
        return novo_perfil