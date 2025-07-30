from flask import Blueprint, jsonify
from ..models.charuto import Charuto
from ..models.degustacao import Degustacao
from .. import db
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Obter estatísticas para o dashboard"""
    try:
        # Total de charutos no estoque
        total_charutos = db.session.query(func.sum(Charuto.quantidade_estoque)).scalar() or 0
        
        # Total de degustações finalizadas
        total_degustacoes = Degustacao.query.filter_by(status='finalizada').count()
        
        # Média de notas
        media_notas = db.session.query(func.avg(Degustacao.nota)).filter(
            Degustacao.status == 'finalizada',
            Degustacao.nota.isnot(None)
        ).scalar()
        media_notas = round(media_notas, 1) if media_notas else 0
        
        # Charuto favorito (mais degustado)
        charuto_favorito = db.session.query(
            Charuto.nome,
            func.count(Degustacao.id).label('count')
        ).join(Degustacao).filter(
            Degustacao.status == 'finalizada'
        ).group_by(Charuto.id, Charuto.nome).order_by(
            func.count(Degustacao.id).desc()
        ).first()
        
        charuto_favorito_nome = charuto_favorito[0] if charuto_favorito else "Nenhum"
        charuto_favorito_count = charuto_favorito[1] if charuto_favorito else 0
        
        # Principais sabores
        sabores_stats = {}
        degustacoes_finalizadas = Degustacao.query.filter_by(status='finalizada').all()
        
        sabores = [
            'sabor_tabaco', 'sabor_pimenta', 'sabor_terroso', 'sabor_flores',
            'sabor_cafe', 'sabor_frutas', 'sabor_chocolate', 'sabor_castanhas', 'sabor_madeira'
        ]
        
        for sabor in sabores:
            count = sum(1 for deg in degustacoes_finalizadas if getattr(deg, sabor, False))
            sabor_nome = sabor.replace('sabor_', '').capitalize()
            sabores_stats[sabor_nome] = count
        
        # Ordenar sabores por frequência
        sabores_ordenados = sorted(sabores_stats.items(), key=lambda x: x[1], reverse=True)
        
        return jsonify({
            'total_charutos': int(total_charutos),
            'total_degustacoes': total_degustacoes,
            'media_notas': media_notas,
            'charuto_favorito': {
                'nome': charuto_favorito_nome,
                'count': charuto_favorito_count
            },
            'sabores': dict(sabores_ordenados)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
