#!/bin/bash

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "ImageMagick is required but not installed. Please install it first."
    exit 1
fi

# Source and destination directories
SOURCE_SVG="public/images/Logo.svg"
DEST_DIR="public"

# Create favicon.ico (16x16 and 32x32)
magick "$SOURCE_SVG" -background none -resize 16x16 "$DEST_DIR/favicon-16x16.png"
magick "$SOURCE_SVG" -background none -resize 32x32 "$DEST_DIR/favicon-32x32.png"
magick "$SOURCE_SVG" -background none -resize 16x16 "$DEST_DIR/favicon.ico"
magick "$SOURCE_SVG" -background none -resize 32x32 -alpha remove "$DEST_DIR/favicon.ico"

# Create Apple Touch Icon (180x180)
magick "$SOURCE_SVG" -background none -resize 180x180 "$DEST_DIR/apple-touch-icon.png"

# Create Android Chrome icons
magick "$SOURCE_SVG" -background none -resize 192x192 "$DEST_DIR/android-chrome-192x192.png"
magick "$SOURCE_SVG" -background none -resize 512x512 "$DEST_DIR/android-chrome-512x512.png"

echo "Favicon generation complete!"
