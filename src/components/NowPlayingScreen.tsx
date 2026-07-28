import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Song, LiquidLensSettings, OutputDevice } from '../types';
import { LiquidGlassLens } from './LiquidGlassLens';
import {
  ChevronDown,
  Heart,
  MoreHorizontal,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic,
  Mic2,
  Sparkles,
  Headphones,
  Sliders,
  Share2,
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface NowPlayingScreenProps {
  song: Song;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentTime: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
  repeatMode: 'off' | 'all' | 'one';
  onToggleRepeat: () => void;
  currentOutputDevice: OutputDevice;
  onOpenOutputSelector: () => void;
  onOpenLyrics: () => void;
  onOpenQueue: () => void;
  lensSettings: LiquidLensSettings;
  onUpdateLensSettings: (settings: Partial<LiquidLensSettings>) => void;
}

export const NowPlayingScreen: React.FC<NowPlayingScreenProps> = ({
  song,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  currentTime,
  onSeek,
  volume,
  onVolumeChange,
  isFavorite,
  onToggleFavorite,
  isShuffle,
  onToggleShuffle,
  repeatMode,
  onToggleRepeat,
  currentOutputDevice,
  onOpenOutputSelector,
  onOpenLyrics,
  onOpenQueue,
  lensSettings,
  onUpdateLensSettings,
}) => {
  const [showTuningOverlay, setShowTuningOverlay] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showShareNotification, setShowShareNotification] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      onVolumeChange(0.7);
    } else {
      setIsMuted(true);
      onVolumeChange(0);
    }
  };

  const handleShare = () => {
    setShowShareNotification(true);
    setTimeout(() => setShowShareNotification(false), 2200);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 text-white select-none relative overflow-y-auto no-scrollbar pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {showShareNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-cyan-400 text-black text-xs font-bold shadow-2xl flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-black" /> Link copied! Ready to share track.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar (Apple Music + Motorola Clean Aesthetic) */}
      <div className="flex items-center justify-between z-10 pt-1 pb-2">
        <button
          onClick={onOpenQueue}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
        >
          <ChevronDown className="w-5 h-5" />
        </button>

        <div className="text-center space-y-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50 block">
            PLAYING FROM ALBUM
          </span>
          <h3 className="text-xs font-bold text-white/90 truncate max-w-[190px]">
            {song.album}
          </h3>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
        >
          <Share2 className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Audio Format Badge Bar (Hi-Res Lossless / Moto Spatial) */}
      <div className="flex justify-center my-1 z-10">
        <button
          onClick={onOpenOutputSelector}
          className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-[10px] font-mono font-medium text-cyan-200 backdrop-blur-md transition flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          {song.hiResFormat}
        </button>
      </div>

      {/* Central Album Artwork with Liquid Glass Lens */}
      <div className="my-auto py-2 z-10">
        <LiquidGlassLens
          song={song}
          isPlaying={isPlaying}
          settings={lensSettings}
          onUpdateSettings={onUpdateLensSettings}
          showTuningOverlay={showTuningOverlay}
          onToggleTuningOverlay={() => setShowTuningOverlay(!showTuningOverlay)}
        />
      </div>

      {/* Song Info Section */}
      <div className="flex items-center justify-between my-2 z-10 px-1">
        <div className="space-y-1 max-w-[75%]">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight truncate">
            {song.title}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-white/70 truncate">
            {song.artist}
          </p>
        </div>

        <button
          onClick={onToggleFavorite}
          className={`p-3 rounded-full transition-all duration-200 ${
            isFavorite
              ? 'bg-pink-500/20 text-pink-500 scale-110'
              : 'bg-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-500' : ''}`} />
        </button>
      </div>

      {/* Scrub / Progress Slider Section */}
      <div className="space-y-1.5 my-2 z-10">
        <div className="relative group flex items-center h-4 cursor-pointer">
          <input
            type="range"
            min="0"
            max={song.duration}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full appearance-none bg-transparent cursor-pointer z-20 focus:outline-none"
            style={{
              WebkitAppearance: 'none',
            }}
          />
          {/* Track background */}
          <div className="absolute inset-x-0 h-1.5 bg-white/20 rounded-full overflow-hidden pointer-events-none">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{
                width: `${(currentTime / song.duration) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="flex justify-between text-[11px] font-mono text-white/60 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>-{formatTime(song.duration - currentTime)}</span>
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="flex items-center justify-between my-2 z-10 px-2">
        {/* Shuffle */}
        <button
          onClick={onToggleShuffle}
          className={`p-2.5 rounded-full transition ${
            isShuffle ? 'text-cyan-400 bg-cyan-500/20' : 'text-white/50 hover:text-white'
          }`}
        >
          <Shuffle className="w-4.5 h-4.5" />
        </button>

        {/* Previous Track */}
        <button
          onClick={onPrev}
          className="p-3 rounded-full text-white hover:bg-white/10 transition active:scale-90"
        >
          <SkipBack className="w-6 h-6 fill-current" />
        </button>

        {/* Play / Pause Main Button */}
        <button
          onClick={onTogglePlay}
          className="relative group p-5 rounded-full bg-white text-black shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
          style={{
            boxShadow: `0 0 30px ${song.glowColor}`,
          }}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 fill-black" />
          ) : (
            <Play className="w-7 h-7 fill-black translate-x-0.5" />
          )}
        </button>

        {/* Next Track */}
        <button
          onClick={onNext}
          className="p-3 rounded-full text-white hover:bg-white/10 transition active:scale-90"
        >
          <SkipForward className="w-6 h-6 fill-current" />
        </button>

        {/* Repeat Mode */}
        <button
          onClick={onToggleRepeat}
          className={`p-2.5 rounded-full transition relative ${
            repeatMode !== 'off' ? 'text-cyan-400 bg-cyan-500/20' : 'text-white/50 hover:text-white'
          }`}
        >
          <Repeat className="w-4.5 h-4.5" />
          {repeatMode === 'one' && (
            <span className="absolute top-1 right-1 text-[9px] font-bold">1</span>
          )}
        </button>
      </div>

      {/* Volume & Output Target Bar */}
      <div className="flex items-center gap-3 my-2 z-10 p-2.5 rounded-2xl bg-white/5 border border-white/10">
        <button onClick={handleVolumeToggle} className="text-white/60 hover:text-white transition">
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-full accent-white bg-white/20 h-1 rounded-lg cursor-pointer"
        />

        {/* Output Device Pill Button */}
        <button
          onClick={onOpenOutputSelector}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-medium text-white/90 whitespace-nowrap transition cursor-pointer"
        >
          <Headphones className="w-3.5 h-3.5 text-cyan-300" />
          <span className="truncate max-w-[90px]">{currentOutputDevice.name}</span>
        </button>
      </div>

      {/* Bottom Action Quick Buttons (Lyrics, Queue, Lens Optics) */}
      <div className="flex items-center justify-around z-10 pt-1 border-t border-white/10">
        <button
          onClick={onOpenLyrics}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-medium text-white/80 transition cursor-pointer"
        >
          <Mic2 className="w-4 h-4 text-pink-400" />
          <span>Lyrics</span>
        </button>

        <button
          onClick={() => setShowTuningOverlay(!showTuningOverlay)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-medium text-white/80 transition cursor-pointer"
        >
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Optics</span>
        </button>

        <button
          onClick={onOpenQueue}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-medium text-white/80 transition cursor-pointer"
        >
          <ListMusic className="w-4 h-4 text-purple-400" />
          <span>Up Next</span>
        </button>
      </div>
    </div>
  );
};
