import React from 'react';
import { Song } from '../types';
import { Play, Flame, Sparkles, Radio, Headphones } from 'lucide-react';

interface DiscoverViewProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
  accentColor: string;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  songs,
  onSelectSong,
  accentColor,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-5 text-white space-y-6 no-scrollbar pb-24">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            Discover & Radar
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          </h2>
          <p className="text-xs text-white/60">Curated in Lossless & Moto Spatial Audio</p>
        </div>
      </div>

      {/* Featured Liquid Hero Card */}
      <div
        onClick={() => onSelectSong(songs[0])}
        className="relative rounded-3xl overflow-hidden p-5 border border-white/20 shadow-2xl cursor-pointer group"
        style={{
          background: `linear-gradient(135deg, ${accentColor}80 0%, #090d16 100%)`,
        }}
      >
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1 max-w-[65%]">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider text-white">
              Featured Track
            </span>
            <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition">
              {songs[0].title}
            </h3>
            <p className="text-xs text-white/80">{songs[0].artist}</p>
            <p className="text-[10px] font-mono text-cyan-200 pt-1">{songs[0].hiResFormat}</p>
          </div>
          <div className="relative">
            <img
              src={songs[0].albumArt}
              alt=""
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover shadow-2xl border border-white/30 group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Trending Now Horizontal Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" /> Trending Spatials
          </h3>
          <span className="text-xs text-cyan-400 font-medium">See All</span>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {songs.map((song) => (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="min-w-[140px] p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition cursor-pointer group"
            >
              <img
                src={song.albumArt}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full aspect-square rounded-xl object-cover mb-2 group-hover:scale-105 transition shadow-lg"
              />
              <h4 className="text-xs font-bold text-white truncate">{song.title}</h4>
              <p className="text-[11px] text-white/60 truncate">{song.artist}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Genre Stations Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-1.5">
          <Radio className="w-4 h-4 text-purple-400" /> Live Aura Stations
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { name: 'Ambient Chillwave', icon: Headphones, color: 'from-cyan-900/60 to-blue-950' },
            { name: 'Synthwave Odyssey', icon: Flame, color: 'from-pink-900/60 to-purple-950' },
            { name: 'Acoustic Sunset', icon: Sparkles, color: 'from-orange-900/60 to-amber-950' },
            { name: 'Hi-Res Jazz Room', icon: Radio, color: 'from-emerald-900/60 to-teal-950' },
          ].map((station, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl bg-gradient-to-br ${station.color} border border-white/10 hover:border-white/30 transition cursor-pointer flex flex-col justify-between h-20`}
            >
              <span className="text-xs font-bold text-white">{station.name}</span>
              <span className="text-[10px] text-white/50 flex items-center gap-1">
                <station.icon className="w-3 h-3 text-cyan-300" /> Live Stream
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
