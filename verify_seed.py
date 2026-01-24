from backend.app import app
from backend.db import DoctorNote

with app.app_context():
    notes = DoctorNote.query.limit(3).all()
    for note in notes:
        print(f"--- Note for {note.doctor_name} ---")
        print(note.note_content)
        print("-------------------------------")
