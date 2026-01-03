
import React, { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { CalculatorInputs, CurrencyCode } from '../types';
import { calculateEtsyProfit } from '../lib/calculator';

interface BulkImportProps {
    onImport: (products: CalculatorInputs[]) => void;
}

export const BulkImport: React.FC<BulkImportProps> = ({ onImport }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [defaultCogsPercent, setDefaultCogsPercent] = useState(25); // Assume 25% COGS by default for estimations

    const parseCSV = (text: string) => {
        const lines = text.split(/\r?\n/);
        if (lines.length < 2) throw new Error('CSV is empty or invalid.');

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

        const titleIdx = headers.findIndex(h => h.toLowerCase() === 'title');
        const priceIdx = headers.findIndex(h => h.toLowerCase() === 'price');
        const currencyIdx = headers.findIndex(h => h.toLowerCase() === 'currency code');
        const skuIdx = headers.findIndex(h => h.toLowerCase() === 'sku numbers' || h.toLowerCase() === 'sku');

        if (titleIdx === -1 || priceIdx === -1) {
            throw new Error('CSV must contain "Title" and "Price" columns.');
        }

        const products: CalculatorInputs[] = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            // Simple CSV parser that handles quotes
            const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (!row) continue;

            const title = row[titleIdx]?.replace(/"/g, '') || 'Unknown Product';
            const price = parseFloat(row[priceIdx]?.replace(/"/g, '') || '0');
            const currency = (row[currencyIdx]?.replace(/"/g, '') || 'USD') as CurrencyCode;
            const sku = skuIdx !== -1 ? row[skuIdx]?.replace(/"/g, '') : '';

            if (isNaN(price)) continue;

            const cogsValue = price * (defaultCogsPercent / 100);

            const product: CalculatorInputs = {
                sku: sku || title.substring(0, 20),
                currency: currency,
                itemPrice: price,
                cogs: cogsValue,
                packagingCost: 0,
                shippingCost: 0,
                shippingCharged: 0,
                listingFee: 0.20,
                transactionFeePercent: 6.5,
                processingFeePercent: 3.0,
                processingFeeFixed: 0.25,
                offsiteAdsEnabled: false,
                offsiteAdsRate: 15,
                regulatoryFeePercent: 0,
                returnsAllowancePercent: 2,
                targetProfitType: 'margin',
                targetProfitValue: 30
            };

            products.push(product);
        }

        return products;
    };

    const handleFile = async (file: File) => {
        if (!file.name.endsWith('.csv')) {
            setError('Please upload a valid .csv file.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const text = await file.text();
            const products = parseCSV(text);

            if (products.length === 0) {
                throw new Error('No valid products found in CSV.');
            }

            onImport(products);
            setSuccess(`Successfully imported ${products.length} products!`);
        } catch (err: any) {
            setError(err.message || 'Failed to parse CSV.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                <div className="flex items-start space-x-4">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                        <FileSpreadsheet className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="font-black text-secondary dark:text-white uppercase tracking-wider text-xs mb-1">Estimation Settings</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                            Etsy CSVs don't include your product costs. We'll use this default COGS % to estimate initial profit.
                        </p>
                        <div className="flex items-center space-x-3">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={defaultCogsPercent}
                                onChange={(e) => setDefaultCogsPercent(parseInt(e.target.value))}
                                className="w-32 accent-indigo-600"
                            />
                            <span className="text-sm font-black text-indigo-600">{defaultCogsPercent}% COGS</span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files[0];
                    if (file) handleFile(file);
                }}
                className={`
                    border-2 border-dashed rounded-[40px] p-12 text-center transition-all cursor-pointer
                    ${isDragging
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10 scale-[0.98]'
                        : 'border-gray-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-900/50'}
                `}
                onClick={() => document.getElementById('csv-upload')?.click()}
            >
                <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                    }}
                />

                {loading ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                        <p className="font-black text-secondary dark:text-white">Analyzing Shop Data...</p>
                    </div>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Upload className="w-10 h-10 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <h3 className="text-xl font-black text-secondary dark:text-white mb-2">Drop your Etsy CSV here</h3>
                        <p className="text-gray-400 text-sm font-medium mb-6">
                            Go to Shop Manager {'>'} Settings {'>'} Options {'>'} Download Data
                        </p>
                        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl text-xs font-black text-gray-500 uppercase tracking-widest shadow-sm">
                            <span>Select Listings CSV</span>
                        </div>
                    </>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-center animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 bg-green-50 text-green-600 rounded-2xl text-sm font-bold flex items-center animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {success}
                </div>
            )}
        </div>
    );
};
