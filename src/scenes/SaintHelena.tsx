import React from 'react';
import {
  useCurrentFrame, Fill, Figure, HistoricalImage, TypographyImpact, NameMotif, Island, LongwoodHouse, Bicorne, Fog, ParticleField,
  POWER, kf, clamp, noise1, DRIFT,
} from './_kit';

/**
 * EPILOGUE — SAINT HELENA 1815–1821 (2:13–2:23).
 * No chaos, no psychedelia, no huge type. Ocean, a tiny island, slow camera.
 * Portrait fades into silhouette; the hat; black.
 */
export const SaintHelena: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = kf(f, [[0, 1], [270, 1.18, DRIFT]]);
  return (
    <Fill style={{background: '#0b1013'}}>
      {/* ACT: ocean + island (0–300) */}
      {f < 270 ? (
        <Fill style={{opacity: kf(f, [[0, 0], [40, 1], [245, 1], [270, 0]])}}>
          <Fill style={{background: 'linear-gradient(180deg, #1a2328 0%, #2b3840 52%, #121a1f 53%, #0b1013 100%)'}} />
          <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '50% 52%'}}>
            <div style={{position: 'absolute', left: 390, top: 928, width: 300}}>
              <Island kind="helena" width={300} color="#070a0c" />
            </div>
            {Array.from({length: 26}, (_, i) => {
              const y = 1020 + i * i * 1.3;
              const w = 60 + i * 26;
              const x = ((i * 197 + f * (0.2 + i * 0.03)) % 1300) - 110;
              return <div key={i} style={{position: 'absolute', left: x, top: y + noise1(f * 0.02 + i, 4) * 2, width: w, height: 1 + i * 0.1, background: 'rgba(199,208,212,0.18)'}} />;
            })}
            <Fog y={960} opacity={0.3} speed={0.25} h={360} seed={5} tint="brightness(0.7)" />
          </div>
          <TypographyImpact text="SAINT HELENA" at={60} mode="track" font="archive" size={40} y={1440} color="#c7d0d4" tracking={0.6} weight={600} />
          <TypographyImpact text="SOUTH ATLANTIC" at={80} mode="rise" font="archive" size={24} y={1500} color="#6f7d84" tracking={0.4} italic />
        </Fill>
      ) : null}

      {/* Longwood (250–380) */}
      {f >= 250 && f < 380 ? (
        <Fill style={{opacity: kf(f, [[250, 0], [270, 1], [355, 1], [380, 0]])}}>
          <Fill style={{background: 'linear-gradient(180deg, #151c20, #0b1013)'}} />
          <div style={{position: 'absolute', left: 90 - (f - 250) * 0.2, top: 900, width: 900}}>
            <LongwoodHouse width={900} />
          </div>
          <ParticleField kind="dust" density={30} speed={0.3} seed={250} opacity={0.35} />
          <TypographyImpact text="LONGWOOD" at={270} mode="track" font="archive" size={30} y={1300} color="#8f9ca2" tracking={0.6} weight={600} />
          <TypographyImpact text="1815 — 1821" at={286} mode="rise" font="archive" size={44} y={1380} color="#c7d0d4" tracking={0.2} />
          <NameMotif from={POWER.helena} at={300} text="NAPOLEON" y={1460} color="#6f7d84" tracking={0.5} />
        </Fill>
      ) : null}

      {/* 5 May 1821: portrait fades to silhouette (360–460) */}
      {f >= 360 && f < 470 ? (
        <Fill style={{opacity: kf(f, [[360, 0], [380, 1], [450, 1], [470, 0]])}}>
          <Fill style={{opacity: 1 - clamp((f - 390) / 45)}}>
            <HistoricalImage id="consul" zoom={2.3 + (f - 360) * 0.002} place={{x: 0.5, y: 0.44}} filter="grayscale(1) brightness(0.55) contrast(1.1)" />
          </Fill>
          <Fill style={{opacity: clamp((f - 390) / 45)}}>
            <Figure id="consul_rider_sil" x={540} y={1000} h={1000} opacity={0.9} />
          </Fill>
          <Fill style={{background: 'radial-gradient(circle at 50% 45%, transparent 30%, #000 80%)'}} />
          <TypographyImpact text="5 MAY 1821" at={384} mode="rise" font="archive" size={40} y={1620} color="#c7d0d4" tracking={0.4} weight={600} />
        </Fill>
      ) : null}

      {/* final image: the hat; name; the line */}
      {f >= 460 ? (
        <Fill style={{background: '#000'}}>
          <div style={{position: 'absolute', left: 540 - 170, top: 700, opacity: kf(f, [[460, 0], [480, 1], [575, 1], [592, 0]])}}>
            <Bicorne size={340} color="#1c1f22" cockade={false} />
          </div>
          <TypographyImpact text="NAPOLEON BONAPARTE" at={484} mode="track" font="imperial" size={50} y={960} color="#d8dde0" tracking={0.15} opacity={kf(f, [[484, 1], [575, 1], [592, 0]])} />
          <TypographyImpact text="1769–1821" at={494} mode="rise" font="archive" size={34} y={1030} color="#8f9ca2" tracking={0.4} opacity={kf(f, [[494, 1], [575, 1], [592, 0]])} />
          <TypographyImpact text="FROM ARTILLERY OFFICER · TO EMPEROR · TO EXILE" at={522} mode="rise" font="archive" size={26} y={1140} color="#8a979d" tracking={0.25} italic opacity={kf(f, [[522, 1], [575, 1], [592, 0]])} />
        </Fill>
      ) : null}
    </Fill>
  );
};
