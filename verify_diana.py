from backend.app import app
from backend.db import Patient

with app.app_context():
    patient = Patient.query.filter_by(name="Diana Bush").first()
    if patient:
        print(f"Name: {patient.name}")
        print(f"Age: {patient.age}")
        print(f"Gender: {patient.gender}")
        print(f"Address: {patient.address}")
        print(f"Contact: {patient.contact_info}")
    else:
        print("NOT FOUND: Diana Bush")
