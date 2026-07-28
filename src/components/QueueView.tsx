import React from 'react';
import { motion } from 'framer-motion';
import { Song } from '../types';
import { ListMusic, Play, GripVertical, X, Sparkles, Check } from 'lucide-react';

interface QueueViewProps {
  currentSong: Song;
  queue: Song[];
  isPlaying: boolean;
  onSelectSong: (song: Song) => void;
  onClose: () => void;
}

export const QueueView: React.FC<QueueViewProps> = ({
  currentSong,
  queue,
  isPlaying,
  onSelectSong,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="absolute inset-0 z-30 bg-black/85 backdrop-blur-2xl flex flex-col p-5 text-white overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
            <ListMusic className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Up Next & Queue</h2>
            <p className="text-xs text-white/60">{queue.length} tracks in queue</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Queue Items */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2 no-scrollbar">
        {/* Playing Now Section */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase mb-2 block">
            Now Playing
          </span>
          <div
            className="flex items-center justify-between p-3 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 to-black/60 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <img
                src={currentSong.albumArt}
                alt=""
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover shadow-md"
              />
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {currentSong.title}
                  <span className="p-1 rounded-full bg-cyan-400/20 text-cyan-300">
                    <Check className="w-3 h-3" />
                  </span>
                </h4>
                <p className="text-xs text-white/60">{currentSong.artist}</p>
              </div>
            </div>

            {/* Beat Equalizer animation */}
            <div className="flex items-end gap-1 h-5 px-2">
              {[0.6, 1, 0.4, 0.8].map((h, i) => (
                <motion.span
                  key={i}
                  animate={{ height: isPlaying ? [4, 18, 6, 20] : 6 }}
                  transition={{
                    duration: 0.6 + i * 0.1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="w-1 bg-cyan-400 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Up Next List */}
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-white/50 uppercase mb-2 block">
            Next Up
          </span>
          <div className="space-y-2">
            {queue
              .filter((s) => s.id !== currentSong.id)
              .map((song) => (
                <div
                  key={song.id}
                  onClick={() => onSelectSong(song)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/12 border border-white/5 hover:border-white/20 transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-white/20 group-hover:text-white/50" />
                    <img
                      src={song.albumArt}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-white/90 group-hover:text-white">
                        {song.title}
                      </h4>
                      <p className="text-[11px] text-white/50">{song.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-white/40">
                      {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                    </span>
                    <button className="p-1.5 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition">
                      <Play className="w-3.5 h-3.5 text-white fill-white" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
