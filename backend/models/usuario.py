from extensions import db
class Usuario(db.Model): 
    __tablename__='usuario'

    idUsuario = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    cpf = db.Column(db.String(11), unique=True, nullable=False)
    endereco = db.Column(db.String(100), nullable=True)  # No SQL não está 'NOT NULL', então aceita nulo
    telefone = db.Column(db.String(45), nullable=False)
    email = db.Column(db.String(254), nullable=False)
    dataNascimento = db.Column(db.Date, nullable=False)
    dataCadastro = db.Column(db.DateTime, default=db.func.current_timestamp())
    senha = db.Column(db.String(255), nullable=False)
    # 1. CREATE 
    def salvar(self):
        db.session.add(self)
        db.session.commit()
    # 2. UPDATE 
    def atualizar(self, endereco=None, telefone=None, email=None, senha=None):
        if endereco is not None:
            self.endereco = endereco
        if telefone is not None:
            self.telefone = telefone
        if email is not None:
            self.email = email
        if senha is not None:
            self.senha = senha  # Lembra de criptografar a senha no futuro!
            
        db.session.commit()

    # 3. DELETE 
    def deletar(self):
        db.session.delete(self)
        db.session.commit()

    # 4. READ ALL
    @staticmethod
    def listar_todos():
        return Usuario.query.all()

    # 5. busca por id
    @staticmethod
    def buscar_por_id(id_usuario):
        return Usuario.query.get(id_usuario)

    # 6. OPERAÇÃO EXTRA INTERESSANTE: Buscar por CPF ou Email
    @staticmethod
    def buscar_por_cpf(cpf):
        return Usuario.query.filter_by(cpf=cpf).first()

    @staticmethod
    def buscar_por_email(email):
        return Usuario.query.filter_by(email=email).first()
    
    def to_dict(self):
        return {
            'idUsuario': self.idUsuario,
            'cpf': self.cpf,
            'endereco': self.endereco,
            'telefone': self.telefone,
            'email': self.email,
            # .isoformat() serve para transformar as datas em texto (strings),
            # já que o JSON não entende o formato de data nativo do Python.
            'dataNascimento': self.dataNascimento.isoformat() if self.dataNascimento else None,
            'dataCadastro': self.dataCadastro.isoformat() if self.dataCadastro else None
            # IMPORTANTE: Repare que NÃO colocamos a 'senha' aqui para que ela nunca 
            # seja enviada de volta na resposta da API, garantindo a segurança!
        }

    # 3. Suas outras operações (salvar, deletar, etc.)
    def salvar(self):
        db.session.add(self)
        db.session.commit()