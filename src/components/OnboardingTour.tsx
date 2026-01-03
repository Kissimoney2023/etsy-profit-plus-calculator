
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, HelpCircle } from 'lucide-react';

interface Step {
    title: string;
    content: string;
    selector: string;
}

const STEPS: Step[] = [
    {
        title: "Welcome to EtsyProfit+",
        content: "Let's take a quick 30-second tour to master your margins.",
        selector: "body"
    },
    {
        title: "Listing Inputs",
        content: "Enter your price and costs here. We support 20+ currencies and automatic country-specific fees.",
        selector: "#onboarding-inputs"
    },
    {
        title: "Profit Analysis",
        content: "See your net profit and margin instantly. Look for the 'Profitability Score' to see how your listing ranks.",
        selector: "#onboarding-results"
    },
    {
        title: "Ads Safe Price",
        content: "This is a critical metric. It tells you exactly what to charge to remain profitable even when Etsy's 15% Offsite Ads kick in.",
        selector: "#onboarding-ads-safe"
    }
];

export const OnboardingTour: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('etsy_tour_seen');
        if (!hasSeenTour) {
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('etsy_tour_seen', 'true');
    };

    if (!isVisible) return (
        <button
            onClick={() => setIsVisible(true)}
            className="fixed bottom-6 right-6 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 text-primary hover:scale-110 transition-all z-40 group"
        >
            <HelpCircle className="w-6 h-6" />
            <span className="absolute right-full mr-4 bg-secondary text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Open Tour</span>
        </button>
    );

    const step = STEPS[currentStep];

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-[40px] shadow-3xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10 relative">
                    <button onClick={handleClose} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="inline-flex p-4 bg-primary/10 rounded-2xl text-primary mb-6">
                        <Sparkles className="w-6 h-6" />
                    </div>

                    <h3 className="text-2xl font-black text-secondary dark:text-white tracking-tighter mb-4 leading-none">
                        {step.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed mb-10">
                        {step.content}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex space-x-1.5">
                            {STEPS.map((_, i) => (
                                <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-8 bg-primary' : 'w-1.5 bg-gray-100 dark:bg-white/10'}`}></div>
                            ))}
                        </div>

                        <div className="flex space-x-2">
                            {currentStep > 0 && (
                                <button onClick={handlePrev} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-secondary transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            )}
                            <button onClick={handleNext} className="bg-primary text-white pl-8 pr-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center space-x-3 hover:scale-105 transition-all">
                                <span>{currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
