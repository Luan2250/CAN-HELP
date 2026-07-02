from models.cuidador import Cuidador

class ListarCuidadorService:
    @staticmethod
    def executar():
        return Cuidador.listar_todos()