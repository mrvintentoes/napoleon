import {Ease, linear, SLAM, outElasticSoft} from './easing';

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const invLerp = (a: number, b: number, v: number) => clamp((v - a) / (b - a));

/** eased progress 0..1 of an animation starting at `start` lasting `dur` frames */
export const prog = (frame: number, start: number, dur: number, ease: Ease = linear) =>
  ease(clamp((frame - start) / Math.max(1, dur)));

/**
 * Keyframes: kf(frame, [[0, 1], [10, 5, OUT], [20, 2]])
 * The ease stored on a key applies to the segment ARRIVING at that key.
 */
export type Key = [number, number, Ease?];
export const kf = (frame: number, keys: Key[]): number => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1, e] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (frame <= f1) {
      const t = (frame - f0) / Math.max(1e-6, f1 - f0);
      return lerp(v0, v1, (e ?? linear)(t));
    }
  }
  return keys[keys.length - 1][1];
};

/** deterministic hash noise */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return s - Math.floor(s);
};
export const rnd = (seed: number, i = 0) => hash(seed * 9173.13 + i * 17.77);

/** smooth 1D value noise in [-1,1] */
export const noise1 = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash(i + seed * 101.3), hash(i + 1 + seed * 101.3), u) * 2 - 1;
};

/** handheld / impact camera shake */
export const shake = (frame: number, amp: number, speed = 0.35, seed = 1) => ({
  x: noise1(frame * speed, seed) * amp + noise1(frame * speed * 2.7, seed + 7) * amp * 0.35,
  y: noise1(frame * speed, seed + 13) * amp + noise1(frame * speed * 2.3, seed + 23) * amp * 0.35,
  r: noise1(frame * speed * 0.8, seed + 31) * amp * 0.04,
});

/** exponential decay pulse after a hit (1 at the hit, fading) */
export const pulse = (frame: number, at: number, decay = 8) =>
  frame < at ? 0 : Math.exp(-(frame - at) / decay);

/** max of pulses for a list of hits */
export const pulses = (frame: number, ats: number[], decay = 8) =>
  ats.reduce((m, a) => Math.max(m, pulse(frame, a, decay)), 0);

/** 1 for `len` frames starting at `at` */
export const window1 = (frame: number, at: number, len: number) => (frame >= at && frame < at + len ? 1 : 0);

/**
 * The signature title slam: starts huge + blurred + rotated, slams to rest in ~7 frames,
 * overshoots slightly and rings out.
 */
export const slam = (
  frame: number,
  at: number,
  opts: {from?: number; dur?: number; blur?: number; rot?: number} = {}
) => {
  const {from = 5, dur = 7, blur = 40, rot = -4} = opts;
  const t = clamp((frame - at) / dur);
  const e = SLAM(t);
  const settle = frame - at - dur;
  const ring = settle > 0 ? Math.exp(-settle / 6) * Math.sin(settle * 0.9) * 0.035 : 0;
  return {
    scale: lerp(from, 1, e) - ring,
    blur: lerp(blur, 0, e),
    rot: lerp(rot, 0, outElasticSoft(t)),
    opacity: frame < at ? 0 : clamp((frame - at) / 2),
    active: frame >= at,
  };
};

/** velocity (units/frame) of a scalar animation — for velocity-dependent blur/stretch */
export const velocity = (fn: (f: number) => number, frame: number) => fn(frame) - fn(frame - 1);

/** strobe on/off pattern */
export const strobe = (frame: number, period = 4, duty = 0.5) => (frame % period) / period < duty;

/** index into a looping cycle */
export const cycle = (frame: number, period: number, n: number) => Math.floor(frame / period) % n;
