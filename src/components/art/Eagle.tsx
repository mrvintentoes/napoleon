import React, {useId} from 'react';
import {rnd} from '../../utils/animation';

/**
 * Stylized Napoleonic eagle (head turned to its right, wings raised, clutching a
 * thunderbolt), built from individual feather shards so it can crack and shatter.
 *
 * viewBox 0 0 1000 1000, centred at (500,520).
 * shatter: 0..1 — pieces fly apart along their own directions with gravity.
 * crack:   0..1 — draws fracture lines across the body.
 * flat:    single-colour silhouette (for masks / wipes).
 */
type Piece = {d: string; cx: number; cy: number; dir: number; kind: 'wing' | 'tail' | 'body' | 'head' | 'bolt'};

const feather = (sx: number, sy: number, angDeg: number, len: number, width: number) => {
  const a = (angDeg * Math.PI) / 180;
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const nx = -uy;
  const ny = ux;
  const tipX = sx + ux * len;
  const tipY = sy + uy * len;
  const w = width / 2;
  const b1x = sx + nx * w;
  const b1y = sy + ny * w;
  const b2x = sx - nx * w;
  const b2y = sy - ny * w;
  const m1x = sx + ux * len * 0.7 + nx * w * 1.05;
  const m1y = sy + uy * len * 0.7 + ny * w * 1.05;
  const m2x = sx + ux * len * 0.7 - nx * w * 0.9;
  const m2y = sy + uy * len * 0.7 - ny * w * 0.9;
  const d = `M${b1x},${b1y} Q${m1x},${m1y} ${tipX},${tipY} Q${m2x},${m2y} ${b2x},${b2y} Z`;
  return {d, cx: sx + ux * len * 0.55, cy: sy + uy * len * 0.55, dir: a};
};

const buildPieces = (): Piece[] => {
  const pieces: Piece[] = [];
  // wings: 9 feathers each side, fanning from the shoulders, tips raised
  for (let side = -1; side <= 1; side += 2) {
    const sx = 500 + side * 70;
    const sy = 430;
    for (let i = 0; i < 9; i++) {
      const t = i / 8;
      // angles: left wing from 185deg (out, slightly down) to 250deg (up-left)
      const base = 185 + t * 70;
      const ang = side < 0 ? base : 180 - base; // mirror
      const len = 190 + Math.sin(t * Math.PI * 0.85) * 190 + t * 40;
      const f = feather(sx + side * t * 18, sy + (1 - t) * 40, ang, len, 62 - t * 10);
      pieces.push({...f, kind: 'wing'});
    }
    // coverts (short upper wing layer)
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      const base = 200 + t * 55;
      const ang = side < 0 ? base : 180 - base;
      const f = feather(sx, sy + 10, ang, 120 + t * 40, 70);
      pieces.push({...f, kind: 'wing'});
    }
  }
  // tail fan
  for (let i = 0; i < 7; i++) {
    const t = i / 6;
    const f = feather(500, 640, 62 + t * 56, 190 - Math.abs(t - 0.5) * 60, 48);
    pieces.push({...f, kind: 'tail'});
  }
  // body: narrow, chevron-feathered breast
  pieces.push({
    d: 'M500,340 C548,352 566,420 560,500 C555,580 535,640 500,672 C465,640 445,580 440,500 C434,420 452,352 500,340 Z',
    cx: 500,
    cy: 510,
    dir: Math.PI / 2,
    kind: 'body',
  });
  // head in profile (turned to viewer's left), strong hooked beak
  pieces.push({
    d: 'M478,352 C466,318 470,286 494,270 C516,256 544,266 548,292 C552,318 538,340 522,356 Z M478,282 C452,276 428,280 408,296 C404,306 410,318 420,322 C424,312 432,306 444,304 C456,302 468,302 480,300 Z',
    cx: 485,
    cy: 300,
    dir: -Math.PI / 2,
    kind: 'head',
  });
  // thunderbolt
  pieces.push({
    d: 'M330,705 L470,690 L452,712 L540,702 L522,724 L670,712 L560,742 L578,720 L490,732 L506,710 Z',
    cx: 500,
    cy: 712,
    dir: Math.PI / 2,
    kind: 'bolt',
  });
  return pieces;
};

const PIECES = buildPieces();

const CRACKS = [
  'M500,250 L488,320 L510,390 L470,460 L505,540 L480,620 L515,700',
  'M488,320 L420,300 L330,250 L250,170',
  'M470,460 L380,470 L290,430 L170,420',
  'M505,540 L590,560 L690,520 L820,540',
  'M510,390 L600,370 L700,300',
  'M480,620 L420,680 L360,760',
];

export const Eagle: React.FC<{
  size?: number;
  shatter?: number;
  crack?: number;
  flat?: string;
  glow?: number;
  seed?: number;
  flap?: number; // -1..1 wing flap
  style?: React.CSSProperties;
}> = ({size = 600, shatter = 0, crack = 0, flat, glow = 0, seed = 5, flap = 0, style}) => {
  const id = useId().replace(/:/g, '');
  const gold = `url(#g${id})`;
  return (
    <svg viewBox="0 0 1000 1000" width={size} height={size} style={{overflow: 'visible', ...style}}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#fff2b8" />
          <stop offset="0.35" stopColor="#e7b94f" />
          <stop offset="0.7" stopColor="#a8741f" />
          <stop offset="1" stopColor="#5c3b0c" />
        </linearGradient>
        {glow > 0 ? (
          <filter id={`gl${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={12 * glow} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ) : null}
      </defs>
      <g filter={glow > 0 ? `url(#gl${id})` : undefined}>
        {PIECES.map((p, i) => {
          const r1 = rnd(seed, i);
          const r2 = rnd(seed, i + 100);
          const dist = shatter * (350 + r1 * 700);
          const dx = Math.cos(p.dir + (r2 - 0.5) * 0.8) * dist;
          const dy = Math.sin(p.dir + (r2 - 0.5) * 0.8) * dist + shatter * shatter * 900;
          const rot = shatter * (r1 - 0.5) * 540;
          let flapRot = 0;
          if (p.kind === 'wing' && flap !== 0) flapRot = (p.cx < 500 ? 1 : -1) * flap * 14;
          const pivot = p.kind === 'wing' ? `${p.cx < 500 ? 430 : 570} 430` : `${p.cx} ${p.cy}`;
          return (
            <path
              key={i}
              d={p.d}
              fill={flat ?? gold}
              stroke={flat ? flat : '#2b1a05'}
              strokeWidth={flat ? 1 : 5}
              strokeLinejoin="round"
              opacity={1 - Math.max(0, shatter - 0.6) * 2.5}
              transform={`translate(${dx} ${dy}) rotate(${rot + flapRot} ${pivot})`}
            />
          );
        })}
        {!flat ? (
          <g opacity={1 - shatter}>
            <circle cx={486} cy={286} r={5.5} fill="#1a0f02" />
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M${470},${410 + i * 48} L500,${430 + i * 48} L530,${410 + i * 48}`} fill="none" stroke="#5c3b0c" strokeWidth={4} opacity={0.7} />
            ))}
          </g>
        ) : null}
        {crack > 0
          ? CRACKS.map((c, i) => (
              <path
                key={i}
                d={c}
                fill="none"
                stroke="#0b0703"
                strokeWidth={9 - i}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - Math.min(1, Math.max(0, crack * 1.6 - i * 0.12))}
                opacity={1 - shatter}
              />
            ))
          : null}
      </g>
    </svg>
  );
};
