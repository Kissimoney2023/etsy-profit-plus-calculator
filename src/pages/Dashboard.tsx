
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

const Dashboard: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    fetchProducts();
  }, [user]);

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
            <span>Product Inventory</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your saved calculations and product pricing.</p>
        </div>
        <Link to="/calculator" className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-100 flex items-center space-x-2 hover:bg-opacity-90 transition-all">
          <Plus className="w-5 h-5" />
          <span>New Calculation</span>
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard title="Total Products" value={totalProducts.toString()} icon={<Box className="text-blue-500" />} />
        <StatCard title="Avg. Margin" value={avgMargin} icon={<TrendingUp className="text-primary" />} />
        <StatCard title="Est. Monthly Profit" value={`$${estMonthlyProfit}`} icon={<FileText className="text-orange-500" />} />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products or SKUs..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <div className="flex space-x-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none px-4 py-2 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-opacity-90 active:scale-95 transition-all"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden min-h-[300px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">SKU</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Price</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Net Profit</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Margin</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Trend</th>
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
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-5">
        <div className="font-bold text-secondary group-hover:text-primary transition-colors cursor-pointer">{product.title || 'Untitled'}</div>
      </td>
      <td className="px-6 py-5 text-sm text-gray-500 font-mono">{product.sku || '-'}</td>
      <td className="px-6 py-5 font-bold text-secondary">${Number(inputs.itemPrice).toFixed(2)}</td>
      <td className="px-6 py-5 font-bold text-secondary">${result.netProfit.toFixed(2)}</td>
      <td className="px-6 py-5">
        <span className={`px-3 py-1 text-xs font-black rounded-full border ${result.margin > 30 ? 'bg-green-50 text-primary border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
          {result.margin.toFixed(1)}%
        </span>
      </td>
      <td className="px-6 py-5">
        {/* Mock Trend for now */}
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
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
    <div className="p-3 bg-gray-50 rounded-2xl">
      {React.isValidElement(icon) ? React.cloneElement(icon as any, { className: 'w-8 h-8' }) : icon}
    </div>
    <div>
      <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">{title}</h3>
      <p className="text-2xl font-black text-secondary">{value}</p>
    </div>
  </div>
);

export default Dashboard;
