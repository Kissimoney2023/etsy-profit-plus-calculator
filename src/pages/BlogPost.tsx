
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ALL_POSTS } from '../lib/blog-data';
import { Calendar, Clock, ArrowLeft, Share2, Tag, ChevronRight, Calculator, CheckCircle2 } from 'lucide-react';
import JsonLd from '../components/JsonLd';

const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const post = ALL_POSTS.find(p => p.slug === slug);

  if (!post) return <Navigate to="/blog" />;

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "author": { "@type": "Organization", "name": "EtsyProfit+" }
  };

  return (
    <div className="py-24 bg-white min-h-screen">
      <JsonLd data={jsonLdData} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-sm font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Academy
        </Link>

        <header className="mb-16">
          <div className="flex items-center space-x-2 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6">
            <span className="bg-primary/10 px-3 py-1 rounded-full">{post.category}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-heading text-secondary mb-8 leading-[1.1] tracking-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-primary" />{post.date}</div>
            <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-primary" />{post.readingTime}</div>
            <div className="flex items-center space-x-2">
              {post.keywords.map(kw => <span key={kw} className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">#{kw}</span>)}
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none prose-slate prose-headings:font-heading prose-headings:font-black prose-headings:text-secondary prose-a:text-primary prose-a:font-bold prose-strong:text-secondary prose-p:text-gray-500 prose-p:leading-relaxed blog-content-styles">
           <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-20 p-10 bg-secondary rounded-[40px] text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h3 className="text-3xl font-black mb-4">Want to see your real numbers?</h3>
                <p className="text-gray-400 font-medium mb-6">Calculate your exact Etsy profit, fees, and break-even points for 2024 with our professional analyzer.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/calculator" className="bg-primary px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest text-center">Launch Tool</Link>
                  <Link to="/pricing" className="bg-white/10 border-2 border-white/20 px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest text-center hover:bg-white/20 transition-all">View Plans</Link>
                </div>
              </div>
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                <Calculator className="w-16 h-16 text-primary" />
              </div>
           </div>
           <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Disclaimer: Estimates only. Always confirm fees in your official Etsy dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
