import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Song, LiquidLensSettings } from '../types';
import { Sparkles, Layers, Sliders, Droplet, Eye, RotateCcw } from 'lucide-react';

interface LiquidGlassLensProps {
  song: Song;
  isPlaying: boolean;
  settings: LiquidLensSettings;
  onUpdateSettings?: (newSettings: Partial<LiquidLensSettings>) => void;
  showTuningOverlay?: boolean;
  onToggleTuningOverlay?: () => void;
}

interface TouchRipple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const LiquidGlassLens: React.FC<LiquidGlassLensProps> = ({
  song,
  isPlaying,
  settings,
  onUpdateSettings,
  showTuningOverlay = false,
  onToggleTuningOverlay,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number; glossX: number; glossY: number }>({
    rotateX: 0,
    rotateY: 0,
    glossX: 50,
    glossY: 50,
  });
  const [ripples, setRipples] = useState<TouchRipple[]>([]);
  const rippleIdRef = useRef(0);

  // Mouse / Touch movement for 3D Tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!settings.tilt3D || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 16; // max 16deg Y
    const rotateX = -((y - centerY) / centerY) * 16; // max 16deg X

    const glossX = (x / rect.width) * 100;
    const glossY = (y / rect.height) * 100;

    setTilt({ rotateX, rotateY, glossX, glossY });
  };

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glossX: 30, glossY: 30 });
  };

  // Add touch ripple on tap
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: TouchRipple = {
      id: rippleIdRef.current++,
      x,
      y,
      size: Math.min(rect.width, rect.height) * 0.8,
    };

    setRipples((prev) => [...prev.slice(-3), newRipple]); // keep max 4
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  // Shape class assignment
  const shapeClass = {
    circle: 'rounded-full',
    squircle: 'rounded-[42px]',
    teardrop: 'rounded-[48px] rounded-tl-[12px]',
    hex: 'rounded-[32px] polygon-hex',
  }[settings.lensShape];

  return (
    <div className="relative w-full max-w-[340px] aspect-square mx-auto my-2 select-none perspective-1000">
      {/* SVG Liquid Refraction Filter */}
      <svg className="absolute w-0 h-0 invisible pointer-events-none">
        <defs>
          <filter id="liquidRefractionFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={0.015 + settings.refractionPower * 0.0003}
              numOctaves="2"
              result="noise"
            >
              {isPlaying && (
                <animate
                  attributeName="baseFrequency"
                  dur="8s"
                  values={`${0.015 + settings.refractionPower * 0.0002};${0.022 + settings.refractionPower * 0.0003};${0.015 + settings.refractionPower * 0.0002}`}
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={settings.refractionPower * 0.28}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>

      {/* Dynamic Ambient Under-Glow Shadow */}
      <motion.div
        animate={{
          scale: isPlaying ? [1, 1.08, 1] : 1,
          opacity: isPlaying ? [0.65, 0.85, 0.65] : 0.5,
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${song.glowColor} 0%, ${song.accentColor}40 50%, transparent 80%)`,
          filter: 'blur(36px)',
        }}
        className="absolute -inset-4 rounded-full pointer-events-none z-0"
      />

      {/* Main Interactive 3D Liquid Lens Container */}
      <motion.div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          scale: isPlaying ? 1.01 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 22,
        }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative w-full h-full cursor-pointer z-10 shadow-2xl ${shapeClass} overflow-hidden group border border-white/20`}
      >
        {/* Base Album Artwork Image */}
        <img
          src={song.albumArt}
          alt={song.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover rounded-[inherit] scale-100 transition-transform duration-700 ease-out"
        />

        {/* Central Magnified Liquid Lens Layer */}
        <div
          style={{
            filter: 'url(#liquidRefractionFilter)',
            transform: `scale(${settings.magnification})`,
          }}
          className="absolute inset-0 w-full h-full pointer-events-none rounded-[inherit] opacity-95 transition-all duration-300"
        >
          <img
            src={song.albumArt}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-[inherit]"
          />
        </div>

        {/* Liquid Glass Surface Shimmer & Gloss Gradient */}
        <div
          style={{
            background: `radial-gradient(circle at ${tilt.glossX}% ${tilt.glossY}%, rgba(255,255,255,${settings.glossOpacity}) 0%, rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.3) 100%)`,
          }}
          className="absolute inset-0 pointer-events-none mix-blend-overlay transition-all duration-150 rounded-[inherit]"
        />

        {/* Convex Glass Light Rim & Metallic Edge Trim (Motorola Style) */}
        <div className="absolute inset-0 rounded-[inherit] border-[2px] border-white/30 shadow-[inset_0_2px_12px_rgba(255,255,255,0.5),inset_0_-2px_12px_rgba(0,0,0,0.6)] pointer-events-none" />

        {/* Water Droplets Micro-Magnifiers on Glass */}
        {settings.waterDroplets && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
            {/* Droplet 1 */}
            <div
              className="absolute w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-md top-[22%] left-[28%]"
              style={{
                boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1.5 left-2 opacity-90" />
            </div>
            {/* Droplet 2 */}
            <div
              className="absolute w-5 h-5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 shadow-sm bottom-[32%] right-[24%]"
              style={{
                boxShadow: 'inset 1.5px 1.5px 3px rgba(255,255,255,0.8), inset -1.5px -1.5px 3px rgba(0,0,0,0.4)',
              }}
            >
              <div className="w-1 h-1 bg-white rounded-full absolute top-1 left-1 opacity-80" />
            </div>
            {/* Droplet 3 (Tiny) */}
            <div className="absolute w-3 h-3 rounded-full bg-white/30 backdrop-blur-sm border border-white/50 top-[65%] left-[20%]" />
          </div>
        )}

        {/* Touch Liquid Ripple Animations */}
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            style={{
              top: r.y - r.size / 2,
              left: r.x - r.size / 2,
              width: r.size,
              height: r.size,
              background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)',
              border: '1.5px solid rgba(255,255,255,0.6)',
            }}
            className="absolute rounded-full pointer-events-none mix-blend-screen"
          />
        ))}

        {/* Interactive Corner Badge: Liquid Glass Customizer Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleTuningOverlay) onToggleTuningOverlay();
          }}
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 backdrop-blur-md border border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg group-hover:opacity-100 opacity-80 z-20 flex items-center gap-1.5 text-xs font-medium"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          <span className="hidden sm:inline">Liquid Lens</span>
        </button>
      </motion.div>

      {/* Floating Tuning Overlay Modal */}
      <AnimatePresence>
        {showTuningOverlay && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="absolute top-0 inset-x-0 bottom-0 z-30 p-4 rounded-[36px] bg-black/85 backdrop-blur-xl border border-white/20 text-white flex flex-col justify-between shadow-2xl overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold tracking-wide">Liquid Glass Controls</h3>
              </div>
              <button
                onClick={onToggleTuningOverlay}
                className="text-xs px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white/90 font-medium transition"
              >
                Done
              </button>
            </div>

            {/* Slider Controls */}
            <div className="space-y-3.5 my-auto text-xs">
              {/* Refraction Power */}
              <div>
                <div className="flex justify-between mb-1 text-white/70">
                  <span>Refraction Index</span>
                  <span className="font-mono text-cyan-300">{settings.refractionPower}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.refractionPower}
                  onChange={(e) => onUpdateSettings?.({ refractionPower: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-white/20 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Magnification */}
              <div>
                <div className="flex justify-between mb-1 text-white/70">
                  <span>Magnification Zoom</span>
                  <span className="font-mono text-cyan-300">{settings.magnification.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="1.6"
                  step="0.05"
                  value={settings.magnification}
                  onChange={(e) => onUpdateSettings?.({ magnification: Number(e.target.value) })}
                  className="w-full accent-cyan-400 bg-white/20 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Lens Shape Selector */}
              <div>
                <span className="block text-white/70 mb-1.5">Glass Lens Cut Shape</span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['squircle', 'circle', 'teardrop', 'hex'] as const).map((shape) => (
                    <button
                      key={shape}
                      onClick={() => onUpdateSettings?.({ lensShape: shape })}
                      className={`py-1.5 px-2 rounded-xl border text-[11px] capitalize transition-all ${
                        settings.lensShape === shape
                          ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-semibold'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gloss & Water Droplets Toggles */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-white/70">Water Droplet Magnifiers</span>
                <button
                  onClick={() => onUpdateSettings?.({ waterDroplets: !settings.waterDroplets })}
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                    settings.waterDroplets ? 'bg-cyan-500 justify-end' : 'bg-white/20 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/70">3D Gyro / Touch Tilt</span>
                <button
                  onClick={() => onUpdateSettings?.({ tilt3D: !settings.tilt3D })}
                  className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                    settings.tilt3D ? 'bg-cyan-500 justify-end' : 'bg-white/20 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-white shadow" />
                </button>
              </div>
            </div>

            <button
              onClick={() =>
                onUpdateSettings?.({
                  refractionPower: 55,
                  magnification: 1.18,
                  lensShape: 'squircle',
                  waterDroplets: true,
                  tilt3D: true,
                  glossOpacity: 0.55,
                })
              }
              className="mt-2 text-[11px] text-white/50 hover:text-white flex items-center justify-center gap-1 py-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Optics Defaults
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
