let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType, gain = 0.04, delay = 0) {
  const audio = context();
  if (!audio) return;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.value = 0;
  osc.connect(amp);
  amp.connect(audio.destination);
  const start = audio.currentTime + delay;
  amp.gain.linearRampToValueAtTime(gain, start + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export function playCorrect() {
  tone(523.25, 0.12, "triangle", 0.05);
  tone(783.99, 0.16, "triangle", 0.04, 0.08);
}

export function playWrong() {
  tone(196, 0.22, "sawtooth", 0.03);
}

export function playComplete() {
  tone(392, 0.12, "triangle", 0.05);
  tone(523.25, 0.12, "triangle", 0.05, 0.1);
  tone(659.25, 0.18, "triangle", 0.05, 0.2);
  tone(783.99, 0.28, "triangle", 0.045, 0.32);
}

export function playTap() {
  tone(640, 0.05, "square", 0.02);
}
