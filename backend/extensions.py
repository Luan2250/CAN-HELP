# app/extensions.py
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()
# app/__init__.py
from flask import Flask
from extensions import db

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = (
    'mysql+pymysql://admin:senha@localhost/escola'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    return app