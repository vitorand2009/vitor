from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from src.models.user import db
from src.models.degustacao import Degustacao
from src.models.charuto import Charuto
from datetime import datetime
import os
import uuid

degustacoes_bp = Blueprint('degustacoes', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@degustacoes_bp.route('/degustacoes', methods=['GET'])
def get_degustacoes():
    """Listar todas as degustações"""
    try:
        degustacoes = Degustacao.query.all()
        result = []
        
        for degustacao in degustacoes:
            degustacao_dict = degustacao.to_dict()
            # Adicionar informações do charuto
            charuto = Charuto.query.get(degustacao.charuto_id)
            if charuto:
                degustacao_dict['charuto'] = charuto.to_dict()
            result.append(degustacao_dict)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@degustacoes_bp.route('/degustacoes/<int:degustacao_id>', methods=['GET'])
def get_degustacao(degustacao_id):
    """Obter uma degustação específica"""
    try:
        degustacao = Degustacao.query.get_or_404(degustacao_id)
        degustacao_dict = degustacao.to_dict()
        
        # Adicionar informações do charuto
        charuto = Charuto.query.get(degustacao.charuto_id)
        if charuto:
            degustacao_dict['charuto'] = charuto.to_dict()
        
        return jsonify(degustacao_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@degustacoes_bp.route('/degustacoes', methods=['POST'])
def create_degustacao():
    """Criar uma nova degustação (Momento 1 - Durante a fumaça)"""
    try:
        # Verificar se é multipart/form-data (com arquivo) ou JSON
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form.to_dict()
        else:
            data = request.get_json()
        
        # Validação básica
        if not data.get('charuto_id'):
            return jsonify({'error': 'Charuto é obrigatório'}), 400
        
        # Converter data de degustação se fornecida
        data_degustacao = datetime.now().date()
        if data.get('data_degustacao'):
            try:
                data_degustacao = datetime.strptime(data['data_degustacao'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Formato de data inválido. Use YYYY-MM-DD'}), 400
        
        degustacao = Degustacao(
            charuto_id=int(data['charuto_id']),
            data_degustacao=data_degustacao,
            momento=data.get('momento'),
            corte=data.get('corte'),
            fluxo=data.get('fluxo'),
            folha_anilhada=data.get('folha_anilhada'),
            status='em_andamento'  # Primeira fase da degustação
        )
        
        db.session.add(degustacao)
        db.session.commit()
        
        return jsonify(degustacao.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@degustacoes_bp.route('/degustacoes/<int:degustacao_id>/finalizar', methods=['PUT'])
def finalizar_degustacao(degustacao_id):
    """Finalizar uma degustação (Momento 2 - Após o término)"""
    try:
        degustacao = Degustacao.query.get_or_404(degustacao_id)
        
        # Verificar se é multipart/form-data (com arquivo) ou JSON
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form.to_dict()
        else:
            data = request.get_json()
        
        # Processar upload de foto da anilha se existir
        if 'foto_anilha' in request.files:
            file = request.files['foto_anilha']
            if file and file.filename != '' and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filename = f"{uuid.uuid4()}_{filename}"
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(file_path)
                degustacao.foto_anilha = filename
        
        # Atualizar campos da segunda fase
        if 'duracao_minutos' in data:
            degustacao.duracao_minutos = int(data['duracao_minutos']) if data['duracao_minutos'] else None
        if 'nota' in data:
            degustacao.nota = int(data['nota']) if data['nota'] else None
        if 'construcao_queima' in data:
            degustacao.construcao_queima = data['construcao_queima']
        if 'compraria_novamente' in data:
            degustacao.compraria_novamente = data['compraria_novamente']
        
        # Roda de sabores
        degustacao.sabor_tabaco = data.get('sabor_tabaco') == 'true' or data.get('sabor_tabaco') == True
        degustacao.sabor_pimenta = data.get('sabor_pimenta') == 'true' or data.get('sabor_pimenta') == True
        degustacao.sabor_terroso = data.get('sabor_terroso') == 'true' or data.get('sabor_terroso') == True
        degustacao.sabor_flores = data.get('sabor_flores') == 'true' or data.get('sabor_flores') == True
        degustacao.sabor_cafe = data.get('sabor_cafe') == 'true' or data.get('sabor_cafe') == True
        degustacao.sabor_frutas = data.get('sabor_frutas') == 'true' or data.get('sabor_frutas') == True
        degustacao.sabor_chocolate = data.get('sabor_chocolate') == 'true' or data.get('sabor_chocolate') == True
        degustacao.sabor_castanhas = data.get('sabor_castanhas') == 'true' or data.get('sabor_castanhas') == True
        degustacao.sabor_madeira = data.get('sabor_madeira') == 'true' or data.get('sabor_madeira') == True
        
        # Observações
        if 'observacoes' in data:
            degustacao.observacoes = data['observacoes']
        if 'observacao_anilha' in data:
            degustacao.observacao_anilha = data['observacao_anilha']
        
        # Marcar como finalizada
        degustacao.status = 'finalizada'
        
        db.session.commit()
        return jsonify(degustacao.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@degustacoes_bp.route('/degustacoes/<int:degustacao_id>', methods=['PUT'])
def update_degustacao(degustacao_id):
    """Atualizar uma degustação (compatibilidade com versão anterior)"""
    try:
        degustacao = Degustacao.query.get_or_404(degustacao_id)
        
        # Verificar se é multipart/form-data (com arquivo) ou JSON
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form.to_dict()
        else:
            data = request.get_json()
        
        # Processar upload de foto da anilha se existir
        if 'foto_anilha' in request.files:
            file = request.files['foto_anilha']
            if file and file.filename != '' and allowed_file(file.filename):
                # Remover foto antiga se existir
                if degustacao.foto_anilha:
                    old_file_path = os.path.join(UPLOAD_FOLDER, degustacao.foto_anilha)
                    if os.path.exists(old_file_path):
                        os.remove(old_file_path)
                
                filename = secure_filename(file.filename)
                filename = f"{uuid.uuid4()}_{filename}"
                os.makedirs(UPLOAD_FOLDER, exist_ok=True)
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(file_path)
                degustacao.foto_anilha = filename
        
        # Atualizar campos básicos
        if 'momento' in data:
            degustacao.momento = data['momento']
        if 'duracao_minutos' in data:
            degustacao.duracao_minutos = int(data['duracao_minutos']) if data['duracao_minutos'] else None
        if 'nota' in data:
            degustacao.nota = int(data['nota']) if data['nota'] else None
        if 'construcao_queima' in data:
            degustacao.construcao_queima = data['construcao_queima']
        if 'compraria_novamente' in data:
            degustacao.compraria_novamente = data['compraria_novamente']
        if 'folha_anilhada' in data:
            degustacao.folha_anilhada = data['folha_anilhada']
        if 'corte' in data:
            degustacao.corte = data['corte']
        if 'fluxo' in data:
            degustacao.fluxo = data['fluxo']
        
        # Roda de sabores
        if 'sabor_tabaco' in data:
            degustacao.sabor_tabaco = data.get('sabor_tabaco') == 'true' or data.get('sabor_tabaco') == True
        if 'sabor_pimenta' in data:
            degustacao.sabor_pimenta = data.get('sabor_pimenta') == 'true' or data.get('sabor_pimenta') == True
        if 'sabor_terroso' in data:
            degustacao.sabor_terroso = data.get('sabor_terroso') == 'true' or data.get('sabor_terroso') == True
        if 'sabor_flores' in data:
            degustacao.sabor_flores = data.get('sabor_flores') == 'true' or data.get('sabor_flores') == True
        if 'sabor_cafe' in data:
            degustacao.sabor_cafe = data.get('sabor_cafe') == 'true' or data.get('sabor_cafe') == True
        if 'sabor_frutas' in data:
            degustacao.sabor_frutas = data.get('sabor_frutas') == 'true' or data.get('sabor_frutas') == True
        if 'sabor_chocolate' in data:
            degustacao.sabor_chocolate = data.get('sabor_chocolate') == 'true' or data.get('sabor_chocolate') == True
        if 'sabor_castanhas' in data:
            degustacao.sabor_castanhas = data.get('sabor_castanhas') == 'true' or data.get('sabor_castanhas') == True
        if 'sabor_madeira' in data:
            degustacao.sabor_madeira = data.get('sabor_madeira') == 'true' or data.get('sabor_madeira') == True
        
        # Observações
        if 'observacoes' in data:
            degustacao.observacoes = data['observacoes']
        if 'observacao_anilha' in data:
            degustacao.observacao_anilha = data['observacao_anilha']
        if 'status' in data:
            degustacao.status = data['status']
        
        db.session.commit()
        return jsonify(degustacao.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@degustacoes_bp.route('/degustacoes/<int:degustacao_id>', methods=['DELETE'])
def delete_degustacao(degustacao_id):
    """Deletar uma degustação"""
    try:
        degustacao = Degustacao.query.get_or_404(degustacao_id)
        
        # Remover foto da anilha se existir
        if degustacao.foto_anilha:
            file_path = os.path.join(UPLOAD_FOLDER, degustacao.foto_anilha)
            if os.path.exists(file_path):
                os.remove(file_path)
        
        db.session.delete(degustacao)
        db.session.commit()
        return jsonify({'message': 'Degustação deletada com sucesso'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@degustacoes_bp.route('/degustacoes/em-andamento', methods=['GET'])
def get_degustacoes_em_andamento():
    """Listar degustações em andamento"""
    try:
        degustacoes = Degustacao.query.filter_by(status='em_andamento').all()
        result = []
        
        for degustacao in degustacoes:
            degustacao_dict = degustacao.to_dict()
            # Adicionar informações do charuto
            charuto = Charuto.query.get(degustacao.charuto_id)
            if charuto:
                degustacao_dict['charuto'] = charuto.to_dict()
            result.append(degustacao_dict)
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
