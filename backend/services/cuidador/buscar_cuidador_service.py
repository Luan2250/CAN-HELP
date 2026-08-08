from models.cuidador import Cuidador

class BuscarCuidadorService:
    @staticmethod
    def executar(id_usuario):
        return Cuidador.buscar_por_id(id_usuario)