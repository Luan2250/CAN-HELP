from extensions import db
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
class cuidador(db.Model): 
    __tablename__='Cuidador'

    
    idUsuario = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario', ondelete='CASCADE'), primary_key=True)
    certificado = db.Column(db.String(30), nullable=False, unique=True)
    orgaoEmissor = db.Column(db.String(40), nullable=False)
    valorServico = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    disponibilidade = db.Column(db.String(160), nullable=True)


    usuario = db.relationship('usuario', backref='return_user', lazy=True, uselist=False)

    

    # 1. CREATE 
    def salvar(self):
        db.session.add(self)
        db.session.commit()

    # 2. UPDATE 
    def atualizar(self, certificado=None, orgaoEmissor=None, valorServico=None, disponibilidade=None):
        if certificado is not None:
            self.certificado = certificado
        if orgaoEmissor is not None:
            self.orgaoEmissor = orgaoEmissor
        if valorServico is not None:
            self.valorServico = valorServico
        if disponibilidade is not None:
            self.disponibilidade = disponibilidade  
            
        db.session.commit()

    # 3. DELETE 
    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    # 4. READ ALL
    @staticmethod
    def listar_todos():
        return cuidador.query.all()

    # 5. busca por id
    @staticmethod
    def buscar_por_id(id_usuario):
        return cuidador.query.get(id_usuario)

    # 6. OPERAÇÃO EXTRA INTERESSANTE: Buscar por certificado
    @staticmethod
    def buscar_por_certificado(certificado):
        return cuidador.query.filter_by(certificado=certificado).first()

    
    def to_dict(self):
        return {
            'idUsuario': self.idUsuario,
            'certificado': self.certificado,
            'orgaoEmissor': self.orgaoEmissor,
            'valorServico': float(self.valorServico) if self.valorServico is not None else 0.00,
            'disponibilidade': self.disponibilidade
        }


    # 3. Suas outras operações (salvar, deletar, etc.)
    def salvar(self):
        db.session.add(self)
        db.session.commit()