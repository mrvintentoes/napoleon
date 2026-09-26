# contact sheet: python3 scripts/sheet.py out.jpg img1 img2 ... (labels = frame numbers)
import sys
from PIL import Image, ImageDraw
out, *files = sys.argv[1:]
ims = [Image.open(f) for f in files]
w, h = ims[0].size
cols = min(6, len(ims)); rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * h), (30, 30, 30))
d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    x, y = (i % cols) * w, (i // cols) * h
    sheet.paste(im, (x, y))
    d.rectangle([x, y, x + 110, y + 26], fill=(0, 0, 0))
    d.text((x + 6, y + 6), f.split('_')[-1].split('.')[0], fill=(0, 255, 0))
sheet.save(out, quality=85)
