
import React, { useMemo } from 'react';

interface ChartData {
    label: string;
    value: number;
    color: string;
}

interface ProfitChartProps {
    data: ChartData[];
    total: number;
    symbol: string;
}

export const ProfitChart: React.FC<ProfitChartProps> = ({ data, total, symbol }) => {
    const size = 200;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = 2 * Math.PI * radius;

    const chartItems = useMemo(() => {
        let currentOffset = 0;
        return data.map(item => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${(item.value / total) * circumference} ${circumference}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += (item.value / total) * circumference;

            return {
                ...item,
                percentage,
                strokeDasharray,
                strokeDashoffset
            };
        });
    }, [data, total, circumference]);

    return (
        <div className="relative flex items-center justify-center group">
            <svg width={size} height={size} className="transform -rotate-90 drop-shadow-2xl">
                {/* Background Track */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-gray-100 dark:text-white/5"
                />
                {/* Data Segments */}
                {chartItems.map((item, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={item.strokeDasharray}
                        strokeDashoffset={item.strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out hover:stroke-[30px]"
                        style={{ transitionDelay: `${i * 100}ms` }}
                    />
                ))}
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</span>
                <div className="flex items-baseline space-x-0.5">
                    <span className="text-sm font-black text-gray-400">{symbol}</span>
                    <span className="text-2xl font-black text-secondary dark:text-white leading-none">
                        {total.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Tooltip-like Legend on Hover */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-xl border border-gray-100 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-gray-500">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
