import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, kf, noise1} from '../utils/animation';
import {inCubic, outExpo, CAMERA} from '../utils/easing';
import {Eagle} from './art/Eagle';
import {Fill} from './core';

/**
 * MOTIF 1 — the eagle.
 *   EagleFlyThrough: eagle rushes from the distance toward camera until it fills
 *   the frame, then its silhouette becomes a mask revealing `reveal` (e.g. a map).
 */
export const EagleFlyThrough: React.FC<{at: number; dur?: number; reveal?: React.ReactNode; glow?: number; y?: number}> = ({at, dur = 28, reveal, glow = 0.6, y = 900}) => {
  const f = useCurrentFrame() - at;
  if (f < 0 || f > dur + 10) return null;
  const t = clamp(f / dur);
  const size = 120 + inCubic(t) * 9000;
  const flap = Math.sin(f * 0.6) * (1 - t);
  const x = 540 + noise1(f * 0.1, 4) * 30 * (1 - t);
  const blur = t > 0.7 ? (t - 0.7) * 30 : 0;
  return (
    <Fill>
      <div style={{position: 'absolute', left: x - size / 2, top: y - size * 0.52, width: size, height: size, filter: blur ? `blur(${blur}px)` : undefined, opacity: 1 - clamp((f - dur) / 10)}}>
        <Eagle size={size} flap={flap} glow={glow} />
      </div>
      {reveal && t > 0.82 ? <Fill style={{opacity: clamp((t - 0.82) / 0.18)}}>{reveal}</Fill> : null}
    </Fill>
  );
};

/** Emblem eagle in place with era state. */
export const EagleEmblem: React.FC<{
  x?: number;
  y?: number;
  size?: number;
  state: 'faint' | 'strong' | 'dominant' | 'cracked' | 'falling' | 'flying' | 'shattered';
  at?: number;
  opacity?: number;
}> = ({x = 540, y = 960, size = 700, state, at = 0, opacity = 1}) => {
  const f = useCurrentFrame() - at;
  if (f < 0) return null;
  let crack = 0;
  let shatter = 0;
  let dy = 0;
  let rot = 0;
  let o = opacity;
  let s = 1;
  let glow = 0.4;
  switch (state) {
    case 'faint':
      o *= 0.18;
      glow = 0;
      break;
    case 'strong':
      s = kf(f, [
        [0, 0.6],
        [10, 1, outExpo],
      ]);
      break;
    case 'dominant':
      s = 1 + Math.sin(f * 0.05) * 0.02;
      glow = 1;
      break;
    case 'cracked':
      crack = clamp(f / 24);
      glow = 0.1;
      break;
    case 'falling':
      crack = 1;
      dy = inCubic(clamp(f / 40)) * 1800;
      rot = inCubic(clamp(f / 40)) * 70;
      glow = 0;
      break;
    case 'flying':
      s = kf(f, [
        [0, 0.2],
        [16, 1.05, CAMERA],
        [30, 1],
      ]);
      glow = 1.2;
      break;
    case 'shattered':
      shatter = clamp(f / 30);
      glow = 0.2;
      break;
  }
  return (
    <div style={{position: 'absolute', left: x - (size * s) / 2, top: y - (size * s) / 2 + dy, width: size * s, height: size * s, opacity: o, transform: `rotate(${rot}deg)`}}>
      <Eagle size={size * s} crack={crack} shatter={shatter} glow={glow} flap={state === 'flying' ? Math.sin(f * 0.5) * 0.7 : 0} />
    </div>
  );
};
