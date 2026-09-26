import React from 'react';
import {
  useCurrentFrame, Fill, Seg, Cam, Figure, HistoricalImage, ParallaxPainting, TypographyImpact, Caption, NameMotif, BattleTitle,
  AnimatedMap, AnimatedArrow, MapPing, MapGlow, camAt, Flag, InfantryRank, BrandenburgGate, Montage, ChromaticAberration, SliceGlitch,
  FlashFrame, Flashes, CameraShake, Smoke, Fog, ParticleField, Sunburst, StripeField, ColorField, Tint, ZoomStreaks, EagleFlyThrough,
  EagleEmblem, Eagle, BeeField, POWER, MARKERS, kf, clamp, prog, pulse, pulses, rnd, noise1, outExpo, inCubic, inExpo, SLAM, CAMERA,
  DRIFT, OVERSHOOT, WHIP, P, route, F, whipStyle,
} from './_kit';
import {STATES_1807_1811} from '../data/campaigns';

const S = MARKERS.MASTER;
const PEAK = MARKERS.PEAK - S; // 480

/**
 * ACT V — MASTER OF EUROPE 1806–1807 (0:58–1:10). Accelerate aggressively.
 * Prussia, Jena–Auerstedt, Berlin; snow; Eylau (brutal); Friedland; Tilsit;
 * HOLY SHIT SHOT 5 — Europe 1807, the visual apex.
 */
export const MasterOfEurope: React.FC = () => (
  <Fill style={{background: '#000'}}>
    <Seg from={0} dur={40}>{(l) => <PrussiaEnters l={l} />}</Seg>
    <Seg from={40} dur={80}>{(l) => <JenaAuerstedt l={l} />}</Seg>
    <Seg from={120} dur={60}>{(l) => <Berlin l={l} />}</Seg>
    <Seg from={180} dur={40}>{(l) => <SnowPoland l={l} />}</Seg>
    <Seg from={220} dur={84}>{(l) => <Eylau l={l} />}</Seg>
    <Seg from={304} dur={60}>{(l) => <Friedland l={l} />}</Seg>
    <Seg from={364} dur={PEAK - 364}>{(l) => <Tilsit l={l} />}</Seg>
    <Seg from={PEAK}>{(l) => <Europe1807 l={l} />}</Seg>
  </Fill>
);

const PrussiaEnters: React.FC<{l: number}> = ({l}) => (
  <CameraShake amp={pulse(l, 0, 6) * 30 + 2}>
    <Fill style={{background: '#f4f1ea'}}>
      <div style={{position: 'absolute', left: kf(l, [[0, -900], [8, 40, SLAM]]), top: 600}}>
        <Flag kind="prussia" width={1000} frame={l * 2} />
      </div>
      <TypographyImpact text="PRUSSIA" mode="slam" font="grotesk" size={300} y={400} color="#111" />
      <TypographyImpact text="1806" at={10} mode="slam" font="didone" size={300} y={1500} color="#111" />
    </Fill>
    <FlashFrame at={0} len={1} tail={4} />
  </CameraShake>
);

const JenaAuerstedt: React.FC<{l: number}> = ({l}) => {
  const hit = pulses(l, [0, 12, 40], 6);
  const split = kf(l, [[0, 0], [10, 1, SLAM]]);
  return (
    <CameraShake amp={hit * 34 + 3} speed={1.2} zoomKick={0.4}>
      <Fill style={{background: '#000'}}>
        {/* split screen: JENA top / AUERSTEDT bottom, same day */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 960 * split + 1, overflow: 'hidden'}}>
          <Fill style={{height: 960}}>
            <HistoricalImage id="jena_vernet" boxW={1080} boxH={960} zoom={1.4 + l * 0.01} place={{x: 0.5, y: 0.45}} filter="contrast(1.3) grayscale(0.3)" />
            <Tint color="#0b2a78" opacity={0.45} blend="multiply" />
            <TypographyImpact text="JENA" at={0} mode="slam" font="grotesk" size={300} y={480} color="#fff" />
          </Fill>
        </div>
        <div style={{position: 'absolute', left: 0, top: 960 + 960 * (1 - split), width: 1080, height: 960, overflow: 'hidden'}}>
          <Fill style={{background: '#101010'}}>
            {[0, 1].map((r) => (
              <div key={r} style={{position: 'absolute', left: 1080 - l * (14 + r * 6) - r * 300, top: 380 + r * 200}}>
                <InfantryRank count={30} spacing={48} h={220 + r * 80} color="#e9e2d0" hat="shako" frame={l * 2} seed={r + 40} />
              </div>
            ))}
            <TypographyImpact text="AUERSTEDT" at={12} mode="slam" font="grotesk" size={210} y={260} color="#f3e2a6" />
          </Fill>
        </div>
        <div style={{position: 'absolute', left: 0, top: 952, width: 1080, height: 16, background: '#f3e2a6', transform: `scaleX(${split})`}} />
        <TypographyImpact text="14 OCTOBER 1806 · SAME DAY" at={20} mode="track" font="archive" size={36} y={1000} color="#0b0b0b" tracking={0.2} weight={600} style={{background: '#f3e2a6', padding: '4px 18px'}} />
        {l >= 40 ? (
          <Fill style={{background: '#111'}}>
            <TypographyImpact text="THE PRUSSIAN ARMY COLLAPSES" at={40} mode="stretch" font="grotesk" size={96} y={960} color="#f4f1ea" />
          </Fill>
        ) : null}
      </Fill>
      <Flashes ats={[0, 12, 40]} len={1} tail={3} />
    </CameraShake>
  );
};

const Berlin: React.FC<{l: number}> = ({l}) => (
  <CameraShake amp={pulse(l, 0, 8) * 30}>
    <Fill style={{background: '#0b2a78'}}>
      <Sunburst c1="#1d4bb0" c2="#0b2a78" rays={36} speed={1} y="62%" />
      <div style={{position: 'absolute', left: 0, top: 860, transform: `scale(${kf(l, [[0, 1.6], [12, 1, SLAM], [60, 1.06]])})`, transformOrigin: '50% 100%'}}>
        <BrandenburgGate color="#050a1c" />
      </div>
      <div style={{position: 'absolute', left: 0, top: 1330, width: 1080, height: 600, background: '#050a1c'}} />
      <div style={{position: 'absolute', left: -1100 + l * 40, top: 1260}}>
        <InfantryRank count={40} spacing={44} h={120} color="#050a1c" hat="bicorne" frame={l * 2} seed={60} />
      </div>
      <TypographyImpact text="BERLIN" mode="slam" font="grotesk" size={300} y={380} color="#f3e2a6" />
      <TypographyImpact text="27 OCTOBER 1806" at={4} mode="track" font="archive" size={40} y={530} color="#fff" tracking={0.3} weight={600} />
      <TypographyImpact text="THE FRENCH ENTER BERLIN" at={14} mode="rise" font="cond" size={56} y={1540} color="#f3e2a6" tracking={0.1} />
    </Fill>
    <FlashFrame at={0} len={1} tail={4} />
  </CameraShake>
);

const SnowPoland: React.FC<{l: number}> = ({l}) => (
  <Fill style={{background: `linear-gradient(180deg, #9aa7b3, #e9eef1)`}}>
    <ParticleField kind="snow" density={260} speed={2.2} wind={4} seed={7} size={1.3} />
    <TypographyImpact text="POLAND" mode="track" font="imperial" size={130} y={900} color="#1d242b" tracking={0.2} />
    <TypographyImpact text="WINTER 1806–1807" at={8} mode="track" font="archive" size={36} y={1020} color="#39424c" tracking={0.3} weight={600} />
    <Fill style={{background: '#fff', opacity: kf(l, [[0, 1], [10, 0]])}} />
  </Fill>
);

/** Eylau — visually brutal, less triumphant. */
const Eylau: React.FC<{l: number}> = ({l}) => {
  const reds = [8, 22, 36, 50, 64];
  const red = pulses(l, reds, 3);
  return (
    <CameraShake amp={red * 30 + 5} speed={1.4}>
      <Fill style={{background: '#c9d0d5'}}>
        <HistoricalImage id="eylau_gros" zoom={1.3 + l * 0.004} place={{x: 0.5, y: 0.45}} filter="grayscale(0.9) contrast(1.3) brightness(1.1)" opacity={0.75} />
        <ParticleField kind="snow" density={320} speed={3.5} wind={14} seed={8} size={1.4} />
        {/* Murat's cavalry charge */}
        {[0, 1, 2, 3].map((r) => (
          <div key={r} style={{position: 'absolute', left: 1300 - l * (22 + r * 5) - r * 240, top: 900 + r * 170}}>
            <Figure id="consul_rider_sil" x={0} y={0} h={420 + r * 90} flipX />
          </div>
        ))}
        <Fill style={{background: '#8b0000', opacity: red * 0.75, mixBlendMode: 'multiply'}} />
        <TypographyImpact text="EYLAU" mode="slam" font="grotesk" size={320} y={380} color="#39424c" stroke={red > 0.3 ? '#b30000' : undefined} strokeW={5} />
        <TypographyImpact text="7–8 FEBRUARY 1807" at={4} mode="track" font="archive" size={40} y={540} color="#1d242b" tracking={0.3} weight={600} />
        <TypographyImpact text="MURAT" at={24} out={70} mode="slam" font="grotesk" size={180} y={1550} color="#fff" shadow="0 0 30px #000" />
        <Caption text="leads a massed cavalry charge through the snowstorm" at={30} out={70} y={1660} color="#fff" size={30} />
        <TypographyImpact text="A BLOODY STALEMATE" at={70} mode="cut" font="cond" size={80} y={1560} color="#b30000" tracking={0.08} />
      </Fill>
      <Flashes ats={reds} len={1} color="#b30000" max={0.6} />
    </CameraShake>
  );
};

const Friedland: React.FC<{l: number}> = ({l}) => {
  const collapse = clamp((l - 18) / 26);
  return (
    <CameraShake amp={pulse(l, 0, 8) * 40 + pulse(l, 18, 8) * 30 + 3} speed={1.3} zoomKick={0.5}>
      <ChromaticAberration amount={pulse(l, 0, 6) * 20}>
        <Fill style={{background: '#0b2a78'}}>
          <StripeField speed={40} w={100} opacity={0.3} />
          {[0, 1, 2].map((r) => (
            <div key={r} style={{position: 'absolute', left: 60 - r * 40, top: 1000 + r * 180, transform: `translateY(${inCubic(collapse) * (600 + r * 200)}px) rotate(${collapse * (r % 2 ? 14 : -10)}deg)`, opacity: 1 - collapse}}>
              <InfantryRank count={22} spacing={48} h={260 + r * 40} color="#1c3a24" hat="shako" frame={l} seed={r + 70} />
            </div>
          ))}
          <SliceGlitch amount={collapse > 0 && collapse < 1 ? 0.5 : 0} seed={71}>
            <Fill>
              <BattleTitle name="FRIEDLAND" date="14 June 1807" at={0} y={420} size={250} color="#fff" accent="#f3e2a6" />
            </Fill>
          </SliceGlitch>
          <TypographyImpact text="THE RUSSIAN ARMY IS DEFEATED" at={20} mode="rise" font="cond" size={60} y={660} color="#f3e2a6" />
        </Fill>
      </ChromaticAberration>
      <FlashFrame at={0} len={2} tail={6} />
    </CameraShake>
  );
};

/** Tilsit — a brief surreal imperial composition: a raft pavilion floating on the Niemen. */
const Tilsit: React.FC<{l: number}> = ({l}) => {
  const bob = Math.sin(l * 0.08) * 8;
  return (
    <Fill style={{background: 'linear-gradient(180deg, #0d1a4a 0%, #26386e 48%, #b4a26a 50%, #0d1a4a 100%)'}}>
      <ColorField colors={['rgba(227,185,85,0.5)', 'rgba(11,42,120,0.4)', 'rgba(13,26,74,0)']} speed={2} opacity={0.8} blend="screen" />
      {/* river */}
      <div style={{position: 'absolute', left: 0, top: 960, width: 1080, height: 960, background: 'linear-gradient(180deg, #1c2e5e, #0a1330)'}} />
      {Array.from({length: 14}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: ((i * 130 + l * 2) % 1300) - 110, top: 1000 + i * 60, width: 200, height: 3, background: 'rgba(227,185,85,0.35)'}} />
      ))}
      {/* pavilion + mirrored reflection */}
      {[1, -1].map((m) => (
        <div key={m} style={{position: 'absolute', left: 540, top: 960, transform: `translate(-50%, ${m > 0 ? -100 : 0}%) scaleY(${m}) translateY(${bob}px)`, opacity: m > 0 ? 1 : 0.35, filter: m > 0 ? undefined : 'blur(3px)'}}>
          <svg viewBox="0 0 600 420" width={600} height={420}>
            <rect x={40} y={380} width={520} height={40} fill="#3a2a16" />
            <rect x={120} y={200} width={360} height={180} fill="#f4f1ea" />
            <path d="M100,210 L300,70 L500,210 Z" fill="#f4f1ea" stroke="#c9a53c" strokeWidth={6} />
            <text x={300} y={170} textAnchor="middle" fontFamily={F.imperial} fontWeight={900} fontSize={60} fill="#c9a53c">N</text>
            <text x={200} y={310} textAnchor="middle" fontFamily={F.imperial} fontWeight={900} fontSize={60} fill="#0b2a78">N</text>
            <text x={400} y={310} textAnchor="middle" fontFamily={F.imperial} fontWeight={900} fontSize={60} fill="#1d4fa0">A</text>
            <rect x={296} y={20} width={8} height={60} fill="#3a2a16" />
          </svg>
        </div>
      ))}
      <TypographyImpact text="TILSIT" at={2} mode="slam" font="imperial" size={220} y={300} color="#f3e2a6" />
      <TypographyImpact text="A RAFT ON THE NIEMEN · 25 JUNE 1807" at={8} mode="track" font="archive" size={34} y={430} color="#e9f2ff" tracking={0.2} weight={600} />
      <TypographyImpact text="NAPOLEON" at={20} mode="rise" font="cond" size={64} x={300} y={1520} color="#f3e2a6" tracking={0.2} />
      <TypographyImpact text="ALEXANDER I" at={26} mode="rise" font="cond" size={64} x={780} y={1520} color="#9fc0ff" tracking={0.2} />
      <TypographyImpact text="1807" at={70} mode="slam" font="didone" size={620} y={1000} color="rgba(243,226,166,0.9)" />
      <FlashFrame at={70} len={1} tail={4} />
    </Fill>
  );
};

/** HOLY SHIT SHOT 5 — Europe 1807. The visual apex. */
const Europe1807: React.FC<{l: number}> = ({l}) => {
  const cam = camAt(l, [
    [0, {lon: 12, lat: 49, zoom: 2.4, tilt: 30, rot: 10}],
    [60, {lon: 10, lat: 48, zoom: 0.72, tilt: 52, rot: -3}, CAMERA],
    [200, {lon: 11, lat: 49, zoom: 0.5, tilt: 60, rot: 2}, DRIFT],
    [240, {lon: 11, lat: 49, zoom: 0.46, tilt: 62, rot: 3}],
  ]);
  const beats = [0, 30, 60, 90, 120, 150, 180, 210];
  const hit = pulses(l, beats, 6);
  const states = STATES_1807_1811.filter((s) => s.label !== 'KINGDOM OF SPAIN');
  const riseNap = kf(l, [[20, 1400], [70, 0, OVERSHOOT]]);
  const whip = clamp((l - 222) / 18);
  return (
    <Fill style={whipStyle(whip, -1, 1800)}>
      <CameraShake amp={hit * 18 + 2} speed={1} zoomKick={0.3}>
        <AnimatedMap
          cam={cam}
          theme="imperial"
          rivers={['rhine', 'danube', 'elbe', 'vistula', 'niemen']}
          labels={[
            ...states.map((s, i) => ({at: s.at, text: s.label, sub: s.sub, kind: 'region' as const, appear: 40 + i * 8, color: '#f3e2a6', size: 34})),
            {at: [2.4, 45.6], text: 'FRENCH EMPIRE', kind: 'big', appear: 30, color: '#fff', size: 90},
            {at: P('london'), text: 'BRITAIN', kind: 'region', appear: 110, color: '#ff8a8a', size: 30},
            {at: [38, 56], text: 'RUSSIA', kind: 'region', appear: 116, color: '#9fc0ff', size: 40},
            {at: [16.5, 47.8], text: 'AUSTRIA', kind: 'region', appear: 104, color: '#c8c8c8', size: 30},
            {at: [19.5, 55.2], text: 'PRUSSIA', sub: 'reduced', kind: 'region', appear: 100, color: '#c8c8c8', size: 28},
          ]}
        >
          <MapGlow at={[2.4, 46.8]} r={520} color="#3f7bff" opacity={clamp((l - 24) / 20) * 0.85} />
          {states.filter((s) => s.r > 0).map((s, i) => (
            <MapGlow key={s.label} at={s.at} r={s.r} color="#e3b955" opacity={clamp((l - 40 - i * 8) / 12) * 0.55} />
          ))}
          <AnimatedArrow route={route('prussia1806')} progress={1} color="#3f7bff" width={8} head={30} opacity={0.8} />
          <AnimatedArrow route={route('poland1807')} progress={1} color="#3f7bff" width={8} head={30} opacity={0.8} />
          <AnimatedArrow route={route('austerlitz1805')} progress={1} color="#3f7bff" width={8} head={30} opacity={0.8} />
        </AnimatedMap>
      </CameraShake>
      <Fill style={{background: 'linear-gradient(180deg, rgba(7,11,26,0.85) 0%, transparent 30%, transparent 70%, rgba(7,11,26,0.9) 100%)'}} />
      {/* gigantic name behind */}
      <NameMotif from={POWER.y1805} to={POWER.y1807} at={60} dur={60} text="NAPOLEON" y={300} color="rgba(243,226,166,0.35)" hollow tracking={-0.02} />
      {/* Napoleon stands over the map */}
      <Cam y={riseNap} s={1 + hit * 0.02} origin="50% 100%">
        <Figure id="consul_rider" x={540} y={1440} h={1050} filter="drop-shadow(0 0 60px rgba(63,123,255,0.6)) drop-shadow(0 30px 30px rgba(0,0,0,0.8))" />
      </Cam>
      <EagleFlyThrough at={150} dur={36} glow={1} y={700} />
      <TypographyImpact text="1807" at={0} mode="slam" font="didone" size={260} y={200} color="#fff" out={60} outMode="blur" />
      <TypographyImpact text="VIVE L'EMPEREUR" at={120} mode="track" font="imperial" size={58} y={1800} color="#f3e2a6" tracking={0.25} />
      <Caption text="French Empire, allied and satellite states — schematic" at={70} y={1860} size={22} color="#9fb6c8" />
      <ZoomStreaks amount={kf(l, [[0, 0.7], [40, 0]])} color="243,226,166" />
      <Flashes ats={beats} len={1} tail={3} color="#fff" max={0.5} />
    </Fill>
  );
};
