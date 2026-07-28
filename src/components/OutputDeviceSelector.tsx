import React from 'react';
import { motion } from 'framer-motion';
import { OutputDevice } from '../types';
import { Headphones, Smartphone, Speaker, Cable, Check, X, BatteryCharging } from 'lucide-react';

interface OutputDeviceSelectorProps {
  devices: OutputDevice[];
  currentDevice: OutputDevice;
  onSelectDevice: (device: OutputDevice) => void;
  onClose: () => void;
}

export const OutputDeviceSelector: React.FC<OutputDeviceSelectorProps> = ({
  devices,
  currentDevice,
  onSelectDevice,
  onClose,
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'bluetooth':
        return Headphones;
      case 'airplay':
        return Speaker;
      case 'dac':
        return Cable;
      default:
        return Smartphone;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="absolute inset-0 z-40 bg-black/85 backdrop-blur-2xl flex flex-col justify-end p-5 text-white"
    >
      <div className="bg-slate-900/90 border border-white/20 rounded-3xl p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white">Audio Output & AirPlay</h3>
            <p className="text-xs text-white/60">Choose active playback target</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {devices.map((device) => {
            const isSelected = device.id === currentDevice.id;
            const IconComponent = getIcon(device.type);

            return (
              <button
                key={device.id}
                onClick={() => {
                  onSelectDevice(device);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isSelected ? 'bg-cyan-400 text-black' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      {device.name}
                      {device.batteryLevel !== undefined && (
                        <span className="text-[10px] text-white/50 flex items-center gap-0.5 font-mono">
                          <BatteryCharging className="w-3 h-3 text-emerald-400" />
                          {device.batteryLevel}%
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-white/50">{device.formatSupport}</p>
                  </div>
                </div>

                {isSelected && (
                  <span className="p-1 rounded-full bg-cyan-400 text-black">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
