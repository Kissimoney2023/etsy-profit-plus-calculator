
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Search, Zap, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { UpgradeWall } from './UpgradeWall';

interface TrendNiche {
    name: string;
    trendScore: number;
    competition: string;
    profitabilityReason: string;
    heroProduct: string;
}

interface HunterResult {
    keyword: string;
    niches: TrendNiche[];
    marketSummary: string;
}

export const TrendHunter: React.FC<{ user: UserProfile | null }> = ({ user }) => {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<HunterResult | null>(null);
    const [error, setError] = useState('');

    if (!user || user.plan !== 'pro') {
        return (
            <UpgradeWall
                title="AI Trend Hunter"
                description="Discover hidden, high-margin sub-niches before they go viral. Our AI analyzes Etsy market patterns to find your next best-seller."
                plan="pro"
                features={[
                    "Identify Low-Competition Niches",
                    "Trend Velocity Scoring",
                    "Hero Product Recommendations",
                    "Profitability Analysis per Niche"
                ]}
            />
        );
    }

    const handleHunt = async () => {
        if (!keyword) {
            setError('Please enter a broad keyword to start hunting.');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const { data, error } = await supabase.functions.invoke('hunt-trends', {
                body: { keyword }
            });

            if (error) throw new Error('Failed to connect to AI Trend service.');
            if (data.error) throw new Error(data.error);

            setResult(data);
        } catch (err: any) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-4 bg-amber-100 dark:bg-amber-900/30 rounded-[28px] text-amber-600 dark:text-amber-400 mb-2">
                    <Zap className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-black text-secondary dark:text-white tracking-tighter">AI Trend Hunter</h2>
                <p className="text-gray-500 max-w-lg mx-auto font-medium">
                    Stop guessing. Enter a broad category like "jewelry" or "decor" to find underserved, high-profit sub-niches today.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-xl flex items-center max-w-2xl mx-auto">
                <div className="pl-6 pr-4">
                    <Search className="w-6 h-6 text-gray-300" />
                </div>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleHunt()}
                    placeholder="Enter a keyword (e.g. Wedding, Leather, Pet)..."
                    className="flex-grow py-5 bg-transparent outline-none font-bold text-secondary dark:text-white placeholder:text-gray-300"
                />
                <button
                    onClick={handleHunt}
                    disabled={loading}
                    className="bg-secondary dark:bg-primary text-white px-10 py-5 rounded-[28px] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Hunt Trends'}
                </button>
            </div>

            {error && (
                <div className="max-w-2xl mx-auto p-5 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-bold">
                    <AlertCircle className="w-5 h-5 mr-3" />
                    {error}
                </div>
            )}

            {result && (
                <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-gradient-to-br from-secondary to-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10">
                            <BarChart3 className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">Market Summary</h3>
                            <p className="text-xl font-medium leading-relaxed opacity-90">
                                {result.marketSummary}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {result.niches.map((niche, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                                <div className="flex items-start justify-between mb-6">
                                    <h4 className="text-2xl font-black text-secondary dark:text-white tracking-tight leading-tight pr-4">
                                        {niche.name}
                                    </h4>
                                    <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-xs font-black">
                                        {niche.trendScore}%
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest">
                                        <TrendingUp className="w-3 h-3 text-primary" />
                                        <span className="text-gray-400">Competition:</span>
                                        <span className={niche.competition === 'Low' ? 'text-green-500' : 'text-orange-500'}>{niche.competition}</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                        {niche.profitabilityReason}
                                    </p>
                                    <div className="pt-6 border-t border-gray-50 dark:border-white/5">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3">Hero Product Idea</div>
                                        <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl text-sm font-bold text-secondary dark:text-gray-200">
                                            {niche.heroProduct}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
