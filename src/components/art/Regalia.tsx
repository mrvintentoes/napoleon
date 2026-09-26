import React, {useId} from 'react';
import {F} from '../../fonts';

/** MOTIF 4 — Napoleon's bicorne, worn "en bataille" (side to side). viewBox 400x170 */
export const BICORNE_PATH =
  'M8,138 C30,128 62,72 110,44 C150,20 250,20 290,44 C338,72 370,128 392,138 C340,124 270,116 200,116 C130,116 60,124 8,138 Z';

export const Bicorne: React.FC<{size?: number; color?: string; cockade?: boolean; style?: React.CSSProperties; trim?: string}> = ({
  size = 400,
  color = '#0b0907',
  cockade = true,
  trim,
  style,
}) => (
  <svg viewBox="0 0 400 170" width={size} height={(size * 170) / 400} style={{overflow: 'visible', ...style}}>
    <path d={BICORNE_PATH} fill={color} />
    {trim ? <path d="M18,134 C70,121 130,114 200,114 C270,114 330,121 382,134" fill="none" stroke={trim} strokeWidth={3} /> : null}
    {cockade ? (
      <g transform="translate(292 62)">
        <circle r={17} fill="#c8102e" />
        <circle r={11.5} fill="#f4f1ea" />
        <circle r={6} fill="#0b2a78" />
      </g>
    ) : null}
  </svg>
);

/** CSS mask-image data URI of the bicorne, for wipes */
export const bicorneMask = () =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 170'><path d='${BICORNE_PATH}' fill='black'/></svg>`)}")`;

/** Laurel wreath — `grow` 0..1 sprouts leaves from the base up. viewBox 600x600 */
export const Laurel: React.FC<{size?: number; grow?: number; color?: string; style?: React.CSSProperties}> = ({size = 600, grow = 1, color, style}) => {
  const id = useId().replace(/:/g, '');
  const leaves: React.ReactNode[] = [];
  const N = 16;
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      if (t > grow) continue;
      const a = Math.PI / 2 + side * (0.25 + t * 2.35); // from bottom, around the sides
      const R = 230;
      const x = 300 + Math.cos(a) * R;
      const y = 300 + Math.sin(a) * R;
      const tang = (a * 180) / Math.PI + (side > 0 ? 90 : -90);
      for (const off of [-1, 1]) {
        leaves.push(
          <ellipse
            key={`${side}-${i}-${off}`}
            cx={0}
            cy={-26}
            rx={11}
            ry={30}
            fill={color ?? `url(#lg${id})`}
            stroke={color ? undefined : '#3d2a08'}
            strokeWidth={2}
            transform={`translate(${x} ${y}) rotate(${tang + off * 38 * side}) `}
          />
        );
      }
    }
  }
  return (
    <svg viewBox="0 0 600 600" width={size} height={size} style={{overflow: 'visible', ...style}}>
      <defs>
        <linearGradient id={`lg${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe9a6" />
          <stop offset="0.5" stopColor="#d4a43a" />
          <stop offset="1" stopColor="#7a5213" />
        </linearGradient>
      </defs>
      {leaves}
    </svg>
  );
};

/** Imperial crown (stylized after the 1804 "Charlemagne" crown): band, arches, orb and cross. viewBox 500x500 */
export const Crown: React.FC<{size?: number; spin?: number; glow?: boolean; flat?: string; style?: React.CSSProperties}> = ({size = 500, spin = 0, glow, flat, style}) => {
  const id = useId().replace(/:/g, '');
  const g = flat ?? `url(#cg${id})`;
  // spin: fake 3D by compressing arches with cos
  const arches = [-1, -0.6, -0.2, 0.2, 0.6, 1].map((k) => {
    const a = k * 1.2 + spin;
    return {x: Math.sin(a) * 170, z: Math.cos(a)};
  });
  return (
    <svg viewBox="0 0 500 500" width={size} height={size} style={{overflow: 'visible', ...style}}>
      <defs>
        <linearGradient id={`cg${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4c4" />
          <stop offset="0.45" stopColor="#e2b24a" />
          <stop offset="1" stopColor="#6e4910" />
        </linearGradient>
        <radialGradient id={`gem${id}`}>
          <stop offset="0" stopColor="#ff6b6b" />
          <stop offset="1" stopColor="#7a0010" />
        </radialGradient>
        <filter id={`cgl${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={glow ? `url(#cgl${id})` : undefined}>
        {/* back arches */}
        {arches
          .filter((a) => a.z < 0)
          .map((a, i) => (
            <path key={`b${i}`} d={`M${250 + a.x},${360} Q${250 + a.x * 1.05},${170} 250,${120}`} fill="none" stroke={g} strokeWidth={20} opacity={0.7} strokeLinecap="round" />
          ))}
        {/* band */}
        <path d="M70,350 Q250,395 430,350 L430,420 Q250,465 70,420 Z" fill={g} stroke={flat ? undefined : '#3a2606'} strokeWidth={4} />
        {!flat
          ? [-0.8, -0.4, 0, 0.4, 0.8].map((k, i) => {
              const x = 250 + Math.sin(k + spin * 0.3) * 175;
              return <ellipse key={i} cx={x} cy={392 + Math.abs(k) * -8} rx={16 * Math.cos(k)} ry={20} fill={`url(#gem${id})`} stroke="#3a2606" strokeWidth={3} />;
            })
          : null}
        {/* front arches with leaf fleurons */}
        {arches
          .filter((a) => a.z >= 0)
          .map((a, i) => (
            <g key={`f${i}`}>
              <path d={`M${250 + a.x},${355} Q${250 + a.x * 1.05},${170} 250,${120}`} fill="none" stroke={g} strokeWidth={24} strokeLinecap="round" />
              {[0.25, 0.5, 0.75].map((t) => {
                const x = (1 - t) * (1 - t) * (250 + a.x) + 2 * (1 - t) * t * (250 + a.x * 1.05) + t * t * 250;
                const y = (1 - t) * (1 - t) * 355 + 2 * (1 - t) * t * 170 + t * t * 120;
                return <circle key={t} cx={x} cy={y} r={11} fill={flat ?? '#fff1b5'} stroke={flat ? undefined : '#6e4910'} strokeWidth={2} />;
              })}
            </g>
          ))}
        {/* orb + cross */}
        <circle cx={250} cy={100} r={34} fill={g} stroke={flat ? undefined : '#3a2606'} strokeWidth={4} />
        <rect x={243} y={20} width={14} height={60} fill={g} />
        <rect x={222} y={36} width={56} height={13} fill={g} />
      </g>
    </svg>
  );
};

/** Légion d'honneur star (5 swallow-tailed arms, laurel ring). viewBox 400x400 */
export const LegionStar: React.FC<{size?: number; style?: React.CSSProperties}> = ({size = 400, style}) => {
  const arms = Array.from({length: 5}, (_, i) => {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const r = (d: number, off: number) => [200 + Math.cos(a + off) * d, 200 + Math.sin(a + off) * d];
    const [x1, y1] = r(40, -0.2);
    const [x2, y2] = r(175, -0.22);
    const [x3, y3] = r(140, 0);
    const [x4, y4] = r(175, 0.22);
    const [x5, y5] = r(40, 0.2);
    return `M200,200 L${x1},${y1} L${x2},${y2} L${x3},${y3} L${x4},${y4} L${x5},${y5} Z`;
  });
  return (
    <svg viewBox="0 0 400 400" width={size} height={size} style={{overflow: 'visible', ...style}}>
      {arms.map((d, i) => (
        <path key={i} d={d} fill="#f7f4ee" stroke="#c9972e" strokeWidth={7} strokeLinejoin="round" />
      ))}
      <circle cx={200} cy={200} r={52} fill="#d9a93e" stroke="#6e4910" strokeWidth={5} />
      <circle cx={200} cy={200} r={38} fill="#1b2e7a" stroke="#f3e2a6" strokeWidth={4} />
      <text x={200} y={216} textAnchor="middle" fontFamily={F.imperial} fontWeight={900} fontSize={46} fill="#f3e2a6">
        N
      </text>
    </svg>
  );
};

/** Napoleonic bee — used as a tiled imperial pattern. viewBox 100x100 */
export const BEE_SVG = (fill = '#d9a93e') =>
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='${fill}'><ellipse cx='50' cy='22' rx='9' ry='8'/><ellipse cx='50' cy='42' rx='12' ry='13'/><path d='M38,56 Q50,95 62,56 Z'/><ellipse cx='30' cy='38' rx='18' ry='9' transform='rotate(-35 30 38)' opacity='0.85'/><ellipse cx='70' cy='38' rx='18' ry='9' transform='rotate(35 70 38)' opacity='0.85'/><rect x='42' y='64' width='16' height='3' fill='black' opacity='.35'/><rect x='44' y='72' width='12' height='3' fill='black' opacity='.35'/></g></svg>`;

export const BeeField: React.FC<{opacity?: number; size?: number; offset?: number; color?: string}> = ({opacity = 0.25, size = 90, offset = 0, color = '#d9a93e'}) => (
  <div
    style={{
      position: 'absolute',
      inset: -200,
      opacity,
      backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(BEE_SVG(color))}")`,
      backgroundSize: `${size}px ${size}px`,
      backgroundPosition: `${offset}px ${offset * 0.5}px`,
    }}
  />
);

/** "N" in a laurel wreath */
export const NMonogram: React.FC<{size?: number; grow?: number; color?: string}> = ({size = 500, grow = 1, color = '#f3e2a6'}) => (
  <div style={{position: 'relative', width: size, height: size}}>
    <Laurel size={size} grow={grow} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: F.imperial,
        fontWeight: 900,
        fontSize: size * 0.5,
        color,
        textShadow: '0 0 30px rgba(255,200,80,0.6)',
      }}
    >
      N
    </div>
  </div>
);
