import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import PreviewScaler from '../components/PreviewScaler';
import { useInvoices } from '../context/InvoiceContext';
import { useToast } from '../context/ToastContext';
import { InvoiceFormData } from '../types/invoice';
import { Download, ArrowLeft, Pencil, Eye } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { InvoiceTemplate } from '../components/TemplateSelector';

type MobileTab = 'form' | 'preview';

const EditInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoice, updateInvoice } = useInvoices();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate>('modern');
  const [mobileTab, setMobileTab] = useState<MobileTab>('form');

  const switchTab = (tab: MobileTab) => {
    setMobileTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${previewInvoice?.invoiceNumber || 'edit'}.pdf`,
    resolution: 2,
    page: {
      format: 'A4',
      orientation: 'portrait',
      margin: 2,
    },
    canvas: {
      mimeType: 'image/jpeg',
      qualityRatio: 0.92,
      useCORS: true,
      logging: false,
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

  const handleSubmit = async (data: InvoiceFormData) => {
    if (id) {
      setIsSaving(true);
      try {
        const updated = await updateInvoice(id, data);
        setPreviewInvoice(updated);
        showToast('Invoice berhasil diperbarui!', 'success');
      } catch (error) {
        console.error("Failed to update invoice", error);
        showToast("Gagal memperbarui invoice. Silakan coba lagi.", 'error');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDownloadPDF = () => {
    toPDF();
  };

  if (!previewInvoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-white transition"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            <span className="hidden sm:inline">Kembali ke Daftar Invoice</span>
            <span className="sm:hidden">Kembali</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition active:scale-95"
          >
            <Download size={16} className="mr-2" /> Download PDF
          </button>
        </div>

        <div className="lg:hidden mb-4 bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex">
          <button
            onClick={() => switchTab('form')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition ${
              mobileTab === 'form' ? 'bg-slate-900 text-white' : 'text-gray-600'
            }`}
          >
            <Pencil size={14} /> Form
          </button>
          <button
            onClick={() => switchTab('preview')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition ${
              mobileTab === 'preview' ? 'bg-slate-900 text-white' : 'text-gray-600'
            }`}
          >
            <Eye size={14} /> Preview
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Form */}
          <div className={`w-full lg:w-1/2 ${mobileTab === 'form' ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Invoice</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">Perbarui detail di bawah untuk mengubah invoice Anda.</p>
              </div>
              <div className="p-4 sm:p-6">
                <InvoiceForm
                  initialData={previewInvoice}
                  onSubmit={handleSubmit}
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={setSelectedTemplate}
                  isLoading={isSaving}
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className={`w-full lg:w-1/2 lg:sticky lg:top-6 ${mobileTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gray-100 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-inner lg:h-[calc(100vh-2rem)] lg:overflow-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700">Live Preview</h2>
                <span className="text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}
                </span>
              </div>

              <PreviewScaler className="shadow-lg rounded-lg bg-white">
                <InvoicePreview
                  invoice={previewInvoice}
                  template={selectedTemplate}
                />
              </PreviewScaler>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden full-size invoice for PDF capture (no ancestor transforms) */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '210mm',
          height: '293mm',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
          overflow: 'hidden',
        }}
      >
        <div ref={targetRef}>
          <InvoicePreview
            invoice={previewInvoice}
            template={selectedTemplate}
          />
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 px-3 pt-3 pb-safe shadow-lg z-20">
        <button
          onClick={handleDownloadPDF}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition"
        >
          <Download size={16} /> Download PDF
        </button>
      </div>
    </div>
  );
};

export default EditInvoice;
