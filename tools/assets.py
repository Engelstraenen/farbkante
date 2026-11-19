#!/usr/bin/env python3
"""Baut die Web-Bilder aus den 4K-Originalen.

Quelle:  assets-roh/4k/<datei>.png   (sjinn, 5504x3072)
Ziel:    site/assets/img/<datei>.webp (3840 breit) und <datei>-m.webp (1800 breit)
Sonderfälle:
  r1-rolle        Magenta freistellen -> PNG mit Alpha (900 / 480 breit)
  m5b-maske       Wandmaske aus der grünen Bearbeitung von m5a -> PNG (1920 / 960)
Schreibt site/assets/js/img.js (Bildmaße + eingemessene Lagen aus tools/geo.json).

Start: python3 tools/assets.py
"""
import json
import os
import re
import time

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "assets-roh", "4k")
OUT = os.path.join(ROOT, "site", "assets", "img")
os.makedirs(OUT, exist_ok=True)


def save_webp(im, name, w, q=82):
    im = im.convert("RGB")
    if im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, name), "WEBP", quality=q, method=6)
    return im.size


def key_magenta(im):
    a = np.asarray(im.convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    # Magenta = viel Rot und Blau, wenig Grün
    mag = np.clip(((r + b) / 2 - g - 60) / 80, 0, 1)
    alpha = (1 - mag) * 255
    # Rand entfärben: Magenta-Anteil aus Rot/Blau ziehen
    spill = np.clip(((r + b) / 2 - g) / 255, 0, 1) * (alpha < 250)
    r2 = r - spill * 60
    b2 = b - spill * 60
    rgba = np.dstack([np.clip(r2, 0, 255), g, np.clip(b2, 0, 255), alpha]).astype(np.uint8)
    out = Image.fromarray(rgba, "RGBA")
    bbox = out.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
    return out.crop(bbox) if bbox else out


def green_mask(im):
    a = np.asarray(im.convert("RGB")).astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = np.clip((g - np.maximum(r, b) - 40) / 60, 0, 1)
    rgba = np.zeros((*m.shape, 4), np.uint8)
    rgba[..., 3] = (m * 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def main():
    info = {}
    for fn in sorted(os.listdir(RAW)):
        if not fn.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
            continue
        name = os.path.splitext(fn)[0]
        im = Image.open(os.path.join(RAW, fn))
        if name == "r1-rolle":
            cut = key_magenta(im)
            for suf, w in (("", 900), ("-m", 480)):
                c = cut.resize((w, round(cut.height * w / cut.width)), Image.LANCZOS)
                c.save(os.path.join(OUT, name + suf + ".png"), optimize=True)
            info[name] = {"w": cut.width, "h": cut.height, "png": True}
        elif name == "m5b-maske-roh":
            m = green_mask(im)
            for suf, w in (("", 1920), ("-m", 960)):
                m.resize((w, round(m.height * w / m.width)), Image.LANCZOS).save(os.path.join(OUT, "m5b-maske" + suf + ".png"), optimize=True)
            info["m5b-maske"] = {"w": im.width, "h": im.height, "png": True}
        else:
            save_webp(im, name + ".webp", 3840)
            save_webp(im, name + "-m.webp", 1800, 78)
            info[name] = {"w": im.width, "h": im.height}
        print("ok", name, im.size)
    geo_p = os.path.join(ROOT, "tools", "geo.json")
    geo = json.load(open(geo_p)) if os.path.exists(geo_p) else {}
    for k, v in geo.get("img", {}).items():
        info.setdefault(k, {}).update(v)
    vid = geo.get("vid", {})
    v = int(time.time())
    info["_v"] = v
    vid["_v"] = v
    js = "window.FK_IMG=%s;\nwindow.FK_GEO=%s;\nwindow.FK_VID=%s;\n" % (
        json.dumps(info), json.dumps(geo.get("geo", {})), json.dumps(vid))
    open(os.path.join(ROOT, "site", "assets", "js", "img.js"), "w").write(js)
    open(os.path.join(ROOT, "site", "version.txt"), "w").write(str(v))
    ip = os.path.join(ROOT, "site", "index.html")
    h = open(ip).read()
    h = re.sub(r"v!=='(__V__|\d+)'", "v!=='%d'" % v, h)
    h = re.sub(r"\?v=\d+\"", '?v=%d"' % v, h)
    open(ip, "w").write(h)
    print("img.js geschrieben, Stand", v)


if __name__ == "__main__":
    main()
