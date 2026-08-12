from extensions import db
<<<<<<< HEAD
from sqlalchemy.dialects.mysql import LONGTEXT
=======
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e

class Perfil(db.Model):
    __tablename__ = 'perfil'

    # idUsuario é PK e FK ao mesmo tempo (relação 1:1)
    idUsuario = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario', ondelete='CASCADE'), primary_key=True)
<<<<<<< HEAD
    fotoURL = db.Column(LONGTEXT, nullable=True)
=======
    fotoURL = db.Column(db.String(255), nullable=True)
>>>>>>> 019af874be68aa5cc08bad2fb47866974e0f9d2e
    nome = db.Column(db.String(70), nullable=False)
    bio = db.Column(db.String(220), nullable=True)
    cidade = db.Column(db.String(40), nullable=True)
    estado = db.Column(db.String(40), nullable=True)

    # Métodos CRUD (Active Record) obrigatórios pelo slide
    def salvar(self):
        db.session.add(self)
        db.session.commit()

    def atualizar(self, fotoURL=None, nome=None, bio=None, cidade=None, estado=None):
        if fotoURL is not None: self.fotoURL = fotoURL
        if nome is not None: self.nome = nome
        if bio is not None: self.bio = bio
        if cidade is not None: self.cidade = cidade
        if estado is not None: self.estado = estado
        db.session.commit()

    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    @staticmethod
    def listar_todos():
        return Perfil.query.all()

    @staticmethod
    def buscar_por_id(id_usuario):
        return Perfil.query.get(id_usuario)

    def to_dict(self):
        return {
            'idUsuario': self.idUsuario,
            'fotoURL': self.fotoURL,
            'nome': self.nome,
            'bio': self.bio,
            'cidade': self.cidade,
            'estado': self.estado
        }