#!/usr/bin/env python3
"""
Cut a song into sections that land on the edit's big moments (no video re-render).
  python3 scripts/edit_song.py <song> <out.wav>
Segments: (video_start_s, video_end_s, song_start_s, gain). Song entry points are on
the song's own beats/drops (measured with librosa); joins get short crossfades.
Current map is for "Nightcore - Clarity" (≈143.5 BPM; drops at 62.67 / 135.19 / 188.50 s).
"""
import subprocess, sys
import numpy as np, soundfile as sf
SR = 48000
DUR = 143.0
SEGMENTS = [
    (0.0, 8.0, 0.106, 1.0),     # prologue ← song intro (ends on a beat)
    (8.0, 41.0, 62.671, 1.0),   # TOULON drop ← first drop
    (42.0, 51.0, 96.671, 1.0),  # after the coronation mute; fog ← pre-breakdown fade
    (51.0, 80.0, 135.187, 1.0), # AUSTERLITZ drop ← second chorus drop; Russia ← quieter stretch
    (80.0, 106.0, 164.187, 1.0),# Russia → 1814 (song rebuilds; drop lands in the Campaign of France)
    (108.0, 113.5, 103.0, 0.7), # Elba ← the song's breakdown
    (113.5, 131.0, 188.5, 1.0), # THE RETURN ← final big drop, runs through Waterloo
    (133.0, 143.0, 229.5, 1.0), # Saint Helena ← the song's fade-out
]
song = sys.argv[1]
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', song, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)
out = np.zeros((int(DUR * SR), 2), np.float32)
fade = int(0.012 * SR)
for v0, v1, s0, g in SEGMENTS:
    i, n = int(v0 * SR), int((v1 - v0) * SR)
    seg = x[int(s0 * SR): int(s0 * SR) + n].copy() * g
    if len(seg) < n:
        seg = np.pad(seg, ((0, n - len(seg)), (0, 0)))
    ramp = np.linspace(0, 1, fade)[:, None]
    seg[:fade] *= ramp
    seg[-fade:] *= ramp[::-1]
    if v0 == 108.0:  # ease the breakdown in
        seg[: int(0.8 * SR)] *= np.linspace(0, 1, int(0.8 * SR))[:, None]
    out[i:i + n] += seg
sf.write(sys.argv[2], out, SR, subtype='PCM_24')
print('wrote', sys.argv[2], DUR, 's')
