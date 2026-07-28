export interface LyricLine {
  id: string;
  time: number; // in seconds
  text: string;
  translation?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  albumArt: string;
  accentColor: string; // e.g. '#ec4899' or '#3b82f6'
  glowColor: string;   // e.g. 'rgba(236,72,153,0.4)'
  secondaryColor: string;
  hiResFormat: string; // e.g. "24-bit / 192kHz Hi-Res Lossless"
  isSpatialAudio: boolean;
  year: number;
  genre: string;
  lyrics: LyricLine[];
  synthBaseFreq: number; // for Web Audio API tone synthesis
  synthMood: 'synthwave' | 'ambient' | 'lofi' | 'electronic' | 'pop';
}

export type M3Tab = 'now_playing' | 'discover' | 'library' | 'search' | 'equalizer';

export interface LiquidLensSettings {
  refractionPower: number;    // 10 - 100
  magnification: number;      // 1.0 - 1.8
  liquidRippleIntensity: number; // 0 - 100
  lensShape: 'circle' | 'squircle' | 'teardrop' | 'hex';
  glossOpacity: number;       // 0.2 - 0.9
  tilt3D: boolean;
  dispersion: number;         // 0 - 50
  waterDroplets: boolean;     // show miniature ambient droplets on glass
}

export interface OutputDevice {
  id: string;
  name: string;
  type: 'device' | 'bluetooth' | 'airplay' | 'dac';
  iconName: string;
  batteryLevel?: number;
  formatSupport: string;
  isCurrent?: boolean;
}

export interface EqualizerPreset {
  id: string;
  name: string;
  bands: number[]; // 5 band values -12 to +12 dB
  motoBassBoost: number; // 0 - 100
  vocalEnhance: boolean;
  spatialAudio: boolean;
}
