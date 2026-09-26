#!/usr/bin/env python3
"""
Mix the final soundtrack (music + SFX cues) exactly as src/components/AudioLayer.tsx does,
without re-rendering video:  python3 scripts/mix_soundtrack.py <music.mp3|wav> out/soundtrack.wav
Cue list is exported from src/data/sfx.ts to out/sfx_cues.json (see README).
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS, SR, FRAMES = 60, 48000, 8580
music_path, out = sys.argv[1], sys.argv[2]
cfg = json.load(open(os.path.join(ROOT, 'out', 'sfx_cues.json')))
N = int(FRAMES / FPS * SR)

def read(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()

mix = np.zeros((N, 2), np.float32)
m = read(music_path)[:N]
fr = np.arange(len(m)) / SR * FPS
auto = np.array(cfg['auto'])
m *= (cfg['mv'] * np.interp(fr, auto[:, 0], auto[:, 1]))[:, None]
mix[: len(m)] += m
cache = {}
for c in cfg['cues']:
    p = os.path.join(ROOT, 'public', 'sfx', c['sfx'] + '.wav')
    if not os.path.exists(p):
        continue
    if p not in cache:
        cache[p] = read(p)
    x = cache[p]
    rate = c.get('rate', 1) or 1
    if rate != 1:
        idx = np.arange(0, len(x) - 1, rate)
        x = np.stack([np.interp(idx, np.arange(len(x)), x[:, k]) for k in range(2)], 1)
    dur = int(c.get('dur', 600) / FPS * SR)
    x = x[:dur] * cfg['sv'] * c.get('vol', 1)
    i = int(c['at'] / FPS * SR)
    j = min(N, i + len(x))
    if i < N:
        mix[i:j] += x[: j - i]
pk = np.abs(mix).max()
if pk > 0.98:
    mix *= 0.98 / pk  # never clip
sf.write(out, mix, SR, subtype='PCM_24')
print('wrote', out, round(N / SR, 2), 's, peak', round(float(pk), 3))
