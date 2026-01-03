import React, { useState } from 'react';
import { CalculatorInputs } from '../types';
import { formatCurrency, getCurrencySymbol } from '../lib/currency';
import { Target, TrendingUp, AlertTriangle, DollarSign, Percent } from 'lucide-react';

interface BreakEvenToolProps {
    inputs: CalculatorInputs;
}

export const BreakEvenTool: React.FC<BreakEvenToolProps> = ({ inputs }) => {
    const [desiredMargin, setDesiredMargin] = useState(40);
    const currencySymbol = getCurrencySymbol(inputs.currency);

    // Calculate break-even price
    const totalFixedCosts = inputs.cogs + inputs.packagingCost + inputs.shippingCost + inputs.listingFee;
    const variableFeeRate = (inputs.transactionFeePercent + inputs.processingFeePercent + (inputs.offsiteAdsEnabled ? inputs.offsiteAdsRate : 0)) / 100;

    const breakEvenPrice = (totalFixedCosts + inputs.processingFeeFixed) / (1 - variableFeeRate);

    // Calculate target price for desired margin
    const targetPrice = (totalFixedCosts + inputs.processingFeeFixed) / (1 - variableFeeRate - (desiredMargin / 100));

    // Calculate what happens at different price points
    const priceScenarios = [
        { price: breakEvenPrice * 0.8, label: '20% Below Break-Even' },
        { price: breakEvenPrice * 0.9, label: '10% Below Break-Even' },
        { price: breakEvenPrice, label: 'Break-Even Price' },
        { price: breakEvenPrice * 1.1, label: '10% Above Break-Even' },
        { price: breakEvenPrice * 1.2, label: '20% Above Break-Even' },
        { price: targetPrice, label: `Target (${desiredMargin}% Margin)` }
    ];

    const calculateProfitAtPrice = (price: number) => {
        const revenue = price + inputs.shippingCharged;
        const transactionFee = revenue * (inputs.transactionFeePercent / 100);
        const paymentFee = revenue * (inputs.processingFeePercent / 100) + inputs.processingFeeFixed;
        const offsiteAdsFee = inputs.offsiteAdsEnabled ? revenue * (inputs.offsiteAdsRate / 100) : 0;
        const totalFees = inputs.listingFee + transactionFee + paymentFee + offsiteAdsFee;
        const totalCosts = inputs.cogs + inputs.packagingCost + inputs.shippingCost;
        const profit = revenue - totalCosts - totalFees;
        const margin = (profit / revenue) * 100;
        return { profit, margin };
    };

    return (
        <div className="space-y-8">
            {/* Break-Even Price Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
                <div className="flex items-center mb-4">
                    <Target className="w-8 h-8 mr-3" />
                    <h3 className="text-2xl font-black">Your Break-Even Price</h3>
                </div>
                <div className="text-6xl font-black mb-2">{formatCurrency(breakEvenPrice, inputs.currency)}</div>
                <p className="text-blue-100 text-lg">Charge less than this and you lose money on every sale</p>

                {inputs.itemPrice < breakEvenPrice && (
                    <div className="mt-6 bg-red-500 rounded-xl p-4 flex items-start">
                        <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold mb-1">⚠️ Warning: Current Price Too Low!</p>
                            <p className="text-sm text-red-100">
                                Your current price of {formatCurrency(inputs.itemPrice, inputs.currency)} is
                                {' '}{formatCurrency(breakEvenPrice - inputs.itemPrice, inputs.currency)} below break-even.
                                You're losing money on every sale!
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                    <h3 className="text-lg font-black text-secondary mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-primary" />
                        Fixed Costs
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Materials (COGS)</span>
                            <span className="font-bold text-secondary">{formatCurrency(inputs.cogs, inputs.currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Packaging</span>
                            <span className="font-bold text-secondary">{formatCurrency(inputs.packagingCost, inputs.currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Shipping Cost</span>
                            <span className="font-bold text-secondary">{formatCurrency(inputs.shippingCost, inputs.currency)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Listing Fee</span>
                            <span className="font-bold text-secondary">{formatCurrency(inputs.listingFee, inputs.currency)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100">
                            <span className="font-bold text-secondary">Total Fixed Costs</span>
                            <span className="font-black text-secondary text-lg">{formatCurrency(totalFixedCosts, inputs.currency)}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                    <h3 className="text-lg font-black text-secondary mb-4 flex items-center">
                        <Percent className="w-5 h-5 mr-2 text-primary" />
                        Variable Fees
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Transaction Fee</span>
                            <span className="font-bold text-secondary">{inputs.transactionFeePercent}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Payment Processing</span>
                            <span className="font-bold text-secondary">{inputs.processingFeePercent}% + {formatCurrency(inputs.processingFeeFixed, inputs.currency)}</span>
                        </div>
                        {inputs.offsiteAdsEnabled && (
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Offsite Ads</span>
                                <span className="font-bold text-secondary">{inputs.offsiteAdsRate}%</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100">
                            <span className="font-bold text-secondary">Total Variable Rate</span>
                            <span className="font-black text-secondary text-lg">{(variableFeeRate * 100).toFixed(2)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Target Margin Calculator */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100 mb-8">
                <h3 className="text-xl font-black text-secondary mb-6">Target Margin Calculator</h3>

                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                        Desired Profit Margin: {desiredMargin}%
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="70"
                        step="5"
                        value={desiredMargin}
                        onChange={(e) => setDesiredMargin(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>10%</span>
                        <span>40% (Recommended)</span>
                        <span>70%</span>
                    </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-green-700 mb-1">Price for {desiredMargin}% Margin</p>
                            <p className="text-4xl font-black text-green-900">{formatCurrency(targetPrice, inputs.currency)}</p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-green-600" />
                    </div>
                    <p className="text-sm text-green-700 mt-3">
                        At this price, you'll earn {formatCurrency(calculateProfitAtPrice(targetPrice).profit, inputs.currency)} profit per sale
                    </p>
                </div>
            </div>

            {/* Price Scenarios */}
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
                <h3 className="text-xl font-black text-secondary mb-6">Price Scenarios</h3>

                <div className="space-y-3">
                    {priceScenarios.map((scenario, index) => {
                        const { profit, margin } = calculateProfitAtPrice(scenario.price);
                        const isNegative = profit < 0;
                        const isBreakEven = Math.abs(profit) < 0.01;

                        return (
                            <div
                                key={index}
                                className={`p-4 rounded-xl border-2 ${isNegative ? 'bg-red-50 border-red-200' :
                                    isBreakEven ? 'bg-yellow-50 border-yellow-200' :
                                        'bg-green-50 border-green-200'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-gray-700">{scenario.label}</p>
                                        <p className="text-2xl font-black text-secondary">{formatCurrency(scenario.price, inputs.currency)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-600">Profit</p>
                                        <p className={`text-xl font-black ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
                                            {isNegative && '-'}{formatCurrency(Math.abs(profit), inputs.currency)}
                                        </p>
                                        <p className="text-xs text-gray-500">{margin.toFixed(1)}% margin</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Formula Explanation */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                <h4 className="font-bold text-secondary mb-3">📐 The Formula</h4>
                <div className="bg-white rounded-xl p-4 font-mono text-sm">
                    <p className="mb-2">Break-Even Price = (Fixed Costs + Payment Fixed Fee) ÷ (1 - Variable Fee Rate)</p>
                    <p className="text-gray-600">
                        = ({formatCurrency(totalFixedCosts, inputs.currency)} + {formatCurrency(inputs.processingFeeFixed, inputs.currency)}) ÷ (1 - {(variableFeeRate * 100).toFixed(2)}%)
                    </p>
                    <p className="text-primary font-bold mt-2">= {formatCurrency(breakEvenPrice, inputs.currency)}</p>
                </div>
            </div>
        </div>
    );
};
