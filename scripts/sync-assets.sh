#!/bin/sh
# Copy the landing pictures from the local game folder into ./assets (git ignores it).
set -e
GAME="${GAME_DIR:-$(cd "$(dirname "$0")/../.." && pwd)/Sheep Farm}"
SRC="$GAME/landing/assets"
DEST="$(cd "$(dirname "$0")/.." && pwd)/assets"
[ -d "$SRC" ] || { echo "Not found: $SRC (set GAME_DIR to the game folder)"; exit 1; }
rm -rf "$DEST" && cp -R "$SRC" "$DEST"
echo "Copied $(ls "$DEST" | wc -l | tr -d ' ') files to assets/"
