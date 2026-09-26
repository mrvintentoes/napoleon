import React from 'react';
import {Sequence, useCurrentFrame} from 'remotion';
import {activeShot, Shot} from '../utils/timing';

/**
 * Rapid-cut montage: shots = [[durationFrames, (local, dur, i) => node], ...].
 * Only the active shot is mounted, inside its own <Sequence> so every
 * useCurrentFrame() in the shot is shot-local. `offset` delays the start.
 * `hold` keeps the last shot on screen after the montage ends.
 */
export const Montage: React.FC<{shots: Shot[]; offset?: number; hold?: boolean}> = ({shots, offset = 0, hold = false}) => {
  const f = useCurrentFrame() - offset;
  const total = shots.reduce((a, s) => a + s[0], 0);
  if (f < 0 || (!hold && f >= total)) return null;
  const {index, start, dur} = activeShot(Math.min(f, total - 1), shots.map((s) => s[0]));
  const isLast = index === shots.length - 1;
  return (
    <Sequence from={offset + start} durationInFrames={isLast && hold ? Infinity : dur} layout="none">
      {shots[index][1](f - start, dur, index)}
    </Sequence>
  );
};
