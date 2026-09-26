import React from 'react';
import {useCurrentFrame} from 'remotion';
import {rnd} from '../utils/animation';
import {Fill} from './core';

/**
 * RGB split: renders the subtree three times through channel-isolating filters,
 * recombined with `screen` over black. Only pays the 3x cost while amount > 0.5px.
 */
export const ChromaticAberration: React.FC<{amount: number; angle?: number; children: React.ReactNode}> = ({amount, angle = 0, children}) => {
  if (Math.abs(amount) < 0.5) return <>{children}</>;
  const dx = Math.cos((angle * Math.PI) / 180) * amount;
  const dy = Math.sin((angle * Math.PI) / 180) * amount;
  return (
    <Fill style={{background: '#000', isolation: 'isolate', overflow: 'hidden'}}>
      <Fill style={{filter: 'url(#only-r)', transform: `translate(${-dx}px, ${-dy}px)`, mixBlendMode: 'screen'}}>{children}</Fill>
      <Fill style={{filter: 'url(#only-g)', mixBlendMode: 'screen'}}>{children}</Fill>
      <Fill style={{filter: 'url(#only-b)', transform: `translate(${dx}px, ${dy}px)`, mixBlendMode: 'screen'}}>{children}</Fill>
    </Fill>
  );
};

/**
 * Datamosh-ish horizontal slice displacement. Renders `bands` copies each clipped
 * to a strip; cheap enough for a handful of frames.
 */
export const SliceGlitch: React.FC<{amount: number; bands?: number; seed?: number; children: React.ReactNode}> = ({
  amount,
  bands = 7,
  seed = 1,
  children,
}) => {
  const f = useCurrentFrame();
  if (amount < 0.02) return <>{children}</>;
  const k = Math.floor(f / 2);
  const cuts = Array.from({length: bands - 1}, (_, i) => rnd(seed + k, i)).sort();
  const edges = [0, ...cuts, 1];
  return (
    <Fill style={{overflow: 'hidden'}}>
      {edges.slice(0, -1).map((top, i) => {
        const bot = edges[i + 1];
        const shift = (rnd(seed + k, i + 50) - 0.5) * 2 * amount * 260 * (rnd(seed + k, i + 90) < 0.4 ? 0 : 1);
        return (
          <Fill
            key={i}
            style={{
              clipPath: `inset(${top * 100}% 0 ${(1 - bot) * 100}% 0)`,
              transform: `translateX(${shift}px)`,
              filter: rnd(seed + k, i + 7) < amount * 0.5 ? 'hue-rotate(90deg) saturate(3)' : undefined,
            }}
          >
            {children}
          </Fill>
        );
      })}
    </Fill>
  );
};
