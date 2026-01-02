import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Calculator as CalcIcon,
  Save,
  AlertCircle,
  ShieldCheck,
  Globe,
  Info,
  Zap,
  CheckCircle2,
  Loader2,
  Tag,
  RotateCcw,
  HelpCircle
} from 'lucide-react';
import { CalculatorInputs, CalculationResult, UserProfile, CurrencyCode } from '../types';
import { calculateEtsyProfit } from '../lib/calculator';
import { supabase } from '../lib/supabase';
import { CURRENCIES, getCurrencyDetails, formatCurrency, convertCurrency } from '../lib/currency';
import { canPerformCalculation, recordCalculationUsage } from '../lib/usage';

const DEFAULT_INPUTS: CalculatorInputs = {
  sku: '',
  currency: 'USD',
  itemPrice: 24.99,
  targetProfitType: 'margin',
  targetProfitValue: 30,
  cogs: 5.00,
  packagingCost: 1.00,
  shippingCost: 4.50,
  shippingCharged: 0.00,
  listingFee: 0.20,
  transactionFeePercent: 6.5,
  processingFeePercent: 3.0,
  processingFeeFixed: 0.25,
  offsiteAdsEnabled: false,
  offsiteAdsRate: 15,
  regulatoryFeePercent: 0,
  returnsAllowancePercent: 2,
};

const STORAGE_KEY_DRAFT = 'etsy_active_calc';
const STORAGE_KEY_SAVED = 'etsy_saved_products';

// Helper to get display names for fee keys
const getFeeDisplayName = (feeKey: string): string => {
  const names: Record<string, string> = {
    listing: 'Listing Fee',
    transaction: 'Transaction Fee',
    processing: 'Processing Fee',
    offsiteAds: 'Offsite Ads',
    regulatory: 'Regulatory Fee',
  };
  return names[feeKey] || feeKey.charAt(0).toUpperCase() + feeKey.slice(1);
};

// Refined Dynamic Fee Descriptions based on current inputs
const getFeeDescription = (feeKey: string, currencyName: string, symbol: string, inputs: CalculatorInputs): string => {
  const descriptions: Record<string, string> = {
    listing: `Etsy's flat fee of $0.20 USD per listing. Based on current exchange rates, this is approximately ${symbol}${inputs.listingFee.toFixed(2)} in ${inputs.currency}.`,
    transaction: `A ${inputs.transactionFeePercent}% commission charged by Etsy on the total transaction amount (Item Price + Shipping).`,
    processing: `The cost of handling the payment in ${currencyName}: ${inputs.processingFeePercent}% of the total order plus a fixed ${symbol}${inputs.processingFeeFixed.toFixed(2)} charge.`,
    offsiteAds: `Ads fee (only if a buyer clicks an Etsy-placed ad and purchases): ${inputs.offsiteAdsRate}% of the total sale value.`,
    regulatory: `A small percentage (${inputs.regulatoryFeePercent}%) applied to total sales in specific countries (UK, FR, IT, ES, TR) to cover local operating costs.`,
  };
  return descriptions[feeKey] || `Standard Etsy business fee calculated based on your revenue in ${currencyName}.`;
};

// Fix: Completed the component definition and added default export to resolve import errors in other files.
const CalculatorPage: React.FC<{ user: UserProfile | null }> = ({ user }) => {
  const [searchParams] = useSearchParams();
  const toolParam = searchParams.get('tool');

  // Initialize from LocalStorage Draft
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRAFT);
      return saved ? JSON.parse(saved) : DEFAULT_INPUTS;
    } catch (e) {
      return DEFAULT_INPUTS;
    }
  });

  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [usageError, setUsageError] = useState('');
  const [skuError, setSkuError] = useState('');

  const currencyInfo = useMemo(() => getCurrencyDetails(inputs.currency), [inputs.currency]);
  const { symbol, name: currencyName } = currencyInfo;

  // Persistence: Auto-draft to LocalStorage as the user types
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(inputs));
  }, [inputs]);

  useEffect(() => {
    if (toolParam) {
      if (toolParam === 'offsite-ads') setInputs(prev => ({ ...prev, offsiteAdsEnabled: true }));
      if (toolParam === 'breakeven') setInputs(prev => ({ ...prev, targetProfitValue: 0 }));
    }
  }, [toolParam]);

  useEffect(() => {
    if (!canPerformCalculation(user)) {
      setUsageError('Daily free limit reached (5/5). Upgrade for unlimited usage.');
      return;
    }
    setUsageError('');
    const res = calculateEtsyProfit(inputs);
    setResults(res);
    recordCalculationUsage(user);
  }, [inputs, user]);

  const handleChange = (name: keyof CalculatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [name]: value }));
    if (name === 'sku') {
      if (value.trim() !== '') {
        setSkuError('');
      }
    }
  };

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    const oldCurrency = inputs.currency;
    if (oldCurrency === newCurrency) return;
    setInputs(prev => {
      const next = { ...prev, currency: newCurrency };
      const moneyKeys = ['itemPrice', 'cogs', 'packagingCost', 'shippingCost', 'shippingCharged', 'listingFee', 'processingFeeFixed'] as const;
      moneyKeys.forEach(key => {
        const converted = convertCurrency(prev[key], oldCurrency, newCurrency);
        next[key] = Math.round(converted * 100) / 100;
      });
      return next;
    });
  };

  const handleSave = async () => {
    // 1. Validation
    if (!inputs.sku || inputs.sku.trim() === '') {
      setSkuError('Please provide a unique SKU before saving.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);

    // 2. Persist to Supabase if logged in, else LocalStorage
    try {
      if (user) {
        const { error } = await supabase
          .from('products')
          .insert({
            user_id: user.id,
            title: inputs.sku,
            sku: inputs.sku,
            currency: inputs.currency,
            inputs: inputs as any // Cast inputs to JSON type
          });

        if (error) throw error;

        setIsSaving(false);
        setSaveMessage('Product saved to cloud inventory!');
      } else {
        // Fallback to local storage
        const existingSaved = localStorage.getItem(STORAGE_KEY_SAVED);
        const savedProducts = existingSaved ? JSON.parse(existingSaved) : [];

        const newProduct = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          title: inputs.sku,
          ...inputs
        };

        const existingIndex = savedProducts.findIndex((p: any) => p.sku === inputs.sku);
        if (existingIndex > -1) {
          savedProducts[existingIndex] = newProduct;
        } else {
          savedProducts.push(newProduct);
        }

        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedProducts));
        setSaveMessage('Draft saved locally! Sign up to sync.');
        setTimeout(() => {
          window.location.hash = '#/signup';
        }, 1500);
        setIsSaving(false);
      }

      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save product:', error);
      setIsSaving(false);
      setSaveMessage('Error saving product. Try again.');
    }
  };

  const handleReset = () => {
    if (confirm('Clear all inputs? This draft will be lost.')) {
      setInputs(DEFAULT_INPUTS);
      setSkuError('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      {saveMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 font-black uppercase text-xs tracking-widest">
            <CheckCircle2 className="w-5 h-5" />
            <span>{saveMessage}</span>
          </div>
        </div>
      )}

      {usageError && (
        <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-100 dark:border-red-900/30 rounded-2xl flex items-center space-x-3 text-red-600 dark:text-red-400 font-bold">
          <AlertCircle className="w-5 h-5" />
          <span>{usageError}</span>
          <Link to="/pricing" className="ml-auto underline">Upgrade Plan</Link>
        </div>
      )}

      <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <div className="flex items-center space-x-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-3">
            <CalcIcon className="w-4 h-4" />
            <span>Etsy Seller Toolkit</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-secondary dark:text-white tracking-tighter">
            {toolParam === 'fees' ? 'Fee Calculator' : toolParam === 'breakeven' ? 'Break-Even Tool' : 'Profit Analyzer'}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center text-secondary dark:text-white">
              <Tag className="w-5 h-5 mr-3 text-primary" />
              Listing Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Product SKU / Title</label>
                <input
                  type="text"
                  value={inputs.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  placeholder="e.g. Handmade Mug"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold ${skuError ? 'ring-2 ring-red-500' : ''}`}
                />
                {skuError && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">{skuError}</p>}
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-secondary dark:bg-slate-950 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-6">Financial Summary</h2>
              {results && (
                <div className="space-y-6">
                  <div>
                    <div className="text-5xl font-black tracking-tighter text-primary">
                      {formatCurrency(results.netProfit, inputs.currency)}
                    </div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Net Profit per Sale</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                    <div>
                      <div className="text-xl font-black">{results.margin.toFixed(1)}%</div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Profit Margin</div>
                    </div>
                    <div>
                      <div className="text-xl font-black">{formatCurrency(results.fees.total, inputs.currency)}</div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Etsy Fees</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          </section>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 shadow-lg hover:bg-opacity-90 transition-all"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving...' : 'Save Product'}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-4 bg-gray-100 dark:bg-slate-800 rounded-2xl text-gray-500 hover:text-red-500 transition-colors"
              aria-label="Reset fields"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;