#!/usr/bin/env python3
"""
Asset preprocessing for the Napoleon edit.

Reads source paintings from assets_src/ and writes render-ready assets to public/:
  public/images/   upscaled paintings, deep-fried / halftone variants
  public/images/cut/  alpha cutouts (foreground layers), clean plates, silhouettes
  public/textures/ film grain frames, parchment, smoke sprites, cracks, scratches

Run:  python3 scripts/prepare_assets.py
Needs: pillow numpy scipy   (+ rembg for the cutout step; cached *_cut_raw.png are reused)
"""
import io
import os
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets_src")
IMG = os.path.join(ROOT, "public", "images")
CUT = os.path.join(IMG, "cut")
TEX = os.path.join(ROOT, "public", "textures")
for d in (IMG, CUT, TEX):
    os.makedirs(d, exist_ok=True)

rng = np.random.default_rng(1769)
random.seed(1821)

# ---------------------------------------------------------------- helpers

def upscale(im: Image.Image, factor: float) -> Image.Image:
    w, h = im.size
    out = im.resize((int(w * factor), int(h * factor)), Image.LANCZOS)
    if out.mode == "RGB":
        out = out.filter(ImageFilter.UnsharpMask(radius=2.2, percent=70, threshold=2))
    return out


def ensure_cut(name: str) -> Image.Image:
    raw = os.path.join(SRC, f"{name}_cut_raw.png")
    if not os.path.exists(raw):
        from rembg import new_session, remove  # lazy: only needed once

        s = new_session("isnet-general-use")
        remove(Image.open(os.path.join(SRC, f"{name}.png")), session=s).save(raw)
    return Image.open(raw).convert("RGBA")


def refine_alpha(cut: Image.Image, lo=55, hi=150, keep_x=None, fill_holes=True) -> Image.Image:
    a = np.asarray(cut.split()[-1]).astype(np.float32)
    a = np.clip((a - lo) / (hi - lo), 0, 1)
    if keep_x is not None:
        x0, x1 = keep_x
        W = a.shape[1]
        cols = np.arange(W) / W
        a[:, (cols < x0) | (cols > x1)] = 0
    if fill_holes:
        solid = ndimage.binary_fill_holes(a > 0.5)
        a = np.maximum(a, solid.astype(np.float32) * 0.999)
        # keep only the largest connected components (drop speckles)
        lab, n = ndimage.label(a > 0.2)
        if n > 1:
            sizes = ndimage.sum(np.ones_like(a), lab, range(1, n + 1))
            keep = np.zeros(n + 1, bool)
            keep[1:] = sizes >= max(sizes.max() * 0.04, 400)
            a = a * keep[lab]
    a = ndimage.gaussian_filter(a, 0.8)
    out = cut.copy()
    out.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
    return out


def clean_plate(img: Image.Image, cut: Image.Image, grow=18) -> Image.Image:
    """Crude inpaint: normalized convolution fill of the masked figure so parallax can reveal 'behind'."""
    rgb = np.asarray(img).astype(np.float32) / 255
    m = np.asarray(cut.split()[-1]) > 40
    m = ndimage.binary_dilation(m, iterations=grow)
    valid = (~m).astype(np.float32)
    out = rgb.copy()
    for sigma in (6, 14, 30, 60, 120):
        num = np.stack([ndimage.gaussian_filter(rgb[..., c] * valid, sigma) for c in range(3)], -1)
        den = ndimage.gaussian_filter(valid, sigma)[..., None] + 1e-6
        fill = num / den
        mm = m[..., None]
        out = np.where(mm & (den > 0.02), fill, out)
        valid = np.maximum(valid, (den[..., 0] > 0.02).astype(np.float32) * 0.5)
    # add grain back so the fill isn't plasticky
    out += rng.normal(0, 0.018, out.shape)
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8))


def silhouette(cut: Image.Image, color=(0, 0, 0)) -> Image.Image:
    a = cut.split()[-1]
    s = Image.new("RGBA", cut.size, color + (0,))
    s.putalpha(a)
    return s


def deep_fry(im: Image.Image, passes=3) -> Image.Image:
    out = im.convert("RGB")
    out = ImageEnhance.Contrast(out).enhance(1.9)
    out = ImageEnhance.Color(out).enhance(2.6)
    out = ImageEnhance.Sharpness(out).enhance(4.0)
    for q in [9, 6, 12][:passes]:
        buf = io.BytesIO()
        out.save(buf, "JPEG", quality=q)
        out = Image.open(io.BytesIO(buf.getvalue())).convert("RGB")
        out = ImageEnhance.Sharpness(out).enhance(2.0)
    return out


def halftone(im: Image.Image, cell=9, ink=(18, 12, 10), paper=(236, 222, 196)) -> Image.Image:
    g = np.asarray(ImageOps.grayscale(im)).astype(np.float32) / 255
    H, W = g.shape
    S = 3  # supersample
    out = Image.new("RGB", (W * S // 1, H * S // 1), paper)
    d = ImageDraw.Draw(out)
    for yy in range(0, H, cell):
        off = (cell // 2) if (yy // cell) % 2 else 0
        for xx in range(-off, W, cell):
            cx, cy = min(max(xx + cell // 2, 0), W - 1), min(yy + cell // 2, H - 1)
            v = 1 - g[cy, cx]
            r = (cell * 0.72) * np.sqrt(v) * S
            if r > 0.4:
                d.ellipse([cx * S - r, cy * S - r, cx * S + r, cy * S + r], fill=ink)
    return out.resize((W, H), Image.LANCZOS)


def save_jpg(im, path, q=90):
    im.convert("RGB").save(path, "JPEG", quality=q, optimize=True)


# ---------------------------------------------------------------- paintings

PAINTINGS = {
    # name: upscale factor
    "gros_first_consul": 2.2,
    "gros_pyramids_harangue": 1.8,
    "watteau_battle_pyramids": 1.25,
    "map_europe_1812_ru": 1.6,
}

for name, f in PAINTINGS.items():
    src = Image.open(os.path.join(SRC, f"{name}.png")).convert("RGB")
    up = upscale(src, f)
    save_jpg(up, os.path.join(IMG, f"{name}.jpg"))
    print("painting", name, up.size)

# ---------------------------------------------------------------- cutouts

def build_cut(name, f, keep_x=None, variant="", **kw):
    src = Image.open(os.path.join(SRC, f"{name}.png")).convert("RGB")
    cut = refine_alpha(ensure_cut(name), keep_x=keep_x, **kw)
    up = cut.resize((int(cut.width * f), int(cut.height * f)), Image.LANCZOS)
    tag = f"{name}{variant}"
    up.save(os.path.join(CUT, f"{tag}_fg.png"), optimize=True)
    silhouette(up).save(os.path.join(CUT, f"{tag}_sil.png"), optimize=True)
    silhouette(up, (255, 244, 225)).save(os.path.join(CUT, f"{tag}_sil_white.png"), optimize=True)
    if not variant:
        plate = upscale(clean_plate(src, cut), f)
        save_jpg(plate, os.path.join(CUT, f"{tag}_plate.jpg"))
    print("cut", tag, up.size)
    return up


build_cut("gros_first_consul", 2.2)
build_cut("gros_first_consul", 2.2, keep_x=(0.0, 0.625), variant="_rider")
build_cut("gros_pyramids_harangue", 1.8)
build_cut("gros_pyramids_harangue", 1.8, keep_x=(0.255, 1.0), variant="_napoleon")

# tricolour flag from the Watteau
wcut = ensure_cut("watteau_battle_pyramids")
flag = refine_alpha(wcut, lo=70, hi=170)
bbox = flag.getbbox()
flag = flag.crop(bbox)
flag = flag.resize((flag.width * 2, flag.height * 2), Image.LANCZOS)
flag.save(os.path.join(CUT, "watteau_flag_fg.png"))
print("flag", flag.size)

# ---------------------------------------------------------------- treatments

gfc = Image.open(os.path.join(IMG, "gros_first_consul.jpg"))
gph = Image.open(os.path.join(IMG, "gros_pyramids_harangue.jpg"))
wbp = Image.open(os.path.join(IMG, "watteau_battle_pyramids.jpg"))
save_jpg(deep_fry(gfc), os.path.join(IMG, "gros_first_consul_fried.jpg"), 92)
save_jpg(deep_fry(gph), os.path.join(IMG, "gros_pyramids_harangue_fried.jpg"), 92)
save_jpg(deep_fry(wbp, 2), os.path.join(IMG, "watteau_battle_pyramids_fried.jpg"), 92)
save_jpg(halftone(gfc.resize((gfc.width // 2, gfc.height // 2)), 7), os.path.join(IMG, "gros_first_consul_halftone.jpg"))
save_jpg(halftone(gph.resize((gph.width // 2, gph.height // 2)), 7, ink=(20, 14, 40), paper=(230, 214, 170)),
         os.path.join(IMG, "gros_pyramids_harangue_halftone.jpg"))
print("treatments done")

# ---------------------------------------------------------------- textures

def fractal_noise(h, w, octaves=6, persistence=0.55, base=4):
    out = np.zeros((h, w), np.float32)
    amp, tot = 1.0, 0.0
    for o in range(octaves):
        n = base * 2 ** o
        small = rng.random((n + 1, int(n * w / h) + 2)).astype(np.float32)
        layer = np.asarray(Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)).astype(np.float32) / 255
        out += layer * amp
        tot += amp
        amp *= persistence
    return out / tot


# film grain: 8 frames, mid-grey centred, used with mix-blend overlay
for i in range(8):
    g = rng.normal(128, 38, (960, 540)).clip(0, 255).astype(np.uint8)
    im = Image.fromarray(g).filter(ImageFilter.GaussianBlur(0.55))
    im.save(os.path.join(TEX, f"grain_{i}.png"), optimize=True)

# parchment
n = fractal_noise(1920, 1080, 7)
stain = fractal_noise(1920, 1080, 3, base=2)
base = np.array([226, 206, 164], np.float32) / 255
dark = np.array([150, 112, 66], np.float32) / 255
t = np.clip(0.55 * n + 0.6 * (stain - 0.35), 0, 1)[..., None]
yy, xx = np.mgrid[0:1920, 0:1080]
vig = (((xx - 540) / 540) ** 2 + ((yy - 960) / 960) ** 2)[..., None]
col = base * (1 - t * 0.55) + dark * t * 0.55
col = col * (1 - 0.35 * np.clip(vig - 0.3, 0, 1))
fibers = rng.normal(0, 0.025, (1920, 1080, 1))
Image.fromarray((np.clip(col + fibers, 0, 1) * 255).astype(np.uint8)).save(os.path.join(TEX, "parchment.jpg"), quality=88)

# smoke sprites
for i in range(4):
    S = 768
    nn = fractal_noise(S, S, 6, 0.6, base=3)
    yy, xx = np.mgrid[0:S, 0:S]
    r = np.sqrt((xx - S / 2) ** 2 + (yy - S / 2) ** 2) / (S / 2)
    fall = np.clip(1 - r, 0, 1) ** 1.6
    a = np.clip((nn - 0.35) * 2.4, 0, 1) * fall
    a = ndimage.gaussian_filter(a, 3)
    rgba = np.zeros((S, S, 4), np.uint8)
    rgba[..., :3] = (215 + 25 * nn[..., None]).clip(0, 255).astype(np.uint8)
    rgba[..., 3] = (a * 255).astype(np.uint8)
    Image.fromarray(rgba).save(os.path.join(TEX, f"smoke_{i}.png"), optimize=True)

# long fog strip
nn = fractal_noise(512, 2048, 6, 0.6, base=2)
a = np.clip((nn - 0.3) * 1.8, 0, 1)
yy = np.linspace(-1, 1, 512)[:, None]
a *= np.clip(1 - np.abs(yy) ** 2, 0, 1)
rgba = np.zeros((512, 2048, 4), np.uint8)
rgba[..., :3] = 235
rgba[..., 3] = (a * 255).astype(np.uint8)
Image.fromarray(rgba).save(os.path.join(TEX, "fog_strip.png"), optimize=True)


# cracks (transparent PNG, white lines) — used for the fracturing eagle / map 1812+
def crack_layer(seed, W=1080, H=1920, n=7):
    r = random.Random(seed)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    def branch(x, y, ang, length, width, depth):
        pts = [(x, y)]
        for _ in range(int(length / 14)):
            ang += r.uniform(-0.45, 0.45)
            x += np.cos(ang) * 14
            y += np.sin(ang) * 14
            pts.append((x, y))
            if depth < 3 and r.random() < 0.05:
                branch(x, y, ang + r.choice([-1, 1]) * r.uniform(0.5, 1.2), length * 0.45, max(1, width - 1), depth + 1)
        d.line(pts, fill=(255, 250, 240, 235), width=width, joint="curve")

    cx, cy = W * r.uniform(0.35, 0.65), H * r.uniform(0.4, 0.6)
    for k in range(n):
        a0 = k / n * 2 * np.pi + r.uniform(-0.3, 0.3)
        branch(cx, cy, a0, r.uniform(500, 1100), 4, 0)
    return im


for i in range(2):
    crack_layer(10 + i).save(os.path.join(TEX, f"cracks_{i}.png"), optimize=True)

# film scratches/dust, 4 frames
for i in range(4):
    im = Image.new("RGBA", (540, 960), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for _ in range(random.randint(1, 3)):
        x = random.uniform(0, 540)
        d.line([(x, 0), (x + random.uniform(-15, 15), 960)], fill=(255, 255, 240, random.randint(60, 140)), width=1)
    for _ in range(40):
        x, y, s = random.uniform(0, 540), random.uniform(0, 960), random.uniform(0.6, 2.8)
        c = random.choice([(255, 255, 245), (10, 8, 6)])
        d.ellipse([x - s, y - s, x + s, y + s], fill=c + (random.randint(90, 200),))
    im.save(os.path.join(TEX, f"dust_{i}.png"), optimize=True)

print("textures done")

# ---------------------------------------------------------------- metadata for the TS side
import json

meta = {}
for folder, prefix in ((IMG, "images/"), (CUT, "images/cut/")):
    for fn in sorted(os.listdir(folder)):
        p = os.path.join(folder, fn)
        if not os.path.isfile(p) or not fn.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            continue
        im = Image.open(p)
        entry = {"w": im.width, "h": im.height}
        if im.mode == "RGBA":
            bb = im.split()[-1].point(lambda v: 255 if v > 60 else 0).getbbox()
            if bb:
                entry["bbox"] = list(bb)
        meta[prefix + fn] = entry
out = os.path.join(ROOT, "src", "data", "imagemeta.generated.json")
with open(out, "w") as fh:
    json.dump(meta, fh, indent=1)
print("wrote", out, len(meta), "entries")
