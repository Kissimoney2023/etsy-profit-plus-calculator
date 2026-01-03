import React, { useState } from 'react';
import { CalculatorInputs, CalculationResult } from '../types';
import { calculateEtsyProfit } from '../lib/calculator';
import { formatCurrency } from '../lib/currency';
import { Megaphone, TrendingUp, TrendingDown, AlertCircle, DollarSign, Percent } from 'lucide-react';

interface AdsScenarioToolProps {
    inputs: CalculatorInputs;
}

export const AdsScenarioTool: React.FC<AdsScenarioToolProps> = ({ inputs }) => {
    const [adsPercentage, setAdsPercentage] = useState(25); // % of sales from ads
    const [monthlyOrders, setMonthlyOrders] = useState(50);

    // Calculate scenarios
    const calculateScenario = (offsiteAdsEnabled: boolean, adsRate: number) => {
        const modifiedInputs = {
            ...inputs,
            offsiteAdsEnabled,
            offsiteAdsRate: adsRate
        };
        return calculateEtsyProfit(modifiedInputs);
    };

    // Scenarios
    const noAdsResult = calculateScenario(false, 0);
    const with12PercentResult = calculateScenario(true, 12);
    const with15PercentResult = calculateScenario(true, 15);

    // Calculate monthly impact
    const ordersFromAds = Math.round((monthlyOrders * adsPercentage) / 100);
    const ordersOrganic = monthlyOrders - ordersFromAds;

    const monthlyNoAds = noAdsResult.netProfit * monthlyOrders;
    const monthlyWith12 = (noAdsResult.netProfit * ordersOrganic) + (with12PercentResult.netProfit * ordersFromAds);
    const monthlyWith15 = (noAdsResult.netProfit * ordersOrganic) + (with15PercentResult.netProfit * ordersFromAds);

    // Decision helper
    const shouldOptIn = monthlyWith15 > monthlyNoAds;
    const revenueThreshold = 10000;
    const isMandatory = inputs.itemPrice * monthlyOrders * 12 > revenueThreshold;

    return (
        <div className="space-y-8">
            {/* Status Banner */}
            {isMandatory ? (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-start">
                        <AlertCircle className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-black text-orange-900 mb-2">Offsite Ads Are Mandatory for You</h3>
                            <p className="text-orange-800 mb-2">
                                Based on your projected annual revenue of {formatCurrency(inputs.itemPrice * monthlyOrders * 12, inputs.currency)},
                                you're over the $10,000 threshold. Offsite Ads are mandatory at 12%.
                            </p>
                            <p className="text-sm text-orange-700">
                                This tool will help you understand the impact and price accordingly.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-start">
                        <Megaphone className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-black text-blue-900 mb-2">Offsite Ads Are Optional for You</h3>
                            <p className="text-blue-800">
                                You're under $10,000 annual revenue. You can opt in at 15% or stay opted out.
                                Use this tool to decide what's best for your business.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Input Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                        Monthly Orders: {monthlyOrders}
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={monthlyOrders}
                        onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10</span>
                        <span>250</span>
                        <span>500</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                        % of Sales from Ads: {adsPercentage}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={adsPercentage}
                        onChange={(e) => setAdsPercentage(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {ordersFromAds} orders from ads, {ordersOrganic} organic
                    </p>
                </div>
            </div>

            {/* Per-Sale Comparison */}
            <div className="mb-8">
                <h3 className="text-xl font-black text-secondary mb-4">Profit Per Sale</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* No Ads */}
                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-700">No Offsite Ads</h4>
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        </div>
                        <div className="text-3xl font-black text-secondary mb-2">
                            {formatCurrency(noAdsResult.netProfit, inputs.currency)}
                        </div>
                        <div className="text-sm text-gray-500">
                            {((noAdsResult.netProfit / noAdsResult.revenue) * 100).toFixed(1)}% margin
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex justify-between">
                                    <span>Revenue</span>
                                    <span className="font-bold">{formatCurrency(noAdsResult.revenue, inputs.currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Fees</span>
                                    <span className="font-bold text-red-600">-{formatCurrency(noAdsResult.totalFees, inputs.currency)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 12% Ads */}
                    <div className={`rounded-2xl p-6 border-2 ${isMandatory ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-700">12% Offsite Ads</h4>
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        </div>
                        <div className="text-3xl font-black text-secondary mb-2">
                            {formatCurrency(with12PercentResult.netProfit, inputs.currency)}
                        </div>
                        <div className="text-sm text-gray-500">
                            {((with12PercentResult.netProfit / with12PercentResult.revenue) * 100).toFixed(1)}% margin
                        </div>
                        {isMandatory && (
                            <div className="mt-2 text-xs font-bold text-orange-700 uppercase">Mandatory</div>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex justify-between">
                                    <span>Revenue</span>
                                    <span className="font-bold">{formatCurrency(with12PercentResult.revenue, inputs.currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ads Fee</span>
                                    <span className="font-bold text-red-600">-{formatCurrency(with12PercentResult.offsiteAdsFee, inputs.currency)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 15% Ads */}
                    <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-700">15% Offsite Ads</h4>
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        </div>
                        <div className="text-3xl font-black text-secondary mb-2">
                            {formatCurrency(with15PercentResult.netProfit, inputs.currency)}
                        </div>
                        <div className="text-sm text-gray-500">
                            {((with15PercentResult.netProfit / with15PercentResult.revenue) * 100).toFixed(1)}% margin
                        </div>
                        {!isMandatory && (
                            <div className="mt-2 text-xs font-bold text-gray-500 uppercase">Optional</div>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex justify-between">
                                    <span>Revenue</span>
                                    <span className="font-bold">{formatCurrency(with15PercentResult.revenue, inputs.currency)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ads Fee</span>
                                    <span className="font-bold text-red-600">-{formatCurrency(with15PercentResult.offsiteAdsFee, inputs.currency)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Projection */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border-2 border-primary/20 mb-8">
                <h3 className="text-xl font-black text-secondary mb-6 flex items-center">
                    <DollarSign className="w-6 h-6 mr-2 text-primary" />
                    Monthly Profit Projection ({monthlyOrders} orders)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6">
                        <p className="text-sm font-bold text-gray-600 mb-2">No Ads</p>
                        <p className="text-3xl font-black text-secondary">{formatCurrency(monthlyNoAds, inputs.currency)}</p>
                        <p className="text-xs text-gray-500 mt-1">All organic sales</p>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                        <p className="text-sm font-bold text-gray-600 mb-2">With 12% Ads</p>
                        <p className="text-3xl font-black text-secondary">{formatCurrency(monthlyWith12, inputs.currency)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {adsPercentage}% from ads ({ordersFromAds} orders)
                        </p>
                        <div className={`mt-2 text-sm font-bold ${monthlyWith12 > monthlyNoAds ? 'text-green-600' : 'text-red-600'}`}>
                            {monthlyWith12 > monthlyNoAds ? '+' : ''}{formatCurrency(monthlyWith12 - monthlyNoAds, inputs.currency)} vs no ads
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6">
                        <p className="text-sm font-bold text-gray-600 mb-2">With 15% Ads</p>
                        <p className="text-3xl font-black text-secondary">{formatCurrency(monthlyWith15, inputs.currency)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {adsPercentage}% from ads ({ordersFromAds} orders)
                        </p>
                        <div className={`mt-2 text-sm font-bold ${monthlyWith15 > monthlyNoAds ? 'text-green-600' : 'text-red-600'}`}>
                            {monthlyWith15 > monthlyNoAds ? '+' : ''}{formatCurrency(monthlyWith15 - monthlyNoAds, inputs.currency)} vs no ads
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommendation */}
            <div className={`rounded-2xl p-8 border-2 ${shouldOptIn ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start">
                    {shouldOptIn ? (
                        <TrendingUp className="w-8 h-8 text-green-600 mr-4 flex-shrink-0" />
                    ) : (
                        <TrendingDown className="w-8 h-8 text-red-600 mr-4 flex-shrink-0" />
                    )}
                    <div>
                        <h3 className="text-2xl font-black text-secondary mb-3">
                            {isMandatory ? 'Pricing Strategy' : 'Recommendation'}
                        </h3>

                        {isMandatory ? (
                            <div>
                                <p className="text-gray-700 mb-3">
                                    Since Offsite Ads are mandatory for you, build the 12% fee into your pricing strategy:
                                </p>
                                <ul className="space-y-2 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="text-primary mr-2">•</span>
                                        <span>Increase your base price by 15-20% to absorb the ads fee</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-primary mr-2">•</span>
                                        <span>Focus on high-margin products (40%+ margin before ads)</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-primary mr-2">•</span>
                                        <span>Track which products get the most ad sales and optimize accordingly</span>
                                    </li>
                                </ul>
                            </div>
                        ) : shouldOptIn ? (
                            <div>
                                <p className="text-gray-700 mb-3">
                                    <strong>Opt IN to Offsite Ads.</strong> Based on your numbers, you'll make
                                    {' '}{formatCurrency(monthlyWith15 - monthlyNoAds, inputs.currency)} more per month
                                    even with the 15% fee.
                                </p>
                                <p className="text-sm text-gray-600">
                                    The additional {ordersFromAds} sales from ads more than offset the fee cost.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-700 mb-3">
                                    <strong>Stay OPTED OUT of Offsite Ads.</strong> The 15% fee would reduce your monthly profit
                                    by {formatCurrency(monthlyNoAds - monthlyWith15, inputs.currency)}.
                                </p>
                                <p className="text-sm text-gray-600">
                                    Focus on organic traffic and your own marketing instead.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
