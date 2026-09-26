import io, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
from scipy import ndimage
rng = np.random.default_rng(1769)
SRC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets_src')
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


