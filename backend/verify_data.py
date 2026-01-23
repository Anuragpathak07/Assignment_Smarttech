from backend.app import app
from backend.db import db, Patient

def verify_data():
    with app.app_context():
        patients = Patient.query.all()
        print(f"Total Patients: {len(patients)}")
        
        if patients:
            p = patients[0]
            print(f"\n--- Patient: {p.name} ({p.age} {p.gender}) ---")
            print(f"Vitals Records: {len(p.medical_records)}")
            print(f"Lab Results: {len(p.lab_results)}")
            print(f"Imaging Records: {len(p.imaging_records)}")
            print(f"Genomic Data: {len(p.genomic_data)}")
            print(f"Doctor Notes: {len(p.doctor_notes)}")
            
            if p.lab_results:
                print(f"Sample Lab: {p.lab_results[0].test_type} = {p.lab_results[0].result_value}")

if __name__ == '__main__':
    verify_data()
