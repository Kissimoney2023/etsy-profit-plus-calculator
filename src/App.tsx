import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Calculator,
  Settings,
  LogOut,
  TrendingUp,
  Menu,
  X,
  Plus,
  ArrowRight,
  BookOpen,
  Users,
  ShieldAlert,
  HelpCircle,
  Twitter,
  Linkedin,
  Sun,
  Moon,
  ChevronRight,
  Zap,
  Rocket
} from 'lucide-react';
import Landing from './pages/Landing';
import CalculatorPage from './pages/Calculator';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import Auth from './pages/Auth';
import Account from './pages/Account';
import About from './pages/About';
import Affiliate from './pages/Affiliate';
import Legal from './pages/Legal';
import BlogListing from './pages/BlogListing';
import BlogPost from './pages/BlogPost';
import { UserProfile } from './types';

import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';
import { fetchExchangeRates } from './lib/currency';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    console.log('[DEBUG] App Mounted. Pathname:', window.location.pathname);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    // Fetch dynamic exchange rates
    fetchExchangeRates();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) {
        // Map Supabase profile updates user context
        setUser({
          id: data.id,
          email: data.email,
          plan: data.plan as any,
          stripe_customer_id: data.stripe_customer_id || undefined,
          created_at: data.created_at
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Calculator', path: '/calculator' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Affiliate', path: '/affiliate' },
  ];

  const location = useLocation();
  console.log('[DEBUG] App rendering for path:', location.pathname);

  useEffect(() => {
    // Legacy HashRouter Redirect
    if (window.location.hash.startsWith('#/')) {
      const path = window.location.hash.slice(2);
      window.location.href = '/' + path;
    }
  }, [location]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen flex flex-col font-sans theme-transition mesh-gradient ${isDarkMode ? 'dark bg-[#020617]' : 'bg-slate-50'}`}>
      <ScrollToTop />
      {/* Navigation */}
      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="bg-primary p-2.5 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-green-100/20">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black font-heading text-secondary dark:text-white tracking-tighter">EtsyProfit<span className="text-primary">+</span></span>
                <span className="text-[10px] font-black text-primary/40 dark:text-slate-500 self-end mb-1.5 ml-1 tracking-tighter">v3.1</span>
              </Link>
              <div className="hidden lg:ml-10 lg:flex lg:space-x-8">
                {navLinks.map(link => (
                  <Link key={link.path} to={link.path} className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary px-3 py-2 text-sm font-bold transition-colors uppercase tracking-wider">
                    {link.name}
                  </Link>
                ))}
                {user && (
                  <Link to="/dashboard" className="text-slate-500 dark:text-slate-400 hover:text-primary px-3 py-2 text-sm font-bold transition-colors uppercase tracking-wider">Dashboard</Link>
                )}
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={toggleTheme}
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary bg-gray-50 dark:bg-slate-800 rounded-xl transition-all"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/account" className="text-gray-400 hover:text-primary transition-colors p-2">
                    <Settings className="w-5 h-5" />
                  </Link>
                  <button onClick={handleLogout} className="text-sm font-black text-red-500 hover:text-red-600 uppercase tracking-widest px-2">
                    Logout
                  </button>
                  <Link to="/calculator" className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-black hover:bg-opacity-90 transition-all flex items-center space-x-2 shadow-lg shadow-green-100/20">
                    <Plus className="w-4 h-4" />
                    <span>NEW CALC</span>
                  </Link>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-secondary dark:text-gray-300 hover:text-primary text-sm font-black uppercase tracking-widest transition-colors">Sign In</Link>
                  <Link to="/pricing" className="bg-secondary dark:bg-primary text-white px-7 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-blue-100/10">Get Started</Link>
                </>
              )}
            </div>

            <div className="lg:hidden flex items-center space-x-4">
              <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 rounded-xl">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-secondary dark:text-white bg-gray-50 dark:bg-slate-800 rounded-xl"
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMenuOpen(false)}></div>
            <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 lg:hidden transform transition-transform animate-in slide-in-from-right duration-300 flex flex-col">
              <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                <span className="font-black text-secondary dark:text-white tracking-tight">MENU</span>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-gray-50 dark:bg-slate-800 rounded-lg text-gray-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4 flex-grow overflow-y-auto">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/40 rounded-3xl text-lg font-black text-secondary dark:text-gray-100 hover:bg-primary/10 hover:text-primary transition-all group border border-gray-100 dark:border-slate-800"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-gray-400 group-hover:text-primary transition-colors">
                        {link.name === 'Calculator' ? <Calculator className="w-5 h-5" /> : link.name === 'Pricing' ? <Zap className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
                      </div>
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors translate-x-0 group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
              <div className="p-6 border-t border-gray-100 dark:border-slate-800 space-y-3 bg-gray-50/50 dark:bg-slate-900">
                {user ? (
                  <>
                    <Link to="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 text-secondary dark:text-gray-200 font-bold p-2"><Settings className="w-5 h-5 text-gray-400" /><span>Account</span></Link>
                    <button onClick={handleLogout} className="flex items-center space-x-3 text-red-500 font-bold p-2"><LogOut className="w-5 h-5" /><span>Logout</span></button>
                  </>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center font-black uppercase text-secondary dark:text-gray-200 tracking-widest">Login</Link>
                    <Link to="/pricing" onClick={() => setIsMenuOpen(false)} className="w-full py-4 text-center font-black uppercase bg-primary text-white rounded-xl shadow-lg">Get Started</Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/calculator" element={<CalculatorPage user={user} toolType="profit" />} />
          <Route path="/etsy-fee-calculator" element={<CalculatorPage user={user} toolType="fees" />} />
          <Route path="/etsy-profit-calculator" element={<CalculatorPage user={user} toolType="profit" />} />
          <Route path="/etsy-offsite-ads-fee-calculator" element={<CalculatorPage user={user} toolType="ads" />} />
          <Route path="/etsy-break-even-price-calculator" element={<CalculatorPage user={user} toolType="breakeven" />} />
          <Route path="/etsy-listing-optimizer" element={<CalculatorPage user={user} toolType="optimizer" />} />
          <Route path="/etsy-competitor-compare" element={<CalculatorPage user={user} toolType="compare" />} />
          <Route path="/etsy-trend-hunter" element={<CalculatorPage user={user} toolType="trend" />} />
          <Route path="/etsy-image-auditor" element={<CalculatorPage user={user} toolType="image-auditor" />} />
          <Route path="/etsy-multi-region-strategy" element={<CalculatorPage user={user} toolType="region" />} />
          <Route path="/blog" element={<BlogListing />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/legal/:slug" element={<Legal />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/pricing" element={<Pricing user={user} setUser={setUser} />} />
          <Route path="/login" element={<Auth type="login" setUser={setUser} />} />
          <Route path="/signup" element={<Auth type="signup" setUser={setUser} />} />
          <Route path="/account" element={<Account user={user} setUser={setUser} />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-secondary dark:bg-slate-950 text-white pt-24 pb-12 overflow-hidden relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-8">
                <div className="bg-primary p-2 rounded-lg"><TrendingUp className="text-white w-6 h-6" /></div>
                <span className="text-2xl font-bold font-heading tracking-tight">EtsyProfit+</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
                The #1 toolkit for Etsy sellers to master their margins and scale profitably. Not affiliated with Etsy, Inc.
              </p>
              <div className="flex space-x-4">
                <SocialLink icon={<Twitter />} href={import.meta.env.VITE_TWITTER_URL} />
                <SocialLink icon={<Linkedin />} href={import.meta.env.VITE_LINKEDIN_URL} />
              </div>
            </div>
            <div>
              <h4 className="font-black mb-8 text-[10px] uppercase tracking-[0.2em] text-primary">Tool Suite</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/etsy-fee-calculator" className="text-gray-400 hover:text-white transition-colors">Fee Calculator</Link></li>
                <li><Link to="/etsy-profit-calculator" className="text-gray-400 hover:text-white transition-colors">Profit Analyzer</Link></li>
                <li><Link to="/etsy-break-even-price-calculator" className="text-gray-400 hover:text-white transition-colors">Break-Even Tool</Link></li>
                <li><Link to="/etsy-offsite-ads-fee-calculator" className="text-gray-400 hover:text-white transition-colors">Ads Scenario Tool</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-8 text-[10px] uppercase tracking-[0.2em] text-primary">Company</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing Plans</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Our Mission</Link></li>
                <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Seller Blog</Link></li>
                <li><Link to="/affiliate" className="text-gray-400 hover:text-white transition-colors">Partner Program</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-8 text-[10px] uppercase tracking-[0.2em] text-primary">Legal & Safety</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/legal/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/legal/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-widest">
            <p>© 2024 EtsyProfit+ Calculator.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0 opacity-60">
              <span className="flex items-center"><ShieldAlert className="w-3 h-3 mr-2" /> Independent App</span>
              <span className="flex items-center"><HelpCircle className="w-3 h-3 mr-2" /> 24/7 Support</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-64 -mt-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
      </footer>
    </div>
  );
};

const SocialLink: React.FC<{ icon: React.ReactNode; href?: string }> = ({ icon, href }) => {
  if (!href || href === '#') {
    return (
      <div className="p-3 bg-white/5 rounded-xl text-gray-600 cursor-not-allowed group relative">
        {icon}
      </div>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-primary hover:bg-white/10 transition-all">
      {icon}
    </a>
  );
};

export default App;