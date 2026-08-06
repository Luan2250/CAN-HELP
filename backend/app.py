# app.py
from flask import Flask
from flask_cors import CORS
from extensions import db
from controllers.usuario_routes import usuario_bp
from controllers.perfil_routes import perfil_bp
from controllers.cliente_routes import cliente_bp
from controllers.cuidador_routes import cuidador_bp
from controllers.contrato_routes import contrato_bp
from controllers.agenda_routes import agenda_bp


from controllers.tarefa_routes import tarefa_bp
from controllers.avaliacoes_routes import avaliacoes_bp
from controllers.denuncias_routes import denuncia_bp
from controllers.listaServico_routes import listaServico_bp
from controllers.itensContrato_routes import itensContrato_bp
app = Flask(__name__)

# Configuração do banco de dados

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:l230908*@localhost/canhelp'

# Conecta o SQLAlchemy a essa aplicação Flask
db.init_app(app)
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
@app.route("/")
def status():
    return "API canhelp tá rodando"
 
 
if __name__ == "__main__":
    app.run(debug=True, port=5000)
    
# isso e do bd mas como nao estou usando vai ficar comentado, mas talvez usaremos mais tarde, entao deixei aqui pra nao esquecer    
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://admin:senha@localhost/canhelp'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False