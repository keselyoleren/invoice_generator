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

export type InvoiceStatus = 'Dp' | 'Belum Terbayar' | 'Lunas';
export type InvoiceType = 'full' | 'dp' | 'pelunasan';
export type DownPaymentMode = 'percentage' | 'amount';

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
  status: InvoiceStatus;
  subtotal: number;
  taxTotal: number;
  total: number;
  downPaymentMode?: DownPaymentMode;
  downPaymentPercentage?: number;
  downPaymentAmount?: number;
  balanceDue?: number;
  invoiceType?: InvoiceType;
  parentInvoiceId?: string;
  parentInvoiceNumber?: string;
  currency: 'idr' | 'usd';
  language: 'id' | 'en';
  createdAt: string;
}

export type InvoiceFormData = Omit<Invoice, 'id' | 'subtotal' | 'taxTotal' | 'total' | 'balanceDue' | 'createdAt'>;
