import React from 'react';
import {useCurrentFrame} from 'remotion';
import {F} from '../fonts';
import {clamp, kf, noise1} from '../utils/animation';
import {outExpo} from '../utils/easing';

/**
 * MOTIF 2 — the name. Size is driven by the POWER curve (data/motifs.ts).
 * `from`→`to` animates between two power levels over `dur` frames (grow or shrink).
 * `behind` renders it as a hollow outline (use it behind Napoleon cutouts).
 */
export const NameMotif: React.FC<{
  from: number;
  to?: number;
  at?: number;
  dur?: number;
  text?: string;
  x?: number;
  y?: number;
  color?: string;
  hollow?: boolean;
  tracking?: number;
  opacity?: number;
  jitter?: number;
  font?: keyof typeof F;
  rot?: number;
  scaleY?: number;
  fit?: boolean;
}> = ({from, to, at = 0, dur = 20, text = 'BONAPARTE', x = 540, y = 960, color = '#f4ead5', hollow, tracking = 0.08, opacity = 1, jitter = 0, font = 'imperial', rot = 0, scaleY = 1, fit}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const size = to === undefined ? from : kf(f, [[at, from], [at + dur, to, outExpo]]);
  if (size < 2) return null;
  // solid names stay readable: compress horizontally instead of overflowing (hollow = background, may overflow)
  const doFit = fit ?? !hollow;
  const est = size * text.length * ((font === 'imperial' ? 0.86 : 0.6) + tracking);
  const sx = doFit && est > 1030 ? Math.max(0.3, 1030 / est) : 1;
  const jx = noise1(f * 0.7, 3) * jitter;
  const jy = noise1(f * 0.7, 9) * jitter;
  return (
    <div
      style={{
        position: 'absolute',
        left: x + jx,
        top: y + jy,
        transform: `translate(-50%, -50%) rotate(${rot}deg) scaleX(${sx}) scaleY(${scaleY})`,
        fontFamily: F[font],
        fontWeight: 900,
        fontSize: size,
        letterSpacing: `${tracking}em`,
        whiteSpace: 'nowrap',
        lineHeight: 1,
        color: hollow ? 'transparent' : color,
        WebkitTextStroke: hollow ? `${Math.max(1.5, size / 90)}px ${color}` : undefined,
        opacity: opacity * clamp((f - at) / 3),
        textShadow: hollow ? undefined : `0 0 ${size * 0.1}px rgba(0,0,0,0.5)`,
      }}
    >
      {text}
    </div>
  );
};
