import {geoConicConformal, geoPath, geoGraticule} from 'd3-geo';
import {feature} from 'topojson-client';
import type {Topology, GeometryCollection} from 'topojson-specification';
import land50 from 'world-atlas/land-50m.json';
import {LonLat} from '../data/campaigns';

/** Map plane size in "map units" (= px at zoom 1). */
export const PLANE = 4000;

/** One projection for the whole edit so the map motif is continuous. */
export const projection = geoConicConformal()
  .parallels([38, 58])
  .rotate([-14, 0])
  .center([0, 47])
  .scale(4200)
  .translate([PLANE / 2, PLANE / 2])
  .clipExtent([
    [-200, -200],
    [PLANE + 200, PLANE + 200],
  ]);

export const project = (p: LonLat): [number, number] => {
  const r = projection(p);
  return r ? [r[0], r[1]] : [0, 0];
};

let landCache: string | null = null;
export const landPath = () => {
  if (landCache) return landCache;
  const topo = land50 as unknown as Topology<{land: GeometryCollection}>;
  const geo = feature(topo, topo.objects.land);
  landCache = geoPath(projection)(geo) ?? '';
  return landCache;
};

let gratCache: string | null = null;
export const graticulePath = () => {
  if (gratCache) return gratCache;
  gratCache = geoPath(projection)(geoGraticule().step([5, 5])()) ?? '';
  return gratCache;
};

export const polygonPath = (rings: LonLat[][]) =>
  rings.map((r) => 'M' + r.map((p) => project(p).join(',')).join('L') + 'Z').join('');

export type Geom = {d: string; pts: [number, number][]; cum: number[]; total: number};
const geomCache = new Map<string, Geom>();

/** Dense Catmull-Rom sampled geometry of a route — draw and sample from the same points. */
export const routeGeom = (lonlat: LonLat[], smooth = true): Geom => {
  const key = JSON.stringify(lonlat) + smooth;
  const hit = geomCache.get(key);
  if (hit) return hit;
  const xy = lonlat.map(project);
  const pts: [number, number][] = [];
  if (!smooth || xy.length < 3) {
    pts.push(...xy);
  } else {
    const N = 20;
    for (let i = 0; i < xy.length - 1; i++) {
      const p0 = xy[i - 1] ?? xy[i];
      const p1 = xy[i];
      const p2 = xy[i + 1];
      const p3 = xy[i + 2] ?? p2;
      for (let k = 0; k < N; k++) {
        const t = k / N;
        const t2 = t * t;
        const t3 = t2 * t;
        const c = (a: number, b: number, c_: number, d: number) =>
          0.5 * (2 * b + (-a + c_) * t + (2 * a - 5 * b + 4 * c_ - d) * t2 + (-a + 3 * b - 3 * c_ + d) * t3);
        pts.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
      }
    }
    pts.push(xy[xy.length - 1]);
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const g: Geom = {d: 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join('L'), pts, cum, total: cum[cum.length - 1]};
  geomCache.set(key, g);
  return g;
};

/** point + heading at fraction t of a route geometry */
export const sampleGeom = (g: Geom, t: number) => {
  const target = Math.max(0, Math.min(1, t)) * g.total;
  let lo = 0;
  let hi = g.cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (g.cum[mid] < target) lo = mid;
    else hi = mid;
  }
  const seg = g.cum[hi] - g.cum[lo] || 1;
  const u = (target - g.cum[lo]) / seg;
  const a = g.pts[lo];
  const b2 = g.pts[hi];
  return {x: a[0] + (b2[0] - a[0]) * u, y: a[1] + (b2[1] - a[1]) * u, ang: Math.atan2(b2[1] - a[1], b2[0] - a[0])};
};
