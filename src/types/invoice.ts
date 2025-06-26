export interface Customer {
  name: string;
  email: string;
  address: string;
  phone?: string;
}

export interface Business {
  name: string;
  email: string;
  address: string;
  phone?: string;
  logo?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  tax?: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: Customer;
  business: Business;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  status: 'Dp' | 'Belum Terbayar' | 'Lunas';
  subtotal: number;
  taxTotal: number;
  total: number;
  createdAt: string;
  language: 'id' | 'en';
  currency: 'IDR' | 'USD';
}

export type InvoiceFormData = Omit<Invoice, 'id' | 'subtotal' | 'taxTotal' | 'total' | 'createdAt'>;