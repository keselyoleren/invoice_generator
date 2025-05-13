import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import { useInvoices } from '../context/InvoiceContext';
import { InvoiceFormData } from '../types/invoice';
import { Download, ArrowLeft } from 'lucide-react';
import { usePDF } from 'react-to-pdf';

const EditInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoice, updateInvoice } = useInvoices();
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toPDF } = usePDF({ 
      filename: 'invoice_edit.pdf',
      page: {      
        margin: {
          top: 0, 
          right: 0,
          bottom: 0,
          left: 0
        },
    },    
  });

  useEffect(() => {
    if (id) {
      const invoice = getInvoice(id);
      if (invoice) {
        setPreviewInvoice(invoice);
      } else {
        navigate('/');
      }
    }
  }, [id, getInvoice, navigate]);

  const handleSubmit = (data: InvoiceFormData) => {
    if (id) {
      const updated = updateInvoice(id, data);
      setPreviewInvoice(updated);
    }
  };

  const handleDownloadPDF = () => {
    if (previewRef.current) {
      toPDF(previewRef);
    }
  };

  if (!previewInvoice) {
    return <div className="p-8 text-center">Loading invoice...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Invoices
        </button>
        
        <button
          onClick={handleDownloadPDF}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Download size={16} className="mr-2" /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="overflow-y-auto pb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Invoice</h1>
          <InvoiceForm 
            initialData={previewInvoice} 
            onSubmit={handleSubmit} 
          />
        </div>
        
        <div className="overflow-y-auto pb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Preview</h1>
          <InvoicePreview ref={previewRef} invoice={previewInvoice} />
        </div>
      </div>
    </div>
  );
};

export default EditInvoice;