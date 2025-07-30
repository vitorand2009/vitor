from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# Dados simulados para charutos (em produção, você usaria um banco de dados)
charutos_data = [
    {
        "id": 1,
        "nome": "Cohiba Robusto",
        "marca": "Cohiba",
        "origem": "Cuba",
        "tamanho": "Robusto",
        "preco": 45.00,
        "estoque": 10
    },
    {
        "id": 2,
        "nome": "Montecristo No. 2",
        "marca": "Montecristo",
        "origem": "Cuba",
        "tamanho": "Torpedo",
        "preco": 35.00,
        "estoque": 15
    }
]

@app.route('/api/charutos', methods=['GET'])
def get_charutos():
    return jsonify(charutos_data)

@app.route('/api/charutos', methods=['POST'])
def add_charuto():
    data = request.get_json()
    new_id = max([c['id'] for c in charutos_data]) + 1 if charutos_data else 1
    new_charuto = {
        "id": new_id,
        "nome": data.get('nome'),
        "marca": data.get('marca'),
        "origem": data.get('origem'),
        "tamanho": data.get('tamanho'),
        "preco": data.get('preco'),
        "estoque": data.get('estoque')
    }
    charutos_data.append(new_charuto)
    return jsonify(new_charuto), 201

def handler(request):
    return app(request.environ, lambda status, headers: None)
