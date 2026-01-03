

import React, { useState } from 'react';
import { CalculatorInputs, CalculationResult, CurrencyCode, UserProfile } from '../types';
import { calculateEtsyProfit } from '../lib/calculator';
import { formatCurrency, getCurrencySymbol } from '../lib/currency';
import { RefreshCw, TrendingUp, TrendingDown, Swords } from 'lucide-react';
import { UpgradeWall } from './UpgradeWall';

interface ScenarioProps {
    inputs: CalculatorInputs;
    user: UserProfile | null;
}

export const CompetitorCompare: React.FC<ScenarioProps> = ({ inputs: initialInputs, user }) => {
    if (!user || user.plan !== 'pro') {
        return (
            <div className="max-w-5xl mx-auto py-8">
                <UpgradeWall
                    title="Competitor Analysis Lab"
                    description="Simulate profit scenarios against your competition. See exactly how matching their price affects your bottom line."
                    plan="pro"
                    features={[
                        "Side-by-side Margin Comparison",
                        "Price Match Simulation",
                        "Profit Impact Analysis",
                        "Winner Determination Logic"
                    ]}
                />
            </div>
        );
    }
    // We clone inputs for "My Scenario" and "Competitor Scenario"
    // Ideally we default "My Scenario" to current calculator state
    const [myInputs, setMyInputs] = useState<CalculatorInputs>(initialInputs);
    const [compInputs, setCompInputs] = useState<CalculatorInputs>({
        ...initialInputs,
        itemPrice: initialInputs.itemPrice * 0.9, // Default competitor cheap
        shippingCharged: 0 // Free shipping?
    });

    const myResult = calculateEtsyProfit(myInputs);
    const compResult = calculateEtsyProfit(compInputs);

    // Helper to calculate profit for competitor (approximated, assuming similar costs or unknown)
    // Actually competitor profit is unknown usually, but we can assume OUR costs to see if THEY are making money?
    // Or just compare Price vs Price. The prompt says "margin differences".
    // Users rarely know competitor COGS.
    // Usually "Scenario Compare" implies: "My Price A" vs "My Price B" OR "Me vs Competitor" (competitor price, my costs).
    // Let's assume "Competitor Price" but "My Costs" -> "Can I match them?"
    const canIMatchResult = calculateEtsyProfit({ ...myInputs, itemPrice: compInputs.itemPrice, shippingCharged: compInputs.shippingCharged });

    const handleMyChange = (key: keyof CalculatorInputs, val: any) => setMyInputs(prev => ({ ...prev, [key]: val }));
    const handleCompChange = (key: keyof CalculatorInputs, val: any) => setCompInputs(prev => ({ ...prev, [key]: val }));

    const symbol = getCurrencySymbol(myInputs.currency);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-rose-100 dark:bg-rose-900/30 rounded-2xl text-rose-600 dark:text-rose-400 mb-2">
                    <Swords className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-secondary dark:text-white tracking-tight">Competitor Battle</h2>
                <p className="text-gray-500 max-w-lg mx-auto">
                    Can you afford to beat their price? See how matching a competitor's pricing affects your bottom line.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* My Current Strategy */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-primary/20 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                    <h3 className="text-lg font-black text-secondary dark:text-white mb-6 uppercase tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        My Current Price
                    </h3>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Item Price</label>
                            <input
                                type="number"
                                value={myInputs.itemPrice}
                                onChange={(e) => handleMyChange('itemPrice', parseFloat(e.target.value) || 0)}
                                className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl font-black text-xl"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Shipping</label>
                            <input
                                type="number"
                                value={myInputs.shippingCharged}
                                onChange={(e) => handleMyChange('shippingCharged', parseFloat(e.target.value) || 0)}
                                className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl font-black text-xl"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm font-bold text-gray-500">Net Profit</span>
                            <span className="text-xl font-black text-primary">{formatCurrency(myResult.netProfit, myInputs.currency)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-bold text-gray-500">Margin</span>
                            <span className="text-lg font-bold text-gray-700 dark:text-gray-300">{myResult.margin.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>

                {/* Competitor Strategy */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-black text-gray-400 mb-6 uppercase tracking-widest flex items-center">
                        <span className="w-2 h-2 bg-rose-500 rounded-full mr-2"></span>
                        Competitor Price
                    </h3>

                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Their Item Price</label>
                            <input
                                type="number"
                                value={compInputs.itemPrice}
                                onChange={(e) => handleCompChange('itemPrice', parseFloat(e.target.value) || 0)}
                                className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl font-black text-xl text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Their Shipping</label>
                            <input
                                type="number"
                                value={compInputs.shippingCharged}
                                onChange={(e) => handleCompChange('shippingCharged', parseFloat(e.target.value) || 0)}
                                className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl font-black text-xl text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl space-y-3">
                        <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">If you matched them...</div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500">Your Profit</span>
                            <span className={`text-xl font-black ${canIMatchResult.netProfit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatCurrency(canIMatchResult.netProfit, myInputs.currency)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-bold text-gray-500">Your Margin</span>
                            <span className={`text-lg font-bold ${canIMatchResult.margin > 20 ? 'text-green-600' : canIMatchResult.margin > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                                {canIMatchResult.margin.toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-secondary dark:bg-slate-950 p-6 rounded-2xl text-white text-center">
                <div className="text-sm font-medium opacity-80 mb-2">Analysis</div>
                <div className="text-xl font-bold">
                    {canIMatchResult.netProfit > 0 ? (
                        canIMatchResult.netProfit > myResult.netProfit ?
                            "Wait, you make MORE by matching them? Your costs are great!" :
                            `Matching them costs you ${formatCurrency(myResult.netProfit - canIMatchResult.netProfit, myInputs.currency)} in profit per sale.`
                    ) : (
                        "Warning: You would LOSE money at this price. Do not match."
                    )}
                </div>
            </div>
        </div>
    );
};
