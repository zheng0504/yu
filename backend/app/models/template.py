from app import db
from datetime import datetime

class StatementTemplate(db.Model):
    __tablename__ = 'statement_templates'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    tags = db.Column(db.JSON)  # 存储标签列表
    usage_count = db.Column(db.Integer, default=0)
    is_premium = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'description': self.description,
            'tags': self.tags,
            'usage_count': self.usage_count,
            'is_premium': self.is_premium,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
