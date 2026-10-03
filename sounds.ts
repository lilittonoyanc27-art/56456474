// Web Audio API synthesizers for football game sound effects
class SoundController {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Referee whistle sound
  playWhistle() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Typical referee pea whistle produces dual vibrating high frequencies
      osc1.frequency.setValueAtTime(2600, now);
      osc2.frequency.setValueAtTime(2800, now);

      // Tremolo/beating
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(32, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(40, now);
      lfo.connect(osc1.frequency);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      lfo.start(now);
      osc1.start(now);
      osc2.start(now);

      lfo.stop(now + 0.35);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  // Goal celebration chime
  playGoal() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 triumphant chord
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.6);
      });
    } catch {
      // AudioContext restricted
    }
  }

  // Kick ball "thud" sound
  playKick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.15);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // AudioContext restricted
    }
  }
}

export const soundController = new SoundController();

// Speech Synthesis Helper for Spanish Audio
export function speakSpanish(text: string, rate: number = 0.9) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel(); // stop any ongoing speech

  const cleanText = text.replace(/¿|\?|¡|!|\*|✅/g, '').trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'es-ES';
  utterance.rate = rate; // slightly slower for language learners

  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find(
    (v) => v.lang.startsWith('es-') || v.lang === 'es'
  );
  if (spanishVoice) {
    utterance.voice = spanishVoice;
  }

  window.speechSynthesis.speak(utterance);
}
