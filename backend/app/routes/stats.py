from flask import Blueprint, jsonify
from app.models.university import University, AdmissionRecord
from sqlalchemy import func
from datetime import datetime

bp = Blueprint('stats', __name__)

@bp.route('/api/universities/<int:id>/stats', methods=['GET'])
def get_university_stats(id):
    # 获取历年录取统计
    yearly_stats = db.session.query(
        AdmissionRecord.year,
        func.count(AdmissionRecord.id).label('total_applicants'),
        func.sum(case([(AdmissionRecord.admission_result == True, 1)], else_=0)).label('admitted')
    ).filter(
        AdmissionRecord.university_id == id
    ).group_by(
        AdmissionRecord.year
    ).all()
    
    # 获取专业录取统计
    program_stats = db.session.query(
        AdmissionRecord.program,
        func.count(AdmissionRecord.id).label('total_applicants'),
        func.sum(case([(AdmissionRecord.admission_result == True, 1)], else_=0)).label('admitted')
    ).filter(
        AdmissionRecord.university_id == id
    ).group_by(
        AdmissionRecord.program
    ).all()
    
    # 获取分数分布
    score_distribution = db.session.query(
        func.floor(AdmissionRecord.gpa * 2) / 2,
        func.count(AdmissionRecord.id)
    ).filter(
        AdmissionRecord.university_id == id
    ).group_by(
        func.floor(AdmissionRecord.gpa * 2) / 2
    ).all()
    
    return jsonify({
        'yearlyStats': [{
            'year': stat[0],
            'applicants': stat[1],
            'admissionRate': stat[2] / stat[1] if stat[1] > 0 else 0
        } for stat in yearly_stats],
        
        'programStats': [{
            'program': stat[0],
            'totalApplicants': stat[1],
            'admittedCount': stat[2]
        } for stat in program_stats],
        
        'scoreDistribution': [{
            'name': f'GPA {stat[0]}-{stat[0]+0.5}',
            'value': stat[1]
        } for stat in score_distribution]
    })
