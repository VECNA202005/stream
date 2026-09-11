'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CalendarView } from '../components/Calendar/CalendarView';
import { NotesView } from '../components/Notes/NotesView';
import { AuthModal } from '../components/Auth/AuthModal';
import { JitsiModal } from '../components/Meeting/JitsiModal';
import { Calendar, FileText, Sparkles, LogOut, User, Video, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' or 'notes'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeMeetingEvent, setActiveMeetingEvent] = useState(null);

  // Check active user session on mount
  useEffect(() => {
    checkUser();

    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, []);

  const checkUser = async () => {
    try {
      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
        }
      } else {
        // Fallback default user for preview testing
        const savedUser = localStorage.getItem('cloud_diary_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          const defaultUser = {
            id: 'usr-demo-101',
            email: 'demo.user@clouddiary.com',
          };
          setUser(defaultUser);
          localStorage.setItem('cloud_diary_user', JSON.stringify(defaultUser));
        }
      }
    } catch (err) {
      console.warn('User session check error:', err);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('cloud_diary_user');
    }
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="glass-card mx-4 mt-4 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('calendar')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Cloud<span className="text-cyan-400">Diary</span>
              <span className="glass-pill px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                VERCEL + SUPABASE
              </span>
            </h1>
            <p className="text-[11px] text-gray-400">Personal Calendar, Jitsi Video Meetings & Notes</p>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar size={15} /> Calendar & Meetings
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'notes'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText size={15} /> Personal Notes
          </button>
        </div>

        {/* User Auth Profile Badge */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="glass-pill px-3 py-1.5 flex items-center gap-2.5 border border-cyan-500/30">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <User size={14} />
              </div>
              <div className="text-left leading-tight">
                <div className="text-xs font-semibold text-white truncate max-w-[140px]">
                  {user.email || 'User'}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck size={10} /> RLS Secured
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="ml-2 text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-xs font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
            >
              <User size={15} /> Sign In / Register
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'calendar' ? (
          <CalendarView
            user={user}
            onOpenMeeting={(evt) => setActiveMeetingEvent(evt)}
          />
        ) : (
          <NotesView user={user} />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-card mx-4 mb-4 px-6 py-3 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-cyan-400" />
          <span>Cloud-Diary Frontend-First Architecture</span>
        </div>
        <div>Ready for 1-Click Vercel Deployment & Supabase Postgres RLS</div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />

      {/* Embedded Jitsi Meeting Modal */}
      {activeMeetingEvent && (
        <JitsiModal
          event={activeMeetingEvent}
          onClose={() => setActiveMeetingEvent(null)}
        />
      )}
    </div>
  );
}
