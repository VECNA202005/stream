import React, { useState } from 'react';
import { useRoom } from '../../context/RoomContext';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Video,
  Film,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  User,
  X,
  Play
} from 'lucide-react';

export const MovieCalendar = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const { scheduledParties, addScheduledParty, joinRoom } = useRoom();

  const [showAddModal, setShowAddModal] = useState(false);
  const [movieTitle, setMovieTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('20:00');
  const [roomCode, setRoomCode] = useState('MOVIE-' + Math.floor(100 + Math.random() * 900));
  const [genre, setGenre] = useState('Action');

  // Calendar dates generation (Current month)
  const today = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();
  const startDayOfWeek = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!movieTitle.trim()) return;

    addScheduledParty({
      movieTitle,
      date,
      time,
      roomCode: roomCode.toUpperCase(),
      genre
    });

    setShowAddModal(false);
    setMovieTitle('');
  };

  // Group events by date string "YYYY-MM-DD"
  const eventsByDate = {};
  scheduledParties.forEach((evt) => {
    if (!eventsByDate[evt.date]) eventsByDate[evt.date] = [];
    eventsByDate[evt.date].push(evt);
  });

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CalendarIcon size={24} color="var(--accent-cyan)" /> Movie Watch Party Schedule
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
            Schedule movie streams with your friends and join rooms on the day of the event
          </p>
        </div>

        <button
          onClick={() => {
            if (!user) {
              onOpenAuth();
            } else {
              setShowAddModal(true);
            }
          }}
          className="btn btn-gradient"
          style={{ padding: '0.7rem 1.25rem' }}
        >
          <Plus size={18} /> Schedule New Movie Night
        </button>
      </div>

      {/* Calendar Controls & Month Header */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={handlePrevMonth} className="btn btn-icon btn-secondary" style={{ width: '36px', height: '36px' }}>
            <ChevronLeft size={18} />
          </button>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {monthNames[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
          </h3>
          <button onClick={handleNextMonth} className="btn btn-icon btn-secondary" style={{ width: '36px', height: '36px' }}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="glass-pill" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
          {scheduledParties.length} Total Scheduled Watch Parties
        </div>
      </div>

      {/* Calendar Month Grid */}
      <div className="glass-panel p-5" style={{ padding: '1.25rem' }}>
        {/* Day of Week Headers */}
        <div className="calendar-grid" style={{ marginBottom: '0.5rem' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="calendar-day-header">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="calendar-grid">
          {/* Offset blank cells */}
          {Array.from({ length: startDayOfWeek }).map((_, idx) => (
            <div key={`blank-${idx}`} className="calendar-cell" style={{ opacity: 0.3 }} />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const yearStr = currentMonthDate.getFullYear();
            const monthStr = String(currentMonthDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const dateKey = `${yearStr}-${monthStr}-${dayStr}`;

            const isToday =
              today.getFullYear() === yearStr &&
              today.getMonth() === currentMonthDate.getMonth() &&
              today.getDate() === dayNum;

            const events = eventsByDate[dateKey] || [];

            return (
              <div key={dateKey} className={`calendar-cell ${isToday ? 'today' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: isToday ? 800 : 500,
                      color: isToday ? 'var(--accent-cyan)' : 'var(--text-main)'
                    }}
                  >
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="glass-pill" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem', color: 'var(--accent-cyan)' }}>
                      TODAY
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => joinRoom(evt.roomCode)}
                      className="movie-badge"
                      title={`Click to join room: ${evt.roomCode}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Play size={10} fill="#fff" />
                        <span>{evt.time} - {evt.movieTitle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Schedule New Movie Party */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel p-6" style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAddModal(false)}
              className="btn btn-icon btn-secondary"
              style={{ position: 'absolute', top: '1rem', right: '1rem', width: '32px', height: '32px' }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Film size={20} color="var(--accent-cyan)" /> Schedule Movie Party
            </h3>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Movie Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inception Movie Night"
                  value={movieTitle}
                  onChange={(e) => setMovieTitle(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Stream Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="glass-input"
                    style={{ width: '100%', background: '#090c15' }}
                  >
                    <option value="Action">Action</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Animation">Animation</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Horror">Horror</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-gradient" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>
                <Sparkles size={18} /> Confirm & Add to Calendar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
