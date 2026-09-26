// Render a contact sheet of stills in one bundle: node scripts/stills.mjs <comp> <scale> f1 f2 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [comp = 'NapoleonEdit', scale = '0.35', ...frames] = process.argv.slice(2);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const browser = process.env.REMOTION_BROWSER ?? '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
const composition = await selectComposition({serveUrl, id: comp, browserExecutable: browser});
fs.mkdirSync(path.join(root, 'out/stills'), {recursive: true});
for (const fr of frames) {
  const output = path.join(root, `out/stills/${comp}_${String(fr).padStart(5, '0')}.jpg`);
  await renderStill({serveUrl, composition, frame: Number(fr), output, scale: Number(scale), imageFormat: 'jpeg', jpegQuality: 85, browserExecutable: browser, timeoutInMilliseconds: 120000, chromiumOptions: {gl: 'angle'}});
  console.log('ok', fr);
}
