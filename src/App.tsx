import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_SONGS, EQUALIZER_PRESETS, MOCK_OUTPUT_DEVICES } from './data/mockSongs';
import { Song, M3Tab, LiquidLensSettings, OutputDevice, EqualizerPreset } from './types';
import { DeviceFrameWrapper } from './components/DeviceFrameWrapper';
import { NowPlayingScreen } from './components/NowPlayingScreen';
import { Material3BottomNav } from './components/Material3BottomNav';
import { DiscoverView } from './components/DiscoverView';
import { LibraryView } from './components/LibraryView';
import { SearchView } from './components/SearchView';
import { EqualizerView } from './components/EqualizerView';
import { LyricsView } from './components/LyricsView';
import { QueueView } from './components/QueueView';
import { OutputDeviceSelector } from './components/OutputDeviceSelector';
import { audioEngine } from './utils/audioEngine';
import { Play, Pause, SkipForward, Disc } from 'lucide-react';

export default function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const currentSong = MOCK_SONGS[currentSongIndex];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);

  const [activeTab, setActiveTab] = useState<M3Tab>('now_playing');
  const [favorites, setFavorites] = useState<string[]>(['song-1', 'song-2']);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  // Active Output Device
  const [currentOutputDevice, setCurrentOutputDevice] = useState<OutputDevice>(
    MOCK_OUTPUT_DEVICES[0]
  );
  const [showOutputSelector, setShowOutputSelector] = useState(false);

  // Active Equalizer Preset
  const [currentPreset, setCurrentPreset] = useState<EqualizerPreset>(
    EQUALIZER_PRESETS[0]
  );

  // Overlays
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  // Liquid Lens Settings
  const [lensSettings, setLensSettings] = useState<LiquidLensSettings>({
    refractionPower: 55,
    magnification: 1.18,
    liquidRippleIntensity: 70,
    lensShape: 'squircle',
    glossOpacity: 0.55,
    tilt3D: true,
    dispersion: 20,
    waterDroplets: true,
  });

  // Playback timer & audioEngine sync
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.duration) {
            handleNextSong();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSongIndex, currentSong.duration]);

  // Handle Play/Pause
  const handleTogglePlay = () => {
    if (!isPlaying) {
      audioEngine.playSong(currentSong);
      setIsPlaying(true);
    } else {
      audioEngine.pause();
      setIsPlaying(false);
    }
  };

  // Switch Track
  const handleSelectSong = (song: Song) => {
    const idx = MOCK_SONGS.findIndex((s) => s.id === song.id);
    if (idx !== -1) {
      setCurrentSongIndex(idx);
      setCurrentTime(0);
      setIsPlaying(true);
      audioEngine.playSong(song);
      setActiveTab('now_playing');
    }
  };

  const handleNextSong = () => {
    let nextIdx = (currentSongIndex + 1) % MOCK_SONGS.length;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * MOCK_SONGS.length);
    }
    setCurrentSongIndex(nextIdx);
    setCurrentTime(0);
    setIsPlaying(true);
    audioEngine.playSong(MOCK_SONGS[nextIdx]);
  };

  const handlePrevSong = () => {
    const prevIdx = (currentSongIndex - 1 + MOCK_SONGS.length) % MOCK_SONGS.length;
    setCurrentSongIndex(prevIdx);
    setCurrentTime(0);
    setIsPlaying(true);
    audioEngine.playSong(MOCK_SONGS[prevIdx]);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioEngine.setVolume(newVol);
  };

  const handleToggleFavorite = (id: string = currentSong.id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const updateLensSettings = (newVal: Partial<LiquidLensSettings>) => {
    setLensSettings((prev) => ({ ...prev, ...newVal }));
  };

  return (
    <DeviceFrameWrapper songTitle={currentSong.title} artistName={currentSong.artist}>
      {/* Dynamic Ambient Background Glow Canvas */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Primary Ambient Sphere */}
        <motion.div
          animate={{
            scale: isPlaying ? [1, 1.25, 1] : 1,
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: `radial-gradient(circle at 30% 20%, ${currentSong.glowColor} 0%, transparent 70%)`,
          }}
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full blur-[80px]"
        />

        {/* Secondary Ambient Accent Blob */}
        <motion.div
          animate={{
            scale: isPlaying ? [1.2, 1, 1.2] : 1,
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background: `radial-gradient(circle at 70% 80%, ${currentSong.secondaryColor}60 0%, transparent 65%)`,
          }}
          className="absolute -bottom-20 -right-20 w-[450px] h-[450px] rounded-full blur-[90px]"
        />

        {/* Dark Mesh Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      {/* Mini Player Bar (Visible on Secondary Tabs) */}
      {activeTab !== 'now_playing' && (
        <div
          onClick={() => setActiveTab('now_playing')}
          className="relative z-30 mx-3 my-2 p-2.5 rounded-2xl bg-black/70 border border-white/20 backdrop-blur-xl flex items-center justify-between cursor-pointer shadow-xl group hover:border-white/40 transition"
        >
          <div className="flex items-center gap-3 truncate">
            <img
              src={currentSong.albumArt}
              alt=""
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover shadow-md group-hover:scale-105 transition"
            />
            <div className="truncate">
              <h4 className="text-xs font-bold text-white truncate">{currentSong.title}</h4>
              <p className="text-[10px] text-white/60 truncate">{currentSong.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePlay();
              }}
              className="p-2 rounded-full bg-white text-black hover:scale-105 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextSong();
              }}
              className="p-2 text-white/70 hover:text-white"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* Main Screen Content View */}
      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'now_playing' && (
            <motion.div
              key="now_playing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              <NowPlayingScreen
                song={currentSong}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                onNext={handleNextSong}
                onPrev={handlePrevSong}
                currentTime={currentTime}
                onSeek={(time) => setCurrentTime(time)}
                volume={volume}
                onVolumeChange={handleVolumeChange}
                isFavorite={favorites.includes(currentSong.id)}
                onToggleFavorite={() => handleToggleFavorite(currentSong.id)}
                isShuffle={isShuffle}
                onToggleShuffle={() => setIsShuffle(!isShuffle)}
                repeatMode={repeatMode}
                onToggleRepeat={() =>
                  setRepeatMode((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))
                }
                currentOutputDevice={currentOutputDevice}
                onOpenOutputSelector={() => setShowOutputSelector(true)}
                onOpenLyrics={() => setShowLyrics(true)}
                onOpenQueue={() => setShowQueue(true)}
                lensSettings={lensSettings}
                onUpdateLensSettings={updateLensSettings}
              />
            </motion.div>
          )}

          {activeTab === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <DiscoverView
                songs={MOCK_SONGS}
                onSelectSong={handleSelectSong}
                accentColor={currentSong.accentColor}
              />
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <LibraryView
                songs={MOCK_SONGS}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectSong={handleSelectSong}
              />
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <SearchView songs={MOCK_SONGS} onSelectSong={handleSelectSong} />
            </motion.div>
          )}

          {activeTab === 'equalizer' && (
            <motion.div
              key="equalizer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <EqualizerView
                currentPreset={currentPreset}
                onSelectPreset={(p) => setCurrentPreset(p)}
                isPlaying={isPlaying}
                accentColor={currentSong.accentColor}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Overlays */}
        <AnimatePresence>
          {showLyrics && (
            <LyricsView
              song={currentSong}
              currentTime={currentTime}
              onSeek={(s) => setCurrentTime(s)}
              onClose={() => setShowLyrics(false)}
            />
          )}

          {showQueue && (
            <QueueView
              currentSong={currentSong}
              queue={MOCK_SONGS}
              isPlaying={isPlaying}
              onSelectSong={handleSelectSong}
              onClose={() => setShowQueue(false)}
            />
          )}

          {showOutputSelector && (
            <OutputDeviceSelector
              devices={MOCK_OUTPUT_DEVICES}
              currentDevice={currentOutputDevice}
              onSelectDevice={(d) => setCurrentOutputDevice(d)}
              onClose={() => setShowOutputSelector(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Google Material 3 Bottom Navigation Bar */}
      <Material3BottomNav
        activeTab={activeTab}
        onTabSelect={(tab) => setActiveTab(tab)}
        accentColor={currentSong.accentColor}
      />
    </DeviceFrameWrapper>
  );
}
