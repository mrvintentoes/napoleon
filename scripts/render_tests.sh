#!/usr/bin/env bash
# Renders the four section test clips (Austerlitz, Russia, Hundred Days, Waterloo).
set -e
cd "$(dirname "$0")/.."
r() { npx remotion render src/index.ts NapoleonEdit "out/test_$1.mp4" --frames="$2" --crf=20 --log=error; echo "done $1"; }
r austerlitz 2820-3479
r russia 4800-5759
r hundred_days 6720-7259
r waterloo 7260-7979
