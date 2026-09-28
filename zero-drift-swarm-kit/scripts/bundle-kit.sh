#!/usr/bin/env bash
# Zero-Drift Swarm Kit: Distribution Bundler
# Creates a clean, distributable zero-drift-swarm-kit.zip using Python's standard library.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_ZIP="$KIT_DIR/zero-drift-swarm-kit.zip"

echo "📦 Bundling Zero-Drift Swarm Kit..."

python3 - <<EOF
import os
import zipfile

kit_dir = "$KIT_DIR"
output_zip = "$OUTPUT_ZIP"

exclude_dirs = {'.git', 'node_modules', 'dist', '__pycache__'}
exclude_extensions = {'.zip', '.DS_Store'}

if os.path.exists(output_zip):
    os.remove(output_zip)

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(kit_dir):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in exclude_extensions:
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, kit_dir)
            zipf.write(full_path, rel_path)

print(f"✅ Successfully created distribution bundle:\n   {output_zip}\n   Ready to upload to Lemon Squeezy / Gumroad!")
EOF
