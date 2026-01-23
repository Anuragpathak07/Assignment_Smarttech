import random
from faker import Faker
from datetime import datetime, timedelta
from backend.app import app
from backend.db import db, Patient, MedicalRecord, LabResult, ImagingRecord, GenomicData, DoctorNote

fake = Faker()

def seed_data():
    with app.app_context():
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()
        
        print("Generating synthetic patients...")
        # Create 5 synthetic patients
        for _ in range(5):
            gender = random.choice(['Male', 'Female'])
            first_name = fake.first_name_male() if gender == 'Male' else fake.first_name_female()
            last_name = fake.last_name()
            
            patient = Patient(
                name=f"{first_name} {last_name}",
                age=random.randint(25, 85),
                gender=gender,
                contact_info=fake.phone_number(),
                address=fake.address(),
                created_at=fake.date_time_between(start_date='-5y', end_date='now')
            )
            db.session.add(patient)
            db.session.commit()
            
            # Generate history for each patient (past 2 years)
            current_date = datetime.now()
            
            # 1. Vitals (Monthly)
            for i in range(24): 
                date = current_date - timedelta(days=i*30)
                record = MedicalRecord(
                    patient_id=patient.id,
                    date=date,
                    systolic_bp=random.randint(110, 160), # Trending towards high for some
                    diastolic_bp=random.randint(70, 100),
                    heart_rate=random.randint(60, 100),
                    temperature=round(random.uniform(36.5, 37.5), 1)
                )
                db.session.add(record)
                
            # 2. Lab Results (Quarterly)
            for i in range(8):
                date = current_date - timedelta(days=i*90)
                
                # Cholesterol
                ldl = random.randint(80, 180)
                db.session.add(LabResult(
                    patient_id=patient.id,
                    date=date,
                    test_type="LDL Cholesterol",
                    result_value=ldl,
                    unit="mg/dL",
                    reference_range="<100",
                    flag="High" if ldl > 130 else "Normal"
                ))
                
                # A1C
                a1c = round(random.uniform(4.5, 8.5), 1)
                db.session.add(LabResult(
                    patient_id=patient.id,
                    date=date,
                    test_type="Hemoglobin A1C",
                    result_value=a1c,
                    unit="%",
                    reference_range="<5.7",
                    flag="High" if a1c > 6.4 else ("Pre-diabetic" if a1c > 5.7 else "Normal")
                ))

            # 3. Imaging (Random occurrences)
            if random.random() > 0.5:
                modalities = ['X-Ray', 'MRI', 'CT Scan']
                body_parts = ['Chest', 'Brain', 'Knee', 'Spine']
                db.session.add(ImagingRecord(
                    patient_id=patient.id,
                    date=fake.date_time_between(start_date='-2y', end_date='now'),
                    modality=random.choice(modalities),
                    body_part=random.choice(body_parts),
                    image_url="https://via.placeholder.com/150", # Placeholder
                    radiologist_report=fake.paragraph()
                ))

            # 4. Genomics (One-time)
            if random.random() > 0.7:
                genes = ['BRCA1', 'BRCA2', 'TP53', 'APOE']
                db.session.add(GenomicData(
                    patient_id=patient.id,
                    gene_marker=random.choice(genes),
                    variant=f"rs{random.randint(1000, 9999)}",
                    risk_association="Increased risk",
                    significance="Pathogenic"
                ))
            
            # 5. Doctor Notes (Quarterly)
            for i in range(8):
                date = current_date - timedelta(days=i*90)
                sentiments = ["Stable", "Improving", "Deteriorating"]
                db.session.add(DoctorNote(
                    patient_id=patient.id,
                    date=date,
                    doctor_name=f"Dr. {fake.last_name()}",
                    note_content=fake.paragraph(nb_sentences=5),
                    sentiment=random.choice(sentiments)
                ))

            db.session.commit()
            print(f"Seeded data for patient: {patient.name}")

if __name__ == '__main__':
    seed_data()
