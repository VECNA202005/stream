import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Film, Mail, Lock, User, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

const AVATARS = ['🍿', '🎬', '🎥', '⚡', '🚀', '🎮', '🎧', '💎'];

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🍿');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isSignUpMode) {
      if (!name.trim()) {
        setErrorMsg('Please enter your display name');
        return;
      }
      const res = signup(name, email, password, selectedAvatar);
      if (res.success) {
        setSuccessMsg('Account created successfully! You stay signed in automatically.');
        setTimeout(() => onClose(), 1200);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = login(email, password);
      if (res.success) {
        setSuccessMsg('Logged in successfully!');
        setTimeout(() => onClose(), 800);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel p-6" style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="btn btn-icon btn-secondary"
          style={{ position: 'absolute', top: '1rem', right: '1rem', width: '32px', height: '32px' }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
            }}
          >
            <Film size={26} color="#000" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {isSignUpMode ? 'Create Cinema Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            {isSignUpMode
              ? 'Join your friends for lag-free movie nights'
              : 'Sign in to access your stream rooms & schedule'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem'
          }}
        >
          <button
            onClick={() => {
              setIsSignUpMode(false);
              setErrorMsg('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: !isSignUpMode ? 'var(--accent-cyan)' : 'transparent',
              color: !isSignUpMode ? '#000' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsSignUpMode(true);
              setErrorMsg('');
            }}
            style={{
              flex: 1,
              padding: '0.5rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: isSignUpMode ? 'var(--accent-violet)' : 'transparent',
              color: isSignUpMode ? '#fff' : 'var(--text-muted)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}
          >
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle2 size={16} />
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isSignUpMode && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Avatar Icon
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {AVATARS.map((av) => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setSelectedAvatar(av)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: selectedAvatar === av ? '2px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                      background: selectedAvatar === av ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSignUpMode && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Display Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. Gokul"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input"
                  style={{ width: '100%', paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          {/* Persistent session banner note */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.78rem',
              color: 'var(--accent-cyan)',
              background: 'rgba(0, 242, 254, 0.08)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <ShieldCheck size={16} />
            <span>Always Signed In mode active. You won't need to log in again!</span>
          </div>

          <button
            type="submit"
            className={isSignUpMode ? 'btn btn-gradient' : 'btn btn-primary'}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            <Sparkles size={18} />
            {isSignUpMode ? 'Create Account & Start' : 'Sign In Now'}
          </button>
        </form>
      </div>
    </div>
  );
};
