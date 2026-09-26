#!/usr/bin/env python3
"""
SOVEREIGN — original score for the Napoleon edit.

Archival war-montage energy + breakcore/jungle + military snare + dark orchestra +
industrial distortion + cinematic impacts + old-record/radio texture + formant choir
+ reese/808 bass. All material is original (own motif, own break patterns, own
synthesis); orchestral recordings are VSCO 2 CE (CC0). Locked to the edit's 120 BPM
grid and structural markers. Intensity is layered by Napoleon's rise; the collapse
strips it back to radio-filtered choir, detuned piano and crackle.

  VSCO=/path/to/VSCO-2-CE python3 scripts/make_sovereign.py -> public/audio/main-track.wav
"""
import os

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
_m_src = open(os.path.join(HERE, 'make_machine.py')).read()
exec(_m_src[: _m_src.index('\n# ---------------------------------------------------------------- arrangement')])  # kit + machine kit

E['choir'] = np.zeros((N, 2), np.float32)
E['tex'] = np.zeros((N, 2), np.float32)
F_M = [41, 45, 48]
C_M = [48, 52, 55]
Gm_ = [43, 46, 50]


# ---------------------------------------------------------------- new instruments
def choir(b, notes, L, vel=0.5, vowel='a', spread=0.3):
    """formant-synthesised choir: detuned saw voices with vibrato through vowel formants"""
    FORM = {'a': [(700, 110, 1.0), (1220, 120, 0.5), (2600, 160, 0.25)],
            'o': [(450, 90, 1.0), (800, 100, 0.45), (2830, 160, 0.15)],
            'u': [(325, 80, 1.0), (700, 100, 0.3), (2530, 160, 0.1)],
            'e': [(530, 100, 1.0), (1840, 130, 0.45), (2480, 160, 0.25)]}[vowel]
    n = int((L * BEAT + 0.6) * SR)
    t = np.arange(n) / SR
    src = np.zeros(n)
    for m in notes:
        for v in range(4):
            det = (rng.random() - 0.5) * 0.18
            vib = 1 + 0.006 * np.sin(2 * np.pi * (5.2 + rng.random()) * t + rng.random() * 6)
            f = hz(m) * 2 ** (det / 12) * vib
            ph = np.cumsum(f) / SR + rng.random()
            src += 2 * (ph % 1) - 1
    src /= len(notes) * 4
    y = sum(bp(src, max(60, fc - bw), fc + bw) * a for fc, bw, a in FORM)
    breath = bp(rng.normal(0, 1, n), 1500, 5000) * 0.02
    e = np.minimum(1, t / 0.35) * np.minimum(1, np.maximum(0, (L * BEAT + 0.5 - t)) / 0.5)
    y = (y * 3.5 + breath) * e * vel
    put('choir', T(b), np.stack([y, np.roll(y, int(spread * 900))], 1))


def reese(b, midi, L, vel=0.7):
    n = int((L * BEAT + 0.05) * SR)
    t = np.arange(n) / SR
    x = sum(2 * ((t * hz(midi) * 2 ** (d / 12) + rng.random()) % 1) - 1 for d in (-0.22, 0.22, 12.0))
    lfo = 400 + 900 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.7 * t))
    # time-varying lowpass approximated by crossfading two filters
    x = lp(x, 350) * (1 - (lfo - 400) / 900)[: n] + lp(x, 1300) * ((lfo - 400) / 900)[: n]
    x = np.tanh(x * 2.5) * np.minimum(1, t / 0.005) * np.minimum(1, np.maximum(0, L * BEAT + 0.04 - t) / 0.03)
    put('bass', T(b), x * vel * 0.5)


def ghost(b, vel=0.25):
    snare.at('perc', b, vel)


def rev_snare(b_end, vel=0.5):
    x = load(snare.files[-1])[: int(0.4 * SR)][::-1].copy() * vel
    put('drums', T(b_end) - 0.4, x)


BREAKS = [
    # 16 steps: K kick, S snare, g ghost, . rest  (original patterns)
    'K..g S.gK ..K. S..g',
    'K.gK S..g .gK. S.S.',
    'K..K S.g. .KgK S..S',
    'KgK. S.g. K.K. SgSS',
]


def jungle(b0, b1, vel=1.0, chaos=0.2, var=0):
    b = b0
    bar = 0
    while b < b1 - 1e-6:
        pat = BREAKS[(bar + var) % len(BREAKS)].replace(' ', '')
        for i, c in enumerate(pat):
            bb = b + i / 4
            if bb >= b1:
                break
            if rng.random() < chaos and i > 8:  # chop: replace step with a 32nd snare stutter
                clap(bb, vel * 0.5)
                clap(bb + 0.125, vel * 0.6)
                continue
            if c == 'K':
                kick(bb, vel, dist=3.5)
            elif c == 'S':
                clap(bb, vel * 0.9)
            elif c == 'g':
                ghost(bb, vel * 0.3)
            if i % 2 == 1:
                hat(bb, 0.12 * vel)
        if bar % 2 == 1 and b + 3.5 < b1:  # end-of-phrase fill
            for k in range(4):
                clap(b + 3.5 + k * 0.125, vel * (0.4 + 0.15 * k))
            rev_snare(b + 4, vel * 0.5)
        bar += 1
        b += 4


def military(b0, b1, vel=0.8, dense=False):
    """snare rudiments: accented 16ths, flams on the beat, drags before 2 & 4"""
    b = b0
    k = 0
    while b < b1 - 1e-6:
        pos = k % 16
        acc = 0.9 if pos % 4 == 0 else 0.45 if pos % 2 == 0 else 0.25
        if dense or pos % 2 == 0 or pos in (3, 11):
            snare.at('perc', b, vel * acc)
        if pos % 4 == 0:
            snare.at('perc', b - 0.03, vel * 0.3)  # flam grace note
        if pos in (3, 11):
            snare.at('perc', b + 0.0625, vel * 0.25)  # drag
            snare.at('perc', b + 0.125, vel * 0.25)
        k += 1
        b += 0.25


def crackle(b0, b1, vel=0.3):
    n = int((b1 - b0) * BEAT * SR)
    x = np.zeros(n)
    k = rng.poisson(n / SR * 60)
    idx = rng.integers(0, n, k)
    x[idx] = rng.normal(0, 1, k) * rng.random(k) ** 3
    x = hp(x, 800) * 0.8 + lp(rng.normal(0, 1, n), 2500) * 0.015  # pops + surface hiss
    put('tex', T(b0), x * vel)


def static_sweep(b, secs=1.2, vel=0.25):
    """shortwave radio tuning"""
    n = int(secs * SR)
    t = np.arange(n) / SR
    carrier = np.sin(2 * np.pi * np.cumsum(600 + 1800 * np.sin(2 * np.pi * 0.8 * t)) / SR)
    x = bp(rng.normal(0, 1, n), 800, 4000) * 0.5 + carrier * 0.25 * (np.sin(2 * np.pi * 7 * t) > 0)
    put('tex', T(b), x * np.sin(np.pi * t / secs) * vel)


def pitch_dive(b, secs=0.5, vel=0.8):
    n = int(secs * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(1400 * np.exp(-t * 7) + 30) / SR) * np.exp(-t * 3)
    put('fx', T(b), np.tanh(x * 3) * vel * 0.4)


def theme(b0, inst, bus, vel=0.8, octv=0, speed=1.0, notes=None):
    """SOVEREIGN motif (original): D F E D | A Bb A | G F E D"""
    TH = notes or [(62, 0.5), (65, 0.5), (64, 0.5), (62, 0.5), (69, 1), (70, 0.5), (69, 0.5),
                   (67, 0.5), (65, 0.5), (64, 0.5), (62, 1.5)]
    melody(inst, bus, b0, [(n + 12 * octv, L * speed) for n, L in TH], vel)


def layers(b0, b1, prog, level, drums='jungle', choir_on=True, theme_on=True):
    """intensity by layering: level 1..5"""
    if drums == 'jungle':
        jungle(b0, b1, 0.8 + 0.05 * level, chaos=0.08 * level, var=level)
    elif drums == 'military':
        military(b0, b1, 0.7 + 0.05 * level, dense=level >= 4)
        for bb in np.arange(b0, b1, 1):
            kick(bb, 0.8, dist=3)
    elif drums == 'stomp':
        march(b0, b1, 'stomp', 0.9)
    if level >= 2:
        chug_line(b0, b1, prog, 'rammstein' if level < 4 else 'gallop', 0.7)
    b = b0
    while b < b1 - 1e-6:
        ch = prog[int((b - b0) // 4) % len(prog)]
        L = min(4, b1 - b)
        reese(b, ch[0] - 24, L, 0.6 + 0.05 * level)
        if level >= 3:
            pad(b, b + L, [ch], 0.12, 900 + 400 * level)
        if level >= 3 and choir_on:
            choir(b, [ch[0], ch[2], ch[1] + 12], L, 0.35 + 0.08 * level, 'a' if level >= 4 else 'o')
        if level >= 4:
            military(b, b + L, 0.45, dense=level >= 5)
        if level >= 5:
            clock(b, b + L, 4, 0.12)
        b += 4
    if theme_on and level >= 2:
        theme(b0 + 0.0, hn, 'brass', 0.75 + 0.05 * level)
        if level >= 4:
            theme(b0, tbn, 'brass', 0.8, octv=-1)
        if level >= 5:
            theme(b0 + 4, tpt, 'brass', 0.7)


# ---------------------------------------------------------------- arrangement
PR = [Dm, Bb, Gm_, A_]
TRI = [Dm, Bb, F_M, C_M]
OMEN = [Dm, Eb, Dm, A_]

# PROLOGUE 0-16: an archival record, a lone choir, heartbeat → the machine
crackle(0, 16, 0.4)
static_sweep(0.3, 1.5, 0.3)
choir(1, [50, 57], 11, 0.35, 'u')
for bb, n in [(2, 74), (4, 77), (5, 76), (6, 74), (8, 69)]:
    play(piano, 'keys', bb, n, 0.35, 2)
for bb in [6, 7.5, 8, 9.5, 10, 11, 11.5, 12, 12.5, 13, 13.5]:
    kick(bb, 0.35 + (bb - 6) * 0.06, dist=1.5)
military(12, 16, 0.6, dense=True)
riser(12, 16, 0.7)
shepard(12, 16, 0.35)
pitch_dive(15.75, 0.25, 0.6)
silence(15.93, 16)
# TOULON 16-24 (level 2)
impact(16)
orch_hit(16, Dm)
layers(16, 24, PR, 2, drums='military')
stutter(23.5, 24, 0.125)
# ITALY 24-48 (level 3 → 4)
impact(24, 0.9)
layers(24, 36, PR, 3)
orch_hit(32, Bb, 0.8)
layers(36, 46, TRI, 4)
build(46, 48, 0.9)
# EGYPT 48-59: mysterious, choir 'o', snake line, jungle half-time
impact(48, 0.9)
layers(48, 59, OMEN, 3, drums='jungle', theme_on=False)
melody(vln, 'str', 50, [(74, 1), (75, 0.5), (78, 0.5), (79, 1), (78, 0.5), (75, 0.5), (74, 2)], 0.6)
choir(52, [62, 66], 6, 0.5, 'o')
# NILE 59-66: triumph corrupts — radio-filtered, dissonant, pitch dives
impact(59, 1.0)
orch_hit(59, Eb, 1.0)
drone(59, 66, (26, 27, 39), 0.6)
choir(59, [51, 50 + 12], 7, 0.45, 'u')
for bb in (60.5, 62, 63.5, 65):
    pitch_dive(bb, 0.6, 0.6)
static_sweep(64, 2, 0.35)
# BRUMAIRE 66-71: the machine of state — clock + military snare
clock(66, 71, 4, 0.35)
military(66, 71, 0.55)
for bb in np.arange(66, 71, 1):
    reese(bb, 26, 0.5, 0.6)
# MARENGO 71-76 (level 4, breakcore)
impact(71)
orch_hit(71, Gm_)
jungle(71, 76, 1.0, chaos=0.5)
chug_line(71, 76, [Gm_, A_], 'gallop', 0.8)
build(76, 82, 1.0)
choir(76, [50, 57, 62], 6, 0.5, 'a')
# CORONATION: silence → organ + full choir
silence(82, 84)
crackle(82, 84, 0.5)
impact(84, 1.0)
orch_hit(84, Dm, 1.0)
for n in (26, 38, 50, 53, 57, 62):
    play(organ, 'keys', 84, n + (12 if n < 36 else 0), 0.95, 10)
choir(84, [50, 57, 62, 65], 10, 0.8, 'a')
layers(86, 94, [Dm, Dm, Bb, A_], 4, drums='military')
# AUSTERLITZ 94-102: coalition hits, radio fog, the breath
for bb in (94, 94.4, 94.8, 95.2, 95.73):
    orch_hit(bb, Dm, 0.9)
    pitch_dive(bb, 0.3, 0.4)
crackle(96, 102, 0.5)
choir(96, [50, 57], 6, 0.35, 'u')
static_sweep(97, 1.5, 0.3)
shepard(98, 102, 0.45)
riser(99, 102, 0.8)
tapestop(101.5, 101.93)
silence(101.93, 102)
# AUSTERLITZ_DROP 102-116 (level 5)
impact(102, 1.0)
orch_hit(102, Dm, 1.0)
layers(102, 116, TRI, 5)
stutter(115.5, 116, 0.0625)
# MASTER 116-132 (level 4, stomp + jungle)
impact(116, 0.8)
layers(116, 124, PR, 4, drums='stomp')
layers(124, 128, OMEN, 4, drums='jungle')  # Eylau
choir(124, [51, 58], 4, 0.6, 'o')
build(128, 132, 1.0)
# PEAK 132-140 (level 5 + everything; brief D major blaze)
impact(132, 1.0)
orch_hit(132, Dm, 1.0)
layers(132, 140, [Bb, C_M, Dm, DM], 5)
for n in (26, 38, 50, 54, 57):
    play(organ, 'keys', 136, n + 12, 0.9, 4)
choir(136, [50, 54, 57, 62], 4, 0.9, 'a')
# SPAIN / WAGRAM 140-160: overheating (level 4, fraying)
impact(140, 0.8)
layers(140, 150, OMEN, 4, drums='jungle')
stutter(149.5, 150, 0.125)
build(150, 152, 0.8)
impact(152, 1.0)
orch_hit(152, Dm, 1.0)
layers(152, 158, PR, 4)
static_sweep(157, 1.5, 0.3)
tapestop(158, 160)
# RUSSIA 160-177: the tone breaks — cold military snare, radio choir; Borodino overload
impact(160, 0.9)
crackle(160, 177, 0.25)
choir(160, [50, 53, 57], 10, 0.4, 'u')
military(162, 170, 0.45)
for bb in np.arange(162, 170, 2):
    kick(bb, 0.6, dist=2)
impact(170, 1.0)
orch_hit(170, Dm, 1.0)
jungle(170, 177, 1.0, chaos=0.7)
chug_line(170, 177, [Dm, Eb], 'gallop', 1.0)
military(170, 177, 0.6, dense=True)
stutter(176.5, 177, 0.0625)
# MOSCOW 177-182: stillness — the theme on a detuned piano
theme(177.5, piano, 'keys', 0.45, speed=1.0)
play(cb, 'str', 177, 26, 0.3, 5)
# RETREAT 182-192: devastation — the theme slowed, choir lament, the record wearing out
downlifter(182, 3, 0.5)
crackle(182, 192, 0.6)
choir(182, [50, 57], 10, 0.55, 'o')
theme(183, vln, 'str', 0.45, speed=2.0)
play(vc, 'str', 183, 38, 0.35, 9)
for k, n in enumerate([62, 58, 57, 50]):
    play(piano, 'keys', 184 + k * 2, n, 0.3, 3)
# LEIPZIG 192-212: the last big battle, then fragmentation
military(192, 196, 0.7, dense=True)
riser(194, 196, 0.8)
impact(196, 1.0)
orch_hit(196, Dm, 1.0)
layers(196, 204, OMEN, 4, drums='jungle')
jungle(204, 211.5, 0.9, chaos=0.8)  # tactical brilliance, falling apart
reese(204, 26, 7.5, 0.6)
for bb in np.arange(205, 211, 1.5):
    silence(bb, bb + 0.25)  # holes torn in the music
stutter(211.5, 212, 0.0625)
# PARIS FALLS 212 → ELBA: record runs out
impact(212, 0.6)
downlifter(212, 3, 0.5)
crackle(213, 227, 0.5)
static_sweep(218, 2, 0.2)
choir(219, [50, 57], 7, 0.25, 'u')
# HUNDRED DAYS 227: one strike — the machine restarts
impact(227, 1.0)
orch_hit(227, Dm, 1.0)
for bb in np.arange(228, 232, 1):
    kick(bb, 0.6 + (bb - 228) * 0.1, dist=3)
military(230, 234, 0.7, dense=True)
riser(232, 234, 0.9)
shepard(230, 234, 0.4)
impact(234, 1.0)
orch_hit(234, Dm, 1.0)
layers(234, 242, TRI, 5)
# WATERLOO 242-262: final overload, then nothing
crackle(242, 248, 0.3)
military(242, 248, 0.6, dense=True)
for bb in range(242, 248):
    kick(bb, 0.5 + (bb - 242) * 0.08, dist=3)
choir(242, [50, 51], 6, 0.5, 'o')
riser(245, 248, 0.9)
impact(248, 1.0)
orch_hit(248, Dm, 1.0)
layers(248, 256, PR, 5, drums='jungle')
impact(256, 1.0)
orch_hit(256, Dm, 1.0)
layers(256, 262, OMEN, 5, drums='jungle')
choir(256, [50, 57, 62, 65], 6, 1.0, 'a')
for n in (26, 38, 50, 53, 57):
    play(organ, 'keys', 256, n + 12, 0.9, 6)
stutter(261.5, 262, 0.03125)
silence(262, 266.5)
# SAINT HELENA 266-286: gramophone — choir + piano theme, the needle in the run-out groove
crackle(266, 286, 0.55)
choir(267, [50, 57], 18, 0.35, 'u')
theme(268, piano, 'keys', 0.6, speed=2.0)
for bb, chn in [(268, [50, 57]), (272, [46, 53]), (276, [43, 50]), (280, [45, 52]), (283, [50, 57])]:
    for n in chn:
        play(piano, 'keys', bb, n - 12, 0.3, 4)

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


sc = np.ones(N, np.float32)
rel = int(0.2 * SR)
curve = 1 - 0.6 * np.exp(-np.arange(rel) / (0.05 * SR))
for tt in KICKS:
    i = int(tt * SR)
    j = min(N, i + rel)
    if i < N:
        sc[i:j] = np.minimum(sc[i:j], curve[: j - i])
sc = sc[:, None]

hall = reverb_ir(3.6, 1.8)
cath = reverb_ir(6.0, 1.0)
E['drums'] = lp(E['drums'], 7000)
E['fx'] = lp(E['fx'], 8000)
orch = BUS['str'] + BUS['brass'] * 1.1 + BUS['perc'] + BUS['keys'] * 0.9 + BUS['sub']
mix = (drive_(E['kick'], 2.4) * 1.1 + drive_(E['drums'], 1.6) * 0.8 + drive_(E['bass'], 2.2) * sc * 0.9
       + verb(E['music'], hall, 0.3) * sc * 0.7 + verb(drive_(orch, 1.9), hall, 0.3) * (0.55 + 0.45 * sc) * 0.95
       + verb(E['choir'], cath, 0.6) * 0.8 + E['fx'] * 0.8)


def region(b0, b1):
    return int(T(b0) * SR), int(T(b1) * SR)


def radio(b0, b1, lo=350, hi=3200, drive=2.0):
    i, j = region(b0, b1)
    seg = bp(mix[i:j], lo, hi)
    pk = np.abs(seg).max() + 1e-9
    mix[i:j] = np.tanh(seg / pk * drive) * pk * 0.9


def wow(b0, b1, depth=0.004, rate=0.6):
    """tape wow & flutter (pitch wobble)"""
    i, j = region(b0, b1)
    n = j - i
    t = np.arange(n) / SR
    warp = np.cumsum(1 + depth * np.sin(2 * np.pi * rate * t) + depth * 0.3 * np.sin(2 * np.pi * 7 * t))
    warp = np.clip(warp - warp[0], 0, n - 2)
    seg = mix[i:j].copy()
    for c in range(2):
        mix[i:j, c] = np.interp(warp, np.arange(n), seg[:, c])


def ringmod(b0, b1, f=90, wet=0.5):
    i, j = region(b0, b1)
    t = np.arange(j - i) / SR
    mix[i:j] = mix[i:j] * (1 - wet) + mix[i:j] * np.sin(2 * np.pi * f * t)[:, None] * wet


# archival / psychedelic treatment of the story's turning points
radio(0, 12, 400, 3000, 1.6)
wow(0, 16, 0.006)
radio(59, 66, 300, 2800, 2.2)
ringmod(62, 66, 70, 0.35)
radio(96, 101.5, 350, 3000, 1.8)
radio(160, 170, 300, 2600, 2.0)
wow(160, 170, 0.005)
wow(177, 192, 0.009, 0.4)
radio(182, 192, 280, 2400, 1.8)
ringmod(206, 211, 55, 0.25)
radio(212, 227, 300, 2500, 1.5)
radio(266, 286, 250, 3500, 1.4)
wow(266, 286, 0.007, 0.35)
mix += E['tex'] * 0.9  # crackle sits on top, unfiltered

AUTO = [(0, -3), (15.9, -5), (16, -4), (47.9, -3), (48, -3), (58.9, -2.5), (59, -4), (66, -5), (70.9, -4), (71, -2), (101.9, -1.5), (102, -0.5), (131.9, 0), (132, 1), (139.9, 1), (140, -1), (176.9, 0), (177, -8),
        (191.9, -6), (192, -2), (211.9, 0), (212, -4), (216, -9), (226.9, -9), (227, 0), (262, 0), (266, 3), (286, 1)]
tb = np.array([T(b) for b, _ in AUTO]) * SR
mix *= (10 ** (np.interp(np.arange(len(mix)), tb, [g for _, g in AUTO]) / 20))[:, None].astype(np.float32)
mix = lp(mix, 9000) * 0.9 + lp(mix, 220) * 0.3
pk = np.percentile(np.abs(mix), 99.7)
mix = np.tanh(mix / pk * 1.35) * 0.95
mix /= np.abs(mix).max() / 0.97
fe = int(3 * SR)
mix[-fe:] *= np.linspace(1, 0, fe)[:, None]
out = os.path.join(ROOT, 'public', 'audio', 'main-track.wav')
sf.write(out, mix.astype(np.float32), SR, subtype='PCM_16')
print('wrote', out, round(len(mix) / SR, 1), 's')
