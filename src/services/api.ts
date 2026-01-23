
export const API_BASE_URL = "http://127.0.0.1:5000/api";

export const api = {
    healthCheck: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return await response.json();
        } catch (error) {
            console.error("Health check failed:", error);
            throw error;
        }
    },
    getPatientAnalysis: async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/patient/${id}/analysis`);
            if (!response.ok) {
                throw new Error("Failed to fetch patient analysis");
            }
            return await response.json();
        } catch (error) {
            console.error("Analysis fetch failed:", error);
            throw error;
        }
    },
    uploadFile: async (file: File, patientId?: number) => {
        const formData = new FormData();
        formData.append("file", file);
        if (patientId) {
            formData.append("patient_id", patientId.toString());
        }

        try {
            const response = await fetch(`${API_BASE_URL}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Upload failed");
            }
            return await response.json();
        } catch (error) {
            console.error("File upload failed:", error);
            throw error;
        }
    },
    createPatient: async (patientData: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/patients/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patientData),
            });
            if (!response.ok) {
                throw new Error("Failed to create patient");
            }
            return await response.json();
        } catch (error) {
            console.error("Create patient failed:", error);
            throw error;
        }
    },
    searchPatients: async (query: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/patients/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error("Failed to search patients");
            }
            return await response.json();
        } catch (error) {
            console.error("Search failed:", error);
            return [];
        }
    },
    getPatientAISummary: async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/patient/${id}/ai_summary`);
            if (!response.ok) {
                // 404 is fine, just means no summary yet
                if (response.status === 404) return null;
                throw new Error("Failed to fetch AI summary");
            }
            return await response.json();
        } catch (error) {
            console.error("AI Summary fetch failed:", error);
            throw error;
        }
    },
    generatePatientAISummary: async (id: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/patient/${id}/ai_summary`, {
                method: "POST"
            });
            if (!response.ok) {
                throw new Error("Failed to generate AI summary");
            }
            return await response.json();
        } catch (error) {
            console.error("AI Generation failed:", error);
            throw error;
        }
    }
};
