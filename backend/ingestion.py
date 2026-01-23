
import csv
import os
from datetime import datetime
from backend.db import db, Patient, MedicalRecord, LabResult
from flask import current_app

def process_csv(filepath):
    """
    Parses the CSV file and updates the database with patient records.
    Supports both legacy and detailed CSV formats.
    """
    try:
        with open(filepath, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            med_record_cache = {} # Cache to prevent duplicate records for same day
            
            for row in reader:
                # 1. Find or Create Patient
                patient_name = row.get("Patient Name")
                if not patient_name:
                    continue

                patient = Patient.query.filter_by(name=patient_name).first()
                if not patient:
                    # Create new patient if not exists
                    try:
                        age = int(row.get("Age", 30))
                    except:
                        age = 30
                        
                    patient = Patient(
                        name=patient_name,
                        age=age,
                        gender=row.get("Gender", "Unknown"),
                        contact_info=row.get("Phone") or row.get("Contact") or "N/A",
                        address=row.get("Address", "N/A")
                    )
                    db.session.add(patient)
                    db.session.commit() # Commit to get ID

                # 2. Parse Date
                date_str = row.get("Visit Date") or row.get("Date")
                try:
                    record_date = datetime.strptime(date_str, "%Y-%m-%d")
                except:
                    record_date = datetime.utcnow()

                # 3. Insert Record based on Test Type
                test_type = row.get("Test Name") or row.get("Test Type")
                result_val_str = row.get("Result Value") or row.get("Result")
                unit = row.get("Unit")
                ref_range = row.get("Reference Range", "N/A")
                flag = row.get("Status") or row.get("Flag", "Normal")

                if not test_type or not result_val_str:
                    continue

                # Handle Vitals (BP, HR, Temp)
                # Map standard names
                vitals_map = {
                    "Systolic BP": "systolic_bp",
                    "Diastolic BP": "diastolic_bp",
                    "Heart Rate": "heart_rate",
                    "Body Temperature": "temperature"
                }

                if test_type in vitals_map:
                    # Use a cache key for the patient/date combo
                    cache_key = (patient.id, record_date.date())
                    
                    if cache_key in med_record_cache:
                        med_record = med_record_cache[cache_key]
                    else:
                        # Check DB first
                        med_record = MedicalRecord.query.filter_by(patient_id=patient.id, date=record_date).first()
                        if not med_record:
                            med_record = MedicalRecord(patient_id=patient.id, date=record_date)
                            db.session.add(med_record)
                        med_record_cache[cache_key] = med_record
                    
                    try:
                        if test_type == "Body Temperature":
                             med_record.temperature = float(result_val_str)
                        else:
                             val = int(float(result_val_str))
                             if test_type == "Systolic BP":
                                 med_record.systolic_bp = val
                             elif test_type == "Diastolic BP":
                                 med_record.diastolic_bp = val
                             elif test_type == "Heart Rate":
                                 med_record.heart_rate = val
                    except:
                        pass
                
                # Handle Labs (everything else, including O2Sat, RR if they don't fit in MedicalRecord)
                else:
                    # Check if lab result exists to avoid dupes? 
                    # For now, just add.
                    lab_result = LabResult(
                        patient_id=patient.id,
                        date=record_date,
                        test_type=test_type,
                        result_value=float(result_val_str) if result_val_str.replace('.','',1).isdigit() else 0.0,
                        unit=unit,
                        reference_range=ref_range,
                        flag=flag
                    )
                    db.session.add(lab_result)
                    
                # Optional: Handle Doctor Notes if present and unique?
                # For simplicity, we skip creating DoctorNote from CSV rows to avoid spamming 
                # hundreds of notes for one visit.
                # Only if "Notes" column has substantial text? 
                # Let's leave it for now.

            db.session.commit()
            print(f"Successfully processed CSV: {filepath}")
            return True

    except Exception as e:
        print(f"Error processing CSV: {e}")
        db.session.rollback()
        return False
