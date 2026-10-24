from datetime import datetime
from extensions import db


class Mensagem(db.Model):
    __tablename__ = 'Mensagem'
    idMensagem = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idContrato = db.Column(db.Integer, db.ForeignKey('Contrato.idContrato', ondelete='CASCADE'), nullable=False)
    idRemetente = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario', ondelete='CASCADE'), nullable=False)
    texto = db.Column(db.Text, nullable=False)
    dataEnvio = db.Column(db.DateTime, default=datetime.utcnow)
    lida = db.Column(db.Boolean, default=False)

    # 1. CREATE
    def salvar(self):
        db.session.add(self)
        db.session.commit()

    # 2. UPDATE (marcar como lida)
    def marcar_como_lida(self):
        self.lida = True
        db.session.commit()

    # 3. DELETE
    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    # 4. READ ALL (de um contrato específico)
    @staticmethod
    def listar_por_contrato(idContrato):
        return Mensagem.query.filter_by(idContrato=idContrato) \
            .order_by(Mensagem.dataEnvio.asc(), Mensagem.idMensagem.asc()).all()

    # 5. busca por id
    @staticmethod
    def buscar_por_id(idMensagem):
        return Mensagem.query.get(idMensagem)

    @staticmethod
    def marcar_lidas_por_contrato(idContrato, idUsuarioLeitor):
        """Marca como lidas todas as mensagens do contrato que NÃO foram
        enviadas pelo próprio leitor (ou seja, as mensagens recebidas)."""
        mensagens = Mensagem.query.filter(
            Mensagem.idContrato == idContrato,
            Mensagem.idRemetente != idUsuarioLeitor,
            Mensagem.lida == False
        ).all()

        for mensagem in mensagens:
            mensagem.lida = True
        db.session.commit()

        return len(mensagens)

    @staticmethod
    def contar_nao_lidas(idContrato, idUsuario):
        return Mensagem.query.filter(
            Mensagem.idContrato == idContrato,
            Mensagem.idRemetente != idUsuario,
            Mensagem.lida == False
        ).count()

    def to_dict(self):
        return {
            'idMensagem': self.idMensagem,
            'idContrato': self.idContrato,
            'idRemetente': self.idRemetente,
            'texto': self.texto,
            'dataEnvio': self.dataEnvio.isoformat() if self.dataEnvio else None,
            'lida': bool(self.lida)
        }
