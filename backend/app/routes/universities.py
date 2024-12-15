from flask import Blueprint, request, jsonify
from app.models.university import University
from app import db

bp = Blueprint('universities', __name__)

@bp.route('/api/universities', methods=['GET'])
def get_universities():
    # 获取查询参数
    ranking_min = request.args.get('ranking_min', type=int)
    ranking_max = request.args.get('ranking_max', type=int)
    location = request.args.get('location')
    program = request.args.get('program')
    
    # 构建查询
    query = University.query
    
    if ranking_min is not None:
        query = query.filter(University.ranking >= ranking_min)
    if ranking_max is not None:
        query = query.filter(University.ranking <= ranking_max)
    if location:
        query = query.filter(University.location.ilike(f'%{location}%'))
    if program:
        query = query.filter(University.programs.contains([program]))
    
    universities = query.all()
    return jsonify([{
        'id': u.id,
        'name': u.name,
        'location': u.location,
        'ranking': u.ranking,
        'acceptance_rate': u.acceptance_rate,
        'tuition': u.tuition,
        'programs': u.programs
    } for u in universities])

@bp.route('/api/universities/<int:id>', methods=['GET'])
def get_university(id):
    university = University.query.get_or_404(id)
    return jsonify({
        'id': university.id,
        'name': university.name,
        'location': university.location,
        'ranking': university.ranking,
        'acceptance_rate': university.acceptance_rate,
        'tuition': university.tuition,
        'programs': university.programs,
        'requirements': university.requirements
    })
