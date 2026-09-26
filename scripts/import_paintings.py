#!/usr/bin/env python3
"""
Imports the public-domain paintings in assets_src/commons/ into public/images/
(resized, sharpened) and builds Napoleon cutouts + clean plates for the ones used
as 2.5D parallax layers.   python3 scripts/import_paintings.py && npm run scan
"""
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, os.path.dirname(__file__))
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets_src', 'commons')
IMG = os.path.join(ROOT, 'public', 'images')
CUT = os.path.join(IMG, 'cut')
os.makedirs(CUT, exist_ok=True)

LONG = 2400  # max long edge written to public/

# slot -> crop box (normalized) used when isolating Napoleon; None = no cutout
CUTOUTS = {
    'napoleon_toulon': (0.0, 0.0, 0.62, 1.0),
    'napoleon_alps_david': (0.0, 0.0, 1.0, 1.0),
    'napoleon_throne_ingres': (0.0, 0.0, 1.0, 1.0),
    'napoleon_study_david': (0.3, 0.0, 0.75, 1.0),
    'fontainebleau_delaroche': (0.0, 0.0, 1.0, 1.0),
    'moscow_fire': (0.25, 0.28, 0.53, 0.8),
    'napoleon_elba': (0.5, 0.2, 0.72, 0.95),
}


def resized(im):
    w, h = im.size
    s = LONG / max(w, h)
    if s < 1:
        im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
    elif s > 1.05:
        im = im.resize((round(w * min(s, 2.2)), round(h * min(s, 2.2))), Image.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    return im


def main():
    from prepare_assets_lib import refine_alpha, clean_plate, silhouette  # noqa

    session = None
    for fn in sorted(os.listdir(SRC)):
        if not fn.endswith('.jpg'):
            continue
        slot = fn[:-4]
        im = resized(Image.open(os.path.join(SRC, fn)).convert('RGB'))
        im.save(os.path.join(IMG, slot + '.jpg'), quality=90, optimize=True)
        print('img', slot, im.size, flush=True)
        box = CUTOUTS.get(slot)
        if not box:
            continue
        raw = os.path.join(SRC, slot + '_cut_raw.png')
        W, H = im.size
        if not os.path.exists(raw):
            from rembg import new_session, remove
            session = session or new_session('isnet-general-use')
            x0, y0, x1, y1 = int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H)
            part = remove(im.crop((x0, y0, x1, y1)), session=session)
            full = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            full.paste(part, (x0, y0))
            full.save(raw)
        cut = refine_alpha(Image.open(raw).convert('RGBA'))
        cut.save(os.path.join(CUT, slot + '_fg.png'), optimize=True)
        silhouette(cut).save(os.path.join(CUT, slot + '_sil.png'), optimize=True)
        clean_plate(im, cut).save(os.path.join(CUT, slot + '_plate.jpg'), quality=88)
        print('cut', slot, flush=True)


if __name__ == '__main__':
    main()
