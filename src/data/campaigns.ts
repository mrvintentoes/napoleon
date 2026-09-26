/**
 * Geographic data for the animated maps. Coordinates are [lon, lat] (WGS84),
 * modern locations of the historical sites (e.g. Austerlitz = Slavkov u Brna,
 * Eylau = Bagrationovsk, Friedland = Pravdinsk, Tilsit = Sovetsk).
 * Routes are simplified axes of advance — schematic, not corps-level tracks.
 */
export type LonLat = [number, number];

export const PLACES = {
  ajaccio: [8.74, 41.93],
  paris: [2.35, 48.86],
  toulon: [5.93, 43.12],
  nice: [7.27, 43.7],
  savona: [8.48, 44.31],
  montenotte: [8.38, 44.39],
  lodi: [9.5, 45.31],
  milan: [9.19, 45.46],
  arcole: [11.28, 45.36],
  rivoli: [10.81, 45.57],
  mantua: [10.79, 45.16],
  campoFormio: [13.16, 46.03],
  malta: [14.4, 35.9],
  alexandria: [29.92, 31.2],
  aboukir: [30.06, 31.32],
  cairo: [31.24, 30.04],
  giza: [31.13, 29.98],
  frejus: [6.74, 43.43],
  marengo: [8.65, 44.89],
  stBernard: [7.17, 45.87],
  boulogne: [1.61, 50.73],
  strasbourg: [7.75, 48.58],
  mainz: [8.27, 50.0],
  hanover: [9.73, 52.37],
  ulm: [9.99, 48.4],
  munich: [11.58, 48.14],
  vienna: [16.37, 48.21],
  austerlitz: [16.87, 49.15],
  brunn: [16.61, 49.2],
  bamberg: [10.89, 49.89],
  jena: [11.59, 50.93],
  auerstedt: [11.58, 51.1],
  berlin: [13.4, 52.52],
  warsaw: [21.01, 52.23],
  eylau: [20.64, 54.39],
  friedland: [21.01, 54.44],
  tilsit: [21.88, 55.08],
  madrid: [-3.7, 40.42],
  lisbon: [-9.14, 38.72],
  bayonne: [-1.47, 43.49],
  burgos: [-3.7, 42.34],
  regensburg: [12.1, 49.02],
  aspern: [16.48, 48.22],
  wagram: [16.56, 48.3],
  kovno: [23.9, 54.9],
  vilna: [25.28, 54.69],
  vitebsk: [30.2, 55.19],
  smolensk: [32.05, 54.78],
  borodino: [35.82, 55.52],
  moscow: [37.62, 55.75],
  maloyaroslavets: [36.46, 55.01],
  orsha: [30.4, 54.5],
  berezina: [28.35, 54.3],
  lutzen: [12.14, 51.26],
  bautzen: [14.42, 51.18],
  dresden: [13.74, 51.05],
  leipzig: [12.37, 51.34],
  brienne: [4.53, 48.39],
  champaubert: [3.78, 48.88],
  montmirail: [3.54, 48.87],
  chateauThierry: [3.4, 49.05],
  vauchamps: [3.62, 48.88],
  fontainebleau: [2.7, 48.4],
  elba: [10.33, 42.81],
  golfeJuan: [7.07, 43.57],
  cannes: [7.01, 43.55],
  grasse: [6.92, 43.66],
  digne: [6.24, 44.09],
  sisteron: [5.94, 44.2],
  gap: [6.08, 44.56],
  grenoble: [5.72, 45.19],
  lyon: [4.84, 45.76],
  auxerre: [3.57, 47.8],
  charleroi: [4.44, 50.41],
  ligny: [4.57, 50.51],
  quatreBras: [4.46, 50.57],
  waterloo: [4.41, 50.68],
  wavre: [4.61, 50.72],
  plancenoit: [4.43, 50.66],
  brussels: [4.35, 50.85],
  london: [-0.13, 51.5],
  stPetersburg: [30.32, 59.94],
  trafalgar: [-6.03, 36.18],
  rome: [12.5, 41.9],
  naples: [14.27, 40.85],
  amsterdam: [4.9, 52.37],
  hamburg: [9.99, 53.55],
  konigsberg: [20.51, 54.71],
  breslau: [17.04, 51.11],
  prague: [14.42, 50.08],
  stockholm: [18.07, 59.33],
  constantinople: [28.98, 41.01],
} satisfies Record<string, LonLat>;

export type PlaceId = keyof typeof PLACES;
export const P = (id: PlaceId): LonLat => PLACES[id] as LonLat;

/** Campaign axes (schematic). */
export const ROUTES = {
  italy1796: ['nice', 'savona', 'montenotte', 'lodi', 'milan', 'arcole', 'rivoli', 'campoFormio'],
  egypt1798: ['toulon', 'malta', 'alexandria', 'giza'],
  egyptReturn: ['alexandria', 'frejus'],
  toParis1799: ['frejus', 'lyon', 'paris'],
  marengo1800: ['paris', 'stBernard', 'milan', 'marengo'],
  ulmA: ['boulogne', 'mainz', 'ulm'],
  ulmB: ['hanover', 'bamberg', 'ulm'],
  ulmC: ['strasbourg', 'ulm'],
  austerlitz1805: ['ulm', 'munich', 'vienna', 'brunn', 'austerlitz'],
  prussia1806: ['bamberg', 'jena', 'berlin'],
  poland1807: ['berlin', 'warsaw', 'eylau', 'friedland', 'tilsit'],
  spain1808: ['bayonne', 'burgos', 'madrid'],
  austria1809: ['regensburg', 'vienna', 'aspern', 'wagram'],
  russia1812: ['kovno', 'vilna', 'vitebsk', 'smolensk', 'borodino', 'moscow'],
  retreat1812: ['moscow', 'maloyaroslavets', 'borodino', 'smolensk', 'orsha', 'berezina', 'vilna', 'kovno'],
  saxony1813: ['lutzen', 'bautzen', 'dresden', 'leipzig'],
  france1814: ['brienne', 'champaubert', 'montmirail', 'chateauThierry', 'vauchamps'],
  vol1815: ['elba', 'golfeJuan', 'grasse', 'digne', 'sisteron', 'gap', 'grenoble', 'lyon', 'auxerre', 'paris'],
  belgium1815: ['paris', 'charleroi', 'ligny', 'waterloo'],
  prussians1815: ['wavre', 'plancenoit'],
  // coalition pressure 1813–14 (schematic converging axes)
  coalitionNorth: ['berlin', 'leipzig'],
  coalitionEast: ['breslau', 'leipzig'],
  coalitionSouth: ['prague', 'leipzig'],
  invasion1814a: ['leipzig', 'mainz', 'paris'],
  invasion1814b: ['munich', 'strasbourg', 'paris'],
  invasion1814c: ['amsterdam', 'brussels', 'paris'],
} satisfies Record<string, PlaceId[]>;

export type RouteId = keyof typeof ROUTES;
export const route = (id: RouteId): LonLat[] => (ROUTES[id] as PlaceId[]).map(P);

/** Rivers — hand-simplified polylines, enough to read "the Rhine" / "the Niemen" at a glance. */
export const RIVERS: Record<string, LonLat[]> = {
  rhine: [[9.5, 47.55], [8.6, 47.6], [7.6, 47.56], [7.55, 48.1], [7.75, 48.58], [8.2, 49.0], [8.47, 49.49], [8.27, 50.0], [7.6, 50.36], [7.1, 50.73], [6.96, 50.94], [6.78, 51.23], [6.62, 51.66], [6.0, 51.85], [5.86, 51.84], [4.9, 51.85], [4.1, 51.95]],
  danube: [[8.5, 47.95], [9.2, 48.1], [9.99, 48.4], [11.0, 48.75], [12.1, 49.02], [12.9, 48.75], [13.46, 48.57], [14.29, 48.3], [15.6, 48.35], [16.37, 48.21], [17.1, 48.14], [18.8, 47.8], [19.05, 47.5], [18.9, 46.3], [19.0, 45.35], [20.46, 44.82], [22.5, 44.6], [22.87, 44.0], [24.5, 43.7], [25.95, 43.85], [27.27, 44.1], [28.05, 45.43], [29.6, 45.2]],
  elbe: [[15.5, 50.6], [14.2, 50.6], [13.74, 51.05], [12.7, 51.8], [11.63, 52.13], [11.9, 52.9], [10.7, 53.35], [9.99, 53.55], [8.7, 53.87]],
  vistula: [[18.9, 49.6], [19.94, 50.06], [21.6, 50.7], [21.5, 51.6], [21.01, 52.23], [19.7, 52.6], [18.6, 53.01], [18.8, 53.9], [18.8, 54.35]],
  niemen: [[27.0, 53.5], [25.5, 53.5], [23.83, 53.68], [24.0, 54.4], [23.9, 54.9], [22.8, 55.05], [21.88, 55.08], [21.3, 55.3]],
  berezina: [[28.5, 54.9], [28.4, 54.3], [28.9, 53.6], [29.2, 53.14], [30.0, 52.3]],
  dnieper: [[33.2, 55.3], [32.05, 54.78], [30.4, 54.5], [30.33, 53.9], [30.2, 52.4], [30.52, 50.45], [32.0, 49.4], [33.4, 49.07], [35.1, 47.8], [33.8, 46.9], [32.6, 46.63], [31.9, 46.6]],
  seine: [[4.7, 47.6], [4.07, 48.3], [2.96, 48.38], [2.66, 48.54], [2.35, 48.86], [2.0, 49.0], [1.1, 49.44], [0.1, 49.48]],
  po: [[7.1, 44.7], [7.68, 45.07], [8.6, 45.1], [9.69, 45.05], [10.02, 45.13], [11.0, 45.05], [11.6, 44.9], [12.5, 44.95]],
  nile: [[31.3, 27.0], [31.2, 29.0], [31.24, 30.04], [30.9, 30.8], [30.4, 31.4]],
  moskva: [[35.3, 55.6], [36.2, 55.7], [37.1, 55.65], [37.62, 55.75], [38.3, 55.3]],
};

/**
 * The French Empire at its greatest extent (c. 1811–1812) — APPROXIMATE outline.
 * Clipped to land in the renderer, so the sea-side vertices are loose on purpose.
 * Catalonia (annexed 1812) is not included. Label on-screen says "approx.".
 */
export const FRENCH_EMPIRE_1811: LonLat[][] = [
  [
    [-6.0, 48.0], [-5.5, 49.8], [-1.5, 50.1], [1.55, 51.02], [2.4, 51.5], [3.0, 52.6], [3.8, 54.0], [8.0, 54.4], [8.8, 53.95],
    [9.9, 53.65], [10.4, 53.65], [10.75, 53.85], [10.9, 54.0], [11.3, 54.15], [11.0, 53.6], [10.6, 53.35], [10.0, 53.1],
    [9.3, 52.7], [8.7, 52.4], [8.0, 52.1], [7.2, 51.95], [6.62, 51.66], [6.78, 51.23], [6.96, 50.94], [7.6, 50.36],
    [8.27, 50.0], [8.47, 49.49], [8.2, 49.0], [7.75, 48.58], [7.55, 48.1], [7.6, 47.56], [6.9, 47.4], [6.4, 46.9], [6.1, 46.45],
    [6.8, 46.4], [7.5, 46.4], [8.1, 46.45], [8.45, 46.4], [8.1, 46.1], [8.55, 45.9], [8.5, 45.3], [8.9, 45.05], [9.8, 45.05],
    [10.45, 44.95], [10.45, 44.5], [10.8, 44.15], [11.6, 44.0], [12.2, 43.6], [12.6, 43.4], [13.2, 42.8], [13.3, 42.3],
    [13.6, 41.8], [13.25, 41.28], [12.0, 40.8], [9.8, 40.6], [8.0, 40.6], [5.0, 42.5], [3.2, 42.4], [1.4, 42.6], [-0.3, 42.8],
    [-1.8, 43.3], [-4.5, 44.0],
  ],
  // Illyrian Provinces (1809–1813)
  [
    [13.3, 46.5], [13.85, 46.6], [14.5, 46.6], [15.6, 46.2], [16.3, 45.6], [16.3, 45.0], [16.0, 44.6], [16.5, 43.6], [17.6, 43.1],
    [18.5, 42.6], [18.6, 42.35], [17.5, 42.5], [15.5, 43.3], [14.0, 44.8], [13.6, 45.2], [13.7, 45.65], [13.4, 46.0],
  ],
];

/** Dependent / allied states — shown as soft glows + labels (no hard borders claimed). */
export const STATES_1807_1811: {label: string; at: LonLat; r: number; sub?: string}[] = [
  {label: 'FRENCH EMPIRE', at: [2.6, 47.2], r: 0},
  {label: 'CONFEDERATION OF THE RHINE', at: [10.6, 50.6], r: 260, sub: '1806'},
  {label: 'KINGDOM OF ITALY', at: [11.4, 45.1], r: 150, sub: 'Napoleon, King'},
  {label: 'KINGDOM OF NAPLES', at: [15.6, 40.8], r: 150, sub: 'Joseph → Murat'},
  {label: 'DUCHY OF WARSAW', at: [19.6, 52.0], r: 190, sub: '1807'},
  {label: 'KINGDOM OF SPAIN', at: [-3.8, 40.2], r: 280, sub: 'Joseph, 1808'},
  {label: 'KINGDOM OF HOLLAND', at: [5.4, 52.3], r: 90, sub: 'Louis, 1806–10'},
  {label: 'SWISS CONFEDERATION', at: [8.2, 46.8], r: 80},
  {label: 'KINGDOM OF WESTPHALIA', at: [9.8, 51.9], r: 110, sub: 'Jérôme, 1807'},
];
