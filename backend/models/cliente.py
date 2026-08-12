from extensions import db
class Cliente(db.Model): 
    __tablename__ = 'cliente'

    idUsuario = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario', ondelete='CASCADE'), primary_key=True)

<<<<<<< HEAD
    usuario_pai = db.relationship(
    'Usuario',
    backref=db.backref('return_client', passive_deletes=True),
    lazy=True,
    uselist=False,
    passive_deletes=True
    )
=======
    usuario_pai = db.relationship('Usuario', backref='return_client', lazy=True, uselist=False)
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e

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
<<<<<<< HEAD
        return Cliente.query.get(id_usuario)
=======
        return cliente.query.get(id_usuario)
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e

    def to_dict(self):
        return {
            'idUsuario': self.idUsuario
        }
