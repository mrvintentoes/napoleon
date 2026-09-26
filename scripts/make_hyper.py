#!/usr/bin/env python3
"""
HYPER mix — high-stimulation internet-edit score (phonk / breakcore / trailer hybrid).

Electronic layer is synthesized here (808s, distorted kicks, claps, hat rolls, phonk
cowbell, supersaw, risers, tape-stops, stutters, bitcrush, sidechain pump); the
orchestral hits reuse the recorded VSCO 2 CE instruments from make_score.py.
Everything sits on the edit's 120 BPM grid and structural markers.

  VSCO=/path/to/VSCO-2-CE python3 scripts/make_hyper.py  -> public/audio/main-track.wav
"""
import os

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
_src = open(os.path.join(HERE, 'make_score.py')).read()
exec(_src[: _src.index('# ---------------------------------------------------------------- arrangement')])  # sampler + instruments

from scipy.signal import butter, sosfilt  # noqa: E402

E = {k: np.zeros((N, 2), np.float32) for k in ('kick', 'drums', 'bass', 'music', 'fx', 'orch')}
KICKS = []  # kick times (s) for sidechain


def put(bus, t, x, pan=0.0):
    i = int(t * SR)
    if i >= N or i + len(x) <= 0:
        return
    if x.ndim == 1:
        l, r = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
        x = np.stack([x * l, x * r], 1)
    j = min(N, i + len(x))
    E[bus][max(0, i):j] += x[max(0, -i): j - i].astype(np.float32)


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def lp(x, f):
    return sosfilt(butter(2, min(f, SR / 2.1) / (SR / 2), 'low', output='sos'), x, axis=0)


def hp(x, f):
    return sosfilt(butter(2, f / (SR / 2), 'high', output='sos'), x, axis=0)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band', output='sos'), x, axis=0)


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


# ---------------------------------------------------------------- electronic kit
def kick(b, vel=1.0, dist=3.0):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 42 + 190 * np.exp(-t * 32)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5)
    x += rng.normal(0, 1, n) * np.exp(-t * 400) * 0.5  # click
    x = np.tanh(x * dist) * vel * 0.9
    put('kick', T(b), x)
    KICKS.append(T(b))


def clap(b, vel=0.8):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    noise = bp(rng.normal(0, 1, n), 900, 6000)
    e = sum(np.exp(-np.maximum(t - d, 0) * 60) * (t >= d) for d in (0, 0.011, 0.022)) + np.exp(-t * 14) * 0.6
    x = noise * e * 0.45 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.4
    put('drums', T(b), np.tanh(x * 1.5) * vel)
    snare.at('drums' if False else 'perc', b, vel * 0.6)  # acoustic layer (VSCO), mixed into orch bus later


def hat(b, vel=0.35, open_=False, pan=0.25):
    n = int((0.22 if open_ else 0.045) * SR)
    t = np.arange(n) / SR
    x = hp(rng.normal(0, 1, n), 7500) * np.exp(-t * (14 if open_ else 90))
    put('drums', T(b), x * vel, pan)


def hat_roll(b0, b1, div, vel=0.3):
    b = b0
    while b < b1 - 1e-6:
        hat(b, vel * (0.7 + 0.3 * ((b * div) % 2 == 0)))
        b += 1 / div


def cowbell(b, midi, vel=0.5, L=0.25):
    """808 cowbell (two detuned squares through a bandpass) — the phonk signature"""
    n = int(max(L, 0.12) * SR * 1.6)
    t = np.arange(n) / SR
    f1 = hz(midi)
    f2 = f1 * 1.48
    x = np.sign(np.sin(2 * np.pi * f1 * t)) + np.sign(np.sin(2 * np.pi * f2 * t))
    x = bp(x, f1 * 0.8, f1 * 4) * (np.exp(-t * 28) * 0.7 + np.exp(-t * 6) * 0.3)
    put('music', T(b), x * vel * 0.35, -0.15)


def bass808(b, midi, L=1.0, vel=1.0, glide_from=None):
    n = int((L * BEAT + 0.15) * SR)
    t = np.arange(n) / SR
    f = np.full(n, hz(midi))
    if glide_from is not None:
        f = hz(midi) + (hz(glide_from) - hz(midi)) * np.exp(-t * 22)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR)
    e = np.minimum(1, t / 0.004) * np.minimum(1, np.maximum(0, (L * BEAT + 0.12 - t)) / 0.06)
    x = np.tanh(x * 3.2) * e * vel * 0.75  # distorted 808
    put('bass', T(b), x)


def saw_chord(b, notes, L, vel=0.4, cutoff=3500, bus='music'):
    n = int((L * BEAT + 0.2) * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for m in notes:
        for det in (-0.12, -0.05, 0, 0.05, 0.12):  # supersaw
            ph = (t * hz(m) * 2 ** (det / 12) + rng.random()) % 1
            x += 2 * ph - 1
    x /= len(notes) * 5
    x = lp(x, cutoff) * np.minimum(1, t / 0.01) * np.minimum(1, np.maximum(0, L * BEAT + 0.15 - t) / 0.12)
    y = np.stack([x, np.roll(x, 331)], 1) * vel  # wide
    put(bus, T(b), y)


def riser(b0, b1, vel=0.6):
    L = (b1 - b0) * BEAT
    n = int(L * SR)
    t = np.arange(n) / SR
    u = t / L
    noise = rng.normal(0, 1, n)
    out = np.zeros(n)
    K = 24
    for k in range(K):
        s = slice(k * n // K, (k + 1) * n // K)
        c = 300 + 9000 * (k / K) ** 2
        out[s] = bp(noise[s], c * 0.7, min(c * 1.4, 20000))
    sweep = np.sign(np.sin(2 * np.pi * np.cumsum(80 + 1800 * u ** 2) / SR)) * 0.15
    put('fx', T(b0), (out + sweep) * u ** 2 * vel)


def downlifter(b, secs=2.0, vel=0.5):
    n = int(secs * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(900 * np.exp(-t * 2.5) + 40) / SR) * np.exp(-t * 1.8)
    x += lp(rng.normal(0, 1, n), 3000) * np.exp(-t * 2.2) * 0.4
    put('fx', T(b), x * vel)


def impact(b, vel=1.0):
    n = int(3.5 * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(30 + 70 * np.exp(-t * 5)) / SR) * np.exp(-t * 1.3)
    x += lp(rng.normal(0, 1, n), 500) * np.exp(-t * 3) * 0.8
    put('fx', T(b), np.tanh(x * 2) * vel)
    KICKS.append(T(b))


def orch_hit(b, ch=Dm, vel=1.0):
    """orchestra stab from the recorded brass + timpani + bass drum (VSCO)"""
    stabs([b], ch, vel, braam=False)
    timp_low.at('perc', b, vel)
    crash.at('perc', b, vel * 0.8)


def reverse_crash(b_end, secs=1.5, vel=0.6):
    x = load(crash.files[0])[: int(secs * SR)][::-1].copy() * vel
    put('fx', T(b_end) - secs, x)


# ---------------------------------------------------------------- patterns (8th / 16th grid)
PH_KICK = [0, 0.75, 1.5, 2.5, 2.75]         # phonk halftime kick (per 4 beats)
DT_KICK = [0, 0.75, 1.5, 2, 2.75, 3.5]       # double-time drive
RIFF = [0, 3, 7, 12, 10, 7, 3, 5]            # phonk cowbell riff (semitones over root, 16ths)
RIFF_EG = [0, 1, 4, 5, 7, 4, 1, 0]           # harmonic-minor colour for Egypt


def groove(b0, b1, prog, style='phonk', riff=RIFF, cow=True, lead=False, bass=True, vel=1.0):
    b = b0
    while b < b1 - 1e-6:
        bar = int((b - b0) // 4)
        ch = prog[bar % len(prog)]
        root = ch[0] - 12  # D2-ish
        if style == 'phonk':
            for k in PH_KICK:
                if b + k < b1:
                    kick(b + k, vel)
            for k in (1, 3):
                if b + k < b1:
                    clap(b + k, vel * 0.85)
            hat_roll(b, min(b + 4, b1), 4, 0.28 * vel)
            if bar % 2 == 1 and b + 3.5 < b1:
                hat_roll(b + 3.5, min(b + 4, b1), 12, 0.3 * vel)  # trap roll
        elif style == 'double':
            for k in DT_KICK:
                if b + k < b1:
                    kick(b + k, vel)
            for k in (0.5, 1, 1.5, 2, 2.5, 3, 3.5):
                if k in (1, 3) and b + k < b1:
                    clap(b + k, vel * 0.9)
            hat_roll(b, min(b + 4, b1), 8, 0.22 * vel)  # 32nds
            hat(b + 1.5, 0.35 * vel, open_=True)
        elif style == 'break':  # breakcore chaos
            for k in np.arange(0, 4, 0.25):
                if b + k >= b1:
                    break
                r = rng.random()
                if r < 0.35:
                    kick(b + k, vel * (0.7 + 0.3 * rng.random()))
                elif r < 0.6:
                    clap(b + k, vel * 0.6)
                elif r < 0.75:
                    tenor.at('perc', b + k, vel * 0.5)
            hat_roll(b, min(b + 4, b1), 8, 0.2)
        if bass:
            pat = [(0, 1.5), (1.5, 0.5), (2, 0.75), (2.75, 1.25)]
            for k, L in pat:
                if b + k < b1:
                    g = root + 12 if k == 1.5 else None
                    bass808(b + k, root, min(L, b1 - b - k), vel, glide_from=g)
        if cow:
            for i in range(16):
                if b + i / 4 < b1:
                    cowbell(b + i / 4, ch[0] + 24 + riff[i % 8], 0.55 * vel)
        if lead:
            saw_chord(b, up(ch, 1), min(4, b1 - b), 0.22 * vel, cutoff=2500 + 3000 * (bar % 2))
        b += 4


def build(b0, b1, vel=1.0):
    """accelerating snare roll + riser + filtered kicks into a drop"""
    riser(b0, b1, 0.7 * vel)
    b = b0
    while b < b1 - 1e-6:
        span = b1 - b0
        prog_ = (b - b0) / span
        div = 2 if prog_ < 0.4 else 4 if prog_ < 0.75 else 8
        clap(b, 0.3 + 0.6 * prog_)
        b += 1 / div
    reverse_crash(b1, min(2.0, (b1 - b0) * BEAT), 0.6)


def stutter(b0, b1, slice_beats=0.125):
    """repeat the first slice of [b0,b1) across the region on every bus (glitch roll)"""
    i0, i1 = int(T(b0) * SR), int(T(b1) * SR)
    L = int(slice_beats * BEAT * SR)
    for bus in E.values():
        s = bus[i0:i0 + L].copy()
        k = i0
        while k < i1:
            j = min(i1, k + L)
            bus[k:j] = s[: j - k] * np.linspace(1, 0.7, j - k)[:, None]
            k += L
    for bus in BUS.values():
        s = bus[i0:i0 + L].copy()
        k = i0
        while k < i1:
            j = min(i1, k + L)
            bus[k:j] = s[: j - k]
            k += L


def tapestop(b0, b1):
    """slow the whole mix to a halt over [b0, b1)"""
    i0, i1 = int(T(b0) * SR), int(T(b1) * SR)
    n = i1 - i0
    rate = np.linspace(1, 0.05, n)
    pos = i0 + np.cumsum(rate)
    for bus in list(E.values()) + list(BUS.values()):
        src = bus[i0:i0 + n * 2].copy() if i0 + n * 2 <= N else bus[i0:].copy()
        idx = np.clip(pos - i0, 0, len(src) - 2)
        for c in range(2):
            bus[i0:i1, c] = np.interp(idx, np.arange(len(src)), src[:, c]) * np.linspace(1, 0.3, n)


def silence(b0, b1):
    i0, i1 = int(T(b0) * SR), int(T(b1) * SR)
    for bus in list(E.values()) + list(BUS.values()):
        bus[i0:i1] = 0


def pad(b0, b1, prog, vel=0.3, cutoff=1200):
    b = b0
    while b < b1 - 1e-6:
        ch = prog[int((b - b0) // 4) % len(prog)]
        saw_chord(b, ch, min(4, b1 - b), vel, cutoff)
        b += 4


# ---------------------------------------------------------------- arrangement
PR = [Dm, Bb, Gm, A_]
PR2 = [Dm, Dm, Bb, A_]
EG = [Dm, Eb, Dm, A_]
# PROLOGUE 0-16: dark pad, piano fragments, heartbeat that accelerates, build, tape-stop
pad(0, 12, [Dm, Dm, Bb], 0.18, 700)
for bb, n in [(1, 74), (3, 69), (5, 72), (7, 65), (8.5, 74), (9.5, 77)]:
    play(piano, 'keys', bb, n, 0.4, 2)
for bb in [4, 6, 7, 8, 9, 9.5, 10, 10.5, 11, 11.25, 11.5, 11.75]:
    kick(bb, 0.45 + (bb - 4) * 0.06, dist=1.5)
build(12, 16, 1.0)
hat_roll(13, 16, 8, 0.2)
# DROP_1 Toulon 16-24: phonk halftime
impact(16)
orch_hit(16, Dm)
groove(16, 24, PR, 'phonk')
stutter(23.5, 24, 0.125)
# ITALY 24-48: double-time drive, supersaw lead
impact(24, 0.8)
groove(24, 40, PR, 'double', lead=True)
groove(40, 46, PR2, 'phonk', lead=True)
orch_hit(32, Dm, 0.8)
orch_hit(40, Bb, 0.8)
build(46, 48, 0.8)
# EGYPT 48-59: phonk with harmonic-minor cowbell
impact(48, 0.9)
groove(48, 59, EG, 'phonk', riff=RIFF_EG, lead=False)
melody(vln, 'str', 50, [(74, 1), (75, 0.5), (78, 0.5), (79, 1), (78, 0.5), (75, 0.5), (74, 2)], 0.6)
# NILE 59-66: corrupted — impact, bitcrushed heavy halftime, no cowbell
impact(59, 1.0)
orch_hit(59, Eb, 1.0)
groove(59, 66, [Dm, Eb], 'phonk', cow=False, vel=0.9)
# BRUMAIRE 66-71: tension — ticking hats, pulsing 808, no kick
hat_roll(66, 71, 4, 0.3)
for bb in np.arange(66, 71, 1):
    bass808(bb, 38, 0.5, 0.7)
    cowbell(bb + 0.5, 74, 0.35)
# MARENGO 71-76: breakcore burst
impact(71)
orch_hit(71, Gm)
groove(71, 76, [Gm, A_], 'break', cow=False)
build(76, 82, 1.0)
# CORONATION: silence → crown drop
silence(82, 84)
play(piano, 'keys', 82.4, 86, 0.3, 1.5)
impact(84, 1.0)
orch_hit(84, Dm, 1.0)
for n in (38, 50, 53, 57, 62, 65):
    play(organ, 'keys', 84, n, 0.9, 8)
groove(86, 94, [Dm, Dm, Gm, A_], 'phonk', lead=True, vel=0.95)
# AUSTERLITZ 94-102: coalition stabs, fog, filtered build
for bb in (94, 94.4, 94.8, 95.2, 95.73):
    orch_hit(bb, Dm, 0.85)
    kick(bb, 0.9)
pad(96, 102, [Dm], 0.25, 600)
build(98, 102, 1.0)
tapestop(101.5, 102)
# AUSTERLITZ_DROP 102-116: max energy double-time
impact(102, 1.0)
orch_hit(102, Dm, 1.0)
groove(102, 116, PR, 'double', lead=True, vel=1.0)
for bb in (106, 110, 114):
    orch_hit(bb, PR[int((bb - 102) // 4) % 4], 0.7)
stutter(115.5, 116, 0.0625)
# MASTER 116-132
impact(116, 0.8)
groove(116, 128, PR2, 'phonk', lead=True)
groove(124, 128, PR2, 'break', cow=False, bass=False, vel=0.6)
build(128, 132, 1.0)
# PEAK 132-140: everything
impact(132, 1.0)
orch_hit(132, Dm, 1.0)
groove(132, 140, PR, 'double', lead=True, vel=1.0)
pad(132, 140, PR, 0.2, 5000)
for n in (38, 50, 53, 57):
    play(organ, 'keys', 132, n, 0.6, 8)
# SPAIN / WAGRAM 140-160
impact(140, 0.8)
groove(140, 150, [Dm, Eb, Bb, A_], 'phonk')
orch_hit(148, Eb, 0.9)
stutter(149.5, 150, 0.125)
build(150, 152, 0.8)
impact(152, 1.0)
orch_hit(152, Dm, 1.0)
groove(152, 158, PR, 'double', lead=True)
tapestop(158, 160)
# RUSSIA 160-177: cold halftime, then Borodino chaos
impact(160, 0.9)
pad(160, 170, [Dm, Eb], 0.22, 500)
for bb in np.arange(162, 170, 2):
    kick(bb, 0.7, dist=1.5)
    clap(bb + 1, 0.4)
impact(170, 1.0)
orch_hit(170, Dm, 1.0)
groove(170, 177, [Dm, Eb], 'break', cow=False, vel=1.0)
stutter(176.5, 177, 0.0625)
# MOSCOW 177-182: stillness
for k, n in enumerate([74, 72, 69, 65]):
    play(piano, 'keys', 177.5 + k * 1.1, n, 0.4, 2)
pad(177, 182, [Dm], 0.12, 400)
# RETREAT 182-192: filtered, hollow
downlifter(182, 3, 0.6)
pad(182, 192, [Dm, Bb], 0.15, 450)
melody(vln, 'str', 183, [(74, 2), (72, 1), (70, 1), (69, 3), (None, 1), (67, 2), (65, 1), (64, 1)], 0.35)
# LEIPZIG 192-212
groove(192, 194, [Dm], 'phonk', cow=False, bass=False, vel=0.7)
build(194, 196, 1.0)
impact(196, 1.0)
orch_hit(196, Dm, 1.0)
groove(196, 204, [Dm, Eb, Bb, A_], 'phonk', lead=True)
groove(204, 211.5, PR, 'double', lead=True)
stutter(211.5, 212, 0.0625)
# PARIS FALLS 212 → ELBA silence
impact(212, 0.7)
downlifter(212, 3, 0.5)
play(piano, 'keys', 220, 62, 0.3, 4)
play(piano, 'keys', 223, 57, 0.25, 4)
# HUNDRED DAYS 227: one hit, build, full return
impact(227, 1.0)
orch_hit(227, Dm, 1.0)
kick(228, 0.6)
kick(229, 0.7)
groove(229, 232, [Dm], 'phonk', cow=False, vel=0.8)
build(232, 234, 1.0)
impact(234, 1.0)
orch_hit(234, Dm, 1.0)
groove(234, 242, PR, 'double', lead=True, vel=1.0)
# WATERLOO 242-262
pad(242, 248, [Dm], 0.25, 700)
for bb in range(242, 248):
    kick(bb, 0.5 + (bb - 242) * 0.08, dist=2)
build(245, 248, 1.0)
impact(248, 1.0)
orch_hit(248, Dm, 1.0)
groove(248, 256, [Dm, Gm, Bb, A_], 'phonk', lead=True)
impact(256, 1.0)
orch_hit(256, Dm, 1.0)
groove(256, 262, PR, 'double', lead=True, vel=1.0)
groove(260, 262, PR, 'break', cow=False, bass=False, vel=0.7)
stutter(261.5, 262, 0.03125)
silence(262, 266.5)
# SAINT HELENA 266-286: lofi piano
elegy = [(74, 2), (69, 1), (70, 1), (69, 2), (65, 2), (67, 1), (65, 1), (64, 2), (62, 4)]
melody(piano, 'keys', 268, elegy, 0.6)
for bb, chn in [(268, [50, 57]), (272, [46, 53]), (276, [43, 50]), (280, [45, 52]), (283, [50, 57])]:
    for n in chn:
        play(piano, 'keys', bb, n - 12, 0.3, 4)
pad(268, 286, [Dm, Bb, Gm, A_], 0.1, 600)

# ---------------------------------------------------------------- mix
def reverb_ir(seconds, damp):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.stack([rng.normal(0, 1, n), rng.normal(0, 1, n)], 1) * np.exp(-t * damp)[:, None]
    ir = sosfilt(butter(2, 5000 / (SR / 2), 'low', output='sos'), ir, axis=0)
    ir[: int(0.012 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum() / 2)


def verb(x, ir, wet):
    y = np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1)
    return x + y * wet


def drive_(x, a):
    pk = np.percentile(np.abs(x), 99.5) + 1e-9
    return np.tanh(x / pk * a) * pk / np.tanh(a)


# sidechain pump from every kick/impact
sc = np.ones(N, np.float32)
rel = int(0.22 * SR)
curve = 1 - 0.65 * np.exp(-np.arange(rel) / (0.06 * SR))
for t in KICKS:
    i = int(t * SR)
    j = min(N, i + rel)
    if i < N:
        sc[i:j] = np.minimum(sc[i:j], curve[: j - i])
sc = sc[:, None]

orch = BUS['str'] + BUS['brass'] * 1.1 + BUS['perc'] + BUS['keys'] * 0.9 + BUS['sub']
hall = reverb_ir(2.5, 2.6)
music = verb(E['music'], hall, 0.25) * sc
orch_m = verb(drive_(orch, 1.8), hall, 0.25) * (0.5 + 0.5 * sc)
bass = drive_(E['bass'], 2.5) * sc
mix = drive_(E['kick'], 1.6) * 1.1 + drive_(E['drums'], 1.4) * 0.8 + bass * 0.9 + music * 0.8 + orch_m * 0.9 + E['fx'] * 0.8


# lo-fi / bitcrushed regions (Nile, Russia)
def crush(b0, b1, bits=6, keep=4, f=3500):
    i, j = int(T(b0) * SR), int(T(b1) * SR)
    seg = mix[i:j]
    seg = np.repeat(seg[::keep], keep, 0)[: j - i]
    q = 2 ** bits
    seg = np.round(seg * q) / q
    mix[i:j] = lp(seg, f)


crush(59, 66, 6, 3, 4000)
crush(160, 170, 5, 4, 2500)
crush(182, 192, 7, 2, 2000)

AUTO = [(0, -4), (15.9, -2), (16, 0), (58.9, 0), (59, -2), (66, -5), (70.9, -4), (71, 0), (176.9, 0), (177, -10),
        (191.9, -8), (192, -2), (211.9, 0), (212, -4), (216, -10), (226.9, -10), (227, 0), (262, 0), (266, 4), (286, 2)]
tb = np.array([T(b) for b, _ in AUTO]) * SR
mix *= (10 ** (np.interp(np.arange(len(mix)), tb, [g for _, g in AUTO]) / 20))[:, None].astype(np.float32)

# master: glue saturation + limiter
pk = np.percentile(np.abs(mix), 99.7)
mix = np.tanh(mix / pk * 1.3) * 0.95
mix /= np.abs(mix).max() / 0.97
fe = int(3 * SR)
mix[-fe:] *= np.linspace(1, 0, fe)[:, None]
out = os.path.join(ROOT, 'public', 'audio', 'main-track.wav')
sf.write(out, mix.astype(np.float32), SR, subtype='PCM_16')
print('wrote', out, round(len(mix) / SR, 1), 's')
