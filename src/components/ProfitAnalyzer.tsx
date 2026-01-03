import React, { useState } from 'react';
import { CalculatorInputs, CalculationResult } from '../types';
import { calculateEtsyProfit } from '../lib/calculator';
import { formatCurrency, getCurrencySymbol } from '../lib/currency';
import { TrendingUp, TrendingDown, AlertCircle, Target, DollarSign } from 'lucide-react';

interface ProfitAnalyzerProps {
    inputs: CalculatorInputs;
}

export const ProfitAnalyzer: React.FC<ProfitAnalyzerProps> = ({ inputs }) => {
    const result = calculateEtsyProfit(inputs);
    const currencySymbol = getCurrencySymbol(inputs.currency);

    // Calculate various profit metrics
    const grossProfit = result.revenue - inputs.cogs - inputs.packagingCost - inputs.shippingCost;
    const grossMargin = (grossProfit / result.revenue) * 100;
    const netMargin = (result.netProfit / result.revenue) * 100;
    const roi = ((result.netProfit / (inputs.cogs + inputs.packagingCost + inputs.shippingCost)) * 100);

    // Margin health assessment
    const getMarginHealth = (margin: number) => {
        if (margin >= 40) return { label: 'Excellent', color: 'text-green-600 bg-green-50', icon: TrendingUp };
        if (margin >= 30) return { label: 'Good', color: 'text-blue-600 bg-blue-50', icon: TrendingUp };
        if (margin >= 20) return { label: 'Fair', color: 'text-yellow-600 bg-yellow-50', icon: AlertCircle };
        return { label: 'Poor', color: 'text-red-600 bg-red-50', icon: TrendingDown };
    };

    const marginHealth = getMarginHealth(netMargin);
    const MarginIcon = marginHealth.icon;

    // Calculate what price would give 40% margin
    const targetMargin = 0.40;
    const totalCosts = inputs.cogs + inputs.packagingCost + inputs.shippingCost + inputs.listingFee;
    const variableFeeRate = (inputs.transactionFeePercent + inputs.processingFeePercent) / 100;
    const recommendedPrice = (totalCosts + inputs.processingFeeFixed) / (1 - variableFeeRate - targetMargin);

    return (
        <div className="space-y-8">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Gross Profit */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Gross Profit</span>
                        <DollarSign className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-black text-secondary">{formatCurrency(grossProfit, inputs.currency)}</div>
                    <div className="text-sm text-gray-500 mt-1">{grossMargin.toFixed(1)}% margin</div>
                </div>

                {/* Net Profit */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Net Profit</span>
                        <Target className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-black text-secondary">{formatCurrency(result.netProfit, inputs.currency)}</div>
                    <div className="text-sm text-gray-500 mt-1">{netMargin.toFixed(1)}% margin</div>
                </div>

                {/* ROI */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">ROI</span>
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="text-3xl font-black text-secondary">{roi.toFixed(0)}%</div>
                    <div className="text-sm text-gray-500 mt-1">Return on Investment</div>
                </div>

                {/* Margin Health */}
                <div className={`rounded-2xl p-6 border-2 ${marginHealth.color}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold uppercase tracking-wider">Margin Health</span>
                        <MarginIcon className="w-5 h-5" />
                    </div>
                    <div className="text-3xl font-black">{marginHealth.label}</div>
                    <div className="text-sm mt-1">{netMargin.toFixed(1)}% net margin</div>
                </div>
            </div>

            {/* Profit Breakdown */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 mb-8">
                <h3 className="text-xl font-black text-secondary mb-6">Profit Breakdown</h3>

                <div className="space-y-4">
                    {/* Revenue */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <span className="font-bold text-gray-700">Total Revenue</span>
                        <span className="text-xl font-black text-secondary">{formatCurrency(result.revenue, inputs.currency)}</span>
                    </div>

                    {/* Direct Costs */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Materials (COGS)</span>
                            <span className="font-bold text-red-600">-{formatCurrency(inputs.cogs, inputs.currency)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Packaging</span>
                            <span className="font-bold text-red-600">-{formatCurrency(inputs.packagingCost, inputs.currency)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-bold text-red-600">-{formatCurrency(inputs.shippingCost, inputs.currency)}</span>
                        </div>
                    </div>

                    {/* Gross Profit */}
                    <div className="flex items-center justify-between py-3 bg-blue-50 px-4 rounded-xl">
                        <span className="font-bold text-blue-900">Gross Profit</span>
                        <span className="text-lg font-black text-blue-900">{formatCurrency(grossProfit, inputs.currency)}</span>
                    </div>

                    {/* Fees */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Listing Fee</span>
                            <span className="font-bold text-red-600">-{formatCurrency(inputs.listingFee, inputs.currency)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Transaction Fee ({inputs.transactionFeePercent}%)</span>
                            <span className="font-bold text-red-600">-{formatCurrency(result.transactionFee, inputs.currency)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Payment Processing</span>
                            <span className="font-bold text-red-600">-{formatCurrency(result.paymentProcessingFee, inputs.currency)}</span>
                        </div>
                        {result.offsiteAdsFee > 0 && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Offsite Ads ({inputs.offsiteAdsRate}%)</span>
                                <span className="font-bold text-red-600">-{formatCurrency(result.offsiteAdsFee, inputs.currency)}</span>
                            </div>
                        )}
                    </div>

                    {/* Net Profit */}
                    <div className="flex items-center justify-between py-4 bg-green-50 px-4 rounded-xl border-2 border-green-200">
                        <span className="font-black text-green-900">Net Profit</span>
                        <span className="text-2xl font-black text-green-900">{formatCurrency(result.netProfit, inputs.currency)}</span>
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border-2 border-primary/20">
                <h3 className="text-xl font-black text-secondary mb-4 flex items-center">
                    <Target className="w-6 h-6 mr-2 text-primary" />
                    Recommendations
                </h3>

                {netMargin < 30 && (
                    <div className="bg-white rounded-xl p-6 mb-4">
                        <h4 className="font-bold text-secondary mb-2">⚠️ Margin Below Target</h4>
                        <p className="text-gray-600 mb-3">Your net margin of {netMargin.toFixed(1)}% is below the recommended 30-40% for sustainable growth.</p>
                        <p className="text-sm text-gray-600">
                            <strong>To achieve 40% margin:</strong> Price at {formatCurrency(recommendedPrice, inputs.currency)}
                            (increase of {formatCurrency(recommendedPrice - inputs.itemPrice, inputs.currency)})
                        </p>
                    </div>
                )}

                {netMargin >= 40 && (
                    <div className="bg-white rounded-xl p-6 mb-4">
                        <h4 className="font-bold text-green-700 mb-2">✅ Excellent Margins!</h4>
                        <p className="text-gray-600">Your {netMargin.toFixed(1)}% net margin gives you room for promotions, sales, and growth investments.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4">
                        <h5 className="font-bold text-sm text-gray-700 mb-2">Reduce Costs</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Buy materials in bulk</li>
                            <li>• Streamline production process</li>
                            <li>• Negotiate better shipping rates</li>
                        </ul>
                    </div>
                    <div className="bg-white rounded-xl p-4">
                        <h5 className="font-bold text-sm text-gray-700 mb-2">Increase Value</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Improve product photography</li>
                            <li>• Add premium packaging</li>
                            <li>• Bundle products together</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
