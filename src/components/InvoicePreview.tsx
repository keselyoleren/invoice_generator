import React, { forwardRef, ForwardedRef } from 'react';
import { Invoice } from '../types/invoice';
import { formatCurrency, formatDate } from '../utils/format';

interface InvoicePreviewProps {
  invoice: Invoice;
}

const InvoicePreview = forwardRef(
  ({ invoice }: InvoicePreviewProps, ref: ForwardedRef<HTMLDivElement>) => {
    const getStatusColor = () => {
      switch (invoice.status) {
        case 'paid':
          return 'bg-green-100 text-green-800';
        case 'sent':
          return 'bg-blue-100 text-blue-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div ref={ref} className="bg-white shadow-md rounded-lg p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-gray-600 mt-1">#{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            {invoice.business.logo && (
              <img 
                src={invoice.business.logo} 
                alt="Business Logo" 
                className="h-16 mb-2 ml-auto" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <h2 className="text-xl font-semibold text-gray-800">{invoice.business.name}</h2>
          </div>
        </div>

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
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <table className="min-w-full bg-white mb-8">
          <thead>
            <tr className="bg-gray-100 border-b">
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
                <td className="py-3 px-4 text-right text-sm text-gray-800">{formatCurrency(item.price, 'usd')}</td>
                <td className="py-3 px-4 text-right text-sm text-gray-800">
                  {item.tax ? `${item.tax}%` : '0%'}
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-800 font-medium">
                  {formatCurrency(item.quantity * item.price, 'usd')}
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
                {formatCurrency(invoice.subtotal, 'usd')}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                Tax:
              </td>
              <td className="py-3 px-4 text-right text-sm text-gray-800 font-medium">
                {formatCurrency(invoice.taxTotal, 'usd')}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td colSpan={4} className="py-3 px-4 text-right text-base font-bold text-gray-700">
                Total:
              </td>
              <td className="py-3 px-4 text-right text-base text-gray-800 font-bold">
                {formatCurrency(invoice.total, 'usd')}
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
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;