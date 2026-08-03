from datetime import datetime
from extensions import db
class Contrato(db.Model):
    __tablename__ = 'Contrato'
    idContrato = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idCliente = db.Column(db.Integer, db.ForeignKey('Cliente.idUsuario', ondelete='CASCADE'), nullable=False)
    idCuidador = db.Column(db.Integer, db.ForeignKey('Cuidador.idUsuario', ondelete='CASCADE'), nullable=False)
    dataContrato = db.Column(db.DateTime, default=datetime.utcnow)
    dataAtendimento = db.Column(db.Date, nullable=False)
    localizacao = db.Column(db.String(160), nullable=False)
    nomeAuxiliado = db.Column(db.String(80), nullable=False)
    statusContrato = db.Column(db.Enum('pendente', 'aceito', 'recusado', 'cancelado_cliente', 'cancelado_cuidador', 'concluido'), default='pendente')
    valorFinal = db.Column(db.Numeric(10, 2), nullable=False)

    # Métodos CRUD (Active Record) obrigatórios pelo slide
    def salvar(self):
        db.session.add(self)
        db.session.commit()

    def atualizar(self, dataContrato=None, dataAtendimento=None, localizacao=None, nomeAuxiliado=None, statusContrato=None, valorFinal=None):
        if dataContrato is not None:
            self.dataContrato = dataContrato
        if dataAtendimento is not None:
            self.dataAtendimento = dataAtendimento
        if localizacao is not None:
            self.localizacao = localizacao  
        if nomeAuxiliado is not None:
            self.nomeAuxiliado = nomeAuxiliado
        if statusContrato is not None:
            self.statusContrato = statusContrato
        if valorFinal is not None:
            self.valorFinal = valorFinal
            
        db.session.commit()

    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def listar_todos():
        return Contrato.query.all()

    @staticmethod
    def buscar_por_id(id_Contrato):
        return Contrato.query.get(id_Contrato)

    @staticmethod
    def buscar_por_cuidador(id_Cuidador):
        return Contrato.query.filter_by(idCuidador=id_Cuidador).all()

    def to_dict(self):
        return {
            'idContrato': self.idContrato,
            'idCliente': self.idCliente,
            'idCuidador': self.idCuidador,
            'dataContrato': self.dataContrato.isoformat() if self.dataContrato else None,
            'dataAtendimento': self.dataAtendimento.isoformat() if self.dataAtendimento else None,
            'localizacao': self.localizacao,
            'nomeAuxiliado': self.nomeAuxiliado,
            'statusContrato': self.statusContrato,
            'valorFinal': float(self.valorFinal) if self.valorFinal is not None else 0.00
        }