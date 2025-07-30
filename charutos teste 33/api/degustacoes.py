from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Dados simulados para degustações (em produção, você usaria um banco de dados)
degustacoes_data = []

@app.route('/api/degustacoes', methods=['GET'])
def get_degustacoes():
    return jsonify(degustacoes_data)

@app.route('/api/degustacoes', methods=['POST'])
def add_degustacao():
    data = request.get_json()
    new_id = max([d['id'] for d in degustacoes_data]) + 1 if degustacoes_data else 1
    new_degustacao = {
        "id": new_id,
        "charuto_id": data.get('charuto_id'),
        "data": datetime.now().isoformat(),
        "notas": data.get('notas'),
        "avaliacao": data.get('avaliacao'),
        "ambiente": data.get('ambiente'),
        "acompanhamento": data.get('acompanhamento')
    }
    degustacoes_data.append(new_degustacao)
    return jsonify(new_degustacao), 201

def handler(request):
    return app(request.environ, lambda status, headers: None)
