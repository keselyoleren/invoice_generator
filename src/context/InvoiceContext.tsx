import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceFormData } from '../types/invoice';

interface InvoiceContextType {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  setCurrentInvoice: (invoice: Invoice | null) => void;
  createInvoice: (data: InvoiceFormData) => Invoice;
  updateInvoice: (id: string, data: InvoiceFormData) => Invoice;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

interface InvoiceProviderProps {
  children: ReactNode;
}

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  const calculateTotals = (data: InvoiceFormData): { subtotal: number; taxTotal: number; total: number } => {
    const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxTotal = data.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      return sum + (itemTotal * (item.tax || 0)) / 100;
    }, 0);
    const total = subtotal + taxTotal;
    
    return {
      subtotal,
      taxTotal,
      total
    };
  };

  const createInvoice = (data: InvoiceFormData): Invoice => {
    const { subtotal, taxTotal, total } = calculateTotals(data);
    
    const newInvoice: Invoice = {
      ...data,
      id: uuidv4(),
      subtotal,
      taxTotal,
      total,
      createdAt: new Date().toISOString()
    };
    
    setInvoices((prev) => [...prev, newInvoice]);
    return newInvoice;
  };

  const updateInvoice = (id: string, data: InvoiceFormData): Invoice => {
    const { subtotal, taxTotal, total } = calculateTotals(data);
    
    const updatedInvoice: Invoice = {
      ...data,
      id,
      subtotal,
      taxTotal,
      total,
      createdAt: invoices.find(inv => inv.id === id)?.createdAt || new Date().toISOString()
    };
    
    setInvoices((prev) => prev.map((invoice) => (invoice.id === id ? updatedInvoice : invoice)));
    return updatedInvoice;
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    if (currentInvoice?.id === id) {
      setCurrentInvoice(null);
    }
  };

  const getInvoice = (id: string) => {
    return invoices.find((invoice) => invoice.id === id);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        currentInvoice,
        setCurrentInvoice,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoice
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};