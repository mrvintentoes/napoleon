import {MARKERS, MarkerName} from './beats';

/**
 * SCENE TIMELINE — scene boundaries are markers (data/beats.ts), never magic numbers.
 * `grain`/`vignette` feed the global finishing layer; `palette` documents the
 * narrative colour script (see README).
 */
export type SceneId =
  | 'prologue' | 'toulon' | 'italy' | 'egypt' | 'brumaire' | 'coronation' | 'austerlitz' | 'master'
  | 'spain' | 'russia' | 'leipzig' | 'france1814' | 'elba' | 'hundredDays' | 'waterloo' | 'helena';

export type SceneDef = {id: SceneId; start: MarkerName; end: MarkerName; title: string; years: string; palette: string[]; grain: number; vignette: number};

export const SCENES: SceneDef[] = [
  {id: 'prologue', start: 'INTRO', end: 'TOULON', title: 'Prologue', years: '1769–1793', palette: ['#050505', '#2b2b2b', '#b3121b'], grain: 0.45, vignette: 0.85},
  {id: 'toulon', start: 'TOULON', end: 'ITALY', title: 'Toulon', years: '1793', palette: ['#0a0a0a', '#c8102e', '#f0e6d0'], grain: 0.4, vignette: 0.7},
  {id: 'italy', start: 'ITALY', end: 'EGYPT', title: 'The General', years: '1795–1797', palette: ['#c8923a', '#9b2a1a', '#ecd8a8'], grain: 0.35, vignette: 0.6},
  {id: 'egypt', start: 'EGYPT', end: 'BRUMAIRE', title: 'Egypt', years: '1798–1799', palette: ['#e9b85c', '#2a1a08', '#0b0b0b'], grain: 0.4, vignette: 0.6},
  {id: 'brumaire', start: 'BRUMAIRE', end: 'CORONATION', title: 'Power', years: '1799–1804', palette: ['#efe2c2', '#0b2a78', '#c8102e'], grain: 0.3, vignette: 0.55},
  {id: 'coronation', start: 'CORONATION', end: 'AUSTERLITZ', title: 'Emperor', years: '1804', palette: ['#d9a93e', '#0d1a4a', '#8a0f1a'], grain: 0.3, vignette: 0.7},
  {id: 'austerlitz', start: 'AUSTERLITZ', end: 'MASTER', title: 'Austerlitz', years: '1805', palette: ['#aab4bd', '#ffcf6b', '#0b2a78'], grain: 0.3, vignette: 0.6},
  {id: 'master', start: 'MASTER', end: 'SPAIN', title: 'Master of Europe', years: '1806–1807', palette: ['#0b2a78', '#e3b955', '#f4f1ea'], grain: 0.28, vignette: 0.55},
  {id: 'spain', start: 'SPAIN', end: 'RUSSIA_BREAK', title: 'The Empire Overheats', years: '1808–1811', palette: ['#7a1a0e', '#0a0a0a', '#e3b955'], grain: 0.4, vignette: 0.7},
  {id: 'russia', start: 'RUSSIA_BREAK', end: 'LEIPZIG_START', title: '1812', years: '1812', palette: ['#7d8a96', '#e9eef1', '#2c3a48'], grain: 0.45, vignette: 0.75},
  {id: 'leipzig', start: 'LEIPZIG_START', end: 'FRANCE_1814', title: 'Europe Turns', years: '1813', palette: ['#5a4a32', '#2b2620', '#8b7b58'], grain: 0.45, vignette: 0.75},
  {id: 'france1814', start: 'FRANCE_1814', end: 'ELBA_SILENCE', title: 'Campaign of France', years: '1814', palette: ['#6f6f6f', '#1c1c1c', '#c8c8c8'], grain: 0.5, vignette: 0.8},
  {id: 'elba', start: 'ELBA_SILENCE', end: 'HUNDRED_DAYS', title: 'Elba', years: '1814–1815', palette: ['#0c141a', '#23323c', '#8aa0ab'], grain: 0.35, vignette: 0.85},
  {id: 'hundredDays', start: 'HUNDRED_DAYS', end: 'WATERLOO', title: 'The Hundred Days', years: '1815', palette: ['#0b2a78', '#c8102e', '#e3b955'], grain: 0.3, vignette: 0.6},
  {id: 'waterloo', start: 'WATERLOO', end: 'SAINT_HELENA', title: 'Waterloo', years: '18 June 1815', palette: ['#3d4a36', '#6b6b62', '#c8102e'], grain: 0.4, vignette: 0.75},
  {id: 'helena', start: 'SAINT_HELENA', end: 'END', title: 'Saint Helena', years: '1815–1821', palette: ['#1a2328', '#55646c', '#c7d0d4'], grain: 0.35, vignette: 0.85},
];

export const sceneSpan = (s: SceneDef) => ({from: MARKERS[s.start], dur: MARKERS[s.end] - MARKERS[s.start]});
