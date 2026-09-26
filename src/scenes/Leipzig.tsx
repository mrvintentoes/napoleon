import React from 'react';
import {
  Fill, Seg, Cam, Figure, HistoricalImage, TypographyImpact, Caption, NameMotif, BattleTitle, AnimatedMap, AnimatedArrow, MapPing,
  MapGlow, camAt, Flag, InfantryRank, ChromaticAberration, SliceGlitch, FlashFrame, Flashes, CameraShake, Smoke, ParticleField, Tint,
  POWER, MARKERS, kf, clamp, prog, pulse, pulses, rnd, outExpo, inCubic, inExpo, SLAM, CAMERA, OVERSHOOT, P, route, F,
} from './_kit';

const S = MARKERS.LEIPZIG_START;
const HIT = MARKERS.LEIPZIG - S; // 120

/**
 * ACT VIII (a) — EUROPE TURNS, 1813 (1:36–1:42).
 * Coalition colours arrive from every direction. Brief victories. Then LEIPZIG:
 * the map collapses inward toward France.
 */
export const Leipzig: React.FC = () => (
  <Fill style={{background: '#000'}}>
    <Seg from={0} dur={40}>{(l) => <Surrounded l={l} />}</Seg>
    <Seg from={40} dur={HIT - 40}>{(l) => <BriefVictories l={l} />}</Seg>
    <Seg from={HIT}>{(l) => <Nations l={l} />}</Seg>
  </Fill>
);

const FLAGS: {kind: 'prussia' | 'russia' | 'austria' | 'sweden' | 'britain'; label: string; from: [number, number]; to: [number, number]; at: number}[] = [
  {kind: 'prussia', label: 'PRUSSIA', from: [-800, 200], to: [40, 260], at: 0},
  {kind: 'russia', label: 'RUSSIA', from: [1600, 300], to: [600, 360], at: 5},
  {kind: 'austria', label: 'AUSTRIA', from: [-800, 1500], to: [40, 1380], at: 10},
  {kind: 'sweden', label: 'SWEDEN', from: [1600, 1600], to: [600, 1440], at: 15},
  {kind: 'britain', label: 'BRITAIN', from: [300, 2400], to: [320, 1760], at: 20},
];

const Surrounded: React.FC<{l: number}> = ({l}) => (
  <CameraShake amp={pulses(l, FLAGS.map((f) => f.at), 5) * 20 + 2} speed={1.2}>
    <Fill style={{background: '#2b2620'}}>
      <Smoke count={5} seed={170} opacity={0.4} tint="brightness(0.4)" y={960} spread={1400} speed={2} />
      <Figure id="consul_rider_sil" x={540} y={1000} h={600} opacity={0.9} />
      {FLAGS.map((fl) => {
        const t = SLAM(clamp((l - fl.at) / 9));
        if (l < fl.at) return null;
        return (
          <div key={fl.kind} style={{position: 'absolute', left: fl.from[0] + (fl.to[0] - fl.from[0]) * t, top: fl.from[1] + (fl.to[1] - fl.from[1]) * t}}>
            <Flag kind={fl.kind} width={400} frame={l * 2} />
            <div style={{fontFamily: F.grotesk, fontSize: 56, color: '#f2e6c8', marginLeft: 16, marginTop: -8}}>{fl.label}</div>
          </div>
        );
      })}
      <TypographyImpact text="1813" at={0} mode="slam" font="didone" size={240} y={960} color="rgba(242,230,200,0.9)" out={20} outMode="blur" />
      <TypographyImpact text="SIXTH COALITION" at={22} mode="track" font="cond" size={52} y={1180} color="#f2e6c8" tracking={0.4} />
    </Fill>
    <Flashes ats={FLAGS.map((f) => f.at)} len={1} tail={2} max={0.5} />
  </CameraShake>
);

const WINS = [
  {name: 'LÜTZEN', date: '2 May 1813', at: 0, place: P('lutzen')},
  {name: 'BAUTZEN', date: '20–21 May 1813', at: 24, place: P('bautzen')},
  {name: 'DRESDEN', date: '26–27 August 1813', at: 48, place: P('dresden')},
];

const BriefVictories: React.FC<{l: number}> = ({l}) => {
  const cam = camAt(l, [
    [0, {lon: 13, lat: 51.3, zoom: 2.6, tilt: 45, rot: -4}],
    [78, {lon: 12.6, lat: 51.3, zoom: 2.2, tilt: 50, rot: 3}, CAMERA],
  ]);
  const hit = pulses(l, WINS.map((w) => w.at), 6);
  return (
    <CameraShake amp={hit * 26 + 3} speed={1.2}>
      <AnimatedMap
        cam={cam}
        theme="mud"
        rivers={['elbe']}
        labels={[
          ...WINS.map((w) => ({at: w.place, text: w.name, kind: 'battle' as const, appear: w.at, size: 50})),
          {at: P('leipzig'), text: 'LEIPZIG', appear: 60, kind: 'city' as const},
        ]}
      >
        <AnimatedArrow route={route('saxony1813')} progress={prog(l, 0, 76, outExpo)} color="#3f7bff" width={12} head={44} />
        {WINS.map((w) => (
          <MapPing key={w.name} at={w.place} t={(l - w.at) / 16} r={200} color="#fff" />
        ))}
      </AnimatedMap>
      <Tint color="#2b2620" opacity={0.3} blend="multiply" />
      {WINS.map((w, i) => (
        <BattleTitle key={w.name} name={w.name} date={w.date} at={w.at} out={w.at + 20} y={380} size={230} color="#f2e6c8" accent="#c9b98a" echo={false} rot={i % 2 ? 2 : -2} />
      ))}
      <TypographyImpact text="VICTORIES — BUT THE COALITION KEEPS COMING" at={62} mode="type" font="archive" size={32} y={1640} color="#f2e6c8" weight={600} />
      <FlashFrame at={78} len={2} color="#000" />
    </CameraShake>
  );
};

/** LEIPZIG — Battle of the Nations. The map collapses inward on France. */
const Nations: React.FC<{l: number}> = ({l}) => {
  const hit = pulses(l, [0, 20, 40], 8);
  const cam = camAt(l, [
    [0, {lon: 12.4, lat: 51.3, zoom: 3.2, tilt: 50}],
    [60, {lon: 9, lat: 50, zoom: 0.95, tilt: 40}, CAMERA],
    [200, {lon: 4, lat: 48.8, zoom: 1.5, tilt: 35, rot: 4}, inCubic],
  ]);
  const squeeze = kf(l, [[90, 1], [200, 0.82, inCubic]]);
  return (
    <CameraShake amp={hit * 46 + 4} speed={1.2} zoomKick={0.5}>
      <ChromaticAberration amount={hit * 20}>
        <Fill>
          <Cam s={1} style={{transform: `scaleX(${squeeze}) scaleY(${2 - squeeze})`}}>
            <AnimatedMap
              cam={cam}
              theme="mud"
              rivers={['rhine', 'elbe']}
              labels={[
                {at: P('leipzig'), text: 'LEIPZIG', kind: 'battle', appear: 0, size: 70, color: '#fff'},
                {at: [7.6, 50.4], text: 'RHINE', kind: 'region', appear: 110, size: 60, color: '#9fd0ff'},
                {at: P('paris'), text: 'PARIS', appear: 120},
              ]}
            >
              <AnimatedArrow route={route('coalitionNorth')} progress={prog(l, 0, 20, outExpo)} color="#b30000" width={16} head={50} />
              <AnimatedArrow route={route('coalitionEast')} progress={prog(l, 4, 20, outExpo)} color="#b30000" width={16} head={50} />
              <AnimatedArrow route={route('coalitionSouth')} progress={prog(l, 8, 20, outExpo)} color="#b30000" width={16} head={50} />
              <AnimatedArrow route={route('invasion1814a')} progress={prog(l, 90, 90, inCubic)} color="#b30000" width={18} head={60} />
              <AnimatedArrow route={route('invasion1814b')} progress={prog(l, 100, 90, inCubic)} color="#b30000" width={18} head={60} />
              <AnimatedArrow route={route('invasion1814c')} progress={prog(l, 110, 80, inCubic)} color="#b30000" width={18} head={60} />
              <MapPing at={P('leipzig')} t={(l % 30) / 30} r={300} color="#ff5a3a" />
            </AnimatedMap>
          </Cam>
          {/* Sauerweid: the Battle of the Nations cut in on the hits */}
          {l < 86 && Math.floor(l / 10) % 2 === 0 ? (
            <HistoricalImage id="leipzig_sauerweid" zoom={1.5 + (l % 20) * 0.01} place={{x: [0.3, 0.6, 0.45, 0.7, 0.5][Math.floor(l / 20) % 5], y: 0.6}} filter="contrast(1.25) saturate(0.85) sepia(0.2)" />
          ) : null}
          <Fill style={{background: 'linear-gradient(180deg, rgba(43,38,32,0.9), transparent 35%)'}} />
          <TypographyImpact text="LEIPZIG" at={0} mode="slam" font="grotesk" size={330} y={330} color="#fff" out={86} outMode="blur" chroma={6} />
          <TypographyImpact text="16–19 OCTOBER 1813" at={4} mode="track" font="archive" size={40} y={500} color="#f2e6c8" tracking={0.3} weight={600} out={86} />
          <TypographyImpact text="BATTLE OF THE NATIONS" at={20} mode="slam" font="grotesk" size={110} y={1620} color="#ff5a3a" out={86} outMode="blur" />
          <NameMotif from={POWER.y1812b} to={POWER.y1812b * 0.6} at={40} dur={120} text="NAPOLEON" y={1780} color="rgba(242,230,200,0.6)" tracking={0.2} />
          <TypographyImpact text="THE ALLIES CROSS THE RHINE" at={130} mode="rise" font="cond" size={62} y={330} color="#f2e6c8" />
          <TypographyImpact text="1814" at={196} mode="slam" font="didone" size={360} y={960} color="#c8c8c8" />
        </Fill>
      </ChromaticAberration>
      <Flashes ats={[0, 20, 40]} len={1} tail={5} />
    </CameraShake>
  );
};
