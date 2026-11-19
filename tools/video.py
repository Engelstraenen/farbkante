#!/usr/bin/env python3
"""Baut ein Scroll-Video für ein Filmkapitel.

Start: python3 tools/video.py <roh.mp4> <kapitel>     (kapitel = fassade | raum | karriere)
Ziel:  site/assets/vid/<kapitel>.mp4    (All-Intra H.264, Quellbreite, max. 1920, ohne Ton)
       site/assets/vid/<kapitel>-m.mp4  (All-Intra, 720 breit, fürs Handy)
Trägt das Kapitel in tools/geo.json unter "vid" ein und baut img.js neu (Versionsstempel).
All-Intra = jedes Bild ein Keyframe, damit Scrollen vor und zurück ohne Ruckeln springt.
Nie hochskalieren: Breite = min(Quelle, Ziel).
"""
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site", "assets", "vid")
RAW = os.path.join(ROOT, "assets-roh", "vid")


def width(src):
    o = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0",
                                 "-show_entries", "stream=width,height", "-of", "csv=p=0", src]).decode()
    w, h = (int(x) for x in o.strip().split(",")[:2])
    return w, h


def enc(src, dst, w, crf):
    subprocess.check_call([
        "ffmpeg", "-y", "-v", "error", "-i", src, "-an",
        "-vf", "scale=%d:-2:flags=lanczos,format=yuv420p" % w,
        "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
        "-g", "1", "-keyint_min", "1", "-sc_threshold", "0",
        "-movflags", "+faststart", dst])
    return os.path.getsize(dst)


def main():
    src, ch = sys.argv[1], sys.argv[2]
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(RAW, exist_ok=True)
    keep = os.path.join(RAW, ch + "-roh" + os.path.splitext(src)[1])
    if os.path.abspath(src) != os.path.abspath(keep):
        shutil.copy2(src, keep)
    w, h = width(src)
    big = min(w, 1920)
    s1 = enc(src, os.path.join(OUT, ch + ".mp4"), big, 20)
    s2 = enc(src, os.path.join(OUT, ch + "-m.mp4"), min(w, 720), 23)
    print("quelle %dx%d -> %s.mp4 %d breit %.1f MB, -m %.1f MB" % (w, h, ch, big, s1 / 1e6, s2 / 1e6))
    gp = os.path.join(ROOT, "tools", "geo.json")
    geo = json.load(open(gp)) if os.path.exists(gp) else {}
    geo.setdefault("vid", {})[ch] = 1
    json.dump(geo, open(gp, "w"), indent=1, ensure_ascii=False)
    subprocess.check_call([sys.executable, os.path.join(ROOT, "tools", "assets.py")])


if __name__ == "__main__":
    main()
