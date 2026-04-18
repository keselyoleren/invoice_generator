import { forwardRef, ForwardedRef } from 'react';
import { Invoice } from '../types/invoice';
import { formatCurrency, formatDate } from '../utils/format';
import { InvoiceTemplate } from './TemplateSelector';

interface InvoicePreviewProps {
  invoice: Invoice;
  template?: InvoiceTemplate;
}

const InvoicePreview = forwardRef(
  ({ invoice, template = 'modern' }: InvoicePreviewProps, ref: ForwardedRef<HTMLDivElement>) => {
    const getStatusColor = () => {
      switch (invoice.status) {
        case 'Lunas':
          return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
        case 'Dp':
          return 'bg-blue-100 text-blue-800 border border-blue-200';
        default:
          return 'bg-amber-100 text-amber-800 border border-amber-200';
      }
    };

    const getTemplateStyles = () => {
      switch (template) {
        case 'modern':
          return {
            container: 'bg-white font-sans',
            header: 'bg-slate-900 text-white px-10 py-6',
            headerContent: 'flex justify-between items-center',
            subHeader: 'bg-slate-50 px-10 py-5 border-b border-slate-100',
            content: 'px-10 py-6',
            accent: 'text-slate-900',
            tableHeader: 'bg-slate-900 text-white',
            tableRow: 'border-b border-slate-100',
            totalSection: 'bg-slate-50',
            footer: 'bg-slate-900 text-white px-10 py-4 text-center text-sm opacity-90'
          };
        case 'classic':
          return {
            container: 'bg-white font-serif',
            header: 'bg-white px-10 py-6 border-b-2 border-gray-900',
            headerContent: 'flex flex-row-reverse justify-between items-start',
            subHeader: 'px-10 py-5 border-b border-gray-200',
            content: 'px-10 py-6',
            accent: 'text-gray-900',
            tableHeader: 'bg-gray-100 text-gray-900 border-y-2 border-gray-900',
            tableRow: 'border-b border-gray-200',
            totalSection: 'bg-transparent',
            footer: 'px-10 py-4 text-center border-t border-gray-200 text-gray-600'
          };
        case 'minimal':
          return {
            container: 'bg-white font-sans',
            header: 'bg-white px-10 py-6',
            headerContent: 'flex justify-between items-start',
            subHeader: 'px-10 py-5',
            content: 'px-10 py-6',
            accent: 'text-black',
            tableHeader: 'border-b-2 border-black text-black bg-transparent',
            tableRow: 'border-b border-gray-100',
            totalSection: 'bg-transparent',
            footer: 'px-10 py-5 text-center text-gray-500 text-sm'
          };
        case 'professional':
          return {
            container: 'bg-white font-sans',
            header: 'bg-blue-800 text-white px-10 py-6',
            headerContent: 'flex justify-between items-center',
            subHeader: 'bg-blue-50 px-10 py-5 border-b border-blue-100',
            content: 'px-10 py-6',
            accent: 'text-blue-800',
            tableHeader: 'bg-blue-800 text-white',
            tableRow: 'border-b border-blue-50',
            totalSection: 'bg-blue-50',
            footer: 'bg-blue-800 text-white px-10 py-4 text-center text-sm'
          };
        default:
          return {
            container: 'bg-white font-sans',
            header: 'bg-gray-900 text-white px-10 py-6',
            headerContent: 'flex justify-between items-center',
            subHeader: 'bg-gray-50 px-10 py-5',
            content: 'px-10 py-6',
            accent: 'text-gray-900',
            tableHeader: 'bg-gray-100 text-gray-700',
            tableRow: 'border-b border-gray-100',
            totalSection: 'bg-gray-50',
            footer: 'bg-gray-100 px-10 py-4 text-center text-gray-600'
          };
      }
    };

    const styles = getTemplateStyles();

    const labels = {
      en: {
        invoice: 'INVOICE',
        settlementInvoice: 'SETTLEMENT INVOICE',
        from: 'From',
        billTo: 'Bill To',
        dates: 'Dates',
        invoiceDate: 'Invoice Date',
        dueDate: 'Due Date',
        description: 'Description',
        qty: 'Qty',
        price: 'Price',
        tax: 'Tax',
        amount: 'Amount',
        paymentInfo: 'Payment Info / Notes',
        terms: 'Terms & Conditions',
        subtotal: 'Subtotal',
        taxTotal: 'Tax Total',
        total: 'Total',
        downPayment: 'Down Payment',
        balanceDue: 'Balance Due',
        settlementFor: 'Settlement for',
        paid: 'Paid',
        thankYou: 'Thank you for your business!'
      },
      id: {
        invoice: 'FAKTUR',
        settlementInvoice: 'FAKTUR PELUNASAN',
        from: 'Dari',
        billTo: 'Tagihan Kepada',
        dates: 'Tanggal',
        invoiceDate: 'Tanggal Faktur',
        dueDate: 'Jatuh Tempo',
        description: 'Deskripsi',
        qty: 'Jml',
        price: 'Harga',
        tax: 'Pajak',
        amount: 'Jumlah',
        paymentInfo: 'Info Pembayaran / Catatan',
        terms: 'Syarat & Ketentuan',
        subtotal: 'Subtotal',
        taxTotal: 'Total Pajak',
        total: 'Total',
        downPayment: 'Uang Muka',
        balanceDue: 'Sisa Tagihan',
        settlementFor: 'Pelunasan untuk',
        paid: 'Telah Dibayar',
        thankYou: 'Terima kasih atas kepercayaan Anda!'
      }
    };

    const t = labels[invoice.language || 'id'];
    const currency = invoice.currency || 'idr';

    return (
      <div
        ref={ref}
        className={`${styles.container} mx-auto`}
        style={{
          width: '210mm',
          height: '293mm',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact'
        }}
      >
        {/* Header Section */}
        <div className={styles.header} style={{ breakInside: 'avoid' }}>
          <div className={styles.headerContent}>
            <div>
              {invoice.business.logo && (
                <img
                  src={invoice.business.logo}
                  alt="Business Logo"
                  className="h-12 w-auto object-contain mb-3 rounded-lg bg-white/10 p-1.5"
                  style={{
                    filter: (template === 'modern' || template === 'professional') ? 'brightness(0) invert(1)' : 'none'
                  }}
                />
              )}
              <h2 className={`text-xl font-bold tracking-tight ${(template === 'modern' || template === 'professional') ? 'text-white' : styles.accent}`}>
                {invoice.business.name}
              </h2>
            </div>
            <div className="text-right">
              <h1 className={`text-4xl font-extrabold tracking-tight leading-tight ${(template === 'modern' || template === 'professional') ? 'text-white' : styles.accent}`}>
                {invoice.invoiceType === 'pelunasan' ? t.settlementInvoice : t.invoice}
              </h1>
              <p className={`mt-1 text-base font-medium ${(template === 'modern' || template === 'professional') ? 'text-white/80' : 'text-gray-500'}`}>
                #{invoice.invoiceNumber}
              </p>
              {invoice.invoiceType === 'pelunasan' && invoice.parentInvoiceNumber && (
                <p className={`mt-1 text-xs font-medium ${(template === 'modern' || template === 'professional') ? 'text-white/70' : 'text-gray-500'}`}>
                  {t.settlementFor} <span className="font-mono font-bold">#{invoice.parentInvoiceNumber}</span>
                </p>
              )}
              <div className="mt-3 flex justify-end gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${getStatusColor()}`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className={styles.subHeader} style={{ breakInside: 'avoid' }}>
          <div className="grid grid-cols-3 gap-6">
            {/* From */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{t.from}</h3>
              <div className="text-gray-700 text-xs leading-relaxed space-y-0.5">
                <p className="font-bold text-gray-900 text-sm">{invoice.business.name}</p>
                <p>{invoice.business.email}</p>
                <p className="whitespace-pre-line">{invoice.business.address}</p>
                {invoice.business.phone && <p>{invoice.business.phone}</p>}
              </div>
            </div>

            {/* To */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{t.billTo}</h3>
              <div className="text-gray-700 text-xs leading-relaxed space-y-0.5">
                <p className="font-bold text-gray-900 text-sm">{invoice.customer.name}</p>
                <p>{invoice.customer.email}</p>
                <p className="whitespace-pre-line">{invoice.customer.address}</p>
                {invoice.customer.phone && <p>{invoice.customer.phone}</p>}
              </div>
            </div>

            {/* Dates */}
            <div className="text-right">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{t.dates}</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] text-gray-500">{t.invoiceDate}</p>
                  <p className="font-bold text-gray-900 text-sm">{formatDate(invoice.date, invoice.language)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">{t.dueDate}</p>
                  <p className="font-bold text-gray-900 text-sm">{formatDate(invoice.dueDate, invoice.language)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content} style={{ flex: '1 1 auto' }}>
          {/* Items Table */}
          <div className="mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className={styles.tableHeader}>
                  <th className="py-2.5 px-4 text-left text-[10px] font-bold uppercase tracking-wider w-1/2 rounded-tl-lg rounded-bl-lg">{t.description}</th>
                  <th className="py-2.5 px-4 text-right text-[10px] font-bold uppercase tracking-wider w-20">{t.qty}</th>
                  <th className="py-2.5 px-4 text-right text-[10px] font-bold uppercase tracking-wider w-28">{t.price}</th>
                  <th className="py-2.5 px-4 text-right text-[10px] font-bold uppercase tracking-wider w-20">{t.tax}</th>
                  <th className="py-2.5 px-4 text-right text-[10px] font-bold uppercase tracking-wider w-28 rounded-tr-lg rounded-br-lg">{t.amount}</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {invoice.items.map((item) => (
                  <tr key={item.id} className={styles.tableRow} style={{ breakInside: 'avoid' }}>
                    <td className="py-2.5 px-4 text-sm text-gray-900 font-medium">{item.description}</td>
                    <td className="py-2.5 px-4 text-right text-sm text-gray-600 font-medium">{item.quantity}</td>
                    <td className="py-2.5 px-4 text-right text-sm text-gray-600 font-medium">{formatCurrency(item.price, currency)}</td>
                    <td className="py-2.5 px-4 text-right text-sm text-gray-600 font-medium">
                      {item.tax ? `${item.tax}%` : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-right text-sm font-bold text-gray-900">
                      {formatCurrency(item.quantity * item.price, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes */}
          <div className="grid grid-cols-12 gap-6" style={{ breakInside: 'avoid' }}>
            <div className="col-span-7">
              {(invoice.notes || invoice.terms) && (
                <div className="space-y-4">
                  {invoice.notes && (
                    <div style={{ breakInside: 'avoid' }}>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{t.paymentInfo}</h3>
                      <p className="text-xs text-gray-600 whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                        {invoice.notes}
                      </p>
                    </div>
                  )}
                  {invoice.terms && (
                    <div style={{ breakInside: 'avoid' }}>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{t.terms}</h3>
                      <p className="text-[10px] text-gray-500 whitespace-pre-line leading-relaxed">
                        {invoice.terms}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="col-span-5" style={{ breakInside: 'avoid' }}>
              <div className={`rounded-xl p-4 ${styles.totalSection}`} style={{ breakInside: 'avoid' }}>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">{t.subtotal}</span>
                    <span className="font-bold text-gray-900">{formatCurrency(invoice.subtotal, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">{t.taxTotal}</span>
                    <span className="font-bold text-gray-900">{formatCurrency(invoice.taxTotal, currency)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">{t.total}</span>
                    <span className={`text-lg font-extrabold ${styles.accent}`}>
                      {formatCurrency(invoice.total, currency)}
                    </span>
                  </div>
                  {invoice.status === 'Dp' && invoice.downPaymentAmount !== undefined && invoice.downPaymentAmount > 0 && (
                    <div className="mt-2 rounded-lg bg-blue-50 border border-blue-100 p-2.5 space-y-1.5" style={{ breakInside: 'avoid' }}>
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-blue-800 uppercase tracking-wider">
                          {t.downPayment} ({(invoice.downPaymentPercentage || 0).toFixed(1)}%)
                        </span>
                        <span className="font-bold text-blue-900">{formatCurrency(invoice.downPaymentAmount, currency)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1.5 border-t border-blue-200">
                        <span className="text-sm font-bold text-orange-700">{t.balanceDue}</span>
                        <span className="text-base font-extrabold text-orange-600">
                          {formatCurrency(invoice.balanceDue || 0, currency)}
                        </span>
                      </div>
                    </div>
                  )}
                  {invoice.invoiceType === 'pelunasan' && (
                    <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-[10px] text-emerald-800" style={{ breakInside: 'avoid' }}>
                      <p className="font-semibold uppercase tracking-wider">{t.paid}</p>
                      <p className="mt-0.5 leading-relaxed">
                        {t.settlementFor} <span className="font-mono font-bold">#{invoice.parentInvoiceNumber}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer} style={{ breakInside: 'avoid' }}>
          <p className="font-bold text-sm">{invoice.business.name}</p>
          <p className="mt-0.5 opacity-75 font-medium text-xs">{t.thankYou}</p>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;