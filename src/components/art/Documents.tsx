import React from 'react';
import {F} from '../../fonts';
import {rnd} from '../../utils/animation';

/**
 * A period document: parchment sheet, real title (only verified titles are passed in),
 * body rendered as ruled "text lines" (abstract, no fake prose), optional seal.
 */
export const Doc: React.FC<{
  title: string;
  sub?: string;
  w?: number;
  h?: number;
  seed?: number;
  seal?: 'N' | 'RF' | 'none';
  lines?: number;
  tint?: string;
  style?: React.CSSProperties;
  reveal?: number; // 0..1 lines revealed
  stamp?: string; // big overprint e.g. "ABROGÉ"
}> = ({title, sub, w = 620, h = 820, seed = 1, seal = 'N', lines = 18, tint = '#efe2c2', style, reveal = 1, stamp}) => (
  <div
    style={{
      position: 'relative',
      width: w,
      height: h,
      background: `linear-gradient(160deg, ${tint}, #d9c49a)`,
      boxShadow: '0 30px 60px rgba(0,0,0,0.55), inset 0 0 60px rgba(120,80,30,0.35)',
      padding: w * 0.08,
      boxSizing: 'border-box',
      overflow: 'hidden',
      ...style,
    }}
  >
    <div style={{fontFamily: F.imperial, fontWeight: 700, fontSize: w * 0.052, color: '#2a1a0a', textAlign: 'center', letterSpacing: '0.06em', lineHeight: 1.15}}>{title}</div>
    {sub ? <div style={{fontFamily: F.archive, fontStyle: 'italic', fontSize: w * 0.036, color: '#4a3218', textAlign: 'center', marginTop: 10}}>{sub}</div> : null}
    <div style={{height: 2, background: '#6b4a22', margin: `${w * 0.04}px ${w * 0.1}px`}} />
    {Array.from({length: lines}, (_, i) => {
      const vis = i / lines < reveal;
      const lw = 55 + rnd(seed, i) * 45;
      return (
        <div
          key={i}
          style={{
            height: w * 0.012,
            width: `${i % 6 === 5 ? lw * 0.5 : lw}%`,
            background: '#3b2710',
            opacity: vis ? 0.55 : 0,
            margin: `${w * 0.022}px 0`,
            borderRadius: 2,
          }}
        />
      );
    })}
    {seal !== 'none' ? (
      <div
        style={{
          position: 'absolute',
          right: w * 0.1,
          bottom: w * 0.08,
          width: w * 0.2,
          height: w * 0.2,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #d23a2a, #7c0f08)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: F.imperial,
          fontWeight: 900,
          fontSize: w * 0.08,
          color: '#f5c6a0',
        }}
      >
        {seal}
      </div>
    ) : null}
    {stamp ? (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%,-50%) rotate(-18deg)',
          fontFamily: F.grotesk,
          fontSize: w * 0.2,
          color: 'rgba(170,20,20,0.85)',
          border: `${w * 0.012}px solid rgba(170,20,20,0.85)`,
          padding: '0 0.2em',
          letterSpacing: '0.05em',
        }}
      >
        {stamp}
      </div>
    ) : null}
  </div>
);

/** Procedural handwriting-like strokes (abstract — not real text). viewBox 1000 x (rows*70) */
export const Handwriting: React.FC<{rows?: number; seed?: number; draw?: number; color?: string; width?: number}> = ({
  rows = 6,
  seed = 3,
  draw = 1,
  color = '#2a1a0a',
  width = 900,
}) => {
  const paths = Array.from({length: rows}, (_, r) => {
    let d = `M20,${50 + r * 70}`;
    let x = 20;
    let k = 0;
    const end = 700 + rnd(seed, r) * 260;
    while (x < end) {
      const hgt = 14 + rnd(seed + r, k) * 26;
      const step = 10 + rnd(seed + r, k + 50) * 14;
      d += ` q${step / 2},${-hgt} ${step},0 t${step},${(rnd(seed + r, k + 99) - 0.5) * 8}`;
      x += step * 2;
      k++;
      if (rnd(seed + r, k + 7) < 0.12) {
        x += 18;
        d += ` m18,0`;
      }
    }
    return d;
  });
  return (
    <svg viewBox={`0 0 1000 ${rows * 70 + 40}`} width={width} style={{overflow: 'visible'}}>
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - Math.min(1, Math.max(0, draw * rows - i))}
        />
      ))}
    </svg>
  );
};
