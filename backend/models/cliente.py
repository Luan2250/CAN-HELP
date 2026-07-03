from extensions import db
class Cliente(db.Model): 
    __tablename__ = 'cliente'

    idUsuario = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario', ondelete='CASCADE'), primary_key=True)

    usuario_pai = db.relationship('Usuario', backref='return_client', lazy=True, uselist=False)

    # 1. CREATE 
    def salvar(self):
        db.session.add(self)
        db.session.commit()

    # 2. UPDATE 
    def atualizar(self):
        db.session.commit()

    # 3. DELETE 
    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    # 4. READ ALL
    @staticmethod
    def listar_todos():
        return Cliente.query.all()

    # 5. BUSCA POR ID
    @staticmethod
    def buscar_por_id(id_usuario):
        return Cliente.query.get(id_usuario)

    def to_dict(self):
        return {
            'idUsuario': self.idUsuario
        }
