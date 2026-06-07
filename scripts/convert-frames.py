"""
Batch convert 300 PNG frames to optimized JPEGs for scroll animation.
- Source: picture/zip/ezgif-frame-XXX.png (1456x816, ~3MB each)
- Output: public/frames/frame-001.jpg ... frame-300.jpg (1280x720, ~80-150KB each)
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Pillow not installed. Installing...")
    os.system(f"{sys.executable} -m pip install Pillow")
    from PIL import Image

# Paths
ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "picture" / "zip"
OUT_DIR = ROOT / "public" / "frames"

# Settings
TARGET_SIZE = (1280, 720)
JPEG_QUALITY = 80
TOTAL_FRAMES = 300

def main():
    # Create output directory
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    
    converted = 0
    skipped = 0
    
    for i in range(1, TOTAL_FRAMES + 1):
        src_name = f"ezgif-frame-{i:03d}.png"
        dst_name = f"frame-{i:03d}.jpg"
        
        src_path = SRC_DIR / src_name
        dst_path = OUT_DIR / dst_name
        
        if not src_path.exists():
            print(f"[SKIP] {src_name} not found")
            skipped += 1
            continue
        
        # Skip if already converted
        if dst_path.exists():
            converted += 1
            continue
        
        try:
            img = Image.open(src_path)
            # Convert RGBA to RGB for JPEG
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            # Resize
            img = img.resize(TARGET_SIZE, Image.LANCZOS)
            # Save as optimized JPEG
            img.save(dst_path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
            converted += 1
            
            if converted % 25 == 0 or converted == TOTAL_FRAMES:
                print(f"[{converted}/{TOTAL_FRAMES}] Converted {src_name} -> {dst_name}")
        except Exception as e:
            print(f"[ERROR] {src_name}: {e}")
            skipped += 1
    
    # Calculate total output size
    total_bytes = sum(f.stat().st_size for f in OUT_DIR.glob("*.jpg"))
    total_mb = total_bytes / (1024 * 1024)
    
    print(f"")
    print(f"Done! {converted} frames converted, {skipped} skipped")
    print(f"Output: {OUT_DIR}")
    print(f"Total size: {total_mb:.1f} MB")

if __name__ == "__main__":
    main()
