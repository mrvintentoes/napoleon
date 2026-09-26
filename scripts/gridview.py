# gridview.py img x0 y0 x1 y1 out  -> crop (normalized) with 10x10 labelled grid, 600px wide
import sys
from PIL import Image, ImageDraw
p, x0, y0, x1, y1, out = sys.argv[1], *map(float, sys.argv[2:6]), sys.argv[6]
im = Image.open(p).convert('RGB'); W, H = im.size
c = im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
c = c.resize((600, int(600 * c.height / c.width)))
d = ImageDraw.Draw(c)
for i in range(1, 10):
    y = c.height * i / 10; d.line([(0, y), (600, y)], fill=(0, 255, 0)); d.text((2, y), f'{y0 + (y1 - y0) * i / 10:.3f}', fill=(0, 255, 0))
    x = 600 * i / 10; d.line([(x, 0), (x, c.height)], fill=(255, 0, 255)); d.text((x + 2, 2), f'{x0 + (x1 - x0) * i / 10:.3f}', fill=(255, 0, 255))
c.save(out)
