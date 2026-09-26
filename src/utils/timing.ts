import React from 'react';
import {b, BEAT, MARKERS, MarkerName} from '../data/beats';

export {b, BEAT};

/** frame of a marker relative to a scene start */
export const rel = (marker: MarkerName, sceneStart: number) => MARKERS[marker] - sceneStart;

export type ShotFn = (local: number, dur: number, index: number) => React.ReactNode;
export type Shot = [number, ShotFn];

/** Given shot durations, return the active shot index + local frame. */
export const activeShot = (frame: number, durs: number[]) => {
  let acc = 0;
  for (let i = 0; i < durs.length; i++) {
    if (frame < acc + durs[i]) return {index: i, local: frame - acc, start: acc, dur: durs[i]};
    acc += durs[i];
  }
  const i = durs.length - 1;
  return {index: i, local: frame - (acc - durs[i]), start: acc - durs[i], dur: durs[i]};
};

export const totalOf = (shots: Shot[]) => shots.reduce((a, s) => a + s[0], 0);

/** Evenly accelerating cut lengths: e.g. accel(8, 18, 4) -> 18,…,4 frames */
export const accel = (n: number, first: number, last: number) =>
  Array.from({length: n}, (_, i) => Math.max(1, Math.round(first + ((last - first) * i) / Math.max(1, n - 1))));
