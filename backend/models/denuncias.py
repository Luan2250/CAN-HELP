from extensions import db

class Denuncias(db.Model):
    __tablename__ = 'Denuncias'

    idDenuncia = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    idContratacao = db.Column(db.Integer, db.ForeignKey('contratacao.idContratacao', ondelete='CASCADE'), nullable=False)
    
    idDenunciante = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario', ondelete='CASCADE'), nullable=False)
    idDenunciado = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario', ondelete='CASCADE'), nullable=False)
    tipoDenunciante = db.Column(db.Enum('cliente', 'cuidador'), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    penalidade = db.Column(db.String(180), default='Nenhuma')
    statusDenuncia = db.Column(db.Enum('pendente', 'em análise', 'resolvida', 'arquivada'), default='pendente')
    dataDenuncia = db.Column(db.DateTime, default=db.func.current_timestamp())

  
    contratacao = db.relationship('contratacao', backref='denuncias', lazy=True)

    # 1. CREATE 
    def salvar(self):
        db.session.add(self)
        db.session.commit()

    # 2. UPDATE 
    def atualizar(self, tipoDenunciante=None, descricao=None, penalidade=None, statusDenuncia=None):
        if tipoDenunciante is not None:
            self.tipoDenunciante = tipoDenunciante
        if descricao is not None:
            self.descricao = descricao
        if penalidade is not None:
            self.penalidade = penalidade
        if statusDenuncia is not None:
            self.statusDenuncia = statusDenuncia   
        db.session.commit()

    # 3. DELETE 
    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    # 4. READ ALL
    @staticmethod
    def listar_todos():
        return Denuncias.query.all()

    # 5. BUSCA POR ID
    @staticmethod
    def buscar_por_id(id_denuncia):
        return Denuncias.query.get(id_denuncia)

    # 6. OPERAÇÃO EXTRA
    @staticmethod
    def buscar_por_contratacao(id_contratacao):
        return Denuncias.query.filter_by(idContratacao=id_contratacao).all()

    def to_dict(self):
        return {
            'idDenuncia': self.idDenuncia,
            'idContratacao': self.idContratacao,
            'idDenunciante': self.idDenunciante,
            'idDenunciado': self.idDenunciado,
            'tipoDenunciante': self.tipoDenunciante,
            'descricao': self.descricao,
            'penalidade': self.penalidade,
            'statusDenuncia': self.statusDenuncia,
            'dataDenuncia': self.dataDenuncia.isoformat() if self.dataDenuncia else None
        }
