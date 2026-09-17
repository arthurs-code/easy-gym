#!/bin/sh
set -eu
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required. Install Node.js and try again." >&2
  exit 1
fi
node tools/build-content.cjs
