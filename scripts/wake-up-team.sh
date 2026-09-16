#!/usr/bin/env bash
# wake-up-team.sh — spin up the Amélie research/delivery team as background Claude Code agents.
#
# Roles (8 agents to begin with):
#   1 Librarian    — owns 06-suche/, keeps the round-start memory trustworthy
#   1 Secretary    — owns 03-zuordnung/ and 04-werkzeug/, drafts deliveries, tracks status
#   4 Researchers  — find and check new ideas. Split as an A/B test of two idea-finding
#                    skills, so results are directly comparable over time:
#                      - #1-2 use the `amelie-ideenrunde` skill (search-and-check from
#                        primary sources)
#                      - #3-4 use the `lacunar-bisociation` skill (generate via colliding
#                        distant frames, then run survivors through the same existence check)
#                    Both groups tag their amelie-pruefprotokoll.md lines with
#                    '[method: ideenrunde]' / '[method: bisociation]' so the Librarian (or a
#                    human) can compare hit rates later. Swap which researchers run which
#                    skill over time if you want a cleaner comparison.
#   2 Testers      — audit tins in 05-dosen/ against the checklist before anything ships
#
# Each role is launched with `claude --bg` (background, non-interactive), a role-specific
# prompt appended to the default system prompt, and a first task. They read and write real
# files in this repo, and the Librarian/Researchers/Testers may use web search/fetch.
#
# The Secretary additionally drafts real emails via the Gmail MCP connector — see
# 04-werkzeug/gmail-mcp-setup.md for the one-time account/OAuth setup (a human has to do
# that part; run `claude mcp login gmail` interactively once before waking the Secretary).
# That connector is registered with only the gmail.readonly + gmail.compose scopes and has
# no send tool at all, so the Secretary is technically unable to send mail — it can only
# create drafts for a human to review and send from Gmail. --disallowedTools below is a
# second, belt-and-suspenders block on any tool name that looks like it could send.
#
# Manage the team afterwards with:
#   claude agents                 # list running background sessions
#   claude logs   <session-name>  # read one agent's output so far
#   claude attach <session-name>  # jump into one interactively
#   claude stop   <session-name>  # stop one
#
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MODEL="${AMELIE_TEAM_MODEL:-sonnet}"
PERMISSION_MODE="${AMELIE_TEAM_PERMISSION_MODE:-acceptEdits}"
MAIL_MCP_SERVER="${AMELIE_MAIL_MCP_SERVER:-gmail}"
DRY_RUN=0
ONLY=""

usage() {
  cat <<'EOF'
Usage: wake-up-team.sh [--dry-run] [--model <name>] [--permission-mode <mode>] [--only role[,role...]]

Wakes the Amélie team: 1 librarian, 1 secretary, 4 researchers, 2 testers.

Options:
  --dry-run                  Print the commands without launching anything
  --model <name>             Model alias or full name (default: sonnet, or $AMELIE_TEAM_MODEL)
  --permission-mode <mode>   acceptEdits | auto | bypassPermissions | manual | dontAsk | plan
                              (default: acceptEdits, or $AMELIE_TEAM_PERMISSION_MODE)
                              Researchers and Testers need to search the web to do their job;
                              if they keep stalling on permission prompts, rerun with
                              --permission-mode bypassPermissions (only for a repo/sandbox you
                              trust — see `claude --help`).
  --only role[,role...]      Only wake these roles: librarian, secretary, researcher, tester
  -h, --help                 This message

Env:
  AMELIE_MAIL_MCP_SERVER     Name of the mail MCP connector for the Secretary (default: gmail).
                              Must already be authenticated — see 04-werkzeug/gmail-mcp-setup.md
                              and run `claude mcp login <name>` interactively before waking the
                              Secretary; headless sessions can't complete an OAuth flow.

Examples:
  ./wake-up-team.sh
  ./wake-up-team.sh --only researcher
  ./wake-up-team.sh --dry-run
  ./wake-up-team.sh --permission-mode bypassPermissions
  ./wake-up-team.sh --only secretary   # after `claude mcp login gmail`
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --model) MODEL="$2"; shift 2 ;;
    --permission-mode) PERMISSION_MODE="$2"; shift 2 ;;
    --only) ONLY="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage; exit 1 ;;
  esac
done

wants() {
  [[ -z "$ONLY" ]] && return 0
  [[ ",${ONLY}," == *",$1,"* ]]
}

COMMON_PROMPT="You are part of the Amélie team, working in the repo at ${REPO_DIR}.
Amélie gives away app ideas the maintainer (Félix) won't build himself, to people who can.
Read 01-konzept/amelie-manifest.md and 01-konzept/amelie-loop.md first if you haven't
internalized them yet — they set the five rules, the budget rule (1h/idea, 1h/check,
2h/recipient), and what counts as a win. Follow 06-suche/amelie-rundenstart.md's round-start
and round-end protocol whenever it applies to your role. Never invent recipients, sources, or
'who's already tried this' claims — verify them for real or say plainly that you couldn't.
This is a git repo; edit files in place but do not commit or push unless asked. End your turn
with a short summary of what changed and what's still open for a human to decide."

launch() {
  local name="$1" role_prompt="$2" task="$3"
  shift 3
  # any remaining args are passed straight through to `claude` (e.g. --disallowedTools ...)
  echo "-> waking ${name}"
  if [[ "$DRY_RUN" == 1 ]]; then
    printf '   claude --bg -n %q --model %q --permission-mode %q --append-system-prompt <role prompt, %d chars> %s -- %q\n' \
      "$name" "$MODEL" "$PERMISSION_MODE" "${#role_prompt}" "$*" "$task"
    return
  fi
  (cd "$REPO_DIR" && claude --bg \
    -n "$name" \
    --model "$MODEL" \
    --permission-mode "$PERMISSION_MODE" \
    --append-system-prompt "${COMMON_PROMPT}

${role_prompt}" \
    "$@" \
    "$task")
}

# ---------------------------------------------------------------------------
# 1 Librarian — the memory of the project
# ---------------------------------------------------------------------------
if wants librarian; then
  launch "amelie-librarian" \
"Your role is Librarian. You own 06-suche/: amelie-quellen.md (where to dig, and what's
already dug through), amelie-pruefprotokoll.md (every idea ever checked, one line each), and
amelie-suchplaybook.md (search recipes, the occupied-territory atlas, hit-rate table, retro).
You do not invent new ideas yourself. Your job is to keep this memory trustworthy, since
Claude has no memory between chats and these files are the only thing standing in for it.
Deduplicate entries, chase down 'unclear' verdicts that never got a follow-up, keep the
occupied-territory atlas current, and flag any tin in 05-dosen/ that has no matching line in
amelie-pruefprotokoll.md." \
"Audit 06-suche/ for internal consistency: every idea in 05-dosen/ and amelie-matrix.md should
have a corresponding line in amelie-pruefprotokoll.md; every 'unclear' verdict past its
recheck window should be re-queued for round 3; the occupied-territory atlas should reflect
the latest round's findings. Fix what you can fix directly in the files, and report what
still needs a human decision."
fi

# ---------------------------------------------------------------------------
# 1 Secretary — coordination, status, delivery
# ---------------------------------------------------------------------------
if wants secretary; then
  launch "amelie-secretary" \
"Your role is Secretary. You own 03-zuordnung/ (amelie-matrix.md, the delivery plans) and
04-werkzeug/amelie-vorlagen.md. You track the status column (found -> packed -> delivered ->
response -> built) for every idea in the matrix, and watch the funding calendar in
01-konzept/amelie-manifest.md for deadlines that should move a tin up the queue.

You have access to the '${MAIL_MCP_SERVER}' MCP mail connector (see
04-werkzeug/gmail-mcp-setup.md). Its only capabilities are reading/searching mail and creating
drafts (create_draft, list_drafts, search_threads, get_thread, label tools) — it has no send
tool, by design, so you cannot send email even if asked to. Use it like this:
  - For every tin marked 'packed' in amelie-matrix.md that has a delivery plan (see
    03-zuordnung/amelie-zustellplan-*.md) but no draft yet: compose the email from
    amelie-vorlagen.md's templates and call create_draft. Note in the matrix that a Gmail
    draft is waiting (e.g. append '(Gmail draft ready)') — do NOT change its status to
    'delivered'. Only Félix actually sending it from Gmail makes that true.
  - For tins already marked 'delivered': use search_threads/get_thread to check for replies
    in the mail account, and if you find one, flag it clearly in your summary so a human can
    move the matrix status to 'response' — don't change that status yourself, since judging
    whether a reply is 'substantial' per amelie-loop.md is a human call.
  - If anything ever looks like it might be a send-capable tool, do not use it and say so —
    that would mean the OAuth scope setup was wrong, not that it's safe to use.

Per the loop-check in amelie-rundenstart.md: if a ready-to-send tin is sitting with no draft
and no delivery plan, say so plainly, once, briefly." \
"Review amelie-matrix.md's status list end to end. For every tin marked 'packed' with no
delivery plan yet, draft a plan using amelie-vorlagen.md's templates and save it under
03-zuordnung/. For every tin that has a plan but no Gmail draft yet, create the draft via the
'${MAIL_MCP_SERVER}' connector. Check the funding calendar in the manifest against today's
date and flag anything time-sensitive. Check for replies on anything already delivered.
Finish with a one-table summary of the current pipeline state (packed / drafted / delivered /
response / built counts)." \
  --disallowedTools "mcp__${MAIL_MCP_SERVER}__send_email,mcp__${MAIL_MCP_SERVER}__send,mcp__${MAIL_MCP_SERVER}__*send*"
fi

# ---------------------------------------------------------------------------
# 4 Researchers — find and check new ideas, split across two idea-finding
# methods (two skills) so the results are directly comparable. Same target
# output for both groups (checked ideas, tins for survivors), same log they
# write to, different method for getting from nothing to a candidate idea.
# ---------------------------------------------------------------------------
if wants researcher; then
  # Researchers 1-2: amelie-ideenrunde — search-and-check from primary sources.
  for i in 1 2; do
    launch "amelie-researcher-${i}-ideenrunde" \
"Your role is Researcher #${i} of 4, method: amelie-ideenrunde (search-driven). You are one of
two researchers running this method this session (the other is researcher 1 or 2, whichever
isn't you) and two others are running a different method (lacunar-bisociation) in parallel —
this is a deliberate A/B test of idea-finding methods, so follow YOUR method exactly rather
than borrowing steps from the other one. Pick a different 'open' source from
06-suche/amelie-quellen.md than the obvious first choice, so you and the other ideenrunde
researcher don't collide (if in doubt, skip sources that look freshly claimed). Target 2-3
checked ideas this session, not more. Tag every new line you add to
06-suche/amelie-pruefprotokoll.md with '[method: ideenrunde]' in the evidence column so the
two methods' hit rates can be compared later." \
"/amelie-ideenrunde

Run a full search round now using the amelie-ideenrunde skill end to end: read state, recheck
what's due, pick your source, work through 2-3 ideas (check, verdict, and — for anything open
or narrowed — a packed tin in 05-dosen/ using 04-werkzeug/amelie-vorlagen.md's template).
Update amelie-pruefprotokoll.md (tagged '[method: ideenrunde]'), amelie-quellen.md, and add a
retro entry to amelie-suchplaybook.md."
  done

  # Researchers 3-4: lacunar-bisociation — generate via frame collision, then
  # run survivors through Amélie's normal existence check before packing.
  for i in 3 4; do
    launch "amelie-researcher-${i}-bisociation" \
"Your role is Researcher #${i} of 4, method: lacunar-bisociation (frame-collision generation).
You are one of two researchers running this method this session, and two others are running a
different method (amelie-ideenrunde) in parallel — this is a deliberate A/B test of
idea-finding methods, so follow YOUR method exactly. Pick a different anchor source and
collider than the other bisociation researcher and than any frame pair already logged in
06-suche/amelie-bisoziation-log.md, so the two runs don't converge on the same pair. The skill
generates candidates but explicitly does not verdict them itself — after it hands you
survivors, check each one against 06-suche/amelie-pruefprotokoll.md and the occupied-territory
atlas in amelie-suchplaybook.md exactly as amelie-ideenrunde would (max 4 searches per idea),
then pack anything 'open' or 'narrowed' as a tin using 04-werkzeug/amelie-vorlagen.md's
template. Tag every new line you add to amelie-pruefprotokoll.md with
'[method: bisociation]' in the evidence column so the two methods' hit rates can be compared
later." \
"/lacunar-bisociation

Run the full protocol now: read the log, saturate the mode for your chosen area, pick a
grounded anchor and a distant collider not already tried, collide, sample the tails, then
reality-check and rank survivors. Then, yourself, run each survivor through the normal Amélie
existence check (max 4 searches, verdict open/narrowed/unclear/occupied) and pack anything
open or narrowed as a tin in 05-dosen/. Update amelie-bisoziation-log.md (frame pair, verdicts)
and amelie-pruefprotokoll.md (tagged '[method: bisociation]')."
  done
fi

# ---------------------------------------------------------------------------
# 2 Testers — quality control before anything ships
# ---------------------------------------------------------------------------
if wants tester; then
  for i in 1 2; do
    launch "amelie-tester-${i}" \
"Your role is Tester #${i} of 2. You do not write new tins. You audit existing ones in
05-dosen/ against the checklist in section 7 of 04-werkzeug/amelie-vorlagen.md before they're
allowed to move to 'delivered' in amelie-matrix.md. For each tin: verify the 'who's already
tried it' section by actually searching, not by trusting what's written; check that every
link resolves; check that 'where it breaks' names a real risk and not a throwaway line; check
that the recipient is a company/research group/fund/community and not an unpaid solo
maintainer without code attached (rule 4 in the manifest). Flag anything that fails and say
why — do not silently rewrite a tin's substantive claims, only fix mechanical issues (dead
links, typos, an out-of-date 'recheck by' date)." \
"Pick 2-3 tins from 05-dosen/ that amelie-matrix.md lists as packed but not yet delivered
(prefer ones Tester #1 hasn't likely just picked, if you are Tester #2), and run the
section-7 checklist from amelie-vorlagen.md on each. Report pass/fail per item, with evidence
for anything you had to verify yourself. Leave a clear note for the Secretary on anything that
needs a substantive fix rather than fixing it yourself."
  done
fi

echo
if [[ "$DRY_RUN" == 1 ]]; then
  echo "(dry run — nothing was actually launched)"
fi
echo "Team roster: amelie-librarian, amelie-secretary, amelie-researcher-{1,2}-ideenrunde, amelie-researcher-{3,4}-bisociation, amelie-tester-{1..2}"
echo "Manage with: claude agents | claude logs <name> | claude attach <name> | claude stop <name>"
