from repositories.lembrete_repository import LembreteRepository
 
class ListarLembretesService:
    @staticmethod
    def executar(id_usuario):
        return LembreteRepository.listar_por_usuario(id_usuario)
  