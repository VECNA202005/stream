'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { FileText, Plus, Search, Trash2, Sparkles, Clock } from 'lucide-react';

export const NotesView = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .eq('owner', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotes(data || []);
      } else {
        const localData = localStorage.getItem(`notes_${user.id}`);
        if (localData) {
          setNotes(JSON.parse(localData));
        } else {
          const defaultNotes = [
            {
              id: 201,
              owner: user.id,
              content: '🚀 Worked on Cloud-Diary architecture & Supabase RLS security policies today. Everything is running smoothly!',
              created_at: new Date().toISOString(),
            },
            {
              id: 202,
              owner: user.id,
              content: '💡 Next steps: Deploy frontend to Vercel and verify client environment variables.',
              created_at: new Date(Date.now() - 86400000).toISOString(),
            }
          ];
          setNotes(defaultNotes);
          localStorage.setItem(`notes_${user.id}`, JSON.stringify(defaultNotes));
        }
      }
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      if (isSupabaseConfigured) {
        const { data: authData } = await supabase.auth.getUser();
        const activeUser = authData?.user;

        if (!activeUser) {
          alert('Please Sign In or Register an account to save diary notes to your database.');
          return;
        }

        const { data, error } = await supabase
          .from('notes')
          .insert([
            {
              owner: activeUser.id,
              content: newContent.trim(),
            }
          ])
          .select();

        if (error) throw error;
        if (data) {
          setNotes((prev) => [data[0], ...prev]);
        }
      } else {
        const currentUserId = user?.id || 'demo-user';
        const newNote = {
          id: Date.now(),
          owner: currentUserId,
          content: newContent.trim(),
          created_at: new Date().toISOString(),
        };
        const updated = [newNote, ...notes];
        setNotes(updated);
        localStorage.setItem(`notes_${currentUserId}`, JSON.stringify(updated));
      }

      setNewContent('');
    } catch (err) {
      alert('Error creating note: ' + err.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this diary note?')) return;

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', noteId)
          .eq('owner', user.id);

        if (error) throw error;
      }
      const updated = notes.filter((n) => n.id !== noteId);
      setNotes(updated);
      if (!isSupabaseConfigured) {
        localStorage.setItem(`notes_${user.id}`, JSON.stringify(updated));
      }
    } catch (err) {
      alert('Error deleting note: ' + err.message);
    }
  };

  const filteredNotes = notes.filter((n) =>
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="glass-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="text-cyan-400" size={22} />
            Personal Diary Notes
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Write ideas, thoughts, and personal journal logs. Secured per-user with Supabase RLS policies.
          </p>
        </div>

        <div className="relative min-w-[240px]">
          <Search size={16} className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 glass-input text-xs"
          />
        </div>
      </div>

      {/* Write New Note Input Box */}
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400" />
          New Diary Entry
        </h3>

        <form onSubmit={handleCreateNote} className="space-y-3">
          <textarea
            rows={3}
            required
            placeholder="What's on your mind today? Write your entry here..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full glass-input resize-none text-sm"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg shadow-cyan-500/20 text-xs flex items-center gap-2 transition-all"
            >
              <Plus size={16} /> Save Note Entry
            </button>
          </div>
        </form>
      </div>

      {/* Notes Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Clock size={16} /> Previous Entries ({filteredNotes.length})
        </h3>

        {filteredNotes.length === 0 ? (
          <div className="glass-card p-8 text-center text-xs text-gray-400">
            No diary notes found. Write your first entry above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="glass-card p-5 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all group"
              >
                <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-gray-400">
                  <span>
                    🕒 {new Date(note.created_at).toLocaleDateString()} {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 transition-colors opacity-70 group-hover:opacity-100"
                    title="Delete Note"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
