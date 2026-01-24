from flask import Flask, jsonify, request
from flask_cors import CORS
from backend.db import db, Patient

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Configure SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///health.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    from backend.analysis import HealthAnalyzer

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "ok", "message": "Backend is connected!"})

    @app.route('/api/patient/<int:patient_id>/analysis', methods=['GET'])
    def get_patient_analysis(patient_id):
        try:
            analyzer = HealthAnalyzer(patient_id)
            analysis = analyzer.generate_comprehensive_summary()
            return jsonify(analysis)
        except ValueError as e:
            return jsonify({"error": str(e)}), 404
        except Exception as e:
            return jsonify({"error": str(e)}), 500


    from werkzeug.utils import secure_filename
    from backend.upload_config import UPLOAD_FOLDER, allowed_file
    import os

    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    @app.route('/api/upload', methods=['POST'])
    def upload_file():
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        patient_id = request.form.get('patient_id') # Optional linking
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # If patient_id is provided, we can link logic here if needed
            # For now, we still rely on ingestion for parsing, OR we can add specific logic
            # to link non-CSV files (like images) to the patient.
            
            if patient_id:
                # Example: If it's an image, create an ImagingRecord linked to patient_id
                # This is a placeholder for that logic
                pass
            
            # Trigger Ingestion (Mainly for CSVs)
            from backend.ingestion import process_file
            success = process_file(filepath)
            
            if success:
                return jsonify({'message': 'File uploaded and processed successfully', 'filename': filename}), 201
            else:
                # Even if parsing failed, the file is saved. If we had patient_id, we might consider it "Linked" 
                return jsonify({'message': 'File uploaded.', 'filename': filename}), 201
        
        return jsonify({'error': 'File type not allowed'}), 400

    @app.route('/api/patients/create', methods=['POST'])
    def create_patient():
        data = request.json
        try:
            new_patient = Patient(
                name=data.get('name'),
                age=data.get('age'),
                gender=data.get('gender'),
                contact_info=data.get('contact'),
                address=data.get('address')
            )
            db.session.add(new_patient)
            db.session.commit()
            return jsonify(new_patient.to_dict()), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500

    @app.route('/api/patients/search', methods=['GET'])
    def search_patients():
        query = request.args.get('query', '')
        if not query:
            return jsonify([])
        
        # Case insensitive search
        patients = Patient.query.filter(Patient.name.ilike(f'%{query}%')).limit(10).all()
        return jsonify([p.to_dict() for p in patients])

    @app.route('/api/patient/<int:patient_id>/ai_summary', methods=['GET'])
    def get_ai_summary(patient_id):
        from backend.db import AIAnalysis
        # Try to get the latest analysis
        analysis = AIAnalysis.query.filter_by(patient_id=patient_id).order_by(AIAnalysis.date.desc()).first()
        
        if analysis:
            return jsonify(analysis.to_dict())
        else:
            return jsonify({"summary": None, "agent_details": None})

    @app.route('/api/patient/<int:patient_id>/ai_summary', methods=['POST'])
    def generate_ai_summary(patient_id):
        # Gather Data
        from backend.db import Patient, AIAnalysis
        from backend.analysis import HealthAnalyzer
        from backend.agents.medical_agents import VitalsAgent, LabAgent, RiskAgent, ScribeAgent
        
        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({"error": "Patient not found"}), 404
            
        try:
            print(f"Generating summary for patient {patient_id}...")
            analyzer = HealthAnalyzer(patient_id)
            analysis_data = analyzer.generate_comprehensive_summary()
            
            # Format data for agents
            vitals_data = str(analysis_data['trends'].get('blood_pressure')) + "\n" + str(analysis_data['history']['vitals'][-5:])
            labs_data = str(analysis_data['trends'].get('labs')) + "\n" + str(analysis_data['history']['labs'][-5:])
            risk_data = str(analysis_data['predictions']) + "\nGenomics: " + str([g.to_dict() for g in patient.genomic_data])

            # Run Agents
            print("Running Vitals Agent...")
            vitals_report = VitalsAgent().run(vitals_data)
            
            print("Running Lab Agent...")
            lab_report = LabAgent().run(labs_data)
            
            print("Running Risk Agent...")
            risk_report = RiskAgent().run(risk_data)
            
            print("Running Scribe Agent...")
            final_summary = ScribeAgent().run(
                vitals_report, 
                lab_report, 
                risk_report, 
                f"{patient.name}, {patient.age}y, {patient.gender}"
            )
            print("AI Analysis Complete.")

            agent_details = {
                "vitals": vitals_report,
                "labs": lab_report,
                "risks": risk_report
            }
            
            # Save to DB
            new_analysis = AIAnalysis(
                patient_id=patient_id,
                summary=final_summary,
                agent_details=agent_details
            )
            db.session.add(new_analysis)
            db.session.commit()
            
            return jsonify(new_analysis.to_dict())
            
        except Exception as e:
            print(f"AI Error: {e}")
            return jsonify({"error": str(e), "summary": "AI Analysis Unavailable"}), 500
            
        except Exception as e:
            return jsonify({"error": str(e), "summary": "AI Analysis Unavailable"}), 500

    with app.app_context():
        db.create_all()

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
