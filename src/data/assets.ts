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
const PD_ = PD;

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

  // ---------------------------------------------------------------- REAL PAINTINGS (Wikimedia Commons, public domain)
  napoleon_toulon: {file: 'images/napoleon_toulon.jpg', title: 'Bonaparte at the Siege of Toulon', creator: 'Édouard Detaille', date: 'c. 1880s', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.42, y: 0.17}},
  toulon_assault: {file: 'images/toulon_assault.jpg', title: 'Assault on Toulon, 19 December 1793 (engraving)', creator: 'Anonymous', date: '1793', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.5, y: 0.5}},
  napoleon_arcole: {file: 'images/napoleon_arcole.jpg', title: "Bonaparte at the Pont d'Arcole", creator: 'Antoine-Jean Gros', date: '1796', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.6, y: 0.28}},
  napoleon_alps_david: {file: 'images/napoleon_alps_david.jpg', title: 'Bonaparte Crossing the Great St Bernard', creator: 'Jacques-Louis David', date: '1801–02', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.6, y: 0.2}},
  marengo_lejeune: {file: 'images/marengo_lejeune.jpg', title: 'The Battle of Marengo', creator: 'Louis-François Lejeune', date: '1801', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.6, y: 0.62}},
  brumaire_bouchot: {file: 'images/brumaire_bouchot.jpg', title: 'Bonaparte at the Council of Five Hundred, 18 Brumaire', creator: 'François Bouchot', date: '1840', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.465, y: 0.53}},
  nile_orient: {file: 'images/nile_orient.jpg', title: "The Destruction of L'Orient at the Battle of the Nile", creator: 'George Arnald', date: '1825–27', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.3, y: 0.4}},
  trafalgar_turner: {file: 'images/trafalgar_turner.jpg', title: 'The Battle of Trafalgar', creator: 'J. M. W. Turner', date: '1822–24', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.45, y: 0.45}},
  coronation_david: {file: 'images/coronation_david.jpg', title: 'The Coronation of Napoleon', creator: 'Jacques-Louis David', date: '1805–07', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.583, y: 0.6}},
  napoleon_throne_ingres: {file: 'images/napoleon_throne_ingres.jpg', title: 'Napoleon I on his Imperial Throne', creator: 'Jean-Auguste-Dominique Ingres', date: '1806', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.5, y: 0.18}},
  napoleon_austerlitz: {file: 'images/napoleon_austerlitz.jpg', title: 'The Battle of Austerlitz', creator: 'François Gérard', date: '1810', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.705, y: 0.25}},
  jena_vernet: {file: 'images/jena_vernet.jpg', title: 'Napoleon at the Battle of Jena', creator: 'Horace Vernet', date: '1836', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.5, y: 0.36}},
  third_of_may_goya: {file: 'images/third_of_may_goya.jpg', title: 'The Third of May 1808', creator: 'Francisco Goya', date: '1814', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.34, y: 0.45}},
  wellington_lawrence: {file: 'images/wellington_lawrence.jpg', title: 'Arthur Wellesley, 1st Duke of Wellington', creator: 'Thomas Lawrence', date: '1815–16', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.47, y: 0.25}},
  marie_louise: {file: 'images/marie_louise.jpg', title: 'Empress Marie-Louise', creator: 'François Gérard', date: '1810', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.49, y: 0.19}},
  napoleon_study_david: {file: 'images/napoleon_study_david.jpg', title: 'The Emperor Napoleon in His Study at the Tuileries', creator: 'Jacques-Louis David', date: '1812', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.5, y: 0.155}},
  moscow_fire: {file: 'images/moscow_fire.jpg', title: 'Napoleon in Burning Moscow', creator: 'Albrecht Adam', date: '1841', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.41, y: 0.435}},
  berezina_hess: {file: 'images/berezina_hess.jpg', title: 'The Crossing of the Berezina', creator: 'Peter von Hess', date: '1844', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.5, y: 0.6}},
  leipzig_sauerweid: {file: 'images/leipzig_sauerweid.jpg', title: 'The Battle of Leipzig', creator: 'Alexander Sauerweid', date: 'c. 1815', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.45, y: 0.8}},
  fontainebleau_delaroche: {file: 'images/fontainebleau_delaroche.jpg', title: 'Napoleon at Fontainebleau, 31 March 1814', creator: 'Paul Delaroche', date: '1845', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.55, y: 0.26}},
  fontainebleau_adieux: {file: 'images/fontainebleau_adieux.jpg', title: "Napoleon's Farewell to the Imperial Guard, 20 April 1814", creator: 'Horace Vernet', date: '1825', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.465, y: 0.37}},
  napoleon_elba: {file: 'images/napoleon_elba.jpg', title: 'The Return from Elba', creator: 'Charles de Steuben', date: '1818', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.61, y: 0.47}},
  napoleon_waterloo: {file: 'images/napoleon_waterloo.jpg', title: 'The Battle of Waterloo, 18 June 1815', creator: 'Clément-Auguste Andrieux', date: '1852', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.5, y: 0.62}},
  scotland_forever: {file: 'images/scotland_forever.jpg', title: 'Scotland Forever!', creator: 'Elizabeth Thompson, Lady Butler', date: '1881', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.44, y: 0.55}},
  death_napoleon: {file: 'images/death_napoleon.jpg', title: 'The Death of Napoleon, 5 May 1821', creator: 'Charles de Steuben', date: '1828', license: PD, source: 'Wikimedia Commons (supplied by user / downloaded)', focus: {x: 0.34, y: 0.39}},
  // cutouts (scripts/import_paintings.py)
  napoleon_toulon_fg: {file: 'images/cut/napoleon_toulon_fg.png', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.42, y: 0.17}},
  napoleon_toulon_plate: {file: 'images/cut/napoleon_toulon_plate.jpg', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.42, y: 0.17}},
  napoleon_toulon_sil: {file: 'images/cut/napoleon_toulon_sil.png', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.42, y: 0.17}},
  napoleon_alps_david_fg: {file: 'images/cut/napoleon_alps_david_fg.png', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.6, y: 0.2}},
  napoleon_alps_david_plate: {file: 'images/cut/napoleon_alps_david_plate.jpg', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.6, y: 0.2}},
  napoleon_alps_david_sil: {file: 'images/cut/napoleon_alps_david_sil.png', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.6, y: 0.2}},
  napoleon_throne_ingres_fg: {file: 'images/cut/napoleon_throne_ingres_fg.png', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.5, y: 0.18}},
  napoleon_throne_ingres_plate: {file: 'images/cut/napoleon_throne_ingres_plate.jpg', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.5, y: 0.18}},
  napoleon_throne_ingres_sil: {file: 'images/cut/napoleon_throne_ingres_sil.png', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.5, y: 0.18}},
  napoleon_study_david_fg: {file: 'images/cut/napoleon_study_david_fg.png', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.5, y: 0.155}},
  napoleon_study_david_plate: {file: 'images/cut/napoleon_study_david_plate.jpg', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.5, y: 0.155}},
  napoleon_study_david_sil: {file: 'images/cut/napoleon_study_david_sil.png', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.5, y: 0.155}},
  fontainebleau_delaroche_fg: {file: 'images/cut/fontainebleau_delaroche_fg.png', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.55, y: 0.26}},
  fontainebleau_delaroche_plate: {file: 'images/cut/fontainebleau_delaroche_plate.jpg', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.55, y: 0.26}},
  fontainebleau_delaroche_sil: {file: 'images/cut/fontainebleau_delaroche_sil.png', title: 'derived', creator: 'derived', license: PD, source: 'scripts/import_paintings.py', focus: {x: 0.55, y: 0.26}},
  // ---------------------------------------------------------------- STILL-MISSING SLOTS (fallbacks)
  eylau_gros: {file: 'images/eylau_gros.jpg', title: 'Napoleon on the Battlefield of Eylau', creator: 'Antoine-Jean Gros', date: '1808', license: PD, source: 'Wikimedia Commons', fallback: 'berezina_hess', fallbackGrade: 'grayscale(0.6) contrast(1.2) brightness(1.1)'},
  wagram_vernet: {file: 'images/wagram_vernet.jpg', title: 'The Battle of Wagram', creator: 'Horace Vernet', date: '1836', license: PD, source: 'Wikimedia Commons', fallback: 'jena_vernet', fallbackGrade: 'sepia(0.3) hue-rotate(15deg) saturate(0.8)'},
  borodino: {file: 'images/borodino_lejeune.jpg', title: 'The Battle of Borodino', creator: 'Louis-François Lejeune', date: '1822', license: PD, source: 'Wikimedia Commons', fallback: 'leipzig_sauerweid', fallbackGrade: 'grayscale(0.8) contrast(1.5) brightness(0.8)'},
  nelson: {file: 'images/nelson_abbott.jpg', title: 'Rear-Admiral Sir Horatio Nelson', creator: 'Lemuel Francis Abbott', date: '1799', license: PD, source: 'Wikimedia Commons', focus: {x: 0.47, y: 0.3}, fallback: 'nile_orient'},
  murat: {file: 'images/murat_gros.jpg', title: 'Equestrian portrait of Joachim Murat', creator: 'Antoine-Jean Gros', date: 'c. 1812', license: PD, source: 'Wikimedia Commons', focus: {x: 0.52, y: 0.22}, fallback: 'jena_vernet'},
  tilsit: {file: 'images/tilsit_meeting.jpg', title: 'Meeting on the Niemen', creator: 'after Adolphe Roehn', date: '1807', license: PD, source: 'Wikimedia Commons', fallback: undefined},
  retreat_russia: {file: 'images/retreat_russia.jpg', title: 'Retreat from Moscow', creator: 'Adolph Northen', date: '1851', license: PD, source: 'Wikimedia Commons', fallback: 'berezina_hess'},
  napoleon_st_helena: {file: 'images/napoleon_st_helena.jpg', title: 'Napoleon on Saint Helena', creator: 'TBD', license: PD, source: 'Wikimedia Commons', fallback: undefined},
  death_mask: {file: 'images/death_mask.jpg', title: 'Death mask', creator: 'after Antommarchi', license: 'TBD', source: 'Wikimedia Commons', fallback: undefined},
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
