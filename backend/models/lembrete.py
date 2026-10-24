from extensions import db
 
class Lembrete(db.Model):
    __tablename__ = 'Lembrete'
 
    idLembrete = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idUsuario = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario', ondelete='CASCADE'), nullable=False)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.String(255))
    dataLembrete = db.Column(db.Date, nullable=False)
    horaLembrete = db.Column(db.Time, nullable=False)
 
    def salvar(self):
        db.session.add(self)
        db.session.commit()
 
    def to_dict(self):
        return {
            'idLembrete': self.idLembrete,
            'idUsuario': self.idUsuario,
            'titulo': self.titulo,
            'descricao': self.descricao,
            'dataLembrete': self.dataLembrete.isoformat() if self.dataLembrete else None,
            'horaLembrete': self.horaLembrete.strftime('%H:%M') if self.horaLembrete else None
        }