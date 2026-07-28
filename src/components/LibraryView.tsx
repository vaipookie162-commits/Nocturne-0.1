import React from 'react';
import { Song } from '../types';
import { Heart, Music2, FolderHeart, Clock, Play, Plus } from 'lucide-react';

interface LibraryViewProps {
  songs: Song[];
  favorites: string[];
  onToggleFavorite: (songId: string) => void;
  onSelectSong: (song: Song) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  songs,
  favorites,
  onToggleFavorite,
  onSelectSong,
}) => {
  const favoriteSongs = songs.filter((s) => favorites.includes(s.id));

  return (
    <div className="flex-1 overflow-y-auto p-5 text-white space-y-6 no-scrollbar pb-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="text-lg font-extrabold text-white">Your Music Library</h2>
          <p className="text-xs text-white/60">{songs.length} Tracks • {favorites.length} Favorites</p>
        </div>
        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Library Categories Pills */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400">
            <Heart className="w-5 h-5 fill-pink-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Loved Tracks</h4>
            <p className="text-[10px] text-white/50">{favorites.length} saved</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
            <FolderHeart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Playlists</h4>
            <p className="text-[10px] text-white/50">4 custom lists</p>
          </div>
        </div>
      </div>

      {/* All Songs Section */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
          All Offline Tracks
        </h3>
        <div className="space-y-2">
          {songs.map((song) => {
            const isFav = favorites.includes(song.id);

            return (
              <div
                key={song.id}
                onClick={() => onSelectSong(song)}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition cursor-pointer group"
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
                    <p className="text-[11px] text-white/50">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(song.id);
                    }}
                    className={`p-1.5 rounded-full transition ${
                      isFav ? 'text-pink-400 fill-pink-400' : 'text-white/30 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-pink-400' : ''}`} />
                  </button>
                  <button className="p-1.5 rounded-full bg-white/10 group-hover:bg-cyan-400 group-hover:text-black transition">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
