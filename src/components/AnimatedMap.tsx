import React, {createContext, useContext, useId, useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {LonLat, RIVERS, FRENCH_EMPIRE_1811} from '../data/campaigns';
import {F} from '../fonts';
import {graticulePath, landPath, polygonPath, project, routeGeom} from '../utils/geo';
import {clamp} from '../utils/animation';
import {outExpo} from '../utils/easing';
import {CrossedSabres} from './art/Military';

/**
 * MOTIF 3 — the map.
 * One projection for the whole film (utils/geo.ts). The camera is expressed as
 * lon/lat centre + zoom (+ optional 3D tilt/rotation). The SVG viewBox is
 * recomputed per frame, so linework stays razor sharp at any zoom.
 */
export type MapCam = {lon: number; lat: number; zoom: number; tilt?: number; rot?: number};

export type MapTheme = 'parchment' | 'imperial' | 'snow' | 'blood' | 'blueprint' | 'mud' | 'ocean';

const THEMES: Record<MapTheme, {sea: string; land: string; coast: string; ripple: string; grat: string; river: string; label: string; hatch: string}> = {
  parchment: {sea: '#b8c2ad', land: '#ecd8a8', coast: '#3d2a14', ripple: '#5b4a30', grat: '#6b5a3a', river: '#4f6a78', label: '#2a1a0a', hatch: '#8a6a3a'},
  imperial: {sea: '#070b1a', land: '#16203c', coast: '#e3b955', ripple: '#b58a2e', grat: '#2c3a66', river: '#5d7fc4', label: '#f3e2a6', hatch: '#2b3a6a'},
  snow: {sea: '#7d8a96', land: '#e9eef1', coast: '#39424c', ripple: '#56626e', grat: '#9aa6b2', river: '#5c7282', label: '#1d242b', hatch: '#b7c2cc'},
  blood: {sea: '#0e0504', land: '#2c0f0b', coast: '#ff5a3a', ripple: '#8a2a1a', grat: '#3a1510', river: '#a33a2a', label: '#ffd9c8', hatch: '#4a1a12'},
  blueprint: {sea: '#0a2340', land: '#133a64', coast: '#9fd0ff', ripple: '#3f79b3', grat: '#1c4a7a', river: '#9fd0ff', label: '#dff0ff', hatch: '#1f4f82'},
  mud: {sea: '#3d3a2e', land: '#8b7b58', coast: '#1e1a12', ripple: '#2f2a1e', grat: '#5a5040', river: '#2c3a3a', label: '#f2e6c8', hatch: '#6b5d40'},
  ocean: {sea: '#1a2a36', land: '#39434a', coast: '#b9c7cf', ripple: '#51636f', grat: '#2a3c48', river: '#7d95a3', label: '#dfe8ec', hatch: '#465560'},
};

type Ctx = {zoom: number; theme: MapTheme; toScreen: (p: LonLat) => [number, number]};
const MapCtx = createContext<Ctx>({zoom: 1, theme: 'parchment', toScreen: () => [0, 0]});
export const useMap = () => useContext(MapCtx);

const CW = 1700; // container larger than the frame so tilt/rotation never reveals edges
const CH = 2700;

export type MapLabel = {
  at: LonLat;
  text: string;
  sub?: string;
  appear?: number;
  kind?: 'city' | 'battle' | 'region' | 'big' | 'sea';
  dx?: number;
  dy?: number;
  out?: number;
  color?: string;
  size?: number;
};

export const AnimatedMap: React.FC<{
  cam: MapCam;
  theme?: MapTheme;
  labels?: MapLabel[];
  empire?: number; // 0..1 French Empire 1811 fill opacity
  empireColor?: string;
  rivers?: boolean | string[];
  graticule?: boolean;
  children?: React.ReactNode; // SVG in map units (routes, glows…)
  overlay?: React.ReactNode; // HTML in container space (rare)
  opacity?: number;
  filter?: string;
  hatch?: boolean;
}> = ({cam, theme = 'parchment', labels = [], empire = 0, empireColor = '#1f3f9a', rivers = true, graticule = true, children, overlay, opacity = 1, filter, hatch = true}) => {
  const frame = useCurrentFrame();
  const id = useId().replace(/:/g, '');
  const T = THEMES[theme];
  const land = landPath();
  const grat = graticulePath();
  const [cx, cy] = project([cam.lon, cam.lat]);
  const z = cam.zoom;
  const vw = CW / z;
  const vh = CH / z;
  const vb = `${cx - vw / 2} ${cy - vh / 2} ${vw} ${vh}`;
  const toScreen = (p: LonLat): [number, number] => {
    const [x, y] = project(p);
    return [(x - cx) * z + CW / 2, (y - cy) * z + CH / 2];
  };
  const empirePath = useMemo(() => polygonPath(FRENCH_EMPIRE_1811), []);
  const riverList = rivers === true ? Object.keys(RIVERS) : rivers === false ? [] : rivers;

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity, filter, background: T.sea}}>
      <div
        style={{
          position: 'absolute',
          left: (1080 - CW) / 2,
          top: (1920 - CH) / 2,
          width: CW,
          height: CH,
          transformOrigin: '50% 50%',
          transform: `perspective(1600px) rotateX(${cam.tilt ?? 0}deg) rotate(${cam.rot ?? 0}deg)`,
        }}
      >
        <MapCtx.Provider value={{zoom: z, theme, toScreen}}>
          <svg viewBox={vb} width={CW} height={CH} style={{position: 'absolute', inset: 0}}>
            <defs>
              <clipPath id={`land${id}`}>
                <path d={land} />
              </clipPath>
              <pattern id={`hatch${id}`} width={14 / z} height={14 / z} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                <line x1={0} y1={0} x2={0} y2={14 / z} stroke={T.hatch} strokeWidth={1.4 / z} opacity={0.5} />
              </pattern>
            </defs>
            <rect x={cx - vw} y={cy - vh} width={vw * 2} height={vh * 2} fill={T.sea} />
            {graticule ? <path d={grat} fill="none" stroke={T.grat} strokeWidth={1} opacity={0.35} vectorEffect="non-scaling-stroke" /> : null}
            {/* engraved coastal ripples */}
            {[34, 20, 10].map((w, i) => (
              <path key={w} d={land} fill="none" stroke={T.ripple} strokeWidth={w} opacity={0.12 + i * 0.08} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            ))}
            <path d={land} fill={T.land} stroke={T.coast} strokeWidth={2.2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            {hatch ? <rect x={cx - vw} y={cy - vh} width={vw * 2} height={vh * 2} fill={`url(#hatch${id})`} clipPath={`url(#land${id})`} opacity={0.5} /> : null}
            {empire > 0 ? (
              <g clipPath={`url(#land${id})`} opacity={empire}>
                <path d={empirePath} fill={empireColor} opacity={0.62} />
                <path d={empirePath} fill="none" stroke={empireColor} strokeWidth={5} vectorEffect="non-scaling-stroke" />
              </g>
            ) : null}
            {riverList.map((k) => (
              <path key={k} d={routeGeom(RIVERS[k]).d} fill="none" stroke={T.river} strokeWidth={2.4} vectorEffect="non-scaling-stroke" strokeLinecap="round" opacity={0.9} />
            ))}
            {children}
          </svg>
          {labels.map((L, i) => (
            <MapLabelEl key={i} L={L} frame={frame} toScreen={toScreen} color={T.label} />
          ))}
          {overlay}
        </MapCtx.Provider>
      </div>
    </div>
  );
};

const MapLabelEl: React.FC<{L: MapLabel; frame: number; toScreen: (p: LonLat) => [number, number]; color: string}> = ({L, frame, toScreen, color}) => {
  const appear = L.appear ?? 0;
  if (frame < appear) return null;
  if (L.out !== undefined && frame >= L.out) return null;
  const t = outExpo(clamp((frame - appear) / 10));
  const [x, y] = toScreen(L.at);
  const kind = L.kind ?? 'city';
  const size = L.size ?? (kind === 'big' ? 110 : kind === 'region' ? 44 : kind === 'battle' ? 58 : kind === 'sea' ? 36 : 30);
  const font = kind === 'battle' || kind === 'big' ? F.grotesk : kind === 'region' ? F.imperial : F.archive;
  return (
    <div
      style={{
        position: 'absolute',
        left: x + (L.dx ?? 0),
        top: y + (L.dy ?? 0),
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * t})`,
        opacity: t,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        color: L.color ?? color,
        fontFamily: font,
        fontWeight: kind === 'region' ? 700 : kind === 'city' ? 600 : 400,
        fontStyle: kind === 'sea' ? 'italic' : 'normal',
        fontSize: size,
        letterSpacing: kind === 'region' || kind === 'sea' ? '0.18em' : '0.02em',
        textShadow: '0 0 12px rgba(0,0,0,0.35)',
        lineHeight: 1,
      }}
    >
      {kind === 'battle' ? (
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: 6}}>
          <CrossedSabres size={size * 0.9} color={L.color ?? color} />
        </div>
      ) : kind === 'city' ? (
        <div style={{width: 12, height: 12, borderRadius: 6, background: L.color ?? color, margin: '0 auto 8px', boxShadow: '0 0 0 3px rgba(0,0,0,0.25)'}} />
      ) : null}
      {L.text}
      {L.sub ? <div style={{fontFamily: F.archive, fontStyle: 'italic', fontSize: size * 0.45, marginTop: 4, letterSpacing: '0.1em'}}>{L.sub}</div> : null}
    </div>
  );
};

/** Campaign arrow: route drawn to `progress`, arrowhead riding the tip. Children of AnimatedMap. */
export const AnimatedArrow: React.FC<{
  route: LonLat[];
  progress: number;
  color?: string;
  width?: number; // screen px
  outline?: string;
  dashed?: boolean;
  head?: number; // screen px
  glow?: boolean;
  smooth?: boolean;
  opacity?: number;
}> = ({route, progress, color = '#c8102e', width = 14, outline = '#1a0d05', dashed, head = 46, glow, smooth = true, opacity = 1}) => {
  const {zoom} = useMap();
  if (progress <= 0) return null;
  const g = routeGeom(route, smooth);
  const target = clamp(progress) * g.total;
  const pts: [number, number][] = [];
  for (let i = 0; i < g.pts.length; i++) {
    if (g.cum[i] <= target) pts.push(g.pts[i]);
    else {
      const seg = g.cum[i] - g.cum[i - 1] || 1;
      const u = (target - g.cum[i - 1]) / seg;
      pts.push([g.pts[i - 1][0] + (g.pts[i][0] - g.pts[i - 1][0]) * u, g.pts[i - 1][1] + (g.pts[i][1] - g.pts[i - 1][1]) * u]);
      break;
    }
  }
  if (pts.length < 2) return null;
  const d = 'M' + pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join('L');
  const a = pts[pts.length - 1];
  const b = pts[Math.max(0, pts.length - 3)];
  const ang = Math.atan2(a[1] - b[1], a[0] - b[0]);
  const hs = head / zoom;
  const tip = `M${a[0] + Math.cos(ang) * hs * 0.6},${a[1] + Math.sin(ang) * hs * 0.6} L${a[0] + Math.cos(ang + 2.5) * hs * 0.6},${a[1] + Math.sin(ang + 2.5) * hs * 0.6} L${a[0] + Math.cos(ang - 2.5) * hs * 0.6},${a[1] + Math.sin(ang - 2.5) * hs * 0.6} Z`;
  return (
    <g opacity={opacity}>
      {glow ? <path d={d} fill="none" stroke={color} strokeWidth={width * 3} opacity={0.35} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" /> : null}
      <path d={d} fill="none" stroke={outline} strokeWidth={width + 6} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? `${width * 1.6} ${width * 1.2}` : undefined} />
      <path d={d} fill="none" stroke={color} strokeWidth={width} vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashed ? `${width * 1.6} ${width * 1.2}` : undefined} />
      <path d={tip} fill={color} stroke={outline} strokeWidth={3} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </g>
  );
};

/** Soft glow disc (dependent states, battle flashes) in map units. */
export const MapGlow: React.FC<{at: LonLat; r: number; color: string; opacity?: number}> = ({at, r, color, opacity = 0.6}) => {
  const id = useId().replace(/:/g, '');
  const [x, y] = project(at);
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={`mg${id}`}>
          <stop offset="0" stopColor={color} stopOpacity={0.9} />
          <stop offset="0.6" stopColor={color} stopOpacity={0.35} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#mg${id})`} />
    </g>
  );
};

/** Pulsing ring at a place (battle hit) */
export const MapPing: React.FC<{at: LonLat; t: number; color?: string; r?: number}> = ({at, t, color = '#fff', r = 120}) => {
  const {zoom} = useMap();
  if (t <= 0 || t >= 1) return null;
  const [x, y] = project(at);
  return <circle cx={x} cy={y} r={(r * outExpo(t)) / zoom} fill="none" stroke={color} strokeWidth={6 * (1 - t)} vectorEffect="non-scaling-stroke" opacity={1 - t} />;
};

/** Interpolate map cameras */
export const lerpCam = (a: MapCam, b: MapCam, t: number): MapCam => ({
  lon: a.lon + (b.lon - a.lon) * t,
  lat: a.lat + (b.lat - a.lat) * t,
  // zoom interpolated geometrically so zooms feel linear
  zoom: Math.exp(Math.log(a.zoom) + (Math.log(b.zoom) - Math.log(a.zoom)) * t),
  tilt: (a.tilt ?? 0) + ((b.tilt ?? 0) - (a.tilt ?? 0)) * t,
  rot: (a.rot ?? 0) + ((b.rot ?? 0) - (a.rot ?? 0)) * t,
});

/** keyframed camera path: [[frame, cam, ease?], ...] */
export const camAt = (frame: number, keys: [number, MapCam, ((t: number) => number)?][]): MapCam => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (frame <= keys[i][0]) {
      const t = (frame - keys[i - 1][0]) / Math.max(1, keys[i][0] - keys[i - 1][0]);
      return lerpCam(keys[i - 1][1], keys[i][1], (keys[i][2] ?? ((x: number) => x))(t));
    }
  }
  return keys[keys.length - 1][1];
};
