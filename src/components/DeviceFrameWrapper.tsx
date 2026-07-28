import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Sparkles, Volume2, ShieldCheck } from 'lucide-react';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
  songTitle?: string;
  artistName?: string;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  children,
  songTitle,
  artistName,
}) => {
  const [isFrameEnabled, setIsFrameEnabled] = useState(true);
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-between p-2 sm:p-6 font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Top Bar / Controls Bar */}
      <header className="w-full max-w-xl flex items-center justify-between py-2 px-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-3 shadow-xl z-50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
            Aura <span className="text-cyan-400">Liquid Glass</span> Music
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFrameEnabled(!isFrameEnabled)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white/90 font-medium transition cursor-pointer"
          >
            {isFrameEnabled ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Viewport Mode</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-pink-300" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex items-center justify-center relative">
        {isFrameEnabled ? (
          /* Phone Frame Container (Motorola Edge / iPhone Pro modern design, aspect 9:16) */
          <div className="relative w-full max-w-[400px] h-[830px] rounded-[52px] bg-black p-3.5 border-[5px] border-slate-800/90 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden ring-1 ring-white/20 my-auto">
            {/* Phone Screen Notch / Punch-hole Camera */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full border border-white/10 z-50 flex items-center justify-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
            </div>

            {/* Status Bar */}
            <div className="w-full h-8 px-6 pt-1 flex items-center justify-between text-[11px] font-mono text-white/90 z-40 select-none pointer-events-none">
              <span>{time || '09:41'}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  Hi-Res
                </span>
                <Wifi className="w-3.5 h-3.5 text-white/80" />
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Screen Content Wrapper */}
            <div className="relative flex-1 w-full h-full rounded-[42px] overflow-hidden flex flex-col bg-slate-950">
              {children}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="w-full h-4 flex items-center justify-center pt-1 pointer-events-none z-50">
              <div className="w-32 h-1 bg-white/40 rounded-full" />
            </div>
          </div>
        ) : (
          /* Full Viewport Container */
          <div className="w-full max-w-2xl h-[820px] rounded-3xl bg-black border border-white/10 shadow-2xl flex flex-col overflow-hidden relative my-auto">
            {children}
          </div>
        )}
      </main>

      {/* Footer Instructions */}
      <footer className="w-full max-w-xl pt-3 text-center text-[11px] text-white/40 font-mono flex items-center justify-between">
        <span>Figma & Dribbble Style Mobile Music UI</span>
        <span className="flex items-center gap-1 text-cyan-400">
          <Sparkles className="w-3 h-3" /> Interactive 3D Liquid Refraction
        </span>
      </footer>
    </div>
  );
};
