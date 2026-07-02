from extensions import db

itens_contrato = db.Table(
    'ItensContrato',
    db.Column('idContrato', db.Integer, db.ForeignKey('contratacao.idContratacao', ondelete='CASCADE'), primary_key=True),
    db.Column('idServico', db.Integer, db.ForeignKey('servico.idServico', ondelete='CASCADE'), primary_key=True)
)
