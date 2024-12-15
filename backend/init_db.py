from app import create_app, db
from app.models.university import University, AdmissionRecord
from app.models.user import User
from app.models.statement import PersonalStatement
import json
from datetime import datetime

app = create_app()

def init_db():
    with app.app_context():
        # 创建所有表
        db.create_all()
        
        # 如果大学表为空，添加示例数据
        if University.query.count() == 0:
            universities = [
                {
                    'name': '哈佛大学',
                    'location': '美国',
                    'ranking': 1,
                    'acceptance_rate': 0.045,
                    'tuition': 51925,
                    'programs': ['计算机科学', '工商管理', '经济学'],
                    'requirements': '托福最低100，GPA 3.5以上'
                },
                {
                    'name': '斯坦福大学',
                    'location': '美国',
                    'ranking': 2,
                    'acceptance_rate': 0.043,
                    'tuition': 52857,
                    'programs': ['计算机科学', '工程学', '心理学'],
                    'requirements': '托福最低100，GPA 3.5以上'
                },
                {
                    'name': '剑桥大学',
                    'location': '英国',
                    'ranking': 3,
                    'acceptance_rate': 0.21,
                    'tuition': 39827,
                    'programs': ['数学', '物理', '工程学'],
                    'requirements': 'IELTS最低7.0，优秀的学术背景'
                }
            ]
            
            for uni_data in universities:
                uni = University(**uni_data)
                db.session.add(uni)
            
            # 添加示例录取记录
            admission_records = [
                {
                    'university_id': 1,
                    'gpa': 3.9,
                    'toefl': 110,
                    'gre': 325,
                    'research_experience': True,
                    'internship_experience': True,
                    'admission_result': True,
                    'program': '计算机科学',
                    'year': 2023
                },
                {
                    'university_id': 1,
                    'gpa': 3.7,
                    'toefl': 105,
                    'gre': 320,
                    'research_experience': False,
                    'internship_experience': True,
                    'admission_result': False,
                    'program': '计算机科学',
                    'year': 2023
                }
            ]
            
            for record in admission_records:
                adm = AdmissionRecord(**record)
                db.session.add(adm)
            
            db.session.commit()
            print("示例数据添加成功！")

if __name__ == '__main__':
    init_db()
