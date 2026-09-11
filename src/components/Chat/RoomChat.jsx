import React, { useState } from 'react';
import { useRoom } from '../../context/RoomContext';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Users, Send, Smile, X, ShieldCheck, Mic, MicOff } from 'lucide-react';

export const RoomChat = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { messages, participants, sendMessage } = useRoom();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'people'
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        width: '340px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        borderLeft: '1px solid var(--border-glass)'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(9, 12, 21, 0.5)'
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setActiveTab('chat')}
            className={`btn ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          >
            <MessageSquare size={14} /> Chat
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`btn ${activeTab === 'people' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          >
            <Users size={14} /> People ({participants.length})
          </button>
        </div>

        <button onClick={onClose} className="btn btn-icon btn-secondary" style={{ width: '28px', height: '28px' }}>
          <X size={14} />
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Messages list */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.isSelf ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                {!msg.isSelf && !msg.isSystem && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem', marginLeft: '4px' }}>
                    {msg.sender} • {msg.timestamp}
                  </div>
                )}
                <div
                  style={{
                    background: msg.isSystem
                      ? 'rgba(0, 242, 254, 0.1)'
                      : msg.isSelf
                      ? 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: msg.isSelf ? '#000' : 'var(--text-main)',
                    padding: '0.55rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: msg.isSelf ? 600 : 400,
                    boxShadow: msg.isSelf ? '0 2px 10px rgba(0, 242, 254, 0.2)' : 'none'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '0.75rem',
              borderTop: '1px solid var(--border-glass)',
              display: 'flex',
              gap: '0.5rem',
              background: 'rgba(9, 12, 21, 0.6)'
            }}
          >
            <input
              type="text"
              placeholder={user ? "Send a message..." : "Sign in to chat..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!user}
              className="glass-input"
              style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
            />
            <button
              type="submit"
              disabled={!user}
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.75rem' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        /* People List Tab */
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {participants.map((p) => (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.8rem',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-glass)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{p.avatar || '🍿'}</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.name}</div>
                  {p.isHost && (
                    <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>Room Host</div>
                  )}
                </div>
              </div>

              <div>
                {p.isMicOn ? <Mic size={14} color="var(--accent-emerald)" /> : <MicOff size={14} color="#ef4444" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
