from extensions import db
class Tarefa(db.Model):
    __tablename__ = 'Tarefa'
    idTarefa = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idAgenda = db.Column(db.Integer, db.ForeignKey('Agenda.idAgenda', ondelete='CASCADE'), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    horaTarefa = db.Column(db.Time, nullable=False)
    notificacao = db.Column(db.Boolean, default=True)
    statusTarefa = db.Column(db.Enum('pendente', 'concluida'), default='pendente')


    def salvar(self):
        db.session.add(self)
        db.session.commit()
    # 2. UPDATE 
    def atualizar(self, descricao=None, horaTarefa=None, notificacao=None, statusTarefa=None):
        if descricao is not None:
            self.descricao = descricao
        if horaTarefa is not None:
            self.horaTarefa = horaTarefa
        if notificacao is not None:
            self.notificacao = notificacao
        if statusTarefa is not None:
            self.statusTarefa = statusTarefa 
            
        db.session.commit()

    # 3. DELETE 
    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    # 4. READ ALL
    @staticmethod
    def listar_todos():
        return Tarefa.query.all()

    # 5. busca por id
    @staticmethod
    def buscar_por_id(idTarefa):
        return Tarefa.query.get(idTarefa)


    @staticmethod
    def buscar_por_hora(horaTarefa):
        return Tarefa.query.filter_by(horaTarefa=horaTarefa).first()

    @staticmethod
    def buscar_por_status(statusTarefa):
        return Tarefa.query.filter_by(statusTarefa=statusTarefa).first()
    
    def to_dict(self):
        return {
            'idTarefa': self.idTarefa,
            'idAgenda': self.idAgenda,
            'descricao': self.descricao,
            'horaTarefa': self.horaTarefa.strftime('%H:%M:%S') if self.horaTarefa else None,
            'notificacao': self.notificacao,
            'statusTarefa': self.statusTarefa
        }


    # 3. Suas outras operações (salvar, deletar, etc.)
    def salvar(self):
        db.session.add(self)
        db.session.commit()