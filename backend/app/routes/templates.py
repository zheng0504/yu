from flask import Blueprint, request, jsonify
from app.models.template import StatementTemplate
from app import db
from flask_jwt_extended import jwt_required

bp = Blueprint('templates', __name__)

@bp.route('/api/templates', methods=['GET'])
def get_templates():
    category = request.args.get('category')
    tags = request.args.getlist('tags')
    
    query = StatementTemplate.query
    
    if category:
        query = query.filter_by(category=category)
    
    if tags:
        for tag in tags:
            query = query.filter(StatementTemplate.tags.contains([tag]))
    
    templates = query.order_by(StatementTemplate.usage_count.desc()).all()
    return jsonify([template.to_dict() for template in templates])

@bp.route('/api/templates/<int:id>', methods=['GET'])
def get_template(id):
    template = StatementTemplate.query.get_or_404(id)
    return jsonify(template.to_dict())

@bp.route('/api/templates/use', methods=['POST'])
@jwt_required()
def use_template():
    data = request.get_json()
    template_id = data.get('template_id')
    
    template = StatementTemplate.query.get_or_404(template_id)
    template.usage_count += 1
    db.session.commit()
    
    return jsonify({'message': '模板使用成功'})
