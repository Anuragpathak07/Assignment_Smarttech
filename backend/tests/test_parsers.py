
import unittest
from unittest.mock import MagicMock, patch
import os
import sys

# Add parent directory to path to import backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

# MOCK MODULES BEFORE IMPORTING INGESTION
# This allows running tests even if pydicom/pypdf are not actually installed in the env
sys.modules['pydicom'] = MagicMock()
sys.modules['pypdf'] = MagicMock()

from backend.ingestion import process_file, _process_pdf, _process_dicom, _process_vcf

class TestParsers(unittest.TestCase):

    @patch('backend.ingestion.DoctorNote')
    @patch('backend.ingestion.db.session')
    @patch('backend.ingestion._get_or_create_patient')
    def test_pdf_parsing(self, mock_get_patient, mock_session, mock_note):
        # Setup mocks
        mock_pdf_lib = sys.modules['pypdf']
        mock_page = MagicMock()
        # Mock extract_text to handle both no-args and extraction_mode arg
        mock_page.extract_text.side_effect = lambda extraction_mode=None: "This is a test report.\nPatient Name: John Doe\nDiagnosis: Healthy."
        
        mock_pdf_instance = MagicMock()
        mock_pdf_instance.pages = [mock_page]
        mock_pdf_lib.PdfReader.return_value = mock_pdf_instance
        
        mock_patient = MagicMock()
        mock_patient.id = 1
        mock_get_patient.return_value = mock_patient
        
        # Run
        result = _process_pdf("dummy.pdf")
        
        # Verify
        self.assertTrue(result)
        mock_get_patient.assert_called()
        mock_note.assert_called()
        # Check if extracted text was utilized
        args, kwargs = mock_note.call_args
        self.assertIn("This is a test report", kwargs['note_content'])
        self.assertEqual(kwargs['doctor_name'], "Extracted from PDF")

    @patch('backend.ingestion.DoctorNote')
    @patch('backend.ingestion.db.session')
    @patch('backend.ingestion._get_or_create_patient')
    def test_pdf_parsing_low_quality(self, mock_get_patient, mock_session, mock_note):
        # Setup mocks for dirty/empty text
        mock_pdf_lib = sys.modules['pypdf']
        mock_page = MagicMock()
        mock_page.extract_text.return_value = "   " # Empty/garbage text
        
        mock_pdf_instance = MagicMock()
        mock_pdf_instance.pages = [mock_page]
        mock_pdf_lib.PdfReader.return_value = mock_pdf_instance
        
        mock_patient = MagicMock()
        mock_patient.id = 1
        mock_get_patient.return_value = mock_patient
        
        # Run
        result = _process_pdf("scan.pdf")
        
        # Verify
        self.assertTrue(result)
        args, kwargs = mock_note.call_args
        # Should contain the system note
        self.assertIn("System Note: The extracted text received low confidence scores", kwargs['note_content'])

    @patch('backend.ingestion.ImagingRecord')
    @patch('backend.ingestion.db.session')
    @patch('backend.ingestion._get_or_create_patient')
    def test_dicom_parsing(self, mock_get_patient, mock_session, mock_record):
        # Setup mocks
        mock_dicom_lib = sys.modules['pydicom']
        
        mock_ds = MagicMock()
        mock_ds.PatientName = "Jane Doe"
        mock_ds.Modality = "CT"
        mock_ds.BodyPartExamined = "CHEST"
        # Mock 'in' operator for dataset
        def dataset_contains(key):
            return key in ['PatientName', 'Modality', 'BodyPartExamined']
        mock_ds.__contains__.side_effect = dataset_contains
        
        mock_dicom_lib.dcmread.return_value = mock_ds
        
        mock_patient = MagicMock()
        mock_patient.id = 2
        mock_get_patient.return_value = mock_patient
        
        # Run
        result = _process_dicom("dummy.dcm")
        
        # Verify
        self.assertTrue(result)
        mock_get_patient.assert_called()
        mock_record.assert_called()
        args, kwargs = mock_record.call_args
        self.assertEqual(kwargs['modality'], "CT")
        self.assertEqual(kwargs['body_part'], "CHEST")

    @patch('builtins.open', new_callable=unittest.mock.mock_open, read_data="##fileformat=VCFv4.2\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSample1\nchr1\t100\t.\tA\tT\t.\t.\tRisk=High")
    @patch('backend.ingestion.GenomicData')
    @patch('backend.ingestion.db.session')
    @patch('backend.ingestion._get_or_create_patient')
    def test_vcf_parsing(self, mock_get_patient, mock_session, mock_genomic, mock_open):
         # Setup mocks
        mock_patient = MagicMock()
        mock_patient.id = 3
        mock_get_patient.return_value = mock_patient
        
        # Run
        result = _process_vcf("test.vcf")
        
        # Verify
        self.assertTrue(result)
        mock_genomic.assert_called()
        args, kwargs = mock_genomic.call_args
        self.assertEqual(kwargs['gene_marker'], "chr1:100")
        self.assertEqual(kwargs['variant'], "A>T")

if __name__ == '__main__':
    unittest.main()
