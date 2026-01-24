
import csv
import os
import pydicom
import pypdf
from datetime import datetime
from backend.db import db, Patient, MedicalRecord, LabResult, ImagingRecord, GenomicData, DoctorNote
from flask import current_app

def process_file(filepath):
    """
    Main entry point for file ingestion. Routes to specific parsers based on extension.
    """
    ext = os.path.splitext(filepath)[1].lower()
    
    if ext == '.csv':
        return _process_csv(filepath)
    elif ext == '.pdf':
        return _process_pdf(filepath)
    elif ext in ['.dcm', '.dicom', '.png', '.jpg', '.jpeg']: # DICOM + Images
        # For now, we only extract metadata from DICOM. 
        # PNG/JPG are just stored as records with no metadata extraction yet (placeholder)
        if ext in ['.dcm', '.dicom']:
             return _process_dicom(filepath)
        else:
             return _process_image_placeholder(filepath)
    elif ext == '.vcf':
        return _process_vcf(filepath)
    
    print(f"Unsupported file format: {ext}")
    return False

def _process_csv(filepath):
    """
    Parses the CSV file and updates the database with patient records.
    """
    try:
        with open(filepath, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            med_record_cache = {} 
            
            for row in reader:
                # 1. Find or Create Patient
                patient = _get_or_create_patient(row)
                if not patient: 
                    continue

                # 2. Parse Date
                record_date = _parse_date(row.get("Visit Date") or row.get("Date"))

                # 3. Insert Record based on Test Type
                test_type = row.get("Test Name") or row.get("Test Type")
                result_val_str = row.get("Result Value") or row.get("Result")
                unit = row.get("Unit")
                ref_range = row.get("Reference Range", "N/A")
                flag = row.get("Status") or row.get("Flag", "Normal")

                if not test_type or not result_val_str:
                    continue

                _handle_csv_record(patient, record_date, test_type, result_val_str, unit, ref_range, flag, med_record_cache)

            db.session.commit()
            print(f"Successfully processed CSV: {filepath}")
            return True

    except Exception as e:
        print(f"Error processing CSV: {e}")
        db.session.rollback()
        return False

def _process_pdf(filepath):
    """
    Extracts text from PDF and stores it as a DoctorNote.
    """
    try:
        reader = pypdf.PdfReader(filepath)
        text_content = ""
        
        for page in reader.pages:
            # Try layout mode for better structure, fallback to default
            try:
                page_text = page.extract_text(extraction_mode="layout")
            except:
                page_text = page.extract_text()
            
            if page_text:
                text_content += page_text + "\n"
        
        # Clean text
        text_content = text_content.strip()
        
        # Heuristic check for quality
        is_low_quality = False
        if len(text_content) < 50:
             is_low_quality = True
        
        # Heuristic to find patient name (Very basic)
        patient_name = "Unknown"
        lines = text_content.split('\n')
        for line in lines[:20]: # Check first 20 lines
            line_lower = line.lower()
            if "patient name:" in line_lower:
                parts = line.split(":", 1)
                if len(parts) > 1:
                    patient_name = parts[1].strip()
                    break
            elif "name:" in line_lower:
                 parts = line.split(":", 1)
                 if len(parts) > 1:
                    patient_name = parts[1].strip()
                    break
        
        if patient_name == "Unknown":
            filename = os.path.basename(filepath)
            possible_name = filename.split('_')[0]
            if possible_name: 
                 patient_name = possible_name
        
        patient = _get_or_create_patient({"Patient Name": patient_name})
        
        note_body = text_content[:5000]
        if is_low_quality:
            note_body += "\n\n[System Note: The extracted text received low confidence scores. The original PDF may be a scanned image or contain unsupported fonts.]"

        note = DoctorNote(
            patient_id=patient.id,
            date=datetime.utcnow(), 
            doctor_name="Extracted from PDF",
            note_content=note_body, 
            sentiment="Pending AI Analysis"
        )
        db.session.add(note)
        db.session.commit()
        print(f"Successfully processed PDF: {filepath}")
        return True

    except Exception as e:
        print(f"Error processing PDF: {e}")
        db.session.rollback()
        return False

    except Exception as e:
        print(f"Error processing PDF: {e}")
        db.session.rollback()
        return False

def _process_dicom(filepath):
    """
    Extracts metadata from DICOM and creates ImagingRecord.
    """
    try:
        ds = pydicom.dcmread(filepath)
        
        # Pydicom handles missing tags gracefully if accessed via .get() usually, 
        # but here we access direct attributes. wrapped in try block.
        patient_name = str(ds.PatientName) if 'PatientName' in ds else "Unknown"
        modality = ds.Modality if 'Modality' in ds else "Unknown"
        body_part = ds.BodyPartExamined if 'BodyPartExamined' in ds else "Unknown"
        study_date = ds.StudyDate if 'StudyDate' in ds else None
        
        parsed_date = datetime.utcnow()
        if study_date:
            try:
                parsed_date = datetime.strptime(study_date, "%Y%m%d")
            except:
                pass

        patient = _get_or_create_patient({"Patient Name": patient_name})

        # We don't save the image logic here (viewer handles raw file usually), 
        # but we save the record.
        record = ImagingRecord(
            patient_id=patient.id,
            date=parsed_date,
            modality=modality,
            body_part=body_part,
            image_url=filepath, # Local path for now
            radiologist_report="DICOM Header Extracted." 
        )
        db.session.add(record)
        db.session.commit()
        print(f"Successfully processed DICOM: {filepath}")
        return True

    except Exception as e:
        print(f"Error processing DICOM: {e}")
        db.session.rollback()
        return False

def _process_vcf(filepath):
    """
    Parses VCF for Genomic Data.
    """
    try:
        # Very simple VCF parser
        # Finds lines without # and assumes standard columns: 
        # #CHROM POS ID REF ALT QUAL FILTER INFO ...
        
        # We need a patient to attach to. VCF header often has sample ID.
        # last header line: #CHROM ... FORMAT [SampleID]
        
        patient_name = "genomics_patient"
        variants_found = 0
        
        with open(filepath, 'r') as f:
            lines = f.readlines()
            
        header_found = False
        columns = []
        
        for line in lines:
            line = line.strip()
            if line.startswith("##"):
                continue
            if line.startswith("#CHROM"):
                header_found = True
                columns = line.split('\t')
                if len(columns) > 9:
                    patient_name = columns[9] # First sample
                continue
            
            if not header_found: 
                continue
                
            # Data line
            parts = line.split('\t')
            if len(parts) < 5: continue
            
            chrom = parts[0]
            pos = parts[1]
            ref = parts[3]
            alt = parts[4]
            info = parts[7]
            
            # Create patient specific to this VCF if not exists
            patient = _get_or_create_patient({"Patient Name": patient_name})
            
            # Simple risk mapping for demo
            risk = "Unknown"
            significance = "Variant of Uncertain Significance"
            
            if "BRCA" in info or "Risk" in info:
                risk = "Cancer Susceptibility"
                significance = "Pathogenic"
            
            genomic_data = GenomicData(
                patient_id=patient.id,
                gene_marker=f"{chrom}:{pos}",
                variant=f"{ref}>{alt}",
                risk_association=risk,
                significance=significance
            )
            db.session.add(genomic_data)
            variants_found += 1
            if variants_found > 50: break # Limit for demo
            
        db.session.commit()
        print(f"Successfully processed VCF: {filepath} ({variants_found} variants)")
        return True

    except Exception as e:
        print(f"Error processing VCF: {e}")
        db.session.rollback()
        return False

def _process_image_placeholder(filepath):
    # Placeholder for standard images (just treat as misc imaging)
    try:
        filename = os.path.basename(filepath)
        patient_name = filename.split('_')[0]
        patient = _get_or_create_patient({"Patient Name": patient_name})
        
        record = ImagingRecord(
            patient_id=patient.id,
            date=datetime.utcnow(),
            modality="External Image",
            body_part="Unknown",
            image_url=filepath,
            radiologist_report="Uploaded Image"
        )
        db.session.add(record)
        db.session.commit()
        return True
    except Exception as e:
        print(f"Error processing Image: {e}")
        return False

# --- Helper Functions (Refactored from original) ---

def _get_or_create_patient(data):
    patient_name = data.get("Patient Name")
    if not patient_name: return None
    
    # Sanitize name
    patient_name = str(patient_name).replace("^", " ").strip()

    patient = Patient.query.filter_by(name=patient_name).first()
    if not patient:
        try:
            age = int(data.get("Age", 30))
        except:
            age = 30
            
        patient = Patient(
            name=patient_name,
            age=age,
            gender=data.get("Gender", "Unknown"),
            contact_info=data.get("Phone") or data.get("Contact") or "N/A",
            address=data.get("Address", "N/A")
        )
        db.session.add(patient)
        db.session.commit()
    return patient

def _parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d")
    except:
        return datetime.utcnow()

def _handle_csv_record(patient, record_date, test_type, result_val_str, unit, ref_range, flag, cache):
    # Handle Vitals (BP, HR, Temp)
    vitals_map = {
        "Systolic BP": "systolic_bp",
        "Diastolic BP": "diastolic_bp",
        "Heart Rate": "heart_rate",
        "Body Temperature": "temperature"
    }

    if test_type in vitals_map:
        cache_key = (patient.id, record_date.date())
        
        if cache_key in cache:
            med_record = cache[cache_key]
        else:
            med_record = MedicalRecord.query.filter_by(patient_id=patient.id, date=record_date).first()
            if not med_record:
                med_record = MedicalRecord(patient_id=patient.id, date=record_date)
                db.session.add(med_record)
            cache[cache_key] = med_record
        
        try:
            val = float(result_val_str)
            if test_type == "Body Temperature": med_record.temperature = val
            elif test_type == "Systolic BP": med_record.systolic_bp = int(val)
            elif test_type == "Diastolic BP": med_record.diastolic_bp = int(val)
            elif test_type == "Heart Rate": med_record.heart_rate = int(val)
        except: pass
    
    else:
        # Handle Labs
        try:
            val = float(result_val_str) if result_val_str.replace('.','',1).isdigit() else 0.0
        except: val = 0.0
            
        lab_result = LabResult(
            patient_id=patient.id,
            date=record_date,
            test_type=test_type,
            result_value=val,
            unit=unit,
            reference_range=ref_range,
            flag=flag
        )
        db.session.add(lab_result)
