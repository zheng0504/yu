from app import db
from datetime import datetime

class University(db.Model):
    __tablename__ = 'universities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100))
    ranking = db.Column(db.Integer)
    acceptance_rate = db.Column(db.Float)
    tuition = db.Column(db.Float)
    programs = db.Column(db.JSON)
    requirements = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AdmissionRecord(db.Model):
    __tablename__ = 'admission_records'
    
    id = db.Column(db.Integer, primary_key=True)
    university_id = db.Column(db.Integer, db.ForeignKey('universities.id'))
    gpa = db.Column(db.Float)
    toefl = db.Column(db.Integer)
    ielts = db.Column(db.Float)
    gre = db.Column(db.Integer)
    research_experience = db.Column(db.Boolean)
    internship_experience = db.Column(db.Boolean)
    admission_result = db.Column(db.Boolean)
    program = db.Column(db.String(100))
    year = db.Column(db.Integer)
