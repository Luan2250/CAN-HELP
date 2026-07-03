# app/services/contrato/criar_contrato_service.py
from models.contrato import Contrato
from datetime import datetime

class CriarContratoService:
    @staticmethod
    def executar(dados):
        data_atendimento_str = dados.get('dataAtendimento')
        data_atendimento_formatada = None
        
        if data_atendimento_str:
            try:
                # Converte a string "01/01/1999"(p exemplo) em um objeto que o banco aceita
                data_atendimento_formatada = datetime.strptime(data_atendimento_str, '%d/%m/%Y').date()
            except ValueError:
                # Caso o front mude o formato para "aaaa-mm-dd" (padrão de inputs tipo date)
                try:
                    data_atendimento_formatada = datetime.strptime(data_atendimento_str, '%Y-%m-%d').date()
                except ValueError:
                    data_atendimento_formatada = None

#Cria a instância mapeando exatamente o que a Model exige
        novo_contrato = Contrato(
            idCliente=dados.get('idCliente'),      
            idCuidador=dados.get('idCuidador'),  
            dataAtendimento=data_atendimento_formatada,
            localizacao=dados.get('localizacao'),
            nomeAuxiliado=dados.get('nomeAuxiliado'),
            statusContrato=dados.get('statusContrato', 'pendente'), # Garante um padrão se vier vazio
            valorFinal=dados.get('valorFinal')
        )
        
        novo_contrato.salvar()
        return novo_contrato