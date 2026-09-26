import React from 'react';
import {
  Fill, Seg, Cam, Figure, HistoricalImage, ParallaxPainting, TypographyImpact, Caption, NameMotif, BattleTitle, AnimatedMap,
  AnimatedArrow, MapPing, camAt, Flag, InfantryRank, Memory, EagleEmblem, ChromaticAberration, SliceGlitch, FlashFrame, Flashes,
  CameraShake, Smoke, ParticleField, Tint, Montage, CannonSilhouette, POWER, MARKERS, kf, clamp, prog, pulse, pulses, rnd, noise1,
  outExpo, inCubic, inExpo, SLAM, CAMERA, OVERSHOOT, P, route, F, Shot,
} from './_kit';

const S = MARKERS.WATERLOO;
const DROP = MARKERS.WATERLOO_DROP - S; // 180
const CLIMAX = MARKERS.WATERLOO_CLIMAX - S; // 420
const CUT = MARKERS.FINAL_CUT - S; // 600

/**
 * ACT X — WATERLOO (2:01–2:13). The final visual climax, then absolute silence.
 * HOLY SHIT SHOT 10: as the Imperial Guard advances, 4-frame flashes of the whole career.
 */
export const Waterloo: React.FC = () => (
  <Fill style={{background: '#000'}}>
    <Seg from={0} dur={DROP}>{(l) => <Belgium l={l} />}</Seg>
    <Seg from={DROP} dur={CLIMAX - DROP}>{(l) => <Battle l={l} />}</Seg>
    <Seg from={CLIMAX} dur={CUT - CLIMAX}>{(l) => <Guard l={l} />}</Seg>
    <Seg from={CUT}>{(l) => <Silence l={l} />}</Seg>
  </Fill>
);

const Belgium: React.FC<{l: number}> = ({l}) => {
  const cam = camAt(l, [
    [0, {lon: 3.6, lat: 49.8, zoom: 1.6, tilt: 40, rot: 0}],
    [70, {lon: 4.5, lat: 50.5, zoom: 5.5, tilt: 50, rot: -4}, CAMERA],
    [170, {lon: 4.45, lat: 50.62, zoom: 9, tilt: 56, rot: 3}, inCubic],
  ]);
  return (
    <Fill>
      <AnimatedMap
        cam={cam}
        theme="mud"
        rivers={false}
        labels={[
          {at: P('brussels'), text: 'BRUSSELS', appear: 10},
          {at: P('charleroi'), text: 'CHARLEROI', appear: 20},
          {at: P('ligny'), text: 'LIGNY', sub: 'vs Blücher', kind: 'battle', appear: 70, size: 44},
          {at: P('quatreBras'), text: 'QUATRE BRAS', sub: 'vs Wellington', kind: 'battle', appear: 80, size: 44, dx: -80},
          {at: P('wavre'), text: 'WAVRE', appear: 120, color: '#c8c8c8'},
          {at: P('waterloo'), text: 'WATERLOO', appear: 140, color: '#fff'},
        ]}
      >
        <AnimatedArrow route={route('belgium1815')} progress={prog(l, 6, 120, CAMERA) * 0.8} color="#2b5bd0" width={16} head={52} />
        <AnimatedArrow route={[P('ligny'), P('wavre')]} progress={prog(l, 100, 40, outExpo)} color="#111" width={12} head={40} dashed smooth={false} />
        <MapPing at={P('ligny')} t={(l - 70) / 18} r={200} color="#fff" />
        <MapPing at={P('quatreBras')} t={(l - 80) / 18} r={200} color="#fff" />
      </AnimatedMap>
      <Tint color="#3d4a36" opacity={0.3} blend="multiply" />
      <ParticleField kind="rain" density={Math.floor(kf(l, [[60, 0], [170, 180]]))} speed={1} wind={10} seed={220} opacity={0.8} />
      <TypographyImpact text="BELGIUM" at={0} mode="track" font="imperial" size={90} y={330} color="#f2e6c8" tracking={0.3} out={66} outMode="blur" />
      <TypographyImpact text="JUNE 1815" at={6} mode="track" font="archive" size={38} y={430} color="#c9b98a" tracking={0.3} weight={600} out={66} />
      <TypographyImpact text="16 JUNE" at={70} out={140} mode="slam" font="grotesk" size={200} y={330} color="#f2e6c8" />
      <Caption text="Ligny: the Prussians are beaten — but not destroyed" at={96} out={140} y={460} color="#f2e6c8" size={30} />
      <TypographyImpact text="18 JUNE 1815" at={146} mode="stretch" font="grotesk" size={150} y={330} color="#fff" />
      <FlashFrame at={178} len={2} color="#000" />
    </Fill>
  );
};

/** rain, mud, infantry, British lines, Hougoumont, La Haye Sainte, Ney's cavalry, Wellington, Prussians arriving */
const Battle: React.FC<{l: number}> = ({l}) => {
  const B = 30;
  const beats = Array.from({length: 8}, (_, i) => i * B);
  const hit = pulses(l, beats, 6);
  const shots: Shot[] = [
    [
      30,
      (k) => (
        <Fill style={{background: '#2d3228'}}>
          <HistoricalImage id="napoleon_waterloo" zoom={1.3 + k * 0.006} place={{x: 0.5, y: 0.5}} />
          <Smoke count={6} seed={230} opacity={0.5} y={1100} spread={1300} speed={4} tint="brightness(0.6)" />
          <BattleTitle name="WATERLOO" date="18 June 1815" at={0} y={420} size={320} color="#fff" accent="#c8102e" chroma={10} />
        </Fill>
      ),
    ],
    [
      30,
      (k) => (
        <Fill style={{background: '#4a4f40'}}>
          <Fill style={{background: 'linear-gradient(180deg, #6b6b62, #2d3228 70%)'}} />
          {[0, 1, 2].map((r) => (
            <div key={r} style={{position: 'absolute', left: -600 + k * (8 + r * 3) + r * 40, top: 980 + r * 200}}>
              <InfantryRank count={30} spacing={46} h={220 + r * 70} color="#1b2438" hat="shako" frame={k * 2} seed={r + 231} />
            </div>
          ))}
          <TypographyImpact text="FRENCH COLUMNS" mode="cut" font="grotesk" size={130} y={420} color="#f2e6c8" />
          <Caption text="Hougoumont · La Haye Sainte" at={2} y={540} color="#c9b98a" />
        </Fill>
      ),
    ],
    [
      30,
      (k) => (
        <Fill style={{background: '#3d4a36'}}>
          {[0, 1].map((r) => (
            <div key={r} style={{position: 'absolute', left: 1100 - k * (6 + r * 2) - r * 60 - 1200, top: 1040 + r * 240}}>
              <InfantryRank count={34} spacing={40} h={260 + r * 90} color="#9b1a1a" hat="shako" frame={k} seed={r + 233} />
            </div>
          ))}
          <TypographyImpact text="BRITISH LINES" mode="cut" font="grotesk" size={130} y={420} color="#f2e6c8" />
          <Caption text="the ridge of Mont-Saint-Jean" at={2} y={540} color="#c9b98a" />
        </Fill>
      ),
    ],
    [
      30,
      (k) => (
        <Fill style={{background: '#20241c'}}>
          <Smoke count={6} seed={234} opacity={0.6} y={1200} speed={12} scale={1.2} />
          {[0, 1, 2, 3].map((r) => (
            <div key={r} style={{position: 'absolute', left: -700 + k * (50 + r * 10) + r * 150, top: 700 + r * 250}}>
              <Figure id="consul_rider_sil" x={0} y={0} h={500 - r * 60} filter="invert(0.85)" />
            </div>
          ))}
          <TypographyImpact text="NEY" mode="slam" font="grotesk" size={380} y={420} color="#fff" />
          <Caption text="leads massed cavalry charges" at={2} y={620} color="#f2e6c8" />
        </Fill>
      ),
    ],
    [
      30,
      (k) => (
        <Fill style={{background: '#111'}}>
          <ParallaxPainting base="wellington" layers={[{id: 'wellington', depth: 0.4, filter: 'grayscale(0.4) contrast(1.2)'}]} zoom={1.5} place={{x: 0.5, y: 0.34}} cam={{z: k * 0.008}} />
          <Fill style={{background: 'linear-gradient(0deg, #111 10%, transparent 50%)'}} />
          <TypographyImpact text="WELLINGTON" mode="slam" font="grotesk" size={200} y={1480} color="#fff" />
        </Fill>
      ),
    ],
    [
      30,
      (k) => (
        <Fill style={{background: '#2d3228'}}>
          <HistoricalImage id="consul_fried" zoom={1.6} place={{x: 0.5, y: 0.35}} filter="grayscale(0.7) contrast(1.3)" />
          <Tint color="#3d4a36" opacity={0.5} blend="multiply" />
          <TypographyImpact text="NAPOLEON" mode="slam" font="grotesk" size={200} y={1480} color="#fff" />
        </Fill>
      ),
    ],
    [
      60,
      (k) => (
        <Fill style={{background: '#4a4f40'}}>
          <Fill style={{background: 'linear-gradient(180deg, #6b6b62, #2d3228 70%)'}} />
          {/* Prussians enter from the side of the frame */}
          {[0, 1, 2].map((r) => (
            <div key={r} style={{position: 'absolute', left: 1300 - k * (16 + r * 4) - r * 100, top: 1000 + r * 200}}>
              <InfantryRank count={24} spacing={46} h={220 + r * 60} color="#111" hat="shako" frame={k * 2} seed={r + 236} flip />
            </div>
          ))}
          <div style={{position: 'absolute', left: kf(k, [[0, 1200], [20, 640, SLAM]]), top: 640}}>
            <Flag kind="prussia" width={380} frame={k * 2} />
          </div>
          <TypographyImpact text="THE PRUSSIANS ARRIVE" mode="slam" font="grotesk" size={120} y={420} color="#f2e6c8" />
          <Caption text="Plancenoit · on the French right flank" at={6} y={540} color="#c9b98a" />
        </Fill>
      ),
    ],
  ];
  return (
    <CameraShake amp={hit * 32 + 6} speed={1.3} zoomKick={0.4}>
      <ChromaticAberration amount={hit * 12}>
        <Fill>
          <Montage shots={shots} hold />
          <ParticleField kind="rain" density={200} speed={1} wind={12} seed={239} opacity={0.7} />
        </Fill>
      </ChromaticAberration>
      <Flashes ats={beats} len={1} tail={3} max={0.6} />
    </CameraShake>
  );
};

/** The Imperial Guard; the career flashes backwards as memories; the Guard dissolves into smoke. */
const Guard: React.FC<{l: number}> = ({l}) => {
  const mem = (['toulon', 'italy', 'pyramids', 'marengo', 'coronation', 'austerlitz', 'jena', 'tilsit', 'wagram', 'moscow', 'elba'] as const).map(
    (k): Shot => [4, (x) => <Memory kind={k} f={x} />]
  );
  const memStart = 40;
  const memEnd = memStart + mem.length * 4; // 84
  const dissolve = clamp((l - 120) / 50);
  const hit = pulses(l, [0, 30, memEnd], 8);
  return (
    <CameraShake amp={hit * 40 + 8 - dissolve * 6} speed={1.3} zoomKick={0.5}>
      <ChromaticAberration amount={hit * 16 + 2}>
        <Fill style={{background: '#2d3228'}}>
          <Fill style={{background: 'linear-gradient(180deg, #55594d 0%, #2d3228 60%, #1a1d16 100%)'}} />
          {/* the Guard: bearskins, advancing toward camera */}
          {[0, 1, 2, 3].map((r) => (
            <div
              key={r}
              style={{
                position: 'absolute',
                left: 540,
                top: 1040 + r * 150,
                transform: `translateX(-50%) scale(${kf(l, [[0, 0.8 + r * 0.25], [200, 1.1 + r * 0.3]])})`,
                opacity: 1 - dissolve * (1 - r * 0.1),
                filter: `blur(${dissolve * (6 - r)}px)`,
              }}
            >
              <InfantryRank count={22} spacing={48} h={200} color="#0d1320" hat="bearskin" frame={l} seed={r + 240} />
            </div>
          ))}
          <Smoke count={12} seed={245} opacity={0.35 + dissolve * 0.45} y={1200 - dissolve * 300} spread={1400} scale={1.6} speed={3} tint="brightness(0.4)" />
          <Flag kind="france" width={300} frame={l} style={{position: 'absolute', left: 390, top: 700, opacity: 1 - dissolve}} />
          <TypographyImpact text="THE IMPERIAL GUARD" at={0} mode="slam" font="grotesk" size={140} y={380} color="#fff" out={memStart - 4} outMode="cut" />
          <Caption text="the final assault · evening, 18 June 1815" at={6} out={memStart - 4} y={500} color="#f2e6c8" />
          <EagleEmblem state="shattered" size={800} y={700} at={memEnd + 20} />
          <TypographyImpact text="THE GUARD FALLS BACK" at={memEnd + 30} mode="rise" font="cond" size={70} y={1640} color="#f2e6c8" out={170} outMode="blur" />
        </Fill>
      </ChromaticAberration>
      {/* career flashback — memories at 4 frames each */}
      <Montage offset={memStart} shots={mem} />
      <Flashes ats={Array.from({length: 11}, (_, i) => memStart + i * 4)} len={1} max={0.4} />
      <FlashFrame at={memEnd} len={2} tail={8} />
    </CameraShake>
  );
};

/** Music cuts. Silence. One distant cannon. WATERLOO. DEFEAT. */
const Silence: React.FC<{l: number}> = ({l}) => (
  <Fill style={{background: '#000'}}>
    {/* distant cannon flash on the horizon */}
    <div style={{position: 'absolute', left: 700, top: 1130, width: 160, height: 40, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,200,120,0.9), transparent 70%)', opacity: pulse(l, 36, 6)}} />
    <TypographyImpact text="WATERLOO" at={30} mode="cut" font="imperial" size={64} y={900} color="#c8c8c8" tracking={0.5} />
    <TypographyImpact text="DEFEAT" at={72} mode="cut" font="archive" size={40} y={990} color="#8a8a8a" tracking={0.6} weight={600} />
  </Fill>
);
