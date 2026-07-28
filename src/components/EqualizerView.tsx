import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { EqualizerPreset } from '../types';
import { EQUALIZER_PRESETS } from '../data/mockSongs';
import { SlidersHorizontal, Volume2, Sparkles, Radio, Check } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface EqualizerViewProps {
  currentPreset: EqualizerPreset;
  onSelectPreset: (preset: EqualizerPreset) => void;
  isPlaying: boolean;
  accentColor: string;
}

export const EqualizerView: React.FC<EqualizerViewProps> = ({
  currentPreset,
  onSelectPreset,
  isPlaying,
  accentColor,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Real-time canvas spectrum renderer
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const data = audioEngine.getFrequencyData();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / 24) - 2;
      let x = 0;

      for (let i = 0; i < 24; i++) {
        const value = isPlaying ? (data[i] || Math.sin(Date.now() / 200 + i) * 30 + 50) : 10;
        const barHeight = (value / 255) * canvas.height;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, accentColor);
        grad.addColorStop(1, '#38bdf8');

        ctx.fillStyle = grad;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 2;
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, accentColor]);

  const bands = ['60Hz', '230Hz', '910Hz', '3.6kHz', '14kHz'];

  return (
    <div className="flex-1 overflow-y-auto p-5 text-white flex flex-col justify-between space-y-6 no-scrollbar pb-24">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Moto Audio & EQ
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                Dolby Atmos
              </span>
            </h2>
            <p className="text-xs text-white/60">3D Spatial sound engine tuning</p>
          </div>
        </div>
      </div>

      {/* Real-time Spectrum Visualizer Canvas */}
      <div className="p-4 rounded-3xl bg-black/60 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Spectrum Analyzer
          </span>
          <span className="text-[10px] text-white/50 font-mono">24-bit / 192kHz</span>
        </div>
        <canvas
          ref={canvasRef}
          width={320}
          height={65}
          className="w-full h-[65px] rounded-xl"
        />
      </div>

      {/* Preset Selector */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-white/50 block mb-2.5">
          Audio Presets
        </span>
        <div className="grid grid-cols-2 gap-2">
          {EQUALIZER_PRESETS.map((preset) => {
            const isSelected = currentPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-400 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{preset.name}</span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/50">
                  {preset.spatialAudio && <span className="text-cyan-300">Spatial</span>}
                  {preset.vocalEnhance && <span>• Vocal Boost</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Graphic Equalizer Sliders */}
      <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/60 block">
          5-Band Frequency Response (dB)
        </span>
        <div className="flex items-end justify-between h-36 px-2 pt-4">
          {bands.map((freqLabel, idx) => {
            const gainVal = currentPreset.bands[idx] || 0;
            return (
              <div key={freqLabel} className="flex flex-col items-center gap-2 h-full justify-between">
                <span className="text-[10px] font-mono text-cyan-300">{gainVal > 0 ? `+${gainVal}` : gainVal}dB</span>
                <div className="relative h-24 w-2 flex items-center justify-center">
                  <div className="absolute inset-y-0 w-1.5 rounded-full bg-white/20" />
                  <motion.div
                    animate={{
                      height: `${((gainVal + 12) / 24) * 100}%`,
                    }}
                    className="absolute bottom-0 w-1.5 rounded-full bg-cyan-400"
                  />
                  <motion.div
                    animate={{
                      bottom: `${((gainVal + 12) / 24) * 100}%`,
                    }}
                    className="absolute -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-md border border-cyan-400"
                  />
                </div>
                <span className="text-[10px] font-mono text-white/60">{freqLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Moto Bass Boost & Spatial Sound Switches */}
      <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-300" />
            <span className="text-xs font-semibold text-white">Moto Bass Enhancer</span>
          </div>
          <span className="text-xs font-mono text-cyan-300 font-bold">
            {currentPreset.motoBassBoost}%
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-semibold text-white">3D Head Tracking Spatial</span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${currentPreset.spatialAudio ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/50'}`}>
            {currentPreset.spatialAudio ? 'ENABLED' : 'OFF'}
          </span>
        </div>
      </div>
    </div>
  );
};
