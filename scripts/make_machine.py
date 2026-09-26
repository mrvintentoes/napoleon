#!/usr/bin/env python3
"""
MACHINE mix — cold, monumental, industrial-military score ("the war machine").

Mechanical ticking clock that accelerates into drops, rigid four-on-the-floor stomp,
marching snare, gated snare cracks, chugging distorted saw bass, metal clanks,
pistons, steam, electrical hum, Phrygian (D–Eb) harmony, organ + low-brass drones,
Shepard-tone tension. Orchestral layer = recorded VSCO 2 CE instruments.
Locked to the edit's 120 BPM grid and markers.

  VSCO=/path/to/VSCO-2-CE python3 scripts/make_machine.py -> public/audio/main-track.wav
"""
import os

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
_hyper_src = open(os.path.join(HERE, 'make_hyper.py')).read()
exec(_hyper_src[: _hyper_src.index('\n# ---------------------------------------------------------------- arrangement')])  # kit + sampler

# ---------------------------------------------------------------- machine kit
Ebm = [51, 54, 58]
PHRY = [Dm, Eb, Dm, Eb]
PHRY2 = [Dm, Eb, Bb, A_]
PHRY3 = [Dm, Dm, Eb, Dm]


def tick(b, vel=0.4, pitch=1.0):
    """clock tick: click + short metallic ping"""
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    x = bp(rng.normal(0, 1, n), 1200, 4500) * np.exp(-t * 300) + np.sin(2 * np.pi * 1350 * pitch * t) * np.exp(-t * 90) * 0.6
    put('fx', T(b), x * vel, 0.3)


def clock(b0, b1, div=2, vel=0.35, accel=False):
    b = b0
    k = 0
    while b < b1 - 1e-6:
        prog_ = (b - b0) / max(1e-6, b1 - b0)
        d = div if not accel else (div if prog_ < 0.5 else div * 2 if prog_ < 0.8 else div * 4)
        tick(b, vel * (1 if k % 2 == 0 else 0.7), 1.0 if k % 2 == 0 else 0.84)
        k += 1
        b += 1 / d


def metal(b, vel=0.6, base=180.0, pan=0.0, decay=1.2):
    """inharmonic struck metal (girder / anvil)"""
    n = int(decay * 1.5 * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * base * r * t + rng.random() * 6) * np.exp(-t * (1.5 + r) / decay) * a
            for r, a in [(1, 1), (2.76, 0.7), (5.4, 0.5), (8.93, 0.35), (13.3, 0.2)])
    x += hp(rng.normal(0, 1, n), 2000) * np.exp(-t * 60) * 0.6
    put('drums', T(b), np.tanh(x * 0.8) * vel * 0.5, pan)


def piston(b, vel=0.5):
    """pneumatic hiss + thud"""
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    x = bp(rng.normal(0, 1, n), 2500, 9000) * np.exp(-t * 14) * 0.5 + np.sin(2 * np.pi * 60 * t) * np.exp(-t * 25)
    put('drums', T(b), x * vel, -0.4)


def steam(b, secs=1.5, vel=0.3):
    n = int(secs * SR)
    t = np.arange(n) / SR
    x = bp(rng.normal(0, 1, n), 3000, 12000) * np.minimum(1, t / 0.05) * np.exp(-t * 2.2)
    put('fx', T(b), x * vel, 0.5)


def hum(b0, b1, vel=0.08):
    n = int((b1 - b0) * BEAT * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * 50 * k * t) / k for k in range(1, 8)) * vel
    x *= np.minimum(1, t / 0.5) * np.minimum(1, (t[-1] - t) / 0.5 + 1e-9)
    put('fx', T(b0), x)


def snare_gated(b, vel=0.8):
    """80s-style gated industrial snare"""
    n = int(0.28 * SR)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 25)
    noise = bp(rng.normal(0, 1, n), 800, 9000)
    gate = (t < 0.2).astype(float) * np.exp(-t * 3)
    x = np.tanh((body * 0.8 + noise * gate) * 2) * vel * 0.55
    put('drums', T(b), x)
    snare.at('perc', b, vel * 0.4)


def chug(b, midi, L=0.5, vel=0.8):
    """palm-muted distorted saw 'guitar' bass"""
    n = int((L * BEAT) * SR)
    t = np.arange(n) / SR
    f = hz(midi)
    x = sum(2 * ((t * f * d + rng.random()) % 1) - 1 for d in (0.995, 1.0, 1.005, 2.0))
    x = np.tanh(x * 4) * np.exp(-t * 9) * np.minimum(1, t / 0.002)
    x = lp(x, 1800)
    put('bass', T(b), x * vel * 0.45)


def chug_line(b0, b1, prog, pattern='eighths', vel=0.8):
    b = b0
    while b < b1 - 1e-6:
        ch = prog[int((b - b0) // 4) % len(prog)]
        root = ch[0] - 24
        steps = {'eighths': [(i * 0.5, 0.45) for i in range(8)],
                 'gallop': [(0, 0.45), (0.5, 0.2), (0.75, 0.2), (1, 0.45), (1.5, 0.2), (1.75, 0.2), (2, 0.45), (2.5, 0.2), (2.75, 0.2), (3, 0.45), (3.5, 0.45)],
                 'rammstein': [(0, 0.45), (0.75, 0.2), (1, 0.45), (2, 0.45), (2.75, 0.2), (3, 0.45)]}[pattern]
        for k, L in steps:
            if b + k < b1:
                chug(b + k, root, L, vel)
                bass808(b + k, root, L * 0.9, vel * 0.5)
        b += 4


def march(b0, b1, style='stomp', vel=1.0, metal_on=True):
    b = b0
    k = 0
    while b < b1 - 1e-6:
        pos = k % 16  # 16ths
        if style == 'stomp':
            if pos % 4 == 0:
                kick(b, vel, dist=4)
            if pos in (4, 12):
                snare_gated(b, vel)
            if pos in (2, 10) and metal_on:
                metal(b, vel * 0.5, base=210, pan=0.4, decay=0.4)
            if pos in (14,):
                piston(b, vel * 0.6)
            if pos % 2 == 1:
                hat(b, 0.06 * vel)
        elif style == 'march':
            if pos in (0, 8):
                kick(b, vel, dist=3)
            snare.at('perc', b, vel * (0.55 if pos % 4 == 0 else 0.3 if pos % 2 == 0 else 0.18))
            if pos == 12:
                snare_gated(b, vel * 0.9)
        elif style == 'engine':  # double-time machine
            if pos % 2 == 0:
                kick(b, vel * (1 if pos % 4 == 0 else 0.75), dist=4)
            if pos in (4, 12):
                snare_gated(b, vel)
            if metal_on and pos in (3, 7, 11, 15):
                metal(b, vel * 0.4, base=260 if pos < 8 else 190, pan=-0.4 if pos < 8 else 0.4, decay=0.3)
            hat(b, 0.05 * vel)
        k += 1
        b += 0.25


def drone(b0, b1, notes=(26, 38, 50), vel=0.7, organ_too=True):
    for n in notes:
        play(cb if n < 40 else vc, 'str', b0, n, vel * 0.8, b1 - b0)
    play(tba, 'brass', b0, notes[0] + 12, vel * 0.7, b1 - b0)
    play(tbn, 'brass', b0, notes[1], vel * 0.6, b1 - b0)
    if organ_too:
        for n in notes:
            play(organ, 'keys', b0, n + 12, vel * 0.7, b1 - b0)


def shepard(b0, b1, vel=0.35):
    """endlessly rising tone — tension"""
    L = (b1 - b0) * BEAT
    n = int(L * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for k in range(6):
        oct_ = (k + t / L * 2) % 6
        f = 55 * 2 ** oct_
        amp = np.exp(-((oct_ - 3) ** 2) / 2.5)
        x += np.sin(2 * np.pi * np.cumsum(f) / SR) * amp
    x *= np.minimum(1, t / 0.4) * (0.4 + 0.6 * t / L)
    put('music', T(b0), x / 4 * vel)


def motif(b0, notes, inst=hn, vel=0.8, bus='brass'):
    """the machine's theme: Phrygian cell"""
    melody(inst, bus, b0, notes, vel)


CELL = [(62, 1), (63, 1), (62, 0.5), (57, 1.5)]              # D Eb D A
CELL2 = [(62, 0.5), (63, 0.5), (65, 0.5), (63, 0.5), (62, 2)]  # D Eb F Eb D
BIG = [(50, 2), (51, 2), (50, 1), (46, 1), (45, 2)]           # low brass hymn

# ---------------------------------------------------------------- arrangement
hum(0, 262, 0.05)
# PROLOGUE 0-16: the machine wakes: clock, hum, drone, steam, pistons
clock(0, 12, 1, 0.3)
clock(12, 16, 2, 0.45, accel=True)
play(cb, 'str', 0.5, 26, 0.45, 15)
play(vc, 'str', 4, 38, 0.35, 12)
play(vc, 'str', 8, 39, 0.25, 8)  # the Eb rub
for bb in (3, 7, 9, 11):
    steam(bb, 1.2, 0.2)
for bb in (6, 8, 10, 11, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.25, 15.5, 15.75):
    piston(bb, 0.3 + (bb - 6) * 0.04)
for bb, n in [(2, 74), (5, 75), (9, 74), (10.5, 69)]:
    play(piano, 'keys', bb, n, 0.35, 2)
shepard(12, 16, 0.35)
riser(13, 16, 0.5)
# TOULON 16-24
impact(16)
orch_hit(16, Dm)
march(16, 24, 'stomp')
chug_line(16, 24, PHRY, 'rammstein')
motif(18, CELL, hn, 0.85)
motif(22, CELL, tbn, 0.85)
# ITALY 24-48: the engine runs
impact(24, 0.8)
march(24, 40, 'engine')
chug_line(24, 40, PHRY2, 'gallop')
clock(24, 40, 4, 0.18)
motif(28, CELL2, hn, 0.8)
motif(32, [(n - 12, L) for n, L in CELL] + [(None, 1)] + [(n - 12, L) for n, L in CELL2], tbn, 0.85)
motif(36, CELL2, tpt, 0.7)
march(40, 46, 'stomp')
chug_line(40, 46, PHRY, 'eighths')
drone(40, 46, (26, 38, 50), 0.5, organ_too=False)
clock(44, 48, 2, 0.4, accel=True)
shepard(44, 48, 0.3)
riser(46, 48, 0.6)
# EGYPT 48-59: mysterious — hand-drum machine, Phrygian dominant line
impact(48, 0.9)
march(48, 59, 'march')
chug_line(48, 59, [Dm, Eb], 'rammstein', 0.7)
melody(vln, 'str', 50, [(74, 1), (75, 0.5), (78, 0.5), (79, 1), (78, 0.5), (75, 0.5), (74, 2)], 0.6)
for bb in np.arange(48, 59, 1):
    tenor.at('perc', bb + 0.5, 0.5)
# NILE 59-66: the machine breaks — crushed, grinding
impact(59, 1.0)
orch_hit(59, Eb, 1.0)
drone(59, 66, (27, 39, 51), 0.7)
for bb in np.arange(60, 66, 0.75):
    metal(bb, 0.6, base=120 + 40 * rng.random(), pan=rng.random() - 0.5, decay=1.5)
# BRUMAIRE 66-71: the clock runs the state
clock(66, 71, 4, 0.4)
for bb in np.arange(66, 71, 1):
    chug(bb, 26, 0.3, 0.7)
    piston(bb + 0.5, 0.4)
# MARENGO 71-76
impact(71)
orch_hit(71, Gm)
march(71, 76, 'engine')
chug_line(71, 76, [Gm, A_], 'gallop')
clock(76, 82, 2, 0.4, accel=True)
shepard(76, 82, 0.4)
riser(78, 82, 0.7)
drone(76, 82, (26, 38, 50), 0.5, organ_too=False)
# CORONATION
silence(82, 84)
tick(82.3, 0.5)
impact(84, 1.0)
orch_hit(84, Dm, 1.0)
for n in (26, 38, 50, 53, 57, 62):
    play(organ, 'keys', 84, n + (12 if n < 36 else 0), 0.95, 10)
motif(86, BIG, tbn, 0.9)
motif(86, [(n - 12, L) for n, L in BIG], tba, 0.9)
march(86, 94, 'march', 0.9)
chug_line(88, 94, [Dm, Dm, Eb, Dm], 'rammstein', 0.7)
# AUSTERLITZ 94-102
for bb in (94, 94.4, 94.8, 95.2, 95.73):
    orch_hit(bb, Eb if bb > 95 else Dm, 0.9)
    metal(bb, 0.7, base=200, decay=0.8)
clock(96, 102, 1, 0.45)
clock(99, 102, 4, 0.3, accel=True)
drone(96, 102, (26, 38), 0.4, organ_too=False)
shepard(98, 102, 0.45)
riser(99, 102, 0.8)
tapestop(101.5, 102)
# AUSTERLITZ_DROP 102-116: full machine
impact(102, 1.0)
orch_hit(102, Dm, 1.0)
march(102, 116, 'engine')
chug_line(102, 116, PHRY2, 'gallop', 0.9)
clock(102, 116, 4, 0.16)
motif(104, [(n - 12, L) for n, L in CELL + CELL2], tbn, 0.95)
motif(104, CELL + CELL2, hn, 0.9)
for n in (26, 38, 50, 53):
    play(organ, 'keys', 102, n + 12, 0.8, 6)
motif(110, BIG, tba, 0.85)
stutter(115.5, 116, 0.0625)
# MASTER 116-132
impact(116, 0.8)
march(116, 128, 'stomp')
chug_line(116, 128, PHRY3, 'rammstein')
motif(118, CELL, hn, 0.85)
motif(122, CELL2, tbn, 0.85)
gong.at('perc', 124, 0.7)
clock(128, 132, 2, 0.45, accel=True)
shepard(128, 132, 0.45)
riser(128, 132, 0.8)
drone(128, 132, (26, 38, 50), 0.6)
# PEAK 132-140: the monument
impact(132, 1.0)
orch_hit(132, Dm, 1.0)
march(132, 140, 'engine')
chug_line(132, 140, PHRY2, 'gallop', 1.0)
for n in (26, 38, 50, 53, 57):
    play(organ, 'keys', 132, n + 12, 0.85, 8)
motif(132, BIG, tbn, 1.0)
motif(132, [(n - 12, L) for n, L in BIG], tba, 1.0)
motif(134, CELL2, tpt, 0.75)
# SPAIN / WAGRAM 140-160
impact(140, 0.8)
march(140, 150, 'stomp')
chug_line(140, 150, [Dm, Eb, Bb, A_], 'rammstein')
metal(148, 1.0, base=150, decay=2)
riser(150, 152, 0.6)
impact(152, 1.0)
orch_hit(152, Dm, 1.0)
march(152, 158, 'engine')
chug_line(152, 158, PHRY, 'gallop')
tapestop(158, 160)
# RUSSIA 160-177: frozen machinery, then Borodino
impact(160, 0.9)
drone(160, 170, (26, 27, 38), 0.55, organ_too=False)
clock(160, 170, 1, 0.3)
for bb in np.arange(162, 170, 2):
    kick(bb, 0.6, dist=2)
    metal(bb + 1, 0.35, base=140, decay=2.0)
impact(170, 1.0)
orch_hit(170, Dm, 1.0)
march(170, 177, 'engine', 1.0)
chug_line(170, 177, [Dm, Eb], 'gallop', 1.0)
for bb in np.arange(170, 177, 0.5):
    if rng.random() < 0.5:
        metal(bb, 0.5, base=100 + 200 * rng.random(), pan=rng.random() - 0.5, decay=0.5)
stutter(176.5, 177, 0.0625)
# MOSCOW 177-182: the machine stops; only the clock
clock(177, 182, 1, 0.25)
for k, n in enumerate([74, 72, 69, 63]):
    play(piano, 'keys', 177.5 + k * 1.1, n, 0.4, 2)
play(cb, 'str', 177, 26, 0.3, 5)
# RETREAT 182-192: clock slowing, wind of steam
downlifter(182, 3, 0.5)
for i, bb in enumerate([182, 183.2, 184.6, 186.2, 188, 190]):
    tick(bb, 0.35 - i * 0.04, 0.8)
steam(183, 4, 0.2)
melody(vln, 'str', 183, [(74, 2), (75, 1), (74, 1), (70, 3), (None, 1), (69, 2), (67, 1), (63, 1), (62, 2)], 0.35)
play(vc, 'str', 183, 38, 0.3, 9)
# LEIPZIG 192-212
march(192, 194, 'march', 0.7)
clock(192, 196, 2, 0.45, accel=True)
riser(194, 196, 0.8)
impact(196, 1.0)
orch_hit(196, Dm, 1.0)
march(196, 204, 'stomp')
chug_line(196, 204, [Dm, Eb, Bb, A_], 'rammstein')
motif(198, BIG, tbn, 0.9)
march(204, 211.5, 'engine')
chug_line(204, 211.5, PHRY, 'gallop')
clock(204, 212, 4, 0.2)
stutter(211.5, 212, 0.0625)
# PARIS FALLS 212 → ELBA: one clang, then only the sea (SFX)
metal(212, 1.0, base=110, decay=3)
impact(212, 0.6)
tick(220, 0.3)
tick(222, 0.3)
tick(224, 0.35)
tick(225, 0.4)
tick(225.5, 0.45)
tick(226, 0.5)
tick(226.25, 0.55)
tick(226.5, 0.6)
tick(226.75, 0.65)
# HUNDRED DAYS 227: the machine restarts
impact(227, 1.0)
orch_hit(227, Dm, 1.0)
for bb in np.arange(228, 232, 1):
    kick(bb, 0.6 + (bb - 228) * 0.1, dist=3)
    piston(bb + 0.5, 0.5)
clock(229, 234, 2, 0.45, accel=True)
shepard(230, 234, 0.45)
riser(232, 234, 0.9)
impact(234, 1.0)
orch_hit(234, Dm, 1.0)
march(234, 242, 'engine')
chug_line(234, 242, PHRY2, 'gallop', 1.0)
motif(236, CELL + CELL2, hn, 0.95)
for n in (26, 38, 50, 53):
    play(organ, 'keys', 234, n + 12, 0.8, 8)
# WATERLOO 242-262
clock(242, 248, 2, 0.4, accel=True)
drone(242, 248, (26, 27, 38), 0.5)
for bb in range(242, 248):
    kick(bb, 0.5 + (bb - 242) * 0.08, dist=3)
shepard(244, 248, 0.45)
riser(245, 248, 0.9)
impact(248, 1.0)
orch_hit(248, Dm, 1.0)
march(248, 256, 'stomp', 1.0)
chug_line(248, 256, [Dm, Eb, Bb, A_], 'rammstein', 1.0)
motif(250, BIG, tbn, 1.0)
impact(256, 1.0)
orch_hit(256, Dm, 1.0)
march(256, 262, 'engine', 1.0)
chug_line(256, 262, PHRY, 'gallop', 1.0)
for n in (26, 38, 50, 53, 57):
    play(organ, 'keys', 256, n + 12, 0.9, 6)
motif(256, [(n - 12, L) for n, L in CELL + CELL2], tbn, 1.0)
motif(256, CELL + CELL2, hn, 1.0)
stutter(261.5, 262, 0.03125)
silence(262, 266.5)
# SAINT HELENA 266-286: a music box clock winding down
elegy = [(74, 2), (69, 1), (70, 1), (69, 2), (63, 2), (65, 1), (63, 1), (62, 2), (62, 4)]
melody(piano, 'keys', 268, elegy, 0.6)
for bb, chn in [(268, [50, 57]), (272, [51, 58]), (276, [50, 57]), (280, [46, 53]), (283, [50, 57])]:
    for n in chn:
        play(piano, 'keys', bb, n - 12, 0.3, 4)
for i, bb in enumerate(np.arange(268, 284, 1.0)):
    tick(bb + i * 0.04, 0.25 - i * 0.012, 0.9)
play(vc, 'str', 268, 38, 0.2, 16)

# ---------------------------------------------------------------- mix (colder, darker than HYPER)
_mix_src = _hyper_src[_hyper_src.index('\n# ---------------------------------------------------------------- mix'):]
_mix_src = _mix_src.replace("hall = reverb_ir(2.5, 2.6)", "hall = reverb_ir(4.5, 1.4)")  # cavernous, cold
_mix_src = _mix_src.replace("crush(59, 66, 6, 3, 4000)\ncrush(160, 170, 5, 4, 2500)\ncrush(182, 192, 7, 2, 2000)",
                            "crush(59, 66, 7, 2, 3500)\ncrush(160, 170, 6, 3, 2200)\ncrush(182, 192, 8, 2, 2000)")
_mix_src = _mix_src.replace("mix = drive_(E['kick'], 1.6) * 1.1", "mix = drive_(E['kick'], 2.2) * 1.15")
E['drums'] = lp(E['drums'], 5500)
E['fx'] = lp(E['fx'], 6000)
_mix_src = _mix_src.replace("# master: glue saturation + limiter", "mix = lp(mix, 6500) * 0.85 + lp(mix, 250) * 0.4  # cold, heavy tone\n# master: glue saturation + limiter")
exec(_mix_src)
