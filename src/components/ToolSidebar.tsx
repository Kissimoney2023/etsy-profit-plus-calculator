import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, TrendingUp, Target, Megaphone, Sparkles, Swords, Search, Globe } from 'lucide-react';

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
        },
        {
            name: 'Multi-Region Strategy',
            path: '/etsy-multi-region-strategy',
            icon: <Globe className="w-5 h-5" />
        }
    ];

    return (
        <div className="w-full lg:w-80 flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="glass p-8 rounded-[48px] sticky top-24 space-y-8">
                <h3 className="text-secondary dark:text-white font-black text-xs uppercase tracking-[0.4em] mb-6 px-4">
                    Tool Suite
                </h3>
                <nav className="space-y-3">
                    {tools.map((tool) => {
                        const isActive = location.pathname === tool.path || (tool.path === '/etsy-profit-calculator' && location.pathname === '/calculator');
                        return (
                            <Link
                                key={tool.path}
                                to={tool.path}
                                className={`
                                    group flex items-center space-x-4 px-6 py-4 rounded-[24px] text-sm font-black transition-all duration-300
                                    ${isActive
                                        ? 'bg-primary text-white shadow-xl shadow-green-500/20 translate-x-1'
                                        : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-secondary dark:hover:text-white'
                                    }
                                `}
                            >
                                <div className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                                    {tool.icon}
                                </div>
                                <span className="tracking-wide">{tool.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};
