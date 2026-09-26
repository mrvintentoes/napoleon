import React from 'react';
import {Fill, Figure, Island, TypographyImpact, Fog, ParticleField, kf, clamp, noise1, useCurrentFrame, DRIFT} from './_kit';

/**
 * HOLY SHIT SHOT 8 — ELBA (1:48–1:52).
 * From thousands of moving elements to: ocean, a small island, a tiny Napoleon.
 * No typography for the first two seconds.
 */
export const Elba: React.FC = () => {
  const f = useCurrentFrame();
  const drift = kf(f, [[0, 1.0], [240, 1.06, DRIFT]]);
  return (
    <Fill style={{background: 'linear-gradient(180deg, #0c141a 0%, #16242d 55%, #0a1116 100%)', opacity: kf(f, [[0, 0], [30, 1]])}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${drift})`, transformOrigin: '50% 55%'}}>
        {/* horizon glow */}
        <div style={{position: 'absolute', left: 0, top: 900, width: 1080, height: 300, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(138,160,171,0.25), transparent 70%)'}} />
        <div style={{position: 'absolute', left: 240, top: 930, width: 600}}>
          <Island kind="elba" width={600} color="#05090c" />
        </div>
        {/* sea lines */}
        {Array.from({length: 22}, (_, i) => {
          const y = 1110 + i * i * 1.6;
          const w = 80 + i * 30;
          const x = ((i * 173 + f * (0.3 + i * 0.05)) % 1300) - 110;
          return <div key={i} style={{position: 'absolute', left: x, top: y + noise1(f * 0.03 + i, 2) * 3, width: w, height: 1 + i * 0.12, background: 'rgba(138,160,171,0.28)'}} />;
        })}
        <Figure id="harangue_nap_sil" x={560} y={1036} h={46} anchor="bottom" opacity={0.95} />
        <Fog y={1000} opacity={0.35} speed={0.3} h={400} seed={2} tint="brightness(0.6)" />
      </div>
      <ParticleField kind="dust" density={40} speed={0.4} seed={200} opacity={0.4} />
      <TypographyImpact text="ELBA" at={130} mode="track" font="archive" size={40} y={1500} color="#8aa0ab" tracking={0.8} weight={600} />
      <TypographyImpact text="MAY 1814 – FEBRUARY 1815" at={146} mode="rise" font="archive" size={26} y={1570} color="#5c707a" tracking={0.3} italic />
      <Fill style={{background: '#000', opacity: clamp((f - 215) / 25)}} />
    </Fill>
  );
};
