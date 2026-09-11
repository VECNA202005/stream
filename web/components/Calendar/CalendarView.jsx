'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { Calendar as CalendarIcon, Plus, Video, Clock, ChevronLeft, ChevronRight, Sparkles, Trash2 } from 'lucide-react';

export const CalendarView = ({ user, onOpenMeeting }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

  // Fetch user events from Supabase or Local Storage fallback
  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('owner', user.id)
          .order('start', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } else {
        // Fallback local storage
        const localData = localStorage.getItem(`events_${user.id}`);
        if (localData) {
          setEvents(JSON.parse(localData));
        } else {
          // Default sample events
          const todayStr = new Date().toISOString().split('T')[0];
          const sampleEvents = [
            {
              id: 101,
              owner: user.id,
              title: 'Team Strategy Sync & Coffee ☕',
              start: `${todayStr}T10:00:00Z`,
            },
            {
              id: 102,
              owner: user.id,
              title: 'Project Review & Video Call 🎥',
              start: `${todayStr}T14:30:00Z`,
            }
          ];
          setEvents(sampleEvents);
          localStorage.setItem(`events_${user.id}`, JSON.stringify(sampleEvents));
        }
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !user) return;

    const startISO = `${selectedDateStr}T10:00:00Z`;

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('events')
          .insert([
            {
              owner: user.id,
              title: newTitle.trim(),
              start: startISO,
            }
          ])
          .select();

        if (error) throw error;
        if (data) {
          setEvents((prev) => [...prev, ...data]);
        }
      } else {
        // Fallback local storage
        const newEvt = {
          id: Date.now(),
          owner: user.id,
          title: newTitle.trim(),
          start: startISO,
        };
        const updated = [...events, newEvt];
        setEvents(updated);
        localStorage.setItem(`events_${user.id}`, JSON.stringify(updated));
      }

      setNewTitle('');
      setShowAddModal(false);
    } catch (err) {
      alert('Error creating event: ' + err.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', eventId)
          .eq('owner', user.id);

        if (error) throw error;
      }
      const updated = events.filter((e) => e.id !== eventId);
      setEvents(updated);
      if (!isSupabaseConfigured) {
        localStorage.setItem(`events_${user.id}`, JSON.stringify(updated));
      }
    } catch (err) {
      alert('Error deleting event: ' + err.message);
    }
  };

  // Calendar Days calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Add Action */}
      <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="text-cyan-400" size={22} />
            Personal Calendar & Events
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Click on any date to add a personal event or open an instant Jitsi video meeting room.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/20 text-xs flex items-center gap-2 transition-all"
        >
          <Plus size={16} /> Add New Event
        </button>
      </div>

      {/* Calendar Grid Container */}
      <div className="glass-card p-6 space-y-4">
        {/* Month Navigator Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-lg font-bold text-white">
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="glass-pill px-3 py-1 text-xs text-cyan-400 font-medium">
            {events.length} Total Events
          </div>
        </div>

        {/* Calendar Day Labels */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-2">
          {/* Offset Blank Cells */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`blank-${i}`} className="min-h-[90px] rounded-lg bg-white/[0.02] border border-white/[0.03] opacity-40" />
          ))}

          {/* Actual Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            const dayEvents = events.filter((e) => e.start.startsWith(dateStr));

            return (
              <div
                key={dateStr}
                onClick={() => {
                  setSelectedDateStr(dateStr);
                  setShowAddModal(true);
                }}
                className={`min-h-[100px] p-2 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isToday
                    ? 'bg-cyan-500/10 border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                    : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isToday ? 'text-cyan-400' : 'text-gray-300'}`}>
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                      TODAY
                    </span>
                  )}
                </div>

                {/* Day Events Badges */}
                <div className="space-y-1 mt-1">
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenMeeting(evt);
                      }}
                      className="p-1.5 rounded bg-gradient-to-r from-violet-600/80 to-indigo-600/80 text-[11px] text-white font-medium hover:scale-[1.02] transition-transform truncate flex items-center justify-between gap-1 shadow-sm"
                      title={`Click to open Jitsi meeting room for: ${evt.title}`}
                    >
                      <span className="truncate">{evt.title}</span>
                      <Video size={12} className="shrink-0 text-cyan-300" />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="glass-card p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="text-cyan-400" size={18} />
          Your Scheduled Events ({events.length})
        </h3>

        {events.length === 0 ? (
          <p className="text-xs text-gray-400">No upcoming events. Click on a calendar day to add your first event!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">{evt.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    📅 {new Date(evt.start).toLocaleDateString()} at {new Date(evt.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenMeeting(evt)}
                    className="py-1.5 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-xs font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Video size={14} /> Join Jitsi Call
                  </button>

                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md p-6 glass-card space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles size={20} className="text-cyan-400" />
              Schedule New Event
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Strategy Sync Meeting"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={selectedDateStr}
                  onChange={(e) => setSelectedDateStr(e.target.value)}
                  className="w-full glass-input"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
