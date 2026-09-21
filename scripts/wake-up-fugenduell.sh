#!/usr/bin/env bash
# wake-up-fugenduell.sh — spin up a task-specific Amélie team for ONE job:
# check and pack the second crack-flora tin, "Fugenduell" (the game layer), without
# touching the tin that already exists for the record layer.
#
# Context this team needs to know (it is in every role prompt below):
#   - 05-dosen/crack-flora-watcher.md is ALREADY PACKED, verdict 'verengt' (Seek covers the
#     basic idea), recipient #Krautschau/Senckenberg, mails 8 and 9 in src/data/deliveries.ts
#     are written but UNSENT. That tin is not to be rewritten by this team.
#   - That tin's "Nicht dabei" section explicitly excludes a leaderboard, a social feed and
#     competition between users. The new material (a custody/battle game) IS that excluded
#     section, which is why it becomes a SECOND tin and not an edit of the first one.
#   - The brainstorm lives in Google Drive and must be in the repo before this team starts;
#     see BRAINSTORM_DIR below.
#
# Phases, because packing before the verdicts exist is how a tin gets a claim it can't keep:
#   Phase 0           — archivist: pulls the brainstorm out of Google Drive into the repo.
#                       Run once. Needs a Drive connector in the session; if there is none,
#                       export the files by hand and skip this phase.
#   Phase 1 (default) — 3 checkers, one load-bearing claim each, max 4 searches per idea,
#                       at least one ENGLISH product search each (the "Dose altert" rule).
#                       They write verdicts only. They do NOT pack anything.
#   Phase 2           — packer, tester, secretary (+ optional designer). Run this only after
#                       phase 1's lines are in 06-suche/amelie-pruefprotokoll.md.
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
BRAINSTORM_DIR="${AMELIE_FUGENDUELL_BRAINSTORM:-02-recherche/fugenduell-brainstorm}"
DOSE_SLUG="fugenduell"
PHASE=1
DRY_RUN=0
ONLY=""
SKIP_BRAINSTORM_CHECK=0

usage() {
  cat <<'EOF'
Usage: wake-up-fugenduell.sh [--phase 0|1|2] [--dry-run] [--model <name>]
                             [--permission-mode <mode>] [--only role[,role...]]
                             [--skip-brainstorm-check]

Task team for the second crack-flora tin ("Fugenduell", the game layer).

  Phase 0:           archivar                                       — Drive -> repo, run once
  Phase 1 (default): pruefer-custody, pruefer-stats, pruefer-feld   — verdicts only
  Phase 2:           packer, tester, secretary, designer(optional)  — tin, audit, delivery

Options:
  --phase 0|1|2              Which phase to wake (default: 1)
  --dry-run                  Print the commands without launching anything
  --model <name>             Model alias or full name (default: sonnet, or $AMELIE_TEAM_MODEL)
  --permission-mode <mode>   acceptEdits | auto | bypassPermissions | manual | dontAsk | plan
                              (default: acceptEdits, or $AMELIE_TEAM_PERMISSION_MODE)
                              The checkers need web search; if they stall on prompts, rerun
                              with --permission-mode bypassPermissions (trusted sandbox only).
  --only role[,role...]      Subset of: archivar, pruefer-custody, pruefer-stats,
                              pruefer-feld, packer, tester, secretary, designer
  --skip-brainstorm-check    Start even if the brainstorm folder is missing/empty
  -h, --help                 This message

Env:
  AMELIE_FUGENDUELL_BRAINSTORM  Where the Drive brainstorm lives in the repo
                                 (default: 02-recherche/fugenduell-brainstorm)
  AMELIE_MAIL_MCP_SERVER        Mail connector for the Secretary (default: gmail).
                                 Drafts only, no send scope — see 04-werkzeug/gmail-mcp-setup.md
                                 and run 'claude mcp login gmail' interactively once first.

Examples:
  ./wake-up-fugenduell.sh --dry-run
  ./wake-up-fugenduell.sh --phase 0             # once: pull the brainstorm out of Drive
  ./wake-up-fugenduell.sh                       # phase 1: the three checkers
  ./wake-up-fugenduell.sh --phase 2             # after the verdicts are in the protocol
  ./wake-up-fugenduell.sh --phase 2 --only secretary
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --phase) PHASE="$2"; shift 2 ;;
    --dry-run) DRY_RUN=1; shift ;;
    --model) MODEL="$2"; shift 2 ;;
    --permission-mode) PERMISSION_MODE="$2"; shift 2 ;;
    --only) ONLY="$2"; shift 2 ;;
    --skip-brainstorm-check) SKIP_BRAINSTORM_CHECK=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; usage; exit 1 ;;
  esac
done

case "$PHASE" in
  0|1|2) ;;
  *) echo "--phase must be 0, 1 or 2" >&2; exit 1 ;;
esac

wants() {
  [[ -z "$ONLY" ]] && return 0
  [[ ",${ONLY}," == *",$1,"* ]]
}

# ---------------------------------------------------------------------------
# Guard: the brainstorm has to be in the repo, or every agent will invent it.
# ---------------------------------------------------------------------------
ABS_BRAINSTORM="${REPO_DIR}/${BRAINSTORM_DIR}"
if [[ "$SKIP_BRAINSTORM_CHECK" == 0 && "$DRY_RUN" == 0 && "$PHASE" != 0 ]]; then
  if [[ ! -d "$ABS_BRAINSTORM" ]] || [[ -z "$(ls -A "$ABS_BRAINSTORM" 2>/dev/null)" ]]; then
    cat >&2 <<EOF
ERROR: no brainstorm material found at ${BRAINSTORM_DIR}/

This team must read the actual design docs, not reconstruct them from a prompt.
Fetch them first:

  ./scripts/wake-up-fugenduell.sh --phase 0

Phase 0 wakes the archivist, which pulls the nine files out of the Drive folder
(see 02-recherche/fugenduell-briefing-2026-09-21.md for the folder link and the
file IDs). If this session has no Drive connector, export them by hand into
${BRAINSTORM_DIR}/ instead.

To start without the material anyway (not recommended): --skip-brainstorm-check
EOF
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# Shared context for every role in this team.
# ---------------------------------------------------------------------------
COMMON_PROMPT="You are part of the Amélie team, working in the repo at ${REPO_DIR}.
Amélie gives away app ideas the maintainer (Félix) won't build himself, to people who can.
Read 01-konzept/amelie-manifest.md and 01-konzept/amelie-loop.md first if you have not
internalized them — they set the five rules, the budget (1h/idea, 1h/check, 2h/recipient) and
what counts as a win. Follow 06-suche/amelie-rundenstart.md where it applies to your role.

THIS SESSION HAS ONE JOB: the second crack-flora tin, working slug '${DOSE_SLUG}' — the game
layer (custody of a single wild plant in a pavement joint, Fugenduell battles, substrate as
arena, stats derived from plant-trait databases). The source material is in
${BRAINSTORM_DIR}/ — read it before you form any opinion about it.

What is already true and is NOT yours to change:
  - 05-dosen/crack-flora-watcher.md is packed, verdict 'verengt' (Seek/iNaturalist already
    gamifies discovering crack plants; the surviving gap is the longitudinal trace of ONE
    plant plus #Krautschau/GBIF-compatible export). Recipient: #Krautschau / Senckenberg,
    fallback Flora Incognita. Mails 8 and 9 in src/data/deliveries.ts are written but unsent.
  - That tin's 'Nicht dabei' section rules out a leaderboard, a social feed and competition
    between users. That is exactly what '${DOSE_SLUG}' is. So this is a SECOND, NEIGHBOURING
    tin, cross-linked to the first — never a rewrite of it, and never a merge. If your work
    would require editing crack-flora-watcher.md, stop and say so instead.

Hard rules for everyone in this team:
  - Never invent recipients, sources, prior art, or 'who has already tried this' claims.
    Verify them, or write plainly that you could not.
  - NO EMAIL ADDRESS may be written into any file unless you copied it from the
    organisation's own page in this session and can cite that URL. Two existing mails carry
    guessed addresses; that is the bug this rule exists for.
  - Do not set the tin's verdict to 'behalten' (keep). Rule 5 caps kept ideas at two and both
    slots are taken (Spec-Drift Detector, Wet Ink). Keeping this one is Félix's call alone.
  - This is a git repo: edit files in place, do not commit or push.
  - End your turn with a short summary of what changed and what still needs a human decision."

launch() {
  local name="$1" role_prompt="$2" task="$3"
  shift 3
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

CHECKER_COMMON="You are a checker in phase 1. You write VERDICTS, not tins. Do not create or
edit anything in 05-dosen/. Max 4 searches for your claim, and at least one of them must be an
English product search — the 'Dose altert' rule exists because two German-only checks were
overturned by a single English search. Use the search order in
.claude/skills/amelie-ideenrunde/references/suchmethode.md: the likely recipient first.
Pre-filter against 06-suche/amelie-pruefprotokoll.md and the occupied-territory atlas in
06-suche/amelie-suchplaybook.md before searching at all — a hit there is a verdict without a
search. Verdicts are: frei / verengt (name the residual gap in one sentence) / unklar (say how
to search differently next time) / besetzt (with a source no older than 12 months).
Append your line(s) to 06-suche/amelie-pruefprotokoll.md in the current round's section,
tagged '[method: ideenrunde] [dose: ${DOSE_SLUG}]', and update the status of any source you
used in 06-suche/amelie-quellen.md. Keep out of the other two checkers' claims."

# ===========================================================================
# PHASE 0 — get the brainstorm out of Drive and into the repo. Run once.
# ===========================================================================
if [[ "$PHASE" == 0 ]]; then

if wants archivar; then
  launch "fugen-archivar" \
"Your role is Archivist, and you run before anyone else. Your only job is to bring the
brainstorm out of Google Drive into ${BRAINSTORM_DIR}/ so the rest of the team reads the real
documents instead of a summary of them. You do not judge the material, you do not search the
web, you do not write a tin.

Source folder (owner: felixinberlin@googlemail.com):
  https://drive.google.com/drive/folders/1SpOXV-qyePWMok_YLkjBP85GO2nISWCX

Nine files plus an images/ subfolder. Fetch each by ID — do not search by name, and never
guess an ID:
  1Y9vY0MeCzeOMakf85oUPqftdVh2w46O3  Mechanics.md          core loop, claim model, battles, prior art sec. 8
  1eJ0KKs-rhfgg4OJfGDvjdI_FL4PBGgNO  skill-tree.md         the 6 stats and their trait sources
  1Aqa94k3i49N102ZBBPDu6_kBmEwrmDqN  data-flora-quellen.md every data source per RPG element
  1-cL3WhDPlcgo0TEUC59UoIh4LA1q3n87  economy.txt           seed market, cross-city trading
  1QhPh1geZXSI6vff-35GsHXNQobG3ZRrc  fungenduell-caring.md custody/Chronist reframe
  1_S1zTp8KE-Cp78JfgnIjlmt__t79x3c-  fungenduel-retencion.md  Pacht model, re-engagement window
  1aFBJoFwBDhz_exF2YzeOR7-v6m5zDw-M  crack-flora-starter-roster.docx  14 species, CSR, 36-point budget
  1Y7q9xrcSxoKtERXgzSy5kbJpK_ufjmyu  dandelion.md          worked example card
  1rFEvM84Q5-eyaRsOUTjsmOdidAObdCD8  muraria.md            worked example card
  1KWvyo-eZmZkuVbMp1q36EtRpJ9OyFtJh  images/               subfolder — list it and fetch what is in it

Rules for this job:
  - Keep the original filenames and the original content. Do not summarize, reformat,
    translate, fix or 'improve' anything — later roles check these documents against each
    other, and an edited copy makes that impossible. The .docx stays a .docx.
  - Write a short ${BRAINSTORM_DIR}/README.md: source folder URL, fetch date, one line per
    file saying what it contains, and the Drive modifiedTime of each so a later round can
    tell whether the material has moved on.
  - If a file will not fetch, say which one and why. Do not substitute anything for it, and do
    not reconstruct it from the briefing — a missing document is a fact the team needs, not a
    gap to fill.
  - If this session has no Drive connector at all, stop immediately and say so plainly. Do not
    improvise a workaround." \
"Fetch the nine files and the images/ subfolder listed in your role prompt into
${BRAINSTORM_DIR}/, unchanged, keeping their names. Then write ${BRAINSTORM_DIR}/README.md as
described. Finish with a table of what landed (filename, size, Drive modifiedTime) and a plain
list of anything that did not, so phase 1 knows what it is working without."
fi

fi

# ===========================================================================
# PHASE 1 — three load-bearing claims, one checker each
# ===========================================================================
if [[ "$PHASE" == 1 ]]; then

if wants pruefer-custody; then
  launch "fugen-pruefer-custody" \
"${CHECKER_COMMON}

YOUR CLAIM (the one the whole tin rests on): 'Nobody has made custody of a single, specific
wild plant into a game mechanic.' Everything in ${BRAINSTORM_DIR}/ that is genuinely new sits
here — the Chronist/Hüter/Erstsichter roles, the 21-day custody clock, challenges by photo,
battle or knowledge quiz, and Pacht (lease) instead of ownership.

Section 8 of Mechanics.md already lists prior art the author collected himself: Pl@nt Game
(PlantNet/INRIA, has duels), Tevi, Floracaching (check-in plus phenology reporting),
QuestaGame, iNatGuessr, Plant 'Em All, Leafari, Botanica, Taxosearch. Start by verifying those
claims are current rather than re-finding them, then go after what they do NOT cover: does any
of them stake a claim on one individual organism that can be LOST to another player?
Also probe adjacent fields the author has not looked at: adopt-a-tree / Baumpatenschaft
schemes, geocaching custody mechanics (the 'cache owner' role and its maintenance duty),
Pokémon-GO-style gym control as a model for a fixed real-world point, and wildlife
'individual ID' citizen science (individually named and followed animals).
Report whether the residual gap survives, and if it narrows, say to what exactly." \
"Run your check now: read ${BRAINSTORM_DIR}/Mechanics.md (sections 2, 4, 5, 8) and
fungenduell-caring.md plus fungenduel-retencion.md, pre-filter against the protocol and the
atlas, then spend at most 4 searches (at least one in English, product-level) on the custody
claim. Write your verdict line(s) into 06-suche/amelie-pruefprotokoll.md tagged
'[method: ideenrunde] [dose: ${DOSE_SLUG}]', update 06-suche/amelie-quellen.md, and end with
the one-sentence residual gap the packer should put in the tin."
fi

if wants pruefer-stats; then
  launch "fugen-pruefer-stats" \
"${CHECKER_COMMON}

YOUR CLAIM: 'Nobody turns real plant-trait databases into playable stats.' The material derives
six stats (WURZEL, TRITT, DÜRRE, SAAT, TEMPO, CHEMIE) from TRY, LEDA, SID Kew, UNDERPLOT and
Cole & Bayfield trampling protocols, classifies species by Grime's CSR triangle, and balances
all of it across a 36-point budget.

Check two things, and keep them separate:
  1. Existence — is there already a game, teaching tool or published dataset-to-stats mapping
     that does this? Look at ecology teaching games, trait-database outreach projects, and the
     TRY/LEDA citation trail for anything game-shaped, not just at app stores.
  2. Soundness — and this is the more valuable half. Two claims in the material contradict
     each other: 'every number traces back to a real measurement' and 'balanced across a
     36-point budget'. Balancing overrides the measurement. Separately, the CSR triangle is
     rendered as rock-paper-scissors (C beats R, R beats S, S beats C), which is a design
     fiction, not Grime's ecology. Verify how CSR actually behaves in the literature and state
     plainly whether the RPS framing can be kept while claiming scientific derivation.
     If it cannot, name the fork: either the data decides and imbalance is the content (a
     stress-tolerator simply loses on a trampled pavement joint — that IS the lesson), or the
     numbers are declared game numbers. The tin may not claim both.
This is the same failure mode as the 'Bruchlesen' finding in round 5: a player learns the
simulation instead of the material. Say whether it applies here." \
"Run your check now: read ${BRAINSTORM_DIR}/skill-tree.md and the starter-roster document,
pre-filter against the protocol and the atlas, then spend at most 4 searches (at least one in
English) on the existence question, and use the literature for the CSR/balance question.
Write your verdict line(s) into 06-suche/amelie-pruefprotokoll.md tagged
'[method: ideenrunde] [dose: ${DOSE_SLUG}]' and end with a clear recommendation on the
data-vs-balance fork for the packer to put under 'Wo es kippt'."
fi

if wants pruefer-feld; then
  launch "fugen-pruefer-feld" \
"${CHECKER_COMMON}

YOU HAVE TWO CLAIMS, both about the field this tin lands in.

CLAIM A — tooling: 'There is no game layer on Krautschau, and no German street-segment
protocol.' Check the German and French branches: Krautschau (Senckenberg, coordinated by
Dr. Julia Krohmer), Flora Incognita's project-tag mechanism, Sauvages de ma rue / Tela
Botanica / Vigie-Nature and its 2026 entry tool, and Seek/iNaturalist. Note explicitly
whether anything has appeared since the September 2026 check in crack-flora-watcher.md.

CLAIM B — acceptability, which decides whether the tin is deliverable at all: can a research
society or nature-conservation body endorse a game that makes people tend and defend plants
in pavement joints? Check, with sources:
  - Neophytes and invasive species. Ailanthus altissima is on the EU list of invasive alien
    species of Union concern; the roster already bans it, but Buddleja davidii and Erigeron
    canadensis are in the roster and are neophytes. Find out what the legal and
    conservation-policy position actually is on encouraging their protection.
  - The movement's own norm: Krautschau is chalk-and-photograph, not touch. State whether
    'Fugenpflege' (crack care) can only ever mean observation, never intervention, and say so
    as a design rule rather than a footnote.
  - Municipal reality: street sweeping, road-safety duties, and whether a custody claim on a
    plant in public space creates any conflict worth naming.
Do not soften what you find. If claim B kills the recipient type, that is the most useful
thing this team will learn today." \
"Run your check now: read ${BRAINSTORM_DIR}/Mechanics.md section 7 (the roster) and
05-dosen/crack-flora-watcher.md so you do not repeat its research, then spend at most 4
searches on claim A and up to 4 on claim B (at least one English search overall). Write your
verdict line(s) into 06-suche/amelie-pruefprotokoll.md tagged
'[method: ideenrunde] [dose: ${DOSE_SLUG}]', update 06-suche/amelie-quellen.md, and end with
the design rules and risks the packer must carry into 'Wo es kippt' verbatim."
fi

fi

# ===========================================================================
# PHASE 2 — pack, audit, deliver
# ===========================================================================
if [[ "$PHASE" == 2 ]]; then

if wants packer; then
  launch "fugen-packer" \
"Your role is Packer. You write exactly one file: 05-dosen/${DOSE_SLUG}.md, following
.claude/skills/amelie-ideenrunde/references/dose-format.md and the full template in
04-werkzeug/amelie-vorlagen.md (the project file wins where they differ). ONE PAGE. A design
document is not a tin; the brainstorm in ${BRAINSTORM_DIR}/ is roughly a hundred kilobytes and
your job is to throw almost all of it away.

Preconditions — check these first and stop if they are not met: 06-suche/amelie-pruefprotokoll.md
must contain lines tagged '[dose: ${DOSE_SLUG}]' from all three phase-1 checkers. Never write
a 'Wer es schon versucht hat' section from your own guesswork; it is quoted from those lines,
with their sources.

What the tin must contain beyond the template:
  - Skizze: the one mechanic that makes the game worth building is that the ARENA IS THE
    SUBSTRATE. The first tin's research found that the record does not distinguish a
    Pflasterfuge from a Mauerritze from a Baumscheibe. Here that missing field is the game's
    stat weighting, so playing collects it. Say that plainly; it is the reason the two tins
    are neighbours. Second point worth keeping: the 21-day custody clock and the phenological
    revisit interval are the same interval.
  - Nicht dabei: no seed market and no cross-city trading in version one (it is the part that
    invites faked lineage), no intervention in the plant, no leaderboard across cities.
  - Erster Schritt: one ticket, and it is the load-bearing wall — re-identifying the SAME
    individual plant in the same crack from a phone photo weeks later. Everything else
    (levels, custody, quiz, lineage) assumes it works. Make it cheap and falsifiable:
    about 30 crack plants, three visits over six weeks, and a 'fertig, wenn' that a human can
    check. If re-ID fails, the game is an honour system and the tin should say so.
  - Wo es kippt: at least the three risks the checkers hand you — the data-vs-balance
    contradiction and the CSR rock-paper-scissors fiction, the re-ID wall, and the
    neophyte/conservation conflict plus the observation-only rule. Unsoftened.
  - A cross-link both ways: name 05-dosen/crack-flora-watcher.md as the neighbouring tin and
    say in one line how the two differ (record layer for an institution vs. game layer).
    Do not edit that file; leave the Secretary a note asking for the back-link.
  - Verdikt: 🎁 or 🔨 (skeleton first). Not 🔒.
  - Stand: today. Prüfen ab: today + 12 months (game/tooling field moves faster — if the
    checkers argue for 6, use 6 and say why).
  - The Amélie pledge block and the CC0 line, verbatim from the template." \
"Read the three '[dose: ${DOSE_SLUG}]' verdict blocks in 06-suche/amelie-pruefprotokoll.md,
then ${BRAINSTORM_DIR}/ in full, then write 05-dosen/${DOSE_SLUG}.md as a single page.
Afterwards, self-check against section 7 of 04-werkzeug/amelie-vorlagen.md and list which
items you could not satisfy and why. Do not add the tin to amelie-matrix.md — that is the
Secretary's file. Finish with the three sentences you would put in a delivery email, and name
the one claim in the tin you are least sure of."
fi

if wants tester; then
  launch "fugen-tester" \
"Your role is Tester. You do not write tins. Audit 05-dosen/${DOSE_SLUG}.md against the
checklist in section 7 of 04-werkzeug/amelie-vorlagen.md, and verify — by searching yourself,
not by trusting the file — every claim in its 'Wer es schon versucht hat' section. Check that
every link resolves. Check that 'Wo es kippt' names risks that could actually kill the idea
rather than throwaway lines.

Three checks specific to this tin:
  1. Contradiction check: read 05-dosen/crack-flora-watcher.md and confirm the new tin does
     not quietly promise what that one rules out, and does not re-use its recipient. Two tins
     to the same recipient with opposite promises is the failure to catch here.
  2. Rule 4: the recipient must be a company, research group, fund or community — not an
     unpaid solo maintainer, unless runnable code ships with it.
  3. Length: if it does not read as one page, say so. A tin that grew into a design document
     has stopped being a gift.
Fix mechanical problems only (dead links, typos, a stale 'Prüfen ab' date). Never silently
rewrite a substantive claim — flag it for the Packer or Félix instead." \
"Audit 05-dosen/${DOSE_SLUG}.md now, item by item against section 7 of amelie-vorlagen.md,
with evidence for anything you verified yourself. Report pass/fail per item, then the three
specific checks above. Leave a clear note for the Secretary about anything that must be fixed
before delivery, and state plainly whether this tin is ready to leave the shelf."
fi

if wants secretary; then
  launch "fugen-secretary" \
"Your role is Secretary. You own 03-zuordnung/ and 04-werkzeug/amelie-vorlagen.md. Two jobs
this session, in this order — the second one is the more urgent, because it is blocking
something already written.

JOB 1 — the queue that exists. src/data/deliveries.ts holds nine mails. Mails 1-3 have a
sentAt date (2026-09-20, 2026-09-21, 2026-09-21). Mails 4-9 are written and unsent, and mails
8 and 9 carry the crack-flora-watcher tin to Senckenberg and Flora Incognita. Those two are
NOT send-ready, for three reasons you should fix or flag:
  (a) They contain email addresses that were guessed, not verified. The tin itself says to
      copy the address from the organisation's own page. Verify both against the live pages
      and cite the URL; if you cannot verify one, remove the address and say so.
  (b) Seek/iNaturalist does not appear in either mail, yet the tin's verdict is 'verengt'
      BECAUSE of Seek. Sending a Krautschau coordinator a mail that omits the tool they know
      is exactly the EnergyMap and Hush City mistake. Add the 'so you can see my homework'
      paragraph, modelled on mail 2.
  (c) Tone: both open with flattery and offer a 'vollständiges Produkt- und Interaktions-
      konzept'. Per rule 4 that reads as an offer, not a gift. Rewrite to the dry register of
      mails 1-3, and keep the sentence saying no reply is needed.
  Also: the tin lists Flora Incognita as the FALLBACK recipient. Sending 8 and 9 at once
  contradicts one addressee per tin — recommend an order and say why.

JOB 2 — the new tin. Once 05-dosen/${DOSE_SLUG}.md exists and the Tester has cleared it: add
its row to 03-zuordnung/amelie-matrix.md (status 'gepackt'), and research its recipient
properly — 2h budget, and 'what has this group actually built lately', not 'who might find
this interesting'. Candidate directions, all to be verified rather than assumed: a freelancer
or small team who could apply to the Prototype Fund (window opens 1 October 2026; only
freelancers, self-employed people and a GbR of at most four are eligible, so NOT Senckenberg
and NOT an institute), an HCI or citizen-science-gamification research group with a
publication record in this exact area, and a games-for-science community. Check the funding
calendar in the manifest against today's date and say what the deadline implies.

You have the '${MAIL_MCP_SERVER}' MCP mail connector: read/search and create_draft only, no
send tool by design. Create drafts; never mark anything 'zugestellt' — only Félix sending it
makes that true." \
"Start with job 1: verify the two addresses in mails 8 and 9 against the organisations' own
pages, rewrite both mails per (b) and (c) in src/data/deliveries.ts, and recommend a send
order. Then job 2, as far as the new tin's state allows — if 05-dosen/${DOSE_SLUG}.md does not
exist yet, do the recipient research anyway and write it to
03-zuordnung/${DOSE_SLUG}-empfaenger-<today as YYYY-MM-DD>.md without touching the matrix.
Finish with
a pipeline table (gepackt / entworfen / zugestellt / Antwort / gebaut) and a list of what needs
Félix before anything can be sent." \
  --disallowedTools "mcp__${MAIL_MCP_SERVER}__send_email,mcp__${MAIL_MCP_SERVER}__send,mcp__${MAIL_MCP_SERVER}__*send*"
fi

if wants designer; then
  launch "fugen-designer" \
"Your role is Designer. You own 07-demos/${DOSE_SLUG}/. Build demo.html, pitch.html and
README.md exactly per the rules in scripts/wake-up-team.sh's designer role and 07-demos/README.md:
ONE self-contained file each, inline CSS/JS, no build step, no CDN, no network calls, opens by
double-click, works offline, phone width, dark mode, keyboard operable, respects
prefers-reduced-motion. Note that src/components/simulators/CrackFloraSimulator.tsx already
exists for the FIRST tin — read it so your demo does not duplicate it, but do not modify it or
anything else under src/.

The demo that earns its keep here is the battle log: pick two species from the roster, one
arena, six rounds, and show the full arithmetic the way Mechanics.md section 5.9 does — base
stat, arena modifier, CSR modifier, tactic, effective value, coverage change. A player who
sees the math sees immediately whether the numbers are ecology or balance, which is the open
question about this idea. Label everything on screen as 'Skizze / mockup — not a working
product' and mark sample data as sample data. 'Wo es kippt' and 'Wer es schon versucht hat'
appear in the pitch unsoftened. Budget: about an hour." \
"Read 05-dosen/${DOSE_SLUG}.md (stop and say so if it does not exist yet),
${BRAINSTORM_DIR}/Mechanics.md section 5, and src/components/simulators/CrackFloraSimulator.tsx
for context. Build 07-demos/${DOSE_SLUG}/{demo.html,pitch.html,README.md}, then verify your own
output: grep for 'http' to confirm there are no external URLs, and confirm every claim in the
pitch appears in the tin. Update 07-demos/README.md. Finish with what you built, what is faked,
and whether the demo made you doubt any number in the tin."
fi

fi

echo
if [[ "$DRY_RUN" == 1 ]]; then
  echo "(dry run — nothing was actually launched)"
fi
if [[ "$PHASE" == 0 ]]; then
  echo "Phase 0 roster: fugen-archivar"
  echo "When ${BRAINSTORM_DIR}/ holds the documents, run:"
  echo "  ./scripts/wake-up-fugenduell.sh"
elif [[ "$PHASE" == 1 ]]; then
  echo "Phase 1 roster: fugen-pruefer-custody, fugen-pruefer-stats, fugen-pruefer-feld"
  echo "When their verdict lines are in 06-suche/amelie-pruefprotokoll.md, run:"
  echo "  ./scripts/wake-up-fugenduell.sh --phase 2"
else
  echo "Phase 2 roster: fugen-packer, fugen-tester, fugen-secretary, fugen-designer (--only designer)"
fi
echo "Manage with: claude agents | claude logs <name> | claude attach <name> | claude stop <name>"