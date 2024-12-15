from app.models.university import AdmissionRecord
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

def prepare_features(university_id, program, gpa, toefl, ielts, gre, research_exp, internship_exp):
    """准备特征数据"""
    features = []
    
    # 如果提供了TOEFL成绩
    if toefl:
        english_score = toefl
    # 如果提供了IELTS成绩，转换为等效的TOEFL分数
    elif ielts:
        english_score = ielts * 8.5  # 简单的转换公式，可以根据需要调整
    else:
        english_score = 0
    
    features = [
        gpa,
        english_score,
        gre if gre else 0,
        1 if research_exp else 0,
        1 if internship_exp else 0
    ]
    
    return np.array(features).reshape(1, -1)

def train_model(university_id, program):
    """训练预测模型"""
    # 获取历史录取数据
    records = AdmissionRecord.query.filter_by(
        university_id=university_id,
        program=program
    ).all()
    
    if not records:
        return None
    
    # 准备训练数据
    X = []
    y = []
    
    for record in records:
        features = prepare_features(
            record.university_id,
            record.program,
            record.gpa,
            record.toefl,
            record.ielts,
            record.gre,
            record.research_experience,
            record.internship_experience
        )
        X.append(features[0])
        y.append(record.admission_result)
    
    X = np.array(X)
    y = np.array(y)
    
    # 标准化特征
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # 训练模型
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_scaled, y)
    
    return model, scaler

def predict_admission_chance(university_id, program, gpa, toefl, ielts, gre, 
                           research_exp, internship_exp):
    """预测录取概率"""
    # 获取或训练模型
    model_data = train_model(university_id, program)
    
    if not model_data:
        # 如果没有足够的历史数据，返回基于简单规则的预测
        return calculate_basic_probability(gpa, toefl, ielts, gre, 
                                        research_exp, internship_exp)
    
    model, scaler = model_data
    
    # 准备特征数据
    features = prepare_features(university_id, program, gpa, toefl, ielts, gre,
                              research_exp, internship_exp)
    
    # 标准化特征
    features_scaled = scaler.transform(features)
    
    # 预测概率
    probability = model.predict_proba(features_scaled)[0][1]
    
    return float(probability)

def calculate_basic_probability(gpa, toefl, ielts, gre, research_exp, internship_exp):
    """基于简单规则的概率计算"""
    base_score = 0.0
    
    # GPA评分（满分0.4）
    if gpa >= 3.7:
        base_score += 0.4
    elif gpa >= 3.3:
        base_score += 0.3
    elif gpa >= 3.0:
        base_score += 0.2
    else:
        base_score += 0.1
    
    # 语言成绩评分（满分0.3）
    if toefl:
        if toefl >= 100:
            base_score += 0.3
        elif toefl >= 90:
            base_score += 0.2
        else:
            base_score += 0.1
    elif ielts:
        if ielts >= 7.0:
            base_score += 0.3
        elif ielts >= 6.5:
            base_score += 0.2
        else:
            base_score += 0.1
    
    # GRE评分（满分0.1）
    if gre:
        if gre >= 320:
            base_score += 0.1
        elif gre >= 310:
            base_score += 0.07
        else:
            base_score += 0.05
    
    # 经历评分（满分0.2）
    experience_score = 0
    if research_exp:
        experience_score += 0.1
    if internship_exp:
        experience_score += 0.1
    base_score += experience_score
    
    return base_score
