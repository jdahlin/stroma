#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/../build"
SVG_PATH="$BUILD_DIR/icon.svg"
ICNS_PATH="$BUILD_DIR/icon.icns"
PNG_PATH="$BUILD_DIR/icon.png"
ICONSET_PATH="$BUILD_DIR/icon.iconset"

if [ ! -f "$SVG_PATH" ]; then
  echo "No icon.svg found at $SVG_PATH, skipping icon build"
  exit 0
fi

# Skip if icns is newer than svg
if [ -f "$ICNS_PATH" ] && [ "$ICNS_PATH" -nt "$SVG_PATH" ]; then
  echo "icon.icns is up to date"
  exit 0
fi

echo "Converting icon.svg to icon.icns..."

# Convert SVG to PNG (1024x1024)
# Try rsvg-convert first (better quality), fall back to qlmanage (built-in macOS)
if command -v rsvg-convert &> /dev/null; then
  rsvg-convert -w 1024 -h 1024 "$SVG_PATH" -o "$PNG_PATH"
elif command -v qlmanage &> /dev/null; then
  qlmanage -t -s 1024 -o "$BUILD_DIR" "$SVG_PATH" &> /dev/null
  mv "$BUILD_DIR/icon.svg.png" "$PNG_PATH"
else
  echo "Error: Neither rsvg-convert nor qlmanage available"
  exit 1
fi

# Create iconset directory
rm -rf "$ICONSET_PATH"
mkdir -p "$ICONSET_PATH"

# Generate all required sizes
sips -z 16 16 "$PNG_PATH" --out "$ICONSET_PATH/icon_16x16.png" > /dev/null
sips -z 32 32 "$PNG_PATH" --out "$ICONSET_PATH/icon_16x16@2x.png" > /dev/null
sips -z 32 32 "$PNG_PATH" --out "$ICONSET_PATH/icon_32x32.png" > /dev/null
sips -z 64 64 "$PNG_PATH" --out "$ICONSET_PATH/icon_32x32@2x.png" > /dev/null
sips -z 128 128 "$PNG_PATH" --out "$ICONSET_PATH/icon_128x128.png" > /dev/null
sips -z 256 256 "$PNG_PATH" --out "$ICONSET_PATH/icon_128x128@2x.png" > /dev/null
sips -z 256 256 "$PNG_PATH" --out "$ICONSET_PATH/icon_256x256.png" > /dev/null
sips -z 512 512 "$PNG_PATH" --out "$ICONSET_PATH/icon_256x256@2x.png" > /dev/null
sips -z 512 512 "$PNG_PATH" --out "$ICONSET_PATH/icon_512x512.png" > /dev/null
sips -z 1024 1024 "$PNG_PATH" --out "$ICONSET_PATH/icon_512x512@2x.png" > /dev/null

# Create icns
iconutil -c icns "$ICONSET_PATH" -o "$ICNS_PATH"

# Cleanup
rm -rf "$ICONSET_PATH" "$PNG_PATH"

echo "Created $ICNS_PATH"
