// Ubuntu system sounds using Web Audio API
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export const sounds = {
  login() {
    // Ubuntu login sound - ascending tones
    playTone(440, 0.3, 'sine', 0.08);
    setTimeout(() => playTone(554, 0.3, 'sine', 0.08), 150);
    setTimeout(() => playTone(659, 0.5, 'sine', 0.08), 300);
  },
  logout() {
    // Descending tones
    playTone(659, 0.3, 'sine', 0.08);
    setTimeout(() => playTone(554, 0.3, 'sine', 0.08), 150);
    setTimeout(() => playTone(440, 0.5, 'sine', 0.08), 300);
  },
  windowOpen() {
    playTone(600, 0.1, 'sine', 0.05);
  },
  windowClose() {
    playTone(400, 0.1, 'sine', 0.05);
  },
  minimize() {
    playTone(500, 0.08, 'sine', 0.04);
  },
  click() {
    playTone(800, 0.05, 'sine', 0.03);
  },
  keypress() {
    playTone(1000 + Math.random() * 200, 0.03, 'sine', 0.02);
  },
  notification() {
    playTone(523, 0.15, 'sine', 0.06);
    setTimeout(() => playTone(659, 0.2, 'sine', 0.06), 150);
  },
  error() {
    playTone(200, 0.3, 'square', 0.05);
  },
  startup() {
    // Ubuntu startup drum-like sound
    playTone(130, 0.4, 'triangle', 0.1);
    setTimeout(() => playTone(196, 0.3, 'triangle', 0.08), 200);
    setTimeout(() => playTone(261, 0.3, 'sine', 0.06), 400);
    setTimeout(() => playTone(392, 0.5, 'sine', 0.08), 600);
  },
};
