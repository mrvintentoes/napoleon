import React, {CSSProperties} from 'react';
import {Sequence, useCurrentFrame} from 'remotion';

export const W = 1080;
export const H = 1920;

export const Fill: React.FC<{style?: CSSProperties; children?: React.ReactNode; className?: string}> = ({style, children}) => (
  <div style={{position: 'absolute', inset: 0, ...style}}>{children}</div>
);

/** Absolutely positioned box centered at (x,y) */
export const At: React.FC<{x: number; y: number; style?: CSSProperties; children?: React.ReactNode}> = ({x, y, style, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, ...style}}>
    <div style={{position: 'absolute', left: 0, top: 0, transform: 'translate(-50%, -50%)'}}>{children}</div>
  </div>
);

export const useF = () => useCurrentFrame();

/** Render children only inside [from, from+dur) of the current (local) frame, with local frame passed down. */
export const Win: React.FC<{from: number; dur: number; children: (f: number) => React.ReactNode}> = ({from, dur, children}) => {
  const f = useCurrentFrame();
  if (f < from || f >= from + dur) return null;
  return <>{children(f - from)}</>;
};

/** Transform wrapper (camera) — origin at screen center unless given. */
export const Cam: React.FC<{
  x?: number;
  y?: number;
  s?: number;
  r?: number;
  rx?: number;
  ry?: number;
  persp?: number;
  origin?: string;
  filter?: string;
  opacity?: number;
  style?: CSSProperties;
  children?: React.ReactNode;
}> = ({x = 0, y = 0, s = 1, r = 0, rx = 0, ry = 0, persp, origin = '50% 50%', filter, opacity, style, children}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      transformOrigin: origin,
      transform: `${persp ? `perspective(${persp}px) ` : ''}translate(${x}px, ${y}px) rotate(${r}deg) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`,
      filter,
      opacity,
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Segment with its own clock: children receive the LOCAL frame and every
 * useCurrentFrame() inside is local too (it is a Remotion <Sequence>).
 */
export const Seg: React.FC<{from: number; dur?: number; children: (l: number) => React.ReactNode; name?: string}> = ({from, dur, children, name}) => (
  <Sequence from={from} durationInFrames={dur ?? Infinity} layout="none" name={name}>
    <SegInner fn={children} />
  </Sequence>
);
const SegInner: React.FC<{fn: (l: number) => React.ReactNode}> = ({fn}) => {
  const l = useCurrentFrame();
  return <>{fn(l)}</>;
};
