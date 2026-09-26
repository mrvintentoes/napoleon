import React from 'react';
import {
  useCurrentFrame, Fill, Seg, Cam, Figure, HistoricalImage, ParallaxPainting, TypographyImpact, Caption, NameMotif,
  Crown, Laurel, NMonogram, BeeField, NotreDame, Bicorne, EagleEmblem, FlashFrame, Flashes, CameraShake, ParticleField,
  Sunburst, Tint, ZoomStreaks, ChromaticAberration, POWER, MARKERS,
  kf, clamp, prog, pulse, pulses, noise1, outExpo, inCubic, inExpo, SLAM, CAMERA, OVERSHOOT, F,
} from './_kit';
import {hasFile} from '../data/assets';
import {bicorneMask} from '../components/art/Regalia';

const S = MARKERS.CORONATION;
const DROP = MARKERS.CROWN_DROP - S; // 60

/**
 * 1804 — HOLY SHIT SHOT 3.
 * Total stop: 10 frames of black silence. A crown floats in darkness. 1804.
 * The crown drops -> hard cut into Notre-Dame; the camera flies through the nave.
 * NAPOLEON I / EMPEREUR DES FRANÇAIS fills the screen. The eagle appears strongly.
 * Ends on MOTIF 4: the bicorne turns to camera and wipes into Austerlitz fog.
 */
export const Coronation: React.FC = () => (
  <Fill style={{background: '#000'}}>
    <Seg from={10} dur={DROP - 10}>{(l) => <FloatingCrown l={l} />}</Seg>
    <Seg from={DROP} dur={150}>{(l) => <NotreDameFlight l={l} />}</Seg>
    <Seg from={DROP + 150} dur={100}>{(l) => <Imperial l={l} />}</Seg>
    <Seg from={DROP + 250}>{(l) => <BicorneTurn l={l} />}</Seg>
  </Fill>
);

const FloatingCrown: React.FC<{l: number}> = ({l}) => {
  const fall = clamp((l - 42) / 8);
  const y = 820 + noise1(l * 0.05, 2) * 10 + inCubic(fall) * 1400;
  return (
    <Fill style={{background: 'radial-gradient(circle at 50% 45%, #1a1405 0%, #000 55%)'}}>
      <ParticleField kind="gold" density={60} speed={0.3} seed={21} opacity={0.6} size={0.9} />
      <div style={{position: 'absolute', left: 540 - 260, top: y - 260, opacity: clamp(l / 10), transform: `rotate(${noise1(l * 0.04, 5) * 3}deg)`, filter: `blur(${fall * 16}px)`}}>
        <Crown size={520} spin={l * 0.035} glow />
      </div>
      <TypographyImpact text="1804" at={14} mode="track" font="didone" size={120} y={1300} color="#d9a93e" tracking={0.3} out={44} outMode="cut" />
    </Fill>
  );
};

const ARCH = (w: number, h: number) =>
  `M0,${h} L0,${h * 0.42} Q0,0 ${w / 2},0 Q${w},0 ${w},${h * 0.42} L${w},${h} L${w - 50},${h} L${w - 50},${h * 0.44} Q${w - 50},50 ${w / 2},48 Q50,50 50,${h * 0.44} L50,${h} Z`;

/** camera flies through receding gothic arches; Napoleon crowns himself at the vanishing point */
const NotreDameFlight: React.FC<{l: number}> = ({l}) => {
  const travel = kf(l, [[0, 0], [70, 3.2, outExpo], [150, 4.2]]);
  const david = hasFile('coronation_david');
  const hit = pulses(l, [0, 70], 8);
  return (
    <CameraShake amp={hit * 30} speed={1} zoomKick={0.5}>
      <ChromaticAberration amount={hit * 14}>
        <Fill style={{background: 'radial-gradient(ellipse at 50% 40%, #ffe7a8 0%, #d9a93e 18%, #5a3a0a 45%, #0d0a14 80%)'}}>
          {david ? (
            <ParallaxPainting base="coronation_david" layers={[{id: 'coronation_david', depth: 0.4}]} zoom={1.2 + travel * 0.15} place={{x: 0.5, y: 0.45}} filter="saturate(1.2)" />
          ) : (
            <Sunburst c1="rgba(255,236,190,0.35)" c2="rgba(217,169,62,0)" rays={40} speed={0.5} y="38%" />
          )}
          {/* nave arches, back to front */}
          {Array.from({length: 9}, (_, i) => {
            const z = i - travel * 2; // distance
            if (z < -0.6) return null;
            const s = 1 / (0.35 + z * 0.35);
            const w = 520 * s;
            const h = 1100 * s;
            const o = clamp(1.4 - z * 0.18) * clamp((z + 0.6) * 2);
            return (
              <svg key={i} viewBox={`0 0 520 1100`} width={w} height={h} style={{position: 'absolute', left: 540 - w / 2, top: 760 - h * 0.45, opacity: o, zIndex: 20 - i}}>
                <path d={ARCH(520, 1100)} fill="#0d0a14" />
              </svg>
            );
          })}
          <ParticleField kind="gold" density={90} speed={0.6} seed={22} opacity={0.9} size={1.1} />
          {/* he crowns himself: raised arm holds the crown */}
          <Cam s={kf(l, [[0, 0.5], [70, 0.95, outExpo], [150, 1.05]])} origin="50% 70%">
            <Figure id="harangue_nap_sil" x={540} y={1130} h={1150} opacity={0.96} />
            <div style={{position: 'absolute', left: 700 - 70, top: 520 - 60 + kf(l, [[0, -200], [60, 0, OVERSHOOT]])}}>
              <Laurel size={150} grow={clamp(l / 60)} />
            </div>
          </Cam>
          <TypographyImpact text="NOTRE-DAME" at={10} out={66} mode="track" font="imperial" size={60} y={300} color="#fff1c8" tracking={0.35} />
          <TypographyImpact text="2 DECEMBER 1804" at={16} out={66} mode="track" font="archive" size={40} y={380} color="#ffe7a8" tracking={0.3} weight={600} />
          <Caption text="he crowns himself" at={36} out={66} y={1640} color="#fff1c8" size={40} />
          {/* The name fills the screen */}
          <TypographyImpact text="I" at={70} mode="slam" font="imperial" size={1500} y={1000} color="rgba(255,231,168,0.14)" />
          <TypographyImpact text="NAPOLEON" at={70} mode="slam" font="imperial" size={172} y={1450} color="#fff4d0" tracking={0.02} glow="rgba(255,190,80,0.6)" />
          <TypographyImpact text="I" at={74} mode="slam" font="imperial" size={172} y={1620} color="#d9a93e" />
          <TypographyImpact text="EMPEREUR DES FRANÇAIS" at={82} mode="track" font="imperial" size={62} y={1760} color="#ffe7a8" tracking={0.08} />
        </Fill>
      </ChromaticAberration>
      <FlashFrame at={0} len={2} tail={8} color="#fff4d0" />
      <FlashFrame at={70} len={1} tail={6} color="#fff" />
    </CameraShake>
  );
};

/** Imperial overload begins: bees, the eagle appears strongly, BONAPARTE becomes NAPOLEON. */
const Imperial: React.FC<{l: number}> = ({l}) => {
  const hit = pulses(l, [0, 30, 60], 7);
  return (
    <CameraShake amp={hit * 20} speed={1}>
      <Fill style={{background: '#0d1a4a'}}>
        <BeeField opacity={0.28} size={100} offset={l * 1.5} />
        <Fill style={{background: 'radial-gradient(circle at 50% 50%, rgba(217,169,62,0.4), transparent 60%)'}} />
        <EagleEmblem state="strong" size={900} y={860} at={0} />
        {/* the name changes: BONAPARTE -> NAPOLEON */}
        {l < 30 ? <NameMotif from={POWER.y1799} at={0} y={1500} color="#f3e2a6" tracking={0.05} opacity={1 - clamp((l - 18) / 10)} /> : null}
        <NameMotif from={POWER.y1799} to={POWER.y1804} at={30} dur={16} text="NAPOLEON" y={1520} color="#f3e2a6" tracking={0.02} />
        <TypographyImpact text="EMPEREUR" at={60} mode="stretch" font="grotesk" size={260} y={260} color="#fff" />
        <div style={{position: 'absolute', left: 60, top: 1720, opacity: clamp((l - 40) / 6)}}>
          <NMonogram size={150} grow={clamp((l - 40) / 20)} />
        </div>
        <div style={{position: 'absolute', right: 60, top: 1720, opacity: clamp((l - 46) / 6)}}>
          <NMonogram size={150} grow={clamp((l - 46) / 20)} />
        </div>
      </Fill>
      <Flashes ats={[0, 30, 60]} len={1} tail={4} color="#ffe7a8" />
    </CameraShake>
  );
};

/** MOTIF 4 (use 1): the bicorne rotates toward camera, becomes a mask, becomes the Austerlitz horizon. */
const BicorneTurn: React.FC<{l: number}> = ({l}) => {
  const turn = kf(l, [[0, 70], [30, 0, outExpo]]);
  const grow = kf(l, [[20, 1], [50, 30, inExpo]]);
  const m = bicorneMask();
  return (
    <Fill style={{background: '#0d1a4a'}}>
      <BeeField opacity={0.2} size={100} />
      <div style={{position: 'absolute', left: 540, top: 900, transform: `translate(-50%,-50%) perspective(900px) rotateY(${turn}deg) scale(${grow})`}}>
        <div style={{position: 'relative', width: 700, height: 300}}>
          {/* inside the hat silhouette: cold fog of 2 December 1805 */}
          <div style={{position: 'absolute', inset: 0, WebkitMaskImage: m, WebkitMaskSize: '100% 100%', maskImage: m, maskSize: '100% 100%', background: 'linear-gradient(180deg, #7b8794, #b8c1c8 60%, #d5dadc)'}} />
          <div style={{position: 'absolute', inset: 0, opacity: 1 - clamp((grow - 1) / 3)}}>
            <Bicorne size={700} />
          </div>
        </div>
      </div>
    </Fill>
  );
};
