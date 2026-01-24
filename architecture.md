# Solution Architecture

```mermaid
graph TD
    subgraph Client ["Client Layer (Frontend)"]
        UI[("React UI (Vite + Tailwind)")]
        Dash[("Dashboard Component")]
        Upload[("Universal Upload Interface")]
        UI --> Dash
        UI --> Upload
    end

    subgraph API ["API Layer (Backend - Flask)"]
        Router[("API Router (app.py)")]
        Ingest[("Ingestion Service")]
        Analyst[("Health Analyzer")]
        
        Router --> Ingest
        Router --> Analyst
    end

    subgraph AI ["AI Intelligence Layer (Local LLM)"]
        Ollama[("Ollama (Llama 3)")]
        
        subgraph Agents ["Specialized Agents"]
            VA[("Vitals Agent")]
            LA[("Lab Agent")]
            RA[("Risk Agent")]
            SA[("Scribe Agent")]
        end
        
        Analyst --> VA & LA & RA
        VA & LA & RA --> SA
        SA --> Ollama
    end

    subgraph Data ["Data Persistence Layer (SQLite)"]
        DB[("health.db")]
        
        Patient[("Patient Profile")]
        MedRec[("Vitals (BP/HR)")]
        Labs[("Lab Results")]
        Img[("Imaging Metadata")]
        Gen[("Genomics")]
        Notes[("Doctor Notes")]
        
        DB --- Patient
        DB --- MedRec
        DB --- Labs
        DB --- Img
        DB --- Gen
        DB --- Notes
    end

    subgraph Parsers ["File Processing"]
        CSV[("CSV Parser")]
        PDF[("PDF Extractor (pypdf)")]
        DICOM[("DICOM Parser (pydicom)")]
        VCF[("VCF Parser")]
        
        Ingest --> CSV
        Ingest --> PDF
        Ingest --> DICOM
        Ingest --> VCF
    end

    %% Data Flow
    Upload -- "POST /api/upload" --> Router
    Dash -- "GET /api/summary" --> Router
    
    CSV & PDF & DICOM & VCF -- "Store Structured Data" --> DB
    Analyst -- "Query History" --> DB
    Analyst -- "Save Insights" --> DB
```

## Component Description

### 1. Client Layer
- **React UI**: Modern SPAs handling user interaction.
- **Universal Upload**: Accepts CSV, PDF, DICOM, and VCF files.

### 2. API Layer
- **Flask Backend**: Orchestrates data flow.
- **Ingestion Service**: Routes files to specific parsers based on extension.
- **Health Analyzer**: Aggregates data for AI processing.

### 3. AI Intelligence Layer
- **Local Ollama**: Runs Llama 3 for privacy-first inference.
- **Multi-Agent System**:
    - **Vitals Agent**: Analyzes BP/Heart Rate trends.
    - **Lab Agent**: Interprets blood work.
    - **Risk Agent**: Correlates genomics with history.
    - **Scribe Agent**: Synthesizes all outputs into a final report.

### 4. Data Layer
- **SQLite**: Relational storage for all structured health data.
