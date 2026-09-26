import React from 'react';
import {
  useCurrentFrame, Fill, Seg, Cam, Figure, HistoricalImage, ParallaxPainting, TypographyImpact, Caption, NameMotif, BattleTitle,
  AnimatedMap, AnimatedArrow, MapPing, camAt, Flag, Doc, LegionStar, Montage, ChromaticAberration, SliceGlitch, FlashFrame, Flashes,
  CameraShake, Smoke, ParticleField, Sabre, Tint, ZoomStreaks, whipStyle, POWER, MARKERS, Parchment,
  kf, clamp, prog, pulse, pulses, rnd, noise1, outExpo, inCubic, inExpo, SLAM, CAMERA, WHIP, DRIFT, OVERSHOOT, P, route, F,
} from './_kit';

const S = MARKERS.BRUMAIRE;
const MAR = MARKERS.MARENGO - S; // 150

/**
 * ACT III — POWER 1799–1804 (0:33–0:41).
 * 18 Brumaire as a system being overwritten; First Consul; Marengo;
 * then state machinery (Concordat, Legion of Honour, Civil Code) orbiting him.
 */
export const Brumaire: React.FC = () => (
  <Fill style={{background: '#000'}}>
    <Seg from={0} dur={MAR}>{(l) => <Coup l={l} />}</Seg>
    <Seg from={MAR} dur={110}>{(l) => <Marengo l={l} />}</Seg>
    <Seg from={MAR + 110}>{(l) => <Machinery l={l} />}</Seg>
  </Fill>
);

const DIRECTORS = ['BARRAS', 'SIEYÈS', 'ROGER DUCOS', 'GOHIER', 'MOULIN'];

const Coup: React.FC<{l: number}> = ({l}) => {
  const hit = pulses(l, [8, 60, 104], 7);
  return (
    <CameraShake amp={hit * 20 + 1} speed={0.9}>
      <Fill style={{background: '#efe2c2'}}>
        <Parchment opacity={0.9} />
        {/* the Directory's constitution slides out, stamped */}
        <div style={{position: 'absolute', left: 540, top: 900, transform: `translate(-50%,-50%) translateX(${kf(l, [[40, 0], [70, -1300, inExpo]])}px) rotate(${kf(l, [[0, -4], [70, -18]])}deg)`}}>
          <Doc title="CONSTITUTION DE L'AN III" sub="Directoire exécutif" w={700} h={940} seed={2} seal="RF" stamp={l > 28 ? 'ABROGÉE' : undefined} />
        </div>
        {/* the five Directors slide off screen */}
        {DIRECTORS.map((d, i) => (
          <TypographyImpact
            key={d}
            text={d}
            at={0}
            mode="cut"
            font="cond"
            size={70}
            x={540 + kf(l, [[20 + i * 4, 0], [44 + i * 4, (i % 2 ? 1 : -1) * 1200, inExpo]])}
            y={1450 + i * 72}
            color="#2a1a0a"
            tracking={0.3}
            style={{textDecoration: l > 14 + i * 3 ? 'line-through' : 'none', textDecorationThickness: 6}}
          />
        ))}
        {/* Bouchot: grenadiers break into the Council of Five Hundred */}
        {l >= 42 && l < 66 ? (
          <Fill>
            <HistoricalImage id="brumaire_bouchot" zoom={kf(l, [[42, 1.15], [66, 1.6, outExpo]])} place={{x: 0.5, y: 0.42}} filter="contrast(1.15) saturate(1.1)" />
            <Fill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.6), transparent 35%)'}} />
          </Fill>
        ) : null}
        {/* the new one slams in */}
        {l >= 64 ? (
          <div style={{position: 'absolute', left: 540, top: 900, transform: `translate(-50%,-50%) translateX(${kf(l, [[64, 1300], [76, 0, SLAM]])}px) rotate(${kf(l, [[64, 12], [76, 2, SLAM]])}deg)`}}>
            <Doc title="CONSTITUTION DE L'AN VIII" sub="22 frimaire an VIII · 13 décembre 1799" w={700} h={940} seed={8} seal="N" reveal={clamp((l - 70) / 30)} />
          </div>
        ) : null}
        <TypographyImpact text="18 BRUMAIRE" at={8} out={58} outMode="blur" mode="slam" font="grotesk" size={250} y={300} color="#0b2a78" />
        <TypographyImpact text="PARIS · 9 NOVEMBER 1799" at={10} out={58} mode="track" font="archive" size={40} y={430} color="#c8102e" tracking={0.3} weight={600} />
        <TypographyImpact text="COUP D'ÉTAT" at={30} out={58} outMode="cut" mode="stretch" font="cond" size={80} y={520} color="#2a1a0a" tracking={0.2} />
        {l >= 96 ? <Fill style={{background: 'rgba(11,42,120,0.92)', clipPath: `inset(${kf(l, [[96, 100], [104, 0, SLAM]])}% 0 0 0)`}} /> : null}
        <NameMotif from={POWER.y1797} to={POWER.y1799} at={96} dur={20} y={820} color="#efe2c2" tracking={0.06} />
        <TypographyImpact text="FIRST CONSUL" at={104} mode="slam" font="grotesk" size={210} y={1120} color="#fff" />
        <TypographyImpact text="PREMIER CONSUL" at={112} mode="track" font="imperial" size={46} y={1250} color="#f3e2a6" tracking={0.3} />
      </Fill>
      <Flashes ats={[8, 60, 104]} len={1} tail={4} color="#fff" />
    </CameraShake>
  );
};

/** MARENGO — violent cavalry sequence */
const Marengo: React.FC<{l: number}> = ({l}) => {
  const beats = [0, 15, 30, 45, 60, 75, 90];
  const hit = pulses(l, beats, 6);
  return (
    <CameraShake amp={hit * 40 + 6} speed={1.4} zoomKick={0.5}>
      <ChromaticAberration amount={hit * 18}>
        <Montage
          hold
          shots={[
            [
              22,
              (k) => (
                <Fill>
                  <AnimatedMap
                    cam={camAt(k, [
                      [0, {lon: 6.5, lat: 46.8, zoom: 1.8, tilt: 50, rot: 20}],
                      [22, {lon: 8.4, lat: 45.2, zoom: 3.4, tilt: 55, rot: 0}, inCubic],
                    ])}
                    theme="snow"
                    rivers={['po']}
                    labels={[
                      {at: P('stBernard'), text: 'GREAT ST BERNARD', sub: 'May 1800', appear: 0, kind: 'region', size: 36},
                      {at: P('marengo'), text: 'MARENGO', kind: 'battle', appear: 10},
                    ]}
                  >
                    <AnimatedArrow route={route('marengo1800')} progress={prog(k, 0, 20, outExpo) * 0.5 + 0.5} color="#0b2a78" width={16} head={60} />
                  </AnimatedMap>
                </Fill>
              ),
            ],
            [
              30,
              (k) => (
                <Fill style={{background: '#e7dcc6'}}>
                  <HistoricalImage id="napoleon_alps_david" zoom={1.35 + k * 0.01} place={{x: 0.5, y: 0.35}} filter="contrast(1.25) saturate(1.3)" />
                  <Tint color="#0b2a78" opacity={0.25} blend="multiply" />
                  <BattleTitle name="MARENGO" date="14 June 1800" at={0} y={1480} size={250} color="#fff" accent="#f3e2a6" />
                </Fill>
              ),
            ],
            [
              14,
              (k) => (
                <Fill>
                  <HistoricalImage id="marengo_lejeune" zoom={1.9} place={{x: 0.5 - k * 0.012, y: 0.55}} filter="contrast(1.2) saturate(1.2)" />
                  <TypographyImpact text="14 JUNE 1800" mode="cut" font="archive" size={44} y={300} color="#fff" tracking={0.3} weight={600} shadow="0 0 20px #000" />
                </Fill>
              ),
            ],
            ...[0, 2, 3].map(
              (i) =>
                [
                  14,
                  (k: number) => (
                    <Fill style={{background: i % 2 ? '#c8102e' : '#0b0b0b'}}>
                      <Smoke count={5} seed={50 + i} opacity={0.6} y={1300} speed={20} scale={1.2} tint={i % 2 ? 'brightness(0.3)' : undefined} />
                      {[0, 1, 2].map((r) => (
                        <div key={r} style={{position: 'absolute', left: (i % 2 ? 1400 : -900) + (i % 2 ? -1 : 1) * k * (70 + r * 20) + r * 200, top: 700 + r * 280}}>
                          <Figure id="consul_rider_sil" x={0} y={0} h={600 - r * 120} flipX={i % 2 === 1} filter={i % 2 ? undefined : 'invert(1)'} />
                        </div>
                      ))}
                      <div style={{position: 'absolute', left: 140, top: 400 + i * 60, transform: `rotate(${-20 + i * 12}deg)`}}>
                        <Sabre size={800} glint={k / 14} />
                      </div>
                      <TypographyImpact text={i === 3 ? '1800' : 'MARENGO'} mode="cut" font={i === 3 ? 'didone' : 'grotesk'} size={i === 3 ? 480 : 240} y={i % 2 ? 1500 : 380} color={i % 2 ? '#0b0b0b' : '#fff'} scale={1 + k * 0.02} />
                    </Fill>
                  ),
                ] as [number, (k: number) => React.ReactNode]
            ),
            [
              40,
              (k) => (
                <Fill style={{background: '#0b2a78'}}>
                  <Cam s={kf(k, [[0, 1.3], [10, 1, SLAM]])}>
                    <Figure id="consul_rider" x={540} y={1100} h={1350} filter="drop-shadow(0 30px 40px rgba(0,0,0,0.6))" />
                  </Cam>
                  <TypographyImpact text="VICTORY" mode="slam" font="grotesk" size={260} y={330} color="#f3e2a6" />
                  <Caption text="the Austrians evacuate much of northern Italy" at={8} y={450} color="#e9f2ff" />
                </Fill>
              ),
            ],
          ]}
        />
      </ChromaticAberration>
      <Flashes ats={beats} len={1} tail={3} color="#fff" max={0.8} />
    </CameraShake>
  );
};

/** State machinery orbiting the First Consul. */
const ITEMS = [
  {kind: 'doc', title: 'CONCORDAT', sub: '1801', a0: 0},
  {kind: 'star', title: "LÉGION D'HONNEUR", sub: '1802', a0: 1.25},
  {kind: 'doc', title: 'CODE CIVIL DES FRANÇAIS', sub: '1804', a0: 2.5},
  {kind: 'doc', title: 'BANQUE DE FRANCE', sub: '1800', a0: 3.75},
  {kind: 'doc', title: 'LYCÉES', sub: '1802', a0: 5.0},
];

const Machinery: React.FC<{l: number}> = ({l}) => {
  const spin = kf(l, [[0, 0], [150, 5, inCubic], [220, 16, inExpo]]);
  const suck = clamp((l - 186) / 34);
  const pulseIdx = Math.floor(l / 26);
  return (
    <Fill style={{background: 'radial-gradient(circle at 50% 45%, #1b2e7a 0%, #0a0f24 70%)'}}>
      <Fill style={{backgroundImage: 'repeating-radial-gradient(circle at 50% 45%, rgba(243,226,166,0.08) 0 2px, transparent 2px 90px)', transform: `rotate(${spin * 10}deg)`}} />
      {/* back half of the orbit */}
      {ITEMS.map((it, i) => (
        <OrbitItem key={i} it={it} spin={spin} suck={suck} layer="back" hl={pulseIdx % ITEMS.length === i} />
      ))}
      <Cam s={kf(l, [[0, 0.85], [40, 1, CAMERA], [186, 1.02], [220, 0.2, inExpo]])} filter={suck > 0 ? `blur(${suck * 10}px)` : undefined}>
        <Figure id="napoleon_study_david_fg" x={540} y={1020} h={1250} filter="drop-shadow(0 0 40px rgba(243,226,166,0.35))" />
      </Cam>
      {ITEMS.map((it, i) => (
        <OrbitItem key={`f${i}`} it={it} spin={spin} suck={suck} layer="front" hl={pulseIdx % ITEMS.length === i} />
      ))}
      <NameMotif from={POWER.y1799} at={0} y={260} color="#f3e2a6" tracking={0.08} opacity={1 - suck} />
      <TypographyImpact text="THE STATE" at={6} mode="track" font="imperial" size={54} y={1700} color="#f3e2a6" tracking={0.4} out={180} />
      <ZoomStreaks amount={suck} color="243,226,166" />
      {l >= 216 ? <Fill style={{background: '#000'}} /> : null}
    </Fill>
  );
};

const OrbitItem: React.FC<{it: (typeof ITEMS)[number]; spin: number; suck: number; layer: 'front' | 'back'; hl: boolean}> = ({it, spin, suck, layer, hl}) => {
  const a = it.a0 + spin;
  const z = Math.cos(a); // +1 front, -1 back
  if ((layer === 'front') !== z >= 0) return null;
  const R = 460 * (1 - suck);
  const x = 540 + Math.sin(a) * R;
  const y = 980 + z * 180 * (1 - suck) - 60;
  const s = (0.55 + (z + 1) * 0.22) * (1 - suck * 0.8) * (hl ? 1.12 : 1);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s}) rotateY(${Math.sin(a) * 40}deg)`, opacity: 0.55 + (z + 1) * 0.22, filter: z < 0 ? 'blur(2px) brightness(0.6)' : undefined}}>
      {it.kind === 'star' ? (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <LegionStar size={300} />
          <div style={{fontFamily: F.imperial, fontWeight: 900, fontSize: 40, color: '#f3e2a6', marginTop: 10, whiteSpace: 'nowrap'}}>{it.title}</div>
          <div style={{fontFamily: F.didone, fontSize: 44, color: '#fff'}}>{it.sub}</div>
        </div>
      ) : (
        <Doc title={it.title} sub={it.sub} w={360} h={470} seed={it.a0 * 10} seal="N" lines={10} />
      )}
    </div>
  );
};
