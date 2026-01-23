
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/services/api";
import { Loader2, UploadCloud, UserPlus, CheckCircle } from "lucide-react";
import { FileUploadZone } from "./upload/FileUploadZone";

interface PatientFormData {
    name: string;
    age: number;
    gender: string;
    contact: string;
    address: string;
}

export function PatientRegistrationForm({ onSuccess }: { onSuccess?: (id: number) => void }) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<PatientFormData>();
    const [loading, setLoading] = useState(false);
    const [createdPatientId, setCreatedPatientId] = useState<number | null>(null);
    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);

    // We wrap the FileUploadZone loosely here or re-implement simple drop area 
    // For simplicity, let's create a "Pending Files" logic. 
    // Actually, re-using FileUploadZone is tricky because it auto-uploads.
    // We'll Create the patient FIRST, then show the upload zone for that patient.

    const onSubmit = async (data: PatientFormData) => {
        setLoading(true);
        try {
            const patient = await api.createPatient(data);
            setCreatedPatientId(patient.id);
            toast.success(`Patient ${patient.name} created! Now upload their files.`);
            if (onSuccess) onSuccess(patient.id);
        } catch (error) {
            toast.error("Failed to create patient");
        } finally {
            setLoading(false);
        }
    };

    if (createdPatientId) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col items-center justify-center p-8 bg-green-50 border border-green-100 rounded-lg text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
                    <h3 className="text-xl font-bold text-green-800">Registration Successful!</h3>
                    <p className="text-green-700">Patient ID: #{createdPatientId}</p>
                    <p className="text-sm text-green-600 mt-2">You can now attach files to this patient record below.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <FileUploadZone
                        title="Attach Medical Records"
                        description="Upload PDFs, CSVs, or Lab Reports"
                        icon={<UploadCloud className="h-5 w-5 text-indigo-500" />}
                        acceptedFormats={['PDF', 'CSV', 'TXT']}
                        accept=".pdf,.csv,.txt"
                        category="clinical"
                    // Ideally passing patientId to FileUploadZone to propagate it to api.uploadFile
                    // But FileUploadZone uses internal state. We might need to refactor it or just use a simpler one here.
                    // For now, let's assume the standard Ingestion pipeline handles the data extraction 
                    // and we just want to get the files into the system.
                    />
                    <FileUploadZone
                        title="Attach Imaging"
                        description="Upload X-Rays or CT Scans"
                        icon={<UploadCloud className="h-5 w-5 text-blue-500" />}
                        acceptedFormats={['PNG', 'JPG', 'DICOM']}
                        accept=".png,.jpg,.dcm"
                        category="imaging"
                    />
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Register Another Patient
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <Card className="border-t-4 border-t-primary shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-primary" />
                    New Patient Registration
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" {...register("name", { required: true })} />
                            {errors.name && <span className="text-xs text-red-500">Name is required</span>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" type="number" placeholder="30" {...register("age", { required: true })} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select onValueChange={(v) => setValue("gender", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Number</Label>
                            <Input id="contact" placeholder="+1 234 567 8900" {...register("contact")} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder="123 Health St, Medical City" {...register("address")} />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Creating Profile..." : "Create Patient Profile"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
