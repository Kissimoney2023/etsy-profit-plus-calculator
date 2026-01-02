
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Shield, Cookie, ArrowLeft } from 'lucide-react';

const Legal: React.FC = () => {
  const { slug } = useParams();

  const getContent = () => {
    switch(slug) {
      case 'privacy':
        return {
          title: "Privacy Policy",
          icon: <Shield className="w-10 h-10 text-primary" />,
          lastUpdated: "January 15, 2024",
          content: `
            <h3>1. Information We Collect</h3>
            <p>We collect information you provide directly to us when you create an account, such as your email address and billing details. For guest users, we use local storage to track calculation usage purely to enforce free tier limits.</p>
            <h3>2. How We Use Your Data</h3>
            <p>We use your data to provide the calculator service, manage your subscription, and send occasional product updates. We do not sell your personal data to third parties.</p>
            <h3>3. Data Security</h3>
            <p>We implement industry-standard security measures including SSL encryption and secure database protocols provided by Supabase. However, no method of transmission is 100% secure.</p>
          `
        };
      case 'terms':
        return {
          title: "Terms of Service",
          icon: <FileText className="w-10 h-10 text-blue-500" />,
          lastUpdated: "January 15, 2024",
          content: `
            <h3>1. Acceptance of Terms</h3>
            <p>By using EtsyProfit+, you agree to these terms. If you do not agree, please do not use the service.</p>
            <h3>2. Disclaimer of Accuracy</h3>
            <p>The calculations provided are estimates based on 2024 Etsy fee structures. We are not responsible for financial decisions made based on these estimates. Always verify fees in your official Etsy shop dashboard.</p>
            <h3>3. Usage Limits</h3>
            <p>Free users are limited to 5 calculations per day. Attempting to bypass these limits via technical means is a violation of these terms.</p>
          `
        };
      case 'cookies':
        return {
          title: "Cookie Policy",
          icon: <Cookie className="w-10 h-10 text-orange-500" />,
          lastUpdated: "January 15, 2024",
          content: `
            <h3>What are cookies?</h3>
            <p>Cookies are small text files stored in your browser. We use them to keep you logged in and track basic usage analytics.</p>
            <h3>Types of cookies we use</h3>
            <ul>
              <li><strong>Essential:</strong> Required for the app to function (e.g., Auth session).</li>
              <li><strong>Analytics:</strong> Help us understand how users interact with our tools.</li>
            </ul>
            <p>You can opt-out of non-essential cookies via your browser settings.</p>
          `
        };
      default:
        return null;
    }
  };

  const data = getContent();
  if (!data) return <div className="py-24 text-center font-black">Page Not Found</div>;

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back Home
        </Link>
        
        <header className="mb-16 pb-12 border-b border-gray-100">
           <div className="mb-6">{data.icon}</div>
           <h1 className="text-4xl md:text-6xl font-black font-heading text-secondary mb-4 tracking-tighter">{data.title}</h1>
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Last Updated: {data.lastUpdated}</p>
        </header>

        <div className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-black prose-p:text-gray-500 prose-p:leading-relaxed legal-content">
           <div dangerouslySetInnerHTML={{ __html: data.content }} />
        </div>
        
        <div className="mt-20 p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center">
           <p className="text-sm font-bold text-gray-400">Questions about our policies? <a href="mailto:legal@etsyprofitplus.com" className="text-primary underline">Contact Legal</a></p>
        </div>
      </div>
    </div>
  );
};

export default Legal;
