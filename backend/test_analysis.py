from backend.app import app
from backend.analysis import HealthAnalyzer

def test_analysis():
    with app.app_context():
        # Test for Patient ID 1
        print("Running Analysis for Patient 1...")
        try:
            analyzer = HealthAnalyzer(1)
            summary = analyzer.generate_comprehensive_summary()
            
            print(f"\nPatient: {summary['patient']['name']}")
            
            print("\n--- Trends ---")
            if 'blood_pressure' in summary['trends']:
                print(f"BP Trend: {summary['trends']['blood_pressure']['status']}")
            
            print("\n--- Predictions ---")
            for pred in summary['predictions']:
                print(f"- {pred['condition']} ({pred['probability']}): {pred['reason']}")
                
            print("\n--- Notes Analysis ---")
            for note in summary['recent_clinical_notes']:
                print(f"- [{note['date']}] {note['sentiment']}")
                
        except Exception as e:
            print(f"Error: {e}")

if __name__ == '__main__':
    test_analysis()
