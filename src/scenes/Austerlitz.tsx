import React from 'react';
import {
  useCurrentFrame, Fill, Seg, Cam, Figure, HistoricalImage, ParallaxPainting, TypographyImpact, Caption, NameMotif, BattleTitle,
  AnimatedMap, AnimatedArrow, MapPing, MapGlow, camAt, Flag, Ship, InfantryRank, Montage, Memory, ChromaticAberration, SliceGlitch,
  FlashFrame, Flashes, CameraShake, Smoke, Fog, ParticleField, Sunburst, StripeField, Tint, ZoomStreaks, EagleFlyThrough, EagleEmblem,
  Laurel, CannonSilhouette, POWER, MARKERS, kf, clamp, prog, pulse, pulses, rnd, noise1, outExpo, inCubic, inExpo, SLAM, CAMERA, DRIFT,
  OVERSHOOT, P, route, F, Shot,
} from './_kit';

const S = MARKERS.AUSTERLITZ;
const DROP = MARKERS.AUSTERLITZ_DROP - S; // 240

/**
 * ACT IV — AUSTERLITZ 1805 (0:47–0:58). HOLY SHIT SHOT 4.
 * Coalition -> Ulm envelopment -> fog, tiny soldiers, the sun rises ->
 * burn to gold, AUSTERLITZ, 12 frames of overload, three emperors / one battle,
 * the eagle flies into camera and its wings become the map, Europe beneath him.
 */
export const Austerlitz: React.FC = () => (
  <Fill style={{background: '#000'}}>
    <Seg from={0} dur={70}>{(l) => <Coalition l={l} />}</Seg>
    <Seg from={70} dur={82}>{(l) => <Ulm l={l} />}</Seg>
    <Seg from={152} dur={DROP - 152}>{(l) => <FogDawn l={l} />}</Seg>
    <Seg from={DROP} dur={160}>{(l) => <Hit l={l} />}</Seg>
    <Seg from={DROP + 160}>{(l) => <EuropeBeneath l={l} />}</Seg>
  </Fill>
);

const Coalition: React.FC<{l: number}> = ({l}) => {
  const hit = pulses(l, [0, 12, 24, 36, 52], 6);
  const flags: {kind: 'austria' | 'russia' | 'britain'; label: string; at: number; from: [number, number]; to: [number, number]}[] = [
    {kind: 'austria', label: 'AUSTRIA', at: 0, from: [-700, 300], to: [60, 360]},
    {kind: 'russia', label: 'RUSSIA', at: 12, from: [1500, 700], to: [560, 760]},
    {kind: 'britain', label: 'BRITAIN', at: 24, from: [-700, 1100], to: [80, 1160]},
  ];
  return (
    <CameraShake amp={hit * 26 + 2} speed={1.2}>
      <Fill style={{background: '#101318'}}>
        {flags.map((fl) => {
          const t = SLAM(clamp((l - fl.at) / 8));
          if (l < fl.at) return null;
          const x = fl.from[0] + (fl.to[0] - fl.from[0]) * t;
          const y = fl.from[1] + (fl.to[1] - fl.from[1]) * t;
          return (
            <div key={fl.kind} style={{position: 'absolute', left: x, top: y}}>
              <Flag kind={fl.kind} width={460} frame={l} />
              <div style={{fontFamily: F.grotesk, fontSize: 70, color: '#e9eef1', marginTop: -10, marginLeft: 20}}>{fl.label}</div>
            </div>
          );
        })}
        {l >= 36 && l < 52 ? (
          <Fill style={{background: '#06101a'}}>
            <HistoricalImage id="trafalgar_turner" zoom={1.1 + (l - 36) * 0.01} place={{x: 0.5, y: 0.5}} filter="contrast(1.1)" />
            <Fill style={{background: 'linear-gradient(180deg, rgba(6,16,26,0.8), transparent 40%)'}} />
            <TypographyImpact text="TRAFALGAR" mode="cut" font="grotesk" size={210} y={560} color="#e9eef1" />
            <TypographyImpact text="21 OCTOBER 1805 · NELSON'S FLEET WINS AT SEA" mode="cut" font="archive" size={30} y={680} color="#9fb6c8" tracking={0.12} weight={600} />
          </Fill>
        ) : null}
        <TypographyImpact text="THIRD COALITION" at={2} out={34} outMode="cut" mode="track" font="cond" size={54} y={1640} color="#9fb6c8" tracking={0.4} />
        {l >= 52 ? (
          <Fill style={{background: '#0b2a78'}}>
            <NameMotif from={POWER.y1804} at={52} text="NAPOLEON" y={960} color="#f3e2a6" tracking={0.01} />
          </Fill>
        ) : null}
      </Fill>
      <Flashes ats={[0, 12, 24, 36, 52]} len={1} tail={3} />
    </CameraShake>
  );
};

const Ulm: React.FC<{l: number}> = ({l}) => {
  const cam = camAt(l, [
    [0, {lon: 7.5, lat: 50.5, zoom: 1.05, tilt: 40, rot: -10}],
    [60, {lon: 9.9, lat: 48.6, zoom: 2.6, tilt: 48, rot: 0}, CAMERA],
    [82, {lon: 9.99, lat: 48.4, zoom: 4.2, tilt: 50, rot: 3}, inCubic],
  ]);
  const ring = clamp((l - 46) / 20);
  return (
    <Fill>
      <AnimatedMap
        cam={cam}
        theme="imperial"
        rivers={['rhine', 'danube']}
        labels={[
          {at: P('boulogne'), text: 'BOULOGNE', appear: 0},
          {at: P('hanover'), text: 'HANOVER', appear: 4},
          {at: P('strasbourg'), text: 'STRASBOURG', appear: 6},
          {at: P('ulm'), text: 'ULM', kind: 'battle', appear: 40, size: 80, color: '#fff'},
          {at: [10.9, 48.9], text: 'Danube', kind: 'sea', appear: 20, size: 30},
        ]}
      >
        <AnimatedArrow route={route('ulmA')} progress={prog(l, 0, 44, outExpo)} color="#3f7bff" width={14} head={50} glow />
        <AnimatedArrow route={route('ulmB')} progress={prog(l, 4, 44, outExpo)} color="#3f7bff" width={14} head={50} glow />
        <AnimatedArrow route={route('ulmC')} progress={prog(l, 8, 40, outExpo)} color="#3f7bff" width={14} head={50} glow />
        {ring > 0 ? <MapGlow at={P('ulm')} r={90 * (2 - ring)} color="#3f7bff" opacity={0.8} /> : null}
        <MapPing at={P('ulm')} t={(l - 46) / 22} color="#fff" r={260} />
      </AnimatedMap>
      <TypographyImpact text="ULM" at={46} mode="slam" font="grotesk" size={300} y={330} color="#fff" />
      <TypographyImpact text="20 OCTOBER 1805" at={48} mode="track" font="archive" size={40} y={480} color="#f3e2a6" tracking={0.3} weight={600} />
      <TypographyImpact text="AN AUSTRIAN ARMY SURRENDERS" at={56} mode="rise" font="cond" size={62} y={1600} color="#fff" />
      <Flashes ats={[46]} len={1} tail={4} />
    </Fill>
  );
};

/** The music breathes: fog, tiny soldiers, dawn, the sun. */
const FogDawn: React.FC<{l: number}> = ({l}) => {
  const sun = clamp((l - 40) / 44);
  const push = kf(l, [[0, 1], [88, 1.25, inCubic]]);
  return (
    <Fill style={{background: `linear-gradient(180deg, ${sun > 0 ? `rgba(${120 + sun * 135},${130 + sun * 80},${150 - sun * 60},1)` : '#7b8794'} 0%, #b8c1c8 55%, #d5dadc 100%)`}}>
      <Cam s={push} origin="50% 60%">
        {/* the sun */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 180,
            top: 900 - sun * 360,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #fff7d6 0%, #ffd76a 40%, rgba(255,160,40,0) 70%)',
            opacity: sun,
            filter: 'blur(4px)',
            transform: `scale(${1 + sun * 0.8})`,
          }}
        />
        <Fog y={1000} opacity={0.9 - sun * 0.3} speed={1.2} h={900} seed={1} />
        {[0, 1, 2].map((r) => (
          <div key={r} style={{position: 'absolute', left: -200 + r * 120 + l * (0.4 + r * 0.2), top: 1180 + r * 90, opacity: 0.55 + r * 0.15, filter: `blur(${(2 - r) * 1.5}px)`}}>
            <InfantryRank count={40} spacing={34} h={70 + r * 30} color="#2c3440" hat="shako" frame={l} seed={r + 20} />
          </div>
        ))}
        <Fog y={1350} opacity={0.85 - sun * 0.4} speed={2} h={700} seed={3} />
      </Cam>
      <TypographyImpact text="2 DECEMBER 1805" at={6} mode="track" font="archive" size={38} y={420} color="#2c3440" tracking={0.35} weight={600} />
      <TypographyImpact text="MORAVIA · DAWN" at={12} mode="track" font="archive" size={30} y={480} color="#4a5566" tracking={0.35} italic />
      <TypographyImpact text="THE SUN OF AUSTERLITZ" at={54} mode="track" font="imperial" size={50} y={1700} color="#fff7d6" tracking={0.2} out={84} outMode="cut" />
      {l >= 86 ? <Fill style={{background: '#000'}} /> : null}
    </Fill>
  );
};

/** The hit: burn to gold; AUSTERLITZ; 12-frame overload; three emperors; eagle to camera. */
const Hit: React.FC<{l: number}> = ({l}) => {
  const hit = pulses(l, [0, 26, 40, 56, 72], 7);
  const overload: Shot[] = (['austerlitz', 'toulon', 'coronation', 'friedland', 'pyramids', 'tilsit'] as const).map((k): Shot => [2, () => <Memory kind={k} word={false} />]);
  return (
    <CameraShake amp={hit * 40 + 3} speed={1.3} zoomKick={0.6}>
      <ChromaticAberration amount={hit * 20}>
        <Fill>
          {/* 0–26: burn into gold, title */}
          {l < 26 ? (
            <Fill style={{background: '#ffcf6b'}}>
              <Sunburst c1="#fff3c0" c2="#f0a33a" rays={32} speed={1.5} />
              <HistoricalImage id="napoleon_austerlitz" zoom={1.25 + l * 0.012} place={{x: 0.5, y: 0.5}} blend="multiply" opacity={0.85} filter="sepia(0.8) saturate(1.8) contrast(1.2)" />
              <TypographyImpact text="1805" noFit mode="cut" font="didone" size={700} y={1050} color="rgba(120,50,0,0.18)" />
              <Fill style={{background: 'radial-gradient(ellipse 80% 22% at 50% 47%, rgba(20,8,0,0.75), transparent 70%)'}} />
              <TypographyImpact text="AUSTERLITZ" at={0} mode="slam" font="grotesk" size={250} y={900} color="#fff4d6" glow="rgba(255,190,80,0.7)" />
              <TypographyImpact text="2 DECEMBER 1805" at={2} mode="track" font="archive" size={40} y={740} color="#fff4d6" tracking={0.3} weight={600} />
            </Fill>
          ) : null}
          {/* 26–38: dense victory overload (2-frame cuts) */}
          {l >= 26 && l < 38 ? <Montage offset={26} shots={overload} /> : null}
          {/* 38–100: THREE EMPERORS / ONE BATTLE; enemy colours break apart; tricolour everywhere */}
          <Seg from={38} dur={66}>{(k) => <ThreeEmperors l={k} />}</Seg>
          {/* 100–160: eagle flies to camera; wings become the map */}
          {l >= 100 ? (
            <Fill style={{background: '#0d1a4a'}}>
              <StripeField speed={18} w={70} angle={90} opacity={0.25} />
              <EagleFlyThrough at={100} dur={44} glow={1} reveal={<AnimatedMap cam={{lon: 13, lat: 49, zoom: 0.9, tilt: 20}} theme="imperial" rivers={['danube', 'rhine']} />} />
            </Fill>
          ) : null}
        </Fill>
      </ChromaticAberration>
      <FlashFrame at={0} len={2} tail={10} color="#fff" />
      <Flashes ats={[40, 56, 72]} len={1} tail={4} />
    </CameraShake>
  );
};

const ThreeEmperors: React.FC<{l: number}> = ({l}) => {
  const brk = clamp((l - 24) / 26);
  return (
    <Fill style={{background: '#0b2a78'}}>
      <StripeField speed={30} w={120} opacity={clamp((l - 30) / 10)} />
      {/* Austrian + Russian flags disintegrate */}
      {(['austria', 'russia'] as const).map((k, i) => (
        <div key={k} style={{position: 'absolute', left: i ? 560 : 60, top: 620, opacity: 1 - brk}}>
          <SliceGlitch amount={brk * 0.8} seed={i + 30}>
            <div style={{position: 'relative', width: 460, height: 360, transform: `translateY(${inCubic(brk) * 400}px) rotate(${brk * (i ? 20 : -20)}deg)`, filter: `blur(${brk * 8}px)`}}>
              <Flag kind={k} width={460} frame={l} />
            </div>
          </SliceGlitch>
        </div>
      ))}
      <ParticleField kind="sparks" density={120} speed={1.2} seed={31} dir={-70} opacity={brk > 0 && brk < 1 ? 1 : 0} color="#f2c01e" size={2} />
      <TypographyImpact text="THREE EMPERORS" at={2} mode="slam" font="grotesk" size={170} y={330} color="#fff" />
      <TypographyImpact text="ONE BATTLE" at={14} mode="slam" font="grotesk" size={220} y={1480} color="#f3e2a6" />
      <Caption text="Napoleon · Francis II of Austria · Alexander I of Russia" at={20} y={1620} color="#e9f2ff" size={30} />
      <div style={{position: 'absolute', left: 540 - 200, top: 1000, opacity: clamp((l - 34) / 6)}}>
        <Laurel size={400} grow={clamp((l - 34) / 20)} />
      </div>
    </Fill>
  );
};

/** Portrait fills frame; Europe physically beneath him; Pressburg; then imperial overload on the beat into 1806. */
const EuropeBeneath: React.FC<{l: number}> = ({l}) => (
  <Fill>
    <Seg from={0} dur={130}>{(k) => <PortraitOverMap l={k} />}</Seg>
    <Seg from={130}>{(k) => <Overload l={k} />}</Seg>
  </Fill>
);

const PortraitOverMap: React.FC<{l: number}> = ({l}) => {
  const cam = camAt(l, [
    [0, {lon: 13, lat: 49, zoom: 0.9, tilt: 20}],
    [130, {lon: 8, lat: 48, zoom: 0.55, tilt: 60, rot: -10}, CAMERA],
  ]);
  const rise = kf(l, [[0, 900], [30, 0, OVERSHOOT]]);
  const hit = pulses(l, [30, 60, 90, 120], 7);
  return (
    <CameraShake amp={hit * 16 + 1.5} speed={0.8} zoomKick={0.3}>
      <Fill style={{background: '#070b1a'}}>
        <AnimatedMap
          cam={cam}
          theme="imperial"
          rivers={['danube', 'rhine', 'elbe']}
          labels={[
            {at: P('austerlitz'), text: 'AUSTERLITZ', kind: 'battle', appear: 0, color: '#ffd76a'},
            {at: P('vienna'), text: 'VIENNA', appear: 10},
            {at: P('paris'), text: 'PARIS', appear: 14},
            {at: [17.1, 48.14], text: 'PRESSBURG', sub: 'peace · 26 Dec 1805', appear: 50, dy: 60},
          ]}
        >
          <AnimatedArrow route={route('austerlitz1805')} progress={1} color="#3f7bff" width={10} head={40} />
          <MapGlow at={P('austerlitz')} r={120} color="#ffd76a" opacity={0.6 + Math.sin(l * 0.3) * 0.2} />
        </AnimatedMap>
        <Fill style={{background: 'linear-gradient(180deg, rgba(7,11,26,0.95) 0%, rgba(7,11,26,0.2) 45%, transparent 60%)'}} />
        <NameMotif from={POWER.y1804} to={POWER.y1805} at={0} dur={120} text="NAPOLEON" y={420} color="rgba(243,226,166,0.3)" hollow tracking={-0.02} />
        <Cam y={rise} s={1 + hit * 0.02}>
          <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1250, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(180deg, black 70%, transparent 100%)', maskImage: 'linear-gradient(180deg, black 70%, transparent 100%)'}}>
            <ParallaxPainting
              base="consul"
              boxW={1080}
              boxH={1250}
              zoom={2.1}
              place={{x: 0.5, y: 0.42}}
              layers={[
                {id: 'consul_plate', depth: 0.2, filter: 'brightness(0.6) saturate(0.8)'},
                {id: 'consul_fg', depth: 1, filter: 'contrast(1.1)'},
              ]}
              cam={{x: kf(l, [[0, 80], [130, -140]]), y: kf(l, [[0, 30], [130, -20]]), z: l * 0.004}}
            />
          </div>
        </Cam>
        <TypographyImpact text="AUSTRIA MAKES PEACE AT PRESSBURG" at={40} mode="track" font="imperial" size={36} y={1780} color="#f3e2a6" tracking={0.12} />
      </Fill>
      <Flashes ats={[30, 60, 90, 120]} len={1} tail={3} max={0.4} />
    </CameraShake>
  );
};

/** 130 frames of imperial overload, cut on the beat (15f), accelerating into Prussia. */
const Overload: React.FC<{l: number}> = ({l}) => {
  const durs = [15, 15, 15, 15, 12, 12, 10, 8, 6, 6, 4, 4, 4, 4];
  const looks: ((k: number) => React.ReactNode)[] = [
    (k) => (
      <Fill style={{background: '#0d1a4a'}}>
        <Sunburst c1="#1d4bb0" c2="#0d1a4a" rays={36} speed={3} />
        <EagleEmblem state="dominant" size={820} y={900} />
      </Fill>
    ),
    (k) => (
      <Fill style={{background: '#e3b955'}}>
        <TypographyImpact text="EMPEREUR" mode="slam" font="imperial" size={170} y={960} color="#0d1a4a" />
      </Fill>
    ),
    (k) => <Memory kind="austerlitz" f={k} />,
    (k) => (
      <Fill style={{background: '#0d1a4a'}}>
        <StripeField speed={40} w={90} opacity={0.5} />
        <Figure id="consul_rider" x={540} y={1050} h={1200} filter="drop-shadow(0 0 40px #000)" />
      </Fill>
    ),
    (k) => (
      <Fill style={{background: '#8a0f1a'}}>
        <TypographyImpact text="1805" mode="slam" font="didone" size={420} y={960} color="#f3e2a6" />
      </Fill>
    ),
    (k) => <Memory kind="coronation" f={k} word={false} />,
    (k) => (
      <Fill style={{background: '#000'}}>
        <NameMotif from={POWER.y1805} at={0} text="NAPOLEON" y={960} color="#f3e2a6" tracking={-0.01} />
      </Fill>
    ),
    (k) => <HistoricalImage id="napoleon_austerlitz" zoom={2.6} place={{x: 0.5, y: 0.4}} filter="saturate(1.4) contrast(1.2)" />,
    (k) => <Memory kind="tilsit" f={k} word={false} />,
    (k) => <HistoricalImage id="harangue_fried" zoom={2} place={{x: 0.5, y: 0.35}} />,
    (k) => <Fill style={{background: '#fff'}} />,
    (k) => <Memory kind="friedland" f={k} word={false} />,
    (k) => <Fill style={{background: '#111'}} />,
    (k) => <Fill style={{background: '#f4f1ea'}} />,
  ];
  const ats = durs.reduce<number[]>((a, d, i) => [...a, i === 0 ? 0 : a[i - 1] + durs[i - 1]], []);
  return (
    <CameraShake amp={pulses(l, ats, 5) * 30 + 4} speed={1.4} zoomKick={0.6}>
      <ChromaticAberration amount={pulses(l, ats, 4) * 14}>
        <Montage hold shots={durs.map((d, i): Shot => [d, looks[i]])} />
      </ChromaticAberration>
    </CameraShake>
  );
};
