#!/usr/bin/env bash
# Teamrunde der Amélie-Crew von der Kommandozeile, ohne Claude Code.
# Ablauf wie in skills/amelie-orchestrator: Vorflug → drei Engines parallel → Merge → Reviewer → Bibliothekar.
#
#   npm run teamrunde -- "<Thema>" [--model <id>] [--mock] [--write] [--engines "ideen-scout inversions-agent"] [--runs-dir <Pfad>]
#
# Ohne --write wird nichts ins Gedächtnis geschrieben: der Bibliothekar baut seinen Plan und prüft ihn per Trockenlauf.
# Mit --write: Bibliothekar bucht über bib apply, Engines und Reviewer hängen ihre Log-Abschnitte an, dann bib abschluss.
# Exit: 0 alles gelaufen · 1 Aufruf falsch · 3 keine Engine lieferte ein gültiges Ergebnis oder ein Schritt brach ab · 4 Schreiben abgelehnt
# Handbuch: 06-suche/amelie-kommandozeile.md

set -uo pipefail
cd "$(dirname "$0")/../.."

THEMA=""; WRITE=0; ENGINES="ideen-scout bisoziations-kollider inversions-agent"; COMMON=()
while [ $# -gt 0 ]; do
  case "$1" in
    --model) COMMON+=(--model "$2"); shift 2 ;;
    --runs-dir) COMMON+=(--runs-dir "$2"); shift 2 ;;
    --mock) COMMON+=(--mock); shift ;;
    --write) WRITE=1; shift ;;
    --engines) ENGINES="$2"; shift 2 ;;
    -h|--help) sed -n '2,11p' "$0"; exit 0 ;;
    -*) echo "Unbekannte Option: $1" >&2; exit 1 ;;
    *) THEMA="$1"; shift ;;
  esac
done
[ -n "$THEMA" ] || { echo 'Thema fehlt: npm run teamrunde -- "<Thema>"' >&2; exit 1; }

OUT=$(mktemp -d "${TMPDIR:-/tmp}/teamrunde-XXXXXX")
agent() { node scripts/agent-run.mjs "$@"; }
run_id() { node -e 'try{const r=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));process.stdout.write(r.run_id||"")}catch{}' "$1"; }
say() { printf '\n== %s\n' "$*" >&2; }

say "Teamrunde „$THEMA“ (Arbeitsdateien: $OUT)"

say "0 · Vorflug"
npm run -s bib -- vorflug >&2 || echo "(Vorflug meldet Befunde, Runde läuft weiter)" >&2

say "1 · Engines parallel: $ENGINES"
declare -A PID
for a in $ENGINES; do
  agent "$a" --thema "$THEMA" --json "${COMMON[@]}" > "$OUT/$a.json" 2> "$OUT/$a.log" &
  PID[$a]=$!
done
OK_IDS=()
for a in $ENGINES; do
  wait "${PID[$a]}"; code=$?
  id=$(run_id "$OUT/$a.json")
  echo "   $a: Exit $code ${id:+($id)} — $(tail -n 2 "$OUT/$a.log" | head -n 1)" >&2
  [ "$code" -eq 0 ] && [ -n "$id" ] && OK_IDS+=("$id")
done
[ ${#OK_IDS[@]} -gt 0 ] || { echo "Keine Engine lieferte ein gültiges Ergebnis. Logs: $OUT" >&2; exit 3; }

say "2 · Merge"
INPUTS=(); for id in "${OK_IDS[@]}"; do INPUTS+=(--input "$id"); done
agent merge "${OK_IDS[@]}" "${COMMON[@]}" | tee "$OUT/merge.md" >&2

say "3 · Reviewer"
REVIEW_ID=""
agent idea-reviewer "${INPUTS[@]}" --thema "$THEMA" --json "${COMMON[@]}" > "$OUT/idea-reviewer.json" 2> "$OUT/idea-reviewer.log"; code=$?
if [ "$code" -eq 0 ]; then
  REVIEW_ID=$(run_id "$OUT/idea-reviewer.json"); echo "   idea-reviewer: $REVIEW_ID" >&2
elif [ "$code" -eq 1 ] && grep -q 'braucht --input' "$OUT/idea-reviewer.log"; then
  echo "   nichts zu bewerten (alle Ideen besetzt)" >&2
else
  echo "   idea-reviewer: Exit $code, siehe $OUT/idea-reviewer.log" >&2; exit 3
fi

say "4 · Bibliothekar"
LIB_INPUTS=("${INPUTS[@]}"); [ -n "$REVIEW_ID" ] && LIB_INPUTS+=(--input "$REVIEW_ID")
if [ "$WRITE" -eq 1 ]; then LIB_WRITE=(--write); else LIB_WRITE=(--dry-write); fi
agent bibliothekar "${LIB_INPUTS[@]}" --thema "$THEMA" --json "${LIB_WRITE[@]}" "${COMMON[@]}" > "$OUT/bibliothekar.json" 2> "$OUT/bibliothekar.log"; code=$?
LIB_ID=$(run_id "$OUT/bibliothekar.json")
grep -E '^\[bibliothekar\]' "$OUT/bibliothekar.log" >&2
[ "$code" -eq 0 ] || { echo "   Bibliothekar: Exit $code, siehe $OUT/bibliothekar.log" >&2; exit "$code"; }

# Wer ein eigenes Log hat (der ideen-scout schreibt laut Definition nichts)
WRITE_IDS=(); for id in "${OK_IDS[@]}" ${REVIEW_ID:+"$REVIEW_ID"}; do case "$id" in ideen-scout-*) ;; *) WRITE_IDS+=("$id") ;; esac; done
RD=""; for ((i=0; i<${#COMMON[@]}; i++)); do [ "${COMMON[$i]}" = "--runs-dir" ] && RD=" --runs-dir ${COMMON[$((i+1))]}"; done

if [ "$WRITE" -eq 1 ]; then
  say "5 · Logs der Engines und des Reviewers, Abschluss"
  for id in "${WRITE_IDS[@]}"; do agent write "$id" "${COMMON[@]}" || exit 4; done
  npm run -s bib -- abschluss >&2 || { echo "bib abschluss nicht grün" >&2; exit 3; }
else
  say "5 · Nichts geschrieben (ohne --write). Buchen nach Durchsicht:"
  echo "   npm run agent -- write $LIB_ID$RD          # Bibliothekar: bib apply + Retro" >&2
  for id in "${WRITE_IDS[@]}"; do echo "   npm run agent -- write $id$RD" >&2; done
  echo "   npm run bib -- abschluss" >&2
fi

say "Fertig"
printf '{"thema":%s,"engines":[%s],"reviewer":"%s","bibliothekar":"%s","written":%s,"workdir":"%s"}\n' \
  "$(node -e 'process.stdout.write(JSON.stringify(process.argv[1]))' "$THEMA")" \
  "$(printf '"%s",' "${OK_IDS[@]}" | sed 's/,$//')" "$REVIEW_ID" "$LIB_ID" "$([ "$WRITE" -eq 1 ] && echo true || echo false)" "$OUT"
