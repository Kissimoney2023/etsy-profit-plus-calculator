
import React from 'react';
import { Target, ShieldCheck, Heart, Mail, TrendingUp, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="py-24 bg-white dark:bg-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-black font-heading text-secondary dark:text-white mb-8 tracking-tighter italic">By Sellers, For Sellers.</h1>
          <p className="text-xl text-gray-400 dark:text-slate-400 max-w-2xl mx-auto font-medium">We built EtsyProfit+ to solve the #1 problem for handmade business owners: understanding the bottom line.</p>
        </div>

        <div className="space-y-24">
          {/* Mission */}
          <section className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl font-black text-secondary dark:text-white mb-6 tracking-tight">The Mission</h2>
              <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                Most Etsy sellers are artists first, accountants second. When we started our own shops, we quickly realized how easy it is to lose 20-30% of revenue to hidden fees, ad commissions, and processing costs.
              </p>
              <p className="text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                Our mission is simple: To provide high-precision, accessible financial tools that empower makers to price with confidence and build sustainable, profitable businesses.
              </p>
            </div>
            <div className="flex-1 p-8 bg-gray-50 dark:bg-slate-900 rounded-[40px] border-2 border-gray-100 dark:border-slate-800 shadow-inner">
              <div className="space-y-4">
                <StatItem icon={<TrendingUp />} label="Sellers Supported" value="2,500+" />
                <StatItem icon={<Users />} label="Daily Calculations" value="10k+" />
                <StatItem icon={<ShieldCheck />} label="Accuracy Rating" value="99.9%" />
              </div>
            </div>
          </section>

          {/* Values */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-secondary dark:text-white tracking-tight">Core Principles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <ValueCard icon={<ShieldCheck />} title="Absolute Accuracy" desc="Our logic is updated daily to reflect current Etsy fee tables across 18+ regions." />
              <ValueCard icon={<Heart />} title="Seller First" desc="We don't sell your data. We build features that genuinely save you money and time." />
              <ValueCard icon={<Target />} title="Radical Clarity" desc="Complex math made simple. No jargon, just clear profit and margin results." />
            </div>
          </section>

          {/* Disclaimer / Affiliation */}
          <section className="p-10 bg-secondary dark:bg-slate-900 rounded-[40px] text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4 uppercase tracking-widest text-primary">Important Disclosure</h3>
              <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
                EtsyProfit+ is an independent platform and is not affiliated with, endorsed by, or sponsored by Etsy, Inc. "Etsy" is a trademark of Etsy, Inc. Our tool is designed as a calculator for educational and business projection purposes.
              </p>
              <div className="mt-8">
                <a href="mailto:support@etsyprofitplus.com" className="inline-flex items-center text-primary font-black uppercase text-xs tracking-widest">
                  <Mail className="w-4 h-4 mr-2" /> Contact Support
                </a>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          </section>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ icon, label, value }: any) => (
  <div className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-lg text-primary">{React.cloneElement(icon, { size: 20 })}</div>
      <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-400">{label}</span>
    </div>
    <span className="text-xl font-black text-secondary dark:text-white">{value}</span>
  </div>
);

const ValueCard = ({ icon, title, desc }: any) => (
  <div className="p-10 bg-white dark:bg-slate-900 rounded-[32px] border-2 border-gray-50 dark:border-slate-800 hover:border-primary/20 transition-all text-center group">
    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { className: 'w-8 h-8 text-primary' })}
    </div>
    <h3 className="text-xl font-black text-secondary dark:text-white mb-4">{title}</h3>
    <p className="text-gray-400 dark:text-slate-400 font-medium text-sm leading-relaxed">{desc}</p>
  </div>
);

export default About;
