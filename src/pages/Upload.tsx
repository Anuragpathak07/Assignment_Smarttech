
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Scan, Dna, UserPlus, FileUp } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FileUploadZone } from '@/components/upload/FileUploadZone';
import { PatientRegistrationForm } from '@/components/PatientRegistrationForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Upload() {
  const [activeTab, setActiveTab] = useState("new-patient");

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50">
        {/* Page Header */}
        <div className="bg-white border-b shadow-sm sticky top-0 z-10">
          <div className="container py-6">
            <h1 className="text-2xl font-bold text-gray-900">Data Intake</h1>
            <p className="text-muted-foreground">
              Register new patients or upload data to existing records
            </p>
          </div>
        </div>

        <div className="container py-8">
          <Tabs defaultValue="new-patient" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="new-patient" className="gap-2">
                <UserPlus className="h-4 w-4" /> New Patient
              </TabsTrigger>
              <TabsTrigger value="quick-upload" className="gap-2">
                <FileUp className="h-4 w-4" /> Quick Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new-patient" className="max-w-3xl mx-auto">
              <motion.div {...fadeInUp}>
                <PatientRegistrationForm />
              </motion.div>
            </TabsContent>

            <TabsContent value="quick-upload">
              {/* Upload Sections */}
              <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {/* Clinical Documents */}
                <motion.div
                  {...fadeInUp}
                  transition={{ duration: 0.5, delay: 0 }}
                >
                  <FileUploadZone
                    title="Clinical Documents"
                    description="Doctor notes, lab reports, medical history"
                    icon={<FileText className="h-5 w-5 text-primary" />}
                    acceptedFormats={['PDF', 'TXT', 'CSV', 'XLS', 'JSON']}
                    accept=".pdf,.txt,.csv,.xls,.xlsx,.json"
                    category="clinical"
                  />
                </motion.div>

                {/* Medical Imaging */}
                <motion.div
                  {...fadeInUp}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <FileUploadZone
                    title="Medical Imaging"
                    description="X-Ray, CT Scan, MRI, DICOM files"
                    icon={<Scan className="h-5 w-5 text-primary" />}
                    acceptedFormats={['DICOM', 'PNG', 'JPG', 'DCM']}
                    accept=".dcm,.png,.jpg,.jpeg,.dicom"
                    category="imaging"
                  />
                </motion.div>

                {/* Genomics Data */}
                <motion.div
                  {...fadeInUp}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <FileUploadZone
                    title="Genomics Data"
                    description="Genetic test results and mutation files"
                    icon={<Dna className="h-5 w-5 text-primary" />}
                    acceptedFormats={['VCF', 'CSV', 'JSON']}
                    accept=".vcf,.csv,.json"
                    category="genomics"
                  />
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </MainLayout>
  );
}
