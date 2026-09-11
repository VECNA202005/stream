import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const RoomContext = createContext(null);

const DEMO_MOVIES = [
  {
    id: 'demo-1',
    title: 'Tears of Steel (4K Sci-Fi Short)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    duration: 734,
    genre: 'Sci-Fi / Action',
    description: 'A futuristic sci-fi movie featuring high tech visual effects, robotics, and intense cinematic action.'
  },
  {
    id: 'demo-2',
    title: 'Big Buck Bunny (Animation)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    duration: 596,
    genre: 'Animation / Comedy',
    description: 'A giant rabbit deals with forest bullies in this famous open-source movie classic.'
  },
  {
    id: 'demo-3',
    title: 'Sintel (Fantasy Adventure)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    duration: 888,
    genre: 'Fantasy / Drama',
    description: 'A lonely girl embarks on a quest to rescue a dragon chick she nurtured.'
  }
];

const CALENDAR_STORAGE_KEY = 'cinemameet_scheduled_parties';

export const RoomProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [activeRoom, setActiveRoom] = useState(null); // e.g. "STREAM-482"
  const [viewMode, setViewMode] = useState('lobby'); // 'lobby', 'room', 'calendar'
  const [activeTab, setActiveTab] = useState('stream'); // 'stream' (Watch Party) or 'meet' (Google Meet Grid)

  // Media Controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  // Participants in Room
  const [participants, setParticipants] = useState([]);

  // Synced Movie Player State
  const [currentMovie, setCurrentMovie] = useState(DEMO_MOVIES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [syncStatus, setSyncStatus] = useState('In Sync (0ms latency)');

  // Chat Messages
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'CinemaBot 🍿',
      text: 'Welcome to CinemaMeet! Join or create a room to stream movies with zero lag.',
      timestamp: '18:45',
      isSystem: true
    }
  ]);

  // Calendar Scheduled Movies
  const [scheduledParties, setScheduledParties] = useState(() => {
    try {
      const saved = localStorage.getItem(CALENDAR_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Default sample schedules for current week
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return [
      {
        id: 'sch-1',
        movieTitle: 'Interstellar Movie Night',
        date: today.toISOString().split('T')[0],
        time: '20:00',
        roomCode: 'SPACE-STREAM',
        host: 'Gokul',
        poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        genre: 'Sci-Fi'
      },
      {
        id: 'sch-2',
        movieTitle: 'Marvel Movie Marathon',
        date: tomorrow.toISOString().split('T')[0],
        time: '21:30',
        roomCode: 'MARVEL-STREAM',
        host: 'Alex',
        poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
        genre: 'Action'
      }
    ];
  });

  // Save calendar parties to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(scheduledParties));
    } catch (e) {}
  }, [scheduledParties]);

  // Sync Broadcast Channel for multi-tab / zero-lag sync
  const channelRef = useRef(null);

  useEffect(() => {
    if (activeRoom) {
      const channelName = `cinemameet_room_${activeRoom}`;
      channelRef.current = new BroadcastChannel(channelName);

      channelRef.current.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'SYNC_STATE') {
          if (payload.movie) setCurrentMovie(payload.movie);
          setIsPlaying(payload.isPlaying);
          if (Math.abs(payload.currentTime - currentTime) > 0.3) {
            setCurrentTime(payload.currentTime);
          }
          setSyncStatus('In Sync (<50ms latency)');
        } else if (type === 'CHAT_MSG') {
          setMessages((prev) => [...prev, payload]);
        } else if (type === 'PEER_JOIN') {
          addParticipant(payload);
        }
      };

      // Broadcast self join
      if (user) {
        channelRef.current.postMessage({
          type: 'PEER_JOIN',
          payload: {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            color: user.color,
            isMicOn: true,
            isCamOn: true
          }
        });
      }
    }

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, [activeRoom, user]);

  const broadcastSync = (newState) => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'SYNC_STATE',
        payload: newState
      });
    }
  };

  // Setup Web Audio / Local Webcam stream
  const initLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.warn('Camera/Mic permission denied or not available:', err);
      return null;
    }
  };

  const toggleMic = () => {
    setIsMicOn((prev) => {
      const next = !prev;
      if (localStream) {
        localStream.getAudioTracks().forEach((t) => (t.enabled = next));
      }
      return next;
    });
  };

  const toggleCam = () => {
    setIsCamOn((prev) => {
      const next = !prev;
      if (localStream) {
        localStream.getVideoTracks().forEach((t) => (t.enabled = next));
      }
      return next;
    });
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: true
      });
      setScreenStream(stream);
      setIsScreenSharing(true);

      stream.getVideoTracks()[0].onended = () => {
        setIsScreenSharing(false);
        setScreenStream(null);
      };
    } catch (e) {
      console.warn('Screen share cancelled', e);
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }
    setIsScreenSharing(false);
  };

  // Room Join / Create
  const createRoom = () => {
    const code = 'STREAM-' + Math.floor(100 + Math.random() * 900);
    setActiveRoom(code);
    setViewMode('room');
    initLocalStream();

    // Populate initial friend participants for realistic Meet grid
    if (user) {
      setParticipants([
        {
          id: user.id,
          name: user.name + ' (You)',
          avatar: user.avatar,
          color: user.color,
          isHost: true,
          isMicOn: true,
          isCamOn: true
        },
        {
          id: 'friend-1',
          name: 'Sarah (Friend)',
          avatar: '🍿',
          color: '#ff0080',
          isMicOn: true,
          isCamOn: true
        },
        {
          id: 'friend-2',
          name: 'David (Friend)',
          avatar: '🎥',
          color: '#7928ca',
          isMicOn: false,
          isCamOn: true
        }
      ]);
    }
    return code;
  };

  const joinRoom = (code) => {
    if (!code) return false;
    const formattedCode = code.toUpperCase();
    setActiveRoom(formattedCode);
    setViewMode('room');
    initLocalStream();

    if (user) {
      setParticipants([
        {
          id: user.id,
          name: user.name + ' (You)',
          avatar: user.avatar,
          color: user.color,
          isMicOn: true,
          isCamOn: true
        },
        {
          id: 'host-1',
          name: 'Room Host 🍿',
          avatar: '🎬',
          color: '#00f2fe',
          isHost: true,
          isMicOn: true,
          isCamOn: true
        }
      ]);
    }
    return true;
  };

  const leaveRoom = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
    }
    setActiveRoom(null);
    setViewMode('lobby');
  };

  const addParticipant = (newPeer) => {
    setParticipants((prev) => {
      if (prev.some((p) => p.id === newPeer.id)) return prev;
      return [...prev, newPeer];
    });
  };

  const sendMessage = (text) => {
    if (!text.trim() || !user) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgObj = {
      id: `msg-${Date.now()}`,
      sender: user.name,
      senderAvatar: user.avatar,
      text,
      timestamp: timeStr,
      isSelf: true
    };

    setMessages((prev) => [...prev, msgObj]);

    if (channelRef.current) {
      channelRef.current.postMessage({
        type: 'CHAT_MSG',
        payload: { ...msgObj, isSelf: false }
      });
    }
  };

  const addScheduledParty = (eventData) => {
    const newEvent = {
      id: `sch-${Date.now()}`,
      host: user ? user.name : 'Host',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      ...eventData
    };
    setScheduledParties((prev) => [newEvent, ...prev]);
  };

  // Synced Control Functions
  const syncPlay = (time) => {
    setIsPlaying(true);
    setCurrentTime(time);
    broadcastSync({
      movie: currentMovie,
      isPlaying: true,
      currentTime: time
    });
  };

  const syncPause = (time) => {
    setIsPlaying(false);
    setCurrentTime(time);
    broadcastSync({
      movie: currentMovie,
      isPlaying: false,
      currentTime: time
    });
  };

  const syncSeek = (time) => {
    setCurrentTime(time);
    broadcastSync({
      movie: currentMovie,
      isPlaying,
      currentTime: time
    });
  };

  const changeMovie = (movieObj) => {
    setCurrentMovie(movieObj);
    setIsPlaying(true);
    setCurrentTime(0);
    broadcastSync({
      movie: movieObj,
      isPlaying: true,
      currentTime: 0
    });
  };

  return (
    <RoomContext.Provider
      value={{
        activeRoom,
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        isMicOn,
        isCamOn,
        isScreenSharing,
        localStream,
        screenStream,
        participants,
        currentMovie,
        isPlaying,
        currentTime,
        playbackRate,
        syncStatus,
        messages,
        scheduledParties,
        demoMovies: DEMO_MOVIES,
        createRoom,
        joinRoom,
        leaveRoom,
        toggleMic,
        toggleCam,
        startScreenShare,
        stopScreenShare,
        sendMessage,
        addScheduledParty,
        syncPlay,
        syncPause,
        syncSeek,
        changeMovie
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
