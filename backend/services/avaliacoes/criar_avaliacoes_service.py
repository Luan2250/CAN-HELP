from models.avaliacoes import Avaliacoes
from models.contrato import Contrato
from models.usuario import Usuario

class CriarAvaliacoesService:
    @staticmethod
    def executar(dados):

        if not dados.get('idAvaliador'):
            raise ValueError("ID do avaliador é obrigatório")
        if not dados.get('idAvaliado'):
            raise ValueError("ID do avaliado é obrigatório")
        if not dados.get('tipoAvaliador'):
            raise ValueError("Tipo de avaliador é obrigatório")
        if not dados.get('nota'):
            raise ValueError("Nota é obrigatória")
        

        nota = int(dados.get('nota'))
        if nota < 1 or nota > 5:
            raise ValueError("Nota deve ser entre 1 e 5")
        

        tipo_avaliador = dados.get('tipoAvaliador')
        if tipo_avaliador not in ('cliente', 'cuidador'):
            raise ValueError("Tipo de avaliador deve ser 'cliente' ou 'cuidador'")
        

        avaliador = Usuario.buscar_por_id(dados.get('idAvaliador'))
        avaliado = Usuario.buscar_por_id(dados.get('idAvaliado'))
        
        if not avaliador:
            raise ValueError("Avaliador não encontrado")
        if not avaliado:
            raise ValueError("Avaliado não encontrado")
        

        if dados.get('idAvaliador') == dados.get('idAvaliado'):
            raise ValueError("Não é possível avaliar a si mesmo")
        
        # 6. Verificar se existe contrato concluído entre os dois
        # Busca contratos onde o avaliador é cliente e avaliado é cuidador (ou vice-versa)
        if tipo_avaliador == 'cliente':
            # Cliente avaliando cuidador
            contrato = Contrato.query.filter_by(
                idCliente=dados.get('idAvaliador'),
                idCuidador=dados.get('idAvaliado'),
                statusContrato='concluido'
            ).first()
        else:
            # Cuidador avaliando cliente
            contrato = Contrato.query.filter_by(
                idCliente=dados.get('idAvaliado'),
                idCuidador=dados.get('idAvaliador'),
                statusContrato='concluido'
            ).first()
        
        if not contrato:
            raise ValueError("Não é possível avaliar: serviço não foi concluído entre esses usuários")
        
  
        avaliacao_existente = Avaliacoes.query.filter_by(
            idAvaliador=dados.get('idAvaliador'),
            idAvaliado=dados.get('idAvaliado'),
            tipoAvaliador=tipo_avaliador
        ).first()
        
        if avaliacao_existente:
            raise ValueError("Você já avaliou este usuário")

        novo_avaliacoes = Avaliacoes(
            idAvaliador=dados.get('idAvaliador'),
            idAvaliado=dados.get('idAvaliado'),
            tipoAvaliador=dados.get('tipoAvaliador'),
            nota=dados.get('nota'),
            comentario=dados.get('comentario'),
            gorjeta=dados.get('gorjeta', 0.00)
        )
        
        novo_avaliacoes.salvar()
        
        return novo_avaliacoes