import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';
import InvoicePreview from '../components/InvoicePreview';
import PreviewScaler from '../components/PreviewScaler';
import { useInvoices } from '../context/InvoiceContext';
import { useToast } from '../context/ToastContext';
import { Invoice, InvoiceFormData } from '../types/invoice';
import { Download, ArrowLeft, FileText, CheckCircle2, Pencil, Eye } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { InvoiceTemplate } from '../components/TemplateSelector';
import { formatCurrency } from '../utils/format';

type MobileTab = 'form' | 'preview';

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createInvoice } = useInvoices();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('form');

  const [previewInvoice, setPreviewInvoice] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate>('modern');

  const parentInvoice: Invoice | undefined = (location.state as { parentInvoice?: Invoice } | null)?.parentInvoice;

  const initialData: Partial<InvoiceFormData> | undefined = useMemo(() => {
    if (!parentInvoice) return undefined;

    const settlementNote = parentInvoice.language === 'en'
      ? `Settlement for invoice #${parentInvoice.invoiceNumber}. DP already paid: ${formatCurrency(parentInvoice.downPaymentAmount || 0, parentInvoice.currency)}.`
      : `Pelunasan untuk invoice #${parentInvoice.invoiceNumber}. DP yang sudah dibayar: ${formatCurrency(parentInvoice.downPaymentAmount || 0, parentInvoice.currency)}.`;

    return {
      invoiceNumber: `${parentInvoice.invoiceNumber}-PL`,
      customer: parentInvoice.customer,
      business: parentInvoice.business,
      items: parentInvoice.items.map(it => ({ ...it })),
      notes: `${settlementNote}\n\n${parentInvoice.notes || ''}`.trim(),
      terms: parentInvoice.terms || '',
      status: 'Lunas',
      currency: parentInvoice.currency,
      language: parentInvoice.language,
      invoiceType: 'pelunasan',
      parentInvoiceId: parentInvoice.id,
      parentInvoiceNumber: parentInvoice.invoiceNumber,
      downPaymentMode: 'percentage',
      downPaymentPercentage: 0,
      downPaymentAmount: 0
    };
  }, [parentInvoice]);

  const { toPDF, targetRef } = usePDF({
    filename: `invoice-${previewInvoice?.invoiceNumber || 'new'}.pdf`,
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

  const handleSubmit = async (data: InvoiceFormData) => {
    setIsSaving(true);
    try {
      const newInvoice = await createInvoice(data);
      setPreviewInvoice(newInvoice);
      setMobileTab('preview');
      showToast('Invoice berhasil disimpan!', 'success');
    } catch (error) {
      console.error("Failed to create invoice", error);
      showToast("Gagal membuat invoice. Silakan coba lagi.", 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!previewInvoice) return;
    if (!targetRef.current) return;
    toPDF();
  };

  const pageTitle = parentInvoice ? 'Buat Invoice Pelunasan' : 'Buat Invoice Baru';
  const pageSubtitle = parentInvoice
    ? `Pelunasan otomatis terisi dari invoice #${parentInvoice.invoiceNumber}.`
    : 'Isi detail di bawah untuk menghasilkan invoice Anda.';

  return (
    <div className="min-h-screen bg-slate-50 pb-24 lg:pb-8">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4 sm:mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-white transition"
          >
            <ArrowLeft size={16} className="mr-1.5" />
            <span className="hidden sm:inline">Kembali ke Daftar Invoice</span>
            <span className="sm:hidden">Kembali</span>
          </button>

          {previewInvoice && (
            <button
              onClick={handleDownloadPDF}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition active:scale-95"
            >
              <Download size={16} className="mr-2" /> Download PDF
            </button>
          )}
        </div>

        {parentInvoice && (
          <div className="mb-4 sm:mb-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-900">Mode Pelunasan Aktif</p>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                Invoice ini otomatis terisi berdasarkan <span className="font-mono font-semibold">#{parentInvoice.invoiceNumber}</span>.
                DP sudah dibayar sebesar <span className="font-bold">{formatCurrency(parentInvoice.downPaymentAmount || 0, parentInvoice.currency)}</span>,
                sisa <span className="font-bold">{formatCurrency(parentInvoice.balanceDue ?? parentInvoice.total, parentInvoice.currency)}</span>.
              </p>
            </div>
          </div>
        )}

        {/* Mobile tab switcher */}
        <div className="lg:hidden mb-4 bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex">
          <button
            onClick={() => setMobileTab('form')}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition ${
              mobileTab === 'form' ? 'bg-slate-900 text-white' : 'text-gray-600'
            }`}
          >
            <Pencil size={14} /> Form
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            disabled={!previewInvoice}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition disabled:opacity-40 ${
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{pageTitle}</h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">{pageSubtitle}</p>
              </div>
              <div className="p-4 sm:p-6">
                <InvoiceForm
                  initialData={initialData}
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
                {previewInvoice && (
                  <span className="text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)}
                  </span>
                )}
              </div>

              <PreviewScaler className="shadow-lg rounded-lg bg-white">
                {previewInvoice ? (
                  <InvoicePreview
                    invoice={previewInvoice}
                    template={selectedTemplate}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 bg-white border-2 border-dashed border-gray-200" style={{ width: '210mm', height: '293mm' }}>
                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                      <FileText size={32} />
                    </div>
                    <p className="text-lg font-medium">Belum Ada Data</p>
                    <p className="text-sm mt-1">Isi form untuk melihat preview invoice</p>
                  </div>
                )}
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
          {previewInvoice && (
            <InvoicePreview
              invoice={previewInvoice}
              template={selectedTemplate}
            />
          )}
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      {previewInvoice && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 px-3 py-3 shadow-lg z-20">
          <button
            onClick={handleDownloadPDF}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] transition"
          >
            <Download size={16} /> Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;
