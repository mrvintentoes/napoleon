import React from 'react';
import {
  useCurrentFrame, Fill, Seg, Cam, Figure, HistoricalImage, TypographyImpact, Caption, NameMotif, AnimatedMap, AnimatedArrow, MapPing,
  camAt, EagleEmblem, CannonSilhouette, Ship, Montage, ChromaticAberration, SliceGlitch, FlashFrame, CameraShake, Smoke,
  ParticleField, InfantryRank, ZoomStreaks, POWER, MARKERS, kf, clamp, prog, pulse, pulses, rnd, accel, outExpo, inCubic,
  inExpo, SLAM, CAMERA, OVERSHOOT, Shot, ShotFn, P, Parchment, Vignette, DotField, Tint,
} from './_kit';

const S = MARKERS.TOULON;
const DROP = MARKERS.DROP_1 - S; // 90

/**
 * TOULON 1793 (0:06.5–0:12) — first beat drop.
 * Build on the harbour map, black frame, CANNON. Napoleon rises out of the smoke:
 * "24 YEARS OLD" / "BRIGADIER GENERAL". Then 13 Vendémiaire (Paris, 5 Oct 1795).
 */
export const Toulon: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Fill style={{background: '#000'}}>
      <Seg from={0} dur={DROP - 2}>{(l) => <SiegeBuild l={l} />}</Seg>
      <Seg from={DROP} dur={222 - DROP}>{(l) => <Promotion l={l} />}</Seg>
      <Seg from={222}>{(l) => <Vendemiaire l={l} />}</Seg>
    </Fill>
  );
};

const SiegeBuild: React.FC<{l: number}> = ({l}) => {
  const cam = camAt(l, [
    [0, {lon: 6.3, lat: 43.6, zoom: 2.6, tilt: 38, rot: 6}],
    [86, {lon: 5.93, lat: 43.1, zoom: 9, tilt: 48, rot: -4}, inExpo],
  ]);
  const converge = (from: [number, number], t: number) => [from, P('toulon')] as [number, number][];
  return (
    <CameraShake amp={kf(l, [[0, 1], [86, 9]])} speed={0.9}>
      <AnimatedMap
        cam={cam}
        theme="blood"
        rivers={false}
        labels={[
          {at: P('toulon'), text: 'TOULON', kind: 'battle', appear: 20, size: 70},
          {at: [5.2, 42.6], text: 'Mediterranean', kind: 'sea', appear: 8},
        ]}
      >
        {[
          [4.4, 44.3],
          [6.9, 44.2],
          [5.2, 43.9],
          [6.6, 43.5],
        ].map((from, i) => (
          <AnimatedArrow key={i} route={converge(from as [number, number], 0)} progress={prog(l, 8 + i * 8, 40, outExpo)} color="#ff4a2a" width={10} head={40} smooth={false} />
        ))}
        <MapPing at={P('toulon')} t={((l % 20) / 20) * (l > 40 ? 1 : 0)} color="#ffcf6b" r={160} />
      </AnimatedMap>
      <Tint color="#6d0a10" opacity={0.25} blend="multiply" />
      {/* 1793 engraving of the assault strobes in over the map as the build tightens */}
      {l >= 52 && Math.floor((l - 52) / 5) % 2 === 0 ? (
        <HistoricalImage id="toulon_assault" zoom={1.25 + (l - 52) * 0.012} place={{x: 0.5, y: 0.5}} filter="sepia(0.6) contrast(1.4) brightness(0.9)" opacity={0.9} />
      ) : null}
      {/* the enemy fleet in the harbour, streaking guns */}
      <div style={{position: 'absolute', left: 1080 - l * 3, top: 1320, opacity: 0.9}}>
        <Ship size={380} color="#0a0304" />
      </div>
      <div style={{position: 'absolute', left: -700 + l * 10, top: 1500}}>
        <CannonSilhouette size={640} color="#050202" />
      </div>
      <TypographyImpact text="SIEGE OF TOULON" at={6} out={80} mode="track" font="cond" size={62} y={430} color="#f0e6d0" tracking={0.2} />
      <Caption text="September – December 1793 · royalist port held by the British and allies" at={16} out={80} y={500} size={28} color="#e3b0a6" />
      <TypographyImpact text="COMMANDER OF ARTILLERY" at={46} out={82} mode="stretch" font="grotesk" size={70} y={620} color="#ffcf6b" />
      <NameMotif from={POWER.y1785} to={POWER.y1793 * 0.8} at={30} dur={40} y={690} color="#f0e6d0" tracking={0.4} />
    </CameraShake>
  );
};

/** HOLY SHIT SHOT 1 — cannon fires behind him, camera rockets forward, smoke clears. */
const Promotion: React.FC<{l: number}> = ({l}) => {
  const hit = pulse(l, 0, 10);
  const hit2 = pulse(l, 30, 8);
  const hit3 = pulse(l, 60, 8);
  const rocket = kf(l, [[0, 0.55], [16, 1.08, SLAM], [120, 1.2]]);
  const smokeClear = clamp((l - 6) / 40);
  return (
    <CameraShake amp={hit * 50 + hit2 * 22 + hit3 * 22} speed={1.2} zoomKick={0.5}>
      <ChromaticAberration amount={hit * 26 + hit2 * 10}>
        <Fill style={{background: 'radial-gradient(circle at 50% 42%, #ffe3a0 0%, #ff6a1a 18%, #6d0a10 45%, #0a0203 80%)'}}>
          {/* muzzle flash + gun behind him */}
          <Fill style={{opacity: 0.9}}>
            <div style={{position: 'absolute', left: -120, top: 560, transform: `scale(${1 + hit * 0.2})`}}>
              <CannonSilhouette size={1300} color="#120304" flash={hit} />
            </div>
          </Fill>
          <ZoomStreaks amount={hit * 0.9 + 0.15} color="255,210,140" />
          <Cam s={rocket} y={kf(l, [[0, 300], [16, 0, SLAM]])}>
            <Figure id="napoleon_toulon_fg" x={560} y={1260} h={1500} filter="contrast(1.2) saturate(1.15) drop-shadow(0 0 40px rgba(0,0,0,0.8))" />
          </Cam>
          <Smoke count={9} seed={12} opacity={0.85 * (1 - smokeClear) + 0.15} y={1300} spread={1100} scale={1.4} speed={6} tint="sepia(1) hue-rotate(-20deg) brightness(0.6)" />
          <ParticleField kind="sparks" density={70} speed={1.4} seed={4} dir={-90} opacity={hit * 1.2} size={1.5} />
          {/* typography */}
          <TypographyImpact text="1793" noFit at={2} mode="cut" font="didone" size={620} y={1000} color="rgba(255,220,170,0.12)" stroke="rgba(255,220,170,0.35)" strokeW={3} />
          <TypographyImpact text="TOULON" at={0} mode="slam" font="grotesk" size={290} y={300} color="#fff4e0" chroma={hit * 14} out={28} outMode="blur" />
          <TypographyImpact text="24 YEARS OLD" at={30} mode="slam" font="grotesk" size={150} y={300} color="#fff4e0" out={58} outMode="cut" />
          <TypographyImpact text="22 DECEMBER 1793" at={60} mode="track" font="archive" size={40} y={120} color="#ffcf6b" tracking={0.3} weight={600} />
          <TypographyImpact text="BRIGADIER" at={60} mode="slam" font="grotesk" size={210} y={250} color="#fff4e0" rot={-2} chroma={hit3 * 12} />
          <TypographyImpact text="GENERAL" at={64} mode="slam" font="grotesk" size={210} y={440} color="#ffcf6b" rot={-2} />
          <NameMotif from={POWER.y1793} at={74} y={1780} color="#fff4e0" tracking={0.45} />
          <EagleEmblem state="faint" size={300} y={1650} at={80} />
        </Fill>
      </ChromaticAberration>
      <FlashFrame at={0} len={2} tail={6} color="#fff" />
      <FlashFrame at={30} len={1} tail={4} color="#ffdca0" />
      <FlashFrame at={60} len={1} tail={4} color="#fff" />
      <FlashFrame at={130} len={2} color="#000" />
    </CameraShake>
  );
};

/** 13 VENDÉMIAIRE — very quick Paris / cannon / uprising montage (5 October 1795). */
const Vendemiaire: React.FC<{l: number}> = ({l}) => {
  const durs = [16, 12, 12, 10, 10, 14, 14, 20];
  const shots: ShotFn[] = [
    (k) => (
      <Fill style={{background: '#0b0b0b'}}>
        <TypographyImpact text="13 VENDÉMIAIRE" mode="slam" font="grotesk" size={150} y={900} color="#f0e6d0" />
        <TypographyImpact text="PARIS · 5 OCTOBER 1795" mode="track" font="archive" size={38} y={1020} color="#c8102e" tracking={0.3} weight={600} />
      </Fill>
    ),
    (k) => (
      <Fill style={{background: '#c9bfae'}}>
        <div style={{position: 'absolute', left: 1100 - k * 60, top: 820}}>
          <InfantryRank count={24} spacing={52} h={520} color="#161010" hat="bicorne" frame={k * 4} seed={11} flip />
        </div>
        <TypographyImpact text="ROYALIST INSURRECTION" mode="cut" font="cond" size={70} y={600} color="#161010" tracking={0.05} />
      </Fill>
    ),
    (k) => (
      <Fill style={{background: '#160406'}}>
        <div style={{position: 'absolute', left: -40, top: 760}}>
          <CannonSilhouette size={1150} color="#000" flash={pulse(k, 2, 4)} />
        </div>
        <TypographyImpact text="CANNON" mode="cut" font="grotesk" size={260} y={560} color="#ffcf6b" scale={1 + k * 0.04} />
      </Fill>
    ),
    (k) => (
      <Fill>
        <HistoricalImage id="consul_halftone" zoom={2.4} place={{x: 0.5, y: 0.45}} filter="contrast(1.5)" />
        <Tint color="#c8102e" blend="multiply" opacity={0.6} />
      </Fill>
    ),
    (k) => (
      <Fill style={{background: '#c8102e'}}>
        <TypographyImpact text="PARIS" mode="cut" font="didone" size={360} y={960} color="#0b0b0b" italic />
      </Fill>
    ),
    (k) => (
      <Fill style={{background: '#0b0b0b'}}>
        <Smoke count={8} seed={2} opacity={0.8} y={1100} speed={10} scale={1.2} />
        <div style={{position: 'absolute', left: 1080 - k * 90, top: 900}}>
          <CannonSilhouette size={900} color="#f0e6d0" />
        </div>
      </Fill>
    ),
    (k) => (
      <Fill style={{background: '#f0e6d0'}}>
        <TypographyImpact text="THE CONVENTION IS SAVED" mode="cut" font="cond" size={72} y={940} color="#0b0b0b" />
        <Caption text="Bonaparte's guns disperse the insurgents" at={0} y={1030} color="#6d0a10" size={34} />
      </Fill>
    ),
    (k) => (
      <Fill style={{background: '#000'}}>
        <NameMotif from={POWER.y1793} to={POWER.y1796 * 0.8} at={0} dur={16} y={960} color="#f0e6d0" tracking={0.3} />
      </Fill>
    ),
  ];
  return (
    <CameraShake amp={6} speed={1}>
      <Montage shots={durs.map((d, i): Shot => [d, shots[i]])} hold />
    </CameraShake>
  );
};
