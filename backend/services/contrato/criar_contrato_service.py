# app/services/contrato/criar_contrato_service.py
from models.contrato import Contrato
from models.cliente import Cliente
from models.cuidador import Cuidador
from models.itensContrato import ItensContrato
from models.agenda import Agenda
from models.listaServicos import ListaServicos
from extensions import db
from datetime import datetime

class CriarContratoService:
    @staticmethod
    def executar(dados):
        # 1. VALIDAÇÕES BÁSICAS
        if not dados.get('idCliente'):
            raise ValueError("ID do cliente é obrigatório")
        if not dados.get('idCuidador'):
            raise ValueError("ID do cuidador é obrigatório")
        if not dados.get('dataAtendimento'):
            raise ValueError("Data de atendimento é obrigatória")
        if not dados.get('localizacao'):
            raise ValueError("Localização é obrigatória")
        if not dados.get('nomeAuxiliado'):
            raise ValueError("Nome do auxiliado é obrigatório")
        if not dados.get('valorFinal'):
            raise ValueError("Valor final é obrigatório")
        
        # 2. VALIDAR SE USUÁRIOS EXISTEM
        cliente = Cliente.buscar_por_id(dados.get('idCliente'))
        if not cliente:
            raise ValueError("Cliente não encontrado")
        
        cuidador = Cuidador.buscar_por_id(dados.get('idCuidador'))
        if not cuidador:
            raise ValueError("Cuidador não encontrado")
        
        # 3. VALIDAR SE NÃO É A MESMA PESSOA
        if dados.get('idCliente') == dados.get('idCuidador'):
            raise ValueError("Cliente e cuidador não podem ser a mesma pessoa")
        
        # 4. VALIDAR DATA DE ATENDIMENTO
        try:
            data_atendimento = datetime.strptime(dados.get('dataAtendimento'), '%Y-%m-%d')
            if data_atendimento.date() < datetime.now().date():
                raise ValueError("Data de atendimento não pode ser no passado")
        except ValueError:
            raise ValueError("Data de atendimento inválida. Use o formato YYYY-MM-DD")
        
        # 5. VALIDAR SE CUIDADOR ESTÁ DISPONÍVEL NA DATA
        CriarContratoService._verificar_disponibilidade_cuidador(
            dados.get('idCuidador'), 
            dados.get('dataAtendimento')
        )
        
        # 6. VALIDAR VALOR
        try:
            valor = float(dados.get('valorFinal'))
            if valor <= 0:
                raise ValueError("Valor final deve ser maior que zero")
        except (ValueError, TypeError):
            raise ValueError("Valor final inválido")
        
        # 7. VERIFICAR SE JÁ EXISTE SOLICITAÇÃO DUPLICADA
        contrato_existente = Contrato.query.filter_by(
            idCliente=dados.get('idCliente'),
            idCuidador=dados.get('idCuidador'),
            dataAtendimento=data_atendimento.date(),
            statusContrato='pendente'
        ).first()
        
        if contrato_existente:
            raise ValueError("Já existe uma solicitação pendente para este cuidador nesta data")
        
        # 8. CRIAR CONTRATO
        novo_contrato = Contrato(
            idCliente=dados.get('idCliente'),
            idCuidador=dados.get('idCuidador'),
            dataAtendimento=data_atendimento,
            localizacao=dados.get('localizacao'),
            nomeAuxiliado=dados.get('nomeAuxiliado'),
            valorFinal=valor,
            statusContrato='pendente'  # Sempre começa pendente
        )
        
        try:
            # ADICIONAR contrato à sessão (sem commit ainda)
            db.session.add(novo_contrato)
            db.session.flush()  # Gera o ID sem commitar
            
            # 9. ADICIONAR SERVIÇOS AO CONTRATO (se fornecidos)
            if dados.get('servicos'):
                CriarContratoService._adicionar_servicos(novo_contrato.idContrato, dados.get('servicos'))
            
            # 10. CRIAR AGENDA (se fornecida)
            if dados.get('ocasiao') or dados.get('horaAtendimento'):
                CriarContratoService._criar_agenda(
                    novo_contrato.idContrato,
                    dados.get('dataAtendimento'),
                    dados.get('horaAtendimento'),
                    dados.get('ocasiao')
                )
            
            # COMMIT ÚNICO para tudo
            db.session.commit()
            
        except Exception as e:
            db.session.rollback()
            raise e
        
        return novo_contrato
    
    @staticmethod
    def _verificar_disponibilidade_cuidador(id_cuidador, data):
        """
        Verifica se o cuidador já tem contrato aceito na data
        """
        # Buscar contratos do cuidador na data
        contratos_conflitantes = Contrato.query.filter_by(
            idCuidador=id_cuidador,
            dataAtendimento=data,
            statusContrato='aceito'  # Apenas contratos aceitos
        ).first()
        
        if contratos_conflitantes:
            raise ValueError("Cuidador já possui compromisso aceito nesta data")
        
        # Também verificar contratos pendentes (para evitar múltiplas solicitações)
        contratos_pendentes = Contrato.query.filter_by(
            idCuidador=id_cuidador,
            dataAtendimento=data,
            statusContrato='pendente'
        ).first()
        
        if contratos_pendentes:
            raise ValueError("Cuidador já possui solicitação pendente nesta data")
    
    @staticmethod
    def _adicionar_servicos(idContrato, servicos):
        """
        Adiciona serviços ao contrato (sem commit individual)
        """
        for servico_id in servicos:
            # Verificar se o serviço existe
            servico = ListaServicos.buscar_por_id(servico_id)
            if not servico:
                raise ValueError(f"Serviço com ID {servico_id} não encontrado")
            
            # Criar item de contrato (apenas adiciona à sessão)
            item = ItensContrato(
                idContrato=idContrato,
                idServico=servico_id
            )
            db.session.add(item)
    
    @staticmethod
    def _criar_agenda(idContrato, data, hora=None, ocasiao=None):
        """
        Cria uma agenda para o contrato (sem commit individual)
        """
        if not hora:
            hora = '09:00'  # Horário padrão
        
        if not ocasiao:
            ocasiao = "Atendimento"
        
        nova_agenda = Agenda(
            idContrato=idContrato,
            dataAgenda=data,
            horaAgenda=hora,
            ocasiao=ocasiao,
            notificacao=True
        )
        db.session.add(nova_agenda)  # Apenas adiciona à sessão
    
    @staticmethod
    def listar_solicitacoes(id_usuario=None, tipo_usuario=None, status=None):
        """
        Lista solicitações com filtros
        """
        query = Contrato.query
        
        if id_usuario and tipo_usuario:
            if tipo_usuario == 'cliente':
                query = query.filter_by(idCliente=id_usuario)
            elif tipo_usuario == 'cuidador':
                query = query.filter_by(idCuidador=id_usuario)
            else:
                raise ValueError("Tipo de usuário deve ser 'cliente' ou 'cuidador'")
        
        if status:
            status_validos = ['pendente', 'aceito', 'recusado', 
                             'cancelado_cliente', 'cancelado_cuidador', 'concluido']
            if status not in status_validos:
                raise ValueError(f"Status inválido. Use: {', '.join(status_validos)}")
            query = query.filter_by(statusContrato=status)
        
        # Ordenar por data de criação (mais recentes primeiro)
        return query.order_by(Contrato.dataContrato.desc()).all()