#!/usr/bin/env python3
"""
Slow/pitch a song so its tempo matches the edit's 120 BPM grid, then lay it on as one
continuous piece (no cuts). Tape-style: speed and pitch change together.
  python3 scripts/pitch_song.py <song> <out.wav>
For "Nightcore - Clarity": 144.0 BPM (measured) -> x5/6 speed (-3.16 semitones). Offset puts
the song's biggest drop (orig 135.19 s) on THE RETURN (113.5 s), which also lands its first
drop in Italy and its breakdown at the start of Russia; beats stay on the grid throughout.
"""
import subprocess, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
SR, DUR = 48000, 143.0
SONG_BPM, GRID_BPM = 144.0, 120.0
DROP_ORIG, DROP_VIDEO = 135.187, 113.5
speed = GRID_BPM / SONG_BPM
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-af', f'asetrate=44100*{speed},aresample={SR}',
                      '-f', 'f32le', '-ac', '2', '-'], capture_output=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)
offset = DROP_ORIG / speed - DROP_VIDEO           # slowed-song time at video 0
i0 = int(offset * SR)
out = x[i0:i0 + int(DUR * SR)].copy()
t = np.arange(len(out)) / SR
lp = lambda y, f: sosfilt(butter(2, f / (SR / 2), 'low', output='sos'), y, axis=0)
# prologue: muffled & quiet opening up into the Toulon hit at 8.0 s (filter sweep, no cut)
pro = t < 8.0
if pro.any():
    n = pro.sum()
    seg = out[:n]
    bands = [lp(seg, f) for f in (250, 600, 1500, 4000)]
    u = t[:n] / 8.0
    sweep = np.zeros_like(seg)
    # vectorised crossfade across the 4 filtered copies
    pos = u * 3
    for a in range(3):
        wa = np.clip(1 - np.abs(pos - a), 0, 1)[:, None]
        sweep += bands[a] * wa
    wlast = np.clip(pos - 2, 0, 1)[:, None]
    sweep = sweep * (1 - wlast) + bands[3] * wlast
    gain = (10 ** ((-16 + 12 * u) / 20))[:, None]
    out[:n] = sweep * gain
# coronation silence (10 frames at 41.0 s) — mirrors the picture
a, b = int(41.0 * SR), int((41.0 + 10 / 60) * SR)
out[a:b] = 0
# Saint Helena: the song as a distant memory
h = t >= 133.0
out[h] = lp(out[h], 700) * 0.22
sf.write(sys.argv[2], out, SR, subtype='PCM_24')
print(f'speed x{speed:.4f} ({12*np.log2(speed):+.2f} st), song offset {offset:.2f}s slowed; wrote {sys.argv[2]}')
