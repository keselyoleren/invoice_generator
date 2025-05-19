import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InvoiceFormData, InvoiceItem } from '../types/invoice';
import { Plus, Trash2, Save } from 'lucide-react';

interface InvoiceFormProps {
  initialData?: Partial<InvoiceFormData>;
  onSubmit: (data: InvoiceFormData) => void;
}

interface Translations {
  [key: string]: {
    en: string;
    id: string;
  };
}

const translations: Translations = {
  businessInfo: {
    en: 'Business Information',
    id: 'Informasi Bisnis'
  },
  customerInfo: {
    en: 'Customer Information',
    id: 'Informasi Pelanggan'
  },
  logoUrl: {
    en: 'Logo URL',
    id: 'URL Logo'
  },
  businessName: {
    en: 'Business Name',
    id: 'Nama Bisnis'
  },
  email: {
    en: 'Email',
    id: 'Email'
  },
  address: {
    en: 'Address',
    id: 'Alamat'
  },
  phone: {
    en: 'Phone',
    id: 'Telepon'
  },
  customerName: {
    en: 'Customer Name',
    id: 'Nama Pelanggan'
  },
  invoiceNumber: {
    en: 'Invoice Number',
    id: 'Nomor Invoice'
  },
  date: {
    en: 'Date',
    id: 'Tanggal'
  },
  dueDate: {
    en: 'Due Date',
    id: 'Jatuh Tempo'
  },
  status: {
    en: 'Status',
    id: 'Status'
  },
  invoiceItems: {
    en: 'Invoice Items',
    id: 'Item Invoice'
  },
  description: {
    en: 'Description',
    id: 'Deskripsi'
  },
  quantity: {
    en: 'Quantity',
    id: 'Jumlah'
  },
  price: {
    en: 'Price',
    id: 'Harga'
  },
  tax: {
    en: 'Tax %',
    id: 'PPN %'
  },
  total: {
    en: 'Total',
    id: 'Total'
  },
  action: {
    en: 'Action',
    id: 'Aksi'
  },
  addItem: {
    en: 'Add Item',
    id: 'Tambah Item'
  },
  bankTransfer: {
    en: 'Bank Transfer',
    id: 'Transfer Bank'
  },
  termsConditions: {
    en: 'Terms & Conditions',
    id: 'Syarat & Ketentuan'
  },
  saveInvoice: {
    en: 'Save Invoice',
    id: 'Simpan Invoice'
  },
  draft: {
    en: 'Draft',
    id: 'Draft'
  },
  sent: {
    en: 'Sent',
    id: 'Terkirim'
  },
  paid: {
    en: 'Paid',
    id: 'Lunas'
  },
  additionalNotes: {
    en: 'Additional notes...',
    id: 'Catatan tambahan...'
  },
  paymentTerms: {
    en: 'Payment terms and conditions...',
    id: 'Syarat dan ketentuan pembayaran...'
  }
};

const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData, onSubmit }) => {
  const [language, setLanguage] = useState<'en' | 'id'>('id');
  
  const t = (key: string) => translations[key]?.[language] || key;

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  };

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
    status: initialData?.status || 'draft'
  });

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      business: {
        ...formData.business,
        [name]: value
      }
    });
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      customer: {
        ...formData.customer,
        [name]: value
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setFormData({
      ...formData,
      items: formData.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: uuidv4(),
          description: '',
          quantity: 1,
          price: 0,
          tax: 0
        }
      ]
    });
  };

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((item) => item.id !== id)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setLanguage('id')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${language === 'id' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            ID
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            EN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">{t('businessInfo')}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('logoUrl')}</label>
            <input
              type="text"
              name="logo"
              value={formData.business.logo || ''}
              onChange={handleBusinessChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('businessName')}</label>
            <input
              type="text"
              name="name"
              value={formData.business.name}
              onChange={handleBusinessChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder={t('businessName')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
            <input
              type="email"
              name="email"
              value={formData.business.email}
              onChange={handleBusinessChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="business@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('address')}</label>
            <textarea
              name="address"
              value={formData.business.address}
              onChange={handleBusinessChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder={t('address')}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('phone')}</label>
            <input
              type="text"
              name="phone"
              value={formData.business.phone || ''}
              onChange={handleBusinessChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="+62 812 3456 7890"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">{t('customerInfo')}</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('customerName')}</label>
            <input
              type="text"
              name="name"
              value={formData.customer.name}
              onChange={handleCustomerChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder={t('customerName')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('email')}</label>
            <input
              type="email"
              name="email"
              value={formData.customer.email}
              onChange={handleCustomerChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="customer@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('address')}</label>
            <textarea
              name="address"
              value={formData.customer.address}
              onChange={handleCustomerChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder={t('address')}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('phone')}</label>
            <input
              type="text"
              name="phone"
              value={formData.customer.phone || ''}
              onChange={handleCustomerChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="+62 812 3456 7890"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('invoiceNumber')}</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('date')}</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('dueDate')}</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('status')}</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
        >
          <option value="draft">{t('draft')}</option>
          <option value="sent">{t('sent')}</option>
          <option value="paid">{t('paid')}</option>
        </select>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">{t('invoiceItems')}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('description')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('quantity')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('price')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('tax')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('total')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('action')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm p-2 border"
                      placeholder={t('description')}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      required
                      min="1"
                      className="w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                      min="0"
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.tax || 0}
                      onChange={(e) => handleItemChange(item.id, 'tax', parseFloat(e.target.value) || 0)}
                      min="0"
                      className="w-full rounded-md border-gray-300 shadow-sm p-2 border"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(item.quantity * item.price).toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                      title={language === 'id' ? 'Hapus item' : 'Delete item'}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-2" /> {t('addItem')}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{t('bankTransfer')}</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          rows={3}
          placeholder={t('additionalNotes')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">{t('termsConditions')}</label>
        <textarea
          name="terms"
          value={formData.terms}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          rows={3}
          placeholder={t('paymentTerms')}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save size={16} className="mr-2" /> {t('saveInvoice')}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;