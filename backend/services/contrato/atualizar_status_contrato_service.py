# app/services/contrato/atualizar_status_contrato_service.py
from models.contrato import Contrato

class AtualizarStatusContratoService:
    # Transições válidas
    TRANSICOES_VALIDAS = {
        'pendente': ['aceito', 'recusado', 'cancelado_cliente'],
        'aceito': ['concluido', 'cancelado_cliente', 'cancelado_cuidador'],
        'recusado': [],  
        'cancelado_cliente': [],  
        'cancelado_cuidador': [],  
        'concluido': []  
    }

    @staticmethod
    def executar(idContrato, novo_status):
        contrato = Contrato.buscar_por_id(idContrato)
        if not contrato:
            raise ValueError("Contrato não encontrado")
        
        status_validos = ['pendente', 'aceito', 'recusado', 'cancelado_cliente', 'cancelado_cuidador', 'concluido']
        
        if novo_status not in status_validos:
            raise ValueError(f"Status inválido. Use um dos: {', '.join(status_validos)}")
        
        if contrato.statusContrato == novo_status:
            raise ValueError(f"Contrato já está no status '{novo_status}'")
        
        status_atual = contrato.statusContrato
        transicoes_permitidas = AtualizarStatusContratoService.TRANSICOES_VALIDAS.get(status_atual, [])
        
        if novo_status not in transicoes_permitidas:
            raise ValueError(
                f"Transição inválida: não é possível mudar de '{status_atual}' para '{novo_status}'"
            )
        

        AtualizarStatusContratoService._validar_regras_especificas(contrato, novo_status)
        
        contrato.atualizar(statusContrato=novo_status)
        
        return contrato

    @staticmethod
    def _mensagem_status(status):
        """Retorna uma mensagem amigável para o usuário"""
        mensagens = {
            'pendente': "Aguardando resposta do cuidador",
            'aceito': "Cuidador aceitou! Serviço confirmado",
            'recusado': "Cuidador recusou o serviço",
            'cancelado_cliente': "Você cancelou o serviço",
            'cancelado_cuidador': "Cuidador cancelou o serviço",
            'concluido': "Serviço concluído com sucesso!"
        }
        return mensagens.get(status, "Status desconhecido")