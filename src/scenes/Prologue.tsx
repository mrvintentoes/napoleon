import React from 'react';
import {
  useCurrentFrame, Fill, Seg, Cam, HistoricalImage, TypographyImpact, Caption, NameMotif, AnimatedMap, camAt, EagleEmblem,
  CannonBlueprint, Handwriting, Guillotine, InfantryRank, Montage, SliceGlitch, ChromaticAberration, FlashFrame, Flashes,
  CameraShake, Img, staticFile, ParticleField, Smoke, POWER, kf, clamp, prog, pulse, rnd, noise1, accel,
  outExpo, inCubic, CAMERA, DRIFT, SLAM, b, Shot, ShotFn, Flag,
} from './_kit';

/**
 * PROLOGUE 1769–1793  (0:00–0:06.5)
 * Almost nobody: tiny type, fragments, a blueprint cannon, a commission.
 * Then the Revolution tears France open and everything accelerates toward Toulon.
 */
export const Prologue: React.FC = () => {
  const f = useCurrentFrame();

  // --- revolution montage: accelerating cuts 14 -> 4 frames (230..336)
  const revDurs = accel(12, 14, 5);
  const revFns: ShotFn[] = [
    (l) => <RevWord word="1789" sub="LA BASTILLE" l={l} red />,
    (l) => <CrowdPikes l={l} />,
    (l) => <RevWord word="LIBERTÉ" l={l} />,
    (l) => <FranceCracks l={l} />,
    (l) => <RevWord word="1792" sub="LA RÉPUBLIQUE" l={l} red />,
    (l) => <GuillotineShot l={l} />,
    (l) => <RevWord word="LOUIS XVI" sub="21 JANVIER 1793" l={l} />,
    (l) => <FranceCracks l={l} red />,
    (l) => <CrowdPikes l={l} red />,
    (l) => <RevWord word="1793" l={l} red />,
    (l) => <GuillotineShot l={l} red />,
    (l) => <RevWord word="TERREUR" l={l} />,
  ];
  const revShots: Shot[] = revFns.map((fn, i) => [revDurs[i], fn]);

  return (
    <Fill style={{background: '#030303'}}>
      {/* 0–110: CORSICA. black, the map breathing in the dark, tiny serif. */}
      {f < 112 ? (
        <Fill>
          <Fill style={{opacity: kf(f, [[0, 0], [30, 0.22], [100, 0.3], [111, 0]])}}>
            <AnimatedMap
              cam={camAt(f, [
                [0, {lon: 8.9, lat: 42.1, zoom: 4.2, tilt: 30}],
                [111, {lon: 8.8, lat: 42.2, zoom: 3.2, tilt: 22, rot: -4}, DRIFT],
              ])}
              theme="parchment"
              filter="grayscale(0.6) brightness(0.8)"
              labels={[{at: [8.74, 41.93], text: 'AJACCIO', kind: 'city', appear: 40}]}
            />
          </Fill>
          <Fill style={{background: 'radial-gradient(circle at 50% 50%, transparent 20%, #030303 70%)'}} />
          <EagleEmblem state="faint" size={900} y={900} opacity={kf(f, [[0, 0], [40, 0.6], [110, 0]])} />
          <TypographyImpact text="1769" at={10} mode="flicker" font="archive" size={64} y={900} color="#e9dcc0" tracking={0.3} out={100} outMode="blur" />
          <TypographyImpact text="CORSICA" at={24} mode="track" font="archive" size={30} y={960} color="#d4343c" tracking={0.6} weight={600} out={100} outMode="blur" />
          <Caption text="born at Ajaccio · 15 August 1769" at={52} out={100} y={1020} size={28} color="#8f8577" />
        </Fill>
      ) : null}

      {/* 60–150: portrait fragments sliding as strips + handwriting (crossfades under Corsica) */}
      <Seg from={70} dur={90}>{(l) => <PortraitStrips l={l} />}</Seg>

      {/* 150–212: military school, cannon blueprint drawing itself */}
      {f >= 150 && f < 214 ? (
        <Fill style={{background: '#07121f'}}>
          <Fill style={{backgroundImage: 'linear-gradient(rgba(120,170,220,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,220,0.08) 1px, transparent 1px)', backgroundSize: '54px 54px'}} />
          <Cam s={kf(f - 150, [[0, 1.15], [64, 1.0, CAMERA]])} r={kf(f - 150, [[0, -3], [64, 0]])}>
            <div style={{position: 'absolute', left: 40, top: 700}}>
              <CannonBlueprint size={1000} draw={prog(f, 152, 44, outExpo)} color="#cfe3f5" />
            </div>
          </Cam>
          <TypographyImpact text="ÉCOLE MILITAIRE" at={160} mode="track" font="archive" size={46} y={520} color="#cfe3f5" tracking={0.25} weight={600} />
          <Caption text="Brienne 1779 · Paris 1784" at={168} y={580} color="#8fb0cc" size={30} />
        </Fill>
      ) : null}

      {/* 212–232: 1785 commission. BONAPARTE is introduced: tiny. */}
      {f >= 212 && f < 232 ? (
        <Fill style={{background: '#050505'}}>
          <TypographyImpact text="1785" at={212} mode="cut" font="didone" size={300} y={820} color="#1c1c1c" />
          <TypographyImpact text="SECOND LIEUTENANT OF ARTILLERY" at={212} mode="stretch" font="cond" size={52} y={930} color="#efe6d6" tracking={0.08} />
          <NameMotif from={POWER.y1785} at={216} y={1010} color="#b3121b" tracking={0.5} />
          <div style={{position: 'absolute', left: 540 - 130, top: 990, width: 260, height: 40, border: '1px solid rgba(179,18,27,0.6)', opacity: clamp((f - 218) / 3)}} />
        </Fill>
      ) : null}

      {/* 232–338: REVOLUTION — accelerating montage */}
      {f >= 232 && f < 340 ? (
        <CameraShake amp={kf(f, [[232, 2], [336, 14]])} speed={0.8}>
          <SliceGlitch amount={f > 300 ? 0.25 : 0} seed={3}>
            <Montage offset={232} shots={revShots} hold />
          </SliceGlitch>
        </CameraShake>
      ) : null}

      {/* 338–390: the roll toward Toulon — strobing TOULON, arrows closing in */}
      <Seg from={338}>{(l) => <ToulonBuild l={l} />}</Seg>
      <Flashes ats={[232, 246, 258, 270, 280, 290, 298, 305, 312, 318, 324, 330]} len={1} color="#b3121b" max={0.5} />
    </Fill>
  );
};

const PortraitStrips: React.FC<{l: number}> = ({l}) => {
  const o = kf(l, [[0, 0], [12, 1], [78, 1], [90, 0]]);
  const strips = [
    {y: 0.1, h: 300, dir: 1, zoom: 3.6, fx: 0.47, fy: 0.23, id: 'consul' as const},
    {y: 0.3, h: 250, dir: -1, zoom: 3.0, fx: 0.345, fy: 0.25, id: 'harangue' as const},
    {y: 0.48, h: 360, dir: 1, zoom: 2.4, fx: 0.45, fy: 0.2, id: 'consul' as const},
    {y: 0.7, h: 220, dir: -1, zoom: 3.4, fx: 0.5, fy: 0.38, id: 'consul' as const},
  ];
  return (
    <Fill style={{opacity: o}}>
      {strips.map((s, i) => {
        const dx = (l - 45) * 3.2 * s.dir;
        return (
          <div key={i} style={{position: 'absolute', left: 0, top: s.y * 1920, width: 1080, height: s.h, overflow: 'hidden', borderTop: '1px solid #3a3a3a'}}>
            <div style={{position: 'absolute', left: 0, top: -s.y * 1920, width: 1080, height: 1920}}>
              <HistoricalImage id={s.id} zoom={s.zoom} place={{x: 0.5 + dx / 1080, y: s.y + s.h / 3840}} focus={{x: s.fx, y: s.fy}} filter="grayscale(1) contrast(1.35) brightness(0.8)" clamp={false} />
            </div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 80, top: 1500, opacity: 0.8}}>
        <Handwriting rows={5} seed={7} draw={clamp(l / 70)} color="#b9ab92" width={920} />
      </div>
      <TypographyImpact text="A CORSICAN OF MINOR NOBILITY" at={16} out={80} mode="type" font="archive" size={34} y={1420} color="#d7c9ae" tracking={0.12} weight={600} />
    </Fill>
  );
};

const RevWord: React.FC<{word: string; sub?: string; l: number; red?: boolean}> = ({word, sub, l, red}) => (
  <Fill style={{background: red ? '#b3121b' : '#060606'}}>
    <TypographyImpact text={word} mode="cut" font="grotesk" size={Math.min(360, 1800 / word.length)} y={960} color={red ? '#060606' : '#efe6d6'} scale={1 + l * 0.02} />
    {sub ? <TypographyImpact text={sub} mode="cut" font="archive" size={40} y={1140} color={red ? '#1a0202' : '#b3121b'} tracking={0.3} weight={600} /> : null}
  </Fill>
);

const CrowdPikes: React.FC<{l: number; red?: boolean}> = ({l, red}) => (
  <Fill style={{background: red ? '#2a0406' : '#c9bfae'}}>
    {[0, 1, 2].map((k) => (
      <div key={k} style={{position: 'absolute', left: -200 + k * 60 - l * (4 + k * 3), top: 1000 + k * 170}}>
        <InfantryRank count={30} spacing={50} h={420 + k * 120} color={red ? '#050505' : '#1a1210'} hat="bicorne" frame={l * 3} seed={k + 3} />
      </div>
    ))}
    <Flag kind="france" width={420} frame={l * 4} style={{position: 'absolute', left: 520, top: 380, transform: 'rotate(-8deg)'}} />
  </Fill>
);

const FranceCracks: React.FC<{l: number; red?: boolean}> = ({l, red}) => (
  <Fill>
    <AnimatedMap cam={{lon: 2.4, lat: 46.6, zoom: 1.9 + l * 0.03, rot: red ? 4 : -3}} theme={red ? 'blood' : 'parchment'} graticule={false} rivers={['seine']} />
    <Img src={staticFile(`textures/cracks_${red ? 1 : 0}.png`)} style={{position: 'absolute', inset: 0, width: 1080, height: 1920, filter: red ? 'invert(0)' : 'invert(1)', opacity: 0.9}} />
  </Fill>
);

const GuillotineShot: React.FC<{l: number; red?: boolean}> = ({l, red}) => (
  <Fill style={{background: red ? '#060606' : '#b3121b'}}>
    <div style={{position: 'absolute', left: 540 - 220, top: 300 - l * 6}}>
      <Guillotine width={440} color={red ? '#b3121b' : '#060606'} />
    </div>
  </Fill>
);

const ToulonBuild: React.FC<{l: number}> = ({l}) => {
  // strobe TOULON between black and red, faster and faster; last 2 frames pure black
  const period = l < 20 ? 8 : l < 36 ? 5 : 3;
  const on = Math.floor(l / period) % 2 === 0;
  if (l >= 50) return <Fill style={{background: '#000'}} />;
  return (
    <Fill style={{background: on ? '#000' : '#6d0a10'}}>
      <ChromaticAberration amount={l > 30 ? 10 : 0}>
        <Fill>
          <TypographyImpact text="TOULON" mode="cut" font="grotesk" noFit size={120 + l * 5} y={960} color={on ? '#b3121b' : '#000'} tracking={0.05 + l * 0.004} />
          <Smoke count={4} seed={8} opacity={0.3} y={1400} speed={4} />
        </Fill>
      </ChromaticAberration>
    </Fill>
  );
};
