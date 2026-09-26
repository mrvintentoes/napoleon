/**
 * MUSICAL GRID + STRUCTURAL MARKERS
 *
 * Everything in the edit is expressed in beats of this grid. To swap in a
 * different song:
 *   1. drop it at public/audio/main-track.mp3
 *   2. set BPM (and FIRST_DOWNBEAT_OFFSET if the track has a pickup)
 *   3. nudge the MARKERS (in beats) so they sit on the song's drops.
 * Scene lengths are derived from the markers, so the whole edit re-times.
 */
export const FPS = 60;
export const BPM = 120;
/** frames of silence/pickup before beat 0 of the song (use if your track starts off-grid) */
export const FIRST_DOWNBEAT_OFFSET = 0;

export const BEAT = (FPS * 60) / BPM; // 30 frames @ 120bpm
export const BAR = BEAT * 4;

/** beats -> frames (rounded to whole frames) */
export const b = (beats: number) => Math.round(beats * BEAT);

/**
 * Structural markers, in beats from the start of the edit.
 * (@120bpm: 2 beats = 1 second)
 */
export const MARKER_BEATS = {
  INTRO: 0,
  TOULON: 13, //            6.5s  scene start, build
  DROP_1: 16, //            8.0s  Toulon cannon — first drop
  ITALY: 24, //            12.0s  music properly kicks in
  EGYPT: 48, //            24.0s
  NILE: 59, //             29.5s  triumph corrupts
  BRUMAIRE: 66, //         33.0s
  MARENGO: 71, //          35.5s
  CORONATION: 82, //       41.0s  1804 — silence before the crown
  CROWN_DROP: 84, //       42.0s
  AUSTERLITZ: 94, //       47.0s  fog
  AUSTERLITZ_DROP: 102, // 51.0s  the sun / the hit
  MASTER: 116, //          58.0s  Prussia / Poland
  PEAK: 132, //            66.0s  Europe 1807 — visual apex
  SPAIN: 140, //           70.0s
  WAGRAM: 152, //          76.0s
  RUSSIA_BREAK: 160, //    80.0s  1812 — the tone breaks
  BORODINO: 170, //        85.0s
  MOSCOW: 177, //          88.5s  stillness
  RETREAT: 182, //         91.0s
  LEIPZIG_START: 192, //   96.0s
  LEIPZIG: 196, //         98.0s  Battle of the Nations hit
  FRANCE_1814: 204, //    102.0s
  PARIS_FALLS: 212, //    106.0s  everything stops
  ELBA_SILENCE: 216, //   108.0s
  HUNDRED_DAYS: 224, //   112.0s
  HUNDRED_DAYS_DROP: 227, //113.5s single hit -> return
  PARIS_1815: 234, //     117.0s  full energy restored
  WATERLOO: 242, //       121.0s
  WATERLOO_DROP: 248, //  124.0s
  WATERLOO_CLIMAX: 256, //128.0s  the Guard
  FINAL_CUT: 262, //      131.0s  music cuts
  SAINT_HELENA: 266, //   133.0s
  END: 286, //            143.0s
} as const;

export type MarkerName = keyof typeof MARKER_BEATS;

export const MARKERS: Record<MarkerName, number> = Object.fromEntries(
  Object.entries(MARKER_BEATS).map(([k, v]) => [k, FIRST_DOWNBEAT_OFFSET + b(v)])
) as Record<MarkerName, number>;

export const TOTAL_FRAMES = MARKERS.END;
