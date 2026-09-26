import React from 'react';
import {
  useCurrentFrame, Fill, Seg, Cam, Figure, HistoricalImage, ParallaxPainting, TypographyImpact, Caption, NameMotif, BattleTitle,
  AnimatedMap, AnimatedArrow, MapPing, MapGlow, camAt, Flag, InfantryRank, Montage, ChromaticAberration, SliceGlitch,
  FlashFrame, Flashes, CameraShake, Smoke, ParticleField, Sunburst, StripeField, ColorField, Tint, BeeField, Img, staticFile,
  EagleEmblem, Crown, POWER, MARKERS, kf, clamp, prog, pulse, pulses, rnd, noise1, outExpo, inCubic, inExpo, SLAM, CAMERA, DRIFT,
  OVERSHOOT, P, route, F, whipStyle, Scanlines,
} from './_kit';
import {STATES_1807_1811} from '../data/campaigns';

const S = MARKERS.SPAIN;
const WAG = MARKERS.WAGRAM - S; // 360

/**
 * ACT VI — THE EMPIRE OVERHEATS 1808–1811 (1:10–1:20).
 * Not uninterrupted victory: Spain burns, the British land, Aspern-Essling ruptures,
 * Wagram wins harder. Dynasty flashes. Maximum extent — and the first cracks.
 * Snow enters the frame before anyone knows why.
 */
export const SpainWagram: React.FC = () => (
  <Fill style={{background: '#000'}}>
    <Seg from={0} dur={70}>{(l) => <Madrid l={l} />}</Seg>
    <Seg from={70} dur={90}>{(l) => <Peninsula l={l} />}</Seg>
    <Seg from={160} dur={60}>{(l) => <AustriaReturns l={l} />}</Seg>
    <Seg from={220} dur={WAG - 220}>{(l) => <Aspern l={l} />}</Seg>
    <Seg from={WAG} dur={60}>{(l) => <Wagram l={l} />}</Seg>
    <Seg from={WAG + 60} dur={70}>{(l) => <Dynasty l={l} />}</Seg>
    <Seg from={WAG + 130}>{(l) => <MaxExtent l={l} />}</Seg>
  </Fill>
);

const Madrid: React.FC<{l: number}> = ({l}) => {
  const hit = pulses(l, [0, 22, 44], 6);
  return (
    <CameraShake amp={hit * 30 + 3} speed={1.2}>
      <Fill style={{background: '#7a1a0e'}}>
        <HistoricalImage id="third_of_may" zoom={1.25 + l * 0.004} place={{x: 0.5, y: 0.5}} opacity={0.9} />
        <Tint color="#7a1a0e" opacity={0.45} blend="multiply" />
        <Smoke count={5} seed={80} opacity={0.35} tint="brightness(0.2)" y={1500} speed={3} />
        <TypographyImpact text="1808" mode="slam" font="didone" size={360} y={330} color="#0a0a0a" out={20} outMode="cut" />
        <TypographyImpact text="SPAIN" at={22} mode="slam" font="grotesk" size={340} y={380} color="#0a0a0a" out={44} outMode="cut" />
        <TypographyImpact text="MADRID" at={44} mode="slam" font="grotesk" size={300} y={380} color="#f2d7b0" />
        <TypographyImpact text="2 MAY 1808 · THE CITY RISES" at={48} mode="track" font="archive" size={36} y={520} color="#f2d7b0" tracking={0.2} weight={600} />
        <Caption text="Joseph Bonaparte is made King of Spain" at={30} y={1700} color="#f2d7b0" size={32} />
      </Fill>
      <Flashes ats={[0, 22, 44]} len={1} color="#fff" tail={3} />
    </CameraShake>
  );
};

const Peninsula: React.FC<{l: number}> = ({l}) => (
  <CameraShake amp={pulses(l, [0, 30, 60], 6) * 26 + 3} speed={1.1}>
    <Montage
      shots={[
        [
          30,
          (k) => (
            <Fill style={{background: '#150604'}}>
              <Fill style={{background: 'radial-gradient(circle at 50% 70%, rgba(255,120,30,0.5), transparent 60%)'}} />
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{position: 'absolute', left: 80 + i * 200 + noise1(k * 0.2 + i, 3) * 20, top: 1120 + (i % 2) * 60}}>
                  <InfantryRank count={1} spacing={60} h={380} color="#050202" hat="bicorne" frame={k} seed={i} />
                </div>
              ))}
              <ParticleField kind="embers" density={80} speed={1.6} seed={82} />
              <TypographyImpact text="GUERRILLA" mode="slam" font="grotesk" size={250} y={420} color="#ff8a4a" />
              <Caption text="the Peninsular War · 1808–1814" at={4} y={560} color="#f2d7b0" />
            </Fill>
          ),
        ],
        [
          30,
          (k) => (
            <Fill style={{background: '#e9dcc6'}}>
              {[0, 1, 2].map((r) => (
                <div key={r} style={{position: 'absolute', left: -600 + k * (18 + r * 4) + r * 80, top: 900 + r * 230}}>
                  <InfantryRank count={30} spacing={46} h={240 + r * 60} color="#b3121b" hat="shako" frame={k * 2} seed={r + 83} />
                </div>
              ))}
              <TypographyImpact text="THE BRITISH LAND" mode="slam" font="grotesk" size={150} y={420} color="#b3121b" />
              <Caption text="Portugal · August 1808" at={4} y={530} color="#3a1a10" />
            </Fill>
          ),
        ],
        [
          30,
          (k) => (
            <Fill style={{background: '#0a0a0a'}}>
              <ParallaxPainting base="wellington" layers={[{id: 'wellington', depth: 0.4, filter: 'contrast(1.2)'}]} zoom={1.4} place={{x: 0.5, y: 0.34}} cam={{z: k * 0.006}} />
              <Fill style={{background: 'linear-gradient(0deg, #0a0a0a 5%, transparent 50%)'}} />
              <TypographyImpact text="WELLESLEY" mode="slam" font="grotesk" size={210} y={1440} color="#fff" />
              <TypographyImpact text="LATER DUKE OF WELLINGTON" at={4} mode="track" font="archive" size={34} y={1560} color="#ff9a9a" tracking={0.25} weight={600} />
            </Fill>
          ),
        ],
      ]}
    />
    <Flashes ats={[0, 30, 60]} len={1} tail={3} />
  </CameraShake>
);

const AustriaReturns: React.FC<{l: number}> = ({l}) => (
  <CameraShake amp={pulse(l, 0, 6) * 30 + 2}>
    <Fill style={{background: '#f2c01e'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 960, background: '#111'}} />
      <TypographyImpact text="1809" mode="slam" font="didone" size={420} y={520} color="#f2c01e" />
      <TypographyImpact text="AUSTRIA RETURNS" at={8} mode="slam" font="grotesk" size={150} y={1300} color="#111" />
      <Caption text="Fifth Coalition" at={14} y={1420} color="#3a2a00" />
    </Fill>
    <FlashFrame at={0} len={1} tail={4} />
  </CameraShake>
);

/** Aspern-Essling — a small visual rupture. */
const Aspern: React.FC<{l: number}> = ({l}) => {
  const rupture = l >= 40 && l < 76;
  const cam = camAt(l, [
    [0, {lon: 15.5, lat: 48.5, zoom: 3, tilt: 40}],
    [60, {lon: 16.45, lat: 48.22, zoom: 5, tilt: 48, rot: 4}, CAMERA],
    [140, {lon: 16.5, lat: 48.25, zoom: 5.6, tilt: 50, rot: 6}],
  ]);
  return (
    <CameraShake amp={rupture ? 16 : 3} speed={1.5}>
      <SliceGlitch amount={rupture ? 0.35 : 0} seed={90}>
        <Fill>
          <AnimatedMap
            cam={cam}
            theme="mud"
            rivers={['danube']}
            filter={rupture ? 'grayscale(0.6) contrast(1.4)' : undefined}
            labels={[
              {at: P('vienna'), text: 'VIENNA', appear: 0},
              {at: P('aspern'), text: 'ASPERN-ESSLING', kind: 'battle', appear: 30, size: 44, dy: 40},
            ]}
          >
            <AnimatedArrow route={[P('vienna'), P('aspern')]} progress={prog(l, 10, 30, outExpo)} color="#3f7bff" width={12} head={40} smooth={false} />
            {rupture ? <AnimatedArrow route={[P('aspern'), [16.38, 48.18]]} progress={prog(l, 44, 20, outExpo)} color="#b30000" width={12} head={40} smooth={false} /> : null}
          </AnimatedMap>
          <TypographyImpact text="21–22 MAY 1809" at={30} mode="track" font="archive" size={40} y={300} color="#f2e6c8" tracking={0.3} weight={600} />
          <TypographyImpact text="ASPERN-ESSLING" at={40} mode="slam" font="grotesk" size={170} y={430} color="#b30000" chroma={8} />
          <TypographyImpact text="FORCED BACK ONTO LOBAU ISLAND" at={52} mode="stretch" font="cond" size={60} y={1560} color="#f2e6c8" tracking={0.05} />
          {rupture ? <Scanlines opacity={0.35} size={5} roll={3} /> : null}
        </Fill>
      </SliceGlitch>
      <FlashFrame at={40} len={2} color="#b30000" tail={4} />
      <FlashFrame at={138} len={2} color="#000" />
    </CameraShake>
  );
};

/** Wagram — huge flash; a win that feels heavier than before. */
const Wagram: React.FC<{l: number}> = ({l}) => {
  const hit = pulses(l, [0, 16, 32], 8);
  return (
    <CameraShake amp={hit * 44 + 6} speed={1.1} zoomKick={0.5}>
      <ChromaticAberration amount={hit * 16}>
        <Fill style={{background: '#2b2620'}}>
          <HistoricalImage id="wagram_vernet" zoom={1.3 + l * 0.004} place={{x: 0.55, y: 0.5}} filter="contrast(1.25) saturate(0.7)" />
          <Smoke count={10} seed={91} opacity={0.75} y={1100} spread={1400} scale={1.4} speed={4} tint="brightness(0.55)" />
          <Fill style={{background: '#fff4d6', opacity: kf(l, [[0, 1], [10, 0.1], [16, 0.6], [24, 0]])}} />
          <BattleTitle name="WAGRAM" date="5–6 July 1809" at={0} y={400} size={320} color="#fff" accent="#f3e2a6" />
          <TypographyImpact text="VICTORY — AT A HEAVY PRICE" at={16} mode="rise" font="cond" size={64} y={1580} color="#f3e2a6" />
        </Fill>
      </ChromaticAberration>
      <FlashFrame at={0} len={2} tail={10} />
    </CameraShake>
  );
};

/** Dynasty: extremely quick. */
const Dynasty: React.FC<{l: number}> = ({l}) => (
  <Fill style={{background: '#0d1a4a'}}>
    <BeeField opacity={0.3} size={90} offset={l * 3} />
    <Montage
      shots={[
        [
          22,
          (k) => (
            <Fill>
              <div style={{position: 'absolute', left: 290, top: 520, transform: `scale(${1 + k * 0.01})`}}>
                <Crown size={500} spin={k * 0.08} glow />
              </div>
              <TypographyImpact text="MARIE-LOUISE" mode="slam" font="imperial" size={100} y={1250} color="#f3e2a6" />
              <Caption text="archduchess of Austria · married April 1810" at={2} y={1350} color="#e9f2ff" size={30} />
            </Fill>
          ),
        ],
        [
          24,
          (k) => (
            <Fill>
              <EagleEmblem state="dominant" size={700} y={820} />
              <TypographyImpact text="KING OF ROME" mode="slam" font="imperial" size={100} y={1300} color="#f3e2a6" />
              <Caption text="a son and heir · 20 March 1811" at={2} y={1400} color="#e9f2ff" size={30} />
            </Fill>
          ),
        ],
        [
          24,
          (k) => (
            <Fill style={{background: '#8a0f1a'}}>
              <BeeField opacity={0.4} size={70} color="#f3e2a6" />
              <TypographyImpact text="THE IMPERIAL COURT" mode="stretch" font="imperial" size={80} y={960} color="#f3e2a6" />
            </Fill>
          ),
        ],
      ]}
    />
  </Fill>
);

/** Maximum extent, then instability: map flicker, cracks, snow arriving unannounced. */
const MaxExtent: React.FC<{l: number}> = ({l}) => {
  const cam = camAt(l, [
    [0, {lon: 8, lat: 47, zoom: 1.0, tilt: 45, rot: -4}],
    [110, {lon: 12, lat: 49, zoom: 0.52, tilt: 58, rot: 2}, CAMERA],
  ]);
  const instab = clamp((l - 40) / 60);
  const flick = instab > 0 && rnd(Math.floor(l / 2), 5) < instab * 0.4;
  return (
    <CameraShake amp={instab * 8} speed={2}>
      <SliceGlitch amount={flick ? 0.18 : 0} seed={95}>
        <Fill>
          <AnimatedMap
            cam={cam}
            theme="imperial"
            empire={flick ? 0.3 : clamp(l / 16)}
            empireColor="#2b5bd0"
            rivers={['rhine', 'danube', 'niemen']}
            labels={[
              {at: [2.4, 46.4], text: 'FRENCH EMPIRE', sub: 'c. 1811 · borders approx.', kind: 'big', appear: 6, color: '#fff', size: 80},
              ...STATES_1807_1811.slice(1).filter((s) => !s.label.includes('HOLLAND')).map((s, i) => ({at: s.at, text: s.label, kind: 'region' as const, appear: 14 + i * 4, color: '#f3e2a6', size: 26})),
              {at: [15, 45.2], text: 'ILLYRIAN PROVINCES', kind: 'region', appear: 20, color: '#fff', size: 24},
              {at: P('rome'), text: 'ROME', appear: 22, color: '#fff'},
              {at: P('hamburg'), text: 'HAMBURG', appear: 24, color: '#fff'},
            ]}
          />
          <Img src={staticFile('textures/cracks_0.png')} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, opacity: instab * 0.55, filter: 'invert(1) brightness(0.4)', mixBlendMode: 'multiply'}} />
        </Fill>
      </SliceGlitch>
      <NameMotif from={POWER.y1807} to={POWER.y1809} at={0} dur={40} text="NAPOLEON" y={300} color="rgba(243,226,166,0.4)" hollow tracking={-0.02} jitter={instab * 10} />
      <TypographyImpact text="1811" at={4} mode="slam" font="didone" size={220} y={1650} color="#f3e2a6" />
      <TypographyImpact text="MAXIMUM EXTENT" at={10} mode="track" font="imperial" size={44} y={1790} color="#fff" tracking={0.3} />
      {/* snow enters the frame before the audience knows why */}
      <ParticleField kind="snow" density={Math.floor(instab * 40)} speed={0.8} wind={2} seed={96} opacity={0.8} />
    </CameraShake>
  );
};
