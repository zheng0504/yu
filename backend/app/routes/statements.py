from flask import Blueprint, request, jsonify
from app.models.statement import PersonalStatement
from app.services.statement_service import analyze_statement
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('statements', __name__)

@bp.route('/api/analyze/statement', methods=['POST'])
@jwt_required()
def analyze():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    content = data.get('content')
    category = data.get('category')
    
    # 分析文书
    analysis_result = analyze_statement(content, category)
    
    # 保存分析结果
    statement = PersonalStatement(
        user_id=user_id,
        content=content,
        category=category,
        score=analysis_result['score'],
        feedback=analysis_result['feedback']
    )
    
    db.session.add(statement)
    db.session.commit()
    
    return jsonify(analysis_result)

@bp.route('/api/statements/<int:id>', methods=['GET'])
@jwt_required()
def get_statement(id):
    statement = PersonalStatement.query.get_or_404(id)
    return jsonify({
        'id': statement.id,
        'content': statement.content,
        'category': statement.category,
        'score': statement.score,
        'feedback': statement.feedback,
        'created_at': statement.created_at,
        'updated_at': statement.updated_at
    })
