import React from 'react';
import {Img} from 'remotion';
import {AssetId, resolveAsset} from '../data/assets';
import {FrameOpts, frameImage} from './HistoricalImage';
import {Fill} from './core';

/**
 * 2.5D painting: every layer shares the base framing of `base` (so they register
 * perfectly), then each layer is displaced by camera * depth around the focus point.
 *
 * layers: back-to-front, e.g.
 *   [{id:'consul_plate', depth:0.25}, {id:'consul_fg', depth:1, filter:'drop-shadow(...)'}]
 * cam: {x,y} px of camera travel, z = extra zoom (0.1 = +10% for depth 1)
 * Optional `mid` slot renders between layers (smoke, text passing behind Napoleon…).
 */
export type PLayer = {id: AssetId; depth: number; filter?: string; opacity?: number; mask?: string};

export const ParallaxPainting: React.FC<
  FrameOpts & {
    base: AssetId;
    layers: PLayer[];
    cam?: {x?: number; y?: number; z?: number; r?: number};
    between?: Record<number, React.ReactNode>; // index -> node rendered BEFORE layer[index]
    filter?: string;
  }
> = ({base, layers, cam = {}, between = {}, filter, ...o}) => {
  const b = resolveAsset(base);
  if (b.missing) return null;
  const {tx, ty, dw, dh} = frameImage(b.w, b.h, b.focus, {clamp: false, ...o});
  const place = o.place ?? {x: 0.5, y: 0.45};
  const ox = place.x * 1080;
  const oy = place.y * 1920;
  return (
    <Fill style={{overflow: 'hidden', filter}}>
      {layers.map((L, i) => {
        const a = resolveAsset(L.id);
        const d = L.depth;
        const sx = 1 + (cam.z ?? 0) * d;
        return (
          <React.Fragment key={L.id + i}>
            {between[i]}
            {a.missing ? null : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformOrigin: `${ox}px ${oy}px`,
                  transform: `translate(${(cam.x ?? 0) * d}px, ${(cam.y ?? 0) * d}px) scale(${sx}) rotate(${(cam.r ?? 0) * d}deg)`,
                  opacity: L.opacity,
                  WebkitMaskImage: L.mask,
                  maskImage: L.mask,
                }}
              >
                <Img
                  src={a.src}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: dw,
                    height: dh,
                    transform: `translate(${tx}px, ${ty}px)`,
                    filter: [a.grade, L.filter].filter(Boolean).join(' ') || undefined,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
      {between[layers.length]}
    </Fill>
  );
};
