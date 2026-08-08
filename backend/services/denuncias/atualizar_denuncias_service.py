# app/services/denuncias/atualizar_denuncias_service.py
from models.denuncias import Denuncias

class AtualizarDenunciasService:
    @staticmethod
    def executar(id_denuncia, dados):
        denuncia = Denuncias.buscar_por_id(id_denuncia)
        if not denuncia:
            return None

        denuncia.atualizar(
            descricao=dados.get('descricao'),
            penalidade=dados.get('penalidade'),
            statusDenuncia=dados.get('statusDenuncia')
        )
        return denuncia
