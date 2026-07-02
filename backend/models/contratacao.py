from extensions import db
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
class contratacao(db.Model):
    __tablename__ = 'contratacao'

    idContratacao = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idCliente = db.Column(db.Integer, db.ForeignKey('Cliente.idUsuario', ondelete='CASCADE'), nullable=False)
    idCuidador = db.Column(db.Integer, db.ForeignKey('Cuidador.idUsuario', ondelete='CASCADE'), nullable=False)
    dataContratacao = db.Column(db.DateTime, default=db.func.current_timestamp())
    dataAtendimento = db.Column(db.Date, nullable=False)
    localizacao = db.Column(db.String(160), nullable=False)
    nomeAuxiliado = db.Column(db.String(80), nullable=False)
    
    statusContratacao = db.Column(
        db.Enum('pendente', 'aceito', 'recusado', 'cancelado_cliente', 'cancelado_cuidador', 'concluido'), 
        nullable=False, 
        default='pendente'
    )
    
    valorFinal = db.Column(db.Numeric(10, 2), nullable=False)

    cliente = db.relationship('cliente', backref='contratacoes', lazy=True)
    cuidador = db.relationship('cuidador', backref='contratacoes', lazy=True)

    # 1. CREATE 
    def salvar(self):
        db.session.add(self)
        db.session.commit()

    # 2. UPDATE 
    def atualizar(self, dataAtendimento=None, localizacao=None, nomeAuxiliado=None, statusContratacao=None, valorFinal=None):
        if dataAtendimento is not None:
            self.dataAtendimento = dataAtendimento
        if localizacao is not None:
            self.localizacao = localizacao
        if nomeAuxiliado is not None:
            self.nomeAuxiliado = nomeAuxiliado  
        if statusContratacao is not None:
            self.statusContratacao = statusContratacao
        if valorFinal is not None:
            self.valorFinal = valorFinal
            
        db.session.commit()

    # 3. DELETE 
    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    # 4. READ ALL
    @staticmethod
    def listar_todos():
        return contratacao.query.all()

    # 5. BUSCA POR ID
    @staticmethod
    def buscar_por_id(id_contratacao):
        return contratacao.query.get(id_contratacao)

    # 6. OPERAÇÃO EXTRA: Buscar todas as contratações de um cliente específico
    @staticmethod
    def buscar_por_cliente(id_cliente):
        return contratacao.query.filter_by(idCliente=id_cliente).all()

    def to_dict(self):
        return {
            'idContratacao': self.idContratacao,
            'idCliente': self.idCliente,
            'idCuidador': self.idCuidador,
            'dataContratacao': self.dataContratacao.isoformat() if self.dataContratacao else None,
            'dataAtendimento': self.dataAtendimento.isoformat() if self.dataAtendimento else None,
            'localizacao': self.localizacao,
            'nomeAuxiliado': self.nomeAuxiliado,
            'statusContratacao': self.statusContratacao,
            'valorFinal': float(self.valorFinal) if self.valorFinal is not None else 0.00
        }



    # 3. Suas outras operações (salvar, deletar, etc.)
    def salvar(self):
        db.session.add(self)
        db.session.commit()