// Update the InvoicePreview component to use translations and currency formatting
const t = translations[invoice.language];

// Update currency formatting in the items table
<td className="py-3 px-4 text-right text-sm text-gray-800">
  {formatCurrency(item.price, invoice.currency)}
</td>

// Update all text content with translations
<h1 className="text-2xl font-bold text-gray-800">{t.invoice}</h1>

// Update date formatting
<p className="text-gray-800">{formatDate(invoice.date, invoice.language)}</p>

// Update currency formatting in totals
<td className="py-3 px-4 text-right text-sm text-gray-800 font-medium">
  {formatCurrency(invoice.subtotal, invoice.currency)}
</td>

export default t