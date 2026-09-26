import React from 'react';
import {Fill} from './core';
import {HistoricalImage, Figure} from './HistoricalImage';
import {TypographyImpact} from './TypographyImpact';
import {Sunburst, StripeField, ColorField} from './PsychBG';
import {CannonSilhouette, Flag} from './art/Military';
import {Crown, BeeField} from './art/Regalia';
import {Eagle} from './art/Eagle';
import {Pyramids, BrandenburgGate, MoscowSkyline, Island} from './art/Skylines';

export type MemoryKind =
  | 'toulon' | 'italy' | 'pyramids' | 'marengo' | 'coronation' | 'austerlitz' | 'jena' | 'friedland' | 'tilsit' | 'wagram' | 'moscow' | 'elba';

const WORD: Record<MemoryKind, [string, string]> = {
  toulon: ['TOULON', '1793'],
  italy: ['ITALY', '1796'],
  pyramids: ['PYRAMIDS', '1798'],
  marengo: ['MARENGO', '1800'],
  coronation: ['EMPEREUR', '1804'],
  austerlitz: ['AUSTERLITZ', '1805'],
  jena: ['JENA', '1806'],
  friedland: ['FRIEDLAND', '1807'],
  tilsit: ['TILSIT', '1807'],
  wagram: ['WAGRAM', '1809'],
  moscow: ['MOSCOW', '1812'],
  elba: ['ELBA', '1814'],
};

/**
 * A full-frame "memory" of an earlier moment, designed to read in 3–6 frames.
 * `damage` 0..1 desaturates / washes it out (used for the 1812 retreat & Waterloo).
 */
export const Memory: React.FC<{kind: MemoryKind; f?: number; damage?: number; word?: boolean}> = ({kind, f = 0, damage = 0, word = true}) => {
  const [w, y] = WORD[kind];
  const wash = damage > 0 ? `grayscale(${damage}) contrast(${1 + damage * 0.6}) brightness(${1 + damage * 0.5})` : undefined;
  let body: React.ReactNode = null;
  switch (kind) {
    case 'toulon':
      body = (
        <>
          <Fill style={{background: '#12060a'}} />
          <Fill style={{background: 'radial-gradient(circle at 60% 55%, #ffcf6b 0%, #c8102e 30%, transparent 60%)'}} />
          <div style={{position: 'absolute', left: -60, top: 980}}>
            <CannonSilhouette size={1100} flash={1} />
          </div>
        </>
      );
      break;
    case 'italy':
      body = (
        <>
          <HistoricalImage id="napoleon_arcole" zoom={1.25 + f * 0.01} place={{x: 0.5, y: 0.35}} filter="sepia(0.3) saturate(1.4)" />
          <Fill style={{background: 'linear-gradient(0deg, rgba(155,42,26,0.6), transparent 50%)'}} />
        </>
      );
      break;
    case 'pyramids':
      body = (
        <>
          <Fill style={{background: 'linear-gradient(180deg,#f7d08a,#c77d2a)'}} />
          <div style={{position: 'absolute', left: 0, top: 900}}>
            <Pyramids width={1080} />
          </div>
          <Figure id="harangue_nap_sil" x={540} y={1150} h={900} />
        </>
      );
      break;
    case 'marengo':
      body = (
        <>
          <HistoricalImage id="napoleon_alps" zoom={1.1} place={{x: 0.45, y: 0.3}} filter="contrast(1.2) saturate(1.3)" />
        </>
      );
      break;
    case 'coronation':
      body = (
        <>
          <Fill style={{background: '#0d1a4a'}} />
          <BeeField opacity={0.35} size={110} />
          <div style={{position: 'absolute', left: 190, top: 560}}>
            <Crown size={700} glow />
          </div>
        </>
      );
      break;
    case 'austerlitz':
      body = (
        <>
          <Sunburst c1="#ffd76a" c2="#e07a1f" rays={28} />
          <HistoricalImage id="napoleon_austerlitz" zoom={1.1} blend="multiply" opacity={0.55} />
        </>
      );
      break;
    case 'jena':
      body = (
        <>
          <Fill style={{background: '#0b2a78'}} />
          <div style={{position: 'absolute', left: 0, top: 760}}>
            <BrandenburgGate color="#f4f1ea" />
          </div>
        </>
      );
      break;
    case 'friedland':
      body = (
        <>
          <StripeField speed={30} />
          <Figure id="consul_rider_sil" x={540} y={1100} h={1200} />
        </>
      );
      break;
    case 'tilsit':
      body = (
        <>
          <ColorField colors={['#e3b955', '#0b2a78', '#1a1a3a']} />
          <div style={{position: 'absolute', left: 290, top: 700}}>
            <Eagle size={500} glow={0.5} />
          </div>
        </>
      );
      break;
    case 'wagram':
      body = (
        <>
          <HistoricalImage id="wagram_vernet" zoom={1.3} place={{x: 0.6, y: 0.5}} filter="contrast(1.3)" />
          <Fill style={{background: 'radial-gradient(circle, rgba(255,240,200,0.6), transparent 60%)', mixBlendMode: 'screen'}} />
        </>
      );
      break;
    case 'moscow':
      body = (
        <>
          <Fill style={{background: 'linear-gradient(0deg, #ff7a1a, #5a0e05 60%, #120302)'}} />
          <div style={{position: 'absolute', left: 0, top: 1000}}>
            <MoscowSkyline />
          </div>
        </>
      );
      break;
    case 'elba':
      body = (
        <>
          <Fill style={{background: 'linear-gradient(180deg, #0e1a22, #2b3d48)'}} />
          <div style={{position: 'absolute', left: 0, top: 1100}}>
            <Island kind="elba" color="#05080a" />
          </div>
        </>
      );
      break;
  }
  return (
    <Fill style={{filter: wash, overflow: 'hidden'}}>
      {body}
      {kind === 'toulon' || kind === 'friedland' ? null : null}
      {word ? (
        <>
          <TypographyImpact text={y} mode="cut" font="didone" size={420} y={620} color="rgba(255,255,255,0.22)" />
          <TypographyImpact text={w} mode="cut" font="grotesk" size={Math.min(260, 1900 / w.length)} y={960} color="#fff" shadow="0 8px 40px rgba(0,0,0,0.7)" />
        </>
      ) : null}
      {kind === 'austerlitz' ? <Flag kind="france" width={300} frame={f} style={{position: 'absolute', left: 80, top: 1300}} /> : null}
    </Fill>
  );
};
