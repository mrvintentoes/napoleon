import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Fill} from './core';

/** Rotating sunburst rays (imperial glory, Sun of Austerlitz). */
export const Sunburst: React.FC<{c1?: string; c2?: string; rays?: number; speed?: number; x?: string; y?: string; opacity?: number; mask?: boolean}> = ({
  c1 = '#f2c14e',
  c2 = '#b3541e',
  rays = 24,
  speed = 0.4,
  x = '50%',
  y = '50%',
  opacity = 1,
  mask = true,
}) => {
  const f = useCurrentFrame();
  const step = 360 / rays;
  return (
    <Fill
      style={{
        opacity,
        background: `repeating-conic-gradient(from ${f * speed}deg at ${x} ${y}, ${c1} 0deg ${step / 2}deg, ${c2} ${step / 2}deg ${step}deg)`,
        WebkitMaskImage: mask ? `radial-gradient(circle at ${x} ${y}, black 20%, transparent 85%)` : undefined,
        maskImage: mask ? `radial-gradient(circle at ${x} ${y}, black 20%, transparent 85%)` : undefined,
      }}
    />
  );
};

/** Concentric zooming tunnel rings. */
export const Tunnel: React.FC<{c1?: string; c2?: string; speed?: number; ring?: number; opacity?: number}> = ({c1 = '#0b2a78', c2 = '#c8102e', speed = 3, ring = 120, opacity = 1}) => {
  const f = useCurrentFrame();
  const off = (f * speed) % ring;
  return (
    <Fill
      style={{
        opacity,
        background: `repeating-radial-gradient(circle at 50% 50%, ${c1} ${off}px, ${c1} ${off + ring / 2}px, ${c2} ${off + ring / 2}px, ${c2} ${off + ring}px)`,
      }}
    />
  );
};

/** Slow psychedelic colour field (moving radial blobs + hue drift). */
export const ColorField: React.FC<{colors?: string[]; speed?: number; hue?: number; opacity?: number; blend?: React.CSSProperties['mixBlendMode']}> = ({
  colors = ['#c8102e', '#0b2a78', '#f2c14e', '#101010'],
  speed = 1,
  hue = 0,
  opacity = 1,
  blend,
}) => {
  const f = useCurrentFrame() * speed;
  const pos = (i: number) => `${50 + Math.sin(f * 0.021 + i * 1.7) * 35}% ${50 + Math.cos(f * 0.017 + i * 2.3) * 35}%`;
  return (
    <Fill
      style={{
        opacity,
        mixBlendMode: blend,
        filter: hue ? `hue-rotate(${(f * hue) % 360}deg)` : undefined,
        background: colors.map((c, i) => `radial-gradient(circle at ${pos(i)}, ${c} 0%, transparent 55%)`).join(', ') + `, ${colors[colors.length - 1]}`,
      }}
    />
  );
};

/** Stripe field (vertical tricolour bars sliding) */
export const StripeField: React.FC<{colors?: string[]; speed?: number; w?: number; angle?: number; opacity?: number}> = ({
  colors = ['#0b2a78', '#f4f1ea', '#c8102e'],
  speed = 8,
  w = 120,
  angle = 90,
  opacity = 1,
}) => {
  const f = useCurrentFrame();
  const stops = colors.map((c, i) => `${c} ${i * w}px ${(i + 1) * w}px`).join(', ');
  return (
    <Fill
      style={{
        opacity,
        background: `repeating-linear-gradient(${angle}deg, ${stops})`,
        backgroundPosition: `${(f * speed) % (w * colors.length)}px 0`,
      }}
    />
  );
};

/** Dot-grid halftone background */
export const DotField: React.FC<{color?: string; bg?: string; size?: number; drift?: number}> = ({color = '#c8102e', bg = '#0a0a0a', size = 26, drift = 1}) => {
  const f = useCurrentFrame();
  return (
    <Fill
      style={{
        background: `radial-gradient(circle, ${color} 28%, transparent 32%) ${f * drift}px ${f * drift * 0.5}px / ${size}px ${size}px, ${bg}`,
      }}
    />
  );
};
