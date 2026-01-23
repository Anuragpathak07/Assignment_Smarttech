from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    contact_info = db.Column(db.String(200))
    address = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    medical_records = db.relationship('MedicalRecord', backref='patient', lazy=True)
    lab_results = db.relationship('LabResult', backref='patient', lazy=True)
    imaging_records = db.relationship('ImagingRecord', backref='patient', lazy=True)
    genomic_data = db.relationship('GenomicData', backref='patient', lazy=True)
    doctor_notes = db.relationship('DoctorNote', backref='patient', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'contact_info': self.contact_info,
            'address': self.address
        }

class MedicalRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    systolic_bp = db.Column(db.Integer)
    diastolic_bp = db.Column(db.Integer)
    heart_rate = db.Column(db.Integer)
    temperature = db.Column(db.Float)
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'systolic_bp': self.systolic_bp,
            'diastolic_bp': self.diastolic_bp,
            'heart_rate': self.heart_rate,
            'temperature': self.temperature
        }

class LabResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    test_type = db.Column(db.String(50)) # e.g. "Cholesterol", "A1C"
    result_value = db.Column(db.Float)
    unit = db.Column(db.String(20))
    reference_range = db.Column(db.String(50))
    flag = db.Column(db.String(20)) # e.g., "High", "Normal"

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'test_type': self.test_type,
            'result_value': self.result_value,
            'unit': self.unit,
            'flag': self.flag
        }

class ImagingRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    modality = db.Column(db.String(50)) # X-Ray, MRI, CT
    body_part = db.Column(db.String(50))
    image_url = db.Column(db.String(200)) # Placeholder URL
    radiologist_report = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'modality': self.modality,
            'body_part': self.body_part,
            'image_url': self.image_url,
            'radiologist_report': self.radiologist_report
        }

class GenomicData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    gene_marker = db.Column(db.String(50))
    variant = db.Column(db.String(50))
    risk_association = db.Column(db.String(100))
    significance = db.Column(db.String(50)) # "Benign", "Pathogenic"

    def to_dict(self):
        return {
            'id': self.id,
            'gene_marker': self.gene_marker,
            'variant': self.variant,
            'risk_association': self.risk_association,
            'significance': self.significance
        }

class DoctorNote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    doctor_name = db.Column(db.String(100))
    note_content = db.Column(db.Text)
    sentiment = db.Column(db.String(50)) # "Stable", "Deteriorating", "Improving" (Predicted or Manual)

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'doctor_name': self.doctor_name,
            'note_content': self.note_content,
            'sentiment': self.sentiment
        }

class AIAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.id'), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    summary = db.Column(db.Text)
    agent_details = db.Column(db.JSON)

    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat(),
            'summary': self.summary,
            'agent_details': self.agent_details
        }
