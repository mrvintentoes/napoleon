import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {rnd} from '../utils/animation';
import {Fill} from './core';

/** Pre-baked grain frames cycled per frame with jittered offset. */
export const FilmGrain: React.FC<{opacity?: number; dust?: number; blend?: React.CSSProperties['mixBlendMode']}> = ({
  opacity = 0.35,
  dust = 0,
  blend = 'overlay',
}) => {
  const f = useCurrentFrame();
  const i = f % 8;
  const ox = Math.floor(rnd(f, 1) * 60) - 30;
  const oy = Math.floor(rnd(f, 2) * 60) - 30;
  return (
    <Fill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      {opacity > 0 ? (
        <Img
          src={staticFile(`textures/grain_${i}.png`)}
          style={{position: 'absolute', left: -40 + ox, top: -40 + oy, width: 1160, height: 2000, opacity, mixBlendMode: blend, imageRendering: 'pixelated'}}
        />
      ) : null}
      {dust > 0 && rnd(f, 5) < 0.55 ? (
        <Img
          src={staticFile(`textures/dust_${Math.floor(f / 2) % 4}.png`)}
          style={{position: 'absolute', inset: 0, width: 1080, height: 1920, opacity: dust, mixBlendMode: 'screen'}}
        />
      ) : null}
    </Fill>
  );
};

export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.7, color = '0,0,0'}) => (
  <Fill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 75% 60% at 50% 50%, rgba(${color},0) 40%, rgba(${color},${strength * 0.6}) 75%, rgba(${color},${strength}) 100%)`,
    }}
  />
);

export const Scanlines: React.FC<{opacity?: number; size?: number; roll?: number}> = ({opacity = 0.18, size = 4, roll = 0}) => {
  const f = useCurrentFrame();
  return (
    <Fill
      style={{
        pointerEvents: 'none',
        opacity,
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) ${size / 2}px, transparent ${size / 2}px, transparent ${size}px)`,
        backgroundPosition: `0 ${(f * roll) % size}px`,
        mixBlendMode: 'multiply',
      }}
    />
  );
};

/** CRT rolling bar + slight RGB mask */
export const CRT: React.FC<{opacity?: number}> = ({opacity = 0.5}) => {
  const f = useCurrentFrame();
  const barY = ((f * 13) % 2400) - 240;
  return (
    <Fill style={{pointerEvents: 'none', opacity}}>
      <Scanlines opacity={0.35} size={6} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: barY,
          height: 240,
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.08), transparent)',
          mixBlendMode: 'screen',
        }}
      />
      <Fill
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,0,0,0.06) 0 1px, rgba(0,255,0,0.06) 1px 2px, rgba(0,0,255,0.06) 2px 3px)',
          mixBlendMode: 'screen',
        }}
      />
    </Fill>
  );
};

/** Halftone dot screen overlay */
export const HalftoneOverlay: React.FC<{size?: number; opacity?: number; color?: string}> = ({size = 10, opacity = 0.35, color = '#000'}) => (
  <Fill
    style={{
      pointerEvents: 'none',
      opacity,
      backgroundImage: `radial-gradient(circle at 50% 50%, ${color} 32%, transparent 36%)`,
      backgroundSize: `${size}px ${size}px`,
      mixBlendMode: 'multiply',
    }}
  />
);

/** Color grade overlay: tint via blend mode */
export const Tint: React.FC<{color: string; opacity?: number; blend?: React.CSSProperties['mixBlendMode']}> = ({color, opacity = 1, blend = 'color'}) => (
  <Fill style={{background: color, opacity, mixBlendMode: blend, pointerEvents: 'none'}} />
);

export const Parchment: React.FC<{opacity?: number; filter?: string}> = ({opacity = 1, filter}) => (
  <Img src={staticFile('textures/parchment.jpg')} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, opacity, filter}} />
);
