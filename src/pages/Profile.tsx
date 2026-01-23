import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { PatientCard } from '@/components/profile/PatientCard';
import { usePatient } from '@/context/PatientContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { AIInsights } from '@/components/AIInsights';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Profile() {
  const { currentPatientId, patientData, loading } = usePatient();
  const navigate = useNavigate();

  // Redirect if no patient is selected
  // Or show empty state? Let's show empty state with redirect button.
  if (!currentPatientId && !loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-500 text-lg">No patient selected.</p>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="border-b bg-card">
          <div className="container py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Patient Profile</h1>
                <p className="text-muted-foreground">
                  View detailed medical history and AI insights
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="container py-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : patientData ? (
            <div className="grid gap-8 lg:grid-cols-3">
              <motion.div
                className="lg:col-span-2 space-y-6"
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0 }}
              >
                {/* Reuse PatientCard but map data correctly if needed */}
                {/* Note: PatientCard might expect different props mockPatient had. 
                      Ideally we check PatientCard props. For now, assuming standard shape or we will fix PatientCard next. */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">Demographics</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-gray-500">Full Name</span>
                      <span className="font-medium">{patientData.patient.name}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Patient ID</span>
                      <span className="font-medium">#{patientData.patient.id}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Age / Gender</span>
                      <span className="font-medium">{patientData.patient.age} / {patientData.patient.gender}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Contact</span>
                      <span className="font-medium">{patientData.patient.contact_info || "N/A"}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-gray-500">Address</span>
                      <span className="font-medium">{patientData.patient.address || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-xl font-semibold mb-4">AI Analysis History</h2>
                  <AIInsights patientId={currentPatientId} />
                </div>
              </motion.div>

              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Replaced Mock Diagnoses with something real or placeholder for now */}
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="font-semibold mb-2">Recent Clinical Notes</h3>
                  <div className="space-y-3">
                    {patientData.recent_clinical_notes && patientData.recent_clinical_notes.length > 0 ? (
                      patientData.recent_clinical_notes.map((note: any, i: number) => (
                        <div key={i} className="text-sm p-3 bg-gray-50 rounded">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{note.date}</span>
                            <span>{note.doctor}</span>
                          </div>
                          <p>{note.summary}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No notes available.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">Patient data not found.</div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
