from flask import Flask
from flask_cors import CORS
from src.models.user import db
from src.routes.charutos import charutos_bp
from src.routes.degustacoes import degustacoes_bp
import os

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///charutos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar banco de dados
db.init_app(app)

# Registrar blueprints
app.register_blueprint(charutos_bp, url_prefix='/api')
app.register_blueprint(degustacoes_bp, url_prefix='/api')

# Criar tabelas
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=3000)
