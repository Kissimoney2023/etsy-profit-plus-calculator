
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ALL_POSTS } from '../lib/blog-data';
import { BookOpen, Search, Clock, Calendar, ArrowRight, Tag } from 'lucide-react';

import { SEO } from '../components/SEO';

const BlogListing: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = ALL_POSTS.filter(post => {
    const matchesCategory = categoryFilter ? post.category === categoryFilter : true;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(ALL_POSTS.map(p => p.category)));

  return (
    <div className="py-24 bg-white dark:bg-transparent min-h-screen">
      <SEO
        title="Etsy Seller Academy | Guides & Resources"
        description="Expert guides on Etsy fees, pricing strategies, and profitability. Learn how to master your margins."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">Etsy Seller Academy</span>
          <h1 className="text-5xl md:text-7xl font-black font-heading text-secondary dark:text-white mb-8 tracking-tighter italic">Master Your Margins.</h1>
          <p className="text-xl text-gray-400 dark:text-slate-400 max-w-2xl mx-auto font-medium">Expert guides, pricing strategies, and updates on Etsy's fee structure.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/blog"
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${!categoryFilter ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
            >
              All Posts
            </Link>
            {categories.map(cat => (
              <Link
                key={cat}
                to={`/blog?category=${cat}`}
                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${categoryFilter === cat ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'}`}
              >
                {cat}
              </Link>
            ))}
          </div>
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-slate-700 rounded-2xl outline-none transition-all font-bold text-secondary dark:text-white"
            />
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
          {filteredPosts.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <BookOpen className="w-16 h-16 text-gray-100 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-gray-300">No articles found matching your criteria.</h3>
              <button onClick={() => setSearchQuery('')} className="mt-4 text-primary font-black uppercase text-xs tracking-widest">Clear Search</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PostCard: React.FC<{ post: any }> = ({ post }) => (
  <Link to={`/blog/${post.slug}`} className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-[32px] border-2 border-gray-50 dark:border-slate-800 overflow-hidden hover:border-primary/20 hover:shadow-2xl hover:shadow-green-100 dark:hover:shadow-green-900/20 transition-all">
    <div className="h-56 bg-gray-100 relative overflow-hidden">
      {post.image ? (
        <img
          src={post.image}
          alt={post.imageAlt || post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:scale-110 transition-transform duration-700"></div>
      )}
      <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-sm border border-white">
        {post.category}
      </div>
    </div>
    <div className="p-8 flex-grow flex flex-col">
      <div className="flex items-center space-x-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1.5" />{post.date}</span>
        <span className="flex items-center"><Clock className="w-3 h-3 mr-1.5" />{post.readingTime}</span>
      </div>
      <h3 className="text-2xl font-black text-secondary dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
      <p className="text-gray-400 dark:text-gray-500 font-medium text-sm leading-relaxed mb-6 line-clamp-3">{post.description}</p>
      <div className="mt-auto flex items-center text-secondary dark:text-white font-black uppercase text-xs tracking-widest group-hover:translate-x-1 transition-transform">
        <span>Read Full Guide</span>
        <ArrowRight className="ml-2 w-4 h-4 text-primary" />
      </div>
    </div>
  </Link>
);

export default BlogListing;
