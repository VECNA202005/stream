import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRoom } from '../../context/RoomContext';
import { Film, Calendar, Video, Plus, LogOut, UserCheck, Sparkles, MonitorPlay } from 'lucide-react';

export const Navbar = ({ onOpenAuth }) => {
  const { user, logout } = useAuth();
  const { viewMode, setViewMode, activeRoom, createRoom, joinRoom } = useRoom();
  const [joinInput, setJoinInput] = useState('');

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (joinInput.trim()) {
      joinRoom(joinInput.trim());
      setJoinInput('');
    }
  };

  return (
    <nav
      className="glass-panel"
      style={{
        margin: '1rem 1.5rem 0',
        padding: '0.8rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      {/* Brand Logo */}
      <div
        onClick={() => setViewMode('lobby')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          cursor: 'pointer'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent-violet) 0%, var(--accent-cyan) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)'
          }}
        >
          <Film size={22} color="#fff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Cinema<span style={{ color: 'var(--accent-cyan)' }}>Meet</span>
            </span>
            <span className="glass-pill" style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
              LIVE SYNC
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Ultra low-lag video call & stream</p>
        </div>
      </div>

      {/* Nav Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={() => setViewMode(activeRoom ? 'room' : 'lobby')}
          className={`btn ${viewMode === 'room' || viewMode === 'lobby' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.88rem', padding: '0.5rem 1rem' }}
        >
          <MonitorPlay size={16} />
          {activeRoom ? `Room: ${activeRoom}` : 'Watch Room'}
        </button>

        <button
          onClick={() => setViewMode('calendar')}
          className={`btn ${viewMode === 'calendar' ? 'btn-gradient' : 'btn-secondary'}`}
          style={{ fontSize: '0.88rem', padding: '0.5rem 1rem' }}
        >
          <Calendar size={16} />
          Movie Schedule
        </button>

        {/* Quick Join Input */}
        {!activeRoom && (
          <form onSubmit={handleJoinSubmit} style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="text"
              placeholder="Enter Room Code..."
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              className="glass-input"
              style={{ width: '150px', padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '0.45rem 0.8rem' }}>
              Join
            </button>
          </form>
        )}

        {!activeRoom && (
          <button
            onClick={() => createRoom()}
            className="btn btn-gradient"
            style={{ padding: '0.55rem 1rem', fontSize: '0.88rem' }}
          >
            <Plus size={16} />
            Start Instant Room
          </button>
        )}
      </div>

      {/* User Auth Profile Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user ? (
          <div
            className="glass-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.35rem 0.85rem',
              border: '1px solid rgba(0, 242, 254, 0.25)'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{user.avatar || '🍿'}</span>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <UserCheck size={10} /> Always Signed In
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                marginLeft: '0.25rem'
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="btn btn-primary" style={{ padding: '0.55rem 1.1rem', fontSize: '0.88rem' }}>
            <Sparkles size={16} />
            Sign In / Register
          </button>
        )}
      </div>
    </nav>
  );
};
