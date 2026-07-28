import { Song } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;
  private currentSong: Song | null = null;
  private noteStep: number = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 64; // For 32 frequency bands

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
        this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) { // 0 to 1
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.05);
    }
  }

  public playSong(song: Song) {
    this.initContext();
    this.currentSong = song;
    this.isPlaying = true;

    if (this.intervalId) clearInterval(this.intervalId);

    // Play synthesized musical pattern
    this.noteStep = 0;
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.triggerNextNote();
      }
    }, 280); // ~107 BPM rhythmic pulses
  }

  public pause() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public resume() {
    if (this.currentSong) {
      this.isPlaying = true;
      if (!this.intervalId) {
        this.intervalId = setInterval(() => {
          if (this.isPlaying) {
            this.triggerNextNote();
          }
        }, 280);
      }
    }
  }

  private triggerNextNote() {
    if (!this.ctx || !this.masterGain || !this.currentSong) return;

    const baseFreq = this.currentSong.synthBaseFreq || 220;
    // Scale intervals: Root, Minor 3rd, 4th, 5th, Minor 7th, Octave
    const scale = [1, 1.2, 1.333, 1.5, 1.777, 2, 2.4, 2.666];
    const scaleIndex = (this.noteStep % 8);
    const freq = baseFreq * scale[scaleIndex];

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Set oscillator waveform based on synthMood
      if (this.currentSong.synthMood === 'synthwave') {
        osc.type = 'sawtooth';
      } else if (this.currentSong.synthMood === 'ambient') {
        osc.type = 'sine';
      } else if (this.currentSong.synthMood === 'lofi') {
        osc.type = 'triangle';
      } else {
        osc.type = 'square';
      }

      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Low pass filter for soft analog feel
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 + (scaleIndex * 300), this.ctx.currentTime);

      // Envelope
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);

      // Add sub-bass beat on 1st and 5th steps
      if (this.noteStep % 4 === 0) {
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(baseFreq * 0.5, this.ctx.currentTime);

        subGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

        subOsc.connect(subGain);
        subGain.connect(this.masterGain);

        subOsc.start();
        subOsc.stop(this.ctx.currentTime + 0.35);
      }

      this.noteStep++;
    } catch (e) {
      console.warn('Audio synthesis note error:', e);
    }
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const audioEngine = new AudioEngine();
