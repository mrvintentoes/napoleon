import React from 'react';

/** Architectural silhouettes, drawn at 1080 wide. Colours default to ink. */
type SP = {color?: string; width?: number; style?: React.CSSProperties; light?: string};

export const Pyramids: React.FC<SP & {shade?: string}> = ({color = '#2a1a08', shade = '#6b4516', width = 1080, style, light = '#e9b85c'}) => (
  <svg viewBox="0 0 1080 520" width={width} height={(width * 520) / 1080} style={{overflow: 'visible', ...style}}>
    <path d="M40,520 L330,120 L620,520 Z" fill={light} />
    <path d="M330,120 L620,520 L420,520 Z" fill={shade} />
    <path d="M520,520 L760,220 L1000,520 Z" fill={light} opacity={0.85} />
    <path d="M760,220 L1000,520 L830,520 Z" fill={shade} opacity={0.85} />
    <path d="M-60,520 L90,340 L240,520 Z" fill={light} opacity={0.7} />
    <path d="M90,340 L240,520 L140,520 Z" fill={shade} opacity={0.7} />
    <rect x={-200} y={515} width={1480} height={300} fill={color} />
  </svg>
);

export const NotreDame: React.FC<SP & {windows?: string}> = ({color = '#0b0a10', width = 1080, style, windows = '#ffcf7a'}) => (
  <svg viewBox="0 0 1080 1100" width={width} height={(width * 1100) / 1080} style={{overflow: 'visible', ...style}}>
    <g fill={color}>
      <rect x={180} y={180} width={250} height={920} />
      <rect x={650} y={180} width={250} height={920} />
      <rect x={430} y={420} width={220} height={680} />
      <rect x={170} y={160} width={270} height={30} />
      <rect x={640} y={160} width={270} height={30} />
      {Array.from({length: 9}, (_, i) => (
        <rect key={i} x={180 + i * 28} y={140} width={14} height={30} />
      ))}
      {Array.from({length: 9}, (_, i) => (
        <rect key={`r${i}`} x={650 + i * 28} y={140} width={14} height={30} />
      ))}
      <path d="M470,420 L540,330 L610,420 Z" />
      <rect x={532} y={60} width={16} height={280} />
    </g>
    <g fill={windows}>
      <circle cx={540} cy={560} r={78} opacity={0.9} />
      {[235, 330, 705, 800].map((x) => (
        <path key={x} d={`M${x},420 L${x},330 Q${x + 22},290 ${x + 44},330 L${x + 44},420 Z`} opacity={0.75} />
      ))}
      {[240, 480, 720].map((x) => (
        <path key={`p${x}`} d={`M${x + 20},1100 L${x + 20},900 Q${x + 60},820 ${x + 100},900 L${x + 100},1100 Z`} opacity={0.55} />
      ))}
    </g>
    <g fill="none" stroke={color} strokeWidth={10}>
      <circle cx={540} cy={560} r={78} />
      <path d="M540,482 V638 M462,560 H618 M485,505 L595,615 M595,505 L485,615" strokeWidth={6} />
    </g>
  </svg>
);

export const BrandenburgGate: React.FC<SP> = ({color = '#0b0a10', width = 1080, style}) => (
  <svg viewBox="0 0 1080 700" width={width} height={(width * 700) / 1080} style={{overflow: 'visible', ...style}}>
    <g fill={color}>
      <rect x={100} y={660} width={880} height={40} />
      {Array.from({length: 6}, (_, i) => (
        <rect key={i} x={140 + i * 150} y={320} width={50} height={340} />
      ))}
      <rect x={110} y={270} width={860} height={60} />
      <rect x={240} y={200} width={600} height={70} />
      <rect x={120} y={255} width={840} height={20} />
      {/* quadriga block */}
      <path d="M430,200 L440,120 Q470,80 500,110 L520,60 Q545,40 560,70 L580,110 Q610,80 640,120 L650,200 Z" />
      <rect x={532} y={20} width={16} height={60} />
      <circle cx={540} cy={18} r={16} />
    </g>
  </svg>
);

export const MoscowSkyline: React.FC<SP> = ({color = '#0b0706', width = 1080, style}) => {
  const onion = (x: number, base: number, w: number, h: number) =>
    `M${x - w / 2},${base} L${x - w / 2},${base - h * 0.45} Q${x - w * 0.75},${base - h * 0.75} ${x},${base - h} Q${x + w * 0.75},${base - h * 0.75} ${x + w / 2},${base - h * 0.45} L${x + w / 2},${base} Z`;
  return (
    <svg viewBox="0 0 1080 800" width={width} height={(width * 800) / 1080} style={{overflow: 'visible', ...style}}>
      <g fill={color}>
        {/* Kremlin wall + towers */}
        <rect x={-100} y={620} width={1280} height={200} />
        {Array.from({length: 26}, (_, i) => (
          <path key={i} d={`M${-100 + i * 50},620 L${-90 + i * 50},590 L${-70 + i * 50},600 L${-60 + i * 50},590 L${-50 + i * 50},620 Z`} />
        ))}
        {[80, 420, 900].map((x) => (
          <g key={x}>
            <rect x={x - 35} y={470} width={70} height={160} />
            <path d={`M${x - 42},470 L${x},330 L${x + 42},470 Z`} />
            <rect x={x - 3} y={300} width={6} height={40} />
          </g>
        ))}
        {/* Ivan the Great bell tower */}
        <rect x={610} y={250} width={70} height={380} />
        <rect x={600} y={330} width={90} height={16} />
        <rect x={620} y={180} width={50} height={80} />
        <path d={onion(645, 185, 60, 110)} />
        <rect x={642} y={60} width={6} height={30} />
        {/* cathedral domes */}
        <rect x={180} y={470} width={200} height={160} />
        <path d={onion(230, 480, 50, 110)} />
        <path d={onion(330, 480, 50, 110)} />
        <path d={onion(280, 440, 70, 160)} />
        <rect x={740} y={480} width={160} height={150} />
        <path d={onion(780, 490, 44, 95)} />
        <path d={onion(860, 490, 44, 95)} />
        <path d={onion(820, 450, 62, 150)} />
      </g>
    </svg>
  );
};

export const Island: React.FC<SP & {kind?: 'elba' | 'helena'}> = ({color = '#0b0a0a', width = 1080, style, kind = 'helena'}) => (
  <svg viewBox="0 0 1080 300" width={width} height={(width * 300) / 1080} style={{overflow: 'visible', ...style}}>
    {kind === 'helena' ? (
      <path
        fill={color}
        d="M120,300 L150,230 L190,210 L230,150 L270,160 L300,110 L350,120 L390,70 L430,95 L470,60 L520,90 L560,80 L600,120 L640,110 L690,150 L730,140 L770,190 L820,200 L870,250 L920,270 L960,300 Z"
      />
    ) : (
      <path fill={color} d="M60,300 Q180,240 260,200 Q330,120 420,150 Q470,90 560,130 Q640,160 700,210 Q800,230 900,270 L1020,300 Z" />
    )}
  </svg>
);

export const Guillotine: React.FC<SP> = ({color = '#0a0808', width = 400, style}) => (
  <svg viewBox="0 0 400 900" width={width} height={(width * 900) / 400} style={{overflow: 'visible', ...style}}>
    <g fill={color}>
      <rect x={100} y={40} width={26} height={820} />
      <rect x={274} y={40} width={26} height={820} />
      <rect x={80} y={20} width={240} height={34} />
      <path d="M126,210 L274,150 L274,260 L126,260 Z" />
      <rect x={126} y={600} width={148} height={40} />
      <rect x={40} y={850} width={320} height={50} />
    </g>
  </svg>
);

export const LongwoodHouse: React.FC<SP> = ({color = '#0e1012', width = 900, style, light = '#f2c46a'}) => (
  <svg viewBox="0 0 900 300" width={width} height={(width * 300) / 900} style={{overflow: 'visible', ...style}}>
    <g fill={color}>
      <path d="M80,150 L220,70 L360,150 Z" />
      <rect x={100} y={150} width={240} height={150} />
      <rect x={340} y={130} width={440} height={170} />
      <path d="M330,130 L560,80 L790,130 Z" />
      <rect x={640} y={40} width={22} height={70} />
    </g>
    {[400, 470, 540, 610, 680].map((x) => (
      <rect key={x} x={x} y={180} width={34} height={50} fill={light} opacity={x === 540 ? 0.9 : 0.25} />
    ))}
  </svg>
);
