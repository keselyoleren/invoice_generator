import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate, getDefaultDueDate } from '../utils/format';
import { InvoiceFormData } from '../types/invoice';

interface InvoiceFormProps {
  initialData?: InvoiceFormData;
  onSubmit: (data: InvoiceFormData) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: initialData?.invoiceNumber || `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
    date: initialData?.date || getCurrentDate(),
    dueDate: initialData?.dueDate || getDefaultDueDate(),
    customer: initialData?.customer || {
      name: '',
      email: '',
      address: '',
      phone: ''
    },
    business: initialData?.business || {
      name: 'Klei Mate',
      email: 'kleimatee@gmail.com',
      address: 'Jl. Mawar Jl. Timbulrejo No.RT 04, RW.04, Krodan, Maguwoharjo',
      phone: '082141096938',
      logo: '/img/logo_keli_mate.jpeg'
    },
    items: initialData?.items || [
      {
        id: uuidv4(),
        description: '',
        quantity: 1,
        price: 0,
        tax: 0
      }
    ],
    notes: initialData?.notes || 'Transfer Bank: BCA No rek 4400136641 Atas Nama Rida Anggita Nurtrisna',
    terms: initialData?.terms || '',
    status: initialData?.status || 'draft',
    language: initialData?.language || 'id',
    currency: initialData?.currency || 'IDR'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmitForm}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          >
            <option value="id">Bahasa Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          >
            <option value="IDR">Indonesian Rupiah (Rp)</option>
            <option value="USD">US Dollar ($)</option>
          </select>
        </div>
      </div>
      {/* Other form fields here */}
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default InvoiceForm;