from src.models.user import db
from datetime import datetime

class Degustacao(db.Model):
    __tablename__ = 'degustacoes'
    
    id = db.Column(db.Integer, primary_key=True)
    charuto_id = db.Column(db.Integer, db.ForeignKey('charutos.id'), nullable=False)
    data_degustacao = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    momento = db.Column(db.String(50))  # sozinho/confraternizando
    duracao_minutos = db.Column(db.Integer)
    nota = db.Column(db.Integer)  # 1-10
    construcao_queima = db.Column(db.Text)  # Agora campo aberto
    compraria_novamente = db.Column(db.String(50))  # sim/não/depende do preço
    
    # Características físicas
    folha_anilhada = db.Column(db.Text)  # Agora campo aberto
    corte = db.Column(db.String(50))  # reto/V/furado
    fluxo = db.Column(db.String(50))  # solto/médio/preso
    
    # Roda de sabores (boolean para cada sabor)
    sabor_tabaco = db.Column(db.Boolean, default=False)
    sabor_pimenta = db.Column(db.Boolean, default=False)
    sabor_terroso = db.Column(db.Boolean, default=False)
    sabor_flores = db.Column(db.Boolean, default=False)
    sabor_cafe = db.Column(db.Boolean, default=False)
    sabor_frutas = db.Column(db.Boolean, default=False)
    sabor_chocolate = db.Column(db.Boolean, default=False)
    sabor_castanhas = db.Column(db.Boolean, default=False)
    sabor_madeira = db.Column(db.Boolean, default=False)
    
    # Observações e foto da anilha
    observacoes = db.Column(db.Text)
    observacao_anilha = db.Column(db.Text)  # Novo campo para observação ou colar anilha
    foto_anilha = db.Column(db.String(255))  # Novo campo para foto da anilha
    
    # Status da degustação (para controlar os 2 momentos)
    status = db.Column(db.String(20), default='em_andamento')  # em_andamento/finalizada
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Degustacao {self.id} - Charuto {self.charuto_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'charuto_id': self.charuto_id,
            'data_degustacao': self.data_degustacao.isoformat() if self.data_degustacao else None,
            'momento': self.momento,
            'duracao_minutos': self.duracao_minutos,
            'nota': self.nota,
            'construcao_queima': self.construcao_queima,
            'compraria_novamente': self.compraria_novamente,
            'folha_anilhada': self.folha_anilhada,
            'corte': self.corte,
            'fluxo': self.fluxo,
            'sabor_tabaco': self.sabor_tabaco,
            'sabor_pimenta': self.sabor_pimenta,
            'sabor_terroso': self.sabor_terroso,
            'sabor_flores': self.sabor_flores,
            'sabor_cafe': self.sabor_cafe,
            'sabor_frutas': self.sabor_frutas,
            'sabor_chocolate': self.sabor_chocolate,
            'sabor_castanhas': self.sabor_castanhas,
            'sabor_madeira': self.sabor_madeira,
            'observacoes': self.observacoes,
            'observacao_anilha': self.observacao_anilha,
            'foto_anilha': self.foto_anilha,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
