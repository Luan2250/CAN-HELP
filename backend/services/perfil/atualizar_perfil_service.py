from models.perfil import Perfil

class AtualizarPerfilService:
    @staticmethod
    def executar(id_usuario, dados):
        perfil = Perfil.buscar_por_id(id_usuario)
        if not perfil:
            return None
        
        perfil.atualizar(
            fotoURL=dados.get('fotoURL'),
            nome=dados.get('nome'),
            bio=dados.get('bio'),
            cidade=dados.get('cidade'),
            estado=dados.get('estado')
        )
        return perfil