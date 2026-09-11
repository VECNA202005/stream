'use client';

import React, { useState } from 'react';
import { X, Maximize2, Share2, Check, Video, ExternalLink } from 'lucide-react';

export const JitsiModal = ({ event, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  // Sanitize event title & ID to create a clean Jitsi meeting room name
  const sanitizedRoomName = `CloudDiary-${event.id || 'room'}-${(event.title || 'Meeting').replace(/[^a-zA-Z0-9]/g, '')}`;
  const jitsiUrl = `https://meet.jit.si/${sanitizedRoomName}#config.prejoinPageEnabled=false&userInfo.displayName="User"`;

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(`https://meet.jit.si/${sanitizedRoomName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[85vh] glass-card flex flex-col overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Video size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {event.title}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
                  LIVE MEETING
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Jitsi Room: <code className="text-cyan-400">{sanitizedRoomName}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyMeetingLink}
              className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>

            <a
              href={`https://meet.jit.si/${sanitizedRoomName}`}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border border-cyan-500/30"
            >
              <ExternalLink size={14} /> Open in Tab
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors ml-2"
              title="Close Meeting"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Embedded Jitsi Meeting Iframe */}
        <div className="flex-1 bg-black relative">
          <iframe
            src={jitsiUrl}
            allow="camera; microphone; display-capture; autoplay; clipboard-write"
            className="w-full h-full border-0"
            title={`Jitsi Meeting: ${event.title}`}
          />
        </div>
      </div>
    </div>
  );
};
