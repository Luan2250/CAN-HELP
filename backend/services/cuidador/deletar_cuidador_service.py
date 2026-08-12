from models.cuidador import Cuidador

class DeletarCuidadorService:
    @staticmethod
    def executar(id_usuario):
        cuidador = Cuidador.buscar_por_id(id_usuario)
        if not cuidador:
            return False
        
        cuidador.deletar()
        return True