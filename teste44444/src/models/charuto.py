from src.models.user import db

class Charuto(db.Model):
    __tablename__ = 'charutos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    bitola = db.Column(db.String(50))
    pais = db.Column(db.String(50))
    valor_pago = db.Column(db.Float)
    data_aquisicao = db.Column(db.Date)
    quantidade_estoque = db.Column(db.Integer, default=1)
    foto_charuto = db.Column(db.String(255))  # Novo campo para foto
    
    def to_dict(self):
        return {
            'id': self.id,
            'nome': self.nome,
            'bitola': self.bitola,
            'pais': self.pais,
            'valor_pago': self.valor_pago,
            'data_aquisicao': self.data_aquisicao.isoformat() if self.data_aquisicao else None,
            'quantidade_estoque': self.quantidade_estoque,
            'foto_charuto': self.foto_charuto
        }
