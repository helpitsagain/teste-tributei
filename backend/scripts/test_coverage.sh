#!/usr/bin/env bash
set -euo pipefail

# Run backend tests with coverage and point to the HTML report
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "Running backend tests with coverage..."
npm run coverage --silent

REPORT="$ROOT_DIR/coverage/lcov-report/index.html"
if [ -f "$REPORT" ]; then
  echo "Coverage report generated: $REPORT"
else
  echo "Coverage report not found. Check vitest output in the console." >&2
  exit 1
fi
