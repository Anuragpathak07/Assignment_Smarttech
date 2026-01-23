from datetime import datetime
from backend.db import Patient, MedicalRecord, LabResult, ImagingRecord, GenomicData, DoctorNote

class HealthAnalyzer:
    def __init__(self, patient_id):
        self.patient = Patient.query.get(patient_id)
        if not self.patient:
            raise ValueError("Patient not found")

    def analyze_trends(self):
        """Analyze trends for Vitals and Lab Results."""
        trends = {}
        
        # Blood Pressure Trend
        # Filter where at least systolic is present to show partial data
        records = sorted([r for r in self.patient.medical_records if r.systolic_bp], key=lambda x: x.date)
        if len(records) >= 2:
            last = records[-1]
            prev = records[-2]
            bp_trend = "Stable"
            if last.systolic_bp > prev.systolic_bp + 5:
                bp_trend = "Rising"
            elif last.systolic_bp < prev.systolic_bp - 5:
                bp_trend = "Falling"
            current_bp = f"{last.systolic_bp}" + (f"/{last.diastolic_bp}" if last.diastolic_bp else "")
            prev_bp = f"{prev.systolic_bp}" + (f"/{prev.diastolic_bp}" if prev.diastolic_bp else "")
            
            trends['blood_pressure'] = {
                'status': bp_trend,
                'current': current_bp,
                'previous': prev_bp
            }
        elif len(records) == 1:
            last = records[0]
            current_bp = f"{last.systolic_bp}" + (f"/{last.diastolic_bp}" if last.diastolic_bp else "")
            trends['blood_pressure'] = {
                'status': "Stable",
                'current': current_bp,
                'previous': None
            }
        
        # Lab Trends (A1C, Cholesterol)
        labs = sorted(self.patient.lab_results, key=lambda x: x.date)
        lab_types = set(l.test_type for l in labs)
        trends['labs'] = {}
        
        for l_type in lab_types:
            type_labs = [l for l in labs if l.test_type == l_type]
            if not type_labs:
                continue
                
            if len(type_labs) >= 2:
                last = type_labs[-1]
                prev = type_labs[-2]
                trend = "Stable"
                if last.result_value > prev.result_value * 1.05:
                    trend = "Rising"
                elif last.result_value < prev.result_value * 0.95:
                    trend = "Falling"
                
                trends['labs'][l_type] = {
                    'status': trend,
                    'current': f"{last.result_value} {last.unit}",
                    'flag': last.flag
                }
            else:
                last = type_labs[0]
                trends['labs'][l_type] = {
                    'status': "Stable",
                    'current': f"{last.result_value} {last.unit}",
                    'flag': last.flag
                }
                
        return trends

    def predict_risks(self):
        """Predict health risks based on consolidated data."""
        predictions = []
        
        # 1. Diabetes Risk
        labs = self.patient.lab_results
        a1c_levels = [l for l in labs if "A1C" in l.test_type]
        if a1c_levels:
            latest_a1c = sorted(a1c_levels, key=lambda x: x.date)[-1]
            if latest_a1c.result_value > 6.4:
                predictions.append({
                    "condition": "Diabetes",
                    "probability": "Very High",
                    "reason": f"Latest A1C is {latest_a1c.result_value}% (Diabetic range)",
                    "severity": "High"
                })
            elif latest_a1c.result_value > 5.7:
                predictions.append({
                    "condition": "Diabetes",
                    "probability": "Medium",
                    "reason": f"Latest A1C is {latest_a1c.result_value}% (Pre-diabetic)",
                    "severity": "Medium"
                })

        # 2. Cardiovascular Risk
        records = self.patient.medical_records
        if records:
            # Filter for records with actual BP data
            bp_records = [r for r in records if r.systolic_bp is not None]
            if bp_records:
                latest_bp = sorted(bp_records, key=lambda x: x.date)[-1]
                if latest_bp.systolic_bp > 140:
                    predictions.append({
                        "condition": "Hypertension",
                        "probability": "High",
                        "reason": f"Systolic BP is consistent > 140 ({latest_bp.systolic_bp})",
                        "severity": "Medium"
                    })

        # 3. Cancer Risk (Genomics + Imaging)
        genomics = self.patient.genomic_data
        cancer_risk_genes = [g for g in genomics if g.significance == "Pathogenic"]
        
        if cancer_risk_genes:
            gene = cancer_risk_genes[0]
            predictions.append({
                "condition": "Unit Specific Cancer",
                "probability": "High",
                "reason": f"Pathogenic variant found in {gene.gene_marker}: {gene.risk_association}",
                "severity": "Critical"
            })
            
        return predictions

    def analyze_notes(self):
        """Extract insights from doctor notes."""
        notes = self.patient.doctor_notes
        if not notes:
            return []
            
        recent_notes = sorted(notes, key=lambda x: x.date, reverse=True)[:3]
        insights = []
        for note in recent_notes:
            insights.append({
                "date": note.date.strftime("%Y-%m-%d"),
                "doctor": note.doctor_name,
                "sentiment": note.sentiment,
                "summary": note.note_content[:100] + "..."
            })
        return insights

    def get_history(self):
        """Get historical data for charts."""
        # Vitals History
        records = sorted(self.patient.medical_records, key=lambda x: x.date)
        vitals_history = [{
            'date': r.date.isoformat(),
            'systolic_bp': r.systolic_bp,
            'diastolic_bp': r.diastolic_bp,
            'heart_rate': r.heart_rate
        } for r in records]
        
        # LAB History (grouped by type)
        labs = sorted(self.patient.lab_results, key=lambda x: x.date)
        # We need to pivot this for the chart if we want multiple lines, or just return list of objects
        # For simplicity, let's return a flat list and let frontend filter
        labs_history = [{
            'date': l.date.isoformat(),
            'test_type': l.test_type,
            'value': l.result_value,
            'unit': l.unit
        } for l in labs]
        
        return {
            'vitals': vitals_history,
            'labs': labs_history
        }

    def generate_comprehensive_summary(self):
        return {
            "patient": self.patient.to_dict(),
            "trends": self.analyze_trends(),
            "predictions": self.predict_risks(),
            "recent_clinical_notes": self.analyze_notes(),
            "history": self.get_history()
        }
