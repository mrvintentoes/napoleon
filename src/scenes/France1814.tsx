import React from 'react';
import {
  Fill, Seg, Cam, Figure, HistoricalImage, TypographyImpact, Caption, NameMotif, BattleTitle, AnimatedMap, AnimatedArrow, MapPing,
  camAt, Doc, EagleEmblem, SliceGlitch, FlashFrame, Flashes, CameraShake, ParticleField, Tint, POWER, MARKERS,
  kf, clamp, prog, pulse, pulses, outExpo, inCubic, CAMERA, P, route,
} from './_kit';

const S = MARKERS.FRANCE_1814;
const FALL = MARKERS.PARIS_FALLS - S; // 240

/**
 * ACT VIII (b) — CAMPAIGN OF FRANCE, 1814 (1:42–1:48).
 * Hyper-fast tactical wins while the coalition arrows keep closing on Paris —
 * brilliance that cannot reverse the strategic situation. Then everything stops.
 */
const SIX = [
  {name: 'BRIENNE', date: '29 January', at: 30, place: P('brienne')},
  {name: 'CHAMPAUBERT', date: '10 February', at: 66, place: P('champaubert')},
  {name: 'MONTMIRAIL', date: '11 February', at: 98, place: P('montmirail')},
  {name: 'CHÂTEAU-THIERRY', date: '12 February', at: 126, place: P('chateauThierry')},
  {name: 'VAUCHAMPS', date: '14 February', at: 152, place: P('vauchamps')},
];

export const France1814: React.FC = () => (
  <Fill style={{background: '#000'}}>
    <Seg from={0} dur={FALL}>{(l) => <Campaign l={l} />}</Seg>
    <Seg from={FALL}>{(l) => <Fall l={l} />}</Seg>
  </Fill>
);

const Campaign: React.FC<{l: number}> = ({l}) => {
  const keys: [number, {lon: number; lat: number; zoom: number; tilt: number; rot: number}, ((t: number) => number)?][] = [[0, {lon: 3.6, lat: 48.9, zoom: 2.0, tilt: 35, rot: 0}]];
  SIX.forEach((b2, i) => keys.push([b2.at, {lon: b2.place[0], lat: b2.place[1] - 0.05, zoom: 6 + i * 0.4, tilt: 45, rot: i % 2 ? 5 : -5}, outExpo]));
  keys.push([236, {lon: 2.9, lat: 48.8, zoom: 3.2, tilt: 40, rot: 0}, CAMERA]);
  const cam = camAt(l, keys);
  const hit = pulses(l, SIX.map((s) => s.at), 5);
  // coalition keeps advancing regardless
  const adv = prog(l, 0, 236, (t) => t);
  return (
    <CameraShake amp={hit * 26 + 3} speed={1.4}>
      <AnimatedMap
        cam={cam}
        theme="parchment"
        filter="grayscale(0.85) contrast(1.1)"
        rivers={['seine', 'rhine']}
        labels={[
          {at: P('paris'), text: 'PARIS', appear: 0, size: 44},
          ...SIX.map((s) => ({at: s.place, text: s.name, kind: 'battle' as const, appear: s.at, size: 40})),
        ]}
      >
        <AnimatedArrow route={[[6.5, 49.2], [4.6, 49.0], [3.2, 48.95], [2.5, 48.9]]} progress={adv * 0.95} color="#8a1a1a" width={18} head={60} />
        <AnimatedArrow route={[[6.2, 48.0], [4.2, 48.3], [3.0, 48.6], [2.45, 48.8]]} progress={adv * 0.95} color="#8a1a1a" width={18} head={60} />
        <AnimatedArrow route={route('france1814')} progress={prog(l, 20, 140, (t) => t)} color="#2b5bd0" width={9} head={34} />
        {SIX.map((s) => (
          <MapPing key={s.name} at={s.place} t={(l - s.at) / 14} r={140} color="#2b5bd0" />
        ))}
      </AnimatedMap>
      <Tint color="#6f6f6f" opacity={0.25} blend="multiply" />
      <TypographyImpact text="1814" at={0} mode="slam" font="didone" size={300} y={330} color="#1c1c1c" out={28} outMode="cut" />
      <TypographyImpact text="CAMPAIGN OF FRANCE" at={4} mode="track" font="cond" size={58} y={480} color="#1c1c1c" tracking={0.3} out={28} outMode="cut" />
      {SIX.map((s, i) => (
        <BattleTitle key={s.name} name={s.name} date={`${s.date} 1814`} at={s.at} out={s.at + (SIX[i + 1]?.at ?? 200) - s.at - 2} y={330} size={200} color="#1c1c1c" accent="#444" echo={false} rot={i % 2 ? 2 : -2} />
      ))}
      <TypographyImpact text="TACTICAL WINS · THE INVASION CONTINUES" at={176} mode="type" font="archive" size={32} y={1660} color="#1c1c1c" weight={600} />
      <TypographyImpact text="THE COALITION MARCHES ON PARIS" at={200} mode="stretch" font="grotesk" size={86} y={330} color="#8a1a1a" />
      <Flashes ats={SIX.map((s) => s.at)} len={1} tail={2} color="#fff" max={0.6} />
    </CameraShake>
  );
};

/** PARIS FALLS — everything stops. Fontainebleau. Abdication. The eagle falls. ELBA. */
const Fall: React.FC<{l: number}> = ({l}) => (
  <Fill style={{background: '#1c1c1c'}}>
    {l < 40 ? (
      <Fill style={{background: '#c8c8c8'}}>
        <TypographyImpact text="PARIS FALLS" mode="cut" font="grotesk" size={190} y={900} color="#1c1c1c" />
        <TypographyImpact text="31 MARCH 1814" mode="cut" font="archive" size={40} y={1040} color="#444" tracking={0.3} weight={600} />
      </Fill>
    ) : null}
    {l >= 40 && l < 100 ? (
      <Fill style={{background: '#1c1c1c'}}>
        <div style={{position: 'absolute', left: 540, top: 1000, transform: `translate(-50%,-50%) scale(${kf(l, [[40, 1.05], [100, 0.98]])}) rotate(-2deg)`, filter: 'grayscale(1)'}}>
          <Doc title="ACTE D'ABDICATION" sub="Fontainebleau · 6 avril 1814" w={620} h={820} seed={33} seal="N" reveal={clamp((l - 44) / 30)} />
        </div>
        <TypographyImpact text="FONTAINEBLEAU" at={42} mode="track" font="imperial" size={70} y={330} color="#c8c8c8" tracking={0.25} />
        <TypographyImpact text="ABDICATION" at={56} mode="cut" font="grotesk" size={150} y={450} color="#fff" />
      </Fill>
    ) : null}
    {l >= 96 ? (
      <Fill style={{background: '#111'}}>
        <EagleEmblem state="falling" size={640} y={820} at={96} />
        <NameMotif from={POWER.y1814} at={96} text="NAPOLEON" y={1500} color="#6f6f6f" tracking={0.4} />
        <TypographyImpact text="ELBA" at={104} mode="flicker" font="archive" size={34} y={1580} color="#8aa0ab" tracking={0.6} weight={600} />
      </Fill>
    ) : null}
  </Fill>
);
