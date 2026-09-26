import React from 'react';
import {
  useCurrentFrame, Fill, Seg, Cam, Figure, HistoricalImage, ParallaxPainting, TypographyImpact, Caption, NameMotif, BattleTitle,
  AnimatedMap, AnimatedArrow, MapPing, camAt, Flag, Ship, Pyramids, Montage, ChromaticAberration, SliceGlitch, FlashFrame, Flashes,
  CameraShake, Smoke, ParticleField, Sunburst, HalftoneOverlay, Tint, Img, staticFile, whipStyle, POWER, MARKERS,
  kf, clamp, prog, pulse, pulses, rnd, noise1, outExpo, inCubic, inExpo, SLAM, CAMERA, WHIP, DRIFT, P, route, F,
} from './_kit';

const S = MARKERS.EGYPT;
const NILE = MARKERS.NILE - S; // 330

/**
 * ACT II — EGYPT 1798–1799 (0:24–0:33).
 * Mediterranean blue -> desert gold. Pyramids out of the noise. Then Nelson
 * corrupts the triumph; the fleet burns; Bonaparte leaves; black; PARIS.
 */
export const Egypt: React.FC = () => (
  <Fill style={{background: '#000'}}>
    <Seg from={0} dur={112}>{(l) => <Voyage l={l} />}</Seg>
    <Seg from={112} dur={NILE - 112}>{(l) => <PyramidsShot l={l} />}</Seg>
    <Seg from={NILE} dur={122}>{(l) => <Nile l={l} />}</Seg>
    <Seg from={NILE + 122}>{(l) => <Departure l={l} />}</Seg>
  </Fill>
);

const Voyage: React.FC<{l: number}> = ({l}) => {
  const cam = camAt(l, [
    [0, {lon: 8, lat: 42, zoom: 1.1, tilt: 30, rot: 4}],
    [60, {lon: 17, lat: 36.5, zoom: 0.62, tilt: 36, rot: 0}, CAMERA],
    [112, {lon: 29.5, lat: 31, zoom: 1.5, tilt: 44, rot: -6}, inExpo],
  ]);
  const goldMix = clamp((l - 50) / 60);
  return (
    <Fill>
      <AnimatedMap
        cam={cam}
        theme="blueprint"
        rivers={['nile']}
        labels={[
          {at: P('toulon'), text: 'TOULON', sub: 'May 1798', appear: 4},
          {at: P('malta'), text: 'MALTA', sub: 'June 1798', appear: 34, kind: 'battle', size: 54},
          {at: P('alexandria'), text: 'ALEXANDRIA', sub: '1 July 1798', appear: 70},
          {at: [18, 34.5], text: 'Mare Mediterraneum', kind: 'sea', appear: 10, size: 44},
        ]}
      >
        <AnimatedArrow route={route('egypt1798')} progress={prog(l, 4, 100, inCubic)} color="#e8b04a" width={16} head={64} glow smooth />
        <MapPing at={P('malta')} t={(l - 34) / 20} color="#fff" r={200} />
      </AnimatedMap>
      <Tint color="#e9a53c" opacity={goldMix * 0.85} blend="color" />
      <div style={{position: 'absolute', left: kf(l, [[0, -300], [112, 1100]]), top: 1450, transform: 'scale(0.5)', opacity: 0.85}}>
        <Ship size={500} color="#06131f" />
      </div>
      <TypographyImpact text="1798" at={0} mode="slam" font="didone" size={260} y={330} color="#e9f2ff" out={50} outMode="blur" />
      <TypographyImpact text="FRANCE" at={6} mode="track" font="cond" size={48} y={470} color="#9fd0ff" tracking={0.5} out={30} outMode="cut" />
      <TypographyImpact text="MALTA" at={30} mode="track" font="cond" size={48} y={470} color="#f4e2b8" tracking={0.5} out={62} outMode="cut" />
      <TypographyImpact text="EGYPT" at={62} mode="slam" font="grotesk" size={320} y={420} color="#f7d08a" chroma={4} />
    </Fill>
  );
};

const PyramidsShot: React.FC<{l: number}> = ({l}) => {
  // pyramids emerge from grain/noise, then the painting in 2.5D, harangue cut-out, standard waves
  const emerge = clamp(l / 30);
  const hit = pulses(l, [30, 70, 130], 8);
  const noiseO = 1 - emerge;
  return (
    <CameraShake amp={hit * 22 + 1.5} speed={0.8} zoomKick={0.3}>
      <Montage
        hold
        shots={[
          [
            70,
            (k) => (
              <Fill style={{background: 'linear-gradient(180deg, #f7d08a 0%, #e79c3c 55%, #5a3510 100%)'}}>
                <Sunburst c1="rgba(255,236,190,0.5)" c2="rgba(231,156,60,0)" rays={30} speed={0.3} y="55%" />
                <div style={{position: 'absolute', left: 0, top: 820 + (1 - emerge) * 300, transform: `scale(${1 + k * 0.004})`, transformOrigin: '50% 100%', filter: `blur(${(1 - emerge) * 12}px) contrast(${1 + noiseO})`}}>
                  <Pyramids width={1080} color="#2a1a08" />
                </div>
                <Smoke count={5} seed={30} opacity={0.35} y={1500} speed={2} tint="sepia(1) saturate(2) brightness(0.9)" />
                <ParticleField kind="dust" density={120} seed={5} speed={4} color="#fff0c8" opacity={1} size={1.4} />
                {noiseO > 0.02 ? <Img src={staticFile(`textures/grain_${k % 8}.png`)} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, opacity: noiseO, mixBlendMode: 'hard-light'}} /> : null}
                <BattleTitle name="PYRAMIDS" date="21 July 1798" at={30} y={420} size={250} color="#2a1a08" accent="#5a3510" echo />
              </Fill>
            ),
          ],
          [
            64,
            (k) => (
              <Fill>
                <ParallaxPainting
                  base="pyramids_battle"
                  zoom={1.0}
                  place={{x: 0.72, y: 0.55}}
                  layers={[
                    {id: 'pyramids_battle', depth: 0.25},
                    {id: 'pyramids_battle', depth: 1.2, mask: 'linear-gradient(180deg, transparent 58%, black 72%)'},
                  ]}
                  cam={{x: -k * 4, z: k * 0.004}}
                />
                <Tint color="#e79c3c" opacity={0.35} blend="soft-light" />
                <Smoke count={6} seed={31} opacity={0.4} y={1200} speed={3} tint="sepia(0.8)" />
                <div style={{position: 'absolute', left: 620 - k * 1.5, top: 520, transform: `rotate(${noise1(k * 0.1, 3) * 4}deg) skewY(${noise1(k * 0.13, 5) * 3}deg)`}}>
                  <Img src={staticFile('images/cut/watteau_flag_fg.png')} style={{width: 300}} />
                </div>
                <TypographyImpact text="PYRAMIDS" mode="cut" font="grotesk" size={210} y={260} color="#fff3dc" shadow="0 8px 30px rgba(0,0,0,0.6)" />
              </Fill>
            ),
          ],
          [
            84,
            (k) => (
              <Fill>
                <ParallaxPainting
                  base="harangue"
                  zoom={1.08}
                  place={{x: 0.5, y: 0.3}}
                  layers={[
                    {id: 'harangue_plate', depth: 0.2, filter: 'sepia(0.3) saturate(1.3)'},
                    {id: 'harangue_fg', depth: 1, filter: 'drop-shadow(0 0 24px rgba(0,0,0,0.7)) saturate(1.2)'},
                  ]}
                  cam={{x: kf(k, [[0, 60], [84, -30]]), y: kf(k, [[0, 20], [84, -10]]), z: kf(k, [[0, 0], [84, 0.12]])}}
                  between={{
                    1: <TypographyImpact text="1798" mode="cut" font="didone" size={520} y={560} color="rgba(255,226,160,0.4)" />,
                  }}
                />
                <Fill style={{background: 'linear-gradient(0deg, rgba(40,20,5,0.9), transparent 40%)'}} />
                <TypographyImpact text="ARMÉE D'ORIENT" at={4} mode="track" font="imperial" size={62} y={1560} color="#f7d08a" tracking={0.12} />
                <Caption text="Gros, Bonaparte haranguing the army before the Battle of the Pyramids (1810)" at={10} y={1640} size={24} color="#d9b777" />
                <NameMotif from={POWER.y1797} at={20} y={1760} color="#f7d08a" tracking={0.3} />
              </Fill>
            ),
          ],
        ]}
      />
      {/* scientific expedition: measure lines over everything */}
      {l >= 150 && l < 218 ? <Savants l={l - 150} /> : null}
      <Flashes ats={[30, 70, 134]} len={1} tail={4} color="#fff3d6" />
    </CameraShake>
  );
};

const Savants: React.FC<{l: number}> = ({l}) => {
  const d = clamp(l / 30);
  return (
    <Fill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <g stroke="#9fd0ff" strokeWidth={2} fill="none" opacity={0.7}>
          <circle cx={540} cy={380} r={260 * d} strokeDasharray="6 8" />
          <path d={`M160,380 L${160 + 760 * d},380`} />
          <path d={`M540,120 L540,${120 + 520 * d}`} />
        </g>
      </svg>
      <TypographyImpact text="COMMISSION DES SCIENCES ET DES ARTS" at={6} mode="type" font="archive" size={30} y={720} color="#cfe8ff" tracking={0.08} weight={600} />
    </Fill>
  );
};

/** The triumph corrupts: Nelson, Aboukir Bay, the fleet burns. */
const Nile: React.FC<{l: number}> = ({l}) => {
  const hit = pulses(l, [0, 26, 52], 7);
  const burn = clamp((l - 30) / 60);
  return (
    <CameraShake amp={hit * 34 + 4} speed={1.3}>
      <SliceGlitch amount={l < 10 || (l > 50 && l < 60) ? 0.5 : 0.08} seed={17}>
        <ChromaticAberration amount={hit * 22 + 3}>
          <Fill style={{background: `linear-gradient(180deg, #050b14 0%, #0b1a2a 55%, ${burn > 0 ? '#3a0a02' : '#0b1a2a'} 100%)`}}>
            <Fill style={{background: `radial-gradient(circle at 50% 70%, rgba(255,120,30,${burn * 0.9}) 0%, rgba(120,20,5,${burn * 0.5}) 35%, transparent 70%)`}} />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{position: 'absolute', left: -60 + i * 280, top: 1080 + (i % 2) * 90 + burn * 40, transform: `scale(${0.7 + (i % 2) * 0.2}) rotate(${burn * (i % 2 ? 8 : -6)}deg)`, filter: `brightness(${1 - burn * 0.5})`}}>
                <Ship size={420} color="#030507" fire={burn * (0.6 + rnd(2, i + Math.floor(l / 3)) * 0.4)} />
              </div>
            ))}
            <ParticleField kind="embers" density={140} speed={2.2} seed={9} opacity={burn} size={1.5} />
            <Smoke count={7} seed={40} opacity={0.5 * burn} y={1100} speed={4} tint="brightness(0.25)" />
            <TypographyImpact text="NELSON" at={0} out={24} outMode="cut" mode="slam" font="grotesk" size={330} y={560} color="#c8102e" chroma={10} />
            <TypographyImpact text="ABOUKIR BAY" at={26} out={50} outMode="cut" mode="stretch" font="grotesk" size={170} y={520} color="#e9f2ff" />
            <TypographyImpact text="1–3 AUGUST 1798" at={28} out={50} outMode="cut" mode="track" font="archive" size={40} y={640} color="#ff8a5a" tracking={0.3} weight={600} />
            <TypographyImpact text="THE NILE" at={52} mode="slam" font="grotesk" size={300} y={500} color="#ffb070" chroma={8} />
            <Caption text="the French fleet is shattered — the army is stranded in Egypt" at={62} y={660} color="#f2c0a0" size={32} />
          </Fill>
        </ChromaticAberration>
      </SliceGlitch>
      <Flashes ats={[0, 26, 52]} len={1} color="#fff" tail={4} />
    </CameraShake>
  );
};

/** Bonaparte leaves Egypt. Tiny ship, dashed return line, black, PARIS. */
const Departure: React.FC<{l: number}> = ({l}) => {
  const cam = camAt(l, [
    [0, {lon: 24, lat: 36, zoom: 0.7, tilt: 20}],
    [60, {lon: 12, lat: 41, zoom: 0.8, tilt: 20}, DRIFT],
  ]);
  if (l >= 72) return <Fill style={{background: '#000'}} />;
  return (
    <Fill>
      <AnimatedMap cam={cam} theme="imperial" rivers={false} labels={[{at: P('frejus'), text: 'FRÉJUS', sub: '9 October 1799', appear: 44}]}>
        <AnimatedArrow route={route('egyptReturn')} progress={prog(l, 4, 50, inCubic)} color="#e9f2ff" width={6} head={30} dashed />
      </AnimatedMap>
      <TypographyImpact text="AUGUST 1799" at={4} mode="track" font="archive" size={44} y={520} color="#f3e2a6" tracking={0.3} weight={600} />
      <TypographyImpact text="BONAPARTE LEAVES EGYPT" at={10} mode="rise" font="cond" size={64} y={600} color="#fff" />
    </Fill>
  );
};
