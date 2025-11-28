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
            header: 'bg-slate-900 text-white px-8 py-8',
            headerContent: 'flex justify-between items-center',
            subHeader: 'bg-slate-50 px-8 py-6 border-b border-slate-100',
            content: 'px-8 py-8',
            accent: 'text-slate-900',
            tableHeader: 'bg-slate-900 text-white',
            tableRow: 'border-b border-slate-100',
            totalSection: 'bg-slate-50',
            footer: 'bg-slate-900 text-white px-8 py-6 text-center text-sm opacity-90'
          };
        case 'classic':
          return {
            container: 'bg-white font-serif',
            header: 'bg-white px-8 py-8 border-b-2 border-gray-900',
            headerContent: 'flex flex-row-reverse justify-between items-start',
            subHeader: 'px-8 py-6 border-b border-gray-200',
            content: 'px-8 py-8',
            accent: 'text-gray-900',
            tableHeader: 'bg-gray-100 text-gray-900 border-y-2 border-gray-900',
            tableRow: 'border-b border-gray-200',
            totalSection: 'bg-transparent',
            footer: 'px-8 py-6 text-center border-t border-gray-200 text-gray-600'
          };
        case 'minimal':
          return {
            container: 'bg-white font-sans',
            header: 'bg-white px-8 py-8',
            headerContent: 'flex justify-between items-start',
            subHeader: 'px-8 py-6',
            content: 'px-8 py-8',
            accent: 'text-black',
            tableHeader: 'border-b-2 border-black text-black bg-transparent',
            tableRow: 'border-b border-gray-100',
            totalSection: 'bg-transparent',
            footer: 'px-8 py-8 text-center text-gray-500 text-sm'
          };
        case 'professional':
          return {
            container: 'bg-white font-sans',
            header: 'bg-blue-800 text-white px-8 py-8',
            headerContent: 'flex justify-between items-center',
            subHeader: 'bg-blue-50 px-8 py-6 border-b border-blue-100',
            content: 'px-8 py-8',
            accent: 'text-blue-800',
            tableHeader: 'bg-blue-800 text-white',
            tableRow: 'border-b border-blue-50',
            totalSection: 'bg-blue-50',
            footer: 'bg-blue-800 text-white px-8 py-6 text-center text-sm'
          };
        default:
          return {
            container: 'bg-white font-sans',
            header: 'bg-gray-900 text-white px-8 py-8',
            headerContent: 'flex justify-between items-center',
            subHeader: 'bg-gray-50 px-8 py-6',
            content: 'px-8 py-8',
            accent: 'text-gray-900',
            tableHeader: 'bg-gray-100 text-gray-700',
            tableRow: 'border-b border-gray-100',
            totalSection: 'bg-gray-50',
            footer: 'bg-gray-100 px-8 py-6 text-center text-gray-600'
          };
      }
    };

    const styles = getTemplateStyles();

    return (
      <div
        ref={ref}
        className={`${styles.container} mx-auto`}
        style={{
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              {invoice.business.logo && (
                <img
                  src={invoice.business.logo}
                  alt="Business Logo"
                  className="h-16 w-auto object-contain mb-4 rounded-lg bg-white/10 p-1.5"
                  style={{
                    filter: (template === 'modern' || template === 'professional') ? 'brightness(0) invert(1)' : 'none'
                  }}
                />
              )}
              <h2 className={`text-2xl font-bold tracking-tight ${(template === 'modern' || template === 'professional') ? 'text-white' : styles.accent}`}>
                {invoice.business.name}
              </h2>
            </div>
            <div className="text-right">
              <h1 className={`text-5xl font-extrabold tracking-tight ${(template === 'modern' || template === 'professional') ? 'text-white' : styles.accent}`}>
                INVOICE
              </h1>
              <p className={`mt-1 text-lg font-medium ${(template === 'modern' || template === 'professional') ? 'text-white/80' : 'text-gray-500'}`}>
                #{invoice.invoiceNumber}
              </p>
              <div className="mt-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${getStatusColor()}`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className={styles.subHeader}>
          <div className="grid grid-cols-3 gap-8">
            {/* From */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">From</h3>
              <div className="text-gray-700 text-xs leading-relaxed space-y-0.5">
                <p className="font-bold text-gray-900 text-sm">{invoice.business.name}</p>
                <p>{invoice.business.email}</p>
                <p className="whitespace-pre-line">{invoice.business.address}</p>
                {invoice.business.phone && <p>{invoice.business.phone}</p>}
              </div>
            </div>

            {/* To */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Bill To</h3>
              <div className="text-gray-700 text-xs leading-relaxed space-y-0.5">
                <p className="font-bold text-gray-900 text-sm">{invoice.customer.name}</p>
                <p>{invoice.customer.email}</p>
                <p className="whitespace-pre-line">{invoice.customer.address}</p>
                {invoice.customer.phone && <p>{invoice.customer.phone}</p>}
              </div>
            </div>

            {/* Dates */}
            <div className="text-right">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Dates</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] text-gray-500">Invoice Date</p>
                  <p className="font-bold text-gray-900 text-sm">{formatDate(invoice.date)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">Due Date</p>
                  <p className="font-bold text-gray-900 text-sm">{formatDate(invoice.dueDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className={styles.tableHeader}>
                  <th className="py-3 px-4 text-left text-[10px] font-bold uppercase tracking-wider w-1/2 rounded-tl-lg rounded-bl-lg">Description</th>
                  <th className="py-3 px-4 text-right text-[10px] font-bold uppercase tracking-wider w-24">Qty</th>
                  <th className="py-3 px-4 text-right text-[10px] font-bold uppercase tracking-wider w-32">Price</th>
                  <th className="py-3 px-4 text-right text-[10px] font-bold uppercase tracking-wider w-24">Tax</th>
                  <th className="py-3 px-4 text-right text-[10px] font-bold uppercase tracking-wider w-32 rounded-tr-lg rounded-br-lg">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {invoice.items.map((item) => (
                  <tr key={item.id} className={styles.tableRow}>
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium">{item.description}</td>
                    <td className="py-4 px-4 text-right text-sm text-gray-600 font-medium">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-sm text-gray-600 font-medium">{formatCurrency(item.price, 'idr')}</td>
                    <td className="py-4 px-4 text-right text-sm text-gray-600 font-medium">
                      {item.tax ? `${item.tax}%` : '-'}
                    </td>
                    <td className="py-4 px-4 text-right text-sm font-bold text-gray-900">
                      {formatCurrency(item.quantity * item.price, 'idr')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-7">
              {(invoice.notes || invoice.terms) && (
                <div className="space-y-6">
                  {invoice.notes && (
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Payment Info / Notes</h3>
                      <p className="text-xs text-gray-600 whitespace-pre-line bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
                        {invoice.notes}
                      </p>
                    </div>
                  )}
                  {invoice.terms && (
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Terms & Conditions</h3>
                      <p className="text-[10px] text-gray-500 whitespace-pre-line leading-relaxed">
                        {invoice.terms}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="col-span-5">
              <div className={`rounded-xl p-6 ${styles.totalSection}`}>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold text-gray-900">{formatCurrency(invoice.subtotal, 'idr')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-medium">Tax Total</span>
                    <span className="font-bold text-gray-900">{formatCurrency(invoice.taxTotal, 'idr')}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className={`text-xl font-extrabold ${styles.accent}`}>
                      {formatCurrency(invoice.total, 'idr')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className="font-bold text-base">{invoice.business.name}</p>
          <p className="mt-1 opacity-75 font-medium text-xs">Thank you for your business!</p>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;