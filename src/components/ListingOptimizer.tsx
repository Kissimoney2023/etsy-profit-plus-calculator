

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Sparkles, AlertCircle, CheckCircle2, TrendingUp, Search } from 'lucide-react';
import { UserProfile } from '../types';
import { UpgradeWall } from './UpgradeWall';

interface OptimizerResult {
    optimizedTitle: string;
    suggestedTags: string[];
    critique: string;
    seoScore: number;
    pricingStrategy?: {
        advice: string;
        suggestedPriceRange: string;
        marketPosition: string;
    };
}

export const ListingOptimizer: React.FC<{ user: UserProfile | null }> = ({ user }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetKeyword, setTargetKeyword] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<OptimizerResult | null>(null);
    const [error, setError] = useState('');

    if (!user || user.plan !== 'pro') {
        return (
            <UpgradeWall
                title="AI Listing Optimizer"
                description="Unlock the power of Gemini AI to analyze your titles, descriptions, and tags for maximum Etsy SEO visibility."
                plan="pro"
                features={[
                    "AI-powered Keyword Analysis",
                    "Tag suggestions based on trends",
                    "Readability & Sentiment scoring",
                    "One-click Copy & Paste"
                ]}
            />
        );
    }

    const handleOptimize = async () => {
        if (!title || !description) {
            setError('Please provide at least a title and brief description.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data, error } = await supabase.functions.invoke('optimize-listing', {
                body: {
                    title,
                    description,
                    targetKeyword,
                    currentPrice: price,
                    currency
                }
            });

            if (error) {
                console.error("Function error:", error);
                throw new Error('Failed to connect to AI service. Please try again later.');
            }

            if (data.error) {
                throw new Error(data.error);
            }

            setResult(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-2">
                    <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-secondary dark:text-white tracking-tight">AI Listing Optimizer</h2>
                <p className="text-gray-500 max-w-lg mx-auto">
                    Unlock higher rankings. Paste your current details and let our AI analyze keyword density, readability, and SEO strength.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Target Keyword (Optional)</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={targetKeyword}
                                onChange={(e) => setTargetKeyword(e.target.value)}
                                placeholder="e.g. 'Silver Ring'"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Current Title</label>
                        <textarea
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Paste your Etsy listing title here..."
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium h-24 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Paste the first few paragraphs of your description..."
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium h-32 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Current Price</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold appearance-none"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="CAD">CAD</option>
                                <option value="AUD">AUD</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleOptimize}
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        <span>{loading ? 'Optimizing...' : 'Generate AI Strategy'}</span>
                    </button>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {result ? (
                        <>
                            <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
                                <div className="relative z-10 flex items-center justify-between">
                                    <div>
                                        <div className="text-indigo-200 font-bold text-xs uppercase tracking-widest mb-1">SEO Score</div>
                                        <div className="text-5xl font-black tracking-tighter">{result.seoScore}/100</div>
                                    </div>
                                    <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                                        <TrendingUp className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="text-sm text-indigo-100 font-medium leading-relaxed">
                                        "{result.critique}"
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Optimized Title</label>
                                        <button onClick={() => copyToClipboard(result.optimizedTitle)} className="text-primary text-xs font-bold hover:underline">Copy</button>
                                    </div>
                                    <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 text-green-800 dark:text-green-300 rounded-xl font-bold text-sm leading-relaxed">
                                        {result.optimizedTitle}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Suggested Tags (13)</label>
                                        <button onClick={() => copyToClipboard(result.suggestedTags.join(', '))} className="text-primary text-xs font-bold hover:underline">Copy All</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {result.suggestedTags.map((tag, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {result.pricingStrategy && (
                                    <div className="pt-6 border-t border-gray-100 dark:border-slate-800 space-y-4">
                                        <div className="flex items-center space-x-2 text-primary">
                                            <TrendingUp className="w-4 h-4" />
                                            <span className="text-xs font-black uppercase tracking-[0.2em]">Pricing Strategy</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Suggested Range</div>
                                                <div className="text-sm font-black text-secondary dark:text-white">{result.pricingStrategy.suggestedPriceRange}</div>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Market Position</div>
                                                <div className="text-sm font-black text-secondary dark:text-white">{result.pricingStrategy.marketPosition}</div>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 italic">
                                            "{result.pricingStrategy.advice}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full bg-gray-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-8 opacity-60">
                            <Sparkles className="w-12 h-12 text-gray-300 mb-4" />
                            <p className="text-gray-400 font-bold">Results will appear here...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
