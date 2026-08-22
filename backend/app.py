from flask import Flask
from flask_cors import CORS
from extensions import db, bcrypt
from routes import (
    usuario_bp, perfil_bp, cliente_bp, 
    cuidador_bp, contrato_bp, agenda_bp,
    tarefa_bp, avaliacoes_bp, denuncia_bp,
    listaServico_bp, itensContrato_bp, mensagem_bp
)
app = Flask(__name__)

# Configuração do banco de dados

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/canhelp'

# Conecta o SQLAlchemy a essa aplicação Flask
db.init_app(app)
bcrypt.init_app(app)
# -- #

CORS(app)
# Registra as rotas de usuário no Flask pra que elas fiquem disponíveis na aplicação, lembrar que ta importando (la em cima) o usuario_bp do arquivo usuario_routes.py por exemplo. E tem que colocar de todas models
app.register_blueprint(usuario_bp)
app.register_blueprint(perfil_bp)
app.register_blueprint(cliente_bp)
app.register_blueprint(cuidador_bp)
app.register_blueprint(contrato_bp)
app.register_blueprint(agenda_bp)

app.register_blueprint(tarefa_bp)
app.register_blueprint(avaliacoes_bp)
app.register_blueprint(denuncia_bp)
app.register_blueprint(listaServico_bp)
app.register_blueprint(itensContrato_bp)
app.register_blueprint(mensagem_bp)
@app.route("/")
def status():
    return "API canhelp tá rodando"
 
 
if __name__ == "__main__":
    app.run(debug=True, port=5000)
    
# isso e do bd mas como nao estou usando vai ficar comentado, mas talvez usaremos mais tarde, entao deixei aqui pra nao esquecer    
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://admin:senha@localhost/canhelp'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False