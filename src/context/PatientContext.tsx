
import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";

interface Patient {
    id: number;
    name: string;
    age: number;
    gender: string;
    contact_info: string;
    address: string;
}

interface AnalysisData {
    patient: Patient;
    trends: any;
    predictions: any[];
    recent_clinical_notes: any[];
    history: {
        vitals: any[];
        labs: any[];
    };
}

interface PatientContextType {
    currentPatientId: number;
    setPatientId: (id: number) => void;
    patientData: AnalysisData | null;
    loading: boolean;
    refreshPatient: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
    const [currentPatientId, setCurrentPatientId] = useState<number>(1);
    const [patientData, setPatientData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchPatientData = async (id: number) => {
        setLoading(true);
        try {
            const data = await api.getPatientAnalysis(id);
            setPatientData(data);
        } catch (error) {
            console.error("Failed to fetch patient data", error);
            toast.error("Failed to load patient data");
            setPatientData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientData(currentPatientId);
    }, [currentPatientId]);

    const refreshPatient = async () => {
        await fetchPatientData(currentPatientId);
    };

    return (
        <PatientContext.Provider
            value={{
                currentPatientId,
                setPatientId: setCurrentPatientId,
                patientData,
                loading,
                refreshPatient
            }}
        >
            {children}
        </PatientContext.Provider>
    );
}

export function usePatient() {
    const context = useContext(PatientContext);
    if (context === undefined) {
        throw new Error("usePatient must be used within a PatientProvider");
    }
    return context;
}
