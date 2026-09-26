import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp} from '../utils/animation';
import {inCubic, outExpo, WHIP} from '../utils/easing';
import {bicorneMask} from './art/Regalia';
import {Fill} from './core';

/** Circular iris: reveals children through a growing (or shrinking) circle. */
export const IrisReveal: React.FC<{r: number; x?: number; y?: number; feather?: number; children: React.ReactNode; invert?: boolean}> = ({
  r,
  x = 540,
  y = 960,
  feather = 2,
  children,
  invert,
}) => {
  if (!invert && r <= 0) return null;
  const m = invert
    ? `radial-gradient(circle at ${x}px ${y}px, transparent ${r}px, black ${r + feather}px)`
    : `radial-gradient(circle at ${x}px ${y}px, black ${r}px, transparent ${r + feather}px)`;
  return <Fill style={{WebkitMaskImage: m, maskImage: m}}>{children}</Fill>;
};

/** Bicorne-shaped mask growing from the centre — MOTIF 4 wipe. */
export const BicorneWipe: React.FC<{t: number; children: React.ReactNode; rot?: number; y?: number}> = ({t, children, rot = 0, y = 960}) => {
  if (t <= 0) return null;
  const w = 60 + inCubic(clamp(t)) * 9000;
  const h = (w * 170) / 400;
  const m = bicorneMask();
  return (
    <Fill
      style={{
        WebkitMaskImage: m,
        maskImage: m,
        WebkitMaskSize: `${w}px ${h}px`,
        maskSize: `${w}px ${h}px`,
        WebkitMaskPosition: `${540 - w / 2}px ${y - h * 0.62}px`,
        maskPosition: `${540 - w / 2}px ${y - h * 0.62}px`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        transform: `rotate(${rot}deg)`,
      }}
    >
      {children}
    </Fill>
  );
};

/** Whip pan: content slides with a speed-dependent blur + stretch. t 0..1 (0.5 = fastest). */
export const whipStyle = (t: number, dir: 1 | -1 = 1, dist = 1400, axis: 'x' | 'y' = 'x'): React.CSSProperties => {
  const e = WHIP(clamp(t));
  const v = Math.sin(Math.PI * clamp(t)); // speed profile
  const off = e * dist * dir;
  return {
    transform: axis === 'x' ? `translateX(${off}px) scaleX(${1 + v * 0.25})` : `translateY(${off}px) scaleY(${1 + v * 0.25})`,
    filter: v > 0.05 ? `blur(${v * 26}px)` : undefined,
  };
};

/** Crash zoom helper: returns scale for an aggressive punch-in */
export const crashZoom = (f: number, at: number, from = 1, to = 1.6, dur = 6) => from + (to - from) * outExpo(clamp((f - at) / dur));

/** Radial "light-speed" streak overlay for zoom transitions */
export const ZoomStreaks: React.FC<{amount: number; color?: string}> = ({amount, color = '255,255,255'}) => {
  const f = useCurrentFrame();
  if (amount < 0.02) return null;
  return (
    <Fill
      style={{
        opacity: amount,
        background: `repeating-conic-gradient(from ${f * 7}deg at 50% 50%, rgba(${color},0.0) 0deg, rgba(${color},0.35) 0.6deg, rgba(${color},0.0) 1.8deg, rgba(${color},0) 5deg)`,
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 60%)',
        maskImage: 'radial-gradient(circle at 50% 50%, transparent 15%, black 60%)',
        mixBlendMode: 'screen',
      }}
    />
  );
};
