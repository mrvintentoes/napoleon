import React from 'react';
import {Audio, Sequence, staticFile, interpolate} from 'remotion';
import audioFiles from '../data/audio.generated.json';
import {SFX_CUES, MAIN_TRACK, MUSIC_VOLUME, SFX_VOLUME, MUSIC_AUTOMATION} from '../data/sfx';

const has = (p: string) => Boolean((audioFiles as Record<string, boolean>)[p]);

/**
 * Music + SFX layering hooks.
 * - main track: public/audio/main-track.mp3 (swap freely; see data/beats.ts to retime)
 * - SFX: public/sfx/<name>.wav fired at cue frames from data/sfx.ts
 * Missing files are skipped silently so the edit renders without audio.
 */
export const AudioLayer: React.FC<{sfx?: boolean; music?: boolean; offset?: number}> = ({sfx = true, music = true, offset = 0}) => (
  <>
    {music && has(MAIN_TRACK) ? (
      <Sequence from={-offset} layout="none">
        <Audio
          src={staticFile(MAIN_TRACK)}
          volume={(f) => MUSIC_VOLUME * interpolate(f, MUSIC_AUTOMATION.map((k) => k[0]), MUSIC_AUTOMATION.map((k) => k[1]), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
        />
      </Sequence>
    ) : null}
    {sfx
      ? SFX_CUES.map((c, i) => {
          const file = `sfx/${c.sfx}.wav`;
          if (!has(file)) return null;
          const at = c.at - offset;
          if (at < -2000) return null;
          return (
            <Sequence key={i} from={at} durationInFrames={c.dur ?? 600} layout="none">
              <Audio src={staticFile(file)} volume={SFX_VOLUME * (c.vol ?? 1)} playbackRate={c.rate ?? 1} />
            </Sequence>
          );
        })
      : null}
  </>
);
