from repositories.filtrarCuidadores_repository import FiltrarCuidadorRepository

class FiltrarCuidadoresService:
    @staticmethod
    def execute(cidade, ordenar_por_nota):
        cidade_filtrada = cidade.strip() if cidade else None
        
        return FiltrarCuidadorRepository.filtrar_cuidadores(cidade_filtrada, ordenar_por_nota)
