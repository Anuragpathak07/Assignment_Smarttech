export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  insuranceProvider: string;
  insuranceId: string;
  outstandingBalance: number;
  lastVisit: string;
  primaryPhysician: string;
  avatar?: string;
}

export interface LabResult {
  date: string;
  hba1c: number;
  systolic: number;
  diastolic: number;
  ldl: number;
  hdl: number;
  totalCholesterol: number;
  glucose: number;
  creatinine: number;
}

export interface Diagnosis {
  code: string;
  name: string;
  diagnosedDate: string;
  status: 'Active' | 'Resolved' | 'Monitoring';
  severity: 'Low' | 'Medium' | 'High';
}

export interface ImagingFinding {
  id: string;
  type: 'X-Ray' | 'CT-Scan' | 'MRI';
  bodyPart: string;
  date: string;
  finding: string;
  probability: number;
  severity: 'Normal' | 'Abnormal' | 'Critical';
  imageUrl?: string;
  regions?: { x: number; y: number; width: number; height: number; label: string }[];
}

export interface GenomicRisk {
  gene: string;
  mutationId: string;
  associatedDisease: string;
  riskScore: number;
  interpretation: string;
}

export interface RiskPrediction {
  diabetesProgression: number;
  cancer: number;
  cardiovascular: number;
  kidney: number;
  stroke: number;
}

export interface HealthRecord {
  patient: Patient;
  labHistory: LabResult[];
  diagnoses: Diagnosis[];
  imagingFindings: ImagingFinding[];
  genomicRisks: GenomicRisk[];
  riskPredictions: RiskPrediction;
  aiSummary: string;
}

export const mockPatient: Patient = {
  id: 'PT-2024-001847',
  firstName: 'James',
  lastName: 'Mitchell',
  dateOfBirth: '1968-03-15',
  age: 56,
  gender: 'Male',
  email: 'james.mitchell@email.com',
  phone: '(555) 234-5678',
  address: {
    street: '1234 Oak Valley Drive',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
  },
  insuranceProvider: 'Blue Cross Blue Shield',
  insuranceId: 'BCBS-789456123',
  outstandingBalance: 245.00,
  lastVisit: '2024-01-08',
  primaryPhysician: 'Dr. Sarah Chen, MD',
};

export const mockLabHistory: LabResult[] = [
  { date: '2022-01-15', hba1c: 5.8, systolic: 128, diastolic: 82, ldl: 115, hdl: 48, totalCholesterol: 195, glucose: 102, creatinine: 0.9 },
  { date: '2022-04-20', hba1c: 6.0, systolic: 132, diastolic: 84, ldl: 122, hdl: 46, totalCholesterol: 202, glucose: 108, creatinine: 0.95 },
  { date: '2022-07-18', hba1c: 6.2, systolic: 135, diastolic: 86, ldl: 128, hdl: 44, totalCholesterol: 210, glucose: 115, creatinine: 1.0 },
  { date: '2022-10-25', hba1c: 6.5, systolic: 138, diastolic: 88, ldl: 135, hdl: 42, totalCholesterol: 218, glucose: 122, creatinine: 1.05 },
  { date: '2023-01-22', hba1c: 6.8, systolic: 142, diastolic: 90, ldl: 142, hdl: 40, totalCholesterol: 225, glucose: 128, creatinine: 1.1 },
  { date: '2023-04-15', hba1c: 7.1, systolic: 145, diastolic: 92, ldl: 148, hdl: 38, totalCholesterol: 232, glucose: 135, creatinine: 1.15 },
  { date: '2023-07-20', hba1c: 7.4, systolic: 148, diastolic: 94, ldl: 155, hdl: 36, totalCholesterol: 240, glucose: 142, creatinine: 1.2 },
  { date: '2023-10-18', hba1c: 7.8, systolic: 152, diastolic: 96, ldl: 160, hdl: 35, totalCholesterol: 248, glucose: 150, creatinine: 1.25 },
  { date: '2024-01-08', hba1c: 8.1, systolic: 155, diastolic: 98, ldl: 165, hdl: 34, totalCholesterol: 255, glucose: 158, creatinine: 1.3 },
];

export const mockDiagnoses: Diagnosis[] = [
  { code: 'E11.9', name: 'Type 2 Diabetes Mellitus', diagnosedDate: '2023-01-22', status: 'Active', severity: 'High' },
  { code: 'I10', name: 'Essential Hypertension', diagnosedDate: '2022-07-18', status: 'Active', severity: 'Medium' },
  { code: 'E78.0', name: 'Hypercholesterolemia', diagnosedDate: '2022-10-25', status: 'Active', severity: 'Medium' },
  { code: 'E66.9', name: 'Obesity, Unspecified', diagnosedDate: '2021-06-10', status: 'Active', severity: 'Medium' },
];

export const mockImagingFindings: ImagingFinding[] = [
  {
    id: 'IMG-001',
    type: 'CT-Scan',
    bodyPart: 'Chest',
    date: '2024-01-05',
    finding: 'Pulmonary nodule detected in right upper lobe',
    probability: 0.78,
    severity: 'Abnormal',
    regions: [{ x: 65, y: 30, width: 15, height: 15, label: 'Nodule' }],
  },
  {
    id: 'IMG-002',
    type: 'X-Ray',
    bodyPart: 'Chest',
    date: '2023-11-15',
    finding: 'Mild cardiomegaly observed',
    probability: 0.65,
    severity: 'Abnormal',
    regions: [{ x: 40, y: 45, width: 25, height: 30, label: 'Enlarged Heart' }],
  },
  {
    id: 'IMG-003',
    type: 'MRI',
    bodyPart: 'Spine',
    date: '2023-09-20',
    finding: 'L4-L5 disc herniation',
    probability: 0.88,
    severity: 'Abnormal',
    regions: [{ x: 48, y: 70, width: 10, height: 8, label: 'Herniation' }],
  },
];

export const mockGenomicRisks: GenomicRisk[] = [
  { gene: 'BRCA1', mutationId: 'rs80357906', associatedDisease: 'Breast Cancer', riskScore: 0.24, interpretation: 'Moderate Risk - Regular screening recommended' },
  { gene: 'APOE', mutationId: 'rs429358', associatedDisease: "Alzheimer's Disease", riskScore: 0.42, interpretation: 'Elevated Risk - Lifestyle modifications suggested' },
  { gene: 'TCF7L2', mutationId: 'rs7903146', associatedDisease: 'Type 2 Diabetes', riskScore: 0.78, interpretation: 'High Risk - Confirmed by clinical diagnosis' },
  { gene: 'LDLR', mutationId: 'rs28942078', associatedDisease: 'Familial Hypercholesterolemia', riskScore: 0.56, interpretation: 'Elevated Risk - Statin therapy indicated' },
  { gene: 'ACE', mutationId: 'rs4646994', associatedDisease: 'Cardiovascular Disease', riskScore: 0.68, interpretation: 'High Risk - Aggressive BP management needed' },
];

export const mockRiskPredictions: RiskPrediction = {
  diabetesProgression: 82,
  cancer: 34,
  cardiovascular: 71,
  kidney: 45,
  stroke: 38,
};

export const mockAiSummary = `Patient James Mitchell, 56-year-old male, presents with a concerning trajectory of metabolic decline over the past 24 months. HbA1C levels have progressively risen from 5.8% (January 2022) to 8.1% (January 2024), indicating progression from pre-diabetic state to uncontrolled Type 2 Diabetes Mellitus.

Concurrent hypertension has worsened, with blood pressure readings increasing from 128/82 mmHg to 155/98 mmHg, now classified as Stage 2 Hypertension. LDL cholesterol has risen from 115 mg/dL to 165 mg/dL despite current statin therapy.

Recent imaging reveals a pulmonary nodule in the right upper lobe (78% probability of malignancy) requiring urgent follow-up CT and possible biopsy. Mild cardiomegaly is consistent with hypertensive heart disease progression.

Genomic analysis indicates high genetic predisposition for Type 2 Diabetes (TCF7L2 variant) and cardiovascular disease (ACE variant), explaining the rapid disease progression despite standard interventions.

RECOMMENDATIONS:
1. Immediate referral to pulmonology for lung nodule evaluation
2. Intensify diabetes management - consider GLP-1 agonist addition
3. Optimize antihypertensive therapy - add second agent
4. Increase statin dosage or add ezetimibe
5. Schedule echocardiogram to assess cardiac function
6. Nephrology consultation given rising creatinine levels`;

export const mockHealthRecord: HealthRecord = {
  patient: mockPatient,
  labHistory: mockLabHistory,
  diagnoses: mockDiagnoses,
  imagingFindings: mockImagingFindings,
  genomicRisks: mockGenomicRisks,
  riskPredictions: mockRiskPredictions,
  aiSummary: mockAiSummary,
};
