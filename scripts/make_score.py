#!/usr/bin/env python3
"""
Orchestral score for the Napoleon edit, built from real recorded instruments
(VSCO 2 Community Edition, CC0: https://github.com/sgossner/VSCO-2-CE).

Everything is placed on the edit's 120 BPM grid using the structural markers from
src/data/beats.ts, so every drop, silence and hit lands on the picture.

  VSCO=/path/to/VSCO-2-CE python3 scripts/make_score.py
  -> public/audio/main-track.wav   (convert: npm run audio:score)
"""
import glob
import os
import re

import numpy as np
import soundfile as sf
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
BPM = 120
BEAT = 60 / BPM
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VSCO = os.environ.get('VSCO', '/home/user/vsco/repo')
rng = np.random.default_rng(1815)

# ---- markers (beats) — mirror of src/data/beats.ts
M = dict(TOULON=13, DROP_1=16, ITALY=24, EGYPT=48, NILE=59, BRUMAIRE=66, MARENGO=71, CORONATION=82, CROWN_DROP=84,
         AUSTERLITZ=94, AUSTERLITZ_DROP=102, MASTER=116, PEAK=132, SPAIN=140, WAGRAM=152, RUSSIA_BREAK=160,
         BORODINO=170, MOSCOW=177, RETREAT=182, LEIPZIG_START=192, LEIPZIG=196, FRANCE_1814=204, PARIS_FALLS=212,
         ELBA_SILENCE=216, HUNDRED_DAYS=224, HUNDRED_DAYS_DROP=227, PARIS_1815=234, WATERLOO=242, WATERLOO_DROP=248,
         WATERLOO_CLIMAX=256, FINAL_CUT=262, SAINT_HELENA=266, END=286)
T = lambda b: b * BEAT
N = int((T(M['END']) + 2) * SR)

NOTE_RE = re.compile(r'(?<![A-Za-z])([A-G])(#?)(-?\d)(?=[_.])')
PC = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def note_of(fn):
    m = NOTE_RE.search(os.path.basename(fn))
    if not m:
        return None
    # VSCO names use middle C = C3; +12 converts to MIDI (measured against the recordings)
    return 12 * (int(m.group(3)) + 2) + PC[m.group(1)] + (1 if m.group(2) else 0)


def vel_of(fn):
    m = re.search(r'_v(\d)', os.path.basename(fn))
    return int(m.group(1)) if m else 1


# ---------------------------------------------------------------- sampler
_cache = {}


def load(path):
    if path not in _cache:
        x, sr = sf.read(path, dtype='float32', always_2d=True)
        if x.shape[1] == 1:
            x = np.repeat(x, 2, 1)
        x = x[:, :2]
        # trim leading silence
        env = np.abs(x).max(1)
        start = int(np.argmax(env > env.max() * 0.02)) if env.max() > 0 else 0
        _cache[path] = x[max(0, start - 64):]
    return _cache[path]


class Inst:
    def __init__(self, pattern, note_fn=note_of, gain=1.0, pan=0.0, release=0.25):
        files = sorted(glob.glob(os.path.join(VSCO, pattern)))
        self.samples = [(note_fn(f), vel_of(f), f) for f in files]
        self.samples = [s for s in self.samples if s[0] is not None]
        assert self.samples, pattern
        self.vmax = max(s[1] for s in self.samples)
        self.gain, self.pan, self.release = gain, pan, release
        self.rr = 0

    def pick(self, midi, vel):
        # nearest note, then velocity layer closest to requested (0..1)
        target_v = 1 + vel * (self.vmax - 1)
        best = min(self.samples, key=lambda s: (abs(s[0] - midi) * 3 + abs(s[1] - target_v), rng.random()))
        cands = [s for s in self.samples if s[0] == best[0] and s[1] == best[1]]
        self.rr += 1
        return cands[self.rr % len(cands)]

    def render(self, midi, vel, dur):
        lo = min(x[0] for x in self.samples)
        hi = max(x[0] for x in self.samples)
        while midi < lo - 2:
            midi += 12  # fold out-of-range notes by octave instead of extreme pitch-shifting
        while midi > hi + 2:
            midi -= 12
        n0, _, path = self.pick(midi, vel)
        x = load(path)
        ratio = 2 ** ((midi - n0) / 12)
        want = int(dur * SR) + int(self.release * SR)
        src_len = min(len(x), int(want * ratio) + 2)
        idx = np.arange(0, src_len - 1, ratio)
        y = np.stack([np.interp(idx, np.arange(src_len), x[:src_len, c]) for c in range(2)], 1)
        rel = int(self.release * SR)
        if len(y) > int(dur * SR):
            k = int(dur * SR)
            fade = np.linspace(1, 0, min(rel, len(y) - k))
            y = y[: k + len(fade)]
            y[k:] *= fade[:, None]
        a = min(len(y), int(0.004 * SR))
        y[:a] *= np.linspace(0, 1, a)[:, None]
        # dynamics: sample layer covers timbre; scale for fine control
        y *= self.gain * (0.35 + 0.65 * vel)
        l = np.cos((self.pan + 1) * np.pi / 4)
        r = np.sin((self.pan + 1) * np.pi / 4)
        y[:, 0] *= l * 1.414
        y[:, 1] *= r * 1.414
        return y


BUS = {k: np.zeros((N, 2), np.float32) for k in ('str', 'brass', 'perc', 'keys')}


def play(inst, bus, beat, midi, vel=0.7, beats=1.0, secs=None):
    t = T(beat)
    y = inst.render(midi, vel, secs if secs is not None else beats * BEAT)
    i = int(t * SR)
    if i >= N:
        return
    j = min(N, i + len(y))
    BUS[bus][i:j] += y[: j - i]


def chord(inst, bus, beat, notes, vel=0.7, beats=4.0):
    for n in notes:
        play(inst, bus, beat, n, vel, beats)


def hit(inst, bus, beat, vel=0.9, note=None):
    s = inst.samples[0][0] if note is None else note
    play(inst, bus, beat, s, vel, secs=4.0)


# ---------------------------------------------------------------- instruments
S = 'Strings/'
vln = Inst(S + 'Violin Section/susVib/*.wav', gain=0.55, pan=-0.35, release=0.6)
vla = Inst(S + 'Viola Section/susvib/*.wav', gain=0.55, pan=0.25, release=0.6)
vc = Inst(S + 'Cello Section/susvib/*.wav', gain=0.6, pan=0.35, release=0.6)
cb = Inst(S + 'Solo Contrabass/SusVib/*.wav', gain=0.75, pan=0.1, release=0.6)
vln_sp = Inst(S + 'Violin Section/Spic/*.wav', gain=0.5, pan=-0.4, release=0.08)
vla_sp = Inst(S + 'Viola Section/spic/*.wav', gain=0.45, pan=0.2, release=0.08)
vc_sp = Inst(S + 'Cello Section/spic/*.wav', gain=0.55, pan=0.4, release=0.08)
cb_sp = Inst(S + 'Solo Contrabass/Spic/*.wav', gain=0.6, pan=0.1, release=0.08)
hn = Inst('Brass/F Horn/sus/*.wav', gain=0.55, pan=-0.2, release=0.4)
hn_st = Inst('Brass/F Horn/stac/*.wav', gain=0.55, pan=-0.2, release=0.1)
tbn = Inst('Brass/Tenor Trombone/sus/*.wav', gain=0.5, pan=0.3, release=0.35)
tbn_st = Inst('Brass/Tenor Trombone/stac/*.wav', gain=0.55, pan=0.3, release=0.1)
tpt = Inst('Brass/Trumpet/sus/*.wav', gain=0.45, pan=0.05, release=0.35)
tpt_st = Inst('Brass/Trumpet/stac/*.wav', gain=0.45, pan=0.05, release=0.1)
tba = Inst('Brass/Tuba/sus/*.wav', gain=0.6, pan=0.15, release=0.35)
tba_st = Inst('Brass/Tuba/stac/*.wav', gain=0.6, pan=0.15, release=0.1)
organ = Inst('Keys/Organ/Loud/Rode_Man3Open_*.wav',
             note_fn=lambda f: 35 + int(re.search(r'_(\d+)\.wav', f).group(1)), gain=0.35, release=1.2)


def piano_note(f):
    k = int(re.search(r'_(\d{3})\.wav', f).group(1))
    return 21 + 2 * k  # MappingChart: 000=21, step 2


piano = Inst('Keys/Upright Piano/Player_dyn*_rr1_*.wav', note_fn=piano_note, gain=0.6, release=1.5)
# piano dynamics live in the "dyn" number
for i, s in enumerate(piano.samples):
    piano.samples[i] = (s[0], int(re.search(r'dyn(\d)', s[2]).group(1)), s[2])
piano.vmax = max(s[1] for s in piano.samples)

# percussion (unpitched use: pick by index)
class Perc:
    def __init__(self, pattern, gain=1.0, pan=0.0):
        self.files = sorted(glob.glob(os.path.join(VSCO, pattern)))
        assert self.files, pattern
        self.gain, self.pan, self.i = gain, pan, 0

    def at(self, bus, beat, vel=0.8, which=None, secs=4.0):
        # velocity -> choose among files ordered by v-number when present
        fs = self.files
        if which is None:
            vs = sorted(set(vel_of(f) for f in fs))
            target = vs[min(len(vs) - 1, int(vel * len(vs)))]
            fs = [f for f in fs if vel_of(f) == target] or self.files
        else:
            fs = [f for f in fs if which in os.path.basename(f)] or self.files
        self.i += 1
        x = load(fs[self.i % len(fs)])[: int(secs * SR)].copy() * self.gain * (0.4 + 0.6 * vel)
        i = int(T(beat) * SR)
        if i >= N:
            return
        j = min(N, i + len(x))
        BUS[bus][i:j] += x[: j - i]


bd = Perc('Percussion/BDrumNewhit_*.wav', gain=1.1)
bd2 = Perc('VSCO 1 Percussion/drums/bass/*.wav', gain=0.9)
timp_low = Perc('Percussion/Timpani/Timpani2_Hit_*.wav', gain=0.9)
timp_hi = Perc('Percussion/Timpani/Timpani1_Hit_*.wav', gain=0.8)
timp_roll = Perc('Percussion/Timpani/Rolls/*.wav', gain=0.8)
snare = Perc('Percussion/Snare2-HitSN_*.wav', gain=0.55, pan=-0.1)
snare_roll = Perc('Percussion/Snare2-roll*.wav', gain=0.5)
tenor = Perc('VSCO 1 Percussion/drums/tenor/*/*.wav', gain=0.6)
crash = Perc('Percussion/cymbal-crash1_*.wav', gain=0.45)
gong = Perc('Percussion/gongHit_*.wav', gain=0.8)
cym_cresc = Perc('Percussion/susCymb1-cresc*.wav', gain=0.5)
anvil = Perc('Percussion/Anvil*.wav', gain=0.35)

# ---------------------------------------------------------------- harmony (D minor / D major)
D2, D3, D4, D5 = 38, 50, 62, 74
Dm = [50, 53, 57]
Bb = [46, 50, 53]
F_ = [41, 45, 48]
C_ = [48, 52, 55]
Gm = [43, 46, 50]
A_ = [45, 49, 52]
DM = [50, 54, 57]
G_ = [43, 47, 50]
Bm = [47, 50, 54]
Eb = [51, 55, 58]
MIN = [Dm, Bb, F_, C_]
MIN2 = [Dm, Gm, Bb, A_]
MAJ = [DM, A_, Bm, G_]
DARK = [Dm, Eb, Bb, A_]


def up(ch, o):
    return [n + 12 * o for n in ch]


def ostinato(b0, b1, prog, vel=0.7, div=2, insts=(vln_sp, vla_sp), octs=(1, 1)):
    """spiccato strings driving eighths (div=2) or sixteenths (div=4)"""
    k = 0
    b = b0
    while b < b1 - 1e-6:
        bar = int((b - b0) // 4)
        ch = prog[bar % len(prog)]
        pat = [0, 2, 1, 2, 0, 2, 1, 2]
        n = ch[pat[k % 8]]
        accent = 1.0 if k % 4 == 0 else 0.8
        for inst, o in zip(insts, octs):
            play(inst, 'str', b, n + 12 * o, vel * accent, 1 / div)
        k += 1
        b += 1 / div


def bassline(b0, b1, prog, vel=0.8, div=2):
    b = b0
    k = 0
    while b < b1 - 1e-6:
        bar = int((b - b0) // 4)
        root = prog[bar % len(prog)][0] - 12
        play(vc_sp, 'str', b, root, vel * (1 if k % 2 == 0 else 0.75), 1 / div)
        play(cb_sp, 'str', b, root - 12, vel, 1 / div)
        k += 1
        b += 1 / div


def pads(b0, b1, prog, vel=0.55, bars=1, sections=(vln, vla, vc, cb)):
    b = b0
    while b < b1 - 1e-6:
        bar = int((b - b0) // 4)
        ch = prog[bar % len(prog)]
        L = min(4 * bars, b1 - b)
        play(vln, 'str', b, ch[2] + 12, vel, L)
        play(vln, 'str', b, ch[1] + 12, vel * 0.9, L)
        if vla in sections:
            play(vla, 'str', b, ch[0], vel * 0.9, L)
        if vc in sections:
            play(vc, 'str', b, ch[0] - 12, vel, L)
        if cb in sections:
            play(cb, 'str', b, ch[0] - 24, vel, L)
        b += 4 * bars


def brass_chords(b0, b1, prog, vel=0.75, rhythm=(0,), length=1.8, big=True):
    b = b0
    while b < b1 - 1e-6:
        bar = int((b - b0) // 4)
        ch = prog[bar % len(prog)]
        for r in rhythm:
            bb = b + r
            if bb >= b1:
                continue
            for n in ch:
                play(hn, 'brass', bb, n + 12, vel, length)
            play(tbn, 'brass', bb, ch[0], vel, length)
            play(tbn, 'brass', bb, ch[2], vel, length)
            play(tba, 'brass', bb, ch[0] - 12, vel, length)
            if big:
                play(tpt, 'brass', bb, ch[2] + 12, vel * 0.9, length)
        b += 4


def stabs(beats, ch, vel=0.95):
    for bb in beats:
        for n in ch:
            play(hn_st, 'brass', bb, n + 12, vel, 0.5)
            play(tpt_st, 'brass', bb, n + 12, vel * 0.85, 0.5)
        play(tbn_st, 'brass', bb, ch[0], vel, 0.5)
        play(tba_st, 'brass', bb, ch[0] - 12, vel, 0.5)
        play(tba_st, 'brass', bb, ch[0] - 24, vel, 0.5)


def drums(b0, b1, vel=0.8, style='drive'):
    b = b0
    k = 0
    while b < b1 - 1e-6:
        pos = k % 8  # eighth notes
        if style == 'drive':
            if pos in (0, 3, 4, 6):
                bd.at('perc', b, vel if pos in (0, 4) else vel * 0.7)
            if pos in (2, 6):
                snare.at('perc', b, vel * 0.8)
            if pos in (5, 7):
                tenor.at('perc', b, vel * 0.5)
        elif style == 'half':
            if pos == 0:
                bd.at('perc', b, vel)
            if pos == 4:
                snare.at('perc', b, vel)
                timp_low.at('perc', b, vel * 0.6)
        elif style == 'march':
            if pos in (0, 4):
                bd2.at('perc', b, vel)
            snare.at('perc', b, vel * (0.7 if pos % 2 == 0 else 0.35))
        elif style == 'war':
            if pos in (0, 1, 3, 4, 6):
                bd.at('perc', b, vel)
            if pos in (2, 6):
                snare.at('perc', b, vel)
            tenor.at('perc', b, vel * 0.45)
            if pos in (0, 4):
                timp_low.at('perc', b, vel * 0.7)
        if k % 16 == 0 and style in ('drive', 'war'):
            crash.at('perc', b, vel * 0.7)
        k += 1
        b += 0.5


def big_hit(b, vel=1.0, gong_too=True, ch=Dm):
    bd.at('perc', b, vel)
    bd2.at('perc', b, vel)
    timp_low.at('perc', b, vel)
    crash.at('perc', b, vel)
    if gong_too:
        gong.at('perc', b, vel)
    stabs([b], ch, vel)


def roll_into(b0, b1, vel=0.9):
    snare_roll.at('perc', b0, vel * 0.6, secs=(b1 - b0) * BEAT)
    timp_roll.at('perc', b0, vel * 0.7, secs=(b1 - b0) * BEAT)
    cym_cresc.at('perc', max(b0, b1 - 4), vel, secs=4 * BEAT + 0.1)


def melody(inst, bus, b0, notes, vel=0.8):
    """notes: list of (midi or None, beats)"""
    b = b0
    for n, L in notes:
        if n is not None:
            play(inst, bus, b, n, vel, L)
        b += L


# ---------------------------------------------------------------- arrangement
# PROLOGUE 0-13: low strings emerge from nothing, piano fragments, accelerating pulse
play(cb, 'str', 0.5, D2 - 12 + 12, 0.35, 12.5)
play(vc, 'str', 2, D3 - 12, 0.3, 11)
play(vla, 'str', 6, 57, 0.3, 7)
for b, n in [(1, 74), (3, 69), (5, 72), (7, 65), (8.5, 74), (9.5, 77)]:
    play(piano, 'keys', b, n, 0.35, 2)
for b in [6, 8, 9, 10, 10.5, 11, 11.5, 12, 12.25, 12.5, 12.75]:
    timp_low.at('perc', b, 0.35 + (b - 6) * 0.06)
play(vln, 'str', 9, 74, 0.35, 4)
# TOULON build 13-16
roll_into(13, 16, 1.0)
play(hn, 'brass', 13, 62, 0.6, 3)
play(hn, 'brass', 13, 57, 0.6, 3)
play(tbn, 'brass', 14, 50, 0.7, 2)
# DROP_1 16-24: heavy half-time, low brass stabs, spiccato cellos
big_hit(16, 1.0)
drums(16, 24, 0.85, 'half')
bassline(16, 24, MIN, 0.8)
stabs([18, 19.5, 20, 22, 23.5], Dm, 0.85)
pads(16, 24, MIN, 0.45, sections=(vln, vla))
roll_into(22, 24, 0.8)
# ITALY 24-48: full drive
big_hit(24, 0.95, gong_too=False)
drums(24, 48, 0.85, 'drive')
ostinato(24, 48, MIN, 0.75)
bassline(24, 48, MIN, 0.8)
brass_chords(24, 48, MIN, 0.62, rhythm=(0, 2.5), length=1.4, big=False)
# the heroic theme (horns), twice
theme = [(62, 1), (65, 0.5), (69, 1.5), (67, 0.5), (65, 0.5), (64, 1), (62, 1), (60, 1), (62, 2), (None, 1),
         (69, 1), (72, 0.5), (74, 1.5), (72, 0.5), (70, 0.5), (69, 1), (67, 1), (65, 1), (69, 3), (None, 1)]
melody(hn, 'brass', 32, theme, 0.8)
melody(tpt, 'brass', 40, [(n + 12 if n else None, L) for n, L in theme[:10]], 0.75)
roll_into(46, 48, 0.8)
# EGYPT 48-59: harmonic-minor colour, tenor drums, snake melody on violins
big_hit(48, 0.9, gong_too=False, ch=Dm)
drums(48, 59, 0.75, 'drive')
bassline(48, 59, [Dm, Eb, Dm, A_], 0.75)
ostinato(48, 59, [Dm, Eb, Dm, A_], 0.6, insts=(vla_sp,), octs=(1,))
snake = [(74, 1), (75, 0.5), (78, 0.5), (79, 1), (78, 0.5), (75, 0.5), (74, 2), (None, 0.5),
         (74, 0.5), (75, 1), (78, 1), (81, 1.5), (79, 0.5), (78, 1), (75, 1), (74, 2)]
melody(vln, 'str', 50, snake, 0.75)
# NILE 59-66: the triumph corrupts — low dissonant cluster, gong, timpani
gong.at('perc', 59, 1.0)
bd.at('perc', 59, 1.0)
for n in (38, 39, 50, 51):
    play(tbn, 'brass', 59, n + 12 if n < 45 else n, 0.8, 6)
play(tba, 'brass', 59, 26, 0.9, 6)
play(cb, 'str', 59, 26, 0.7, 7)
play(vc, 'str', 59, 39, 0.6, 7)
for b in (61, 62.5, 63, 64.5, 65, 65.5):
    timp_low.at('perc', b, 0.8)
timp_roll.at('perc', 64, 0.6, secs=2 * BEAT)
# BRUMAIRE 66-71: tense ostinato, snare, no brass
ostinato(66, 71, [Dm, Dm, Bb, A_], 0.7, div=4, insts=(vln_sp,), octs=(1,))
bassline(66, 71, [Dm, Dm, Bb, A_], 0.7)
for b in np.arange(66, 71, 0.5):
    snare.at('perc', b, 0.35 if (b * 2) % 2 else 0.55)
anvil.at('perc', 66, 0.6)
# MARENGO 71-76 burst
big_hit(71, 1.0, gong_too=False)
drums(71, 76, 0.9, 'war')
ostinato(71, 76, MIN2, 0.8, div=4)
bassline(71, 76, MIN2, 0.85)
stabs([71, 72.5, 73, 74.5, 75], Gm, 0.85)
# build to the coronation 76-82
pads(76, 82, [Bb, Gm, A_], 0.6)
roll_into(78, 82, 1.0)
play(hn, 'brass', 78, 69, 0.7, 4)
play(tpt, 'brass', 79, 81, 0.6, 3)
# CORONATION 82-84: near silence, a high glassy chord
play(vln, 'str', 82.35, 86, 0.25, 1.6)
play(vln, 'str', 82.35, 81, 0.25, 1.6)
play(piano, 'keys', 82.5, 86, 0.3, 1.5)
# CROWN_DROP 84-94: organ + brass fanfare in D major
gong.at('perc', 84, 1.0)
bd.at('perc', 84, 1.0)
timp_low.at('perc', 84, 1.0)
crash.at('perc', 84, 1.0)
for n in (50, 54, 57, 62, 66, 69):
    play(organ, 'keys', 84, n, 0.9, 8)
play(organ, 'keys', 92, 45, 0.8, 2)
play(organ, 'keys', 92, 57, 0.8, 2)
play(organ, 'keys', 92, 61, 0.8, 2)
fanfare = [(62, 0.5), (62, 0.5), (69, 1), (69, 0.5), (74, 1.5), (73, 0.5), (71, 0.5), (69, 1), (66, 1), (69, 2)]
melody(tpt, 'brass', 86, fanfare, 0.9)
melody(hn, 'brass', 86, [(n - 12, L) for n, L in fanfare], 0.8)
pads(84, 94, [DM, DM, G_, A_], 0.6)
for b in (86, 88, 90, 92, 93):
    timp_low.at('perc', b, 0.8)
# AUSTERLITZ 94-98: coalition hits
for b in (94, 94.4, 94.8, 95.2, 95.73):
    stabs([b], DARK[int((b - 94) * 2) % 4], 0.9)
    bd.at('perc', b, 0.9)
drums(96, 98, 0.7, 'march')
bassline(96, 98, [Dm], 0.7)
# the breath before the sun 98-102: fog (pp fifths), crescendo
play(cb, 'str', 98, 26, 0.35, 4)
play(vc, 'str', 98, 45, 0.3, 4)
play(vla, 'str', 98, 57, 0.3, 4)
play(vln, 'str', 99, 69, 0.3, 3)
play(vln, 'str', 100, 74, 0.4, 2)
roll_into(100, 102, 1.0)
# AUSTERLITZ_DROP 102-116: everything, D major
big_hit(102, 1.0, ch=DM)
drums(102, 116, 0.95, 'drive')
ostinato(102, 116, MAJ, 0.8, div=4)
bassline(102, 116, MAJ, 0.9)
pads(102, 116, MAJ, 0.55, sections=(vln, vla))
brass_chords(102, 116, MAJ, 0.7, rhythm=(0, 1.5, 3), length=1.2)
themeM = [(n + (4 if n in (65, 77) else 0) if n else None, L) for n, L in theme]  # major-mode variant
melody(hn, 'brass', 104, themeM, 0.9)
melody(tpt, 'brass', 104, [(n + 12 if n else None, L) for n, L in themeM], 0.8)
for n in (50, 54, 57, 62):
    play(organ, 'keys', 102, n, 0.7, 4)
# MASTER 116-132: aggressive minor drive, then the build to the peak
big_hit(116, 0.9, gong_too=False)
drums(116, 128, 0.9, 'war')
ostinato(116, 132, MIN2, 0.8, div=4)
bassline(116, 132, MIN2, 0.85)
brass_chords(116, 128, MIN2, 0.72, rhythm=(0, 0.75, 2, 2.75), length=0.6)
stabs([120, 124], Gm, 0.9)
bd.at('perc', 124, 1.0)
gong.at('perc', 124, 0.6)  # Eylau
roll_into(128, 132, 1.0)
for b, n in [(128, 57), (129, 60), (130, 62), (131, 66)]:
    chord(hn, 'brass', b, [n, n + 7], 0.8, 1)
# PEAK 132-140: the apex, D major, organ + full brass
big_hit(132, 1.0, ch=DM)
drums(132, 140, 1.0, 'drive')
ostinato(132, 140, MAJ, 0.85, div=4)
bassline(132, 140, MAJ, 0.95)
brass_chords(132, 140, MAJ, 0.85, rhythm=(0, 2), length=1.9)
for bar, ch in enumerate(MAJ * 2):
    for n in up(ch, 1):
        play(organ, 'keys', 132 + bar * 4 if bar < 2 else 132 + bar * 4, n, 0.6, 4) if bar < 2 else None
melody(tpt, 'brass', 132, [(n + 12 if n else None, L) for n, L in themeM[:10]], 0.9)
crash.at('perc', 136, 0.9)
# SPAIN 140-152: burnt, heavy minor
big_hit(140, 0.9, gong_too=False, ch=Dm)
drums(140, 152, 0.85, 'war')
ostinato(140, 152, DARK, 0.7, div=2)
bassline(140, 152, DARK, 0.85)
pads(140, 152, DARK, 0.5, sections=(vc, cb))
play(tbn, 'brass', 148, 50, 0.8, 1.5)  # Aspern rupture
play(tbn, 'brass', 148, 51, 0.8, 1.5)
anvil.at('perc', 148, 0.9)
roll_into(150, 152, 0.9)
# WAGRAM 152-160
big_hit(152, 1.0, ch=Dm)
drums(152, 158, 0.9, 'war')
ostinato(152, 160, MIN, 0.8, div=4)
bassline(152, 160, MIN, 0.9)
brass_chords(152, 158, MIN, 0.75, rhythm=(0, 1, 2.5), length=0.9)
pads(156, 160, [Bb], 0.5)  # the empire overheats: things thin out
# RUSSIA 160: break, low strings, cold
gong.at('perc', 160, 1.0)
bd.at('perc', 160, 1.0)
play(cb, 'str', 160, 26, 0.7, 10)
play(vc, 'str', 160, 38, 0.55, 10)
play(vln, 'str', 162, 86, 0.25, 8)
play(vln, 'str', 163, 81, 0.2, 7)
drums(162, 170, 0.6, 'march')
bassline(164, 170, [Dm, Dm, Bb, A_], 0.5)
# BORODINO 170-177: overload
big_hit(170, 1.0, ch=Dm)
drums(170, 177, 1.0, 'war')
for b in np.arange(170, 177, 0.25):
    timp_low.at('perc', b, 0.45 + 0.3 * rng.random()) if rng.random() < 0.4 else None
ostinato(170, 177, [Dm, Eb], 0.85, div=4)
bassline(170, 177, [Dm, Eb], 0.95, div=4)
stabs([170, 171.5, 172, 173.5, 174, 175.5, 176], Eb, 0.9)
# MOSCOW 177-182: stillness
play(cb, 'str', 177, 26, 0.35, 5)
play(vc, 'str', 177, 45, 0.3, 5)
for k, n in enumerate([74, 72, 69, 65]):
    play(piano, 'keys', 177.5 + k * 1.1, n, 0.35, 2)
# RETREAT 182-192: a single low boom, then a thin, descending lament
bd.at('perc', 182, 0.8)
gong.at('perc', 182, 0.5)
lament = [(74, 2), (72, 1), (70, 1), (69, 3), (None, 1), (67, 2), (65, 1), (64, 1), (62, 4)]
melody(vln, 'str', 183, lament, 0.4)
play(vc, 'str', 183, 38, 0.35, 8)
for k, n in enumerate([62, 58, 57, 50]):
    play(piano, 'keys', 184 + k * 2, n, 0.3, 3)
# LEIPZIG 192-204
drums(192, 196, 0.75, 'march')
roll_into(194, 196, 0.9)
bassline(192, 196, [Dm], 0.7)
big_hit(196, 1.0, ch=Dm)
drums(196, 204, 0.9, 'war')
ostinato(196, 204, DARK, 0.8, div=4)
bassline(196, 204, DARK, 0.9)
brass_chords(196, 204, DARK, 0.75, rhythm=(0, 1.5, 3), length=1.0)
# FRANCE 1814 204-212: hyperfast brilliance, then everything stops
ostinato(204, 212, MIN, 0.8, div=4, insts=(vln_sp, vla_sp, vc_sp), octs=(1, 1, 0))
bassline(204, 212, MIN, 0.8)
for b in (204 + 30 / 30, 204 + 66 / 30, 204 + 98 / 30, 204 + 126 / 30, 204 + 152 / 30):
    stabs([b], Dm, 0.8)
    bd.at('perc', b, 0.9)
drums(204, 211, 0.7, 'march')
gong.at('perc', 212, 0.8)
play(cb, 'str', 212, 26, 0.4, 3)
# ELBA 216-227: silence (ocean in the SFX layer); a lone piano note
play(piano, 'keys', 220, 62, 0.25, 4)
play(piano, 'keys', 223, 57, 0.2, 4)
# HUNDRED DAYS 227: one hit, then the return builds
big_hit(227, 1.0, gong_too=True, ch=Dm)
ostinato(229, 234, MIN, 0.7, div=4, insts=(vln_sp,), octs=(1,))
bassline(229, 234, MIN, 0.75)
drums(230, 232, 0.8, 'march')
roll_into(232, 234, 1.0)
play(hn, 'brass', 231, 62, 0.75, 3)
play(hn, 'brass', 231, 69, 0.75, 3)
# PARIS 1815 234-242: full energy restored (Austerlitz reprise)
big_hit(234, 1.0, ch=DM)
drums(234, 242, 1.0, 'drive')
ostinato(234, 242, MAJ, 0.85, div=4)
bassline(234, 242, MAJ, 0.95)
brass_chords(234, 242, MAJ, 0.8, rhythm=(0, 1.5, 3), length=1.2)
melody(hn, 'brass', 234, themeM[:10], 0.9)
melody(tpt, 'brass', 234, [(n + 12 if n else None, L) for n, L in themeM[:10]], 0.85)
for n in (50, 54, 57, 62):
    play(organ, 'keys', 234, n, 0.7, 4)
# WATERLOO 242-248: tension
for b in range(242, 248):
    timp_low.at('perc', b, 0.5 + (b - 242) * 0.08)
play(cb, 'str', 242, 26, 0.6, 6)
play(vc, 'str', 242, 38, 0.5, 6)
play(tbn, 'brass', 244, 50, 0.6, 4)
play(tbn, 'brass', 244, 51, 0.6, 4)
roll_into(245, 248, 1.0)
# WATERLOO_DROP 248-256
big_hit(248, 1.0, ch=Dm)
drums(248, 256, 1.0, 'war')
ostinato(248, 256, MIN2, 0.85, div=4)
bassline(248, 256, MIN2, 0.95)
brass_chords(248, 256, MIN2, 0.8, rhythm=(0, 0.75, 2, 2.75), length=0.6)
# CLIMAX 256-262: the Guard — the theme one last time, then the cut
big_hit(256, 1.0, ch=Dm)
drums(256, 262, 1.0, 'war')
ostinato(256, 262, MIN, 0.9, div=4)
bassline(256, 262, MIN, 1.0)
pads(256, 262, MIN, 0.65)
melody(hn, 'brass', 256, theme[:9], 1.0)
melody(tpt, 'brass', 256, [(n + 12 if n else None, L) for n, L in theme[:9]], 0.9)
for n in (50, 53, 57, 62):
    play(organ, 'keys', 256, n, 0.8, 6)
roll_into(260, 262, 1.0)
# FINAL_CUT 262: absolute silence (distant cannon lives in SFX)
# SAINT HELENA 266-286: piano alone, strings like mist
elegy = [(74, 2), (69, 1), (70, 1), (69, 2), (65, 2), (67, 1), (65, 1), (64, 2), (62, 4)]
melody(piano, 'keys', 268, elegy, 0.6)
for b, ch in [(268, [50, 57]), (272, [46, 53]), (276, [43, 50]), (280, [45, 52]), (283, [50, 57])]:
    for n in ch:
        play(piano, 'keys', b, n - 12, 0.25, 4)
play(vc, 'str', 268, 38, 0.2, 16)
play(vln, 'str', 272, 81, 0.15, 12)

# ---------------------------------------------------------------- mix
def reverb_ir(seconds, damp):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = np.stack([rng.normal(0, 1, n), rng.normal(0, 1, n)], 1) * np.exp(-t * damp)[:, None]
    sos = butter(2, 5000 / (SR / 2), 'low', output='sos')
    ir = sosfilt(sos, ir, axis=0)
    ir[: int(0.012 * SR)] = 0  # pre-delay
    return ir / np.sqrt((ir ** 2).sum() / 2)


def verb(x, ir, wet):
    y = np.stack([fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], 1)
    return x + y * wet


hall = reverb_ir(3.2, 2.2)
mix = (verb(BUS['str'], hall, 0.35) * 1.0 + verb(BUS['brass'], hall, 0.3) * 0.9 + verb(BUS['perc'], hall, 0.18) * 0.95
       + verb(BUS['keys'], hall, 0.35) * 0.9)

# section dynamics: Russia cold (low-pass), Nile muffled
def lowpass_region(x, b0, b1, f):
    i, j = int(T(b0) * SR), int(T(b1) * SR)
    sos = butter(2, f / (SR / 2), 'low', output='sos')
    x[i:j] = sosfilt(sos, x[i:j], axis=0)


lowpass_region(mix, 160, 170, 1800)
lowpass_region(mix, 182, 192, 2500)

# hard silences on the grid
for a, b in [(T(82), T(82) + 10 / 60), (T(102) - 2 / 60, T(102)), (T(212) + 2.0, T(216)), (T(262), T(266) + 1.0)]:
    i, j = int(a * SR), int(b * SR)
    f = int(0.01 * SR)
    mix[i:i + f] *= np.linspace(1, 0, f)[:, None]
    mix[i + f:j] = 0

# section volume shaping (dB) — the intensity curve of the edit
AUTO = [(0, -6), (15.9, -6), (16, 0), (58.9, 0), (59, -3), (66, -4), (70.9, -4), (71, 0), (81.9, 0), (84, 0), (93.9, -2),
        (98, -9), (101.9, -4), (102, 1), (131.9, 0), (132, 2), (139.9, 2), (140, -1), (159.9, 0), (160, -8), (169.9, -8),
        (170, 0), (176.9, 0), (177, -15), (181.9, -15), (182, -13), (191.9, -12), (192, -4), (195.9, -3), (196, 0),
        (211.9, 0), (212, -6), (216, -14), (226.9, -14), (227, 0), (233.9, -2), (234, 1), (241.9, 1), (242, -5),
        (247.9, -3), (248, 0), (255.9, 0), (256, 2), (262, 2), (266, 0), (286, -2)]
tb = np.array([T(b) for b, _ in AUTO]) * SR
gain = 10 ** (np.interp(np.arange(len(mix)), tb, [g for _, g in AUTO]) / 20)
peak0 = np.percentile(np.abs(mix), 99.9)
mix = mix * gain[:, None].astype(np.float32)

# gentle bus compression + limiter
mix = np.tanh(mix / (peak0 * 1.1)) * 0.92
mix /= np.abs(mix).max() / 0.95
fe = int(3 * SR)
mix[-fe:] *= np.linspace(1, 0, fe)[:, None]
out = os.path.join(ROOT, 'public', 'audio', 'main-track.wav')
sf.write(out, mix.astype(np.float32), SR, subtype='PCM_16')
print('wrote', out, round(len(mix) / SR, 1), 's')
