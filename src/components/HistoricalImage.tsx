import React, {CSSProperties} from 'react';
import {Img} from 'remotion';
import {AssetId, resolveAsset} from '../data/assets';
import {H, W} from './core';

/**
 * Composition-aware image framing.
 *  - never stretches; `zoom=1` is exact "cover"
 *  - puts the asset's focus point (e.g. Napoleon's face) at `place` on screen
 *  - clamps so the frame is always covered (no black bars) unless clamp=false
 */
export type FrameOpts = {
  zoom?: number;
  place?: {x: number; y: number};
  focus?: {x: number; y: number};
  dx?: number;
  dy?: number;
  clamp?: boolean;
  boxW?: number;
  boxH?: number;
};

export const frameImage = (w: number, h: number, focus: {x: number; y: number}, o: FrameOpts) => {
  const bw = o.boxW ?? W;
  const bh = o.boxH ?? H;
  const zoom = o.zoom ?? 1;
  const place = o.place ?? {x: 0.5, y: 0.45};
  const s = Math.max(bw / w, bh / h) * zoom;
  const fx = (o.focus ?? focus).x * w * s;
  const fy = (o.focus ?? focus).y * h * s;
  let tx = place.x * bw - fx + (o.dx ?? 0);
  let ty = place.y * bh - fy + (o.dy ?? 0);
  if (o.clamp !== false) {
    tx = Math.min(0, Math.max(bw - w * s, tx));
    ty = Math.min(0, Math.max(bh - h * s, ty));
  }
  return {s, tx, ty, dw: w * s, dh: h * s};
};

export type HistoricalImageProps = FrameOpts & {
  id: AssetId;
  filter?: string;
  opacity?: number;
  rotate?: number;
  blend?: CSSProperties['mixBlendMode'];
  style?: CSSProperties;
  flipX?: boolean;
  /** show a small "placeholder" tag when a fallback is in use (studio only) */
};

export const HistoricalImage: React.FC<HistoricalImageProps> = ({id, filter, opacity, rotate = 0, blend, style, flipX, ...o}) => {
  const a = resolveAsset(id);
  if (a.missing) return null;
  const {tx, ty, dw, dh} = frameImage(a.w, a.h, a.focus, o);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity,
        mixBlendMode: blend,
        transform: rotate || flipX ? `rotate(${rotate}deg) scaleX(${flipX ? -1 : 1})` : undefined,
        ...style,
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
          filter: [a.grade, filter].filter(Boolean).join(' ') || undefined,
        }}
      />
    </div>
  );
};

/**
 * Cutout placed by its alpha bounding box: centre of the figure at (x,y), bbox height = h.
 */
export const Figure: React.FC<{
  id: AssetId;
  x: number;
  y: number;
  h: number;
  rotate?: number;
  flipX?: boolean;
  filter?: string;
  opacity?: number;
  blend?: CSSProperties['mixBlendMode'];
  anchor?: 'center' | 'bottom';
  style?: CSSProperties;
}> = ({id, x, y, h, rotate = 0, flipX, filter, opacity, blend, anchor = 'center', style}) => {
  const a = resolveAsset(id);
  if (a.missing) return null;
  const bb = a.bbox ?? [0, 0, a.w, a.h];
  const bw = bb[2] - bb[0];
  const bh = bb[3] - bb[1];
  const s = h / bh;
  const cx = (bb[0] + bw / 2) * s;
  const cy = (anchor === 'bottom' ? bb[3] : bb[1] + bh / 2) * s;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 0,
        height: 0,
        transform: `rotate(${rotate}deg) scaleX(${flipX ? -1 : 1})`,
        opacity,
        mixBlendMode: blend,
        ...style,
      }}
    >
      <Img
        src={a.src}
        style={{
          position: 'absolute',
          left: -cx,
          top: -cy,
          width: a.w * s,
          height: a.h * s,
          filter: [a.grade, filter].filter(Boolean).join(' ') || undefined,
          maxWidth: 'none',
        }}
      />
    </div>
  );
};
