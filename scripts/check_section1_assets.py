#!/usr/bin/env python3
"""Verify approved Ivory Bloom Section 1 assets without modifying any files.

Usage: python3 scripts/check_section1_assets.py [--root PATH] [--json]
Requires Pillow (python3 -m pip install Pillow) for actual decoding.
This is an asset gate, NOT an animation, device, privacy, or licensing audit.
"""
import argparse
import json
import sys
from pathlib import Path

try:
    from PIL import Image, UnidentifiedImageError
except ImportError:
    sys.exit("ERROR: Pillow required for full image decoding. Install: python3 -m pip install Pillow")

EXPECTED = {
    "arch.webp": (941, 1672),
    "sky.webp": (1080, 1920),
    "palace-horizontal.webp": (1448, 1086),
    "drape.webp": (1024, 1536),
    "hang_1.webp": (1024, 1536),
    "hang_3.webp": (1024, 1536),
    "hang_4.webp": (1024, 1536),
    "peacock.webp": (1024, 1536),
    "spike_3.webp": (768, 1536),
    "spike_4.webp": (768, 1536),
    "spike_5.webp": (768, 1536),
    "stem_1.webp": (768, 1536),
    "stem_2.webp": (768, 1536),
    "leaf_4.webp": (1536, 1024),
    "leaf_5.webp": (1536, 1024),
    "leaf_6.webp": (1536, 1024),
    "bfly_1.webp": (312, 246),
    "bfly_white.webp": (312, 246),
    "royal-name-divider.webp": (690, 36),
    "royal-open-button.webp": (663, 147),
}
ASSET_DIRS = ("public/assets/ivory-bloom", "assets/skins/ivory-bloom")


def inspect(root):
    details = []
    warnings = []
    fail_count = 0
    for filename, expected_size in EXPECTED.items():
        paths = [root / directory / filename for directory in ASSET_DIRS]
        found = [p for p in paths if p.is_file()]
        item = {"filename": filename, "expected": list(expected_size), "paths": [str(p.relative_to(root)) for p in found]}
        if not found:
            item["status"] = "MISSING"
            fail_count += 1
        else:
            if len(found) > 1:
                warnings.append(f"Duplicate asset in both folders: {filename}")
            try:
                with Image.open(found[0]) as img:
                    fmt, dimensions, bands = img.format, img.size, img.getbands()
                    img.load()  # force full WebP decoding, not just RIFF header parsing
                    item["actual"] = list(dimensions)
                    item["format"] = fmt
                    item["bytes"] = found[0].stat().st_size
                    if "A" in bands:
                        a_min, a_max = img.getchannel("A").getextrema()
                        item["alpha_range"] = [a_min, a_max]
                    else:
                        item["alpha_range"] = None
                    problems = []
                    if fmt != "WEBP":
                        problems.append("not WebP")
                    if dimensions != expected_size:
                        problems.append(f"dimensions {dimensions} != {expected_size}")
                    if filename != "sky.webp" and ("A" not in bands or item["alpha_range"][0] == 255):
                        problems.append("decorative artwork lacks transparent pixels")
                    if filename == "sky.webp" and "A" in bands and item["alpha_range"][0] < 255:
                        warnings.append("Sky contains transparency; verify the full-bleed background")
                    item["status"] = "PASS" if not problems else "FAIL"
                    if problems:
                        item["issues"] = problems
                        fail_count += 1
            except (OSError, ValueError, UnidentifiedImageError) as exc:
                item["status"] = "UNREADABLE"
                item["issues"] = [str(exc)]
                fail_count += 1
        details.append(item)
    nonpublic = [item["filename"] for item in details if any(p.startswith("assets/skins/") for p in item["paths"])]
    if nonpublic:
        warnings.append(
            f"{len(nonpublic)} assets use assets/skins/ivory-bloom (not under public/). "
            "A static deployment must explicitly copy or serve this folder."
        )
    return {
        "expected": len(EXPECTED),
        "present": sum(bool(x["paths"]) for x in details),
        "passed": sum(x["status"] == "PASS" for x in details),
        "failed": fail_count,
        "warnings": warnings,
        "details": details,
        "scope": "Files, exact dimensions, actual WebP decoding, and alpha presence only; not mobile visual QA or privacy.",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=".", help="Root of the Ivory Bloom Git checkout")
    parser.add_argument("--json", action="store_true", help="Write machine-readable JSON")
    args = parser.parse_args()
    result = inspect(Path(args.root).expanduser().resolve())
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        for item in result["details"]:
            print(f"{item['status']:10} {item['filename']:<30} {', '.join(item['paths']) or '(not found)'}")
            if item.get("issues"):
                print("           " + "; ".join(item["issues"]))
        print(f"\nPASS {result['passed']}/{result['expected']} | PRESENT {result['present']}/{result['expected']}")
        for warning in result["warnings"]:
            print("WARNING: " + warning)
    return 1 if result["failed"] else 0


if __name__ == "__main__":
    raise SystemExit(main())
