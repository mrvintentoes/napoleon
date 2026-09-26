import React, {CSSProperties} from 'react';
import {useCurrentFrame} from 'remotion';
import {F, FontKey, FW} from '../fonts';
import {clamp, kf, rnd, slam} from '../utils/animation';
import {outExpo, outBack, inCubic, SLAM, OVERSHOOT} from '../utils/easing';

export type TextMode = 'slam' | 'stretch' | 'type' | 'rise' | 'flicker' | 'track' | 'zoom' | 'cut' | 'fall' | 'drop';

export type ImpactProps = {
  text: string;
  at?: number; // local frame of entrance
  out?: number; // local frame of exit (optional)
  outMode?: 'blur' | 'cut' | 'shrink' | 'fall' | 'scatter';
  mode?: TextMode;
  font?: FontKey;
  size: number;
  color?: string;
  x?: number;
  y?: number;
  rot?: number;
  tracking?: number; // em
  stroke?: string; // outline color -> transparent fill outline text
  strokeW?: number;
  glow?: string;
  shadow?: string;
  chroma?: number; // px RGB ghost offset
  italic?: boolean;
  weight?: number;
  scaleX?: number;
  scale?: number;
  opacity?: number;
  lineHeight?: number;
  align?: 'center' | 'left' | 'right';
  width?: number;
  blend?: CSSProperties['mixBlendMode'];
  gradient?: string; // background-clip text
  style?: CSSProperties;
  speed?: number; // mode speed multiplier
  noFit?: boolean; // allow intentional overflow
  maxW?: number;
};

/**
 * The workhorse title component. Positioned by its centre at (x,y).
 * All entrance modes are frame-deterministic and "edited" (fast, overshooting)
 * rather than linear fades.
 */
export const TypographyImpact: React.FC<ImpactProps> = (p) => {
  const frame = useCurrentFrame();
  const {
    text,
    at = 0,
    out,
    outMode = 'blur',
    mode = 'slam',
    font = 'grotesk',
    size,
    color = '#fff',
    x = 540,
    y = 960,
    rot = 0,
    tracking = 0,
    stroke,
    strokeW = 3,
    glow,
    shadow,
    chroma = 0,
    italic,
    weight,
    scaleX = 1,
    scale = 1,
    opacity = 1,
    lineHeight = 0.9,
    align = 'center',
    width,
    blend,
    gradient,
    style,
    speed = 1,
    noFit,
    maxW,
  } = p;
  // estimate rendered width from per-font average glyph advance; shrink to fit the frame
  const ADV: Record<FontKey, number> = {grotesk: 0.58, cond: 0.56, imperial: 0.88, didone: 0.68, archive: 0.66};
  const longest = width ? 0 : Math.max(...text.split('\n').map((t) => t.length));
  const limit = maxW ?? (Math.abs(Math.abs(rot) - 90) < 5 ? 1820 : 1030);
  const est = size * (longest * (ADV[font] + tracking)) * scaleX;
  const fitK = !noFit && est > limit ? limit / est : 1;
  const f = (frame - at) * speed;
  if (f < 0) return null;
  if (out !== undefined && frame >= out + (outMode === 'cut' ? 0 : 10)) return null;

  let s = 1;
  let sx = 1;
  let sy = 1;
  let blur = 0;
  let r = 0;
  let o = 1;
  let dy = 0;
  let track = tracking;
  let shown = text;
  let clip: string | undefined;

  switch (mode) {
    case 'slam': {
      const k = slam(f, 0, {from: 4.2, dur: 7, blur: 36, rot: -4});
      s = k.scale;
      blur = k.blur;
      r = k.rot;
      o = k.opacity;
      break;
    }
    case 'drop': {
      const t = clamp(f / 8);
      s = kf(f, [
        [0, 0.2],
        [6, 1.12, SLAM],
        [12, 1, outBack(2)],
      ]);
      blur = (1 - t) * 18;
      o = clamp(f / 2);
      break;
    }
    case 'stretch': {
      const t = SLAM(clamp(f / 9));
      sx = 3.4 - 2.4 * t;
      sy = 0.15 + 0.85 * t;
      blur = (1 - t) * 30;
      o = clamp(f / 2);
      break;
    }
    case 'zoom': {
      const t = outExpo(clamp(f / 14));
      s = 0.15 + 0.85 * t;
      blur = (1 - t) * 14;
      o = clamp(f / 3);
      break;
    }
    case 'rise': {
      const t = outExpo(clamp(f / 16));
      dy = (1 - t) * size * 0.9;
      clip = `inset(-20% -20% ${(1 - t) * 0}% -20%)`;
      o = clamp(f / 4);
      break;
    }
    case 'fall': {
      const t = OVERSHOOT(clamp(f / 12));
      dy = -(1 - t) * size * 1.4;
      o = clamp(f / 3);
      break;
    }
    case 'type': {
      const n = Math.floor(f / 1.5) + 1;
      shown = text.slice(0, Math.min(text.length, n));
      break;
    }
    case 'flicker': {
      o = f < 10 ? (rnd(Math.floor(f), 3) > 0.45 ? 1 : 0.1) : 1;
      break;
    }
    case 'track': {
      const t = outExpo(clamp(f / 20));
      track = tracking + (1 - t) * 1.2;
      o = clamp(f / 5);
      blur = (1 - t) * 8;
      break;
    }
    case 'cut':
    default:
      break;
  }

  if (out !== undefined && frame >= out) {
    const t = clamp((frame - out) / 8);
    if (outMode === 'cut') o = 0;
    if (outMode === 'blur') {
      s *= 1 + inCubic(t) * 1.8;
      blur += t * 40;
      o *= 1 - t;
    }
    if (outMode === 'shrink') {
      s *= 1 - inCubic(t) * 0.95;
      o *= 1 - t * 0.5;
    }
    if (outMode === 'fall') {
      dy += inCubic(t) * 900;
      r += t * 12;
    }
    if (outMode === 'scatter') {
      track += t * 2;
      blur += t * 20;
      o *= 1 - t;
    }
  }

  const base: CSSProperties = {
    fontFamily: F[font],
    fontWeight: weight ?? FW[font],
    fontStyle: italic ? 'italic' : 'normal',
    fontSize: size,
    lineHeight,
    letterSpacing: `${track}em`,
    whiteSpace: width ? 'normal' : 'pre',
    textAlign: align,
    width,
    color: stroke ? 'transparent' : color,
    WebkitTextStroke: stroke ? `${strokeW}px ${stroke}` : undefined,
    textShadow: [glow ? `0 0 ${size * 0.08}px ${glow}, 0 0 ${size * 0.25}px ${glow}` : '', shadow ?? ''].filter(Boolean).join(', ') || undefined,
    ...(gradient
      ? {backgroundImage: gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}
      : {}),
    ...style,
  };

  const transform = `translate(-50%, -50%) translateY(${dy}px) rotate(${rot + r}deg) scale(${s * scale * fitK}) scaleX(${sx * scaleX}) scaleY(${sy})`;

  const wrap: CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    transform,
    filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
    opacity: o * opacity,
    mixBlendMode: blend,
    clipPath: clip,
    willChange: 'transform',
  };

  if (chroma > 0.5) {
    return (
      <div style={wrap}>
        <div style={{...base, position: 'absolute', left: -chroma, top: 0, color: '#ff1a3a', WebkitTextStroke: undefined, mixBlendMode: 'screen', opacity: 0.85, textShadow: undefined, backgroundImage: undefined}}>
          {shown}
        </div>
        <div style={{...base, position: 'absolute', left: chroma, top: 0, color: '#1ae0ff', WebkitTextStroke: undefined, mixBlendMode: 'screen', opacity: 0.85, textShadow: undefined, backgroundImage: undefined}}>
          {shown}
        </div>
        <div style={{...base, position: 'relative'}}>{shown}</div>
      </div>
    );
  }
  return (
    <div style={wrap}>
      <div style={base}>{shown}</div>
    </div>
  );
};

/** Letter-by-letter stagger slam (each glyph its own slam) */
export const StaggerText: React.FC<Omit<ImpactProps, 'mode'> & {stagger?: number}> = ({stagger = 2, text, x = 540, y = 960, size, font = 'grotesk', tracking = 0, at = 0, ...rest}) => {
  const chars = text.split('');
  // approximate advance per char so glyphs can be positioned independently
  const adv = size * (font === 'grotesk' ? 0.5 : font === 'imperial' ? 0.78 : 0.62) + tracking * size;
  const total = adv * chars.length;
  return (
    <>
      {chars.map((c, i) =>
        c === ' ' ? null : (
          <TypographyImpact key={i} {...rest} text={c} font={font} size={size} x={x - total / 2 + adv * (i + 0.5)} y={y} at={at + i * stagger} mode="slam" />
        )
      )}
    </>
  );
};
