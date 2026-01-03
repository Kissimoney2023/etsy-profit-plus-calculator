
import React, { useState, useMemo } from 'react';
import { Globe, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { CalculatorInputs, CurrencyCode } from '../types';
import { calculateEtsyProfit } from '../lib/calculator';
import { CURRENCIES, formatCurrency, convertCurrency } from '../lib/currency';

interface RegionPricing {
    region: string;
    currency: CurrencyCode;
    shippingCost: number;
    suggestedPrice: number;
    margin: number;
}

export const MultiRegionTool: React.FC<{ inputs: CalculatorInputs }> = ({ inputs }) => {
    const baseResult = useMemo(() => calculateEtsyProfit(inputs), [inputs]);
    const targetMargin = baseResult.margin;

    const regions: { name: string; currency: CurrencyCode; extraShipping: number }[] = [
        { name: 'United Kingdom', currency: 'GBP', extraShipping: 15 },
        { name: 'European Union', currency: 'EUR', extraShipping: 12 },
        { name: 'Canada', currency: 'CAD', extraShipping: 10 },
        { name: 'Australia', currency: 'AUD', extraShipping: 20 },
    ];

    const results: RegionPricing[] = regions.map(reg => {
        // We want to find a Price P such that (P - Fees - Costs) / P = TargetMargin
        // This is a bit complex due to variable fees.
        // Simple approximation: 
        // 1. Convert base costs to target currency
        // 2. Add extra shipping
        // 3. Find price that covers costs + margin

        const localCogs = convertCurrency(inputs.cogs + inputs.packagingCost, inputs.currency, reg.currency);
        const localShipping = convertCurrency(inputs.shippingCost + reg.extraShipping, inputs.currency, reg.currency);
        const totalLocalCosts = localCogs + localShipping;

        // Roughly: Revenue = Costs / (1 - Margin% - Fee%)
        // Etsy fees are approx 10-15% total
        const estimatedFeeRevRatio = 0.12;
        const suggestedPrice = totalLocalCosts / (1 - (targetMargin / 100) - estimatedFeeRevRatio);

        // Verification with actual calculator logic (refined)
        let refinedPrice = suggestedPrice;
        for (let i = 0; i < 5; i++) {
            const testRes = calculateEtsyProfit({ ...inputs, itemPrice: refinedPrice, currency: reg.currency, shippingCost: localShipping });
            const diff = targetMargin - testRes.margin;
            refinedPrice = refinedPrice * (1 + diff / 100);
        }

        return {
            region: reg.name,
            currency: reg.currency,
            shippingCost: localShipping,
            suggestedPrice: refinedPrice,
            margin: targetMargin
        };
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10">
                    <Globe className="w-64 h-64" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-300" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">Profit Protection</span>
                        </div>
                        <h2 className="text-3xl font-black tracking-tight">Multi-Region Strategy</h2>
                        <p className="text-indigo-100 max-w-md mt-2 leading-relaxed font-medium">
                            Protect your <span className="font-black text-white">{targetMargin.toFixed(1)}% margin</span> across borders. We've adjusted for currency shifts and international logistics.
                        </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Target Margin</div>
                        <div className="text-4xl font-black">{targetMargin.toFixed(1)}%</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((res, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded-xl group-hover:bg-primary/10 transition-colors">
                                    <Globe className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                                </div>
                                <h3 className="font-black text-secondary dark:text-white uppercase tracking-wider text-xs">{res.region}</h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-end justify-between">
                                <div>
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Suggested Price</div>
                                    <div className="text-2xl font-black text-secondary dark:text-white">
                                        {formatCurrency(res.suggestedPrice, res.currency)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Est. Shipping</div>
                                    <div className="text-sm font-bold text-gray-500">
                                        {formatCurrency(res.shippingCost, res.currency)}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 flex items-center">
                                    <Info className="w-3 h-3 mr-1" />
                                    Maintains {res.margin.toFixed(0)}% Margin
                                </span>
                                <button className="text-primary text-xs font-black uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform">
                                    Copy Price <ArrowRight className="w-3 h-3 ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/20">
                <p className="text-sm text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                    <strong>Pro Tip:</strong> When selling internationally, consider using "Free Shipping" and building the cost into the item price. This typically increases conversion rates by 20-30% on Etsy for international buyers.
                </p>
            </div>
        </div>
    );
};
