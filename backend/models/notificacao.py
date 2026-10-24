from datetime import datetime
from extensions import db

class Notificacao(db.Model):
    __tablename__ = 'Notificacao'

    idNotificacao = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idUsuario = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario', ondelete='CASCADE'), nullable=False)
    idContrato = db.Column(db.Integer, db.ForeignKey('Contrato.idContrato', ondelete='CASCADE'))
    mensagem = db.Column(db.String(200), nullable=False)
    lida = db.Column(db.Boolean, nullable=False, default=False)
    dataCriacao = db.Column(db.DateTime, default=datetime.now)

    def salvar(self):
        db.session.add(self)
        db.session.commit()

    def marcar_lida(self):
        self.lida = True
        db.session.commit()

    @staticmethod
    def buscar_por_id(id_notificacao):
        return Notificacao.query.get(id_notificacao)

    @staticmethod
    def listar_por_usuario(id_usuario, limite=50):
        return (Notificacao.query
                .filter_by(idUsuario=id_usuario)
                .order_by(Notificacao.dataCriacao.desc(), Notificacao.idNotificacao.desc())
                .limit(limite)
                .all())

    @staticmethod
    def contar_nao_lidas(id_usuario):
        return Notificacao.query.filter_by(idUsuario=id_usuario, lida=False).count()

    @staticmethod
    def marcar_todas_lidas(id_usuario):
        Notificacao.query.filter_by(idUsuario=id_usuario, lida=False).update({'lida': True})
        db.session.commit()

    def to_dict(self):
        return {
            'idNotificacao': self.idNotificacao,
            'idUsuario': self.idUsuario,
            'idContrato': self.idContrato,
            'mensagem': self.mensagem,
            'lida': bool(self.lida),
            'dataCriacao': self.dataCriacao.isoformat() if self.dataCriacao else None
        }