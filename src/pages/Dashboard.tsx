
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  Box,
  FileText,
  Trash2,
  Edit
} from 'lucide-react';
import { UserProfile, Product, CalculationResult } from '../types';
import { supabase } from '../lib/supabase';
import { calculateEtsyProfit } from '../lib/calculator';

import { SEO } from '../components/SEO';
import { BulkImport } from '../components/BulkImport';
import { InventoryTrendChart } from '../components/InventoryTrendChart';
import { X, Link2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { initiateEtsyConnection, exchangeEtsyCode } from '../lib/etsy-auth';

const Dashboard: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [shopConnection, setShopConnection] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check for OAuth Callback
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      handleEtsyCallback(code, state);
    } else if (user) {
      fetchShopConnection();
    }
  }, [user]);

  const fetchShopConnection = async () => {
    if (!user) return;
    const { data } = await supabase.from('shop_connections').select('*').eq('platform', 'etsy').single();
    if (data) setShopConnection(data);
  };

  const handleEtsyCallback = async (code: string, state: string) => {
    setIsConnecting(true);
    // clean url
    window.history.replaceState({}, document.title, window.location.pathname);

    try {
      const result = await exchangeEtsyCode(code, state);
      if (result.success) {
        setShopConnection(result.shop || { shop_name: 'Connected' });
        // alert('Shop connected successfully!');
      }
    } catch (e: any) {
      console.error(e);
      alert('Failed to connect shop: ' + e.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (user) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } else {
        const saved = localStorage.getItem('etsy_saved_products');
        if (saved) {
          const parsed = JSON.parse(saved);
          setProducts(parsed.map((p: any) => ({
            id: p.id,
            user_id: 'guest',
            title: p.title || p.sku,
            sku: p.sku,
            currency: p.currency,
            inputs: p,
            created_at: p.timestamp
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      if (user) {
        const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) throw error;
      } else {
        const saved = localStorage.getItem('etsy_saved_products');
        if (saved) {
          const parsed = JSON.parse(saved);
          const updated = parsed.filter((p: any) => p.id !== productId);
          localStorage.setItem('etsy_saved_products', JSON.stringify(updated));
        }
      }
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleBulkImport = async (importedProducts: any[]) => {
    try {
      if (user) {
        const { data, error } = await supabase.from('products').insert(
          importedProducts.map(p => ({
            user_id: user.id,
            title: p.sku || 'Untitled Product',
            sku: p.sku,
            currency: p.currency,
            inputs: p as any
          }))
        ).select();

        if (error) throw error;
        if (data) {
          setProducts(prev => [...data, ...prev]);
        }
      } else {
        const newProducts = importedProducts.map(p => ({
          id: crypto.randomUUID(),
          user_id: 'guest',
          title: p.sku || 'Untitled Product',
          sku: p.sku,
          currency: p.currency,
          inputs: p,
          created_at: new Date().toISOString()
        }));

        const saved = localStorage.getItem('etsy_saved_products');
        const parsed = saved ? JSON.parse(saved) : [];
        const updated = [...newProducts.map(p => p.inputs), ...parsed];
        localStorage.setItem('etsy_saved_products', JSON.stringify(updated));

        setProducts(prev => [...newProducts, ...prev]);
      }
      setIsImportModalOpen(false);
    } catch (err) {
      console.error('Error during bulk import:', err);
    }
  };

  const handleExportCSV = () => {
    if (products.length === 0) return;
    const headers = ['ID', 'Title', 'SKU', 'Currency', 'Net Profit', 'Margin'];
    const rows = products.map(p => {
      const inputs = (p.inputs || p) as any;
      const res = calculateEtsyProfit(inputs);
      return [p.id, p.title, p.sku, p.currency, res.netProfit.toFixed(2), res.margin.toFixed(2)];
    });
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `etsy_export_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(p =>
    (p.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (p.sku?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalProducts = products.length;
  const avgMargin = products.length > 0 ? (products.reduce((acc, p) => {
    const inputs = (p.inputs || p) as any;
    return acc + calculateEtsyProfit(inputs).margin;
  }, 0) / products.length).toFixed(1) + '%' : '0%';

  const estMonthlyProfit = products.length > 0 ? products.reduce((acc, p) => {
    const inputs = (p.inputs || p) as any;
    return acc + calculateEtsyProfit(inputs).netProfit;
  }, 0).toFixed(2) : '0';

  if (!user && !localStorage.getItem('etsy_saved_products')) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to view dashboard</h2>
        <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-lg">Login</Link>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        title="Seller Dashboard | Etsy Profit Calculator"
        description="Manage your Etsy inventory calculations and pricing history."
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-secondary flex items-center space-x-3">
            <LayoutDashboard className="text-primary w-8 h-8" />
            <span className="dark:text-white">Product Inventory</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your saved calculations and product pricing.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="bg-white dark:bg-slate-900 text-secondary dark:text-white px-6 py-3 rounded-xl font-bold border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all"
          >
            Bulk Import Shop
          </button>

          {user && (
            shopConnection ? (
              <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 px-6 py-3 rounded-xl font-bold border border-green-100 dark:border-green-500/20">
                <CheckCircle2 className="w-5 h-5" />
                <span>{shopConnection.shop_name || 'Shop Connected'}</span>
              </div>
            ) : (
              <button
                onClick={initiateEtsyConnection}
                disabled={isConnecting}
                className="bg-white dark:bg-slate-900 text-secondary dark:text-white px-6 py-3 rounded-xl font-bold border border-gray-100 dark:border-slate-800 hover:bg-gray-50 transition-all flex items-center space-x-2"
              >
                {isConnecting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Link2 className="w-5 h-5" />}
                <span>{isConnecting ? 'Connecting...' : 'Connect Shop'}</span>
              </button>
            )
          )}

          <Link to="/calculator" className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-100 flex items-center space-x-2 hover:bg-opacity-90 transition-all">
            <Plus className="w-5 h-5" />
            <span>New Calculation</span>
          </Link>
        </div>
      </div>

      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-secondary dark:text-white">Bulk Shop Analysis</h3>
                <p className="text-xs font-medium text-gray-400">Upload your Etsy Listings CSV</p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <BulkImport onImport={handleBulkImport} />
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Products" value={totalProducts.toString()} icon={<Box className="text-blue-500" />} />
        <StatCard title="Avg. Margin" value={avgMargin} icon={<TrendingUp className="text-primary" />} />
        <StatCard title="Est. Monthly Profit" value={`$${estMonthlyProfit}`} icon={<FileText className="text-orange-500" />} />
      </div>

      <div className="mb-12">
        <InventoryTrendChart products={products} />
      </div>

      {/* Filters */}
      <div className="glass p-6 rounded-[32px] mb-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products or SKUs..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none font-bold text-sm dark:text-white dark:placeholder:text-slate-600"
          />
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-3 px-6 py-3 border border-gray-100 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 uppercase tracking-widest transition-all">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none px-8 py-3 bg-secondary dark:bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-[48px] overflow-hidden min-h-[300px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="hidden md:table-cell px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">SKU</th>
                <th className="hidden md:table-cell px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Price</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Profit</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Margin</th>
                <th className="hidden lg:table-cell px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Trend</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">Loading inventory...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">No products found. Add your first calculation!</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <ProductRow key={p.id} product={p} onDelete={handleDelete} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductRow: React.FC<{ product: Product; onDelete: (id: string) => void | Promise<void> }> = ({ product, onDelete }) => {
  const inputs = (product.inputs || product) as any;
  const result = calculateEtsyProfit(inputs);

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
      <td className="px-6 py-5">
        <div className="font-black text-secondary dark:text-white group-hover:text-primary transition-colors cursor-pointer truncate max-w-[120px] md:max-w-none">{product.title || 'Untitled'}</div>
      </td>
      <td className="hidden md:table-cell px-6 py-5 text-sm text-gray-400 font-mono">{product.sku || '-'}</td>
      <td className="hidden md:table-cell px-6 py-5 font-bold text-secondary">${Number(inputs.itemPrice).toFixed(2)}</td>
      <td className="px-6 py-5 font-black text-secondary">${result.netProfit.toFixed(2)}</td>
      <td className="px-6 py-5">
        <span className={`px-3 py-1 text-[10px] font-black rounded-xl border ${result.margin > 30 ? 'bg-green-50 text-primary border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
          {result.margin.toFixed(0)}%
        </span>
      </td>
      <td className="hidden lg:table-cell px-6 py-5">
        <MoreHorizontal className="w-5 h-5 text-gray-400" />
      </td>
      <td className="px-6 py-5 text-right flex justify-end space-x-2">
        <Link to={`/calculator?id=${product.id}`} className="p-2 text-gray-400 hover:text-primary transition-colors inline-block" title="Edit">
          <Edit className="w-4 h-4" />
        </Link>
        <button
          onClick={() => onDelete(product.id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors inline-block"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="glass p-8 rounded-[40px] flex items-center space-x-6 group hover:-translate-y-1 transition-all duration-300">
    <div className="p-4 bg-primary/5 dark:bg-white/5 rounded-[24px] group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
      {React.isValidElement(icon) ? React.cloneElement(icon as any, {
        className: `w-10 h-10 ${title === 'Avg. Margin' ? 'floating' : ''}`
      }) : icon}
    </div>
    <div>
      <h3 className="text-gray-400 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</h3>
      <p className="text-3xl font-black text-secondary dark:text-white tracking-tight">{value}</p>
    </div>
  </div>
);

export default Dashboard;
