#!/usr/bin/env python3
"""
Synthesizes a PLACEHOLDER score locked to the edit's grid (120 BPM, markers in
src/data/beats.ts) plus a bank of sound-design one-shots.

  public/audio/main-track.wav  (converted to .mp3 by `npm run audio`)
  public/sfx/*.wav

The score follows the intensity curve: build -> Toulon drop -> Italy groove ->
Egypt -> Nile dip -> coronation silence/organ -> Austerlitz breath/drop -> 1807 peak
-> Russia low-pass collapse -> Moscow stillness -> wind -> Leipzig -> 1814 stop ->
Elba ocean -> Hundred Days hit -> Waterloo max -> CUT -> St Helena.
Replace with a real track any time; re-time markers in beats.ts.
"""
import os
import numpy as np
from scipy.signal import butter, lfilter, fftconvolve
from scipy.io import wavfile

SR = 44100
BPM = 120
BEAT = 60 / BPM
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_A = os.path.join(ROOT, 'public', 'audio')
OUT_S = os.path.join(ROOT, 'public', 'sfx')
os.makedirs(OUT_A, exist_ok=True)
os.makedirs(OUT_S, exist_ok=True)
rng = np.random.default_rng(1805)

# markers in beats (mirror of src/data/beats.ts)
M = dict(TOULON=13, DROP_1=16, ITALY=24, EGYPT=48, NILE=59, BRUMAIRE=66, MARENGO=71, CORONATION=82, CROWN_DROP=84,
         AUSTERLITZ=94, AUSTERLITZ_DROP=102, MASTER=116, PEAK=132, SPAIN=140, WAGRAM=152, RUSSIA_BREAK=160,
         BORODINO=170, MOSCOW=177, RETREAT=182, LEIPZIG_START=192, LEIPZIG=196, FRANCE_1814=204, PARIS_FALLS=212,
         ELBA_SILENCE=216, HUNDRED_DAYS=224, HUNDRED_DAYS_DROP=227, PARIS_1815=234, WATERLOO=242, WATERLOO_DROP=248,
         WATERLOO_CLIMAX=256, FINAL_CUT=262, SAINT_HELENA=266, END=286)
T = lambda beats: beats * BEAT
DUR = T(M['END']) + 1.0
N = int(DUR * SR)


def bp(x, lo, hi, order=2):
    b, a = butter(order, [lo / (SR / 2), min(hi / (SR / 2), 0.99)], btype='band')
    return lfilter(b, a, x)


def lp(x, f, order=2):
    b, a = butter(order, min(f / (SR / 2), 0.99), btype='low')
    return lfilter(b, a, x)


def hp(x, f, order=2):
    b, a = butter(order, f / (SR / 2), btype='high')
    return lfilter(b, a, x)


def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
    return e


def saw(freq, n, detune=0.0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for dt in (-detune, 0, detune):
        ph = (t * freq * (1 + dt)) % 1
        out += 2 * ph - 1
    return out / 3


# ---------------------------------------------------------------- instruments
def kick(g=1.0):
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    f = 45 + 120 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t * 7) + 0.3 * rng.normal(0, 1, n) * np.exp(-t * 120)
    return np.tanh(x * 1.6) * g


def snare(g=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    x = bp(rng.normal(0, 1, n), 900, 7000) * np.exp(-t * 16) + 0.5 * np.sin(2 * np.pi * 185 * t) * np.exp(-t * 22)
    return x * g


def hat(g=0.3, open_=False):
    n = int((0.25 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    return hp(rng.normal(0, 1, n), 7000) * np.exp(-t * (12 if open_ else 70)) * g


def tom(freq=120, g=0.7):
    n = int(0.4 * SR)
    t = np.arange(n) / SR
    f = freq * (1 + 0.6 * np.exp(-t * 30))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * g


def boom(g=1.0, length=3.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(38 + 40 * np.exp(-t * 6)) / SR) * np.exp(-t * 1.4)
    x += lp(rng.normal(0, 1, n), 300) * np.exp(-t * 2.5) * 1.5
    x += bp(rng.normal(0, 1, n), 1000, 6000) * np.exp(-t * 30) * 0.6
    return np.tanh(x * 1.3) * g


def stab(freqs, length=0.35, g=0.35, bright=3000):
    n = int(length * SR)
    x = sum(saw(f, n, 0.006) for f in freqs) / len(freqs)
    t = np.arange(n) / SR
    bright_part = lp(x, bright) * np.exp(-t * 10)
    dark = lp(x, 700)
    return (bright_part + dark * 0.6) * env(n, 0.004, length * 0.6) * g


def pad(freqs, length, g=0.2, cutoff=1500, attack=0.4):
    n = int(length * SR)
    x = sum(saw(f, n, 0.01) for f in freqs) / len(freqs)
    t = np.arange(n) / SR
    e = np.minimum(1, t / attack) * np.minimum(1, (length - t) / 0.3)
    return lp(x, cutoff) * e * g


def bass(freq, length, g=0.4):
    n = int(length * SR)
    x = lp(saw(freq, n, 0.003), 400) + 0.5 * np.sin(2 * np.pi * freq * np.arange(n) / SR)
    return x * env(n, 0.005, length * 0.9) * g


def bell(freq, length=3, g=0.25):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * freq * r * t) * np.exp(-t * (1.2 + r)) * a for r, a in [(1, 1), (2.76, 0.5), (5.4, 0.25), (8.9, 0.12)])
    return x * g


def piano(freq, length=2.5, g=0.25):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * freq * k * t) * np.exp(-t * (1.5 + k * 0.8)) / k for k in range(1, 6))
    return x * np.minimum(1, t / 0.004) * g


def organ(freqs, length, g=0.25):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * k * t) / k for f in freqs for k in (1, 2, 3, 4, 6, 8))
    e = np.minimum(1, t / 0.15) * np.minimum(1, (length - t) / 1.0)
    return x / len(freqs) * e * g


def riser(length, g=0.35):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = rng.normal(0, 1, n)
    out = np.zeros(n)
    seg = n // 16
    for i in range(16):
        s = slice(i * seg, (i + 1) * seg if i < 15 else n)
        out[s] = bp(x[s], 400 + i * 500, 1200 + i * 900)
    sweep = np.sin(2 * np.pi * np.cumsum(100 + 900 * (t / length) ** 2) / SR) * 0.3
    return (out + sweep) * (t / length) ** 2 * g


def noise_bed(length, lo, hi, g, mod=0.0):
    n = int(length * SR)
    t = np.arange(n) / SR
    x = bp(rng.normal(0, 1, n), lo, hi)
    m = 1 + mod * np.sin(2 * np.pi * 0.13 * t) * np.sin(2 * np.pi * 0.07 * t + 1)
    return x * m * g


# ---------------------------------------------------------------- mixing helpers
music = np.zeros(N)
drums = np.zeros(N)
fx = np.zeros(N)


def put(buf, x, at_s, g=1.0):
    i = int(at_s * SR)
    if i >= N:
        return
    j = min(N, i + len(x))
    buf[i:j] += x[: j - i] * g


NOTE = lambda n: 440 * 2 ** ((n - 69) / 12)
# D minor world: i-VI-III-VII  (Dm Bb F C)   triumphant: D  A  Bm G
PROG_MINOR = [[50, 53, 57], [46, 50, 53], [41, 45, 48], [48, 52, 55]]
PROG_MAJOR = [[50, 54, 57], [45, 49, 52], [47, 50, 54], [43, 47, 50]]
PROG_DARK = [[50, 53, 57], [49, 52, 56], [46, 50, 53], [45, 49, 52]]


def groove(b0, b1, prog, energy=1.0, hats=True, half=False, stabs=True, arp=False, snare_roll_last_bar=False, toms=False):
    """4/4 groove from beat b0 to b1."""
    for b in range(int(b0), int(b1)):
        t = T(b)
        bar = (b - int(b0)) // 4
        chord = prog[bar % len(prog)]
        pos = b % 4
        if half:
            if pos == 0:
                put(drums, kick(), t, energy)
            if pos == 2:
                put(drums, snare(), t, 0.9 * energy)
        else:
            put(drums, kick(), t, energy)
            if pos in (1, 3):
                put(drums, snare(), t, 0.8 * energy)
        if hats:
            for k in range(4 if energy > 0.8 else 2):
                put(drums, hat(0.18 if k % 2 else 0.28), t + k * BEAT / (4 if energy > 0.8 else 2), energy)
        if toms and pos == 3:
            put(drums, tom(140), t + BEAT * 0.5, 0.5 * energy)
            put(drums, tom(100), t + BEAT * 0.75, 0.5 * energy)
        if pos == 0:
            put(music, bass(NOTE(chord[0] - 12), BEAT * 1.9), t, 0.9 * energy)
            put(music, bass(NOTE(chord[0] - 12), BEAT * 1.9), t + 2 * BEAT, 0.8 * energy)
            put(music, pad([NOTE(n) for n in chord], BEAT * 4, 0.12 * energy, 2200), t)
        if stabs and pos in (0, 2) or (stabs and energy > 0.9 and pos == 3):
            put(music, stab([NOTE(n + 12) for n in chord]), t + (BEAT * 0.5 if pos == 3 else 0), 0.8 * energy)
        if arp:
            for k in range(4):
                n_ = chord[k % 3] + 24 + (12 if k == 3 else 0)
                put(music, piano(NOTE(n_), 0.3, 0.12), t + k * BEAT / 4, energy)
    if snare_roll_last_bar:
        s = T(b1 - 4)
        for k in range(16):
            put(drums, snare(0.25 + k * 0.04), s + k * BEAT / 4)


def roll(b0, b1, g0=0.1, g1=0.9, div=4):
    n = int((b1 - b0) * div)
    for k in range(n):
        u = k / max(1, n - 1)
        put(drums, snare(g0 + (g1 - g0) * u), T(b0) + k * BEAT / div)


# ---------------------------------------------------------------- arrangement
# PROLOGUE: drone + ticks + heartbeat, accelerating
put(music, pad([NOTE(38), NOTE(45)], T(13), 0.14, 500, attack=3), 0)
for b in range(0, 13):
    put(drums, hat(0.12), T(b))
    if b >= 6:
        put(drums, kick(0.45), T(b))
roll(9, 13, 0.05, 0.6, div=4)
put(fx, riser(T(3)), T(10), 0.8)
# TOULON build + DROP_1
roll(13, 16, 0.2, 1.0, div=8)
put(fx, riser(T(3), 0.5), T(13))
put(fx, boom(1.2), T(M['DROP_1']))
groove(16, 24, PROG_MINOR, 0.75, half=True, stabs=True)
# ITALY — full groove
groove(24, 48, PROG_MINOR, 1.0, stabs=True, arp=True, toms=True)
for b in (24, 32, 40):
    put(fx, boom(0.5, 1.5), T(b))
# EGYPT
groove(48, 59, PROG_DARK, 0.95, stabs=True, toms=True)
for b in range(48, 59):
    for k, n_ in enumerate([62, 63, 66, 67]):
        put(music, piano(NOTE(n_ + 12), 0.25, 0.1), T(b) + k * BEAT / 4)
# NILE — corrupted: filtered + stutter
seg = drums[int(T(59) * SR):int(T(66) * SR)]
for b in range(59, 66):
    put(drums, kick(0.9), T(b))
    if b % 2:
        put(drums, snare(0.7), T(b) + BEAT * 0.5)
put(fx, boom(1.0), T(59))
put(music, pad([NOTE(38), NOTE(44)], T(6.5), 0.2, 700), T(59))
# BRUMAIRE — tense ostinato
for b in range(66, 82):
    for k in range(4):
        put(music, stab([NOTE(50), NOTE(62)], 0.1, 0.25, 1800), T(b) + k * BEAT / 4)
    put(drums, kick(0.8), T(b))
    if b % 2:
        put(drums, snare(0.6), T(b))
groove(71, 76, PROG_MINOR, 1.0, stabs=True, toms=True)  # Marengo burst
put(fx, boom(0.8), T(71))
put(fx, riser(T(4), 0.5), T(78))
# CORONATION: 10 frames silence then crown, organ + bells at drop
for k in range(4):
    put(music, bell(NOTE(74 + [0, 3, 7, 12][k]), 3, 0.12), T(82) + 0.25 + k * 0.4)
put(fx, boom(1.3), T(M['CROWN_DROP']))
put(music, organ([NOTE(50), NOTE(54), NOTE(57), NOTE(62)], T(6)), T(84), 1.2)
for b in range(84, 94, 2):
    put(music, bell(NOTE(62), 4, 0.25), T(b))
groove(88, 94, PROG_MAJOR, 0.8, stabs=True)
# AUSTERLITZ: coalition hits, Ulm, then breathe
groove(94, 98, PROG_DARK, 0.9, stabs=True)
put(music, pad([NOTE(50), NOTE(57), NOTE(62)], T(4), 0.18, 900, attack=1.2), T(98))
for b in range(98, 102):
    put(drums, kick(0.35), T(b))
put(fx, riser(T(4), 0.6), T(98))
put(fx, boom(1.4), T(M['AUSTERLITZ_DROP']))
groove(102, 116, PROG_MAJOR, 1.0, stabs=True, arp=True, toms=True)
put(music, organ([NOTE(50), NOTE(57), NOTE(62), NOTE(66)], T(4)), T(102), 0.7)
# MASTER OF EUROPE -> PEAK
groove(116, 132, PROG_MINOR, 1.0, stabs=True, arp=True, toms=True, snare_roll_last_bar=True)
groove(132, 140, PROG_MAJOR, 1.1, stabs=True, arp=True, toms=True)
put(fx, boom(1.3), T(M['PEAK']))
# SPAIN / WAGRAM — darker, heavier
groove(140, 152, PROG_DARK, 0.95, stabs=True, toms=True)
put(fx, boom(1.3), T(M['WAGRAM']))
groove(152, 160, PROG_DARK, 1.0, stabs=True, toms=True)
# RUSSIA — low-passed, half-time march, Borodino overload, Moscow stillness, wind
put(fx, boom(1.5, 4), T(M['RUSSIA_BREAK']))
groove(162, 170, PROG_DARK, 0.8, half=True, hats=False, stabs=False)
groove(170, 177, PROG_DARK, 1.1, stabs=True, toms=True)
for b in range(170, 177):
    for k in range(3):
        put(fx, boom(0.35, 1.2), T(b) + k * 0.17)
put(music, pad([NOTE(38), NOTE(45), NOTE(50)], T(5), 0.16, 400, attack=1.0), T(177))
put(fx, boom(0.9, 4), T(M['RETREAT']))
for k, n_ in enumerate([62, 60, 57, 53, 50]):
    put(music, piano(NOTE(n_), 4, 0.2), T(182) + k * 1.6)
# LEIPZIG
groove(192, 196, PROG_DARK, 0.85, stabs=True)
roll(194, 196, 0.2, 0.9, div=8)
put(fx, boom(1.4), T(M['LEIPZIG']))
groove(196, 204, PROG_DARK, 1.05, stabs=True, toms=True)
# FRANCE 1814 — hyperfast, then stop
groove(204, 212, PROG_MINOR, 1.0, stabs=True, arp=True)
roll(208, 212, 0.2, 0.8, div=8)
put(fx, boom(1.0, 4), T(M['PARIS_FALLS']))
put(music, pad([NOTE(38), NOTE(41)], T(4), 0.12, 400, attack=0.5), T(212))
# ELBA silence; HUNDRED DAYS single hit then build
put(fx, boom(1.4), T(M['HUNDRED_DAYS_DROP']))
put(fx, riser(T(6), 0.5), T(228))
groove(229, 234, PROG_MINOR, 0.9, stabs=True)
roll(232, 234, 0.3, 1.0, div=8)
put(fx, boom(1.4), T(M['PARIS_1815']))
groove(234, 242, PROG_MAJOR, 1.1, stabs=True, arp=True, toms=True)
# WATERLOO
for b in range(242, 248):
    put(drums, kick(0.6), T(b))
    put(music, stab([NOTE(38), NOTE(50)], 0.2, 0.3, 900), T(b) + BEAT / 2)
put(fx, riser(T(3), 0.6), T(245))
put(fx, boom(1.4), T(M['WATERLOO_DROP']))
groove(248, 256, PROG_DARK, 1.05, stabs=True, toms=True)
put(fx, boom(1.3), T(M['WATERLOO_CLIMAX']))
groove(256, 262, PROG_MAJOR, 1.2, stabs=True, arp=True, toms=True)
roll(260, 262, 0.3, 1.2, div=8)
# FINAL CUT — hard silence of everything musical after this point
cut_i = int(T(M['FINAL_CUT']) * SR)
# ST HELENA — sparse piano
for k, n_ in enumerate([62, 57, 60, 53, 55, 50]):
    put(music, piano(NOTE(n_), 5, 0.18), T(266) + 1.5 + k * 1.4)
put(music, pad([NOTE(38), NOTE(45)], T(18), 0.07, 400, attack=3), T(268))

# ---------------------------------------------------------------- bus processing
def automate(x, pts):
    ts = np.array([p[0] for p in pts]) * SR
    vs = np.array([p[1] for p in pts])
    return x * np.interp(np.arange(len(x)), ts, vs)


ir_n = int(2.2 * SR)
ir = rng.normal(0, 1, ir_n) * np.exp(-np.arange(ir_n) / SR * 3)
ir /= np.sqrt(np.sum(ir ** 2))
wet = fftconvolve(music, ir)[:N] * 0.35
music = music + wet

# Russia: low-pass the music + drums bus and bit-crush a little
ra, rb = int(T(160) * SR), int(T(192) * SR)
music[ra:rb] = lp(music[ra:rb], 700)
drums[ra:ra + int(T(10) * SR)] = lp(drums[ra:ra + int(T(10) * SR)], 900)
# Nile: filter dip
na, nb = int(T(59) * SR), int(T(66) * SR)
music[na:nb] = lp(music[na:nb], 600)
drums[na:nb] = np.round(drums[na:nb] * 12) / 12  # crush

mix = music * 0.8 + drums * 0.9 + fx * 0.9
# silences
for a, bb in [(T(82), T(82) + 10 / 60), (T(102) - 2 / 60, T(102)), (T(212) + 1.2, T(227)), (T(262), T(266) + 1.4)]:
    i, j = int(a * SR), int(bb * SR)
    fade = int(0.01 * SR)
    mix[i:i + fade] *= np.linspace(1, 0, fade)[: max(0, min(fade, j - i))] if j - i > 0 else 1
    mix[i + fade:j] = 0
mix = np.tanh(mix * 0.9)
mix = mix / np.max(np.abs(mix)) * 0.89
# fade out end
fe = int(2.5 * SR)
mix[-fe:] *= np.linspace(1, 0, fe)
st = np.stack([mix, np.roll(mix, 9)], 1)
wavfile.write(os.path.join(OUT_A, 'main-track.wav'), SR, (st * 32767).astype(np.int16))
print('main track', round(DUR, 2), 's')

# ---------------------------------------------------------------- SFX bank
def save(name, x, g=0.9):
    x = np.asarray(x, dtype=np.float64)
    x = x / (np.max(np.abs(x)) + 1e-9) * g
    wavfile.write(os.path.join(OUT_S, name + '.wav'), SR, (x * 32767).astype(np.int16))


save('cannon', boom(1.0, 3.5))
save('boom_low', lp(boom(1.0, 5), 180))
save('distant_cannon', lp(boom(1.0, 4), 250) * 0.6, 0.5)
n = int(0.5 * SR)
t = np.arange(n) / SR
save('impact', np.tanh(kick(1.5)[:n] * 2 + bp(rng.normal(0, 1, n), 200, 3000) * np.exp(-t * 18)))
n = int(0.7 * SR)
t = np.arange(n) / SR
w = rng.normal(0, 1, n)
sweep = np.zeros(n)
for i in range(14):
    s = slice(i * n // 14, (i + 1) * n // 14)
    c = 300 + 5000 * np.sin(np.pi * i / 13)
    sweep[s] = bp(w[s], c * 0.6, c * 1.4)
save('whoosh', sweep * np.sin(np.pi * t / t[-1]) ** 2)
save('riser', riser(2.0))
n = int(0.4 * SR)
t = np.arange(n) / SR
save('saber', hp(rng.normal(0, 1, n), 3000) * np.exp(-t * 12) + np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 6) * 0.4)
n = int(0.5 * SR)
t = np.arange(n) / SR
save('paper', bp(rng.normal(0, 1, n), 1500, 8000) * (np.abs(np.sin(2 * np.pi * 9 * t)) ** 3) * np.exp(-t * 4), 0.6)
save('wind', lp(noise_bed(12, 150, 1400, 1.0, mod=0.8), 1200), 0.6)
ocean = noise_bed(12, 80, 900, 1.0)
tt = np.arange(len(ocean)) / SR
save('ocean', ocean * (0.5 + 0.5 * np.sin(2 * np.pi * tt / 5.5) ** 2), 0.55)
n = int(10 * SR)
crack = np.zeros(n)
for _ in range(500):
    i = rng.integers(0, n - 2000)
    crack[i:i + 400] += rng.normal(0, 1, 400) * np.exp(-np.arange(400) / 60) * rng.uniform(0.2, 1)
save('fire', crack + lp(rng.normal(0, 1, n), 400) * 0.6, 0.55)
n = int(4 * SR)
g = np.zeros(n)
for k in range(16):
    for d in (0, 0.09, 0.16):
        g[int((k * 0.25 + d) * SR):] += 0
        i = int((k * 0.25 + d) * SR)
        g[i:i + int(0.06 * SR)] += lp(rng.normal(0, 1, int(0.06 * SR)), 500) * np.exp(-np.arange(int(0.06 * SR)) / 600)
save('gallop', g, 0.7)
n = int(4 * SR)
m = np.zeros(n)
for k in range(8):
    put_i = int(k * 0.5 * SR)
    m[put_i:put_i + int(0.35 * SR)] += snare(0.8)[: int(0.35 * SR)]
save('marching', m, 0.6)
save('crowd', noise_bed(6, 300, 2500, 1.0, mod=1.0), 0.5)
n = int(0.3 * SR)
save('glitch', np.sign(np.sin(2 * np.pi * 180 * np.arange(n) / SR)) * rng.normal(0, 1, n) * (rng.random(n) > 0.5), 0.5)
save('heartbeat', np.concatenate([kick(0.8)[: int(0.25 * SR)], kick(0.5)[: int(0.5 * SR)]]))
print('sfx done')
