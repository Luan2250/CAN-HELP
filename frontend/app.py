# frontend/app.py
# Este app NÃO acessa o banco de dados. Ele só serve as páginas Jinja,
# que chamam a API do backend (rodando em outra porta) via JavaScript.
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/usuarios")
def tela_usuarios():
    return render_template("usuarios.html", active="usuarios")


@app.route("/perfis")
def tela_perfis():
    return render_template("perfis.html", active="perfis")


@app.route("/clientes")
def tela_clientes():
    return render_template("clientes.html", active="clientes")


@app.route("/cuidadores")
def tela_cuidadores():
    return render_template("cuidadores.html", active="cuidadores")


@app.route("/contratos")
def tela_contratos():
    return render_template("contratos.html", active="contratos")


if __name__ == "__main__":
    # Porta diferente do backend (que roda na 5000) para não haver conflito.
    app.run(debug=True, port=5001)
