from extensions import db
from datetime import datetime
class Avaliacoes(db.Model):
    __tablename__ = 'Avaliacoes'
    idAvaliacao = db.Column(db.Integer, primary_key=True, autoincrement=True)
    idAvaliador = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario', ondelete='CASCADE'), nullable=False)
    idAvaliado = db.Column(db.Integer, db.ForeignKey('usuario.idUsuario', ondelete='CASCADE'), nullable=False)
    tipoAvaliador = db.Column(db.Enum('cliente', 'cuidador'), nullable=False)
    nota = db.Column(db.Integer, nullable=False) # TINYINT vira Integer comum no Flask
    comentario = db.Column(db.String(180))
    gorjeta = db.Column(db.Numeric(10, 2), default=0.00)
    dataAvaliacao = db.Column(db.DateTime, default=datetime.utcnow)

     # 1. CREATE 
    def salvar(self):
        db.session.add(self)
        db.session.commit()

    # 2. UPDATE 
    def atualizar(self, tipoAvaliador=None, nota=None, comentario=None, gorjeta=None, dataAvaliacao=None):
        if tipoAvaliador is not None:
            self.tipoAvaliador = tipoAvaliador
        if nota is not None:
            self.nota = nota
        if comentario is not None:
            self.comentario = comentario
        if gorjeta is not None:
            self.gorjeta = gorjeta
        if dataAvaliacao is not None:
            self.dataAvaliacao = dataAvaliacao
        
        db.session.commit()
    # 3. DELETE 
    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    # 4. READ ALL
    @staticmethod
    def listar_todos():
        return Avaliacoes.query.all()

    # 5. BUSCA POR ID
    @staticmethod
    def buscar_por_id(idAvaliacao):
        return Avaliacoes.query.get(idAvaliacao)

    # 6. OPERAÇÃO EXTRA
    @staticmethod
    def buscar_por_nota(nota):
        return Avaliacoes.query.filter_by(nota=nota).all()

    def to_dict(self):
        return {
            'idAvaliacao': self.idAvaliacao,
            'idAvaliador': self.idAvaliador,
            'idAvaliado': self.idAvaliado,
            'tipoAvaliador': self.tipoAvaliador,
            'nota': self.nota,
            'comentario': self.comentario,
            'gorjeta': float(self.gorjeta) if self.gorjeta is not None else 0.00,
            'dataAvaliacao': self.dataAvaliacao.isoformat() if self.dataAvaliacao else None
        }
