import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Invoice, InvoiceFormData } from '../types/invoice';

interface InvoiceContextType {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  setCurrentInvoice: (invoice: Invoice | null) => void;
  createInvoice: (data: InvoiceFormData) => Promise<Invoice>;
  updateInvoice: (id: string, data: InvoiceFormData) => Promise<Invoice>;
  deleteInvoice: (id: string) => Promise<void>;
  getInvoice: (id: string) => Invoice | undefined;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      if (!user) {
        setInvoices([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to invoices
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const q = query(
      collection(db, 'invoices'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedInvoices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Invoice[];

      setInvoices(fetchedInvoices);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching invoices:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const calculateTotals = (data: InvoiceFormData): { subtotal: number; taxTotal: number; total: number; downPaymentAmount: number; balanceDue: number } => {
    const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxTotal = data.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      return sum + (itemTotal * (item.tax || 0)) / 100;
    }, 0);
    const total = subtotal + taxTotal;

    const downPaymentPercentage = data.downPaymentPercentage || 0;
    const downPaymentAmount = (total * downPaymentPercentage) / 100;
    const balanceDue = total - downPaymentAmount;

    return {
      subtotal,
      taxTotal,
      total,
      downPaymentAmount,
      balanceDue
    };
  };

  const createInvoice = async (data: InvoiceFormData) => {
    if (!userId) throw new Error("User must be logged in to create an invoice");

    const { subtotal, taxTotal, total, downPaymentAmount, balanceDue } = calculateTotals(data);

    const newInvoiceData = {
      ...data,
      userId,
      subtotal,
      taxTotal,
      total,
      downPaymentAmount,
      balanceDue,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'invoices'), newInvoiceData);
      return { id: docRef.id, ...newInvoiceData } as Invoice;
    } catch (error) {
      console.error("Error creating invoice:", error);
      throw error;
    }
  };

  const updateInvoice = async (id: string, data: InvoiceFormData) => {
    if (!userId) throw new Error("User must be logged in to update an invoice");

    const { subtotal, taxTotal, total, downPaymentAmount, balanceDue } = calculateTotals(data);

    const updatedData = {
      ...data,
      subtotal,
      taxTotal,
      total,
      downPaymentAmount,
      balanceDue
    };

    try {
      const invoiceRef = doc(db, 'invoices', id);
      await updateDoc(invoiceRef, updatedData);
      return { id, ...updatedData, userId, createdAt: invoices.find(inv => inv.id === id)?.createdAt || new Date().toISOString() } as Invoice;
    } catch (error) {
      console.error("Error updating invoice:", error);
      throw error;
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!userId) throw new Error("User must be logged in to delete an invoice");

    try {
      await deleteDoc(doc(db, 'invoices', id));
      if (currentInvoice?.id === id) {
        setCurrentInvoice(null);
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      throw error;
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
        getInvoice,
        loading
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};