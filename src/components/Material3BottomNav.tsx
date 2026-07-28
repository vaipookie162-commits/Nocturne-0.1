import React from 'react';
import { motion } from 'framer-motion';
import { M3Tab } from '../types';
import { Disc, Compass, Library, Search, SlidersHorizontal } from 'lucide-react';

interface Material3BottomNavProps {
  activeTab: M3Tab;
  onTabSelect: (tab: M3Tab) => void;
  accentColor: string;
}

export const Material3BottomNav: React.FC<Material3BottomNavProps> = ({
  activeTab,
  onTabSelect,
  accentColor,
}) => {
  const tabs = [
    { id: 'now_playing' as M3Tab, label: 'Playing', Icon: Disc },
    { id: 'discover' as M3Tab, label: 'Discover', Icon: Compass },
    { id: 'library' as M3Tab, label: 'Library', Icon: Library },
    { id: 'search' as M3Tab, label: 'Search', Icon: Search },
    { id: 'equalizer' as M3Tab, label: 'Audio EQ', Icon: SlidersHorizontal },
  ];

  return (
    <nav className="w-full h-[76px] bg-black/60 backdrop-blur-2xl border-t border-white/10 px-2 flex items-center justify-around z-40 relative select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.Icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabSelect(tab.id)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 cursor-pointer group focus:outline-none"
          >
            {/* Material 3 Active Indicator Pill */}
            <div className="relative flex items-center justify-center w-14 h-8 rounded-full my-0.5">
              {isActive && (
                <motion.div
                  layoutId="m3ActivePill"
                  className="absolute inset-0 rounded-full shadow-sm"
                  style={{
                    backgroundColor: accentColor,
                    opacity: 0.28,
                    border: `1px solid ${accentColor}80`,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <IconComponent
                className={`w-5 h-5 transition-transform duration-200 z-10 ${
                  isActive
                    ? 'scale-110 text-white font-bold'
                    : 'text-white/55 group-hover:text-white/80 scale-100'
                }`}
                style={{
                  color: isActive ? '#ffffff' : undefined,
                }}
              />
            </div>

            {/* Material 3 Label */}
            <span
              className={`text-[11px] tracking-tight font-medium transition-colors duration-150 ${
                isActive ? 'text-white font-semibold' : 'text-white/50 group-hover:text-white/80'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
