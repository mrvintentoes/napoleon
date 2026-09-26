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

## 2. Paintings added in round 2 (all public domain, from Wikimedia Commons; most supplied directly by the user)

Each one is saved in `assets_src/commons/` and imported to `public/images/<slot>.jpg` by `scripts/import_paintings.py`. That script also writes Napoleon cutouts, clean plates and silhouettes to `public/images/cut/`. `assets_src/commons/manifest.json` lists the Commons page for the four files that were downloaded directly.

| Slot | Work | Artist | Date | Used in |
|---|---|---|---|---|
| `napoleon_toulon` | *Bonaparte at the Siege of Toulon* | Édouard Detaille | late 19th c. | Toulon promotion (cut out) |
| `toulon_assault` | *Assault on Toulon by the Republican troops, 19 Dec 1793 (engraving)* | Anonymous | 1793 | Toulon build (CC0) |
| `napoleon_arcole` | *Bonaparte at the Pont d'Arcole* | Antoine-Jean Gros | 1796 | Italy opening + freeze frame, memory |
| `napoleon_alps_david` | *Bonaparte Crossing the Great St Bernard* | Jacques-Louis David | 1801–02 | Marengo, memory |
| `marengo_lejeune` | *The Battle of Marengo* | Louis-François Lejeune | 1801 | Marengo montage |
| `brumaire_bouchot` | *Bonaparte at the Council of Five Hundred (18 Brumaire)* | François Bouchot | 1840 | 18 Brumaire |
| `nile_orient` | *The Destruction of L'Orient at the Battle of the Nile* | George Arnald | 1825–27 | Nile |
| `trafalgar_turner` | *The Battle of Trafalgar* | J. M. W. Turner | 1822–24 | Trafalgar |
| `coronation_david` | *The Coronation of Napoleon* | Jacques-Louis David | 1805–07 | Coronation, memory |
| `napoleon_throne_ingres` | *Napoleon I on his Imperial Throne* | J.-A.-D. Ingres | 1806 | Emperor (cut out) |
| `napoleon_study_david` | *The Emperor Napoleon in His Study at the Tuileries* | Jacques-Louis David | 1812 | Civil Code machinery (cut out) |
| `napoleon_austerlitz` | *The Battle of Austerlitz* | François Gérard | 1810 | Austerlitz hit, overload, memory |
| `jena_vernet` | *Napoleon at the Battle of Jena* | Horace Vernet | 1836 | Jena, memory; Wagram fallback |
| `third_of_may_goya` | *The Third of May 1808* | Francisco Goya | 1814 | Madrid |
| `wellington_lawrence` | *Arthur Wellesley, 1st Duke of Wellington* | Thomas Lawrence | 1815–16 | Spain, Waterloo |
| `marie_louise` | *Empress Marie-Louise* | François Gérard | 1810 | Dynasty |
| `moscow_fire` | *Napoleon in Burning Moscow* | Albrecht Adam | 1841 | Moscow, memory |
| `berezina_hess` | *The Crossing of the Berezina* | Peter von Hess | 1844 | Retreat; Eylau fallback |
| `leipzig_sauerweid` | *The Battle of Leipzig* | Alexander Sauerweid | c. 1815 | Leipzig; Borodino fallback |
| `fontainebleau_delaroche` | *Napoleon at Fontainebleau, 31 March 1814* | Paul Delaroche | 1845 | Abdication (cut out; low-res source) |
| `fontainebleau_adieux` | *Napoleon's Farewell to the Imperial Guard* | Horace Vernet | 1825 | Adieux / eagle falls |
| `napoleon_elba` | *The Return from Elba* | Charles de Steuben | 1818 | Grenoble (low-res source) |
| `napoleon_waterloo` | *The Battle of Waterloo, 18 June 1815* | Clément-Auguste Andrieux | 1852 | Waterloo title |
| `scotland_forever` | *Scotland Forever!* | Elizabeth Thompson, Lady Butler | 1881 | Waterloo cavalry |
| `death_napoleon` | *The Death of Napoleon, 5 May 1821* | Charles de Steuben | 1828 | Saint Helena |

### Still missing (the edit shows a fallback in their place)
- `nelson_abbott.jpg`: Abbott, *Nelson* (fallback: the Nile painting)
- `murat_gros.jpg`: Gros, *Murat* (fallback: Jena)
- `wagram_vernet.jpg`: Vernet, *Wagram* (fallback: a re-graded Jena)
- `eylau_gros.jpg`: Gros, *Eylau* (fallback: a re-graded Berezina)
- `borodino_lejeune.jpg`: Lejeune, *Borodino* (fallback: a re-graded Leipzig)

## 3. Procedural art (generated in code)
- **Maps**: Natural Earth 1:50m land (`world-atlas`, public domain) with a single conic projection. Rivers, routes, the approximate French Empire c. 1811, and dependent-state glows are hand-written in `src/data/campaigns.ts`.
- **Emblems & objects** (`src/components/art/`): eagle, bicorne, crown, laurel, Legion of Honour star, bees, Gribeauval cannon blueprint, cannon, ship, infantry ranks, sabre, flags, pyramids, Notre-Dame, Brandenburg Gate, Moscow skyline, islands, Longwood House, guillotine, documents.
- **Textures** (`public/textures/`): film grain, dust, parchment, smoke, fog, cracks, all from `scripts/prepare_assets.py`.

## 4. Fonts (SIL Open Font License, via @fontsource)
Cinzel, Anton, Oswald, EB Garamond, Playfair Display — in `public/fonts/`.

## 5. Audio
- `public/audio/main-track.mp3` is a **temporary synthesized score** built by `scripts/make_audio.py`. It is locked to the 120 BPM grid and the markers, and has no third-party content.
- `public/sfx/*.wav` are synthesized one-shots and beds: cannon, boom_low, distant_cannon, impact, whoosh, riser, saber, paper, wind, ocean, fire, gallop, marching, crowd, glitch, heartbeat.
