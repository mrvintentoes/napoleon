import {MARKERS as M, b} from './beats';

/**
 * AUDIO LAYERING
 *  - MAIN_TRACK: public/audio/main-track.mp3 (currently a synthesized, grid-locked placeholder
 *    from scripts/make_audio.py — swap in any song and re-time data/beats.ts).
 *  - SFX_CUES: sound design one-shots from public/sfx/<name>.wav, positioned relative to
 *    structural markers so they move with the edit if you re-time it.
 * Set SFX_VOLUME = 0 if your replacement song already carries its own sound design.
 */
export const MAIN_TRACK = 'audio/main-track.mp3';
export const MUSIC_VOLUME = 0.9;
export const SFX_VOLUME = 0.7;

/** [frame, gain] music automation (e.g. duck under Moscow, kill at Waterloo) */
export const MUSIC_AUTOMATION: [number, number][] = [
  [0, 1],
  [M.MOSCOW, 1],
  [M.MOSCOW + 20, 0.7],
  [M.RETREAT + 200, 0.8],
  [M.FINAL_CUT - 1, 1],
  [M.FINAL_CUT, 0],
  [M.SAINT_HELENA + 60, 0],
  [M.SAINT_HELENA + 120, 1],
  [M.END, 1],
];

export type Cue = {at: number; sfx: string; vol?: number; rate?: number; dur?: number};

const at = (marker: keyof typeof M, offsetFrames = 0) => M[marker] + offsetFrames;

export const SFX_CUES: Cue[] = [
  // prologue
  {at: 60, sfx: 'paper', vol: 0.5},
  {at: 152, sfx: 'paper', vol: 0.4},
  {at: 232, sfx: 'crowd', vol: 0.5, dur: 110},
  // Toulon
  {at: at('TOULON'), sfx: 'riser', vol: 0.6},
  {at: at('DROP_1'), sfx: 'cannon', vol: 1},
  {at: at('DROP_1', 30), sfx: 'impact', vol: 0.7},
  {at: at('DROP_1', 60), sfx: 'impact', vol: 0.8},
  {at: at('TOULON', 222 + 28), sfx: 'cannon', vol: 0.6},
  // Italy
  {at: at('ITALY'), sfx: 'impact', vol: 0.8},
  ...[80, 160, 240, 320].map((o) => ({at: at('ITALY', 72 + o), sfx: 'cannon', vol: 0.45})),
  {at: at('ITALY', 72), sfx: 'marching', vol: 0.35, dur: 240},
  {at: at('ITALY', 564), sfx: 'impact', vol: 0.8},
  {at: at('ITALY', 700), sfx: 'whoosh', vol: 0.8},
  // Egypt
  {at: at('EGYPT'), sfx: 'whoosh', vol: 0.6},
  {at: at('EGYPT', 142), sfx: 'impact', vol: 0.7},
  {at: at('NILE'), sfx: 'glitch', vol: 0.7},
  {at: at('NILE', 30), sfx: 'fire', vol: 0.5, dur: 90},
  {at: at('NILE', 30), sfx: 'boom_low', vol: 0.7},
  // Brumaire / Marengo
  {at: at('BRUMAIRE', 8), sfx: 'impact', vol: 0.7},
  {at: at('BRUMAIRE', 40), sfx: 'paper', vol: 0.6},
  {at: at('BRUMAIRE', 64), sfx: 'paper', vol: 0.6},
  {at: at('MARENGO'), sfx: 'gallop', vol: 0.7, dur: 110},
  ...[22, 52, 66].map((o) => ({at: at('MARENGO', o), sfx: 'saber', vol: 0.6})),
  {at: at('MARENGO', 210), sfx: 'whoosh', vol: 0.5},
  // Coronation
  {at: at('CORONATION', 10), sfx: 'riser', vol: 0.3, rate: 0.7},
  {at: at('CROWN_DROP') - 8, sfx: 'whoosh', vol: 0.7},
  {at: at('CROWN_DROP'), sfx: 'impact', vol: 1},
  {at: at('CROWN_DROP', 250), sfx: 'whoosh', vol: 0.7},
  // Austerlitz
  ...[0, 12, 24].map((o) => ({at: at('AUSTERLITZ', o), sfx: 'impact', vol: 0.5})),
  {at: at('AUSTERLITZ', 152), sfx: 'wind', vol: 0.4, dur: 88},
  {at: at('AUSTERLITZ_DROP'), sfx: 'cannon', vol: 1},
  {at: at('AUSTERLITZ_DROP', 100), sfx: 'whoosh', vol: 0.8},
  // Master of Europe
  {at: at('MASTER'), sfx: 'impact', vol: 0.7},
  {at: at('MASTER', 40), sfx: 'cannon', vol: 0.6},
  {at: at('MASTER', 180), sfx: 'wind', vol: 0.4, dur: 124},
  {at: at('MASTER', 220), sfx: 'gallop', vol: 0.6, dur: 84},
  {at: at('MASTER', 304), sfx: 'cannon', vol: 0.8},
  {at: at('PEAK'), sfx: 'impact', vol: 1},
  {at: at('PEAK', 150), sfx: 'whoosh', vol: 0.7},
  // Spain / Wagram
  {at: at('SPAIN'), sfx: 'impact', vol: 0.8},
  {at: at('SPAIN', 70), sfx: 'fire', vol: 0.35, dur: 30},
  {at: at('SPAIN', 100), sfx: 'marching', vol: 0.4, dur: 30},
  {at: at('SPAIN', 260), sfx: 'glitch', vol: 0.6},
  {at: at('WAGRAM'), sfx: 'cannon', vol: 1},
  // Russia
  {at: at('RUSSIA_BREAK'), sfx: 'boom_low', vol: 1},
  {at: at('RUSSIA_BREAK', 20), sfx: 'wind', vol: 0.4, dur: 280},
  {at: at('RUSSIA_BREAK', 100), sfx: 'marching', vol: 0.5, dur: 130},
  ...[0, 15, 30, 45, 60, 75, 90, 105, 120, 150, 180].map((o) => ({at: at('BORODINO', o), sfx: 'cannon', vol: 0.55, rate: 0.9 + (o % 30) / 150})),
  {at: at('MOSCOW'), sfx: 'fire', vol: 0.8, dur: 150},
  {at: at('RETREAT'), sfx: 'boom_low', vol: 0.9},
  {at: at('RETREAT', 10), sfx: 'wind', vol: 0.8, dur: 300},
  {at: at('RETREAT', 70), sfx: 'glitch', vol: 0.4},
  {at: at('RETREAT', 92), sfx: 'glitch', vol: 0.4},
  {at: at('RETREAT', 114), sfx: 'glitch', vol: 0.4},
  // Leipzig / 1814
  {at: at('LEIPZIG_START'), sfx: 'marching', vol: 0.5, dur: 120},
  {at: at('LEIPZIG'), sfx: 'cannon', vol: 1},
  ...[30, 66, 98, 126, 152].map((o) => ({at: at('FRANCE_1814', o), sfx: 'impact', vol: 0.55})),
  {at: at('PARIS_FALLS'), sfx: 'boom_low', vol: 0.8},
  {at: at('PARIS_FALLS', 44), sfx: 'paper', vol: 0.6},
  {at: at('PARIS_FALLS', 96), sfx: 'whoosh', vol: 0.5, rate: 0.7},
  // Elba — ocean only
  {at: at('ELBA_SILENCE'), sfx: 'ocean', vol: 0.8, dur: b(11)},
  {at: at('HUNDRED_DAYS', 40), sfx: 'heartbeat', vol: 0.7},
  {at: at('HUNDRED_DAYS_DROP'), sfx: 'impact', vol: 1},
  ...[50, 88, 116].map((o) => ({at: at('HUNDRED_DAYS_DROP', 40 + o + 10), sfx: 'whoosh', vol: 0.6})),
  {at: at('PARIS_1815'), sfx: 'crowd', vol: 0.7, dur: 130},
  // Waterloo
  {at: at('WATERLOO', 40), sfx: 'distant_cannon', vol: 0.8},
  {at: at('WATERLOO', 80), sfx: 'distant_cannon', vol: 0.7},
  {at: at('WATERLOO_DROP'), sfx: 'cannon', vol: 1},
  {at: at('WATERLOO_DROP', 90), sfx: 'gallop', vol: 0.8, dur: 40},
  {at: at('WATERLOO_DROP', 180), sfx: 'marching', vol: 0.6, dur: 60},
  {at: at('WATERLOO_CLIMAX'), sfx: 'marching', vol: 0.8, dur: 180},
  {at: at('WATERLOO_CLIMAX', 84), sfx: 'impact', vol: 0.9},
  {at: at('FINAL_CUT', 36), sfx: 'distant_cannon', vol: 0.7},
  {at: at('FINAL_CUT', 10), sfx: 'wind', vol: 0.3, dur: 110},
  // Saint Helena
  {at: at('SAINT_HELENA'), sfx: 'ocean', vol: 0.6, dur: 260},
  {at: at('SAINT_HELENA', 240), sfx: 'wind', vol: 0.4, dur: 360},
];
