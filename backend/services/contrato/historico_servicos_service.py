from repositories.historicoServicos_repository import HistoricoServicosRepository

class HistoricoServicosService:
    @staticmethod
    def execute(id_usuario):
        if not id_usuario:
            raise ValueError("O ID do usuário é obrigatório para consultar o histórico.")

        return HistoricoServicosRepository.historico_servicos(id_usuario)
