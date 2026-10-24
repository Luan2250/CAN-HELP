from extensions import db
class Agenda(db.Model):
    __tablename__ = 'Agenda'
    idAgenda = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idContrato = db.Column(db.Integer, db.ForeignKey('Contrato.idContrato', ondelete='CASCADE'), nullable=False)
    dataAgenda = db.Column(db.Date, nullable=False)
    horaAgenda = db.Column(db.Time, nullable=False) # Mapeado como Time
    ocasiao = db.Column(db.String(100), nullable=False)
    notificacao = db.Column(db.Boolean, default=True)

    def salvar(self):
        db.session.add(self)
        db.session.commit()
    # 2. UPDATE 
    def atualizar(self, dataAgenda=None, horaAgenda=None, ocasiao=None, notificacao=None):
        if dataAgenda is not None:
            self.dataAgenda = dataAgenda
        if horaAgenda is not None:
            self.horaAgenda = horaAgenda
        if ocasiao is not None:
            self.ocasiao = ocasiao
        if notificacao is not None:
            self.notificacao = notificacao 
            
        db.session.commit()

    # 3. DELETE 
    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    # 4. READ ALL
    @staticmethod
    def listar_todos():
        return Agenda.query.all()

    # 5. busca por id
    @staticmethod
    def buscar_por_id(idAgenda):
        return Agenda.query.get(idAgenda)

    @staticmethod
    def buscar_por_data(dataAgenda):
        return Agenda.query.filter_by(dataAgenda=dataAgenda).first()

    @staticmethod
    def buscar_por_hora(horaAgenda):
        return Agenda.query.filter_by(horaAgenda=horaAgenda).first()
    
    def to_dict(self):
        return {
            'idAgenda': self.idAgenda,
            'idContrato': self.idContrato,
            'dataAgenda': self.dataAgenda.isoformat() if self.dataAgenda else None,
            'horaAgenda': self.horaAgenda.strftime('%H:%M:%S') if self.horaAgenda else None,
            'ocasiao': self.ocasiao,
            'notificacao': self.notificacao
        }

    def salvar(self):
        db.session.add(self)
        db.session.commit()