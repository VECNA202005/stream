import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoomProvider, useRoom } from './context/RoomContext';
import { Navbar } from './components/Navigation/Navbar';
import { AuthModal } from './components/Auth/AuthModal';
import { VideoGrid } from './components/Meet/VideoGrid';
import { ControlsBar } from './components/Meet/ControlsBar';
import { StreamPlayer } from './components/Stream/StreamPlayer';
import { MovieCalendar } from './components/Calendar/MovieCalendar';
import { RoomChat } from './components/Chat/RoomChat';
import {
  Film,
  Video,
  Calendar,
  Sparkles,
  Zap,
  Users,
  ShieldCheck,
  Play,
  ArrowRight,
  Plus
} from 'lucide-react';

const MainAppContent = () => {
  const { user } = useAuth();
  const {
    viewMode,
    setViewMode,
    activeRoom,
    activeTab,
    createRoom,
    joinRoom,
    demoMovies,
    changeMovie
  } = useRoom();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [joinCodeInput, setJoinCodeInput] = useState('');

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main Content Area */}
      <main className="main-content">
        {/* VIEW 1: LOBBY LANDING */}
        {viewMode === 'lobby' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '1rem 0' }}>
            {/* Hero Section */}
            <div
              className="glass-panel"
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at top center, rgba(121, 40, 202, 0.25) 0%, rgba(18, 24, 38, 0.8) 70%)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                className="glass-pill"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 1rem',
                  fontSize: '0.85rem',
                  color: 'var(--accent-cyan)',
                  marginBottom: '1.25rem'
                }}
              >
                <Zap size={16} /> Ultra Low-Lag WebRTC P2P Sync
              </div>

              <h1 style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem' }}>
                Stream Movies & Video Call <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-rose))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  With Your Friends — Zero Lag
                </span>
              </h1>

              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '1.05rem',
                  maxWidth: '650px',
                  margin: '0 auto 2rem',
                  lineHeight: 1.6
                }}
              >
                Combine Google Meet style video grid with synchronized movie streaming, screen sharing, and an interactive watch party calendar. Always stay signed in!
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => createRoom()}
                  className="btn btn-primary"
                  style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
                >
                  <Plus size={20} /> Start Instant Watch Room
                </button>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <input
                    type="text"
                    placeholder="Enter Room Code..."
                    value={joinCodeInput}
                    onChange={(e) => setJoinCodeInput(e.target.value)}
                    className="glass-input"
                    style={{ width: '180px', padding: '0.8rem 1rem' }}
                  />
                  <button
                    onClick={() => {
                      if (joinCodeInput.trim()) joinRoom(joinCodeInput.trim());
                    }}
                    className="btn btn-gradient"
                    style={{ padding: '0.8rem 1.25rem' }}
                  >
                    Join Room
                  </button>
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {/* Feature 1 */}
              <div className="glass-panel p-6" style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0, 242, 254, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    color: 'var(--accent-cyan)'
                  }}
                >
                  <Video size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Google Meet Style Video Grid
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Talk, see each other with webcam video, unmute mic, and share screen directly to friends with zero server delay.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-panel p-6" style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(121, 40, 202, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    color: 'var(--accent-violet)'
                  }}
                >
                  <Film size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Zero-Lag Synchronized Stream
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Play local MP4 files or web video URLs. When you play, pause, or seek, all your friends stay synced to the exact frame.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-panel p-6" style={{ padding: '1.75rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 0, 128, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    color: 'var(--accent-rose)'
                  }}
                >
                  <Calendar size={24} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Movie Schedule Calendar
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Add upcoming movie party nights on the calendar day list. Friends can check the schedule and join with 1 click.
                </p>
              </div>
            </div>

            {/* Featured Demo Movies */}
            <div className="glass-panel p-6" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={20} color="var(--accent-cyan)" /> Featured Stream Movies
                </h3>
                <button onClick={() => setViewMode('calendar')} className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                  View Full Calendar <ArrowRight size={14} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {demoMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="glass-panel"
                    style={{
                      overflow: 'hidden',
                      borderRadius: 'var(--radius-md)',
                      transition: 'transform 0.25s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      const code = createRoom();
                      changeMovie(movie);
                    }}
                  >
                    <div style={{ height: '150px', position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(9, 12, 21, 0.9) 0%, transparent 60%)',
                          display: 'flex',
                          alignItems: 'flex-end',
                          padding: '0.75rem'
                        }}
                      >
                        <span className="glass-pill" style={{ padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                          {movie.genre}
                        </span>
                      </div>
                    </div>

                    <div style={{ padding: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem' }}>{movie.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, height: '2.8rem', overflow: 'hidden' }}>
                        {movie.description}
                      </p>
                      <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem', fontSize: '0.82rem', padding: '0.5rem' }}>
                        <Play size={14} fill="#000" /> Start Watch Party Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ACTIVE MEETING & WATCH ROOM */}
        {viewMode === 'room' && (
          <div style={{ display: 'flex', gap: '1rem', height: 'calc(100vh - 120px)', minHeight: '600px' }}>
            {/* Left Area: Player or Grid */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', overflowY: 'auto' }}>
              {activeTab === 'stream' ? <StreamPlayer /> : <VideoGrid />}
              <ControlsBar isChatOpen={isChatOpen} onToggleChat={() => setIsChatOpen(!isChatOpen)} />
            </div>

            {/* Right Area: Room Chat Drawer */}
            <RoomChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </div>
        )}

        {/* VIEW 3: MOVIE CALENDAR */}
        {viewMode === 'calendar' && (
          <MovieCalendar onOpenAuth={() => setIsAuthOpen(true)} />
        )}
      </main>

      {/* Persistent Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RoomProvider>
        <MainAppContent />
      </RoomProvider>
    </AuthProvider>
  );
}
