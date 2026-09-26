/**
 * MOTIF CURVES — one number per era that drives the recurring motifs so the
 * story can be read from the graphics alone.
 *
 * POWER: font size (px) of the BONAPARTE / NAPOLEON wordmark.
 *   1793 tiny -> 1796 larger -> 1799 centred -> 1804 huge -> 1807 gigantic
 *   -> 1812 shrinking (first time ever) -> 1814 almost gone -> 1815 explodes -> Waterloo vanishes.
 */
export const POWER = {
  y1785: 34,
  y1793: 64,
  y1796: 120,
  y1797: 170,
  y1799: 220,
  y1804: 330,
  y1805: 400,
  y1807: 560,
  y1809: 480,
  y1812a: 380,
  y1812b: 120,
  y1814: 26,
  y1815: 520,
  waterloo: 0,
  helena: 40,
} as const;

/** EAGLE state per era (read by EagleEmblem) */
export type EagleState = 'faint' | 'strong' | 'dominant' | 'cracked' | 'falling' | 'flying' | 'shattered';

/** MAP zoom per era — the map pulls outward as the empire grows then contracts. */
export const MAP_ZOOM = {
  corsica: 2.6,
  italy: 1.6,
  mediterranean: 0.55,
  central: 0.85,
  europe1807: 0.42,
  russia: 0.34,
  germany1813: 0.8,
  france1814: 1.5,
  route1815: 1.6,
  belgium: 5.5,
} as const;
