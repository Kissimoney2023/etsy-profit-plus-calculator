
import React from 'react';
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
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';

const MOCK_PRODUCTS = [
  { id: '1', title: 'Handmade Ceramic Mug', sku: 'MUG-001', price: 24.99, profit: 12.45, margin: 49.8, status: 'stable' },
  { id: '2', title: 'Organic Linen Totebag', sku: 'BAG-22', price: 18.00, profit: 6.20, margin: 34.4, status: 'dropping' },
  { id: '3', title: 'Walnut Desk Organizer', sku: 'DSK-99', price: 55.00, profit: 32.10, margin: 58.3, status: 'rising' },
];

const Dashboard: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to view dashboard</h2>
        <Link to="/login" className="bg-primary text-white px-6 py-2 rounded-lg">Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <StatCard title="Total Products" value={MOCK_PRODUCTS.length.toString()} icon={<Box className="text-blue-500" />} />
        <StatCard title="Avg. Margin" value="47.5%" icon={<TrendingUp className="text-primary" />} />
        <StatCard title="Est. Monthly Profit" value="$2,450" icon={<FileText className="text-orange-500" />} />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products or SKUs..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <div className="flex space-x-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button className="flex-1 md:flex-none px-4 py-2 bg-secondary text-white rounded-xl text-sm font-semibold hover:bg-opacity-90">
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
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
              {MOCK_PRODUCTS.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-secondary group-hover:text-primary transition-colors cursor-pointer">{p.title}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500 font-mono">{p.sku}</td>
                  <td className="px-6 py-5 font-bold text-secondary">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-5 font-bold text-secondary">${p.profit.toFixed(2)}</td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-green-50 text-primary text-xs font-black rounded-full border border-green-100">
                      {p.margin}%
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {p.status === 'rising' && <TrendingUp className="w-5 h-5 text-primary" />}
                    {p.status === 'stable' && <MoreHorizontal className="w-5 h-5 text-gray-400" />}
                    {p.status === 'dropping' && <TrendingDown className="w-5 h-5 text-red-500" />}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-gray-400 hover:text-secondary"><ExternalLink className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
    <div className="p-3 bg-gray-50 rounded-2xl">
      {/* Fix: use React.isValidElement and cast to any to safely clone the icon and apply styling via className */}
      {React.isValidElement(icon) ? React.cloneElement(icon as any, { className: 'w-8 h-8' }) : icon}
    </div>
    <div>
      <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">{title}</h3>
      <p className="text-2xl font-black text-secondary">{value}</p>
    </div>
  </div>
);

export default Dashboard;
