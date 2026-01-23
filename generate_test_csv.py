
import csv
import random
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()

def generate_csv(filename="test_health_data.csv", num_records=50):
    headers = [
        "Patient ID", "Patient Name", "Age", "Gender", "Date of Birth", 
        "Blood Type", "Email", "Phone", "Address", 
        "Visit Date", "Doctor Name", "File Number", "Department",
        "Test Category", "Test Name", "Result Value", "Unit", 
        "Reference Range", "Status", "Notes"
    ]
    
    # Expanded Test Definitions
    test_catalog = {
        "Vitals": [
            {"name": "Systolic BP", "unit": "mmHg", "min": 90, "max": 180, "ref": "90-120"},
            {"name": "Diastolic BP", "unit": "mmHg", "min": 60, "max": 120, "ref": "60-80"},
            {"name": "Heart Rate", "unit": "bpm", "min": 50, "max": 130, "ref": "60-100"},
            {"name": "Body Temperature", "unit": "°F", "min": 97.0, "max": 104.0, "ref": "97.0-99.0"},
            {"name": "Respiratory Rate", "unit": "bpm", "min": 12, "max": 30, "ref": "12-20"},
            {"name": "Oxygen Saturation", "unit": "%", "min": 85, "max": 100, "ref": ">95"}
        ],
        "Metabolic Panel": [
            {"name": "Glucose", "unit": "mg/dL", "min": 60, "max": 300, "ref": "70-99"},
            {"name": "Calcium", "unit": "mg/dL", "min": 8.0, "max": 11.0, "ref": "8.5-10.2"},
            {"name": "Sodium", "unit": "mmol/L", "min": 130, "max": 150, "ref": "135-145"},
            {"name": "Potassium", "unit": "mmol/L", "min": 3.0, "max": 6.0, "ref": "3.5-5.0"},
            {"name": "BUN", "unit": "mg/dL", "min": 5, "max": 50, "ref": "6-20"},
            {"name": "Creatinine", "unit": "mg/dL", "min": 0.5, "max": 2.5, "ref": "0.74-1.35"}
        ],
        "Lipid Panel": [
            {"name": "Total Cholesterol", "unit": "mg/dL", "min": 120, "max": 300, "ref": "<200"},
            {"name": "LDL Cholesterol", "unit": "mg/dL", "min": 50, "max": 250, "ref": "<100"},
            {"name": "HDL Cholesterol", "unit": "mg/dL", "min": 20, "max": 100, "ref": ">40"},
            {"name": "Triglycerides", "unit": "mg/dL", "min": 50, "max": 400, "ref": "<150"}
        ],
        "Hematology": [
            {"name": "Hemoglobin A1C", "unit": "%", "min": 4.0, "max": 12.0, "ref": "<5.7"},
            {"name": "WBC", "unit": "K/uL", "min": 3.0, "max": 15.0, "ref": "4.5-11.0"},
            {"name": "RBC", "unit": "M/uL", "min": 3.5, "max": 6.0, "ref": "4.1-5.6"},
            {"name": "Platelets", "unit": "K/uL", "min": 100, "max": 500, "ref": "150-450"}
        ]
    }

    doctors = [
        "Dr. Sarah Smith", "Dr. James Johnson", "Dr. Emily Davis", 
        "Dr. Michael Wilson", "Dr. Robert Brown", "Dr. Linda Taylor"
    ]
    
    departments = ["Cardiology", "Internal Medicine", "Endocrinology", "General Practice", "Family Medicine"]

    records = []
    
    # Generate data for a set of patients
    patients = []
    for _ in range(10): # Create 10 unique patients
        gender = random.choice(['Male', 'Female'])
        first_name = fake.first_name_male() if gender == 'Male' else fake.first_name_female()
        last_name = fake.last_name()
        
        # Calculate DOB based on random age
        age = random.randint(18, 90)
        dob = fake.date_of_birth(minimum_age=age, maximum_age=age)
        
        patients.append({
            "id": fake.unique.uuid4()[:8].upper(),
            "name": f"{first_name} {last_name}",
            "age": age,
            "gender": gender,
            "dob": dob.strftime("%Y-%m-%d"),
            "blood_type": random.choice(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
            "email": f"{first_name.lower()}.{last_name.lower()}@example.com",
            "phone": fake.phone_number(),
            "address": fake.address().replace("\n", ", ")
        })

    for _ in range(num_records):
        patient = random.choice(patients)
        
        # Pick a category and a test
        category = random.choice(list(test_catalog.keys()))
        test = random.choice(test_catalog[category])
        
        # Generate Result
        is_float = isinstance(test["min"], float)
        if is_float:
            result_val = round(random.uniform(test["min"], test["max"]), 1)
        else:
            result_val = int(random.uniform(test["min"], test["max"]))
            
        # Determine Status flag based on ref range (simplified logic)
        status = "Normal"
        if "ref" in test:
            # Very basic check for demonstration
            if ">" in test["ref"]:
                limit = float(test["ref"].replace(">", ""))
                if result_val <= limit: status = "Low"
            elif "<" in test["ref"]:
                limit = float(test["ref"].replace("<", ""))
                if result_val >= limit: status = "High"
            elif "-" in test["ref"]:
                low, high = map(float, test["ref"].split("-"))
                if result_val < low: status = "Low"
                if result_val > high: status = "High"
        
        # Create Record
        visit_date = fake.date_this_year()
        
        record = [
            patient["id"],
            patient["name"],
            patient["age"],
            patient["gender"],
            patient["dob"],
            patient["blood_type"],
            patient["email"],
            patient["phone"],
            patient["address"],
            visit_date.strftime("%Y-%m-%d"),
            random.choice(doctors),
            fake.unique.random_number(digits=6),
            random.choice(departments),
            category,
            test["name"],
            result_val,
            test["unit"],
            test["ref"],
            status,
            fake.sentence(nb_words=8)
        ]
        records.append(record)

    # Sort by date
    records.sort(key=lambda x: x[9], reverse=True) # Sort by Visit Date

    try:
        with open(filename, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(headers)
            writer.writerows(records)
        print(f"Successfully generated detailed CSV: {filename} with {num_records} records.")
        return filename
    except Exception as e:
        print(f"Error creating CSV: {e}")
        return None

if __name__ == "__main__":
    generate_csv(num_records=200)
