
from backend.agents.ollama_client import query_ollama

class BaseAgent:
    def __init__(self, role, system_instruction):
        self.role = role
        self.system_instruction = system_instruction

    def run(self, data):
        return query_ollama(f"Analyze this data:\n{data}", system_prompt=self.system_instruction)

class VitalsAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Vitals Analyst",
            system_instruction="You are an expert cardiologist assistant. Analyze the following vital signs history (Blood Pressure, Heart Rate). Identify trends (rising, falling, stable) and any immediate concerns based on standard medical guidelines. Be concise/bullet points."
        )

class LabAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Lab Specialist",
            system_instruction="You are an expert pathologist assistant. Review the provided lab results (A1C, Cholesterol, etc.). Flag any abnormal values and what they might indicate long-term. Be concise/bullet points."
        )

class RiskAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Risk Assessor",
            system_instruction="You are a genetic counselor and internal medicine specialist. Review the patient's demographics, genomic markers, and known risks. Identify top 3 potential future health risks. Be concise."
        )

class ScribeAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            role="Medical Scribe",
            system_instruction="You are a senior Chief Medical Officer. Synthesize the following reports from your team into a single, flowing, professional executive summary for the doctor. Focus on actionable insights. \n\nStructure:\n1. Patient Status (One sentence)\n2. Key Findings (Vitals & Labs)\n3. Risk Profile\n4. Recommendations."
        )

    def run(self, vitals_report, lab_report, risk_report, patient_info):
        prompt = f"""
        Patient Context: {patient_info}
        
        [REPORT FROM VITALS ANALYST]
        {vitals_report}
        
        [REPORT FROM LAB SPECIALIST]
        {lab_report}
        
        [REPORT FROM RISK ASSESSOR]
        {risk_report}
        
        Please synthesize these into a final health summary.
        """
        return query_ollama(prompt, system_prompt=self.system_instruction)
