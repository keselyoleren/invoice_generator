import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import { useInvoices } from '../context/InvoiceContext';
import { useToast } from '../context/ToastContext';
import { InvoiceFormData } from '../types/invoice';
import { Download, ArrowLeft, FileText } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { InvoiceTemplate } from '../components/TemplateSelector';



const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { createInvoice } = useInvoices();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate>('modern');

  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${previewInvoice?.invoiceNumber || 'new'}.pdf`,
    page: {
      format: 'A4',
      margin: {
        top: 15,
        right: 15,
        bottom: 15,
        left: 15
      },
    },

  });

  const handleSubmit = async (data: InvoiceFormData) => {
    setIsSaving(true);
    try {
      const newInvoice = await createInvoice(data);
      setPreviewInvoice(newInvoice);
      showToast('Invoice created successfully!', 'success');
      // navigate('/'); // Optional: redirect after success
    } catch (error) {
      console.error("Failed to create invoice", error);
      showToast("Failed to create invoice. Please try again.", 'error');
    } finally {
      setIsSaving(false);
    }
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

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Form Section - Scrollable */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-800">Create New Invoice</h1>
              <p className="text-gray-500 text-sm mt-1">Fill in the details below to generate your invoice</p>
            </div>
            <div className="p-6">
              <InvoiceForm
                onSubmit={handleSubmit}
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
                isLoading={isSaving}
              />
            </div>
          </div>
        </div>

        {/* Preview Section - Sticky */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-6">
          <div className="bg-gray-100 rounded-lg p-4 lg:p-6 shadow-inner h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Live Preview</h2>
              {previewInvoice && (
                <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template
                </span>
              )}
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl" ref={targetRef}>
              {previewInvoice ? (
                <InvoicePreview
                  invoice={previewInvoice}
                  template={selectedTemplate}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400 bg-white rounded-lg border-2 border-dashed border-gray-200">
                  <div className="p-4 bg-gray-50 rounded-full mb-4">
                    <FileText size={32} />
                  </div>
                  <p className="text-lg font-medium">No Data Yet</p>
                  <p className="text-sm mt-1">Fill out the form to see the preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;