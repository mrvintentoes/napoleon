import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {rnd, noise1} from '../utils/animation';

type Kind = 'snow' | 'embers' | 'dust' | 'sparks' | 'rain' | 'ash' | 'gold';

/**
 * Deterministic particle systems (positions are pure functions of frame).
 * density = particle count; speed scales motion; wind = horizontal drift.
 */
export const ParticleField: React.FC<{
  kind: Kind;
  density?: number;
  speed?: number;
  wind?: number;
  seed?: number;
  opacity?: number;
  size?: number;
  color?: string;
  dir?: number; // for sparks: travel direction (deg)
  blend?: React.CSSProperties['mixBlendMode'];
}> = ({kind, density = 120, speed = 1, wind = 0, seed = 1, opacity = 1, size = 1, color, dir = 0, blend}) => {
  const f = useCurrentFrame();
  const els: React.ReactNode[] = [];
  for (let i = 0; i < density; i++) {
    const r0 = rnd(seed, i);
    const r1 = rnd(seed, i + 1000);
    const r2 = rnd(seed, i + 2000);
    const depth = 0.3 + r2 * 0.7;
    if (kind === 'snow' || kind === 'ash') {
      const vy = (1.5 + depth * 4.5) * speed;
      const y = ((r1 * 2100 + f * vy) % 2100) - 90;
      const x = (((r0 * 1300 + f * wind * depth + noise1(f * 0.02 + i, seed) * 40) % 1300) + 1300) % 1300 - 110;
      const rad = (1.5 + depth * 5) * size;
      els.push(<circle key={i} cx={x} cy={y} r={rad} fill={color ?? (kind === 'ash' ? '#6f6a64' : '#fff')} opacity={(0.35 + depth * 0.65) * opacity} />);
    } else if (kind === 'embers' || kind === 'gold') {
      const vy = (2 + depth * 6) * speed;
      const y = 2000 - ((r1 * 2100 + f * vy) % 2100);
      const x = r0 * 1080 + noise1(f * 0.03 + i * 3.1, seed) * 60 + f * wind * 0.3;
      const flick = 0.5 + 0.5 * noise1(f * 0.3 + i, seed + 4);
      const rad = (1.2 + depth * 3.5) * size;
      const c = color ?? (kind === 'gold' ? '#ffd76a' : '#ff8a2a');
      els.push(<circle key={i} cx={x} cy={y} r={rad} fill={c} opacity={flick * opacity} />);
    } else if (kind === 'dust') {
      const x = (r0 * 1080 + f * (0.2 + depth) * speed * 0.6 + noise1(f * 0.01 + i, seed) * 30) % 1180;
      const y = (r1 * 1920 + noise1(f * 0.012 + i * 2, seed + 1) * 40) % 1920;
      els.push(<circle key={i} cx={x} cy={y} r={(0.8 + depth * 2) * size} fill={color ?? '#fff3dc'} opacity={0.25 * depth * opacity} />);
    } else if (kind === 'sparks') {
      const life = 20 + r2 * 20;
      const t = ((f * speed + r0 * life) % life) / life;
      const a = ((dir + (r1 - 0.5) * 70) * Math.PI) / 180;
      const dist = t * (400 + r2 * 900);
      const ox = 540 + (rnd(seed, i + 3000) - 0.5) * 300;
      const oy = 960 + (rnd(seed, i + 4000) - 0.5) * 300;
      const x = ox + Math.cos(a) * dist;
      const y = oy + Math.sin(a) * dist + t * t * 300;
      const len = 30 * (1 - t) + 6;
      els.push(
        <line key={i} x1={x} y1={y} x2={x - Math.cos(a) * len} y2={y - Math.sin(a) * len} stroke={color ?? '#ffd27a'} strokeWidth={2.5 * size} opacity={(1 - t) * opacity} strokeLinecap="round" />
      );
    } else if (kind === 'rain') {
      const vy = (30 + depth * 30) * speed;
      const y = ((r1 * 2200 + f * vy) % 2200) - 140;
      const x = (r0 * 1300 + y * (wind * 0.02)) % 1300 - 100;
      els.push(<line key={i} x1={x} y1={y} x2={x - wind * 0.9} y2={y + 60 + depth * 50} stroke={color ?? '#c9d4dc'} strokeWidth={1 + depth * 1.4} opacity={(0.2 + depth * 0.45) * opacity} />);
    }
  }
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0, mixBlendMode: blend, pointerEvents: 'none', overflow: 'visible'}}>
      {els}
    </svg>
  );
};

/** Drifting smoke from pre-baked sprites. */
export const Smoke: React.FC<{
  count?: number;
  seed?: number;
  opacity?: number;
  speed?: number;
  tint?: string; // css filter to tint smoke
  y?: number; // band centre
  spread?: number;
  scale?: number;
  blend?: React.CSSProperties['mixBlendMode'];
  rise?: number;
}> = ({count = 8, seed = 1, opacity = 0.6, speed = 1, tint, y = 1300, spread = 700, scale = 1, blend, rise = 0.3}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: blend}}>
      {Array.from({length: count}, (_, i) => {
        const r0 = rnd(seed, i);
        const r1 = rnd(seed, i + 77);
        const s = (900 + r1 * 900) * scale;
        const x = ((r0 * 1600 + f * speed * (0.6 + r1)) % 1900) - 400 - s / 2;
        const yy = y + (rnd(seed, i + 33) - 0.5) * spread - f * rise * speed - s / 2;
        const rot = f * 0.15 * (r1 - 0.5) * speed + r0 * 360;
        return (
          <Img
            key={i}
            src={staticFile(`textures/smoke_${i % 4}.png`)}
            style={{position: 'absolute', left: x, top: yy, width: s, height: s, opacity: opacity * (0.5 + r1 * 0.5), transform: `rotate(${rot}deg)`, filter: tint}}
          />
        );
      })}
    </div>
  );
};

/** horizontal fog bank */
export const Fog: React.FC<{y?: number; opacity?: number; speed?: number; h?: number; seed?: number; tint?: string}> = ({y = 1200, opacity = 0.8, speed = 1, h = 700, seed = 0, tint}) => {
  const f = useCurrentFrame();
  const sw = 2048 * (h / 512);
  const x = -((f * speed + seed * 400) % sw);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y - h / 2, height: h, overflow: 'hidden', opacity, pointerEvents: 'none'}}>
      {[0, 1].map((k) => (
        <Img key={k} src={staticFile('textures/fog_strip.png')} style={{position: 'absolute', top: 0, left: x + k * sw, height: h, width: sw, filter: tint}} />
      ))}
    </div>
  );
};
