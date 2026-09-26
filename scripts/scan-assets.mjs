// Scans public/images (and images/cut) and refreshes src/data/imagemeta.generated.json
// so any real painting you drop in (e.g. public/images/coronation_david.jpg) replaces
// its procedural/fallback placeholder automatically. Runs before `npm run dev/render`.
import fs from 'node:fs';
import path from 'node:path';
import sizeOf from 'image-size';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const metaPath = path.join(root, 'src/data/imagemeta.generated.json');
const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, 'utf8')) : {};
const seen = new Set();
for (const rel of ['images', 'images/cut']) {
  const dir = path.join(root, 'public', rel);
  if (!fs.existsSync(dir)) continue;
  for (const fn of fs.readdirSync(dir)) {
    if (!/\.(jpe?g|png|webp)$/i.test(fn)) continue;
    const key = `${rel}/${fn}`;
    seen.add(key);
    if (meta[key]) continue; // keep bbox computed by prepare_assets.py
    const {width, height} = sizeOf(path.join(dir, fn));
    meta[key] = {w: width, h: height};
    console.log('new asset:', key, width, height);
  }
}
for (const k of Object.keys(meta)) if (!seen.has(k)) delete meta[k];
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 1));
console.log(`imagemeta: ${Object.keys(meta).length} images`);

// audio manifest: which main track / sfx files exist
const audio = {};
for (const rel of ['audio', 'sfx']) {
  const dir = path.join(root, 'public', rel);
  if (!fs.existsSync(dir)) continue;
  for (const fn of fs.readdirSync(dir)) if (/\.(mp3|wav|m4a|aac|ogg)$/i.test(fn)) audio[`${rel}/${fn}`] = true;
}
fs.writeFileSync(path.join(root, 'src/data/audio.generated.json'), JSON.stringify(audio, null, 1));
console.log(`audio: ${Object.keys(audio).length} files`);
