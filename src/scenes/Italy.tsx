import React from 'react';
import {
  useCurrentFrame, Fill, Seg, Cam, Figure, HistoricalImage, ParallaxPainting, TypographyImpact, Caption, NameMotif, BattleTitle,
  AnimatedMap, AnimatedArrow, MapPing, camAt, Flag, Laurel, Doc, Montage, ChromaticAberration, SliceGlitch, FlashFrame, Flashes,
  CameraShake, Smoke, ParticleField, StripeField, Sunburst, HalftoneOverlay, Tint, ZoomStreaks, whipStyle, EagleEmblem, POWER,
  kf, clamp, prog, pulse, pulses, rnd, outExpo, inCubic, inExpo, SLAM, CAMERA, WHIP, OVERSHOOT, outBack, P, route, F,
} from './_kit';

/**
 * ACT I — THE GENERAL, 1796–1797 (0:12–0:24). Music fully in.
 * HOLY SHIT SHOT 2: Napoleon locked centre frame while the campaign map rips past
 * behind him; each victory makes him larger.
 */
const BATTLES = [
  {name: 'MONTENOTTE', date: '12 April 1796', at: 80, place: P('montenotte'), prog: 0.3},
  {name: 'LODI', date: '10 May 1796', at: 160, place: P('lodi'), prog: 0.5},
  {name: 'ARCOLE', date: '15–17 November 1796', at: 240, place: P('arcole'), prog: 0.78},
  {name: 'RIVOLI', date: '14–15 January 1797', at: 320, place: P('rivoli'), prog: 0.9},
];
const GENERALS = [
  {name: 'MASSÉNA', role: 'division commander', at: 124, x: 250, y: 760},
  {name: 'AUGEREAU', role: 'division commander', at: 204, x: 830, y: 700},
  {name: 'BERTHIER', role: 'chief of staff', at: 284, x: 240, y: 640},
  {name: 'MURAT', role: 'aide-de-camp', at: 364, x: 840, y: 780},
];

export const Italy: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Fill style={{background: '#1a0c05'}}>
      <Seg from={0} dur={72}>{(l) => <Opening l={l} />}</Seg>
      <Seg from={72} dur={362}>{(l) => <CampaignShot l={l} />}</Seg>
      <Seg from={434} dur={130}>{(l) => <AustriaBreaks l={l} />}</Seg>
      <Seg from={564}>{(l) => <FreezeFrame l={l} />}</Seg>
    </Fill>
  );
};

const Opening: React.FC<{l: number}> = ({l}) => {
  const hit = pulses(l, [0, 24, 48], 7);
  return (
    <CameraShake amp={hit * 26} speed={1.1}>
      <Montage
        shots={[
          [
            24,
            (k) => (
              <Fill style={{background: '#c8923a'}}>
                <StripeField colors={['#9b2a1a', '#c8923a', '#ecd8a8']} speed={24} w={90} angle={60} opacity={0.35} />
                <TypographyImpact text="1796" mode="slam" font="didone" size={560} y={960} color="#1a0c05" />
                <TypographyImpact text="PARIS · 2 MARCH" mode="track" font="archive" size={40} y={1320} color="#1a0c05" tracking={0.3} weight={600} />
              </Fill>
            ),
          ],
          [
            24,
            (k) => (
              <Fill>
                <ParallaxPainting
                  base="napoleon_arcole"
                  layers={[{id: 'napoleon_arcole', depth: 0.3, filter: 'sepia(0.25) saturate(1.3) contrast(1.1)'}]}
                  zoom={1.35}
                  place={{x: 0.5, y: 0.34}}
                  cam={{z: k * 0.012}}
                />
                <Tint color="#9b2a1a" opacity={0.35} blend="multiply" />
                <TypographyImpact text="ARMY OF ITALY" mode="stretch" font="grotesk" size={170} y={1460} color="#ecd8a8" shadow="0 8px 30px rgba(0,0,0,0.8)" />
              </Fill>
            ),
          ],
          [
            24,
            (k) => (
              <Fill style={{background: '#1a0c05'}}>
                <TypographyImpact text="26" mode="cut" font="didone" size={900} y={900} color="#2e160a" />
                <TypographyImpact text="26 YEARS OLD" mode="slam" font="grotesk" size={150} y={820} color="#ecd8a8" />
                <TypographyImpact text="GENERAL-IN-CHIEF" at={6} mode="slam" font="grotesk" size={120} y={1000} color="#e8b04a" />
              </Fill>
            ),
          ],
        ]}
      />
      <Flashes ats={[0, 24, 48]} len={1} color="#fff3d6" tail={3} />
    </CameraShake>
  );
};

/** HOLY SHIT SHOT 2 */
const CampaignShot: React.FC<{l: number}> = ({l}) => {
  // camera keyframes track each battle; between battles the map whips (motion blur on the map)
  const keys: [number, {lon: number; lat: number; zoom: number; tilt: number; rot: number}, ((t: number) => number)?][] = [
    [0, {lon: 7.3, lat: 43.9, zoom: 2.6, tilt: 42, rot: -8}],
  ];
  BATTLES.forEach((b2, i) => {
    keys.push([b2.at - 8, {lon: b2.place[0], lat: b2.place[1] - 0.25, zoom: 3.6 + i * 0.2, tilt: 44, rot: i % 2 ? 6 : -6}, WHIP]);
    keys.push([b2.at + 60, {lon: b2.place[0] + 0.15, lat: b2.place[1] - 0.2, zoom: 4.0 + i * 0.2, tilt: 46, rot: i % 2 ? 4 : -4}]);
  });
  keys.push([362, {lon: 12.5, lat: 45.6, zoom: 1.9, tilt: 38, rot: 0}, inCubic]);
  const cam = camAt(l, keys);
  const prevCam = camAt(l - 1, keys);
  const speed = Math.hypot(cam.lon - prevCam.lon, cam.lat - prevCam.lat) * 60;
  const mapBlur = Math.min(18, speed * 2.2);
  const arrowProg = kf(
    l,
    BATTLES.flatMap((b2, i) => [
      [b2.at - 20, i === 0 ? 0 : BATTLES[i - 1].prog],
      [b2.at, b2.prog, outExpo],
    ] as [number, number, ((t: number) => number)?][]).concat([[330, 1]])
  );
  const hits = BATTLES.map((b2) => b2.at);
  const hit = pulses(l, hits, 8);
  const growIdx = BATTLES.filter((b2) => l >= b2.at).length;
  const napScale = kf(l, [[0, 0.92], ...BATTLES.map((b2, i) => [b2.at, 0.92 + (i + 1) * 0.07, OVERSHOOT] as [number, number, (t: number) => number])]);

  return (
    <CameraShake amp={hit * 22 + 2} speed={0.9} zoomKick={0.4}>
      {/* map plane behind */}
      <Fill style={{filter: mapBlur > 0.5 ? `blur(${mapBlur}px)` : undefined}}>
        <AnimatedMap
          cam={cam}
          theme="parchment"
          rivers={['po']}
          labels={[
            {at: P('nice'), text: 'NICE', appear: 2},
            {at: P('milan'), text: 'MILAN', appear: 150},
            {at: P('mantua'), text: 'MANTUA', appear: 230},
            {at: [9.2, 44.1], text: 'Ligurian Sea', kind: 'sea', appear: 0},
            ...BATTLES.map((b2) => ({at: b2.place, text: b2.name, kind: 'battle' as const, appear: b2.at, size: 64, color: '#7a1a0e'})),
          ]}
        >
          <AnimatedArrow route={route('italy1796')} progress={arrowProg} color="#b3121b" width={16} head={60} glow />
          {BATTLES.map((b2) => (
            <MapPing key={b2.name} at={b2.place} t={(l - b2.at) / 24} color="#7a1a0e" r={260} />
          ))}
        </AnimatedMap>
      </Fill>
      <Tint color="#c8923a" opacity={0.28} blend="multiply" />
      <Fill style={{background: 'linear-gradient(0deg, rgba(26,12,5,0.95) 0%, rgba(26,12,5,0.0) 45%, rgba(26,12,5,0) 70%, rgba(26,12,5,0.7) 100%)'}} />
      {/* growing name behind him */}
      <NameMotif from={POWER.y1793} to={POWER.y1796} at={0} dur={330} y={1080} color="rgba(236,216,168,0.55)" hollow tracking={0.15} />
      {/* Napoleon: locked to frame centre, growing with each victory */}
      <Cam s={napScale + hit * 0.03} origin="50% 100%">
        <Figure id="harangue_nap" x={540} y={1500} h={1050} filter="drop-shadow(0 0 30px rgba(0,0,0,0.9)) contrast(1.15) saturate(1.1)" />
      </Cam>
      {/* generals orbit in */}
      {GENERALS.map((g) => (
        <GeneralCard key={g.name} {...g} l={l} />
      ))}
      {/* battle titles */}
      {BATTLES.map((b2, i) => (
        <BattleTitle key={b2.name} name={b2.name} date={b2.date} at={b2.at} out={b2.at + 62} y={300} size={230} color="#fff6e4" accent="#e8b04a" rot={i % 2 ? 2 : -2} chroma={6} />
      ))}
      <ParticleField kind="dust" density={60} speed={3} seed={3} opacity={0.7} />
      <ZoomStreaks amount={Math.min(0.6, mapBlur / 30)} color="255,236,200" />
      <Flashes ats={hits} len={1} tail={4} color="#fff" max={0.8} />
      <FlashFrame at={360} len={2} color="#000" />
    </CameraShake>
  );
};

const GeneralCard: React.FC<{name: string; role: string; at: number; x: number; y: number; l: number}> = ({name, role, at, x, y, l}) => {
  const t = l - at;
  if (t < 0 || t > 40) return null;
  const s = kf(t, [[0, 0.2], [7, 1.08, SLAM], [12, 1], [32, 1], [40, 0.4, inCubic]]);
  const o = kf(t, [[0, 0], [3, 1], [32, 1], [40, 0]]);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotate(${(x < 540 ? -1 : 1) * 4}deg)`, opacity: o}}>
      <div style={{position: 'relative', width: 340, height: 340}}>
        <div style={{position: 'absolute', inset: 40, borderRadius: '50%', background: 'radial-gradient(circle, #2a1408, #120804)', border: '3px solid #e8b04a', boxShadow: '0 0 40px rgba(232,176,74,0.5)'}} />
        <div style={{position: 'absolute', left: -10, top: -10}}>
          <Laurel size={360} grow={clamp(t / 10)} />
        </div>
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
          <div style={{fontFamily: F.imperial, fontWeight: 900, fontSize: 40, color: '#f5e2b0', letterSpacing: '0.06em'}}>{name}</div>
          <div style={{fontFamily: F.archive, fontStyle: 'italic', fontSize: 22, color: '#d9b777', marginTop: 6}}>{role}</div>
        </div>
      </div>
    </div>
  );
};

const AustriaBreaks: React.FC<{l: number}> = ({l}) => {
  // 1796 -> 1797 flicker counter, Austria's colours fracture, Campo Formio
  const yr = l < 44 ? (Math.floor(l / Math.max(1, 8 - l / 7)) % 2 === 0 ? '1796' : '1797') : '1797';
  const shatter = clamp((l - 40) / 30);
  const hit = pulses(l, [40, 76], 8);
  return (
    <CameraShake amp={hit * 30 + 3} speed={1}>
      <SliceGlitch amount={shatter > 0 && shatter < 1 ? 0.4 * (1 - shatter) + 0.1 : 0} seed={9}>
        <Fill style={{background: '#16100a'}}>
          <Fill style={{opacity: 1 - shatter}}>
            {Array.from({length: 12}, (_, i) => {
              const r1 = rnd(3, i);
              const dx = (r1 - 0.5) * shatter * 1400;
              const dy = (rnd(4, i) - 0.3) * shatter * 1600;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: (i % 3) * 360,
                    top: 360 + Math.floor(i / 3) * 300,
                    width: 360,
                    height: 300,
                    overflow: 'hidden',
                    transform: `translate(${dx}px, ${dy}px) rotate(${(r1 - 0.5) * shatter * 160}deg)`,
                  }}
                >
                  <div style={{position: 'absolute', left: -(i % 3) * 360, top: -Math.floor(i / 3) * 300, width: 1080, height: 1200}}>
                    <div style={{height: 600, background: '#111'}} />
                    <div style={{height: 600, background: '#f2c01e'}} />
                  </div>
                </div>
              );
            })}
          </Fill>
          <TypographyImpact text="AUSTRIA" mode="cut" font="grotesk" size={250} y={960} color={shatter > 0 ? '#f2c01e' : '#16100a'} opacity={1 - shatter} />
          <TypographyImpact text={yr} mode="cut" font="didone" size={300} y={260} color="#ecd8a8" key={yr} />
          {l >= 70 ? (
            <Fill>
              <div style={{position: 'absolute', left: 540, top: 1060, transform: `translate(-50%,-50%) rotate(${kf(l, [[70, -14], [84, -3, SLAM]])}deg) scale(${kf(l, [[70, 2.2], [80, 0.9, SLAM]])})`}}>
                <Doc title="TRAITÉ DE CAMPO-FORMIO" sub="17 octobre 1797" w={640} h={760} seed={4} reveal={clamp((l - 72) / 20)} />
              </div>
              <TypographyImpact text="CAMPO FORMIO" at={76} mode="slam" font="grotesk" size={170} y={430} color="#ecd8a8" />
              <Caption text="Austria makes peace · 17 October 1797" at={82} y={540} color="#e8b04a" />
            </Fill>
          ) : null}
        </Fill>
      </SliceGlitch>
      <Flashes ats={[40, 76]} len={1} tail={4} />
    </CameraShake>
  );
};

const FreezeFrame: React.FC<{l: number}> = ({l}) => {
  // Freeze: painting locks, white print border punches in, name grows behind.
  const pop = kf(l, [[0, 1.3], [8, 0.86, SLAM], [120, 0.8]]);
  const whip = clamp((l - 136) / 20);
  return (
    <Fill style={{background: '#ecd8a8', ...whipStyle(whip, -1, 1600)}}>
      <HalftoneOverlay size={14} opacity={0.25} color="#9b2a1a" />
      <NameMotif from={POWER.y1796} to={POWER.y1797} at={4} dur={40} text="BONAPARTE" y={1500} x={540} color="#9b2a1a" tracking={0.02} rot={0} scaleY={1.6} />
      <NameMotif from={POWER.y1796} to={POWER.y1797} at={4} dur={40} text="BONAPARTE" y={420} x={540} color="#9b2a1a" hollow tracking={0.02} scaleY={1.6} />
      <div style={{position: 'absolute', left: 540, top: 960, width: 900, height: 1200, transform: `translate(-50%,-50%) scale(${pop}) rotate(${kf(l, [[0, 6], [8, -2.5, SLAM]])}deg)`, background: '#fff', boxShadow: '0 40px 80px rgba(0,0,0,0.5)'}}>
        <div style={{position: 'absolute', inset: 30, overflow: 'hidden'}}>
          <HistoricalImage id="napoleon_arcole" boxW={840} boxH={1140} zoom={1.2 + l * 0.0015} place={{x: 0.5, y: 0.34}} filter="saturate(1.2) contrast(1.1)" />
        </div>
        <div style={{position: 'absolute', left: 30, bottom: -8, fontFamily: F.archive, fontStyle: 'italic', fontSize: 26, color: '#4a2a10'}}>
          Général Bonaparte · armée d'Italie · 1796–1797
        </div>
      </div>
      <FlashFrame at={0} len={2} color="#fff" />
    </Fill>
  );
};
