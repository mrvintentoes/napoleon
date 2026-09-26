import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

/**
 * Four typographic voices:
 *   imperial  – Cinzel 900: carved Roman capitals (EMPEREUR, NAPOLEON I)
 *   grotesk   – Anton: condensed impact sans for battle names
 *   cond      – Oswald: condensed labels / UI
 *   archive   – EB Garamond: tiny archival document serif
 *   didone    – Playfair Display 900: huge high-contrast dates
 */
const FILES: [string, string, string, 'normal' | 'italic'][] = [
  ['Cinzel', 'cinzel-latin-400-normal.woff2', '400', 'normal'],
  ['Cinzel', 'cinzel-latin-700-normal.woff2', '700', 'normal'],
  ['Cinzel', 'cinzel-latin-900-normal.woff2', '900', 'normal'],
  ['Anton', 'anton-latin-400-normal.woff2', '400', 'normal'],
  ['Oswald', 'oswald-latin-300-normal.woff2', '300', 'normal'],
  ['Oswald', 'oswald-latin-500-normal.woff2', '500', 'normal'],
  ['Oswald', 'oswald-latin-700-normal.woff2', '700', 'normal'],
  ['EB Garamond', 'eb-garamond-latin-400-normal.woff2', '400', 'normal'],
  ['EB Garamond', 'eb-garamond-latin-400-italic.woff2', '400', 'italic'],
  ['EB Garamond', 'eb-garamond-latin-600-normal.woff2', '600', 'normal'],
  ['EB Garamond', 'eb-garamond-latin-600-italic.woff2', '600', 'italic'],
  ['Playfair Display', 'playfair-display-latin-400-normal.woff2', '400', 'normal'],
  ['Playfair Display', 'playfair-display-latin-400-italic.woff2', '400', 'italic'],
  ['Playfair Display', 'playfair-display-latin-900-normal.woff2', '900', 'normal'],
  ['Playfair Display', 'playfair-display-latin-900-italic.woff2', '900', 'italic'],
];

let loaded = false;
export const ensureFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const [family, file, weight, style] of FILES) {
    loadFont({family, url: staticFile(`fonts/${file}`), weight, style, format: 'woff2'});
  }
};

export const F = {
  imperial: "'Cinzel', 'Times New Roman', serif",
  grotesk: "'Anton', 'Impact', sans-serif",
  cond: "'Oswald', 'Arial Narrow', sans-serif",
  archive: "'EB Garamond', 'Georgia', serif",
  didone: "'Playfair Display', 'Didot', serif",
} as const;
export type FontKey = keyof typeof F;

export const FW: Record<FontKey, number> = {imperial: 900, grotesk: 400, cond: 700, archive: 400, didone: 900};
