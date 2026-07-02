# app/extensions.py
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
# app/__init__.py
from flask import Flask
from extensions import db

def create_app():
    app = Flask(__name__)
    #comentado porque em casa eu uso outro banco de dados
   # app.config['SQLALCHEMY_DATABASE_URI'] = (
   # 'mysql+pymysql://admin:senha@localhost/canhelp'
    #)
   # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:l230908*@localhost/canhelp'
    db.init_app(app)
    return app