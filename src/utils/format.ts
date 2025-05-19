export const formatCurrency = (amount: number, currency: string): string => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  };

  if (currency === 'IDR') {
    options.currency = 'IDR';
    return new Intl.NumberFormat('id-ID', options).format(amount);
  } else {
    options.currency = 'USD';
    return new Intl.NumberFormat('en-US', options).format(amount);
  }
};

export const formatDate = (dateString: string, language: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const shortFormatDate = (dateString: string, language: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const translations = {
  id: {
    invoice: 'FAKTUR',
    from: 'Dari:',
    to: 'Untuk:',
    invoiceDetails: 'Detail Faktur:',
    date: 'Tanggal:',
    dueDate: 'Jatuh Tempo:',
    status: 'Status:',
    description: 'Deskripsi',
    quantity: 'Jumlah',
    price: 'Harga',
    tax: 'PPN',
    amount: 'Total',
    subtotal: 'Subtotal:',
    total: 'Total:',
    transfer: 'Transfer:',
    terms: 'Syarat & Ketentuan:',
    draft: 'Draft',
    sent: 'Terkirim',
    paid: 'Lunas'
  },
  en: {
    invoice: 'INVOICE',
    from: 'From:',
    to: 'To:',
    invoiceDetails: 'Invoice Details:',
    date: 'Date:',
    dueDate: 'Due Date:',
    status: 'Status:',
    description: 'Description',
    quantity: 'Quantity',
    price: 'Price',
    tax: 'Tax',
    amount: 'Amount',
    subtotal: 'Subtotal:',
    total: 'Total:',
    transfer: 'Transfer:',
    terms: 'Terms & Conditions:',
    draft: 'Draft',
    sent: 'Sent',
    paid: 'Paid'
  }
};