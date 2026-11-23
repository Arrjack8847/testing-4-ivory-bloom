#!/usr/bin/env python3
"""Read-only technical audit of the 47 staged Myanmar Royal art assets."""
import csv, hashlib, json, re, sys
from pathlib import Path
from xml.etree import ElementTree as ET
from PIL import Image, ImageChops, ImageStat

ROOT = Path("assets/skins/golden-pagoda-garden")
MANIFEST = Path("docs/golden-pagoda-47-asset-manifest.csv")
REPORT = Path("golden-pagoda-47-qa-report.json")
errors, warnings, files = [], [], []
rows = list(csv.DictReader(MANIFEST.open(encoding="utf-8", newline="")))
if len(rows) != 47:
    errors.append(f"Manifest has {len(rows)} entries, expected 47")

for row in rows:
    rel = row["relative_path"]
    path = ROOT / rel
    item = {"path": str(path), "expected": row["dimensions"],
            "alpha_expected": row["alpha"], "session": row["session"]}
    if not path.is_file():
        errors.append(f"MISSING: {path}")
        files.append(item)
        continue
    raw = path.read_bytes()
    item["bytes"] = len(raw)
    item["sha256"] = hashlib.sha256(raw).hexdigest()
    if path.suffix == ".svg":
        try:
            document = ET.fromstring(raw)
            actual = document.attrib.get("viewBox")
            expected = re.sub(r"^SVG viewBox\s*", "", row["dimensions"])
            item["viewBox"] = actual
            if actual != expected:
                errors.append(f"VIEWBOX: {rel}: {actual} expected {expected}")
            if b"<script" in raw.lower() or b"http://" in raw.lower() or b"https://" in raw.lower():
                warnings.append(f"Review external refs/scripts: {rel}")
        except Exception as exc:
            errors.append(f"SVG DECODE: {rel}: {exc}")
    else:
        try:
            with Image.open(path) as src:
                src.verify()
            with Image.open(path) as src:
                src.load()
                item["format"] = src.format
                item["dimensions"] = [src.width, src.height]
                dim = re.search(r"(\d+)\s*×\s*(\d+)", row["dimensions"])
                if src.format != "WEBP":
                    errors.append(f"NOT WEBP: {rel}: {src.format}")
                if dim and (src.width,src.height) != (int(dim.group(1)),int(dim.group(2))):
                    errors.append(f"SIZE: {rel}: {src.size}, expected {dim.groups()}")
                alpha = src.getchannel("A") if "A" in src.getbands() else None
                alpha_minmax = alpha.getextrema() if alpha else (255,255)
                item["alpha_extrema"] = list(alpha_minmax)
                if row["alpha"] == "alpha" and alpha_minmax[0] >= 255:
                    errors.append(f"NO TRANSPARENT PIXELS: {rel}")
                if row["alpha"] == "opaque" and alpha_minmax[0] < 255:
                    errors.append(f"UNEXPECTED TRANSPARENCY: {rel}")
                # Pixel-structure guard against nontransparent paper rectangle
                # left behind by background extraction on the supplied Section 3 art.
                extraction_regions = {
                    "section-03/portrait-frame.webp": ((.035,.40,.065,.60), 60),
                    "section-03/arch-kanote.webp": ((.020,.04,.120,.10), 20),
                }
                if rel in extraction_regions and alpha:
                    (x0,y0,x1,y1),limit = extraction_regions[rel]
                    patch = alpha.crop((int(src.width*x0),int(src.height*y0),
                                        int(src.width*x1),int(src.height*y1)))
                    outside_mean = ImageStat.Stat(patch).mean[0]
                    item["extraction_backdrop_alpha_mean"] = round(outside_mean,2)
                    if outside_mean > limit:
                        errors.append(
                            f"EXTRACTION BACKDROP: {rel}: alpha {outside_mean:.1f} > {limit}; artwork repair required"
                        )
                if rel in {"section-03/portrait-frame.webp", "section-07/photo-frame.webp"}:
                    if not alpha:
                        errors.append(f"FRAME WITHOUT ALPHA: {rel}")
                    else:
                        box = (int(src.width*.32),int(src.height*.32),int(src.width*.68),int(src.height*.68))
                        center = alpha.crop(box)
                        transparent_fraction = sum(n for value,n in center.histogram()[:48])/max(1,center.width*center.height)
                        item["transparent_center_fraction"] = round(transparent_fraction,4)
                        if transparent_fraction < .70:
                            errors.append(f"FRAME CENTER NOT CLEAR: {rel}: {transparent_fraction:.1%} transparent")
                if row["dimensions"].endswith("seamless tile"):
                    rgb = src.convert("RGB")
                    w,h=rgb.size
                    left=rgb.crop((0,0,1,h)).resize((32,h))
                    right=rgb.crop((w-1,0,w,h)).resize((32,h))
                    top=rgb.crop((0,0,w,1)).resize((w,32))
                    bottom=rgb.crop((0,h-1,w,h)).resize((w,32))
                    edge_x = sum(ImageStat.Stat(ImageChops.difference(left,right)).mean)/3
                    edge_y = sum(ImageStat.Stat(ImageChops.difference(top,bottom)).mean)/3
                    item["tile_edge_mean_difference"] = [round(edge_x,2),round(edge_y,2)]
                    if max(edge_x,edge_y) > 12:
                        warnings.append(f"NON-SEAMLESS TILE CANDIDATE: {rel}: x={edge_x:.1f}, y={edge_y:.1f}; use non-repeating cover until repaired")
        except Exception as exc:
            errors.append(f"IMAGE DECODE: {rel}: {exc}")
    files.append(item)

paths = [r["path"] for r in rows]
if len(set(paths)) != len(paths):
    errors.append("Duplicate destination manifest paths")
for path in ROOT.iterdir():
    if path.is_dir() and path.name not in {"shared",*(f"section-{i:02d}" for i in range(2,11))}:
        warnings.append(f"Unexpected extra directory: {path}")
result = {"status": "pass" if not errors else "fail", "file_count": len(files),
          "errors": errors, "warnings": warnings, "files": files}
REPORT.write_text(json.dumps(result,indent=2),encoding="utf-8")
print(f"FILES {len(files)} | ERRORS {len(errors)} | WARNINGS {len(warnings)}")
for issue in errors: print("ERROR:",issue)
for issue in warnings: print("WARN:",issue)
print(f"Report: {REPORT}")
sys.exit(1 if errors else 0)
