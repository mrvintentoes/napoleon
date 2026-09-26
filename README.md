# NAPOLEON — 1769–1821

This is a vertical (1080×1920, 60 fps) high-energy historical edit of Napoleon Bonaparte's whole career, built in **Remotion + React + TypeScript**. It runs **143.0 s** (8,580 frames).

```
RISE → ACCELERATION → ABSOLUTE DOMINANCE → IMPERIAL OVERLOAD → FRACTURE → COLLAPSE
→ IMPOSSIBLE RETURN → FINAL DEFEAT → SILENCE
```

## Quick start

```bash
npm install
npm run dev            # Remotion Studio (preview). Also exposes "Scene-<id>" comps per scene
npm run render         # full edit  -> out/napoleon_edit.mp4
npm run render:tests   # Austerlitz / Russia / Hundred Days / Waterloo test clips -> out/test_*.mp4
npm run stills -- 3100 5400 7700   # quick contact stills -> out/stills/
```

If Remotion can't download its headless Chrome in a sandboxed environment, `remotion.config.ts` falls back to a local Chromium. Set `REMOTION_BROWSER=/path/to/chrome` to choose one.

Asset pipeline (already run; the outputs are committed):

```bash
pip install pillow numpy scipy rembg[cpu]
npm run prepare-assets  # cutouts, clean plates, silhouettes, deep-fry/halftone, textures
npm run audio           # synthesized temp score + SFX bank
```

## Structure

```
src/
  NapoleonEdit.tsx        root composition: scenes + finishing (grain/vignette) + audio
  Root.tsx, index.ts, fonts.ts
  scenes/                 16 scenes: Prologue, Toulon, Italy, Egypt, Brumaire, Coronation,
                          Austerlitz, MasterOfEurope, SpainWagram, Russia1812, Leipzig,
                          France1814, Elba, HundredDays, Waterloo, SaintHelena (+ _kit.ts)
  components/             HistoricalImage (composition-aware framing, Figure cutouts),
                          ParallaxPainting (2.5D layers), AnimatedMap (+AnimatedArrow),
                          TypographyImpact, DateCard, BattleTitle, NameMotif, EagleTransition,
                          FilmGrain/Vignette/Scanlines/CRT/Halftone, ChromaticAberration
                          (+SliceGlitch), FlashFrame, CameraShake, ParticleField (+Smoke, Fog),
                          PsychBG, Transitions (iris, bicorne wipe, whip, zoom streaks),
                          Montage, Memories, AudioLayer, SvgDefs, core (Seg/Cam/Fill)
  components/art/         procedural eagle, regalia, military, skylines, documents
  data/                   beats.ts (grid + markers), timeline.ts, campaigns.ts (geo),
                          assets.ts (manifest + fallbacks), motifs.ts (POWER curve), sfx.ts
  utils/                  animation.ts (kf, slam, shake, pulses), easing.ts, timing.ts, geo.ts
public/  images/ (+cut/)  maps/  audio/  sfx/  textures/  fonts/
scripts/ prepare_assets.py, make_audio.py, scan-assets.mjs, stills.mjs, render_tests.sh
```

## Timing, music and swapping the song

Everything is expressed on a beat grid, set in `src/data/beats.ts` (`BPM = 120`, so 1 beat = 30 frames and 1 bar = 120 frames). Scene boundaries and the big hits are **named markers**:

| Marker | Beat | Time | What happens |
|---|---|---|---|
| INTRO | 0 | 0:00.0 | black, 1769 |
| DROP_1 | 16 | 0:08.0 | Toulon cannon (first drop) |
| ITALY | 24 | 0:12.0 | music fully in |
| NILE | 59 | 0:29.5 | triumph corrupts |
| CROWN_DROP | 84 | 0:42.0 | crown falls → Notre-Dame |
| AUSTERLITZ_DROP | 102 | 0:51.0 | sun → AUSTERLITZ |
| PEAK | 132 | 1:06.0 | Europe 1807 apex |
| RUSSIA_BREAK | 160 | 1:20.0 | tone breaks |
| MOSCOW | 177 | 1:28.5 | stillness |
| LEIPZIG | 196 | 1:38.0 | Battle of the Nations |
| PARIS_FALLS | 212 | 1:46.0 | everything stops |
| ELBA_SILENCE | 216 | 1:48.0 | ocean only |
| HUNDRED_DAYS_DROP | 227 | 1:53.5 | single hit → return |
| WATERLOO_CLIMAX | 256 | 2:08.0 | the Guard |
| FINAL_CUT | 262 | 2:11.0 | music cuts |
| END | 286 | 2:23.0 | |

**To swap the song:** replace `public/audio/main-track.mp3`, then set `BPM` (and `FIRST_DOWNBEAT_OFFSET` if the song has a pickup). Next, nudge `MARKER_BEATS` so DROP_1, AUSTERLITZ_DROP, PEAK, HUNDRED_DAYS_DROP and WATERLOO_CLIMAX land on the song's drops. Scene lengths come from the markers, so the whole edit re-times itself. If the new song already has sound design, set `SFX_VOLUME = 0` in `src/data/sfx.ts`.

Swapping is easiest at these points:
- **Intro → DROP_1 (0–8 s):** any build/riser works. Only the drop position matters.
- **ITALY (12 s):** the song's first full chorus or drop.
- **CORONATION → CROWN_DROP (41–42 s):** needs a near-silent gap. If the song has none, `MUSIC_AUTOMATION` in `sfx.ts` can duck it.
- **RUSSIA_BREAK → LEIPZIG_START (80–96 s):** a breakdown or half-time section is ideal.
- **ELBA_SILENCE → HUNDRED_DAYS_DROP (108–113.5 s):** silence followed by a re-entry. Many songs have a "last chorus" re-drop here.
- **FINAL_CUT (131 s):** the music is hard-muted by automation whatever the song does.

## Recurring motifs
1. **Eagle**: faint (1769/1793) → strong (1804) → dominant and flying into the lens (1805–07) → cracked (1812) → falls (1814) → flies (1815) → shatters (Waterloo).
2. **The name**: sized by `POWER` in `data/motifs.ts`. It is tiny in 1785, then grows until 1807, then shrinks for the first time in the 1812 retreat. It is almost gone in 1814, explodes back in 1815 and vanishes at Waterloo.
3. **The map**: one projection throughout. It zooms out from Corsica to Europe (1807, 1811), then to Russia, and contracts around France in 1814. There is a final expansion in 1815 before Belgium.
4. **The bicorne**: coronation → Austerlitz wipe, and the final image.

## Historical accuracy
See `SOURCES.md` (every on-screen fact and date, with verification status) and `ASSETS.md` (every image and its licence).
