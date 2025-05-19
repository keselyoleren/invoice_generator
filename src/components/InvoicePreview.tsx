import React from 'react';
import { formatCurrency, formatDate } from '../utils/format';

interface InvoicePreviewProps {
  invoice: {
    language: string;
    currency: string;
    date: string;
    subtotal: number;
    items: Array<{
      price: number;
    }>;
  };
  translations: Record<string, {
    invoice: string;
  }>;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, translations }) => {
  const t = translations[invoice.language];

  return (
    <div>
      {/* Text content with translations */}
      <h1 className="text-2xl font-bold text-gray-800">{t.invoice}</h1>

      {/* Date formatting */}
      <p className="text-gray-800">{formatDate(invoice.date, invoice.language)}</p>

      {/* Items table */}
      <table>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td className="py-3 px-4 text-right text-sm text-gray-800">
                {formatCurrency(item.price, invoice.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Currency formatting in totals */}
      <table>
        <tbody>
          <tr>
            <td className="py-3 px-4 text-right text-sm text-gray-800 font-medium">
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InvoicePreview;