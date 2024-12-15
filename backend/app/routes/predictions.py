from flask import Blueprint, request, jsonify
from app.models.university import University, AdmissionRecord
from app.services.prediction_service import predict_admission_chance
from flask_jwt_extended import jwt_required

bp = Blueprint('predictions', __name__)

@bp.route('/api/predict/admission', methods=['POST'])
@jwt_required()
def predict_admission():
    data = request.get_json()
    
    # 获取预测所需的数据
    university_id = data.get('university_id')
    program = data.get('program')
    gpa = data.get('gpa')
    toefl = data.get('toefl')
    ielts = data.get('ielts')
    gre = data.get('gre')
    research_experience = data.get('research_experience')
    internship_experience = data.get('internship_experience')
    
    # 预测录取概率
    probability = predict_admission_chance(
        university_id,
        program,
        gpa,
        toefl,
        ielts,
        gre,
        research_experience,
        internship_experience
    )
    
    return jsonify({
        'admission_probability': probability,
        'university_id': university_id,
        'program': program
    })
