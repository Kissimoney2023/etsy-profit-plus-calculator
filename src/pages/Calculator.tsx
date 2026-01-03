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
import { ToolSidebar } from '../components/ToolSidebar';
import { CalculatorInputs, CalculationResult, UserProfile, CurrencyCode } from '../types';
import { calculateEtsyProfit } from '../lib/calculator';
import { supabase } from '../lib/supabase';
import { CURRENCIES, getCurrencyDetails, formatCurrency, convertCurrency } from '../lib/currency';
import { COUNTRY_PRESETS, CountryPreset } from '../lib/countries';
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
const CalculatorPage: React.FC<{ user: UserProfile | null; toolType?: string }> = ({ user, toolType = 'profit' }) => {
  const [searchParams] = useSearchParams();
  const activeTool = toolType || searchParams.get('tool') || 'profit';
  const idParam = searchParams.get('id'); // Get ID if editing

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
  const [selectedCountry, setSelectedCountry] = useState<CountryPreset['id']>('US');

  // Sync country selection with inputs if loaded from save
  useEffect(() => {
    if (activeTool && inputs.currency) {
      // Attempt to find matching country or default to 'Global'
      const match = COUNTRY_PRESETS.find(c => c.currency === inputs.currency && c.regulatoryFee === inputs.regulatoryFeePercent);
      if (match) setSelectedCountry(match.id);
      else setSelectedCountry('Global');
    }
  }, [idParam]);

  const currencyInfo = useMemo(() => getCurrencyDetails(inputs.currency), [inputs.currency]);
  const { symbol, name: currencyName } = currencyInfo;

  // Persistence: Auto-draft to LocalStorage as the user types
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DRAFT, JSON.stringify(inputs));
  }, [inputs]);

  // Load existing product if ID is present
  useEffect(() => {
    const loadProduct = async () => {
      if (!idParam) return;

      try {
        if (user) {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', idParam)
            .single();

          if (error) throw error;
          if (data) {
            setInputs({ ...data.inputs as any, sku: data.sku }); // Ensure inputs are set
          }
        } else {
          const saved = localStorage.getItem(STORAGE_KEY_SAVED);
          if (saved) {
            const parsed = JSON.parse(saved);
            const found = parsed.find((p: any) => p.id === idParam);
            if (found) {
              setInputs(found);
            }
          }
        }
      } catch (error) {
        console.error("Error loading product:", error);
      }
    };
    loadProduct();
  }, [idParam, user]);

  useEffect(() => {
    if (activeTool) {
      if (activeTool === 'ads') {
        setInputs(prev => ({ ...prev, offsiteAdsEnabled: true }));
      }
      if (activeTool === 'breakeven') {
        setInputs(prev => ({ ...prev, targetProfitValue: 0, targetProfitType: 'margin' }));
      }
    }
  }, [activeTool]);

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

    // Check if this currency belongs to a specific country preset, otherwise Global
    const preset = COUNTRY_PRESETS.find(c => c.currency === newCurrency && c.id === selectedCountry);
    if (!preset) {
      setSelectedCountry('Global');
    }

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

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId);
    const preset = COUNTRY_PRESETS.find(c => c.id === countryId);
    if (preset) {
      // If currency changes, convert values
      if (preset.currency !== inputs.currency) {
        handleCurrencyChange(preset.currency);
      }
      // Update fees
      setInputs(prev => ({
        ...prev,
        regulatoryFeePercent: preset.regulatoryFee,
        // Update listing fee (approx 0.20 USD converted)
        listingFee: Math.round(convertCurrency(0.20, 'USD', preset.currency) * 100) / 100
      }));
    }
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
          .upsert({
            id: idParam || undefined, // Update if ID exists
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

        const existingIndex = idParam
          ? savedProducts.findIndex((p: any) => p.id === idParam)
          : savedProducts.findIndex((p: any) => p.sku === inputs.sku);

        if (existingIndex > -1) {
          // Update existing
          savedProducts[existingIndex] = { ...savedProducts[existingIndex], ...inputs, title: inputs.sku, timestamp: new Date().toISOString() };
        } else {
          // Create new
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative flex flex-col lg:flex-row gap-8">
      <ToolSidebar />

      <div className="flex-grow min-w-0">
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

        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <CalcIcon className="w-4 h-4" />
              <span>Etsy Seller Toolkit</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-secondary dark:text-white tracking-tighter">
              {activeTool === 'fees' ? 'Fee Calculator' : activeTool === 'breakeven' ? 'Break-Even Tool' : activeTool === 'ads' ? 'Ads Scenario Tool' : 'Profit Analyzer'}
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              {activeTool === 'breakeven'
                ? 'Find the minimum price you need to charge to cover all costs.'
                : activeTool === 'ads'
                  ? 'Calculate how Offsite Ads fees impact your margins.'
                  : 'Analyze your profit margins and fees with precision.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center text-secondary dark:text-white">
                <Tag className="w-5 h-5 mr-3 text-primary" />
                Listing Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Seller Location</label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold text-secondary dark:text-white appearance-none cursor-pointer"
                  >
                    {COUNTRY_PRESETS.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Currency</label>
                  <select
                    value={inputs.currency}
                    onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold text-secondary dark:text-white appearance-none cursor-pointer"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} ({c.symbol}) - {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Product SKU / Title</label>
                <input
                  type="text"
                  value={inputs.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  placeholder="e.g. Handmade Mug"
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold text-secondary dark:text-white ${skuError ? 'ring-2 ring-red-500' : ''}`}
                />
                {skuError && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-widest">{skuError}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Item Price ({symbol})</label>
                  <input
                    type="number"
                    value={inputs.itemPrice}
                    onChange={(e) => handleChange('itemPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold text-secondary dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Shipping Charged ({symbol})</label>
                  <input
                    type="number"
                    value={inputs.shippingCharged}
                    onChange={(e) => handleChange('shippingCharged', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold text-secondary dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                <h3 className="text-sm font-bold mb-4 text-secondary dark:text-white">Costs & Expenses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Item Cost (COGS)</label>
                    <input
                      type="number"
                      value={inputs.cogs}
                      onChange={(e) => handleChange('cogs', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold text-secondary dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Shipping Cost to You</label>
                    <input
                      type="number"
                      value={inputs.shippingCost}
                      onChange={(e) => handleChange('shippingCost', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold text-secondary dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-secondary dark:text-white">Fee Settings</h3>
                  {activeTool === 'ads' && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold">Ads Mode Active</span>}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-sm font-medium">Offsite Ads (12-15%)</span>
                    <div
                      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${inputs.offsiteAdsEnabled ? 'bg-primary' : 'bg-gray-300'}`}
                      onClick={() => handleChange('offsiteAdsEnabled', !inputs.offsiteAdsEnabled)}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${inputs.offsiteAdsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <span className="text-sm font-medium">Regulatory Fee (%)</span>
                    <input
                      type="number"
                      value={inputs.regulatoryFeePercent}
                      onChange={(e) => handleChange('regulatoryFeePercent', parseFloat(e.target.value) || 0)}
                      className="w-20 px-2 py-1 bg-white dark:bg-slate-900 rounded outline-none text-right font-bold"
                    />
                  </div>
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
      </div >
    </div >
  );
};

export default CalculatorPage;