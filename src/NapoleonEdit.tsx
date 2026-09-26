import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, getRemotionEnvironment} from 'remotion';
import {MARKERS, MarkerName} from './data/beats';
import {SCENES, SceneId, sceneSpan} from './data/timeline';
import {SvgDefs} from './components/SvgDefs';
import {FilmGrain, Vignette} from './components/FilmGrain';
import {AudioLayer} from './components/AudioLayer';
import {F} from './fonts';

import {Prologue} from './scenes/Prologue';
import {Toulon} from './scenes/Toulon';
import {Italy} from './scenes/Italy';
import {Egypt} from './scenes/Egypt';
import {Brumaire} from './scenes/Brumaire';
import {Coronation} from './scenes/Coronation';
import {Austerlitz} from './scenes/Austerlitz';
import {MasterOfEurope} from './scenes/MasterOfEurope';
import {SpainWagram} from './scenes/SpainWagram';
import {Russia1812} from './scenes/Russia1812';
import {Leipzig} from './scenes/Leipzig';
import {France1814} from './scenes/France1814';
import {Elba} from './scenes/Elba';
import {HundredDays} from './scenes/HundredDays';
import {Waterloo} from './scenes/Waterloo';
import {SaintHelena} from './scenes/SaintHelena';

export const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  prologue: Prologue,
  toulon: Toulon,
  italy: Italy,
  egypt: Egypt,
  brumaire: Brumaire,
  coronation: Coronation,
  austerlitz: Austerlitz,
  master: MasterOfEurope,
  spain: SpainWagram,
  russia: Russia1812,
  leipzig: Leipzig,
  france1814: France1814,
  elba: Elba,
  hundredDays: HundredDays,
  waterloo: Waterloo,
  helena: SaintHelena,
};

/** Global finishing: grain + vignette per era (scenes add their own heavier FX). */
const Finishing: React.FC = () => {
  const f = useCurrentFrame();
  const s = SCENES.find((d) => f >= MARKERS[d.start] && f < MARKERS[d.end]) ?? SCENES[SCENES.length - 1];
  return (
    <>
      <Vignette strength={s.vignette} />
      <FilmGrain opacity={s.grain} dust={s.grain * 0.5} />
    </>
  );
};

/** Studio-only HUD: current marker + scene (never rendered to file). */
const DebugHud: React.FC = () => {
  const f = useCurrentFrame();
  if (!getRemotionEnvironment().isStudio) return null;
  const names = Object.keys(MARKERS) as MarkerName[];
  const last = names.filter((n) => MARKERS[n] <= f).pop();
  return (
    <div style={{position: 'absolute', left: 16, bottom: 16, fontFamily: F.cond, fontSize: 22, color: '#0f0', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', opacity: 0.8}}>
      {f} · {(f / 60).toFixed(2)}s · {last}
    </div>
  );
};

export const NapoleonEdit: React.FC = () => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <SvgDefs />
    {SCENES.map((s) => {
      const {from, dur} = sceneSpan(s);
      const C = SCENE_COMPONENTS[s.id];
      return (
        <Sequence key={s.id} from={from} durationInFrames={dur} name={s.title}>
          <C />
        </Sequence>
      );
    })}
    <Finishing />
    <AudioLayer />
    <DebugHud />
  </AbsoluteFill>
);

/** A single scene in isolation (Studio compositions "Scene-<id>"). Audio is offset to match. */
export const SceneSolo: React.FC<{id: SceneId}> = ({id}) => {
  const s = SCENES.find((d) => d.id === id)!;
  const C = SCENE_COMPONENTS[id];
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <SvgDefs />
      <C />
      <Sequence from={-MARKERS[s.start]} layout="none">
        <Finishing />
      </Sequence>
      <AudioLayer offset={MARKERS[s.start]} />
    </AbsoluteFill>
  );
};
