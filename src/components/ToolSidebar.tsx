import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, TrendingUp, Target, Megaphone, Sparkles, Swords, Search, Globe, Camera, Download } from 'lucide-react';

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
        },
        {
            name: 'AI Image Auditor',
            path: '/etsy-image-auditor',
            icon: <Camera className="w-5 h-5" />
        }
    ];

    return (
        <div className="w-full lg:w-80 flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-700 overflow-visible">
            <div className="lg:sticky lg:top-24 space-y-6">
                <div className="lg:glass p-4 lg:p-8 rounded-[32px] lg:rounded-[48px] overflow-hidden">
                    <h3 className="hidden lg:block text-secondary dark:text-white font-black text-xs uppercase tracking-[0.4em] mb-6 px-4">
                        Tool Suite
                    </h3>

                    {/* Horizontal Scroll for Mobile */}
                    <nav className="flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                        {tools.map((tool) => {
                            const isActive = location.pathname === tool.path || (tool.path === '/etsy-profit-calculator' && location.pathname === '/calculator');
                            return (
                                <Link
                                    key={tool.name}
                                    to={tool.path || '#'}
                                    className={`
                        flex-shrink-0 group flex items-center space-x-3 lg:space-x-4 px-5 py-3 lg:px-6 lg:py-4 rounded-[20px] lg:rounded-[24px] text-xs lg:text-sm font-black transition-all duration-300
                        ${isActive
                                            ? 'bg-primary text-white shadow-xl shadow-green-500/20 lg:translate-x-1'
                                            : 'bg-white/50 dark:bg-slate-900/50 lg:bg-transparent text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-secondary dark:hover:text-white border border-gray-100 dark:border-slate-800 lg:border-none'
                                        }
                    `}
                                >
                                    <div className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                                        {tool.icon}
                                    </div>
                                    <span className="tracking-wide whitespace-nowrap">{tool.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                    <PWAInstallButton />
                </div>
            </div>
        </div>
    );
};

const PWAInstallButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

    React.useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    if (!deferredPrompt) return null;

    return (
        <div className="px-4 pb-4">
            <button
                onClick={handleInstall}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-emerald-600 text-white p-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
                <Download className="w-5 h-5" />
                <span>Install App</span>
            </button>
        </div>
    );
};

