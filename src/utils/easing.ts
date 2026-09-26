/** Easing library — everything returns f(t) for t in [0,1]. */
export type Ease = (t: number) => number;

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/** cubic-bezier solver (same semantics as CSS cubic-bezier; y may overshoot) */
export const bezier = (x1: number, y1: number, x2: number, y2: number): Ease => {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    x = clamp01(x);
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      const d = dx(t);
      if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(clamp01(t));
  };
};

export const linear: Ease = (t) => t;
export const inQuad: Ease = (t) => t * t;
export const outQuad: Ease = (t) => 1 - (1 - t) * (1 - t);
export const inCubic: Ease = (t) => t * t * t;
export const outCubic: Ease = (t) => 1 - Math.pow(1 - t, 3);
export const inOutCubic: Ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const inExpo: Ease = (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10));
export const outExpo: Ease = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const inOutExpo: Ease = (t) =>
  t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
export const outQuint: Ease = (t) => 1 - Math.pow(1 - t, 5);
export const inQuint: Ease = (t) => t * t * t * t * t;

export const outBack =
  (s = 1.9): Ease =>
  (t) => {
    const c3 = s + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
  };

/** damped oscillation settle: overshoots then rings out (for slams) */
export const outElasticSoft: Ease = (t) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.exp(-7 * t) * Math.cos(t * 11);
};

/** the "edited" curves */
export const SLAM = bezier(0.05, 0.85, 0.12, 1.0); //   violent arrival, long settle
export const OVERSHOOT = bezier(0.18, 1.55, 0.38, 1.0);
export const WHIP = bezier(0.75, 0.0, 0.15, 1.0); //   slow start, fast middle, soft stop
export const DRIFT = bezier(0.33, 0.0, 0.2, 1.0);
export const CAMERA = bezier(0.45, 0.05, 0.1, 1.0); // camera inertia
export const RAMP_IN = bezier(0.9, 0.0, 1.0, 0.6); //  speed ramp into a cut
