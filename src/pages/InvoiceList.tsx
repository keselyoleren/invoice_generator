import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/format';
import {
  Plus,
  CreditCard as Edit,
  Trash2,
  FileText,
  LogOut,
  Search,
  CheckCircle2,
  Clock,
  Wallet,
  ArrowRight,
  Receipt,
  TrendingUp
} from 'lucide-react';
import { Invoice } from '../types/invoice';

type StatusFilter = 'all' | 'Dp' | 'Belum Terbayar' | 'Lunas';

const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const { invoices, deleteInvoice, loading } = useInvoices();
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Lunas':
        return {
          badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 size={14} className="text-emerald-600" />
        };
      case 'Dp':
        return {
          badge: 'bg-blue-100 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          icon: <Wallet size={14} className="text-blue-600" />
        };
      default:
        return {
          badge: 'bg-amber-100 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: <Clock size={14} className="text-amber-600" />
        };
    }
  };

  const handleDelete = async (id: string, invoiceNumber: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus invoice ${invoiceNumber}?`)) {
      setDeletingId(id);
      try {
        await deleteInvoice(id);
        showToast('Invoice berhasil dihapus', 'success');
      } catch (error) {
        console.error('Failed to delete invoice', error);
        showToast('Gagal menghapus invoice', 'error');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const stats = useMemo(() => {
    const totalInvoices = invoices.length;
    const lunas = invoices.filter(i => i.status === 'Lunas').length;
    const dp = invoices.filter(i => i.status === 'Dp').length;
    const unpaid = invoices.filter(i => i.status === 'Belum Terbayar').length;
    const outstanding = invoices.reduce((sum, inv) => {
      if (inv.status === 'Lunas') return sum;
      if (inv.status === 'Dp') return sum + (inv.balanceDue ?? inv.total);
      return sum + inv.total;
    }, 0);
    return { totalInvoices, lunas, dp, unpaid, outstanding };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return invoices.filter(inv => {
      if (filter !== 'all' && inv.status !== filter) return false;
      if (!keyword) return true;
      return (
        inv.invoiceNumber.toLowerCase().includes(keyword) ||
        inv.customer.name.toLowerCase().includes(keyword)
      );
    });
  }, [invoices, filter, search]);

  const hasSettlement = (dpInvoice: Invoice) =>
    invoices.some(i => i.parentInvoiceId === dpInvoice.id && i.invoiceType === 'pelunasan');

  const goToPelunasan = (inv: Invoice) => {
    navigate('/create', { state: { parentInvoice: inv } });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Invoice Generator
            </h1>
            <p className="text-gray-500 mt-1 text-xs sm:text-sm">
              Hai, <span className="font-medium text-gray-700">{user?.displayName}</span> — kelola semua invoice & pelunasan di satu tempat.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              <LogOut size={16} className="sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <Link
              to="/create"
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition active:scale-95"
            >
              <Plus size={16} className="mr-2" /> Invoice Baru
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-8">
          <div className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <Receipt size={12} /> Total
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1.5 sm:mt-2">{stats.totalInvoices}</p>
          </div>
          <div className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-600 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 size={12} /> Lunas
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1.5 sm:mt-2">{stats.lunas}</p>
          </div>
          <div className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 text-blue-600 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <Wallet size={12} /> DP Aktif
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1.5 sm:mt-2">{stats.dp}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-3 sm:p-5 border border-amber-100 shadow-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 text-amber-700 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              <TrendingUp size={12} /> Outstanding
            </div>
            <p className="text-sm sm:text-xl font-bold text-amber-900 mt-1.5 sm:mt-2 truncate">{formatCurrency(stats.outstanding, 'idr')}</p>
          </div>
        </div>

        {/* Filters */}
        {invoices.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari invoice atau pelanggan..."
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto -mx-1 px-1 sm:mx-0 sm:px-0 custom-scrollbar">
              {(['all', 'Dp', 'Belum Terbayar', 'Lunas'] as StatusFilter[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`shrink-0 px-3 py-2 text-xs font-semibold rounded-xl transition border ${filter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                >
                  {f === 'all' ? 'Semua' : f}
                </button>
              ))}
            </div>
          </div>
        )}

        {invoices.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
              <FileText size={26} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Belum ada invoice</h3>
            <p className="mt-1 text-sm text-gray-500 px-4">Mulai dengan membuat invoice pertama Anda.</p>
            <div className="mt-6">
              <Link
                to="/create"
                className="inline-flex items-center px-5 py-2.5 shadow-sm text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition"
              >
                <Plus size={16} className="mr-2" /> Buat Invoice Baru
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredInvoices.length === 0 ? (
              <div className="bg-white text-center py-10 rounded-2xl border border-gray-100 text-sm text-gray-500">
                Tidak ada invoice yang cocok dengan filter.
              </div>
            ) : (
              filteredInvoices.map((invoice) => {
                const statusStyle = getStatusStyle(invoice.status);
                const isDp = invoice.status === 'Dp';
                const isPelunasan = invoice.invoiceType === 'pelunasan';
                const settled = isDp && hasSettlement(invoice);
                return (
                  <div
                    key={invoice.id}
                    className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all p-3.5 sm:p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${isPelunasan ? 'bg-emerald-50 text-emerald-600' : isDp ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                          {isPelunasan ? <CheckCircle2 size={20} /> : isDp ? <Wallet size={20} /> : <FileText size={20} />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <p className="text-sm font-bold text-gray-900 truncate">{invoice.invoiceNumber}</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold border ${statusStyle.badge}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                              {invoice.status}
                            </span>
                            {isPelunasan && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Pelunasan
                              </span>
                            )}
                            {settled && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                Dilunasi
                              </span>
                            )}
                          </div>
                          <div className="mt-1 sm:mt-1.5 text-xs text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="font-medium text-gray-700 truncate max-w-[60vw] sm:max-w-none">{invoice.customer.name}</span>
                            <span className="text-gray-300">•</span>
                            <span>{formatDate(invoice.date, invoice.language)}</span>
                            {isPelunasan && invoice.parentInvoiceNumber && (
                              <>
                                <span className="text-gray-300 hidden sm:inline">•</span>
                                <span className="inline-flex items-center gap-1 text-emerald-700 basis-full sm:basis-auto">
                                  <ArrowRight size={12} /> dari #{invoice.parentInvoiceNumber}
                                </span>
                              </>
                            )}
                          </div>
                          {isDp && (
                            <div className="mt-2 grid grid-cols-2 gap-2 max-w-md">
                              <div className="bg-blue-50 rounded-lg px-2.5 sm:px-3 py-1.5">
                                <p className="text-[9px] sm:text-[10px] font-semibold text-blue-700/70 uppercase tracking-wider">DP Masuk</p>
                                <p className="text-xs font-bold text-blue-900 truncate">
                                  {formatCurrency(invoice.downPaymentAmount || 0, invoice.currency)}
                                </p>
                              </div>
                              <div className="bg-orange-50 rounded-lg px-2.5 sm:px-3 py-1.5">
                                <p className="text-[9px] sm:text-[10px] font-semibold text-orange-700/70 uppercase tracking-wider">Sisa Tagihan</p>
                                <p className="text-xs font-bold text-orange-900 truncate">
                                  {formatCurrency(invoice.balanceDue ?? invoice.total, invoice.currency)}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:gap-1 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 -mx-3.5 sm:mx-0 px-3.5 sm:px-0">
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                          {formatCurrency(invoice.total, invoice.currency)}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {isDp && !settled && (
                            <button
                              onClick={() => goToPelunasan(invoice)}
                              title="Buat invoice pelunasan"
                              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm active:scale-95 transition"
                            >
                              <CheckCircle2 size={14} /> <span className="hidden xs:inline">Pelunasan</span><span className="xs:hidden">Lunasi</span>
                            </button>
                          )}
                          <Link
                            to={`/edit/${invoice.id}`}
                            title="Edit invoice"
                            className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 active:scale-95 transition"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(invoice.id, invoice.invoiceNumber)}
                            disabled={deletingId === invoice.id}
                            title="Hapus invoice"
                            className="p-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50 active:scale-95 transition"
                          >
                            {deletingId === invoice.id ? (
                              <div className="animate-spin h-3.5 w-3.5 border-b-2 border-red-600 rounded-full"></div>
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
