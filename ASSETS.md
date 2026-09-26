# ASSETS — visual & audio provenance

The historical art comes from paintings that are **in the public domain** (every artist died more than 100 years ago, and the files are faithful 2D reproductions). Everything else in the edit was **generated procedurally in this repo**: the maps, eagle, crown, flags, silhouettes, textures and audio. No AI-generated images of Napoleon are used anywhere.

## 1. Present — real files

| File | Work | Creator, date | Licence | Source |
|---|---|---|---|---|
| `public/images/gros_first_consul.jpg` | *Bonaparte, First Consul* (distributing sabres of honour) | Antoine-Jean Gros, 1802 | Public domain | Supplied by the user. Original: Musée de la Légion d'honneur, Paris (also on Wikimedia Commons) |
| `public/images/gros_pyramids_harangue.jpg` | *Bonaparte Haranguing the Army before the Battle of the Pyramids* | Antoine-Jean Gros, 1810 | Public domain | Supplied by the user. Original: Château de Versailles (also on Wikimedia Commons) |
| `public/images/watteau_battle_pyramids.jpg` | *The Battle of the Pyramids* | François-Louis-Joseph Watteau ("Watteau de Lille"), c. 1798–99 | Public domain | Supplied by the user. Original: Musée des Beaux-Arts de Valenciennes (also on Wikimedia Commons) |
| `public/images/map_europe_1812_ru.jpg` | Russian-language school-atlas map of the Napoleonic Wars | Unknown modern publisher | **⚠ Unverified, probably copyrighted** | Supplied by the user. The manifest registers it, but the edit does not currently display it. Do not add it to a commercial release. |

### Derived files (made by `scripts/prepare_assets.py`, same licence as their source)
- `images/cut/*_fg.png` are foreground cutouts (rembg, `isnet-general-use`), with alpha refined in the script.
- `images/cut/*_plate.jpg` are clean plates with the figure inpainted out, used for 2.5D parallax.
- `images/cut/*_sil*.png` are black and light silhouettes (the cavalry charges and the final silhouette).
- `images/cut/watteau_flag_fg.png` is the tricolour standard cut out of the Watteau painting.
- `images/*_fried.jpg` are "deep-fried" treatments (real JPEG crunch), and `*_halftone.jpg` are halftone renders.

## 2. Placeholder slots — drop the file in and it switches on automatically

Each slot below currently renders its **fallback** (a colour-graded crop of one of the paintings above). To activate a slot, save the recommended public-domain image under the **exact filename**, then run `npm run scan` (the `dev` and `render` scripts also run it for you).

| Exact filename | Recommended public-domain work | Where it appears | Current fallback |
|---|---|---|---|
| `napoleon_toulon.jpg` | Philippoteaux, *Napoleon as Lt-Col of the 1st Battalion of Corsica* (1834), or a Toulon siege engraving | Toulon | Gros 1802 halftone |
| `napoleon_arcole.jpg` | Antoine-Jean Gros, *Bonaparte on the Pont d'Arcole* (1796) | Italy (opening + freeze frame + memories) | Gros 1810, sepia |
| `napoleon_alps_david.jpg` | Jacques-Louis David, *Napoleon Crossing the Alps* (1801) | Marengo, memories | Gros 1802 |
| `coronation_david.jpg` | Jacques-Louis David, *The Coronation of Napoleon* (1805–07) | Coronation (placed inside the nave fly-through) | procedural nave + sunburst |
| `napoleon_throne_ingres.jpg` | Ingres, *Napoleon I on his Imperial Throne* (1806) | (reserved) | Gros 1802 |
| `napoleon_austerlitz.jpg` | François Gérard, *The Battle of Austerlitz* (1810) | Austerlitz hit, memories | Watteau, sepia |
| `jena_vernet.jpg` | Horace Vernet, *Napoleon at Jena* (1836) | Jena | Gros 1802 halftone |
| `eylau_gros.jpg` | Antoine-Jean Gros, *Napoleon on the Battlefield of Eylau* (1808) | Eylau | Gros 1810, grayscale |
| `tilsit_meeting.jpg` | Adolphe Roehn (after), *Meeting on the Niemen* (1807) | (reserved) | — |
| `third_of_may_goya.jpg` | Francisco Goya, *The Third of May 1808* (1814) | Madrid | Watteau fried, burnt red |
| `wellington_lawrence.jpg` | Thomas Lawrence, *Duke of Wellington* (1815–16) | Spain, Waterloo | Gros halftone, red |
| `wagram_vernet.jpg` | Horace Vernet, *The Battle of Wagram* (1836) | Wagram, memories | Watteau, cold |
| `borodino_lejeune.jpg` | Louis-François Lejeune, *The Battle of Borodino* (1822) | Borodino | Watteau fried, mono |
| `moscow_fire.jpg` | Albrecht Adam or Adolph Northen, *Napoleon in burning Moscow* | (reserved; Moscow is procedural) | — |
| `retreat_russia.jpg` | Adolph Northen, *Napoleon's Retreat from Moscow* (1851) | (reserved) | rider silhouette |
| `leipzig_sauerweid.jpg` | Alexander Sauerweid, *Battle of Leipzig* (1815) | (reserved) | — |
| `fontainebleau_adieux.jpg` | Montfort after Vernet, *Les Adieux de Fontainebleau* | (reserved) | — |
| `napoleon_elba.jpg` | Joseph Beaume, *Napoleon leaving Elba* (1836) | (reserved) | — |
| `napoleon_waterloo.jpg` | Clément-Auguste Andrieux, *The Battle of Waterloo* (1852) | Waterloo title | Watteau, muddy green |
| `napoleon_st_helena.jpg` | Franz Josef Sandmann, *Napoleon on Saint Helena* (c. 1820) | (reserved) | — |
| `napoleon_study_david.jpg` | David, *The Emperor Napoleon in His Study at the Tuileries* (1812) | (reserved) | Gros 1802 |
| `death_mask.jpg` | Photo of the Antommarchi death mask (check the photo's licence) | (reserved) | — |

All of these are available on **Wikimedia Commons** (search the title). Gallica (BnF) and the Paris Musées open-access collections are good alternatives. When you add an image, update its `focus` in `src/data/assets.ts` to the normalized point where Napoleon's face is, so the composition-aware framing puts him in the right third.

## 3. Procedural art (generated in code)
- **Maps**: Natural Earth 1:50m land (`world-atlas`, public domain) with a single conic projection. Rivers, routes, the approximate French Empire c. 1811, and dependent-state glows are hand-written in `src/data/campaigns.ts`.
- **Emblems & objects** (`src/components/art/`): eagle, bicorne, crown, laurel, Legion of Honour star, bees, Gribeauval cannon blueprint, cannon, ship, infantry ranks, sabre, flags, pyramids, Notre-Dame, Brandenburg Gate, Moscow skyline, islands, Longwood House, guillotine, documents.
- **Textures** (`public/textures/`): film grain, dust, parchment, smoke, fog, cracks, all from `scripts/prepare_assets.py`.

## 4. Fonts (SIL Open Font License, via @fontsource)
Cinzel, Anton, Oswald, EB Garamond, Playfair Display — in `public/fonts/`.

## 5. Audio
- `public/audio/main-track.mp3` is a **temporary synthesized score** built by `scripts/make_audio.py`. It is locked to the 120 BPM grid and the markers, and has no third-party content.
- `public/sfx/*.wav` are synthesized one-shots and beds: cannon, boom_low, distant_cannon, impact, whoosh, riser, saber, paper, wind, ocean, fire, gallop, marching, crowd, glitch, heartbeat.
