import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Song } from '../types';
import { Sparkles, Mic2, X } from 'lucide-react';

interface LyricsViewProps {
  song: Song;
  currentTime: number;
  onSeek: (seconds: number) => void;
  onClose: () => void;
}

export const LyricsView: React.FC<LyricsViewProps> = ({
  song,
  currentTime,
  onSeek,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine active lyric index
  let activeIndex = -1;
  for (let i = 0; i < song.lyrics.length; i++) {
    if (currentTime >= song.lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Auto scroll to active lyric line
  useEffect(() => {
    if (activeIndex >= 0 && containerRef.current) {
      const activeEl = containerRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="absolute inset-0 z-30 bg-black/80 backdrop-blur-2xl flex flex-col p-6 text-white overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300">
            <Mic2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Live Synced Lyrics</h2>
            <p className="text-xs text-white/60">{song.title} — {song.artist}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Lyrics Scrollable List */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto py-12 space-y-8 no-scrollbar pr-2 my-auto"
      >
        {song.lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPast = idx < activeIndex;

          return (
            <motion.div
              key={line.id}
              onClick={() => onSeek(line.time)}
              animate={{
                scale: isActive ? 1.05 : 0.98,
                opacity: isActive ? 1 : isPast ? 0.45 : 0.25,
              }}
              transition={{ duration: 0.3 }}
              className={`cursor-pointer transition-all p-2 rounded-2xl ${
                isActive ? 'bg-white/10 border border-white/20 shadow-lg' : 'hover:opacity-75'
              }`}
            >
              <p
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight ${
                  isActive ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]' : 'text-white/70'
                }`}
                style={{
                  color: isActive ? song.accentColor : undefined,
                }}
              >
                {line.text}
              </p>
              {isActive && (
                <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-white/60">
                  <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                  <span>Tap to jump to {Math.floor(line.time / 60)}:{(line.time % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-3 text-center text-xs text-white/40 border-t border-white/10 flex items-center justify-between">
        <span>Powered by Aura LyricSync</span>
        <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-white/70 font-mono">
          {song.hiResFormat}
        </span>
      </div>
    </motion.div>
  );
};
