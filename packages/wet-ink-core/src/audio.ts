/**
 * Procedural Web Audio Nib-on-Paper Acoustic Synthesizer
 * 
 * Generates tactile, physical nib friction sounds in real time based on:
 * - Stroke velocity (faster = higher frequency noise & louder)
 * - Stylus pressure (higher = deeper friction resonance)
 * - Paper roughness (rough paper = more granular friction peaks)
 * 
 * 100% procedural: Zero external audio files, zero network requests, 0 latency.
 */

export class PenAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;

  constructor(muted: boolean = false) {
    this.isMuted = muted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted && this.gainNode && this.ctx) {
      this.gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private initAudio(): void {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // 1. Generate 1 second of calibrated textured paper noise (Brown/Pink noise hybrid)
      const bufferSize = this.ctx.sampleRate;
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Leaky integrator for tactile warmth
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5 + white * 0.08;
      }

      // 2. Bandpass filter to match metal fountain pen nib resonance (~2.8 kHz - 4.5 kHz)
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.setValueAtTime(3200, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(2.2, this.ctx.currentTime);

      // 3. Dynamic Gain Node
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

      // 4. Wiring: Source -> Filter -> Gain -> Destination
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
    } catch {
      // AudioContext not allowed or not supported in environment
    }
  }

  public startStroke(roughness: number = 0.5): void {
    if (this.isMuted) return;
    this.initAudio();
    if (!this.ctx || !this.noiseBuffer || !this.filterNode || !this.gainNode) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (!this.isPlaying) {
      this.sourceNode = this.ctx.createBufferSource();
      this.sourceNode.buffer = this.noiseBuffer;
      this.sourceNode.loop = true;
      this.sourceNode.connect(this.filterNode);
      this.sourceNode.start(0);
      this.isPlaying = true;
    }

    // Adapt resonance frequency to paper roughness
    const centerFreq = 2600 + roughness * 1400; // 2.6 kHz (smooth) to 4.0 kHz (rough watercolor)
    this.filterNode.frequency.setTargetAtTime(centerFreq, this.ctx.currentTime, 0.02);
  }

  public updateMotion(velocity: number, pressure: number): void {
    if (this.isMuted || !this.ctx || !this.gainNode || !this.filterNode) return;

    // Velocity scale (pixels per ms): 0 to 2.5
    // Pressure scale: 0 to 1
    const activity = Math.min(1.0, velocity * 0.8) * (0.3 + pressure * 0.7);
    const targetGain = Math.max(0, Math.min(0.28, activity * 0.25));

    // Dynamic brightness: faster stroke shifts acoustic spectrum up
    const pitchShift = 3000 + Math.min(2000, velocity * 800);
    this.filterNode.frequency.setTargetAtTime(pitchShift, this.ctx.currentTime, 0.015);

    // Smooth gain ramp to avoid clicks
    this.gainNode.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.01);
  }

  public endStroke(): void {
    if (!this.ctx || !this.gainNode) return;
    // Fast fade out
    this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
  }

  public destroy(): void {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch {
        // ignore
      }
      this.sourceNode = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.isPlaying = false;
  }
}
