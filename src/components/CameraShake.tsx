import React from 'react';
import {useCurrentFrame} from 'remotion';
import {shake} from '../utils/animation';
import {Fill} from './core';

/**
 * Handheld / impact shake. `amp` can be animated by the caller (e.g. pulse after a hit);
 * `zoomKick` adds a scale bump proportional to amp for extra punch.
 */
export const CameraShake: React.FC<{amp: number; speed?: number; seed?: number; zoomKick?: number; children: React.ReactNode}> = ({
  amp,
  speed = 0.5,
  seed = 1,
  zoomKick = 0,
  children,
}) => {
  const f = useCurrentFrame();
  if (amp < 0.05 && zoomKick === 0) return <>{children}</>;
  const s = shake(f, amp, speed, seed);
  return (
    <Fill style={{transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg) scale(${1 + (zoomKick * amp) / 100})`}}>{children}</Fill>
  );
};
