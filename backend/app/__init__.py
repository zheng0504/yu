from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # 初始化扩展
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # 注册蓝图
    from app.routes import users, universities, predictions, statements
    app.register_blueprint(users.bp)
    app.register_blueprint(universities.bp)
    app.register_blueprint(predictions.bp)
    app.register_blueprint(statements.bp)

    return app
