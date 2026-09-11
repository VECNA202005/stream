'use client';

import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { X, Lock, Mail, UserCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;
          
          if (data.user) {
            setMessage('Account created successfully! Check your email or sign in.');
            onAuthSuccess(data.user);
            setTimeout(() => onClose(), 1200);
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            setMessage('Signed in successfully!');
            onAuthSuccess(data.user);
            setTimeout(() => onClose(), 800);
          }
        }
      } else {
        // Fallback local authentication mode when Supabase env vars are not set
        const demoUser = {
          id: 'usr-' + Math.random().toString(36).substr(2, 9),
          email: email,
        };
        setMessage('Signed in (Local Dev Preview Mode)!');
        onAuthSuccess(demoUser);
        setTimeout(() => onClose(), 800);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md p-6 glass-card animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/15 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/20 text-white">
            <Sparkles size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">
            {isSignUp ? 'Create Cloud-Diary Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {isSignUp ? 'Sign up to manage personal diary events and notes' : 'Sign in to access your secured personal diary'}
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>Supabase environment variables not connected yet. Running in <strong>Local Preview Mode</strong>.</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 glass-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 glass-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/25 transition-all text-sm flex items-center justify-center gap-2"
          >
            <UserCheck size={18} />
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center pt-4 border-t border-white/10">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setMessage('');
            }}
            className="text-xs text-cyan-400 hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
