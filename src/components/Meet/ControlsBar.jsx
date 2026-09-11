import React, { useState } from 'react';
import { useRoom } from '../../context/RoomContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Tv,
  MessageSquare,
  PhoneOff,
  Share2,
  Check,
  Film
} from 'lucide-react';

export const ControlsBar = ({ isChatOpen, onToggleChat }) => {
  const {
    activeRoom,
    isMicOn,
    isCamOn,
    isScreenSharing,
    activeTab,
    setActiveTab,
    toggleMic,
    toggleCam,
    startScreenShare,
    stopScreenShare,
    leaveRoom
  } = useRoom();

  const [copied, setCopied] = useState(false);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(window.location.origin + '?room=' + activeRoom);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      {/* Left: Tab View Switch (Watch Party vs Meet Grid) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('stream')}
          className={`btn ${activeTab === 'stream' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
        >
          <Tv size={16} />
          Synced Movie Player
        </button>
        <button
          onClick={() => setActiveTab('meet')}
          className={`btn ${activeTab === 'meet' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
        >
          <Video size={16} />
          Google Meet Grid
        </button>
      </div>

      {/* Middle: Media Action Buttons (Mic, Cam, Screen Share) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={toggleMic}
          className={`btn btn-icon ${isMicOn ? 'btn-secondary' : 'btn-danger'}`}
          title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        <button
          onClick={toggleCam}
          className={`btn btn-icon ${isCamOn ? 'btn-secondary' : 'btn-danger'}`}
          title={isCamOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isCamOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        <button
          onClick={isScreenSharing ? stopScreenShare : startScreenShare}
          className={`btn btn-icon ${isScreenSharing ? 'btn-primary' : 'btn-secondary'}`}
          title={isScreenSharing ? 'Stop Screen Sharing' : 'Stream Screen / Tab (Zero Lag)'}
        >
          <Monitor size={20} />
        </button>

        <button
          onClick={onToggleChat}
          className={`btn btn-icon ${isChatOpen ? 'btn-primary' : 'btn-secondary'}`}
          title="Toggle Room Chat"
        >
          <MessageSquare size={20} />
        </button>
      </div>

      {/* Right: Copy Invite & Leave Room */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={copyRoomCode}
          className="btn btn-secondary"
          style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
        >
          {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Share2 size={16} />}
          {copied ? 'Link Copied!' : `Invite Code: ${activeRoom}`}
        </button>

        <button
          onClick={leaveRoom}
          className="btn btn-danger"
          style={{ fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
        >
          <PhoneOff size={16} />
          Leave Call
        </button>
      </div>
    </div>
  );
};
