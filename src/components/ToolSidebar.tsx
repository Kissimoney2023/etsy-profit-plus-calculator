import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, TrendingUp, Target, Megaphone, Sparkles, Swords, Search } from 'lucide-react';

export const ToolSidebar: React.FC = () => {
    const location = useLocation();

    const tools = [
        {
            name: 'Fee Calculator',
            path: '/etsy-fee-calculator',
            icon: <Calculator className="w-5 h-5" />
        },
        {
            name: 'Profit Analyzer',
            path: '/etsy-profit-calculator',
            icon: <TrendingUp className="w-5 h-5" />
        },
        {
            name: 'Break-Even Tool',
            path: '/etsy-break-even-price-calculator',
            icon: <Target className="w-5 h-5" />
        },
        {
            name: 'Ads Scenario Tool',
            path: '/etsy-offsite-ads-fee-calculator',
            icon: <Megaphone className="w-5 h-5" />
        },
        {
            name: 'AI Listing Optimizer',
            path: '/etsy-listing-optimizer',
            icon: <Sparkles className="w-5 h-5" />
        },
        {
            name: 'Competitor Compare',
            path: '/etsy-competitor-compare',
            icon: <Swords className="w-5 h-5" />
        },
        {
            name: 'AI Trend Hunter',
            path: '/etsy-trend-hunter',
            icon: <Search className="w-5 h-5" />
        }
    ];

    return (
        <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm sticky top-24">
                <h3 className="text-secondary dark:text-white font-black text-xs uppercase tracking-[0.2em] mb-6 pl-2">
                    Tool Suite
                </h3>
                <nav className="space-y-2">
                    {tools.map((tool) => {
                        const isActive = location.pathname === tool.path || (tool.path === '/etsy-profit-calculator' && location.pathname === '/calculator');
                        return (
                            <Link
                                key={tool.path}
                                to={tool.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-green-100/20'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-secondary dark:hover:text-white'
                                    }`}
                            >
                                <span className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary transition-colors'}>
                                    {tool.icon}
                                </span>
                                <span className="font-bold text-sm">{tool.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};
