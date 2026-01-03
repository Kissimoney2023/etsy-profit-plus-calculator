import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Star, CheckCircle2 } from 'lucide-react';

interface UpgradeWallProps {
    title: string;
    description: string;
    plan?: 'starter' | 'pro';
    features?: string[];
}

export const UpgradeWall: React.FC<UpgradeWallProps> = ({
    title,
    description,
    plan = 'pro',
    features = []
}) => {
    return (
        <div className="relative overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-[32px] p-8 md:p-16 text-center">
            <div className="absolute inset-0 bg-gray-50/50 dark:bg-slate-950/80 backdrop-blur-[2px] z-10"></div>

            <div className="relative z-20 flex flex-col items-center max-w-lg mx-auto">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-green-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-green-200/50 dark:shadow-none rotate-3">
                    <Lock className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-3xl font-black text-secondary dark:text-white mb-4 font-heading">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                    {description}
                </p>

                {features.length > 0 && (
                    <ul className="text-left bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm mb-8 w-full border border-gray-100 dark:border-slate-700">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-center space-x-3 mb-3 last:mb-0 text-sm font-bold text-gray-600 dark:text-gray-300">
                                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                )}

                <Link
                    to="/pricing"
                    className="w-full sm:w-auto bg-secondary dark:bg-white dark:text-secondary text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl flex items-center justify-center space-x-2"
                >
                    <Star className="w-4 h-4 fill-current text-primary" />
                    <span>Upgrade to {plan === 'pro' ? 'Pro' : 'Starter'}</span>
                </Link>

                <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Cancel anytime. 14-day money-back guarantee.
                </p>
            </div>
        </div>
    );
};
