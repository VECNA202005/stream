import React, { useEffect, useRef } from 'react';
import { useRoom } from '../../context/RoomContext';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Maximize2, Monitor } from 'lucide-react';

export const VideoGrid = () => {
  const {
    participants,
    localStream,
    screenStream,
    isMicOn,
    isCamOn,
    isScreenSharing
  } = useRoom();

  const localVideoRef = useRef(null);
  const screenVideoRef = useRef(null);

  // Attach local media stream to HTML5 video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach screen share stream
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  const participantCount = participants.length + (isScreenSharing ? 1 : 0);
  
  let gridClass = 'video-grid-1';
  if (participantCount === 2) gridClass = 'video-grid-2';
  else if (participantCount >= 3) gridClass = 'video-grid-3';

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Active Screen Sharing Hero view */}
      {isScreenSharing && (
        <div className="video-card" style={{ height: '360px', borderColor: 'var(--accent-cyan)' }}>
          <video ref={screenVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              background: 'rgba(0, 242, 254, 0.9)',
              color: '#000',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Monitor size={14} />
            Live Screen Stream (Zero Lag)
          </div>
        </div>
      )}

      {/* Meet Grid of Participants */}
      <div className={`video-grid ${gridClass}`}>
        {participants.map((p, index) => {
          const isSelf = index === 0; // First item is current user

          return (
            <div
              key={p.id}
              className={`video-card ${isSelf && isMicOn ? 'speaking' : ''}`}
            >
              {isSelf && isCamOn && localStream ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    background: 'radial-gradient(circle at center, rgba(18, 24, 38, 0.9), #090c15)'
                  }}
                >
                  <div
                    className="user-avatar-placeholder"
                    style={{
                      borderColor: p.color || 'var(--accent-cyan)',
                      border: '2px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    {p.avatar || '🍿'}
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {p.name}
                  </span>
                </div>
              )}

              {/* Participant Name Badge & Controls */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '0.6rem',
                  left: '0.6rem',
                  right: '0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(9, 12, 21, 0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.name}</span>
                  {p.isHost && (
                    <span className="glass-pill" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>
                      HOST
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {(isSelf ? isMicOn : p.isMicOn) ? (
                    <Mic size={14} color="var(--accent-emerald)" />
                  ) : (
                    <MicOff size={14} color="#ef4444" />
                  )}
                  {(isSelf ? isCamOn : p.isCamOn) ? (
                    <VideoIcon size={14} color="var(--accent-cyan)" />
                  ) : (
                    <VideoOff size={14} color="var(--text-muted)" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
