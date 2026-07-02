from extensions import db

class ListaServicos(db.Model):
    __tablename__ = 'ListaServicos'

    idServico = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tipoServico = db.Column(db.String(50), nullable=False, unique=True)

    # 1. CREATE 
    def salvar(self):
        db.session.add(self)
        db.session.commit()

    # 2. UPDATE 
    def atualizar(self, tipoServico=None):
        if tipoServico is not None:
            self.tipoServico = tipoServico
        db.session.commit()

    # 3. DELETE 
    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    # 4. READ ALL
    @staticmethod
    def listar_todos():
        return ListaServicos.query.all()

    # 5. BUSCA POR ID
    @staticmethod
    def buscar_por_id(id_servico):
        return ListaServicos.query.get(id_servico)

    # 6. OPERAÇÃO EXTRA
    @staticmethod
    def buscar_por_servico(tipoServico):
        return ListaServicos.query.filter_by(tipoServico=tipoServico).first()

    def to_dict(self):
        return {
            'idServico': self.idServico,
            'tipoServico': self.tipoServico
        }
