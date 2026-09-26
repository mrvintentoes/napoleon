import React from 'react';
import {Composition} from 'remotion';
import {FPS, TOTAL_FRAMES} from './data/beats';
import {NapoleonEdit} from './NapoleonEdit';
import {ensureFonts} from './fonts';
import {SCENES, sceneSpan} from './data/timeline';
import {SceneSolo} from './NapoleonEdit';

ensureFonts();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="NapoleonEdit" component={NapoleonEdit} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} />
    {/* One composition per scene for fast iteration in the Studio (same code path as the full edit). */}
    {SCENES.map((s) => (
      <Composition
        key={s.id}
        id={`Scene-${s.id}`}
        component={SceneSolo}
        defaultProps={{id: s.id}}
        durationInFrames={sceneSpan(s).dur}
        fps={FPS}
        width={1080}
        height={1920}
      />
    ))}
  </>
);
