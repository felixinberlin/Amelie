# Fugenduell — How many cards? Research and a full example card

Status: Draft, 11.10.2026. Supplements `regelwerk-v0.1.md` (§4/§5) and replaces its deck size "30 to 34" with exact numbers. Not playtested.

---

## 1. What other card games do with card counts

| Game | Own deck | Opening hand / draw | Game length | Share of deck seen per game | Collection |
|---|---|---|---|---|---|
| **Marvel Snap** | 12 | 3, then 1 per turn (4 on turn 1); hand max 7 | 6 turns | 9 of 12 ≈ **75 %** | several hundred cards |
| **Slay the Spire** | start 10 (Ironclad: 5 Strike, 4 Defend, 1 Bash), grows during the run | draw 5 per turn, discard at end of turn | fight 3–8 turns | **> 100 %** (reshuffled several times) | about 75 per character + colourless |
| **Dominion** | start 10 (7 Copper, 3 Estates) | hand 5 | 15–20 turns | > 100 % | 10 kingdom piles per game |
| **Hearthstone** | 30 | 3–4, then 1 per turn | 8–12 turns | ≈ 40–50 % | thousands |
| **Yu-Gi-Oh!** | 40–60, max 3 copies | 5, then 1 per turn | often 3–5 turns | ≈ 20–25 %, strongly evened out by search effects | > 13,000 |
| **Magic** | 60 (Limited 40) | 7, then 1 per turn | 7–10 turns | ≈ 25 % | > 25,000 |
| **Pokémon TCG** | 60, 6 prize cards | 7, then 1 per turn | 6–10 turns | ≈ 25–30 % | thousands |
| **Phylo** | starter product 48 cards (no fixed deck rule found) | — | — | — | 20–30 open community decks |
| **Wingspan** | no own deck (170 bird cards shared) | — | 4 rounds | — | 170 + expansions |
| **Forest Shuffle** | shared deck | hand limit 10 | — | — | — |

Figures are checked where there are sources (see below). The share seen is our own calculation from deck, hand and typical length. Hearthstone, Magic and Yu-Gi-Oh game lengths are estimates.

### What follows from this

There are two families:

1. **Big deck, see little** (Yu-Gi-Oh, Magic, Pokémon): consistency comes from 3–4 copies and search cards. You plan *against chance*. That suits long competitive formats and a large collection.
2. **Small deck, see most of it** (Marvel Snap, Slay the Spire, Dominion): the decision is *what goes into the deck*. Every card you add changes the deck noticeably.

**Fugenduell belongs to family 2.** A game has only 6 rounds, and the deck is meant to show the *character of a plant* (its measured C/S/R shares). Players should *feel* that character, and you only feel it if you see most of your deck. Target: **about 70 % of the deck seen per game**, close to Marvel Snap.

---

## 2. The numbers for Fugenduell

### 2.1 Duel (2 players)

| What | Number | Why |
|---|---|---|
| Species in your community | **3** | as in `communityEngine.ts` |
| **Deck** | **exactly 36** | 30 strategy + 3 Bloom + 3 signature |
| Strategy cards | 30 | 10 per species = its C/S/R points (conversion table v1) |
| Bloom cards | 3 | 1 per species |
| Signature cards | 3 | 3 slots, chosen from the evidenced keywords of your species; max 1 copy per keyword. If a species has none: an extra Bloom card instead |
| Opening hand | **5** | as Slay the Spire / Dominion |
| Draw | **back up to 5** at the start of each round | |
| Keep at end of round | **1** (bud), the rest goes to the discard pile | |
| Hand maximum | **7** | as Marvel Snap |
| Cards seen per game | 5 + 5 × 4 = **25 of 36 ≈ 69 %** | target reached |
| Energy per game | 3+4+4+3+2+2 = **18** | day length |
| Cards played per game | **≈ 12** (≈ 2 per round, average cost ≈ 1.5) | as manageable as Marvel Snap |

On a table you hold 5 cards and play 2 per round. On a phone, a hand of 5 fits in one row.

### 2.2 Solo run (yearly run, Slay the Spire structure)

| What | Number |
|---|---|
| Start | **1 species, 12 cards** (10 strategy + 1 Bloom + 1 signature) |
| Reward after each crack | choose 1 of 3 or skip |
| New species during the run | at most 2 ("a seed blows in"), each brings its 10 strategy cards + 1 Bloom |
| Remove cards | at "Rain" nodes |
| Typical deck at the end | **20–30** |

### 2.3 Collection at launch (all different card faces)

| Type | Number | Note |
|---|---|---|
| Species cards | 10 | + 3 locked (dandelion, horseweed, silver moss), + 1 boss (tree of heaven) |
| Strategy faces | 23 | only types the species has points in. Plantago has no S card (S = 0 %) |
| Bloom | 10 | |
| Signature | 16 | evidenced keywords only (§3.5 counts the plantain's) |
| Events | 24 | 6 seasons × 4 |
| Site gifts (relics) | 12 | solo mode |
| Bosses | 4 | street sweeper, heat summer, winter service, tree of heaven |
| **Total** | **≈ 99**, plus 4 species cards (3 locked + boss) | about two Phylo starter decks. Every new species with data adds 5–8 faces automatically |

**Copies:** no buying, no packs. Every player has every card. Unlocking happens through observations in the field, not money. (This follows from the gift principle and §10 of the rulebook.)

---

## 3. A full example card: Greater plantain

A species has **two kinds of card**: the **species card** (lies face up next to the play area for the whole game) and its **playable cards** in the deck. Both are shown here.

### 3.1 The species card

```
┌──────────────────────────────────────────────┐
│ BREITWEGERICH                     Höhe ▮▮▯▯▯ │  ① Name / ② Height class 2
│ Plantago major · Greater plantain            │
│──────────────────────────────────────────────│
│        [ Illustration: flat leaf rosette ]   │
│──────────────────────────────────────────────│
│ STRATEGIE   C ████████ 8   S · 0   R ██ 2    │  ③ Strategy points
│             Pierce: C 82,3 · S 0 · R 17,7 %  │     + raw value
│──────────────────────────────────────────────│
│ STANDORT    L7  F5  R6x  N6  S1              │  ④ Indicator values
│ BLÜTE       Jun Jul Aug Sep Okt              │  ⑤ Flowering window
│ LEBENSFORM  Hemikryptophyt ❄ überwintert     │  ⑥ Life form → winter rule
│──────────────────────────────────────────────│
│ MERKMALE                                     │  ⑦ Keywords
│ ◆ Rosette       ◆ Knospenbank (20)           │
│ ◆ Verdichteter Boden                         │
│──────────────────────────────────────────────│
│ "Hält schwere, verdichtete Böden aus."       │  ⑧ Fact with source
│ Pladias · UNDERPLOT v39 · RHS   Umrechnung v1│  ⑨ Sources + version
└──────────────────────────────────────────────┘
```

What each field is, where it comes from, and what it does:

| # | Field | Value | Source | Rule in the game |
|---|---|---|---|---|
| ① | Name | Breitwegerich / *Plantago major* | — | — |
| ② | **Height class** | **2** | Pladias height 0.1–0.4 m, midpoint 0.25 m → class 2 (≤ 0.3 m). RHS gives 10–50 cm; the card uses Pladias, as the conversion table says, and the difference stays visible in the learning view | **Shading** (§7.2): if more than 10 shoots stand in a section, the lowest height class loses first. Plantain loses against celandine (3) and butterfly bush (4), but beats pearlwort (1) |
| ③ | **Strategy points** | **C 8 · S 0 · R 2** | Pierce method (leaf traits), Pladias: 82.3 / 0 / 17.7 % → /10 → 8.23 / 0 / 1.77 → largest remainder → 8 / 0 / 2 | **Deck composition:** 8 × *Spread*, 0 × *Endure*, 2 × *Sprout*. The plantain can't harden its shoots against heat; it has to hold them by out-competing |
| ④ | **Site preference** | L7 F5 R6x N6 S1 | Pladias Ellenberg-type indicator values (ordinal, Czech flora) | **Site fit** (§5.3): compared with each section, ±1 fits, `x` always fits. Decides whether *Spread* places 1, 2 or 3 shoots |
| ⑤ | **Flowering window** | June–October | Pladias flowering period | **Bloom** can only be played in July and September (seasons 3 and 4); May and November lie outside |
| ⑥ | **Life form** | hemicryptophyte | Pladias | **Winter rule** (§6.3): shoots survive the winter but are dormant (they don't count towards fit until March) |
| ⑦ | **Keywords** | Rosette · Bud bank (20) · Compacted soil | Rosette and compacted soil: RHS facts; bud bank: UNDERPLOT BBsize 20 ≥ 10 | Each one unlocks a **signature card** (see 3.3). The number (20) is the measured value, not a strength |
| ⑧ | **Fact** | "Tolerates heavy, compacted soils." | RHS profile | Flavour, but true and with a source |
| ⑨ | **Sources + version** | Pladias · UNDERPLOT v39 · RHS · conversion v1 | — | If the conversion table changes, every card shows which version it was calculated with |

What is **not** on the card: an attack value, life points, or the old TRITT 9. Plantago is no longer the "trampling king" by stat. Its strength against trampling comes from the rosette keyword, and its strength in the game comes from 8 C cards.

### 3.2 A playable card from its deck: *Spread*

```
┌──────────────────────────────────────┐
│ ⚡2          AUSBREITEN          C   │  cost · name · strategy type
│ Breitwegerich                        │  species
│──────────────────────────────────────│
│ Setze Triebe in einen Abschnitt:     │
│   Passung 4–5 → 3 Triebe             │
│   Passung 2–3 → 2 Triebe             │
│   Passung 0–1 → 1 Trieb              │
│ Ist der Abschnitt voll: Beschattung. │
│──────────────────────────────────────│
│ Konkurrenzstrategie: stark, wo       │
│ nichts stört. Teuer.                 │
│ Spieleffekt: Abstraktion · Regel v1  │
└──────────────────────────────────────┘
```

**Played in a round:** it's May (energy 4). Player A puts *Spread* (plantain) face down on section C (wall foot, profile L5 F6 R8 N7 S0).
Fit: L7 vs 5 ✗ · F5 vs 6 ✓ · R6x ✓ (x) · N6 vs 7 ✓ · S1 vs 0 ✓ → **4 fits → 3 shoots**. Energy left: 2.
On the crack-centre section A (L8 F4 R7 N6 S2), plantain would have 5 of 5 fits (L7, F5, R6x, N6, S1 all within ±1) → also 3 shoots. On the kerb edge B (L8 F3 R8 N5 S4): L ✓ F ✗ R ✓(x) N ✓ S ✗ → 3 → 2 shoots.

### 3.3 Its signature cards

| Card | Type | Text | Evidence |
|---|---|---|---|
| **Rosette** | passive (lies next to the species card) | Trampling and the street sweeper remove 1 fewer plantain shoot per section | RHS: "perennial with low leaf rosette" |
| **Bud bank** | reaction (set face down) | "When plantain shoots are removed: put 1 back right away." | UNDERPLOT BBsize 20 |
| **Compacted soil** | passive | In sections with high disturbance, *Spread* (plantain) places +1 shoot | RHS: "tolerates heavy, compacted soils" |

In the duel you choose 3 signature cards in total for your 3 species. With plantain, pearlwort and wall-rue you might take *Rosette* (plantain), *Bud bank* (pearlwort) and *Bud bank* (wall-rue). Each keyword is allowed once per species.

### 3.4 The plantain's deck share (duel)

```
Ausbreiten  ×8   ⚡2   C
Austreiben  ×2   ⚡1   R
Blühen      ×1   ⚡1   (only Jul, Sep)
Signatur    0–1  (one of the three slots)
```

That's 11–12 of the 36 cards. You'll draw about 8 of them per game. Most will be *Spread* — you feel that this plant **competes**.

### 3.5 Signature keywords for all species (launch set, 16)

Plantain 3 (rosette, bud bank, compacted soil) · meadow grass 1 (long-lived seed bank) · bittercress 2 (exploding pods, several generations) · ivy-leaved toadflax 2 (bud bank, crevice dweller) · wall-rue 2 (bud bank, crevice dweller) · purslane 1 (fleshy leaves, *genus level*) · celandine 2 (bud bank, orange sap) · pearlwort 1 (bud bank) · scurvygrass 1 (bud bank) · butterfly bush 1 (drought resistance according to RHS).

Still open: celandine's *orange sap* is evidenced, but the source doesn't say what it does in a crack. Proposal: keep it as a fact without a game effect until there is a source.

---

### Sources

* Marvel Snap: [outof.games guide](https://outof.games/realms/marvel-snap/guides/255-how-to-play-marvel-snap/), [TheSixthAxis review](https://www.thesixthaxis.com/2022/10/03/marvel-snap-review-pc-mobile-download/), [marvelsnapzone.com](https://marvelsnapzone.com/how-to-play-marvel-snap-for-beginners/)
* Slay the Spire, Ironclad starting deck: [slaythespire.gg](https://slaythespire.gg/characters/Ironclad); StS2 energy 3: [Bossrush](https://bossrush.net/2026/04/slay-the-spire-2-early-access-review/)
* Pokémon TCG 60 / 7 / 6 prizes, Limited 40 / 4: [mydextcg.com](https://mydextcg.com/blog/complete-pokemon-tcg-beginner-guide-2025), [tcgzen.com](https://tcgzen.com/how-to-play/)
* Yu-Gi-Oh! 40–60, max 3 copies: [Pokémon Wiki comparison page](https://pokemon.fandom.com/wiki/Pok%C3%A9mon_Trading_Card_Game); opening hand of 5 is general knowledge, not checked against a primary source
* Phylo: [Beaty Museum](https://beatymuseum.ubc.ca/phylo), [Lab News](https://labnews.co.uk/game-theory-phylo/), [Beaty Starter Deck rules (PDF)](https://www.muhlsdk12.org/cms/lib/PA01916549/Centricity/Domain/235/BeatyStarterDeck2015-RULES.pdf)
* Wingspan 170 bird cards, card anatomy: [Gigazine](https://gigazine.net/gsc_news/en/20191207-wingspan), [Gaming Trend](https://gamingtrend.com/reviews/a-bird-in-the-hand-wingspan-review/)
* Forest Shuffle hand limit 10: [BGA help](https://en.doc.boardgamearena.com/Gamehelpforestshuffle)
* Dominion, Hearthstone, Magic: general knowledge, not checked again in this session
