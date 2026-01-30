import { useEffect } from "react";
import { usePatient } from "@/context/PatientContext";
import { HealthSummaryCard } from "@/components/HealthSummaryCard";
import { RiskPrediction } from "@/components/RiskPrediction";
import { TrendChart } from "@/components/TrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, RefreshCw, ChevronRight, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MainLayout } from '@/components/layout/MainLayout';
import { PatientSearch } from "@/components/PatientSearch";
import { AIInsights } from "@/components/AIInsights";
import { ClinicalTimeline } from "@/components/ClinicalTimeline";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { patientData: data, loading, setPatientId, refreshPatient } = usePatient();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground animate-pulse">Analyzing health records...</p>
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <div className="p-8 text-center text-red-500">Patient Data Unavailable</div>
      </MainLayout>
    );
  }

  const a1cData = data.history.labs.filter((l: any) => l.test_type.includes("A1C"));
  const cholData = data.history.labs.filter((l: any) => l.test_type.includes("Cholesterol"));

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50">
        {/* Sub-Header / Control Bar */}
        <div className="bg-white border-b sticky top-0 z-10 bg-opacity-90 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="text-primary h-5 w-5" />
                Patient Analytics
              </h1>
              <div className="hidden md:block h-6 w-px bg-gray-200"></div>
              <PatientSearch
                onSelect={setPatientId}
                currentPatientName={data.patient.name}
              />
            </div>
            <Button variant="outline" size="sm" onClick={refreshPatient} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <motion.div
          className="max-w-7xl mx-auto p-6 space-y-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Welcome Section */}
          <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
              <p className="text-gray-500 mt-1">
                Overview for <span className="font-semibold text-primary">{data.patient.name}</span> • ID #{data.patient.id}
              </p>
            </div>
            <div className="flex gap-2 text-sm text-muted-foreground bg-white px-3 py-1 rounded-full border shadow-sm">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500"></span> System Online</span>
              <span className="mx-1">|</span>
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </motion.div>

          {/* Stats Row - Full Width */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Blood Pressure"
              value={data.trends.blood_pressure?.current}
              trend={data.trends.blood_pressure?.status}
              icon={<Activity className="h-4 w-4" />}
            />
            <StatCard
              label="A1C Level"
              value={data.trends.labs['Hemoglobin A1C']?.current?.split(" ")[0] ?? "--"}
              unit="%"
              trend={data.trends.labs['Hemoglobin A1C']?.status}
              icon={<FileText className="h-4 w-4" />}
            />
            <StatCard
              label="Cholesterol"
              value={data.trends.labs['LDL Cholesterol']?.current?.split(" ")[0] ?? "--"}
              unit="mg/dL"
              trend={data.trends.labs['LDL Cholesterol']?.status}
              icon={<HeartPulseIcon />}
            />
            <StatCard
              label="Overall Risk"
              value={data.predictions.length > 0 ? "High" : "Low"}
              trend={data.predictions.length > 0 ? "Attention" : "Stable"}
              inverse
            />
          </motion.div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Patient Profile & Risks */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div variants={item}>
                <AIInsights patientId={data.patient.id} />
              </motion.div>

              <motion.div variants={item}>
                <HealthSummaryCard patient={data.patient} />
              </motion.div>

              <motion.div variants={item}>
                <RiskPrediction risks={data.predictions} />
              </motion.div>

              <motion.div variants={item}>
                <ClinicalTimeline notes={data.recent_clinical_notes} />
              </motion.div>
            </div>

            {/* Right Column: Vitals & Trends */}
            <div className="lg:col-span-8 space-y-6">
              {/* Main Charts */}
              <motion.div variants={item}>
                <TrendChart
                  title="Blood Pressure History"
                  subtitle="Systolic vs Diastolic over last 24 months"
                  data={data.history.vitals}
                  dataKeys={[
                    { key: 'systolic_bp', color: '#ef4444', name: 'Systolic' },
                    { key: 'diastolic_bp', color: '#3b82f6', name: 'Diastolic' }
                  ]}
                  yLabel="mmHg"
                  height={320}
                />
              </motion.div>

              <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TrendChart
                  title="Hemoglobin A1C"
                  data={a1cData}
                  dataKeys={[
                    { key: 'value', color: '#f59e0b', name: 'A1C (%)' }
                  ]}
                  height={280}
                />
                <TrendChart
                  title="LDL Cholesterol"
                  data={cholData}
                  dataKeys={[
                    { key: 'value', color: '#8b5cf6', name: 'LDL (mg/dL)' }
                  ]}
                  height={280}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}

// Sub-components for cleaner file
const StatCard = ({ label, value, unit, trend, icon, inverse = false }: any) => {
  const isNegative = (trend === 'Rising' && !inverse) || (trend === 'Falling' && inverse) || (trend === 'Critical');
  const isPositive = (trend === 'Falling' && !inverse) || (trend === 'Rising' && inverse) || (trend === 'Improving');

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {icon || <Activity className="h-4 w-4" />}
          </div>
          {trend && (
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isNegative ? 'bg-red-100 text-red-700' :
              isPositive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
              {trend}
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-2xl font-bold text-gray-900">{value || "--"}</h3>
            {unit && <span className="text-sm text-gray-500 font-medium">{unit}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const HeartPulseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
)
