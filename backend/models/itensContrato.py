# app/models/itensContrato.py
from extensions import db

class ItensContrato(db.Model):
    __tablename__ = 'ItensContrato'

    # Chave composta: os dois campos juntos formam a PK, sem id próprio.
    idContrato = db.Column(db.Integer, db.ForeignKey('Contrato.idContrato', ondelete='CASCADE'), primary_key=True)
    idServico = db.Column(db.Integer, db.ForeignKey('ListaServicos.idServico', ondelete='CASCADE'), primary_key=True)

    # 1. CREATE
    def salvar(self):
        db.session.add(self)
        db.session.commit()

    # 2. DELETE
    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    # 3. READ ALL
    @staticmethod
    def listar_todos():
        return ItensContrato.query.all()

    # 4. BUSCA POR ID (aqui, o "id" é o PAR idContrato + idServico)
    @staticmethod
    def buscar_por_id(id_contrato, id_servico):
        return ItensContrato.query.get((id_contrato, id_servico))

    # 5. OPERAÇÃO EXTRA: lista todos os serviços de UM contrato específico
    @staticmethod
    def buscar_por_contrato(id_contrato):
        return ItensContrato.query.filter_by(idContrato=id_contrato).all()

    def to_dict(self):
        return {
            'idContrato': self.idContrato,
            'idServico': self.idServico
        }
