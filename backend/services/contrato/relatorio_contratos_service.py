from repositories.RelatorioContratos_repository import RelatorioContratoRepository

class RelatorioContratosService:
    @staticmethod
    def execute(id_cliente):
        if not id_cliente:
            raise ValueError("O ID do cliente é obrigatório para gerar o relatório.")
            
        return RelatorioContratoRepository.relatorio_contratos(id_cliente)
