import React, { forwardRef, ForwardedRef } from 'react';
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
          return 'bg-green-100 text-green-800';
        case 'Dp':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-yellow-100 text-yellow-800';
      }
    };

    const getTemplateStyles = () => {
      switch (template) {
        case 'modern':
          return {
            container: 'bg-white shadow-lg rounded-lg overflow-hidden',
            header: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8',
            content: 'p-8',
            accent: 'text-blue-600',
            table: 'bg-blue-50'
          };
        case 'classic':
          return {
            container: 'bg-white border-2 border-gray-800',
            header: 'border-b-4 border-gray-800 p-8 bg-white',
            content: 'p-8',
            accent: 'text-gray-800',
            table: 'bg-gray-50'
          };
        case 'minimal':
          return {
            container: 'bg-white',
            header: 'p-8 bg-white border-b border-gray-200',
            content: 'p-8',
            accent: 'text-black',
            table: 'bg-gray-50'
          };
        case 'professional':
          return {
            container: 'bg-white shadow-md rounded-lg overflow-hidden',
            header: 'bg-green-600 text-white p-8',
            content: 'p-8',
            accent: 'text-green-600',
            table: 'bg-green-50'
          };
        default:
          return {
            container: 'bg-white shadow-md rounded-lg',
            header: 'p-8',
            content: 'p-8',
            accent: 'text-blue-600',
            table: 'bg-gray-50'
          };
      }
    };

    const styles = getTemplateStyles();

    return (
      <div ref={ref} className={`${styles.container} max-w-4xl mx-auto`}>
        <div className={styles.header}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-3xl font-bold ${template === 'modern' || template === 'professional' ? 'text-white' : styles.accent}`}>
                INVOICE
              </h1>
              <p className={`mt-1 ${template === 'modern' || template === 'professional' ? 'text-white opacity-90' : 'text-gray-600'}`}>
                #{invoice.invoiceNumber}
              </p>
            </div>
            <div className="text-right">
              {invoice.business.logo && (
                <img 
                  src={invoice.business.logo} 
                  alt="Business Logo" 
                  className="h-16 w-auto max-w-32 object-contain mb-2 ml-auto rounded-lg"
                  style={{ 
                    filter: template === 'modern' || template === 'professional' ? 'brightness(0) invert(1)' : 'none',
                    maxHeight: '64px',
                    maxWidth: '128px'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <h2 className={`text-xl font-semibold ${template === 'modern' || template === 'professional' ? 'text-white' : 'text-gray-800'}`}>
                {invoice.business.name}
              </h2>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div className="flex justify-between mb-8">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">From:</h3>
              <p className="text-gray-600">{invoice.business.name}</p>
              <p className="text-gray-600">{invoice.business.email}</p>
              <p className="text-gray-600 whitespace-pre-line">{invoice.business.address}</p>
              {invoice.business.phone && <p className="text-gray-600">{invoice.business.phone}</p>}
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-700 mb-2">To:</h3>
              <p className="text-gray-600">{invoice.customer.name}</p>
              <p className="text-gray-600">{invoice.customer.email}</p>
              <p className="text-gray-600 whitespace-pre-line">{invoice.customer.address}</p>
              {invoice.customer.phone && <p className="text-gray-600">{invoice.customer.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Invoice Details:</h3>
              <div className="grid grid-cols-2 gap-2">
                <p className="text-gray-600">Date:</p>
                <p className="text-gray-800">{formatDate(invoice.date)}</p>
                <p className="text-gray-600">Due Date:</p>
                <p className="text-gray-800">{formatDate(invoice.dueDate)}</p>
                <p className="text-gray-600">Status:</p>
                <p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor()}`}>
                    {invoice.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <table className="min-w-full bg-white mb-8 rounded-lg overflow-hidden">
            <thead>
              <tr className={`${styles.table} border-b`}>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">Qty</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">Price</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">Tax</th>
                <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 px-4 text-sm text-gray-800">{item.description}</td>
                  <td className="py-3 px-4 text-right text-sm text-gray-800">{item.quantity}</td>
                  <td className="py-3 px-4 text-right text-sm text-gray-800">{formatCurrency(item.price, 'idr')}</td>
                  <td className="py-3 px-4 text-right text-sm text-gray-800">
                    {item.tax ? `${item.tax}%` : '0%'}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-800 font-medium">
                    {formatCurrency(item.quantity * item.price, 'idr')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                  Subtotal:
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-800 font-medium">
                  {formatCurrency(invoice.subtotal, 'idr')}
                </td>
              </tr>
              <tr>
                <td colSpan={4} className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                  Tax:
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-800 font-medium">
                  {formatCurrency(invoice.taxTotal, 'idr')}
                </td>
              </tr>
              <tr className={styles.table}>
                <td colSpan={4} className="py-3 px-4 text-right text-base font-bold text-gray-700">
                  Total:
                </td>
                <td className="py-3 px-4 text-right text-base text-gray-800 font-bold">
                  {formatCurrency(invoice.total, 'idr')}
                </td>
              </tr>
            </tfoot>
          </table>

          {(invoice.notes || invoice.terms) && (
            <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {invoice.notes && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Transfer:</h3>
                  <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Terms & Conditions:</h3>
                  <p className="text-gray-600 whitespace-pre-line">{invoice.terms}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;