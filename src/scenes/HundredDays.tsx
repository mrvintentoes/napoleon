import React from 'react';
import {
  Fill, Seg, Cam, Figure, HistoricalImage, ParallaxPainting, TypographyImpact, Caption, NameMotif, AnimatedMap, AnimatedArrow, MapPing,
  camAt, Flag, Eagle, EagleEmblem, Island, ChromaticAberration, SliceGlitch, FlashFrame, Flashes, CameraShake, ParticleField, Sunburst,
  Tunnel, StripeField, ColorField, Tint, ZoomStreaks, Smoke, POWER, MARKERS, kf, clamp, prog, pulse, pulses, rnd, noise1, outExpo,
  inCubic, inExpo, SLAM, CAMERA, OVERSHOOT, P, route, F,
} from './_kit';

const S = MARKERS.HUNDRED_DAYS;
const DROP = MARKERS.HUNDRED_DAYS_DROP - S; // 90
const PARIS = MARKERS.PARIS_1815 - S; // 300

/** Show the verified Golfe-Juan proclamation line (see SOURCES.md). Set false to omit the quotation entirely. */
export const SHOW_EAGLE_QUOTE = true;

/**
 * ACT IX — THE HUNDRED DAYS (1:52–2:01). HOLY SHIT SHOT 9.
 * Darkness, silhouette on Elba, one hit — eyes. ESCAPE. The route races north,
 * each leg faster. Royal symbols flee. PARIS: full 1805–07 energy restored.
 * Then the outlaw declaration and the coalition converging from seven directions.
 */
export const HundredDays: React.FC = () => (
  <Fill style={{background: '#000'}}>
    <Seg from={0} dur={DROP}>{(l) => <Darkness l={l} />}</Seg>
    <Seg from={DROP} dur={40}>{(l) => <Eyes l={l} />}</Seg>
    <Seg from={DROP + 40} dur={PARIS - DROP - 40}>{(l) => <RouteNorth l={l} />}</Seg>
    <Seg from={PARIS} dur={130}>{(l) => <Returns l={l} />}</Seg>
    <Seg from={PARIS + 130}>{(l) => <Outlaw l={l} />}</Seg>
  </Fill>
);

const Darkness: React.FC<{l: number}> = ({l}) => (
  <Fill style={{background: '#030507'}}>
    <div style={{position: 'absolute', left: 340, top: 1000, width: 400, opacity: 0.5}}>
      <Island kind="elba" width={400} color="#0c1318" />
    </div>
    <Figure id="harangue_nap_sil" x={540} y={1052} h={120} anchor="bottom" opacity={0.9} />
    <TypographyImpact text="ELBA" at={20} mode="flicker" font="archive" size={34} y={760} color="#5c707a" tracking={0.6} weight={600} out={80} outMode="cut" />
    <TypographyImpact text="1815" at={30} mode="flicker" font="archive" size={34} y={820} color="#5c707a" tracking={0.6} weight={600} out={80} outMode="cut" />
    <TypographyImpact text="26 FEBRUARY" at={46} mode="type" font="archive" size={26} y={1300} color="#3c4a52" tracking={0.3} out={80} outMode="cut" />
  </Fill>
);

/** One hit. Portrait flash — the eyes. */
const Eyes: React.FC<{l: number}> = ({l}) => {
  const hit = pulse(l, 0, 10);
  return (
    <CameraShake amp={hit * 50} speed={1.4} zoomKick={0.8}>
      <ChromaticAberration amount={hit * 30 + 4}>
        <Fill style={{background: '#000'}}>
          {/* eyes strip */}
          <div style={{position: 'absolute', left: 0, top: 660, width: 1080, height: 420, overflow: 'hidden'}}>
            <HistoricalImage id="consul" boxW={1080} boxH={420} zoom={9 * kf(l, [[0, 1.15], [40, 1]])} focus={{x: 0.39, y: 0.198}} place={{x: 0.5, y: 0.5}} filter="contrast(1.4) saturate(1.3)" clamp={false} />
          </div>
          <TypographyImpact text="ESCAPE" at={10} mode="slam" font="grotesk" size={300} y={1400} color="#fff" />
          <TypographyImpact text="THE HUNDRED DAYS" at={16} mode="track" font="imperial" size={54} y={1560} color="#e3b955" tracking={0.2} />
        </Fill>
      </ChromaticAberration>
      <FlashFrame at={0} len={2} tail={6} color="#fff" />
    </CameraShake>
  );
};

const LEGS = [
  {to: 'golfeJuan' as const, label: 'GOLFE-JUAN', date: '1 March', at: 0, prog: 0.12},
  {to: 'grenoble' as const, label: 'GRENOBLE', date: '7 March', at: 50, prog: 0.66},
  {to: 'lyon' as const, label: 'LYON', date: '10 March', at: 88, prog: 0.77},
  {to: 'paris' as const, label: 'PARIS', date: '20 March', at: 116, prog: 1},
];

const RouteNorth: React.FC<{l: number}> = ({l}) => {
  const keys: [number, {lon: number; lat: number; zoom: number; tilt: number; rot: number}, ((t: number) => number)?][] = [[0, {lon: 9, lat: 43.2, zoom: 2.6, tilt: 40, rot: -10}]];
  LEGS.forEach((g, i) => keys.push([g.at + 12, {lon: P(g.to)[0], lat: P(g.to)[1] - 0.4, zoom: 3 - i * 0.35, tilt: 48 + i * 3, rot: (i % 2 ? 1 : -1) * 6}, i === 0 ? CAMERA : inCubic]));
  const cam = camAt(l, keys);
  const progress = kf(l, LEGS.map((g, i) => [g.at + (i === 0 ? 20 : 10), g.prog, i === 0 ? outExpo : inCubic] as [number, number, (t: number) => number]));
  const hit = pulses(l, LEGS.map((g) => g.at + 10), 6);
  const energy = clamp(l / 150);
  return (
    <CameraShake amp={hit * 24 + energy * 8} speed={1 + energy} zoomKick={0.4}>
      <AnimatedMap
        cam={cam}
        theme="imperial"
        rivers={['rhine', 'seine']}
        labels={[
          {at: P('elba'), text: 'ELBA', appear: 0},
          ...LEGS.map((g) => ({at: P(g.to), text: g.label, sub: `${g.date} 1815`, kind: 'battle' as const, appear: g.at + 8, color: '#fff', size: 52})),
        ]}
      >
        <AnimatedArrow route={route('vol1815')} progress={progress} color="#e3b955" width={18} head={64} glow />
      </AnimatedMap>
      <Fill style={{background: `rgba(11,42,120,${0.2 + energy * 0.2})`, mixBlendMode: 'multiply'}} />
      {/* royal symbols flee */}
      <div style={{position: 'absolute', left: kf(l, [[20, 620], [130, 1500, inExpo]]), top: 240, transform: `rotate(${kf(l, [[20, 0], [130, 30]])}deg)`, opacity: kf(l, [[20, 1], [130, 0]])}}>
        <Flag kind="bourbon" width={380} frame={l} />
        <div style={{fontFamily: F.archive, fontStyle: 'italic', fontSize: 30, color: '#f7f5ef', marginLeft: 20}}>Louis XVIII leaves Paris</div>
      </div>
      {SHOW_EAGLE_QUOTE ? (
        <>
          {l >= 58 && l < 158 ? <div style={{position: 'absolute', left: 40, right: 40, top: 1400, height: 340, background: 'rgba(5,10,28,0.82)', borderTop: '2px solid #e3b955', borderBottom: '2px solid #e3b955'}} /> : null}
          <TypographyImpact text="« DE CLOCHER EN CLOCHER »" at={58} out={150} mode="slam" font="imperial" size={62} y={1480} color="#f3e2a6" />
          <TypographyImpact
            text="L'aigle, avec les couleurs nationales, volera de clocher en clocher jusqu'aux tours de Notre-Dame."
            at={64}
            out={150}
            mode="type"
            font="archive"
            size={30}
            y={1590}
            width={900}
            lineHeight={1.25}
            color="#e9f2ff"
            italic
          />
          <Caption text="Proclamation to the army, Golfe-Juan, 1 March 1815" at={80} out={150} y={1700} size={24} color="#9fb6c8" />
        </>
      ) : null}
      {LEGS.map((g, i) => (
        <TypographyImpact key={g.label} text={g.label} at={g.at + 10} out={(LEGS[i + 1]?.at ?? 160) + 8} outMode="cut" mode="slam" font="grotesk" size={150 + i * 40} y={330} color="#fff" chroma={4 + i * 3} />
      ))}
      <ParticleField kind="gold" density={Math.floor(energy * 90)} speed={2 + energy * 3} seed={210} />
      <Flashes ats={LEGS.map((g) => g.at + 10)} len={1} tail={3} />
    </CameraShake>
  );
};

/** PARIS, 20 March 1815 — full maximalism restored; the eagle flies again; NAPOLEON RETURNS. */
const Returns: React.FC<{l: number}> = ({l}) => {
  const beats = [0, 15, 30, 45, 60, 75, 90, 105];
  const hit = pulses(l, beats, 6);
  const bg = Math.floor(l / 15) % 3;
  return (
    <CameraShake amp={hit * 40 + 6} speed={1.4} zoomKick={0.6}>
      <ChromaticAberration amount={hit * 18 + 3}>
        <Fill>
          {bg === 0 ? <Sunburst c1="#e3b955" c2="#0b2a78" rays={36} speed={3} mask={false} /> : null}
          {bg === 1 ? <Tunnel c1="#0b2a78" c2="#c8102e" speed={10} ring={140} /> : null}
          {bg === 2 ? <StripeField speed={40} w={120} /> : null}
          <ColorField colors={['rgba(200,16,46,0.5)', 'rgba(11,42,120,0.5)', 'rgba(227,185,85,0.5)', 'rgba(0,0,0,0)']} speed={4} hue={2} opacity={0.6} blend="screen" />
          <Cam s={kf(l, [[0, 0.6], [12, 1.05, SLAM], [130, 1.15]]) + hit * 0.03}>
            <Figure id="consul_rider" x={540} y={1180} h={1250} filter="drop-shadow(0 0 50px rgba(0,0,0,0.8)) saturate(1.3)" />
          </Cam>
          <EagleEmblem state="flying" size={700} y={500} at={30} />
          <NameMotif from={POWER.y1814} to={POWER.y1815} at={0} dur={14} text="NAPOLEON" y={1540} color="#fff" tracking={-0.02} />
          <TypographyImpact text="RETURNS" at={20} mode="slam" font="grotesk" size={260} y={1760} color="#e3b955" chroma={6} />
          <TypographyImpact text="PARIS · 20 MARCH 1815" at={4} mode="track" font="archive" size={40} y={200} color="#fff" tracking={0.3} weight={600} />
          <ParticleField kind="gold" density={120} speed={4} seed={211} />
        </Fill>
      </ChromaticAberration>
      <Flashes ats={beats} len={1} tail={3} max={0.7} />
    </CameraShake>
  );
};

/** Declared an outlaw; the Seventh Coalition converges from seven directions. */
const Outlaw: React.FC<{l: number}> = ({l}) => {
  const dirs = [0, 1, 2, 3, 4, 5, 6].map((i) => (i / 7) * Math.PI * 2 - Math.PI / 2);
  const kinds = ['britain', 'prussia', 'russia', 'austria', 'netherlands', 'sweden', 'spain'] as const;
  const conv = clamp((l - 20) / 70);
  return (
    <CameraShake amp={conv * 20 + 3} speed={1.2}>
      <Fill style={{background: '#101318'}}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {dirs.map((a, i) => {
            const r0 = 1200;
            const r1 = 1200 - conv * 1040;
            return <line key={i} x1={540 + Math.cos(a) * r0} y1={960 + Math.sin(a) * r0} x2={540 + Math.cos(a) * r1} y2={960 + Math.sin(a) * r1} stroke="#b30000" strokeWidth={26} strokeLinecap="round" />;
          })}
        </svg>
        {dirs.map((a, i) => {
          const r = 1100 - conv * 700;
          return (
            <div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * r - 110, top: 960 + Math.sin(a) * r - 80}}>
              <Flag kind={kinds[i]} width={220} frame={l * 2 + i * 7} />
            </div>
          );
        })}
        <Figure id="consul_rider_sil_white" x={540} y={960} h={kf(l, [[0, 420], [90, 260]])} />
        <TypographyImpact text="DECLARED AN OUTLAW" at={0} mode="slam" font="grotesk" size={120} y={260} color="#fff" out={60} outMode="cut" />
        <Caption text="Congress of Vienna · 13 March 1815" at={4} out={60} y={360} color="#9fb6c8" />
        <TypographyImpact text="SEVENTH COALITION" at={60} mode="slam" font="grotesk" size={130} y={260} color="#ff5a3a" />
      </Fill>
      <FlashFrame at={60} len={1} tail={4} />
    </CameraShake>
  );
};
