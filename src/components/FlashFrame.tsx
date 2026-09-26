import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Fill} from './core';

/** Solid flash for [at, at+len) frames, optional exponential tail. */
export const FlashFrame: React.FC<{at: number; len?: number; color?: string; tail?: number; blend?: React.CSSProperties['mixBlendMode']; max?: number}> = ({
  at,
  len = 2,
  color = '#fff',
  tail = 0,
  blend,
  max = 1,
}) => {
  const f = useCurrentFrame();
  let o = 0;
  if (f >= at && f < at + len) o = 1;
  else if (tail > 0 && f >= at + len) o = Math.exp(-(f - at - len) / tail);
  if (o < 0.01) return null;
  return <Fill style={{background: color, opacity: o * max, mixBlendMode: blend, pointerEvents: 'none'}} />;
};

/** Many flashes at once (e.g. the beat grid of a montage). */
export const Flashes: React.FC<{ats: number[]; len?: number; color?: string; tail?: number; max?: number; blend?: React.CSSProperties['mixBlendMode']}> = ({
  ats,
  ...rest
}) => (
  <>
    {ats.map((a) => (
      <FlashFrame key={a} at={a} {...rest} />
    ))}
  </>
);
