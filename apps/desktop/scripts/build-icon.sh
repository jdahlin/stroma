#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$SCRIPT_DIR/../build"
SVG_PATH="$BUILD_DIR/icon.svg"
PNG_PATH="$BUILD_DIR/icon.png"
ICNS_PATH="$BUILD_DIR/icon.icns"
ICO_PATH="$BUILD_DIR/icon.ico"
ICONSET_PATH="$BUILD_DIR/icon.iconset"
ICONS_DIR="$BUILD_DIR/icons"

if [ ! -f "$SVG_PATH" ]; then
  echo "No icon.svg found at $SVG_PATH, skipping icon build"
  exit 0
fi

# Check if we need to rebuild
NEEDS_REBUILD=false
if [ ! -f "$PNG_PATH" ] || [ "$SVG_PATH" -nt "$PNG_PATH" ]; then
  NEEDS_REBUILD=true
fi

if [ "$NEEDS_REBUILD" = false ]; then
  echo "Icons are up to date"
  exit 0
fi

echo "Converting icon.svg to platform icons..."

# Convert SVG to PNG (1024x1024)
if command -v rsvg-convert &> /dev/null; then
  rsvg-convert -w 1024 -h 1024 "$SVG_PATH" -o "$PNG_PATH"
elif command -v qlmanage &> /dev/null; then
  qlmanage -t -s 1024 -o "$BUILD_DIR" "$SVG_PATH" &> /dev/null
  mv "$BUILD_DIR/icon.svg.png" "$PNG_PATH"
else
  echo "Error: Neither rsvg-convert nor qlmanage available"
  exit 1
fi

# macOS: Create .icns
if command -v iconutil &> /dev/null; then
  echo "Creating macOS icon.icns..."
  rm -rf "$ICONSET_PATH"
  mkdir -p "$ICONSET_PATH"

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

  iconutil -c icns "$ICONSET_PATH" -o "$ICNS_PATH"
  rm -rf "$ICONSET_PATH"
  echo "Created $ICNS_PATH"
fi

# Windows: Create .ico using ImageMagick or png2ico
if command -v convert &> /dev/null; then
  echo "Creating Windows icon.ico..."
  convert "$PNG_PATH" -define icon:auto-resize=256,128,64,48,32,16 "$ICO_PATH"
  echo "Created $ICO_PATH"
elif command -v png2ico &> /dev/null; then
  echo "Creating Windows icon.ico..."
  # Generate required sizes
  TEMP_DIR=$(mktemp -d)
  for size in 16 32 48 64 128 256; do
    if command -v sips &> /dev/null; then
      sips -z $size $size "$PNG_PATH" --out "$TEMP_DIR/icon_${size}.png" > /dev/null
    elif command -v rsvg-convert &> /dev/null; then
      rsvg-convert -w $size -h $size "$SVG_PATH" -o "$TEMP_DIR/icon_${size}.png"
    fi
  done
  png2ico "$ICO_PATH" "$TEMP_DIR"/icon_*.png
  rm -rf "$TEMP_DIR"
  echo "Created $ICO_PATH"
else
  echo "Warning: Neither ImageMagick nor png2ico available, skipping .ico generation"
fi

# Linux: Create icons directory with multiple sizes
echo "Creating Linux icons..."
rm -rf "$ICONS_DIR"
mkdir -p "$ICONS_DIR"

for size in 16 32 48 64 128 256 512 1024; do
  if command -v sips &> /dev/null; then
    sips -z $size $size "$PNG_PATH" --out "$ICONS_DIR/${size}x${size}.png" > /dev/null
  elif command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w $size -h $size "$SVG_PATH" -o "$ICONS_DIR/${size}x${size}.png"
  elif command -v convert &> /dev/null; then
    convert "$PNG_PATH" -resize ${size}x${size} "$ICONS_DIR/${size}x${size}.png"
  fi
done
echo "Created Linux icons in $ICONS_DIR"

echo "Icon generation complete!"
