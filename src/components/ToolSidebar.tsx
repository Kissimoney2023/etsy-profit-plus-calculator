import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator, TrendingUp, Target, Megaphone, Sparkles, Swords, Search, Globe, Camera, Download, Menu, X } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

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

    const [isOpen, setIsOpen] = React.useState(false);

    // Close sidebar on route change
    React.useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const SidebarContent = () => (
        <div className="lg:glass p-4 lg:p-8 rounded-[32px] lg:rounded-[48px] overflow-hidden bg-white/95 dark:bg-slate-900/95 lg:bg-transparent h-full lg:h-auto overflow-y-auto lg:overflow-visible">
            <h3 className="text-secondary dark:text-white font-black text-xs uppercase tracking-[0.4em] mb-6 px-4 pt-4 lg:pt-0 flex items-center justify-between">
                <span>Toolkit</span>
                <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 -mr-2 text-gray-400 hover:text-primary">
                    <span className="sr-only">Close menu</span>
                    <X className="w-6 h-6" />
                </button>
            </h3>
            <div className="space-y-2">
                {tools.map((tool) => {
                    const isActive = location.pathname === tool.path;
                    return (
                        <Link
                            key={tool.path}
                            to={tool.path}
                            className={`group relative flex items-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-300 ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-green-400/20 scale-[1.02]'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-secondary dark:hover:text-white'
                                }`}
                        >
                            <div className={`border-2 rounded-xl p-2 transition-colors duration-300 ${isActive
                                ? 'border-primary-foreground/20 bg-primary-foreground/10'
                                : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 group-hover:border-primary/30 group-hover:scale-110'
                                }`}>
                                {React.cloneElement(tool.icon as React.ReactElement, {
                                    className: `w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`
                                })}
                            </div>
                            <span className={`text-sm font-bold tracking-wide transition-colors ${isActive ? 'text-white' : ''}`}>
                                {tool.name}
                            </span>
                            {isActive && (
                                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-8 pt-8 border-t border-dashed border-gray-200 dark:border-slate-800">
                <div className="px-4">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Status</span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 dark:text-slate-500">v2.4.0 • All Systems Operational</p>
                </div>
            </div>
            <PWAInstallButton />
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button (Floating) */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden fixed left-4 top-24 z-40 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 text-secondary dark:text-white hover:scale-105 transition-transform"
                aria-label="Open toolkit menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 w-80 z-50 transform transition-transform duration-300 ease-out lg:transform-none lg:relative lg:w-80 lg:block lg:z-auto
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full lg:h-auto lg:sticky lg:top-24 space-y-6">
                    <SidebarContent />
                </div>
            </div>
        </>
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

