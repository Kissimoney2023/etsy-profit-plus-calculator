
import React, { useState } from 'react';
import { Share2, DollarSign, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';

const Affiliate: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-24 bg-white dark:bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Partner Program</span>
          <h1 className="text-5xl md:text-7xl font-black font-heading text-secondary dark:text-white mb-8 tracking-tighter italic">Grow With Us.</h1>
          <p className="text-xl text-gray-400 dark:text-slate-400 max-w-2xl mx-auto font-medium">Earn 30% recurring commission for every seller you refer to EtsyProfit+.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <ProgStep icon={<Share2 />} title="Share" desc="Use your unique link on YouTube, Blog, or Social." />
          <ProgStep icon={<Rocket />} title="Refer" desc="Sellers join our Starter or Pro monthly plans." />
          <ProgStep icon={<DollarSign />} title="Earn" desc="Get paid 30% every month they stay active." />
        </div>

        <div className="bg-secondary dark:bg-slate-900 rounded-[40px] p-10 md:p-20 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black mb-8 leading-tight">Partner Perks</h2>
              <ul className="space-y-6">
                <li className="flex items-center space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="font-bold text-gray-300">60-Day Cookie Window</span>
                </li>
                <li className="flex items-center space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="font-bold text-gray-300">Dedicated Dashboard</span>
                </li>
                <li className="flex items-center space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="font-bold text-gray-300">Assets & Banners Library</span>
                </li>
                <li className="flex items-center space-x-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="font-bold text-gray-300">Direct Payouts via PayPal/Stripe</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl">
              {!submitted ? (
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                  <h3 className="text-2xl font-black text-secondary dark:text-white mb-4">Apply to Join</h3>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" required className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-secondary dark:text-white font-bold border-none" placeholder="name@email.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest mb-2">Website / Social Handle</label>
                    <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-secondary dark:text-white font-bold border-none" placeholder="youtube.com/mychannel" />
                  </div>
                  <button type="submit" className="w-full bg-primary py-4 rounded-xl font-black uppercase text-xs tracking-widest text-white shadow-lg shadow-green-200">Submit Application</button>
                  <p className="text-[10px] text-gray-400 font-bold text-center">We review and respond within 3–5 business days.</p>
                </form>
              ) : (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-50 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-secondary dark:text-white mb-2">Application Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-300 font-medium">We'll be in touch with your partner credentials soon.</p>
                </div>
              )}
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

const ProgStep = ({ icon, title, desc }: any) => (
  <div className="text-center p-8">
    <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <h3 className="text-xl font-black text-secondary dark:text-white mb-3">{title}</h3>
    <p className="text-gray-400 dark:text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
  </div>
);

export default Affiliate;
