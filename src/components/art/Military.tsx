import React, {useId} from 'react';
import {F} from '../../fonts';
import {rnd} from '../../utils/animation';

/**
 * Blueprint-style field gun (after the Gribeauval system drawings). `draw` 0..1
 * animates the line work; `labels` shows the engineering annotations.
 * viewBox 1000x520
 */
export const CannonBlueprint: React.FC<{size?: number; draw?: number; color?: string; labels?: boolean; recoil?: number}> = ({
  size = 1000,
  draw = 1,
  color = '#e9dcc0',
  labels = true,
  recoil = 0,
}) => {
  const L = (d: string, w = 3, k = 0) => (
    <path d={d} fill="none" stroke={color} strokeWidth={w} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, Math.max(0, draw * 1.4 - k * 0.1))} strokeLinecap="round" />
  );
  return (
    <svg viewBox="0 0 1000 520" width={size} height={(size * 520) / 1000} style={{overflow: 'visible'}}>
      <g transform={`translate(${-recoil * 40} 0)`}>
        {/* barrel */}
        {L('M170,196 L760,214 L760,250 L170,268 Q130,262 128,232 Q130,202 170,196 Z', 4, 0)}
        {L('M110,232 L128,232 M96,232 m-14,0 a14,14 0 1,0 28,0 a14,14 0 1,0 -28,0', 3, 1)}
        {L('M300,200 L300,264 M460,205 L460,259 M620,209 L620,255', 2, 2)}
        {L('M760,214 L790,210 L790,254 L760,250', 3, 2)}
        {/* trunnion */}
        {L('M430,232 m-18,0 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0', 3, 3)}
      </g>
      {/* carriage */}
      {L('M60,420 L430,250 L520,250 L540,300 L150,440 Z', 3, 3)}
      {L('M330,300 L520,300', 2, 4)}
      {/* wheel */}
      {L('M430,380 m-120,0 a120,120 0 1,0 240,0 a120,120 0 1,0 -240,0', 4, 4)}
      {L('M430,380 m-104,0 a104,104 0 1,0 208,0 a104,104 0 1,0 -208,0', 2, 5)}
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <React.Fragment key={i}>{L(`M${430 + Math.cos(a) * 18},${380 + Math.sin(a) * 18} L${430 + Math.cos(a) * 104},${380 + Math.sin(a) * 104}`, 2, 5)}</React.Fragment>;
      })}
      {/* dimension lines */}
      {L('M128,150 L790,150 M128,140 L128,160 M790,140 L790,160', 1.5, 6)}
      {L('M40,500 L960,500', 1, 7)}
      {labels && draw > 0.6 ? (
        <g fontFamily={F.archive} fill={color} opacity={Math.min(1, (draw - 0.6) * 4)}>
          <text x={460} y={138} textAnchor="middle" fontSize={26} fontStyle="italic">
            longueur de la pièce
          </text>
          <text x={40} y={60} fontSize={34} fontWeight={600} letterSpacing={4}>
            CANON DE 12 — SYSTÈME GRIBEAUVAL
          </text>
          <text x={40} y={96} fontSize={24} fontStyle="italic">
            Artillerie de campagne · Pl. IV
          </text>
          <text x={430} y={530} textAnchor="middle" fontSize={22}>
            échelle
          </text>
        </g>
      ) : null}
    </svg>
  );
};

/** Side-view field gun silhouette (for streaking artillery). viewBox 600x300 */
export const CannonSilhouette: React.FC<{size?: number; color?: string; flash?: number; style?: React.CSSProperties}> = ({size = 600, color = '#0a0806', flash = 0, style}) => (
  <svg viewBox="0 0 600 300" width={size} height={size / 2} style={{overflow: 'visible', ...style}}>
    {flash > 0 ? (
      <g opacity={flash}>
        <ellipse cx={560} cy={122} rx={120 * flash + 30} ry={60 * flash + 16} fill="#fff3c0" />
        <ellipse cx={600} cy={122} rx={200 * flash} ry={40 * flash} fill="#ffb347" opacity={0.7} />
      </g>
    ) : null}
    <path d="M120,110 L520,112 L522,134 L120,140 Q92,138 90,125 Q92,112 120,110 Z" fill={color} />
    <path d="M30,250 L270,130 L330,130 L345,160 L80,262 Z" fill={color} />
    <circle cx={270} cy={220} r={72} fill="none" stroke={color} strokeWidth={14} />
    {Array.from({length: 10}, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return <line key={i} x1={270} y1={220} x2={270 + Math.cos(a) * 66} y2={220 + Math.sin(a) * 66} stroke={color} strokeWidth={7} />;
    })}
    <circle cx={270} cy={220} r={14} fill={color} />
  </svg>
);

/** Single infantry silhouette (shako or bearskin). viewBox 60x200 */
const SOLDIER = (hat: 'shako' | 'bearskin' | 'bicorne') => {
  const head =
    hat === 'bearskin'
      ? 'M18,6 Q30,-10 42,6 L44,40 L16,40 Z'
      : hat === 'shako'
      ? 'M19,14 L41,14 L43,38 L17,38 Z'
      : 'M8,34 Q30,12 52,34 Q30,28 8,34 Z';
  return `${head} M22,38 Q30,34 38,38 L38,52 L22,52 Z M16,54 L44,54 L46,120 L40,120 L38,196 L31,196 L30,128 L29,196 L22,196 L20,120 L14,120 Z M46,20 L48,20 L50,150 L46,150 Z M47,2 L48,20 L46,20 Z`;
};

/** A marching rank of soldiers; bob animates with frame. */
export const InfantryRank: React.FC<{
  count?: number;
  spacing?: number;
  h?: number;
  color?: string;
  hat?: 'shako' | 'bearskin' | 'bicorne';
  frame?: number;
  seed?: number;
  style?: React.CSSProperties;
  flip?: boolean;
}> = ({count = 20, spacing = 46, h = 200, color = '#0a0806', hat = 'shako', frame = 0, seed = 1, style, flip}) => {
  const d = SOLDIER(hat);
  const w = count * spacing + 60;
  return (
    <svg viewBox={`0 0 ${w} 210`} width={(w * h) / 200} height={(210 * h) / 200} style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style}}>
      {Array.from({length: count}, (_, i) => {
        const bob = Math.abs(Math.sin((frame + i * 3 + rnd(seed, i) * 10) * 0.25)) * 4;
        return <path key={i} d={d} fill={color} transform={`translate(${i * spacing + rnd(seed, i + 9) * 6} ${-bob})`} />;
      })}
    </svg>
  );
};

/** Three-masted ship of the line silhouette. viewBox 600x520 */
export const Ship: React.FC<{size?: number; color?: string; fire?: number; style?: React.CSSProperties; sails?: string}> = ({size = 600, color = '#0a0806', fire = 0, style, sails}) => (
  <svg viewBox="0 0 600 520" width={size} height={(size * 520) / 600} style={{overflow: 'visible', ...style}}>
    {[150, 300, 440].map((x, i) => (
      <g key={i}>
        <rect x={x - 4} y={60 + i * 8} width={8} height={360} fill={color} />
        {[0, 1, 2].map((k) => (
          <path
            key={k}
            d={`M${x - 70 + k * 8},${90 + k * 95 + i * 8} Q${x},${80 + k * 95 + i * 8} ${x + 70 - k * 8},${90 + k * 95 + i * 8} L${x + 78 - k * 8},${165 + k * 95 + i * 8} Q${x},${185 + k * 95 + i * 8} ${x - 78 + k * 8},${165 + k * 95 + i * 8} Z`}
            fill={sails ?? color}
            opacity={sails ? 0.95 : 1}
          />
        ))}
      </g>
    ))}
    <path d="M20,400 L580,390 L540,470 Q300,500 70,470 Z" fill={color} />
    <path d="M520,392 L600,330 L596,340 L540,396 Z" fill={color} />
    {fire > 0 ? (
      <g opacity={fire}>
        {Array.from({length: 14}, (_, i) => (
          <ellipse key={i} cx={80 + i * 34} cy={420} rx={20} ry={10} fill="#ffcf6b" />
        ))}
      </g>
    ) : null}
  </svg>
);

/** Waving flag. Designs are simplified period flags (labelled on screen where it matters). */
export type FlagKind = 'france' | 'britain' | 'russia' | 'austria' | 'prussia' | 'sweden' | 'spain' | 'bourbon' | 'netherlands' | 'portugal';

const FLAG_ART: Record<FlagKind, React.ReactNode> = {
  france: (
    <>
      <rect x={0} y={0} width={100} height={200} fill="#0b2a78" />
      <rect x={100} y={0} width={100} height={200} fill="#f4f1ea" />
      <rect x={200} y={0} width={100} height={200} fill="#c8102e" />
    </>
  ),
  britain: (
    <>
      <rect width={300} height={200} fill="#012169" />
      <path d="M0,0 L300,200 M300,0 L0,200" stroke="#fff" strokeWidth={40} />
      <path d="M0,0 L300,200 M300,0 L0,200" stroke="#c8102e" strokeWidth={13} />
      <path d="M150,0 V200 M0,100 H300" stroke="#fff" strokeWidth={66} />
      <path d="M150,0 V200 M0,100 H300" stroke="#c8102e" strokeWidth={40} />
    </>
  ),
  russia: (
    <>
      <rect width={300} height={200} fill="#f4f1ea" />
      <path d="M0,0 L300,200 M300,0 L0,200" stroke="#1d4fa0" strokeWidth={42} />
    </>
  ),
  austria: (
    <>
      <rect width={300} height={100} fill="#111" />
      <rect y={100} width={300} height={100} fill="#f2c01e" />
    </>
  ),
  prussia: (
    <>
      <rect width={300} height={200} fill="#f4f1ea" />
      <rect width={300} height={66} fill="#111" />
      <rect y={134} width={300} height={66} fill="#111" />
    </>
  ),
  sweden: (
    <>
      <rect width={300} height={200} fill="#1f5aa6" />
      <path d="M110,0 V200 M0,100 H300" stroke="#f7c21b" strokeWidth={40} />
    </>
  ),
  spain: (
    <>
      <rect width={300} height={200} fill="#c60b1e" />
      <rect y={50} width={300} height={100} fill="#ffc400" />
    </>
  ),
  bourbon: (
    <>
      <rect width={300} height={200} fill="#f7f5ef" />
      {[
        [80, 60],
        [220, 60],
        [150, 140],
      ].map(([x, y], i) => (
        <path key={i} transform={`translate(${x} ${y}) scale(1.4)`} fill="#c9a53c" d="M0,-18 Q6,-8 0,4 Q-6,-8 0,-18 Z M-3,4 Q-16,-6 -14,6 Q-10,12 -3,8 Z M3,4 Q16,-6 14,6 Q10,12 3,8 Z M-9,9 H9 V12 H-9 Z" />
      ))}
    </>
  ),
  netherlands: (
    <>
      <rect width={300} height={67} fill="#ae1c28" />
      <rect y={67} width={300} height={66} fill="#fff" />
      <rect y={133} width={300} height={67} fill="#21468b" />
    </>
  ),
  portugal: (
    <>
      <rect width={300} height={200} fill="#f4f1ea" />
      <circle cx={150} cy={100} r={46} fill="#1f5aa6" stroke="#c9a53c" strokeWidth={8} />
    </>
  ),
};

export const Flag: React.FC<{kind: FlagKind; width?: number; frame?: number; wave?: number; pole?: boolean; style?: React.CSSProperties}> = ({
  kind,
  width = 300,
  frame = 0,
  wave = 1,
  pole = true,
  style,
}) => {
  const id = useId().replace(/:/g, '');
  const N = 20;
  const sw = 300 / N;
  return (
    <svg viewBox="-12 -20 324 250" width={width} height={(width * 250) / 324} style={{overflow: 'visible', ...style}}>
      <defs>
        <g id={`art${id}`}>{FLAG_ART[kind]}</g>
        {Array.from({length: N}, (_, i) => (
          <clipPath key={i} id={`c${id}_${i}`}>
            <rect x={i * sw - 0.5} y={-10} width={sw + 1.2} height={230} />
          </clipPath>
        ))}
      </defs>
      {pole ? <rect x={-10} y={-20} width={8} height={250} fill="#3a2a16" /> : null}
      {Array.from({length: N}, (_, i) => {
        const u = i / N;
        const ph = frame * 0.22 - u * 5;
        const dy = Math.sin(ph) * 10 * u * wave;
        const shade = Math.cos(ph) * 0.22 * wave * Math.min(1, u * 3);
        return (
          <g key={i} clipPath={`url(#c${id}_${i})`} transform={`translate(0 ${dy})`}>
            <use href={`#art${id}`} />
            <rect x={i * sw - 0.5} y={0} width={sw + 1.2} height={200} fill={shade > 0 ? '#fff' : '#000'} opacity={Math.abs(shade)} />
          </g>
        );
      })}
    </svg>
  );
};

/** Crossed sabres battle marker. viewBox 100x100 */
export const CrossedSabres: React.FC<{size?: number; color?: string}> = ({size = 60, color = '#f4ead5'}) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{overflow: 'visible'}}>
    <path d="M15,15 Q55,40 85,85" stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M85,15 Q45,40 15,85" stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M70,78 L92,70 M30,78 L8,70" stroke={color} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

/** Curved cavalry sabre. viewBox 800x120 */
export const Sabre: React.FC<{size?: number; color?: string; glint?: number}> = ({size = 800, color = '#dfe3e8', glint = 0}) => (
  <svg viewBox="0 0 800 120" width={size} height={(size * 120) / 800} style={{overflow: 'visible'}}>
    <path d="M140,62 Q450,70 790,20 Q470,54 140,52 Z" fill={color} />
    <path d="M140,50 L140,66 L40,74 Q20,58 40,44 Z" fill="#c9a53c" />
    <path d="M140,40 Q170,58 140,80" stroke="#c9a53c" strokeWidth={8} fill="none" />
    {glint > 0 ? <ellipse cx={180 + glint * 580} cy={58 - glint * 30} rx={60} ry={6} fill="#fff" opacity={0.9} /> : null}
  </svg>
);
