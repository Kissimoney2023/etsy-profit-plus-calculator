import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { TrendingUp, Mail, Lock, ArrowRight, Github, RefreshCcw } from 'lucide-react';
import { UserProfile, PlanType } from '../types';
import { supabase } from '../lib/supabase';

interface AuthProps {
  type: 'login' | 'signup';
  setUser: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ type, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error: any) {
      alert(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 group mb-8">
            <TrendingUp className="text-primary w-8 h-8" />
            <span className="text-2xl font-bold font-heading text-secondary">EtsyProfit+</span>
          </Link>
          <h2 className="text-3xl font-black text-secondary">{type === 'login' ? 'Welcome Back' : 'Get Started Free'}</h2>
          <p className="mt-2 text-sm text-gray-500">
            {type === 'login' ? "Don't have an account? " : "Already have an account? "}
            <Link to={type === 'login' ? '/signup' : '/login'} className="text-primary font-bold hover:underline">
              {type === 'login' ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
              <span className="ml-2 text-gray-600">Remember me</span>
            </div>
            <a href="#" className="text-primary font-bold hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-primary hover:bg-opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-green-100"
          >
            {isLoading ? (
              <RefreshCcw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {type === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400 uppercase tracking-widest text-xs">Or continue with</span></div>
          </div>

          <button type="button" className="w-full py-4 border-2 border-gray-100 rounded-xl flex items-center justify-center space-x-2 font-bold text-gray-700 hover:bg-gray-50 transition-all">
            <Github className="w-5 h-5" />
            <span>GitHub</span>
          </button>
        </form>
      </div>
    </div>
  );
};



export default Auth;