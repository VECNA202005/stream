import React, { useRef, useEffect, useState } from 'react';
import { useRoom } from '../../context/RoomContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Tv,
  Film,
  Upload,
  Link as LinkIcon,
  Check,
  Zap,
  Sparkles
} from 'lucide-react';

export const StreamPlayer = () => {
  const {
    currentMovie,
    isPlaying,
    currentTime,
    syncStatus,
    demoMovies,
    syncPlay,
    syncPause,
    syncSeek,
    changeMovie
  } = useRoom();

  const videoRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [duration, setDuration] = useState(currentMovie.duration || 100);
  const [localFileUrl, setLocalFileUrl] = useState(null);

  // Sync Video Element with Room state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      if (video.paused) {
        video.play().catch((e) => console.log('Autoplay blocked', e));
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }

    // Drift correction (<150ms tolerance)
    if (Math.abs(video.currentTime - currentTime) > 0.3) {
      video.currentTime = currentTime;
    }
  }, [isPlaying, currentTime]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      syncPause(video.currentTime);
    } else {
      syncPlay(video.currentTime);
    }
  };

  const handleSeekChange = (e) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
    syncSeek(seekTime);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleLocalFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileObjectUrl = URL.createObjectURL(file);
      setLocalFileUrl(fileObjectUrl);

      const localMovieObj = {
        id: `local-${Date.now()}`,
        title: `Local File: ${file.name}`,
        url: fileObjectUrl,
        poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
        genre: 'Local Video',
        description: 'Uploaded directly for zero-lag local sync stream.'
      };
      changeMovie(localMovieObj);
      setShowPicker(false);
    }
  };

  const handleCustomUrlSubmit = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      const customMovieObj = {
        id: `url-${Date.now()}`,
        title: 'Stream URL Video',
        url: customUrl.trim(),
        poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
        genre: 'Web Stream',
        description: customUrl.trim()
      };
      changeMovie(customMovieObj);
      setCustomUrl('');
      setShowPicker(false);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const activeVideoSrc = localFileUrl && currentMovie.url === localFileUrl ? localFileUrl : currentMovie.url;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Media Bar Header & Source Picker Trigger */}
      <div
        className="glass-panel"
        style={{
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000'
            }}
          >
            <Tv size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {currentMovie.title}
              <span className="live-indicator" style={{ marginLeft: '4px' }}></span>
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {currentMovie.genre} • <span style={{ color: 'var(--accent-emerald)' }}>{syncStatus}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPicker(!showPicker)}
          className="btn btn-gradient"
          style={{ fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
        >
          <Film size={16} />
          Change Movie / Stream Source
        </button>
      </div>

      {/* Stream Source Selector Drawer */}
      {showPicker && (
        <div className="glass-panel p-5" style={{ padding: '1.25rem', animation: 'modalPop 0.25s ease' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--accent-cyan)" /> Select Movie Stream
          </h4>

          {/* Curated Demos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {demoMovies.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  changeMovie(m);
                  setShowPicker(false);
                }}
                style={{
                  background: currentMovie.id === m.id ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  border: currentMovie.id === m.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{m.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{m.genre}</div>
              </div>
            ))}
          </div>

          {/* Custom File or URL input */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-glass)' }}>
            {/* Upload Local Video */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Upload Local Movie File (MP4/WebM)
              </label>
              <label
                className="btn btn-secondary"
                style={{ width: '100%', cursor: 'pointer', fontSize: '0.82rem', padding: '0.55rem' }}
              >
                <Upload size={16} /> Choose File from PC
                <input type="file" accept="video/mp4,video/webm" onChange={handleLocalFileUpload} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Direct URL */}
            <form onSubmit={handleCustomUrlSubmit}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Direct Video Stream URL
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <input
                  type="url"
                  placeholder="https://.../video.mp4"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="glass-input"
                  style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.45rem 0.75rem' }}>
                  Load
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Synced Video Player Box */}
      <div className="stream-player-container" style={{ aspectRatio: '16/9', minHeight: '380px' }}>
        <video
          ref={videoRef}
          src={activeVideoSrc}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
          onTimeUpdate={() => {
            if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 1.5) {
              setCurrentTime(videoRef.current.currentTime);
            }
          }}
          onClick={handlePlayPause}
          style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
        />

        {/* Sync Status Badge Top Right */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(9, 12, 21, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.85rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
        >
          <Zap size={14} color="var(--accent-cyan)" />
          {syncStatus}
        </div>

        {/* Custom Video Controls Overlay */}
        <div className="stream-controls-overlay">
          {/* Progress Seek Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: '40px' }}>
              {formatTime(videoRef.current ? videoRef.current.currentTime : currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={videoRef.current ? videoRef.current.currentTime : currentTime}
              onChange={handleSeekChange}
              style={{
                flex: 1,
                accentColor: 'var(--accent-cyan)',
                height: '5px',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: '40px' }}>
              {formatTime(duration)}
            </span>
          </div>

          {/* Buttons Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={handlePlayPause}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {isPlaying ? <Pause size={26} /> : <Play size={26} />}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  onClick={toggleMute}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{ width: '70px', accentColor: 'var(--accent-cyan)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="glass-pill" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', color: 'var(--text-muted)' }}>
                Zero Lag Broadcast
              </span>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
                  }
                }}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <Maximize size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
