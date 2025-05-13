import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import { useInvoices } from '../context/InvoiceContext';
import { InvoiceFormData } from '../types/invoice';
import { Download, ArrowLeft } from 'lucide-react';
import { usePDF } from 'react-to-pdf';

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { createInvoice } = useInvoices();
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const { toPDF } = usePDF({ 
        filename: 'rename.pdf',
        page: {      
          margin: {
            top: 7.56, 
            right: 7.56,
            bottom: 7.56,
            left: 7.56
          },
          format: 'a4',
          orientation: 'portrait'
        }
      });

  const handleSubmit = (data: InvoiceFormData) => {
    const newInvoice = createInvoice(data);
    setPreviewInvoice(newInvoice);
  };

  const handleDownloadPDF = () => {
    if (!previewInvoice) {
      console.error('No invoice data available');
      return;
    }

    if (!targetRef.current) {
      console.error('PDF target element not found');
      return;
    }

    console.log('Generating PDF...');
    toPDF();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Invoices
        </button>
        
        {previewInvoice && (
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            disabled={!previewInvoice}
          >
            <Download size={16} className="mr-2" /> Download PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="overflow-y-auto pb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Invoice</h1>
          <InvoiceForm onSubmit={handleSubmit} />
        </div>
        
        <div className="overflow-y-auto pb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Preview</h1>
          <div ref={targetRef}>
            {previewInvoice ? (
              <InvoicePreview invoice={previewInvoice} />
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-500">Fill out the form to see a preview of your invoice</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;