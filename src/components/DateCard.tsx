import React from 'react';
import {useCurrentFrame} from 'remotion';
import {F} from '../fonts';
import {clamp} from '../utils/animation';
import {outExpo} from '../utils/easing';
import {TypographyImpact} from './TypographyImpact';

/**
 * Tiny archival line + huge date. e.g. small "2 December 1805" over enormous "1805".
 */
export const DateCard: React.FC<{
  small?: string;
  big: string;
  at?: number;
  out?: number;
  y?: number;
  x?: number;
  bigSize?: number;
  color?: string;
  accent?: string;
  bigMode?: 'slam' | 'stretch' | 'zoom' | 'cut' | 'drop';
  outline?: boolean;
}> = ({small, big, at = 0, out, y = 960, x = 540, bigSize = 420, color = '#f4ead5', accent = '#d6b25e', bigMode = 'slam', outline}) => (
  <>
    <TypographyImpact
      text={big}
      at={at + (small ? 4 : 0)}
      out={out}
      mode={bigMode}
      font="didone"
      size={bigSize}
      x={x}
      y={y}
      color={color}
      stroke={outline ? color : undefined}
      strokeW={4}
      tracking={-0.03}
    />
    {small ? (
      <TypographyImpact text={small.toUpperCase()} at={at} out={out} mode="track" font="archive" size={40} x={x} y={y - bigSize * 0.55} color={accent} tracking={0.35} weight={600} />
    ) : null}
  </>
);

/** A thin rule that draws out from the centre */
export const Rule: React.FC<{at: number; y: number; w?: number; color?: string; x?: number; thick?: number}> = ({at, y, w = 600, color = '#d6b25e', x = 540, thick = 3}) => {
  const f = useCurrentFrame();
  const t = outExpo(clamp((f - at) / 18));
  if (f < at) return null;
  return <div style={{position: 'absolute', left: x - (w * t) / 2, top: y, width: w * t, height: thick, background: color, boxShadow: `0 0 12px ${color}`}} />;
};

/** Small caption in archival serif, e.g. a sourced factual line */
export const Caption: React.FC<{text: string; at: number; out?: number; y: number; x?: number; size?: number; color?: string; italic?: boolean}> = ({
  text,
  at,
  out,
  y,
  x = 540,
  size = 34,
  color = '#e9dcc0',
  italic = true,
}) => <TypographyImpact text={text} at={at} out={out} mode="rise" font="archive" size={size} x={x} y={y} color={color} italic={italic} tracking={0.04} weight={400} />;

export const FONT_STACK = F;
