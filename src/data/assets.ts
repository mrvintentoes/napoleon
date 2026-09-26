import {staticFile} from 'remotion';
import meta from './imagemeta.generated.json';

/**
 * ASSET MANIFEST
 *
 * Every image the edit references goes through this table. Entries whose file is
 * not on disk fall back to `fallback` (with an optional CSS grade) so the edit
 * always renders. Drop the recommended public-domain file into public/images/
 * under the exact filename, run `npm run scan`, and it is picked up automatically.
 * Human-readable provenance lives in ASSETS.md.
 */
export type AssetInfo = {
  file: string; // path under public/
  title: string;
  creator: string;
  date?: string;
  license: string;
  source: string;
  /** normalized point of interest (usually Napoleon's face) */
  focus?: {x: number; y: number};
  /** asset id used when `file` is missing */
  fallback?: string;
  /** CSS filter applied when rendering the fallback in this slot */
  fallbackGrade?: string;
};

type Meta = Record<string, {w: number; h: number; bbox?: number[]}>;
const META = meta as Meta;

const PD = 'Public domain (artist died >100 years ago; faithful 2D reproduction)';
const GROS_FC = 'Antoine-Jean Gros';
const USER = 'Supplied by user for this project';

export const ASSETS = {
  // ---------------------------------------------------------------- REAL (present)
  consul: {
    file: 'images/gros_first_consul.jpg',
    title: 'Bonaparte, First Consul (Distributing Sabres of Honour)',
    creator: GROS_FC,
    date: '1802',
    license: PD,
    source: USER + ' — original: Musée de la Légion d’honneur, Paris; widely reproduced on Wikimedia Commons',
    focus: {x: 0.47, y: 0.235},
  },
  consul_plate: {file: 'images/cut/gros_first_consul_plate.jpg', title: 'Gros 1802 — clean plate (derived)', creator: GROS_FC, license: PD, source: 'derived by scripts/prepare_assets.py', focus: {x: 0.47, y: 0.235}},
  consul_fg: {file: 'images/cut/gros_first_consul_fg.png', title: 'Gros 1802 — foreground cutout', creator: GROS_FC, license: PD, source: 'derived (rembg isnet)', focus: {x: 0.47, y: 0.235}},
  consul_rider: {file: 'images/cut/gros_first_consul_rider_fg.png', title: 'Gros 1802 — rider cutout', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.47, y: 0.235}},
  consul_rider_sil: {file: 'images/cut/gros_first_consul_rider_sil.png', title: 'Gros 1802 — rider silhouette', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.47, y: 0.235}},
  consul_rider_sil_white: {file: 'images/cut/gros_first_consul_rider_sil_white.png', title: 'Gros 1802 — rider silhouette (light)', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.47, y: 0.235}},
  consul_fried: {file: 'images/gros_first_consul_fried.jpg', title: 'Gros 1802 — deep-fried treatment', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.47, y: 0.235}},
  consul_halftone: {file: 'images/gros_first_consul_halftone.jpg', title: 'Gros 1802 — halftone treatment', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.47, y: 0.235}},

  harangue: {
    file: 'images/gros_pyramids_harangue.jpg',
    title: 'Bonaparte Haranguing the Army before the Battle of the Pyramids, 21 July 1798',
    creator: GROS_FC,
    date: '1810',
    license: PD,
    source: USER + ' — original: Château de Versailles; widely reproduced on Wikimedia Commons',
    focus: {x: 0.345, y: 0.255},
  },
  harangue_plate: {file: 'images/cut/gros_pyramids_harangue_plate.jpg', title: 'Gros 1810 — clean plate', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.345, y: 0.255}},
  harangue_fg: {file: 'images/cut/gros_pyramids_harangue_fg.png', title: 'Gros 1810 — foreground cutout', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.345, y: 0.255}},
  harangue_nap: {file: 'images/cut/gros_pyramids_harangue_napoleon_fg.png', title: 'Gros 1810 — Napoleon cutout', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.345, y: 0.255}},
  harangue_nap_sil: {file: 'images/cut/gros_pyramids_harangue_napoleon_sil.png', title: 'Gros 1810 — Napoleon silhouette', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.345, y: 0.255}},
  harangue_nap_sil_white: {file: 'images/cut/gros_pyramids_harangue_napoleon_sil_white.png', title: 'Gros 1810 — Napoleon silhouette (light)', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.345, y: 0.255}},
  harangue_fried: {file: 'images/gros_pyramids_harangue_fried.jpg', title: 'Gros 1810 — deep-fried', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.345, y: 0.255}},
  harangue_halftone: {file: 'images/gros_pyramids_harangue_halftone.jpg', title: 'Gros 1810 — halftone', creator: GROS_FC, license: PD, source: 'derived', focus: {x: 0.345, y: 0.255}},

  pyramids_battle: {
    file: 'images/watteau_battle_pyramids.jpg',
    title: 'The Battle of the Pyramids, 21 July 1798',
    creator: 'François-Louis-Joseph Watteau (Watteau de Lille)',
    date: 'c. 1798–1799',
    license: PD,
    source: USER + ' — original: Musée des Beaux-Arts de Valenciennes; reproduced on Wikimedia Commons',
    focus: {x: 0.75, y: 0.72},
  },
  pyramids_battle_fried: {file: 'images/watteau_battle_pyramids_fried.jpg', title: 'Watteau — deep-fried', creator: 'Watteau de Lille', license: PD, source: 'derived', focus: {x: 0.75, y: 0.72}},
  flag: {file: 'images/cut/watteau_flag_fg.png', title: 'Tricolour standard (cut from Watteau)', creator: 'Watteau de Lille', license: PD, source: 'derived', focus: {x: 0.5, y: 0.3}},

  map_ru: {
    file: 'images/map_europe_1812_ru.jpg',
    title: 'Napoleonic Wars 1799–1815 (Russian-language school atlas map)',
    creator: 'Unknown (modern atlas publisher)',
    license: 'UNVERIFIED — likely copyrighted modern atlas. Used only as 2–6 frame flashes. Replace before commercial use.',
    source: USER,
    focus: {x: 0.5, y: 0.45},
  },

  // ---------------------------------------------------------------- PLACEHOLDER SLOTS (drop files in to activate)
  napoleon_toulon: {file: 'images/napoleon_toulon.jpg', title: 'Bonaparte at the Siege of Toulon (e.g. Édouard Detaille, or Philippoteaux’s 1792 Lt-Col portrait)', creator: 'TBD', license: 'PD recommended', source: 'Wikimedia Commons', fallback: 'consul_halftone', fallbackGrade: 'sepia(0.6) contrast(1.4)'},
  napoleon_arcole: {file: 'images/napoleon_arcole.jpg', title: 'Bonaparte at the Pont d’Arcole', creator: 'Antoine-Jean Gros', date: '1796', license: PD, source: 'Wikimedia Commons — “Antoine-Jean Gros - Bonaparte on the Pont d’Arcole”', focus: {x: 0.5, y: 0.3}, fallback: 'harangue', fallbackGrade: 'sepia(0.4) saturate(1.3) hue-rotate(-10deg)'},
  napoleon_alps: {file: 'images/napoleon_alps_david.jpg', title: 'Napoleon Crossing the Alps', creator: 'Jacques-Louis David', date: '1801', license: PD, source: 'Wikimedia Commons', focus: {x: 0.45, y: 0.3}, fallback: 'consul', fallbackGrade: 'saturate(1.2)'},
  coronation_david: {file: 'images/coronation_david.jpg', title: 'The Coronation of Napoleon', creator: 'Jacques-Louis David', date: '1805–1807', license: PD, source: 'Wikimedia Commons / Louvre', focus: {x: 0.52, y: 0.42}, fallback: 'consul_fried', fallbackGrade: 'sepia(0.5) saturate(1.8) hue-rotate(-15deg) brightness(0.9)'},
  napoleon_throne: {file: 'images/napoleon_throne_ingres.jpg', title: 'Napoleon I on his Imperial Throne', creator: 'Jean-Auguste-Dominique Ingres', date: '1806', license: PD, source: 'Wikimedia Commons / Musée de l’Armée', focus: {x: 0.5, y: 0.25}, fallback: 'consul', fallbackGrade: 'sepia(0.3) saturate(1.5) contrast(1.2)'},
  napoleon_austerlitz: {file: 'images/napoleon_austerlitz.jpg', title: 'The Battle of Austerlitz', creator: 'François Gérard', date: '1810', license: PD, source: 'Wikimedia Commons / Versailles', focus: {x: 0.5, y: 0.4}, fallback: 'pyramids_battle', fallbackGrade: 'sepia(0.6) saturate(0.8) hue-rotate(10deg) brightness(1.1)'},
  jena_vernet: {file: 'images/jena_vernet.jpg', title: 'Napoleon I at the Battle of Jena', creator: 'Horace Vernet', date: '1836', license: PD, source: 'Wikimedia Commons', fallback: 'consul_halftone'},
  eylau_gros: {file: 'images/eylau_gros.jpg', title: 'Napoleon on the Battlefield of Eylau', creator: 'Antoine-Jean Gros', date: '1808', license: PD, source: 'Wikimedia Commons / Louvre', fallback: 'harangue', fallbackGrade: 'grayscale(0.85) contrast(1.3) brightness(1.15)'},
  tilsit: {file: 'images/tilsit_meeting.jpg', title: 'Meeting of Napoleon I and Alexander I on the Niemen', creator: 'Adolphe Roehn (after)', date: '1807', license: PD, source: 'Wikimedia Commons', fallback: 'consul', fallbackGrade: 'sepia(0.3)'},
  third_of_may: {file: 'images/third_of_may_goya.jpg', title: 'The Third of May 1808', creator: 'Francisco Goya', date: '1814', license: PD, source: 'Wikimedia Commons / Prado', fallback: 'pyramids_battle_fried', fallbackGrade: 'grayscale(0.4) sepia(0.8) hue-rotate(-30deg) saturate(2) brightness(0.7)'},
  wellington: {file: 'images/wellington_lawrence.jpg', title: 'Arthur Wellesley, 1st Duke of Wellington', creator: 'Thomas Lawrence', date: '1815–1816', license: PD, source: 'Wikimedia Commons / Apsley House', fallback: 'consul_halftone', fallbackGrade: 'sepia(1) hue-rotate(-40deg) saturate(3) brightness(0.8)'},
  wagram_vernet: {file: 'images/wagram_vernet.jpg', title: 'The Battle of Wagram', creator: 'Horace Vernet', date: '1836', license: PD, source: 'Wikimedia Commons', fallback: 'pyramids_battle', fallbackGrade: 'saturate(0.7) hue-rotate(35deg) brightness(0.9)'},
  borodino: {file: 'images/borodino_lejeune.jpg', title: 'The Battle of Borodino', creator: 'Louis-François Lejeune', date: '1822', license: PD, source: 'Wikimedia Commons', fallback: 'pyramids_battle_fried', fallbackGrade: 'grayscale(1) contrast(1.6) brightness(0.8)'},
  moscow_fire: {file: 'images/moscow_fire.jpg', title: 'Napoleon in Burning Moscow', creator: 'Albrecht Adam (or Adolph Northen)', date: '1841', license: PD, source: 'Wikimedia Commons', fallback: undefined},
  retreat_russia: {file: 'images/retreat_russia.jpg', title: 'Napoleon’s Retreat from Moscow', creator: 'Adolph Northen', date: '1851', license: PD, source: 'Wikimedia Commons', fallback: 'consul_rider_sil'},
  leipzig: {file: 'images/leipzig_sauerweid.jpg', title: 'The Battle of Leipzig', creator: 'Alexander Sauerweid', date: '1815', license: PD, source: 'Wikimedia Commons', fallback: 'pyramids_battle_fried', fallbackGrade: 'grayscale(0.7) sepia(0.4) contrast(1.4)'},
  fontainebleau: {file: 'images/fontainebleau_adieux.jpg', title: 'Napoleon’s Farewell to the Imperial Guard (Les Adieux de Fontainebleau)', creator: 'Antoine-Alphonse Montfort (after Horace Vernet)', date: '1825', license: PD, source: 'Wikimedia Commons', fallback: 'consul', fallbackGrade: 'grayscale(1) contrast(1.2)'},
  napoleon_elba: {file: 'images/napoleon_elba.jpg', title: 'Napoleon leaving Elba (e.g. Joseph Beaume, 1836)', creator: 'Joseph Beaume', date: '1836', license: PD, source: 'Wikimedia Commons', fallback: undefined},
  napoleon_waterloo: {file: 'images/napoleon_waterloo.jpg', title: 'The Battle of Waterloo, 18 June 1815', creator: 'Clément-Auguste Andrieux', date: '1852', license: PD, source: 'Wikimedia Commons', fallback: 'pyramids_battle', fallbackGrade: 'grayscale(0.6) sepia(0.3) hue-rotate(40deg) contrast(1.3) brightness(0.75)'},
  napoleon_st_helena: {file: 'images/napoleon_st_helena.jpg', title: 'Napoleon on Saint Helena', creator: 'Franz Josef Sandmann', date: 'c. 1820', license: PD, source: 'Wikimedia Commons', fallback: undefined},
  napoleon_study: {file: 'images/napoleon_study_david.jpg', title: 'The Emperor Napoleon in His Study at the Tuileries', creator: 'Jacques-Louis David', date: '1812', license: PD, source: 'Wikimedia Commons / National Gallery of Art', focus: {x: 0.5, y: 0.2}, fallback: 'consul', fallbackGrade: 'sepia(0.2)'},
  death_mask: {file: 'images/death_mask.jpg', title: 'Death mask of Napoleon', creator: 'after Francesco Antommarchi', date: '1821', license: 'PD (object) — photo licence to verify', source: 'Wikimedia Commons', fallback: undefined},
} satisfies Record<string, AssetInfo>;

export type AssetId = keyof typeof ASSETS;

export type Resolved = {
  id: AssetId;
  src: string;
  w: number;
  h: number;
  focus: {x: number; y: number};
  bbox?: number[];
  grade: string;
  placeholder: boolean;
  missing: boolean;
};

export const hasFile = (id: AssetId) => Boolean(META[(ASSETS[id] as AssetInfo).file]);

/** Resolve an asset id to a real file (following fallbacks). `missing` when nothing is available. */
export const resolveAsset = (id: AssetId): Resolved => {
  const info = ASSETS[id] as AssetInfo;
  const m = META[info.file];
  if (m) {
    return {id, src: staticFile(info.file), w: m.w, h: m.h, focus: info.focus ?? {x: 0.5, y: 0.35}, bbox: m.bbox, grade: '', placeholder: false, missing: false};
  }
  if (info.fallback) {
    const r = resolveAsset(info.fallback as AssetId);
    return {...r, grade: [info.fallbackGrade ?? '', r.grade].join(' ').trim(), placeholder: true};
  }
  return {id, src: '', w: 1080, h: 1920, focus: {x: 0.5, y: 0.5}, grade: '', placeholder: true, missing: true};
};

export const PLACEHOLDER_IDS = (Object.keys(ASSETS) as AssetId[]).filter((k) => !hasFile(k));
