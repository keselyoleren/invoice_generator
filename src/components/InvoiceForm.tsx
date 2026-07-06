import React, { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InvoiceFormData, InvoiceItem } from '../types/invoice';
import { Plus, Trash2, Save, Tag, Hash, Percent, Wallet, Info } from 'lucide-react';
import LogoUpload from './LogoUpload';
import TemplateSelector, { InvoiceTemplate } from './TemplateSelector';
import { formatCurrency } from '../utils/format';

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
    en: 'Down Payment',
    id: 'Uang Muka'
  },
  downPaymentMode: {
    en: 'DP Input Mode',
    id: 'Mode Input DP'
  },
  percentage: {
    en: 'Percentage',
    id: 'Persentase'
  },
  fixedAmount: {
    en: 'Fixed Amount',
    id: 'Nominal'
  },
  dpPreview: {
    en: 'DP Amount',
    id: 'Nilai DP'
  },
  balanceDue: {
    en: 'Balance Due',
    id: 'Sisa Tagihan'
  },
  subtotal: {
    en: 'Subtotal',
    id: 'Subtotal'
  },
  grandTotal: {
    en: 'Grand Total',
    id: 'Total'
  },
  pelunasanNote: {
    en: 'Settlement Invoice',
    id: 'Invoice Pelunasan'
  },
  pelunasanDescription: {
    en: 'This invoice is the settlement for an existing DP invoice.',
    id: 'Invoice ini adalah pelunasan dari invoice DP sebelumnya.'
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
    downPaymentMode: initialData?.downPaymentMode || 'percentage',
    downPaymentPercentage: initialData?.downPaymentPercentage ?? 0,
    downPaymentAmount: initialData?.downPaymentAmount ?? 0,
    invoiceType: initialData?.invoiceType || 'full',
    parentInvoiceId: initialData?.parentInvoiceId || '',
    parentInvoiceNumber: initialData?.parentInvoiceNumber || '',
    currency: initialData?.currency || 'idr',
    language: initialData?.language || 'id'
  });

  const totals = useMemo(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const taxTotal = formData.items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      return sum + (itemTotal * (item.tax || 0)) / 100;
    }, 0);
    const total = subtotal + taxTotal;

    let dpPercentage = formData.downPaymentPercentage || 0;
    let dpAmount = formData.downPaymentAmount || 0;

    if (formData.status === 'Dp') {
      if (formData.downPaymentMode === 'amount') {
        dpAmount = Math.min(dpAmount, total);
        dpPercentage = total > 0 ? (dpAmount / total) * 100 : 0;
      } else {
        dpPercentage = Math.min(Math.max(dpPercentage, 0), 100);
        dpAmount = (total * dpPercentage) / 100;
      }
    } else {
      dpPercentage = 0;
      dpAmount = 0;
    }

    return {
      subtotal,
      taxTotal,
      total,
      dpPercentage,
      dpAmount,
      balanceDue: Math.max(total - dpAmount, 0)
    };
  }, [formData.items, formData.status, formData.downPaymentMode, formData.downPaymentPercentage, formData.downPaymentAmount]);

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

  const handleStatusChange = (nextStatus: InvoiceFormData['status']) => {
    setFormData({
      ...formData,
      status: nextStatus,
      downPaymentPercentage: nextStatus === 'Dp' ? (formData.downPaymentPercentage || 0) : 0,
      downPaymentAmount: nextStatus === 'Dp' ? (formData.downPaymentAmount || 0) : 0
    });
  };

  const handleDpModeChange = (mode: 'percentage' | 'amount') => {
    setFormData({
      ...formData,
      downPaymentMode: mode
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

  // Select the whole value on focus so users can overwrite a "0" without clearing it first.
  const selectOnFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();
  // Prevent the mouse wheel from silently changing a focused number field while scrolling.
  const blurOnWheel = (e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur();

  // Shared style for item-row inputs: large, dark, medium-weight text so entered values are clearly readable.
  const itemInputClass =
    'pl-10 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg p-6 shadow-md">
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => handleLanguageChange('id')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition active:scale-95 ${language === 'id' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
          >
            ID (Rp)
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition active:scale-95 ${language === 'en' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
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
              autoComplete="organization"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="business@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('address')}</label>
            <textarea
              name="address"
              value={formData.business.address}
              onChange={handleBusinessChange}
              autoComplete="street-address"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder={t('address')}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('phone')} <span className="text-gray-400 font-normal">({language === 'id' ? 'opsional' : 'optional'})</span></label>
            <input
              type="tel"
              inputMode="tel"
              name="phone"
              value={formData.business.phone || ''}
              onChange={handleBusinessChange}
              autoComplete="tel"
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
              autoComplete="off"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
              autoComplete="off"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="customer@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('address')}</label>
            <textarea
              name="address"
              value={formData.customer.address}
              onChange={handleCustomerChange}
              autoComplete="off"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder={t('address')}
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('phone')} <span className="text-gray-400 font-normal">({language === 'id' ? 'opsional' : 'optional'})</span></label>
            <input
              type="tel"
              inputMode="tel"
              name="phone"
              value={formData.customer.phone || ''}
              onChange={handleCustomerChange}
              autoComplete="off"
              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      {formData.invoiceType === 'pelunasan' && formData.parentInvoiceNumber && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
            <Info size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">{t('pelunasanNote')}</p>
            <p className="text-xs text-emerald-800 mt-0.5">
              {t('pelunasanDescription')} (<span className="font-mono">#{formData.parentInvoiceNumber}</span>)
            </p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('status')}</label>
        <div className="grid grid-cols-3 gap-2">
          {([
            { value: 'Dp', label: t('Dp'), ring: 'ring-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' },
            { value: 'Belum Terbayar', label: t('BelumTerbayar'), ring: 'ring-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-500' },
            { value: 'Lunas', label: t('Lunas'), ring: 'ring-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-500' }
          ] as const).map(opt => {
            const active = formData.status === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${active ? `${opt.bg} ${opt.text} ${opt.border} shadow-sm` : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {formData.status === 'Dp' && (
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Wallet size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900">{t('downPayment')}</h4>
              <p className="text-xs text-blue-700/80">
                {language === 'id' ? 'Atur uang muka berdasarkan persentase atau nominal tetap.' : 'Set the down payment by percentage or a fixed amount.'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-blue-900 mb-1.5">{t('downPaymentMode')}</label>
            <div className="inline-flex rounded-lg bg-white p-1 shadow-sm border border-blue-100">
              <button
                type="button"
                onClick={() => handleDpModeChange('percentage')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${formData.downPaymentMode !== 'amount' ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:text-blue-900'}`}
              >
                % {t('percentage')}
              </button>
              <button
                type="button"
                onClick={() => handleDpModeChange('amount')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${formData.downPaymentMode === 'amount' ? 'bg-blue-600 text-white shadow' : 'text-blue-700 hover:text-blue-900'}`}
              >
                {formData.currency === 'usd' ? '$' : 'Rp'} {t('fixedAmount')}
              </button>
            </div>
          </div>

          {formData.downPaymentMode === 'amount' ? (
            <div>
              <label className="block text-xs font-medium text-blue-900 mb-1">{t('fixedAmount')}</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm font-medium">
                    {formData.currency === 'usd' ? '$' : 'Rp'}
                  </span>
                </div>
                <input
                  type="number"
                  inputMode="decimal"
                  name="downPaymentAmount"
                  value={formData.downPaymentAmount || 0}
                  onChange={(e) => setFormData({ ...formData, downPaymentAmount: parseFloat(e.target.value) || 0 })}
                  onFocus={selectOnFocus}
                  onWheel={blurOnWheel}
                  aria-label={t('fixedAmount')}
                  min="0"
                  max={totals.total}
                  className="pl-10 block w-full rounded-lg border border-blue-200 shadow-sm p-2.5 text-base text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="0"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-blue-900 mb-1">{t('percentage')}</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Percent className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  inputMode="numeric"
                  name="downPaymentPercentage"
                  value={formData.downPaymentPercentage || 0}
                  onChange={(e) => setFormData({ ...formData, downPaymentPercentage: parseFloat(e.target.value) || 0 })}
                  onFocus={selectOnFocus}
                  onWheel={blurOnWheel}
                  aria-label={t('percentage')}
                  min="0"
                  max="100"
                  step="1"
                  className="pl-10 block w-full rounded-lg border border-blue-200 shadow-sm p-2.5 text-base text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="0"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {[25, 50, 75, 100].map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setFormData({ ...formData, downPaymentPercentage: p })}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${formData.downPaymentPercentage === p ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-100'}`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-200">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-[10px] font-semibold text-blue-700/70 uppercase tracking-wider">{t('dpPreview')}</p>
              <p className="text-base font-bold text-blue-900 mt-0.5">
                {formatCurrency(totals.dpAmount, formData.currency)}
              </p>
              <p className="text-[10px] text-blue-700/70">{totals.dpPercentage.toFixed(1)}% {language === 'id' ? 'dari total' : 'of total'}</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-[10px] font-semibold text-orange-700/70 uppercase tracking-wider">{t('balanceDue')}</p>
              <p className="text-base font-bold text-orange-600 mt-0.5">
                {formatCurrency(totals.balanceDue, formData.currency)}
              </p>
              <p className="text-[10px] text-orange-700/70">
                {language === 'id' ? 'Total' : 'Total'} {formatCurrency(totals.total, formData.currency)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
          {t('invoiceItems')}
          <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {formData.items.length} {formData.items.length === 1 ? 'Item' : 'Items'}
          </span>
        </h3>

        {/* Column headers (desktop only) — labels the icon-only fields below */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          <div className="md:col-span-4">{t('description')}</div>
          <div className="md:col-span-2">{t('quantity')}</div>
          <div className="md:col-span-3">{t('price')}</div>
          <div className="md:col-span-2">{t('tax')}</div>
          <div className="md:col-span-1 text-center">{t('action')}</div>
        </div>

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
                      className={itemInputClass}
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
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      onFocus={selectOnFocus}
                      onWheel={blurOnWheel}
                      aria-label={t('quantity')}
                      required
                      min="1"
                      className={itemInputClass}
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
                      inputMode="decimal"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)}
                      onFocus={selectOnFocus}
                      onWheel={blurOnWheel}
                      aria-label={t('price')}
                      required
                      min="0"
                      className={itemInputClass}
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
                      inputMode="decimal"
                      value={item.tax || 0}
                      onChange={(e) => handleItemChange(item.id, 'tax', parseFloat(e.target.value) || 0)}
                      onFocus={selectOnFocus}
                      onWheel={blurOnWheel}
                      aria-label={t('tax')}
                      min="0"
                      step="0.1"
                      className={itemInputClass}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Actions & Total */}
                <div className="md:col-span-1 flex items-center justify-between md:justify-center h-full pt-1">
                  <div className="md:hidden font-medium text-gray-700">
                    {t('total')}: {formatCurrency(item.quantity * item.price, formData.currency)}
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

              {/* Line total (desktop) */}
              <div className="hidden md:flex justify-end items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500 uppercase tracking-wide">{t('total')}</span>
                <span className="text-sm font-semibold text-gray-800">{formatCurrency(item.quantity * item.price, formData.currency)}</span>
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
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          rows={3}
          placeholder={t('paymentTerms')}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white transition active:scale-[0.98] ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
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