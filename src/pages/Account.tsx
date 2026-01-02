import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../types';
import { CreditCard, ExternalLink, ShieldCheck, Mail, Clock, Zap, Loader2 } from 'lucide-react';

const Account: React.FC<{ user: UserProfile | null; setUser: (user: UserProfile) => void }> = ({ user, setUser }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (!user) return null;

  const handleManageBilling = () => {
    setIsRedirecting(true);
    // Simulate redirect to Stripe Billing Portal
    setTimeout(() => {
      setIsRedirecting(false);
      alert("This would redirect you to the Stripe Billing Portal in a production environment.");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-black text-secondary mb-10">Account Settings</h1>
      
      <div className="space-y-8">
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Mail className="w-6 h-6 mr-3 text-primary" />
            Profile Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Email Address</label>
              <div className="text-lg font-bold text-secondary">{user.email}</div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase mb-1">Member Since</label>
              <div className="text-lg font-bold text-secondary">January 2024</div>
            </div>
          </div>
        </div>

        {/* Subscription Card */}
        <div className="bg-secondary p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-primary" />
                Current Subscription
              </h2>
              <div className="inline-flex items-center px-4 py-1 bg-primary rounded-full text-xs font-black uppercase tracking-widest mb-4">
                {user.plan} Plan
              </div>
              <p className="text-gray-400 text-sm max-w-sm">
                {user.plan === 'free' 
                  ? "You are currently on the free plan with daily usage limits." 
                  : `Your next billing date is ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}. Manage your plan via the Stripe Billing portal.`
                }
              </p>
            </div>
            
            {user.plan === 'free' ? (
              <Link to="/pricing" className="w-full md:w-auto px-8 py-4 bg-primary text-white font-black rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2">
                <Zap className="w-4 h-4 fill-current" />
                <span>Upgrade Now</span>
              </Link>
            ) : (
              <button 
                onClick={handleManageBilling}
                disabled={isRedirecting}
                className="w-full md:w-auto px-8 py-4 bg-white text-secondary font-black rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center space-x-2"
              >
                {isRedirecting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isRedirecting ? "Redirecting..." : "Manage Billing"}</span>
                {!isRedirecting && <ExternalLink className="w-4 h-4" />}
              </button>
            )}
          </div>
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
        </div>

        {/* Upgrade Highlights for Free Users */}
        {user.plan === 'free' && (
          <div className="bg-green-50 p-8 rounded-3xl border border-green-100 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-black text-secondary">Unlock Professional Tools</h3>
              <p className="text-gray-600 text-sm">Save up to 50 products, get unlimited calculations, and protect your margins from Offsite Ads.</p>
            </div>
            <Link to="/pricing" className="text-primary font-black uppercase text-xs tracking-widest flex items-center group">
              Explore Plans <Clock className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* Danger Zone */}
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100">
          <h2 className="text-lg font-bold text-red-800 mb-4">Account Safety</h2>
          <p className="text-red-700 text-sm mb-6">Once you delete your account, all your saved products and calculation history will be permanently removed.</p>
          <button className="px-6 py-3 border-2 border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;