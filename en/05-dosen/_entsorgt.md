# Discarded — ideas that already exist

Rule 7 says: whatever no longer holds gets **deleted, not archived**. The dead idea banks of the last forty years are graveyards because nobody ever threw anything away.

This file is the exception to that rule, and its justification at the same time: it records **why** something is gone, so the idea doesn't get written up again in six months. It contains no tins and never will.

**Check date: September 2026.**

---

## git-archaeologist (MCP)

**Original idea:** repo history as a question interface — "why does this line exist?" → blame + PR + issue + discussion as one chain.

**Why it's gone:** built multiple times, by different people, within a few months. Found, among others: an MCP server that literally "answers why code exists — git blame, PR descriptions, and linked issues," a second one called "codebase-archaeology" that reconstructs rationale from history, PR discussions, and issues and **traces every claim back to a commit or comment**, plus further git-intelligence servers. GitKraken documents its own MCP tools for investigating code history.

**What this says about the idea:** it was right. Several people independently arrived at it as soon as MCP existed. That's a good sign for the idea radar and a bad one for lead time — for obvious tooling ideas in an active ecosystem, the window is **months, not years**.

---

## Home-Network MCP

**Original idea:** router as a tool server — who's on the network, bandwidth, toggling DNS blocklists, via chat instead of a web UI.

**Why it's gone:** found at least **four** independent FRITZ!Box MCP servers, listed in several directories, some explicitly "for managing AVM Fritz!Box routers from Claude Code." Plus Home Assistant with MCP integration in both directions.

**What this says about the idea:** same pattern, even more pronounced. "Common device + new protocol" is the single most densely occupied niche there is. If an idea can be described in one sentence and the hardware is widespread, it already exists.

---

## Repo Museum

**Original idea:** a walkable 3D gallery of your own repos — repo = room, commits = exhibits, dead branches = basement.

**Why it's gone:** already built and published ("I turned a GitHub repo into a walkable 3D city"). There's also a long prehistory: CodeCity as research, Gource as a film, GitHub Skyline as a gimmick.

**Honest about the remaining gap:** the museum metaphor — exhibits, basement, curation — is a **design difference, not a new capability**. That's not enough for a tin. Anyone who still finds it appealing can build it for themselves, just not as a gift.

---

## Commute Oracle

**Original idea:** no official ETA, but a model that learns your own logged trips and tells you when you really need to leave.

**Why it's gone:** commercially occupied. Citymapper introduced AI-driven, personalized route planning in 2026; dedicated products for "when do I need to leave" already exist; Google Maps has had commute features for years.

**Honest about the remaining gap:** a local, account-free, open variant specifically for Berlin would still be open — but it competes against companies with real-time data an individual doesn't have. That's not a gift, that's an imposition. Gone.

---

## The pattern behind all four

Four of nineteen ideas are dead, and they're not randomly distributed:

| Area | Result |
|---|---|
| **Developer tooling in an active ecosystem** (MCP, git, routers) | almost completely occupied |
| **Beautiful demos** (3D visualization, DLA, fluid sim) | built many times over, residual value sits in the boring part |
| **Commercially attractive consumer apps** (commuting, dream interpretation) | occupied by companies |
| **Civil society, public administration, associations** (bulky waste, noise, apartment physics, lockpicking education) | **open** |

**The lesson, and it's the most valuable one of the day:** what's open is exactly what nobody can make money from and for which no developer scene exists. That matches exactly the finding from `amelie-bewegungen.md` — voluntarism doesn't scale against economic interest, so giving things away works where nothing big is at stake.

That's not a limitation of the model. It's its domain, and, of all places, the one where gifts do the most good.

**Consequence for the loop:** for tooling ideas the window is short — check immediately, deliver or discard immediately. For civil-society ideas it's long, and care pays off there. The 1:2 budget rule still holds, but the check step belongs **before** packing, not after: an hour of searching would have prevented all four of these tins in the first place.
