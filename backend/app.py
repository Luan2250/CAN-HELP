# app.py
from flask import Flask
from extensions import db
from controllers.usuario_routes import usuario_bp

app = Flask(__name__)

# Configuração do banco de dados
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://admin:senha@localhost/canhelp'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:l230908*@localhost/canhelp'

# Conecta o SQLAlchemy a essa aplicação Flask
db.init_app(app)

# Registra as rotas de usuário no Flask
app.register_blueprint(usuario_bp)

@app.route("/")
def home():
    return "API canhelp tá rodando"

if __name__ == "__main__":
    app.run(debug=True)