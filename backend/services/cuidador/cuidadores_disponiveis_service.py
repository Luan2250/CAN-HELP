from repositories.cuidadoresDisponiveis_repository import CuidadoresDisponiveisRepository

class CuidadoresDisponiveisService:
    @staticmethod
    def execute(data):
        if not data:
            raise ValueError("A data é obrigatória para buscar disponibilidade.")
        return CuidadoresDisponiveisRepository.buscar_disponiveis(data)