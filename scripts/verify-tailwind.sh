#!/usr/bin/env bash
set -euo pipefail

########################################
# Tailwind v4 + Next.js pipeline verifier
# Usage:
#   scripts/verify-tailwind.sh                # assumes localhost:$PORT or 3000
#   scripts/verify-tailwind.sh 3001           # numeric port
#   scripts/verify-tailwind.sh http://host:port  # explicit base URL
########################################

arg="${1:-}"

# Derive BASE_URL precedence: explicit http(s) arg > numeric arg/PORT env > default 3000
if [[ -n "$arg" ]]; then
	if [[ "$arg" =~ ^https?:// ]]; then
		BASE_URL="$arg"
	elif [[ "$arg" =~ ^[0-9]+$ ]]; then
		BASE_URL="http://localhost:$arg"
	else
		echo "[verify-tailwind][FAIL] Unrecognized argument '$arg'. Provide a port (e.g. 3001) or full URL." >&2
		exit 1
	fi
else
	PORT_ENV="${PORT:-3000}"
	BASE_URL="http://localhost:${PORT_ENV}"
fi

TMP_DIR="$(mktemp -d)"
CSS_FILE="$TMP_DIR/layout.css"

log() { echo "[verify-tailwind] $*"; }
fail() { echo "[verify-tailwind][FAIL] $*" >&2; rm -rf "$TMP_DIR"; exit 1; }
pass() { echo "[verify-tailwind][OK] $*"; }

log "Base URL resolved to: $BASE_URL"

HTML=""
attempt=0
max_attempts=5
while (( attempt < max_attempts )); do
	attempt=$((attempt+1))
	log "Fetching root page (attempt $attempt/$max_attempts)..."
	if HTML=$(curl -fsSL "$BASE_URL/" 2>/dev/null); then
		[[ -n "$HTML" ]] && break
	fi
	sleep 1
done
[[ -n "$HTML" ]] || fail "Unable to fetch / from dev server after $max_attempts attempts. Ensure it is running on $BASE_URL."

# Extract layout css link (Next.js app router standard)
CSS_PATH=$(echo "$HTML" | grep -Eoi '/_next/static/css/app/layout[^" >]*\.css' | head -n1 || true)
if [[ -z "$CSS_PATH" ]]; then
	# Fallback: parse via sed searching for href attribute containing layout.css
	CSS_PATH=$(echo "$HTML" | sed -nE 's/.*href="(\/[_a-zA-Z0-9\/.-]*layout\.css[^"]*)".*/\1/p' | head -n1 || true)
fi
if [[ -z "$CSS_PATH" ]]; then
	echo "----- HTML (truncated 500 chars) -----" >&2
	echo "${HTML:0:500}" >&2
	fail "Could not locate layout.css link in HTML (patterns tried)."
fi
FULL_CSS_URL="$BASE_URL$CSS_PATH"
log "Discovered layout CSS: $FULL_CSS_URL"

curl -fsSL "$FULL_CSS_URL" -o "$CSS_FILE" || fail "Failed to download layout CSS from $FULL_CSS_URL"

# Basic size sanity
BYTES=$(wc -c < "$CSS_FILE")
(( BYTES > 5000 )) || fail "layout.css too small ($BYTES bytes) — Tailwind likely not applied."
log "layout.css size: ${BYTES} bytes"

# Assertions
# Tailwind v4 may not include an explicit 'preflight' word marker; detect core universal selector rule instead
if ! grep -Eqs "\*, ::after, ::before" "$CSS_FILE"; then
	fail "Missing Tailwind preflight universal selector rule."
fi
# Representative utility rule: presence of .grid class (more robust than raw display:grid substring)
grep -q "\.grid {" "$CSS_FILE" || fail "Missing representative .grid utility class."
grep -q ".card" "$CSS_FILE" || fail "Missing custom .card component class."
# Check border radius for card (approx). Accept border-radius:1rem or variable expansion
if ! awk '/\.card \{/ {found=1} found && /border-radius:/ {print; exit 0} END {if(!found) exit 2}' "$CSS_FILE" | grep -Eq 'border-radius:[[:space:]]*(1rem|var)'; then
	fail "Card class missing border-radius property."
fi

# Check at least one gradient variable presence
grep -Fq -- "--mv-gradient-primary-from" "$CSS_FILE" || fail "Missing gradient design token variables."

pass "All Tailwind verification checks passed."

rm -rf "$TMP_DIR" || true
