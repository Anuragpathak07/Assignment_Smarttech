import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, Activity, Brain, Shield, TrendingUp, FileText, Scan, Dna } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePatient } from "@/context/PatientContext";
import { HealthSummaryCard } from "@/components/HealthSummaryCard";
import { RiskPrediction } from "@/components/RiskPrediction";
import { ClinicalTimeline } from "@/components/ClinicalTimeline";

const features = [
  {
    icon: Brain,
    title: 'AI Health Summary',
    description: 'Get comprehensive, AI-generated summaries of your complete health records in plain language.',
  },
  {
    icon: TrendingUp,
    title: 'Health Trend Analysis',
    description: 'Track critical health indicators over time with interactive charts and threshold alerts.',
  },
  {
    icon: Shield,
    title: 'Disease Risk Prediction',
    description: 'Understand your risk factors for major conditions with AI-powered predictive analytics.',
  },
  {
    icon: Scan,
    title: 'Imaging Analysis',
    description: 'Upload X-rays, CT scans, and MRIs for AI-assisted detection of abnormalities.',
  },
  {
    icon: Dna,
    title: 'Genomics Insights',
    description: 'Analyze genetic data to identify hereditary risk factors and personalized health recommendations.',
  },
  {
    icon: FileText,
    title: 'Unified Records',
    description: 'Consolidate all your health data from multiple sources into one secure platform.',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Landing() {
  const { patientData } = usePatient();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
                <Activity className="h-4 w-4" />
                Healthcare Analytics Platform
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Unified Intelligence for{' '}
                <span className="text-primary">Your Health Data</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                MediScope AI transforms your medical records, imaging, and genomic data into
                actionable health insights with advanced AI analysis.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/upload">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Health Records
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/dashboard">
                    View Sample Dashboard
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-chart-secondary/5 rounded-full blur-3xl translate-x-1/2" />
        </div>
      </section>

      {/* Patient Insights Section - Visible only if data exists */}
      {patientData && (
        <section className="py-12 bg-gray-50/50">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-8 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">Active Patient Insight</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-6">
                  <HealthSummaryCard patient={patientData.patient} />
                </div>
                <div className="space-y-6">
                  <RiskPrediction risks={patientData.predictions} />
                </div>
                <div className="space-y-6">
                  <ClinicalTimeline notes={patientData.recent_clinical_notes} />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-card">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Health Analytics
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leverage the power of AI to understand your health like never before
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-medical-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            className="relative overflow-hidden rounded-2xl gradient-medical p-12 md:p-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Take Control of Your Health Data?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Upload your records today and receive AI-powered insights within minutes.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/upload">
                  Get Started Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
