
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, BarChart3, Calculator, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react';

import { SEO } from '../components/SEO';

const Landing: React.FC = () => {
  return (
    <div className="overflow-hidden theme-transition mesh-gradient">
      <SEO
        title="Etsy Profit Calculator | Fee, Margin & Pricing Tool"
        description="The most accurate 2024 Etsy Fee Calculator. Calculate profit margins, fees, offsite ads, and break-even prices instantly."
        canonical="https://etsyprofitplus.com"
      />
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 transition-colors bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-green-100 dark:border-primary/20 shadow-sm">
              <Zap className="w-3 h-3 fill-current" />
              <span>Verified for 2024 Fee Structure</span>
            </div>
            <h1 className="text-5xl md:text-9xl font-black font-heading text-secondary dark:text-white mb-10 tracking-tighter leading-[0.85]">
              Scale Your Etsy <br />
              <span className="text-primary italic relative inline-block">
                Business
                <span className="absolute -bottom-4 left-0 w-full h-4 bg-primary/20 -skew-x-12 -z-10 blur-sm"></span>
              </span>
              <span className="text-secondary dark:text-white block md:inline"> with Precision.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-400 dark:text-gray-500 mb-12 font-medium leading-relaxed">
              Ditch the spreadsheets. Our professional calculator accounts for every sneaky fee, including regulatory costs and Offsite Ads protection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/calculator" className="w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-green-200/20 hover:shadow-green-300/30 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 group">
                <Calculator className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span className="uppercase tracking-widest">Launch Calculator</span>
              </Link>
              <Link to="/pricing" className="w-full sm:w-auto bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 text-secondary dark:text-white px-10 py-5 rounded-2xl text-lg font-black hover:border-primary hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center group uppercase tracking-widest">
                <span>View Plans</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-green-50 dark:bg-primary/5 rounded-full blur-[120px] -z-10 opacity-60"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-blue-50 dark:bg-blue-900/5 rounded-full blur-[100px] -z-10 opacity-60"></div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <span className="text-primary font-black text-[12px] uppercase tracking-[0.5em] mb-4 block">Professional Grade</span>
            <h2 className="text-4xl md:text-6xl font-black font-heading text-secondary dark:text-white mb-8 tracking-tighter">Everything to Scale.</h2>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full blur-[1px]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10 text-primary" />}
              title="Offsite Ads Protection"
              description="Instantly identify the 'Safe Price' required to stay profitable even when Etsy takes a 15% advertising bite."
              accent="green"
            />
            <FeatureCard
              icon={<BarChart3 className="w-10 h-10 text-blue-600" />}
              title="Real-Time Analytics"
              description="Visual breakdown of every penny: Transaction fees (6.5%), listing costs, and country-specific processing rates."
              accent="blue"
            />
            <FeatureCard
              icon={<Rocket className="w-10 h-10 text-orange-500" />}
              title="Target Margin Strategy"
              description="Input your desired take-home profit, and we'll tell you exactly what your listing price needs to be."
              accent="orange"
            />
          </div>
        </div>
      </section>

      {/* Social Proof CTA */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-secondary dark:bg-slate-900 rounded-[40px] p-12 md:p-20 relative overflow-hidden shadow-3xl">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black font-heading text-white mb-8 leading-tight tracking-tight">Ready to Master Your Margins?</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-12">
                <Link to="/signup" className="w-full sm:w-auto bg-primary text-white px-12 py-5 rounded-2xl text-lg font-black hover:scale-105 hover:shadow-2xl shadow-green-400/20 transition-all uppercase tracking-widest">
                  Create Free Account
                </Link>
                <Link to="/calculator?guest=1" className="w-full sm:w-auto bg-white/10 dark:bg-white/5 border-2 border-white/20 text-white px-12 py-5 rounded-2xl text-lg font-black hover:bg-white/20 transition-all uppercase tracking-widest">
                  Try Guest Mode
                </Link>
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Trusted by 2,500+ sellers worldwide</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; accent: string }> = ({ icon, title, description, accent }) => (
  <div className="glass p-8 md:p-12 rounded-[40px] md:rounded-[56px] hover:scale-[1.01] transition-all duration-500 group">
    <div className={`mb-8 md:mb-10 p-5 md:p-6 rounded-[24px] md:rounded-[28px] inline-block transition-transform group-hover:scale-110 group-hover:rotate-6 ${accent === 'green' ? 'bg-green-50 dark:bg-green-500/10' : accent === 'blue' ? 'bg-blue-50 dark:bg-blue-500/10' : 'bg-orange-50 dark:bg-orange-500/10'}`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as any, { className: 'w-10 h-10 md:w-12 md:h-12' }) : icon}
    </div>
    <h3 className="text-2xl md:text-3xl font-black text-secondary dark:text-white mb-4 md:mb-6 tracking-tighter leading-tight">{title}</h3>
    <p className="text-sm md:text-base text-gray-400 dark:text-gray-500 font-medium leading-relaxed">{description}</p>
  </div>
);

export default Landing;