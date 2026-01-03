
import React from 'react';
import { Product } from '../types';
import { calculateEtsyProfit } from '../lib/calculator';

interface InventoryTrendChartProps {
    products: Product[];
}

export const InventoryTrendChart: React.FC<InventoryTrendChartProps> = ({ products }) => {
    if (products.length < 2) return null;

    // Sort products by date
    const sortedProducts = [...products].sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const data = sortedProducts.map(p => {
        const inputs = (p.inputs || p) as any;
        return calculateEtsyProfit(inputs).margin;
    });

    const width = 800;
    const height = 120;
    const padding = 20;

    const maxMargin = Math.max(...data, 50);
    const minMargin = Math.min(...data, 0);
    const range = maxMargin - minMargin;

    const getX = (i: number) => (i / (data.length - 1)) * (width - padding * 2) + padding;
    const getY = (val: number) => height - ((val - minMargin) / range) * (height - padding * 2) - padding;

    const points = data.map((val, i) => `${getX(i)},${getY(val)}`).join(' ');

    // Gradient points for the area under the line
    const areaPoints = `${getX(0)},${height} ${points} ${getX(data.length - 1)},${height}`;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-secondary dark:text-white font-black text-xs uppercase tracking-[0.2em] mb-1">
                        Profitability Velocity
                    </h3>
                    <p className="text-gray-400 text-xs font-medium">Average margin trend over time</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Net Margin %</span>
                    </div>
                </div>
            </div>

            <div className="relative h-32 w-full overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-xl" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Area under the line */}
                    <polyline
                        points={areaPoints}
                        fill="url(#chartGradient)"
                        className="animate-pulse"
                    />

                    {/* The main trend line */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-all duration-1000 ease-in-out"
                        style={{
                            strokeDasharray: '1000',
                            strokeDashoffset: '1000',
                            animation: 'chartDraw 2s forwards'
                        }}
                    />

                    {/* Individual points */}
                    {data.map((val, i) => (
                        <circle
                            key={i}
                            cx={getX(i)}
                            cy={getY(val)}
                            r="4"
                            fill="#10b981"
                            className="hover:r-6 transition-all duration-300 cursor-pointer"
                        >
                            <title>{val.toFixed(1)}%</title>
                        </circle>
                    ))}
                </svg>
            </div>

            <style>{`
                @keyframes chartDraw {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
};
