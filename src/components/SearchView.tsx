import React, { useState } from 'react';
import { Song } from '../types';
import { Search, Play, X, Sparkles, Music2 } from 'lucide-react';

interface SearchViewProps {
  songs: Song[];
  onSelectSong: (song: Song) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ songs, onSelectSong }) => {
  const [query, setQuery] = useState('');

  const filtered = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase()) ||
      s.genre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-5 text-white space-y-5 no-scrollbar pb-24">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, genres or Hi-Res..."
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 transition"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {['Hi-Res Lossless', 'Spatial Audio', 'Cyber Synthwave', 'Ambient', 'Lofi Sunset'].map(
          (tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag.split(' ')[0])}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 text-[11px] text-white/80 whitespace-nowrap transition"
            >
              {tag}
            </button>
          )
        )}
      </div>

      {/* Search Results List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>{filtered.length} Results Found</span>
        </div>

        {filtered.map((song) => (
          <div
            key={song.id}
            onClick={() => onSelectSong(song)}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/12 border border-white/5 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <img
                src={song.albumArt}
                alt=""
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">
                  {song.title}
                </h4>
                <p className="text-[11px] text-white/50">{song.artist} • {song.genre}</p>
              </div>
            </div>

            <button className="p-2 rounded-full bg-white/10 group-hover:bg-cyan-400 group-hover:text-black transition">
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
