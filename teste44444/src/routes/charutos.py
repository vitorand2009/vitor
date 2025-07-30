from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from src.models.user import db
from src.models.charuto import Charuto
from datetime import datetime
import os
import uuid

charutos_bp = Blueprint('charutos', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@charutos_bp.route('/charutos', methods=['GET'])
def get_charutos():
    """Listar todos os charutos"""
    try:
        charutos = Charuto.query.all()
        return jsonify([charuto.to_dict() for charuto in charutos]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@charutos_bp.route('/charutos/<int:charuto_id>', methods=['GET'])
def get_charuto(charuto_id):
    """Obter um charuto específico"""
    try:
        charuto = Charuto.query.get_or_404(charuto_id)
        return jsonify(charuto.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@charutos_bp.route('/charutos', methods=['POST'])
def create_charuto():
    """Criar um novo charuto"""
    try:
        # Verificar se é multipart/form-data (com arquivo) ou JSON
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form.to_dict()
        else:
            data = request.get_json()
        
        # Validação básica
        if not data.get('nome'):
            return jsonify({'error': 'Nome é obrigatório'}), 400
        
        # Processar upload de foto se existir
        foto_filename = None
        if 'foto_charuto' in request.files:
            file = request.files['foto_charuto']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Adicionar timestamp para evitar conflitos
                filename = f"{uuid.uuid4()}_{filename}"
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(file_path)
                foto_filename = filename
        
        # Converter data de aquisição se fornecida
        data_aquisicao = None
        if data.get('data_aquisicao'):
            try:
                data_aquisicao = datetime.strptime(data['data_aquisicao'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        charuto = Charuto(
            nome=data['nome'],
            bitola=data.get('bitola'),
            pais=data.get('pais'),
            valor_pago=float(data.get('valor_pago', 0)) if data.get('valor_pago') else None,
            data_aquisicao=data_aquisicao,
            quantidade_estoque=int(data.get('quantidade_estoque', 1)),
            foto_charuto=foto_filename
        )
        
        db.session.add(charuto)
        db.session.commit()
        
        return jsonify(charuto.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@charutos_bp.route('/charutos/<int:charuto_id>', methods=['PUT'])
def update_charuto(charuto_id):
    """Atualizar um charuto"""
    try:
        charuto = Charuto.query.get_or_404(charuto_id)
        
        # Verificar se é multipart/form-data (com arquivo) ou JSON
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form.to_dict()
        else:
            data = request.get_json()
        
        # Processar upload de nova foto se existir
        if 'foto_charuto' in request.files:
            file = request.files['foto_charuto']
            if file and file.filename != '' and allowed_file(file.filename):
                # Remover foto antiga se existir
                if charuto.foto_charuto:
                    old_file_path = os.path.join(UPLOAD_FOLDER, charuto.foto_charuto)
                    if os.path.exists(old_file_path):
                        os.remove(old_file_path)
                
                filename = secure_filename(file.filename)
                filename = f"{uuid.uuid4()}_{filename}"
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(file_path)
                charuto.foto_charuto = filename
        
        # Atualizar outros campos
        if 'nome' in data:
            charuto.nome = data['nome']
        if 'bitola' in data:
            charuto.bitola = data['bitola']
        if 'pais' in data:
            charuto.pais = data['pais']
        if 'valor_pago' in data:
            charuto.valor_pago = float(data['valor_pago']) if data['valor_pago'] else None
        if 'quantidade_estoque' in data:
            charuto.quantidade_estoque = int(data['quantidade_estoque'])
        if 'data_aquisicao' in data:
            if data['data_aquisicao']:
                try:
                    charuto.data_aquisicao = datetime.strptime(data['data_aquisicao'], '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
            else:
                charuto.data_aquisicao = None
        
        db.session.commit()
        return jsonify(charuto.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@charutos_bp.route('/charutos/<int:charuto_id>', methods=['DELETE'])
def delete_charuto(charuto_id):
    """Deletar um charuto"""
    try:
        charuto = Charuto.query.get_or_404(charuto_id)
        
        # Remover foto se existir
        if charuto.foto_charuto:
            file_path = os.path.join(UPLOAD_FOLDER, charuto.foto_charuto)
            if os.path.exists(file_path):
                os.remove(file_path)
        
        db.session.delete(charuto)
        db.session.commit()
        return jsonify({'message': 'Charuto deletado com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@charutos_bp.route('/charutos/search', methods=['GET'])
def search_charutos():
    """Buscar charutos por nome, país ou bitola"""
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify([]), 200
        
        charutos = Charuto.query.filter(
            db.or_(
                Charuto.nome.ilike(f'%{query}%'),
                Charuto.pais.ilike(f'%{query}%'),
                Charuto.bitola.ilike(f'%{query}%')
            )
        ).all()
        
        return jsonify([charuto.to_dict() for charuto in charutos]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
