import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Zap, Rocket, Star, HelpCircle, ChevronDown, Loader2 } from 'lucide-react';
import { UserProfile, PlanType } from '../types';
import { supabase } from '../lib/supabase';

interface PricingProps {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
}

const Pricing: React.FC<PricingProps> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [upgradingPlan, setUpgradingPlan] = useState<PlanType | null>(null);

  const handlePlanSelect = async (plan: PlanType) => {
    if (!user) {
      navigate(`/signup?plan=${plan}`);
      return;
    }

    if (user.plan === plan) {
      navigate('/calculator');
      return;
    }

    if (plan === 'free') {
      // Handle downgrade logic or just direct
      return;
    }

    setUpgradingPlan(plan);
    try {
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          priceId: plan === 'starter' ? 'price_123_starter' : 'price_456_pro', // Replace with real IDs
          email: user.email,
          returnUrl: window.location.origin
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout');
      setUpgradingPlan(null);
    }
  };

  return (
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Transparent Pricing</span>
          <h1 className="text-5xl md:text-7xl font-black font-heading text-secondary mb-8 tracking-tighter">Choose Your Profit Path</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            Stop losing money on hidden fees. Select a plan that grows with your Etsy shop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-32">
          {/* Free Plan */}
          <PricingCard
            title="Essential"
            price="0"
            period="/forever"
            description="Perfect for new shops finding their feet."
            plan="free"
            activePlan={user?.plan}
            features={[
              { text: "5 calculations per day", included: true },
              { text: "Basic fee breakdown", included: true },
              { text: "2024 Fee Structure", included: true },
              { text: "Target Margin mode", included: true },
              { text: "Save products", included: false }
            ]}
            cta={user ? (user.plan === 'free' ? "Current Plan" : "Downgrade") : "Try Guest Mode"}
            onSelect={() => handlePlanSelect('free')}
            variant="outline"
            isLoading={upgradingPlan === 'free'}
          />

          {/* Starter Plan */}
          <PricingCard
            title="Starter"
            price="9"
            period="/month"
            description="Our most popular choice for growing makers."
            plan="starter"
            activePlan={user?.plan}
            features={[
              { text: "Unlimited calculations", included: true },
              { text: "Save up to 50 products", included: true },
              { text: "Offsite Ads strategy", included: true },
              { text: "Custom Region profiles", included: true },
              { text: "Priority updates", included: true }
            ]}
            cta={user ? (user.plan === 'starter' ? "Current Plan" : (user.plan === 'pro' ? "Downgrade" : "Upgrade Now")) : "Get Started"}
            onSelect={() => handlePlanSelect('starter')}
            variant="primary"
            popular
            isLoading={upgradingPlan === 'starter'}
          />

          {/* Pro Plan */}
          <PricingCard
            title="Professional"
            price="19"
            period="/month"
            description="Advanced tools for high-volume power sellers."
            plan="pro"
            activePlan={user?.plan}
            features={[
              { text: "Unlimited everything", included: true },
              { text: "Bulk CSV Export/Import", included: true },
              { text: "Scenario mode comparison", included: true },
              { text: "Multi-shop SKU tracking", included: true },
              { text: "1-on-1 Strategy support", included: true }
            ]}
            cta={user ? (user.plan === 'pro' ? "Current Plan" : "Upgrade to Pro") : "Go Pro Now"}
            onSelect={() => handlePlanSelect('pro')}
            variant="dark"
            isLoading={upgradingPlan === 'pro'}
          />
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <HelpCircle className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-black text-secondary uppercase tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <FaqItem
              question="Can I cancel my subscription at any time?"
              answer="Absolutely. You can cancel your Starter or Pro subscription through your account billing portal in one click. No contracts, no fuss."
            />
            <FaqItem
              question="What happens when I reach my 'Free' limit?"
              answer="If you hit the 5 calculation limit, your access resets at midnight UTC. To bypass this, you can upgrade to Starter for as little as $9/month."
            />
            <FaqItem
              question="Does the calculator support international currencies?"
              answer="Yes! We support 18+ currencies including USD, EUR, GBP, CAD, and AUD with real-time approximate exchange rates."
            />
            <FaqItem
              question="Is this app affiliated with Etsy?"
              answer="EtsyProfit+ is an independent tool built by sellers for sellers. We are not officially affiliated with Etsy, Inc."
            />
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 -mr-96 -mt-96 w-[1000px] h-[1000px] bg-green-50/50 rounded-full blur-[150px] -z-10"></div>
    </div>
  );
};

const PricingCard: React.FC<any> = ({ title, price, period, description, features, cta, onSelect, variant, popular, activePlan, plan, isLoading }) => {
  const isCurrentPlan = activePlan === plan;

  return (
    <div className={`relative flex flex-col p-10 rounded-[40px] transition-all hover:-translate-y-2 ${variant === 'primary' ? 'bg-white border-4 border-primary shadow-2xl shadow-green-100 scale-105 z-10' :
      variant === 'dark' ? 'bg-secondary text-white shadow-3xl' :
        'bg-white border-2 border-gray-100 shadow-xl'
      }`}>
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
      )}
      <div className="mb-10 text-center">
        <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-6 ${variant === 'dark' ? 'text-primary' : 'text-gray-400'}`}>{title}</h3>
        <div className="flex items-baseline justify-center mb-4">
          <span className="text-5xl font-black tracking-tighter">${price}</span>
          <span className={`text-sm font-bold ml-2 ${variant === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>{period}</span>
        </div>
        <p className={`text-sm font-medium leading-relaxed px-4 ${variant === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
      </div>
      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((f: any, i: number) => (
          <li key={i} className={`flex items-center space-x-3 text-sm font-bold ${!f.included ? 'opacity-30' : 'opacity-100'}`}>
            <div className={`p-1 rounded-full ${variant === 'dark' ? 'bg-primary/20 text-primary' : 'bg-green-100 text-primary'}`}>
              <Check className="w-3 h-3" />
            </div>
            <span className={variant === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{f.text}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        disabled={isCurrentPlan || isLoading}
        className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all text-center flex items-center justify-center space-x-2 ${isCurrentPlan ? 'bg-gray-100 text-gray-400 cursor-default' :
          variant === 'primary' ? 'bg-primary text-white shadow-xl shadow-green-200 hover:bg-opacity-90' :
            variant === 'dark' ? 'bg-white text-secondary hover:bg-gray-100 shadow-xl' :
              'bg-gray-50 text-secondary border-2 border-gray-100 hover:bg-gray-100'
          }`}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        <span>{cta}</span>
      </button>
    </div>
  );
};

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm transition-all hover:border-primary/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left group"
      >
        <span className="font-black text-secondary tracking-tight group-hover:text-primary transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-8 pb-8 text-gray-500 font-medium leading-relaxed text-sm border-t border-gray-50 pt-4 animate-in fade-in duration-300">
          {answer}
        </div>
      )}
    </div>
  );
};

export default Pricing;