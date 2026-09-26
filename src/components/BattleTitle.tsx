import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, pulse} from '../utils/animation';
import {TypographyImpact} from './TypographyImpact';
import {Rule} from './DateCard';

/**
 * Battle name slam with date line + ruled underline + ghost echo.
 * Default look: huge condensed grotesk, tiny archival date above.
 */
export const BattleTitle: React.FC<{
  name: string;
  date?: string;
  at?: number;
  out?: number;
  y?: number;
  x?: number;
  size?: number;
  color?: string;
  accent?: string;
  font?: 'grotesk' | 'imperial' | 'didone' | 'cond';
  echo?: boolean;
  rot?: number;
  chroma?: number;
  mode?: 'slam' | 'stretch' | 'drop' | 'zoom' | 'cut';
}> = ({name, date, at = 0, out, y = 960, x = 540, size = 260, color = '#fff', accent = '#e8c46a', font = 'grotesk', echo = true, rot = 0, chroma = 0, mode = 'slam'}) => {
  const f = useCurrentFrame();
  const fit = Math.min(size, (1000 / Math.max(1, name.length)) * (font === 'grotesk' ? 1.9 : font === 'imperial' ? 1.25 : 1.5));
  const e = pulse(f, at + 6, 10);
  return (
    <>
      {echo && f >= at + 6 && f < at + 26 ? (
        <TypographyImpact text={name} at={at + 6} mode="cut" font={font} size={fit} x={x} y={y} rot={rot} stroke={accent} strokeW={2} scale={1 + (1 - e) * 0.5} opacity={e * 0.8} out={out} outMode="cut" />
      ) : null}
      <TypographyImpact text={name} at={at} out={out} mode={mode} font={font} size={fit} x={x} y={y} rot={rot} color={color} chroma={chroma} shadow="0 10px 40px rgba(0,0,0,0.6)" />
      {date ? (
        <>
          <TypographyImpact text={date.toUpperCase()} at={at + 3} out={out} mode="track" font="archive" size={Math.max(30, fit * 0.16)} x={x} y={y - fit * 0.62} color={accent} tracking={0.3} weight={600} />
          {f < (out ?? 1e9) ? <Rule at={at + 5} y={y + fit * 0.52} w={Math.min(900, fit * name.length * 0.45)} color={accent} x={x} /> : null}
        </>
      ) : null}
    </>
  );
};

/** fraction of the way through a hold — handy for secondary motion */
export const holdT = (f: number, at: number, len: number) => clamp((f - at) / len);
