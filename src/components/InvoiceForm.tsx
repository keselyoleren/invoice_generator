import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InvoiceFormData, InvoiceItem } from '../types/invoice';
import { Plus, Trash2, Save, Tag, Hash, DollarSign, Percent } from 'lucide-react';
import LogoUpload from './LogoUpload';
import TemplateSelector, { InvoiceTemplate } from './TemplateSelector';

interface InvoiceFormProps {
  initialData?: Partial<InvoiceFormData>;
  onSubmit: (data: InvoiceFormData) => void;
  selectedTemplate: InvoiceTemplate;
  onTemplateChange: (template: InvoiceTemplate) => void;
  isLoading?: boolean;
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
  Dp: {
    en: 'Dp',
    id: 'Dp'
  },
  BelumTerbayar: {
    en: 'Belum Terbayar',
    id: 'Belum Terbayar'
  },
  Lunas: {
    en: 'Lunas',
    id: 'Lunas'
  },
  additionalNotes: {
    en: 'Additional notes...',
    id: 'Catatan tambahan...'
  },
  paymentTerms: {
    en: 'Payment terms and conditions...',
    id: 'Syarat dan ketentuan pembayaran...'
  },
  downPayment: {
    en: 'Down Payment %',
    id: 'Uang Muka %'
  }
};

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialData,
  onSubmit,
  selectedTemplate,
  onTemplateChange,
  isLoading = false
}) => {
  const [language, setLanguage] = useState<'en' | 'id'>(initialData?.language || 'id');

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
    status: initialData?.status || 'Dp',
    downPaymentPercentage: initialData?.downPaymentPercentage || 0,
    currency: initialData?.currency || 'idr',
    language: initialData?.language || 'id'
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

  const handleLogoChange = (logoUrl: string) => {
    setFormData({
      ...formData,
      business: {
        ...formData.business,
        logo: logoUrl
      }
    });
  };

  const handleLogoRemove = () => {
    setFormData({
      ...formData,
      business: {
        ...formData.business,
        logo: ''
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleLanguageChange = (newLang: 'id' | 'en') => {
    if (newLang === language) return;

    const newCurrency = newLang === 'en' ? 'usd' : 'idr';
    const exchangeRate = 16000;

    const convertPrice = (price: number, toCurrency: 'idr' | 'usd') => {
      if (toCurrency === 'usd') {
        return Math.round((price / exchangeRate) * 100) / 100;
      } else {
        return Math.round(price * exchangeRate);
      }
    };

    const newItems = formData.items.map(item => ({
      ...item,
      price: convertPrice(item.price, newCurrency)
    }));

    setLanguage(newLang);
    setFormData({
      ...formData,
      language: newLang,
      currency: newCurrency,
      items: newItems
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => handleLanguageChange('id')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${language === 'id' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            ID (Rp)
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            EN ($)
          </button>
        </div>
      </div>

      <TemplateSelector
        selectedTemplate={selectedTemplate}
        onTemplateChange={onTemplateChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">{t('businessInfo')}</h3>

          <LogoUpload
            currentLogo={formData.business.logo}
            onLogoChange={handleLogoChange}
            onLogoRemove={handleLogoRemove}
          />

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
          <option value="Dp">{t('Dp')}</option>
          <option value="BelumTerbayar">{t('BelumTerbayar')}</option>
          <option value="Lunas">{t('Lunas')}</option>
        </select>
      </div>

      {formData.status === 'Dp' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('downPayment')}</label>
          <input
            type="number"
            name="downPaymentPercentage"
            value={formData.downPaymentPercentage}
            onChange={handleChange}
            min="0"
            max="100"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
          {t('invoiceItems')}
          <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {formData.items.length} {formData.items.length === 1 ? 'Item' : 'Items'}
          </span>
        </h3>

        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-xl p-4 border border-gray-200 transition-all hover:shadow-md hover:border-blue-200 group"
            >
              <div className="flex justify-between items-start mb-4 md:hidden">
                <span className="text-sm font-medium text-gray-500">Item #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title={language === 'id' ? 'Hapus item' : 'Delete item'}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Description */}
                <div className="md:col-span-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">{t('description')}</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                      required
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={t('description')}
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">{t('quantity')}</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      required
                      min="1"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Qty"
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">{t('price')}</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm font-medium">
                        {formData.currency === 'usd' ? '$' : 'Rp'}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                      required
                      min="0"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Tax */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1 md:hidden">{t('tax')}</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Percent className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      value={item.tax || 0}
                      onChange={(e) => handleItemChange(item.id, 'tax', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.1"
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Actions & Total */}
                <div className="md:col-span-1 flex items-center justify-between md:justify-center h-full pt-1">
                  <div className="md:hidden font-medium text-gray-700">
                    Total: {formData.currency === 'usd' ? '$' : 'Rp'} {(item.quantity * item.price).toLocaleString()}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="hidden md:flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title={language === 'id' ? 'Hapus item' : 'Delete item'}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-4 w-full md:w-auto inline-flex items-center justify-center px-6 py-3 border border-dashed border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-all duration-200"
        >
          <Plus size={18} className="mr-2" /> {t('addItem')}
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
          disabled={isLoading}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" /> {t('saveInvoice')}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;