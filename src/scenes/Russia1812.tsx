import React from 'react';
import {
  useCurrentFrame, Fill, Seg, Cam, Figure, HistoricalImage, ParallaxPainting, TypographyImpact, Caption, NameMotif, BattleTitle,
  AnimatedMap, AnimatedArrow, MapPing, MapGlow, camAt, InfantryRank, MoscowSkyline, Montage, Memory, ChromaticAberration, SliceGlitch,
  FlashFrame, Flashes, CameraShake, Smoke, Fog, ParticleField, Tint, Img, staticFile, EagleEmblem, CannonSilhouette, Scanlines,
  POWER, MARKERS, kf, clamp, prog, pulse, pulses, rnd, noise1, outExpo, inCubic, inExpo, SLAM, CAMERA, DRIFT, OVERSHOOT, P, route, F,
} from './_kit';

const S = MARKERS.RUSSIA_BREAK;
const BORO = MARKERS.BORODINO - S; // 300
const MOS = MARKERS.MOSCOW - S; // 510
const RET = MARKERS.RETREAT - S; // 660

/**
 * ACT VII — 1812 (1:20–1:36). THE TURNING POINT.
 * The tone breaks. RUSSIA consumes the screen. West->east. Borodino = overload.
 * MOSCOW = total stillness (HOLY SHIT SHOT 6). RETREAT reverses the visual
 * language: east->west, damaged memories (SHOT 7), the eagle cracks, the name
 * SHRINKS for the first time, snow until white.
 * No troop numbers are shown: estimates vary widely between sources.
 */
export const Russia1812: React.FC = () => (
  <Fill style={{background: '#000'}}>
    <Seg from={0} dur={100}>{(l) => <Break l={l} />}</Seg>
    <Seg from={100} dur={130}>{(l) => <Advance l={l} />}</Seg>
    <Seg from={230} dur={BORO - 230}>{(l) => <Smolensk l={l} />}</Seg>
    <Seg from={BORO} dur={MOS - BORO}>{(l) => <Borodino l={l} />}</Seg>
    <Seg from={MOS} dur={RET - MOS}>{(l) => <Moscow l={l} />}</Seg>
    <Seg from={RET}>{(l) => <Retreat l={l} />}</Seg>
  </Fill>
);

const Break: React.FC<{l: number}> = ({l}) => {
  const hit = pulses(l, [0, 34], 10);
  return (
    <CameraShake amp={hit * 30 + 2} speed={0.6}>
      <Fill style={{background: '#1d242b'}}>
        {l < 34 ? (
          <Fill>
            <TypographyImpact text="1812" mode="slam" font="didone" size={560} y={960} color="#e9eef1" chroma={hit * 12} />
            <ParticleField kind="snow" density={20} speed={0.6} seed={100} opacity={0.6} />
          </Fill>
        ) : (
          <Fill style={{background: '#e9eef1'}}>
            <AnimatedMap cam={{lon: 38, lat: 56, zoom: 0.5 + (l - 34) * 0.004, tilt: 30}} theme="snow" rivers={['niemen', 'dnieper', 'moskva']} opacity={0.5} />
            {/* RUSSIA almost consumes the screen */}
            <TypographyImpact text="RUSSIA" at={34} mode="slam" font="grotesk" size={560} y={960} color="#1d242b" scaleX={0.95} rot={-90} tracking={-0.02} />
            <ParticleField kind="snow" density={40} speed={1} wind={3} seed={101} color="#9aa7b3" />
          </Fill>
        )}
      </Fill>
      <FlashFrame at={0} len={2} tail={8} color="#e9eef1" />
      <FlashFrame at={34} len={1} tail={4} color="#fff" />
    </CameraShake>
  );
};

const Advance: React.FC<{l: number}> = ({l}) => {
  const cam = camAt(l, [
    [0, {lon: 20, lat: 54, zoom: 1.2, tilt: 50, rot: 0}],
    [130, {lon: 29, lat: 55, zoom: 0.95, tilt: 56, rot: -3}, DRIFT],
  ]);
  return (
    <Fill>
      <Montage
        hold
        shots={[
          [
            56,
            (k) => (
              <Fill style={{background: 'linear-gradient(180deg, #8f9ba6, #d9dfe3)'}}>
                {Array.from({length: 6}, (_, r) => (
                  <div key={r} style={{position: 'absolute', left: -1400 + k * (14 + r * 3) + (r % 2) * 90, top: 700 + r * 170, opacity: 0.5 + r * 0.1}}>
                    <InfantryRank count={60} spacing={40 + r * 6} h={90 + r * 50} color="#1d242b" hat="shako" frame={k * 2} seed={r + 110} />
                  </div>
                ))}
                <TypographyImpact text="GRANDE ARMÉE" mode="stretch" font="grotesk" size={200} y={420} color="#1d242b" />
                <Caption text="an army drawn from across the empire and its allies" at={6} y={540} color="#2c3a48" size={30} />
              </Fill>
            ),
          ],
          [
            74,
            (k) => (
              <Fill>
                <AnimatedMap
                  cam={camAt(k, [
                    [0, {lon: 26, lat: 55, zoom: 0.95, tilt: 40}],
                    [74, {lon: 31, lat: 55.3, zoom: 0.75, tilt: 46, rot: -3}, DRIFT],
                  ])}
                  theme="snow"
                  rivers={['niemen', 'dnieper', 'berezina', 'moskva', 'vistula']}
                  labels={[
                    {at: P('kovno'), text: 'NIEMEN', sub: 'crossed 24 June 1812', kind: 'region', appear: 4, size: 52},
                    {at: P('vilna'), text: 'VILNA', appear: 20},
                    {at: P('vitebsk'), text: 'VITEBSK', appear: 34},
                    {at: P('smolensk'), text: 'SMOLENSK', appear: 48},
                    {at: P('moscow'), text: 'MOSCOW', appear: 60, color: '#7a1a0e', kind: 'battle', size: 60},
                  ]}
                >
                  <AnimatedArrow route={route('russia1812')} progress={prog(k, 0, 70, inCubic)} color="#1f3f9a" width={30} head={90} glow />
                </AnimatedMap>
                <TypographyImpact text="WEST → EAST" mode="track" font="cond" size={52} y={300} color="#1d242b" tracking={0.5} />
              </Fill>
            ),
          ],
        ]}
      />
    </Fill>
  );
};

const Smolensk: React.FC<{l: number}> = ({l}) => (
  <CameraShake amp={pulse(l, 0, 8) * 30 + 4} speed={1.2}>
    <Fill style={{background: '#1a0703'}}>
      <Fill style={{background: 'radial-gradient(circle at 50% 75%, rgba(255,110,30,0.8), transparent 60%)'}} />
      <div style={{position: 'absolute', left: 0, top: 1050, opacity: 0.95}}>
        <MoscowSkyline color="#050202" />
      </div>
      <ParticleField kind="embers" density={100} speed={2} seed={120} />
      <Smoke count={6} seed={121} opacity={0.5} tint="brightness(0.25)" y={1100} speed={3} />
      <BattleTitle name="SMOLENSK" date="16–18 August 1812" at={0} y={420} size={240} color="#ffd9c8" accent="#ff8a4a" />
      <TypographyImpact text="THE RUSSIANS FALL BACK · THE CITY BURNS" at={16} mode="type" font="archive" size={32} y={600} color="#ffd9c8" tracking={0.05} weight={600} />
    </Fill>
    <FlashFrame at={0} len={1} tail={5} />
  </CameraShake>
);

/** Borodino — sensory overload; Napoleon barely visible through smoke. */
const Borodino: React.FC<{l: number}> = ({l}) => {
  const beats = Array.from({length: 14}, (_, i) => i * 15);
  const hit = pulses(l, beats, 5);
  const cutIdx = Math.floor(l / 5) % 6;
  const strobe = Math.floor(l / 3) % 2 === 0;
  return (
    <CameraShake amp={hit * 46 + 10} speed={1.6} zoomKick={0.6}>
      <ChromaticAberration amount={hit * 22 + 4}>
        <Fill style={{background: '#26221e'}}>
          {/* paintings rapidly intercut */}
          {cutIdx === 0 ? <HistoricalImage id="borodino" zoom={1.3} place={{x: 0.4, y: 0.5}} filter="contrast(1.5)" /> : null}
          {cutIdx === 1 ? <HistoricalImage id="pyramids_battle_fried" zoom={1.8} place={{x: 0.3, y: 0.7}} filter="grayscale(1) contrast(1.8) brightness(0.8)" /> : null}
          {cutIdx === 2 ? <HistoricalImage id="harangue_halftone" zoom={1.5} place={{x: 0.5, y: 0.5}} filter="invert(1) contrast(1.4)" /> : null}
          {cutIdx === 3 ? <HistoricalImage id="consul_fried" zoom={2.2} place={{x: 0.6, y: 0.6}} filter="grayscale(0.8) contrast(1.6)" /> : null}
          {cutIdx === 4 ? <HistoricalImage id="borodino" zoom={2} place={{x: 0.7, y: 0.4}} filter="contrast(1.7) sepia(0.5)" /> : null}
          {cutIdx === 5 ? <Fill style={{background: '#0b0908'}} /> : null}
          <Smoke count={12} seed={130} opacity={0.85} y={1000} spread={1600} scale={1.6} speed={6} tint="brightness(0.6)" />
          {/* cannon flashes */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{position: 'absolute', left: -200 + i * 420, top: 1350 + (i % 2) * 120, opacity: 0.95}}>
              <CannonSilhouette size={520} color="#070605" flash={pulse(l, beats[(i * 3) % 14] + (i % 3), 4) + pulse(l, beats[(i * 3 + 7) % 14], 4)} />
            </div>
          ))}
          {/* Napoleon barely visible */}
          <Figure id="consul_rider_sil" x={540} y={1000} h={900} opacity={0.35 + noise1(l * 0.2, 4) * 0.1} />
          <Smoke count={6} seed={131} opacity={0.7} y={1100} spread={1200} scale={1.2} speed={8} tint="brightness(0.8)" />
          <Fill style={{background: strobe && hit > 0.5 ? 'rgba(255,220,150,0.35)' : 'transparent'}} />
          <TypographyImpact text="BORODINO" at={0} mode="slam" font="grotesk" size={300} y={420} color="#fff" chroma={8} shadow="0 0 40px #000" />
          <TypographyImpact text="7 SEPTEMBER 1812" at={3} mode="track" font="archive" size={40} y={580} color="#ffd9a0" tracking={0.3} weight={600} />
          <TypographyImpact text="THE BLOODIEST DAY OF THE CAMPAIGN" at={60} mode="stretch" font="cond" size={60} y={1640} color="#fff" out={150} outMode="cut" />
          <TypographyImpact text="THE ROAD TO MOSCOW LIES OPEN" at={156} mode="stretch" font="cond" size={60} y={1640} color="#ffd9a0" />
        </Fill>
      </ChromaticAberration>
      <Flashes ats={beats} len={1} tail={2} color="#fff" max={0.7} />
      <FlashFrame at={208} len={2} color="#000" />
    </CameraShake>
  );
};

/** HOLY SHIT SHOT 6 — Moscow: total stillness. Napoleon tiny against the flames. Hold. */
const Moscow: React.FC<{l: number}> = ({l}) => {
  const fire = clamp((l - 20) / 70);
  const push = kf(l, [[0, 1], [150, 1.08]]);
  return (
    <Fill style={{background: `linear-gradient(180deg, ${fire > 0 ? '#2a0602' : '#0e1216'} 0%, #120302 100%)`}}>
      <Cam s={push} origin="50% 70%">
        <Fill style={{background: `radial-gradient(ellipse 90% 45% at 50% 72%, rgba(255,140,40,${fire * 0.95}) 0%, rgba(190,40,10,${fire * 0.7}) 35%, transparent 75%)`}} />
        <div style={{position: 'absolute', left: 0, top: 820}}>
          <MoscowSkyline color="#070202" />
        </div>
        <div style={{position: 'absolute', left: 0, top: 1420, width: 1080, height: 500, background: '#070202'}} />
        <ParticleField kind="embers" density={Math.floor(40 + fire * 120)} speed={0.9} seed={140} size={1.2} />
        <Smoke count={5} seed={141} opacity={0.45 * fire} y={700} spread={600} speed={0.8} rise={0.6} tint="brightness(0.2) sepia(1)" />
        {/* tiny Napoleon, still */}
        <Figure id="harangue_nap_sil" x={540} y={1500} h={190} anchor="bottom" />
      </Cam>
      {/* Albrecht Adam: Napoleon before the burning city — the only slow push in the whole act */}
      {l >= 56 ? (
        <Fill style={{opacity: clamp((l - 56) / 24)}}>
          <HistoricalImage id="moscow_fire" zoom={kf(l, [[56, 1.0], [150, 1.18]])} place={{x: 0.5, y: 0.5}} filter="contrast(1.1) saturate(1.15)" />
          <ParticleField kind="embers" density={60} speed={0.7} seed={142} size={1.1} />
          <Fill style={{background: 'linear-gradient(180deg, rgba(18,3,2,0.7) 0%, transparent 30%, transparent 75%, rgba(18,3,2,0.85) 100%)'}} />
        </Fill>
      ) : null}
      <TypographyImpact text="MOSCOW" at={10} mode="track" font="imperial" size={96} y={360} color="#ffd9c8" tracking={0.35} />
      <TypographyImpact text="14 SEPTEMBER 1812" at={20} mode="track" font="archive" size={34} y={450} color="#ff9a6a" tracking={0.3} weight={600} />
      <Caption text="the city is almost empty — then it burns" at={50} y={1640} color="#ffd9c8" size={32} />
      <FlashFrame at={148} len={2} color="#000" />
    </Fill>
  );
};

/** RETREAT — the visual language reverses. */
const Retreat: React.FC<{l: number}> = ({l}) => {
  const cam = camAt(l, [
    [10, {lon: 37.6, lat: 55.7, zoom: 1.4, tilt: 50, rot: 3}],
    [240, {lon: 24, lat: 54.8, zoom: 1.0, tilt: 56, rot: -2}, DRIFT],
  ]);
  const snow = kf(l, [[0, 20], [150, 300], [240, 700], [300, 900]]);
  const white = kf(l, [[190, 0], [290, 0.95, inCubic]]);
  const memories = [
    {kind: 'austerlitz' as const, at: 70},
    {kind: 'friedland' as const, at: 92},
    {kind: 'jena' as const, at: 114},
  ];
  return (
    <Fill style={{background: '#000'}}>
      {/* the word */}
      {l < 12 ? (
        <Fill style={{background: '#000'}}>
          <TypographyImpact text="RETREAT" mode="cut" font="grotesk" size={250} y={960} color="#e9eef1" />
        </Fill>
      ) : (
        <Fill>
          <AnimatedMap
            cam={cam}
            theme="snow"
            rivers={['niemen', 'dnieper', 'berezina', 'moskva']}
            filter={`grayscale(0.4) brightness(${1 + white * 0.3})`}
            labels={[
              {at: P('moscow'), text: 'MOSCOW', sub: 'left 19 October', appear: 12, color: '#7a1a0e'},
              {at: P('smolensk'), text: 'SMOLENSK', appear: 60},
              {at: P('berezina'), text: 'BEREZINA', sub: '26–29 November 1812', kind: 'battle', appear: 140, color: '#1d242b', size: 54},
              {at: P('vilna'), text: 'VILNA', appear: 180},
            ]}
          >
            <AnimatedArrow route={route('retreat1812')} progress={prog(l, 12, 220, inCubic)} color="#5c6670" width={kf(l, [[12, 22], [220, 6]])} head={kf(l, [[12, 70], [220, 26]])} dashed />
          </AnimatedMap>
          {/* the Grande Armée shrinks: fewer, smaller figures walking WEST */}
          {Array.from({length: 4}, (_, r) => {
            const count = Math.max(1, Math.round(kf(l, [[12, 30 - r * 4], [220, 3 - (r > 1 ? 2 : 0)]])));
            return (
              <div key={r} style={{position: 'absolute', left: 1180 - (l - 12) * (2 + r * 0.6) - r * 60, top: 1250 + r * 120, opacity: kf(l, [[12, 0.8], [240, 0.1]])}}>
                <InfantryRank count={count} spacing={60} h={kf(l, [[12, 150 + r * 40], [220, 60 + r * 10]])} color="#1d242b" hat="shako" frame={Math.floor(l / 3)} seed={r + 150} flip />
              </div>
            );
          })}
          <EagleEmblem state="cracked" size={520} y={620} at={40} opacity={kf(l, [[40, 0], [50, 0.85], [200, 0.4]])} />
          {/* the name SHRINKS for the first time */}
          <NameMotif from={POWER.y1812a} to={POWER.y1812b} at={20} dur={180} text="NAPOLEON" y={1100} color="rgba(29,36,43,0.55)" tracking={0.02} />
        </Fill>
      )}
      {/* Hess: the Berezina crossing, drained of colour, buried in snow */}
      <Seg from={138} dur={44}>
        {(k) => (
          <Fill>
            <HistoricalImage id="berezina_hess" zoom={1.3 + k * 0.004} place={{x: 0.5 - k * 0.002, y: 0.55}} filter="grayscale(0.75) contrast(1.15) brightness(1.1)" />
            <ParticleField kind="snow" density={320} speed={3} wind={16} seed={139} size={1.5} />
            <TypographyImpact text="BEREZINA" at={4} mode="slam" font="grotesk" size={220} y={360} color="#1d242b" />
            <TypographyImpact text="26–29 NOVEMBER 1812" at={8} mode="track" font="archive" size={36} y={500} color="#1d242b" tracking={0.3} weight={600} />
          </Fill>
        )}
      </Seg>
      {/* damaged memories */}
      {memories.map((m) => (
        <Seg key={m.kind} from={m.at} dur={10}>
          {(k) => (
            <SliceGlitch amount={0.3 + k * 0.05} seed={m.at}>
              <Fill style={{opacity: k < 7 ? 1 : 0.5}}>
                <Memory kind={m.kind} damage={0.7 + k * 0.03} f={k} />
                <ParticleField kind="snow" density={200} speed={4} wind={10} seed={m.at} />
              </Fill>
            </SliceGlitch>
          )}
        </Seg>
      ))}
      <ParticleField kind="snow" density={Math.floor(snow)} speed={kf(l, [[0, 1], [300, 3.5]])} wind={kf(l, [[0, 2], [300, 22]])} seed={160} size={kf(l, [[0, 1], [300, 2.2]])} />
      <Fill style={{background: '#f4f7f9', opacity: white}} />
      <TypographyImpact text="RETREAT" at={12} out={60} mode="cut" font="grotesk" size={120} y={300} color="#1d242b" tracking={0.3} />
    </Fill>
  );
};
