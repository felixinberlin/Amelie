Crack Flora Watcher: Game Mechanics Specification
Version: 1.0
Status: Mechanics Only
Purpose: To define the complete rules, systems, and player interactions of Crack Flora Watcher / Fugenduell, independent of technical implementation or scientific justification.

1. Core Loop
text
CLAIM → CARE → DEFEND → PASS ON
A player discovers a plant in an urban crack, claims it as their Individuum, cares for it through regular observation, defends custody against challengers, and eventually passes it on or loses it. Every action feeds the scientific record, but the game layer is custody, care, and competition.

2. The Claim Model
2.1 Hierarchy
text
Stelle (micro-habitat)
└── Individuum (single plant)
    └── Chronist (custodian)
Stelle: A micro-habitat (tree pit, wall base, path edge, crack system). One Hüter maintains the site record.

Individuum: A single plant within a Stelle, identified via AI segmentation. One Chronist maintains its record.

Erstsichter: Permanent credit for first discovery. Cannot be lost.

Chronist: Temporary custody. Must be maintained. Can be challenged.

Hüter: Steward of the Stelle. Host, mediator, organizer. Not an owner.

2.2 Claiming
First person to observe an Individuum becomes its Erstsichter and Chronist.

First person to define a Stelle becomes its Hüter.

Multiple players can hold different Individuen within the same Stelle.

2.3 Custody Maintenance
Custody is maintained by observing the Individuum at least once every 21 days.

If the Chronist does not observe within 21 days, the Individuum becomes challengeable.

3. Leveling System
Rule: Level through revisiting, not just finding.

Level	Name	Requirement	Unlock
Lv 1	Found	First photo and ID	Individuum claim
Lv 2	Re-found	Same plant photographed ≥ 2 weeks later	XP bonus
Lv 3	Phenology	Documented bud, flower, and fruit phases	Signature Move
Lv 4	Survived	Documented survival after a severe event (frost, sweeping, drought)	Stat bonus
Lv 5	Full Year	Documented over 12 months	Legacy status
4. Custody Challenges
When a Chronist is inactive for 21 days, any player can challenge for custody.

4.1 Challenge Types
Type	How It Works	When to Use
Photo	Both players photograph the same Individuum within 48 hours. AI compares. The better photo (clarity, phenology stage, angle) wins.	When the Chronist is inactive but the challenger has a good photo.
Battle	Fugenduell. 6 rounds. Winner gets custody.	When both players are active and want to fight.
Knowledge	3 questions about the Individuum's history. Most correct answers wins.	When the challenger claims to know the plant better.
4.2 Defense
The Chronist can defend by:

Taking a new photo within 48 hours.

Winning the battle.

Answering the knowledge questions correctly.

If the Chronist does nothing, custody transfers automatically.

4.3 Cooldown
After a challenge resolves, the loser cannot re-challenge the same Individuum for 14 days.

4.4 Knowledge Quiz
Before a battle challenge, both players answer 3 questions about the Individuum:

Phenology: "What stage was the plant in on [date]?"

Stress: "Which stress event was documented on [date]?"

Neighbors: "How many other species were observed in this Stelle?"

Each correct answer grants +2 to a stat of your choice in the battle.

5. Fugenduell: The Battle System
5.1 Format
Asynchronous. Both players set tactics for all 6 rounds in advance.

6 rounds = 1 year.

Both plants start at 50% coverage.

Coverage is clamped to 5%–95%.

5.2 The Coverage Bar
A horizontal tug-of-war bar from 0% to 100%.

text
Löwenzahn [████████████░░░░░░░░░░░░░░] Mauerraute
            52%                    48%
The bar animates on every change.

This is the primary visual on the battle screen.

5.3 The Event Deck
Each round draws one Event from a seasonal deck. Events test one primary stat.

Round	Month	Event	Tests
1	March	Snowmelt	WURZEL
2	May	Street Sweeper	TRITT
3	July	Heatwave 38°C	DÜRRE
4	September	Seed Dispersal	SAAT
5	November	First Frost	DÜRRE
6	January	Ice & Salt	CHEMIE
5.4 The 6 Core Stats
WURZEL (Root): Anchorage & regeneration.

TRITT (Trampling): Tolerance to feet, brooms, high-pressure washers.

DÜRRE (Drought): Heat tolerance (C4/CAM photosynthesis, succulence).

SAAT (Seed): Seed count × dispersal distance.

TEMPO (Speed): Generations per year.

CHEMIE (Chemistry): Chemical defense (allelopathy, toxicity, salt pumps).

5.5 Arenas (Micro-Habitats)
The Arena dictates stat weightings.

Arena	WURZEL	TRITT	DÜRRE	SAAT	TEMPO	CHEMIE
Gehwegfuge (Sidewalk)	×1	×2	×1	×1	×1	×0.5
Mauerfuge (Wall Joint)	×2	×0	×2	×0.5	×0.5	×1
Baumscheibe (Tree Pit)	×1.5	×0.5	×0.5	×1.5	×1	×1
Straßenrand (Gutter)	×0.5	×1	×1.5	×1	×1	×2
Gleisschotter (Railway)	×1	×0.5	×1.5	×0.5	×1	×2
These are displayed in the battle UI: "In this arena, TRITT is doubled, DÜRRE is halved."

5.6 Grime's CSR Tri-Class System
Class	Bonus	Penalty
C (Competitor)	+2 when no disturbance event has occurred in the last 2 rounds	-2 against TRITT events
S (Stress-tolerator)	+2 to DÜRRE and TRITT	-2 to TEMPO and SAAT
R (Ruderal)	+2 to TEMPO and SAAT	-2 to TRITT and DÜRRE
Creates rock-paper-scissors: C beats R, R beats S, S beats C.

5.7 Tactic System
Before each round, both players secretly choose a Tactic.

Tactic	Effect	Beats	Loses To
Wachsen (Grow)	+3 to your tested stat	Aussäen	Halten
Halten (Hold)	+3 to defense (opponent's stat -3)	Wachsen	Chemie
Aussäen (Seed)	Bank +2 to any future round	Chemie	Wachsen
Chemie (Chem)	-3 to opponent's tested stat	Halten	Aussäen
Both tactics reveal simultaneously. Apply both effects. Then compare stats.

5.8 Resolution Formula
text
Effective Stat = Base Stat
              × Arena Modifier
              × CSR Modifier
              + Tactic Modifier
              + Skill Modifier
text
If A > B:  A gains (A - B) × 0.5 coverage
If B > A:  B gains (B - A) × 0.5 coverage
If A = B:  No change
Coverage change is capped at ±20% per round.

Coverage is clamped to 5%–95%.

5.9 Battle Log
Every round produces a log entry showing the full math:

text
ROUND 3: July — Heatwave (38°C)
Test: DÜRRE

Löwenzahn (RC):
  Base DÜRRE: 4
  × Arena (Gehwegfuge): ×1.0 = 4.0
  × CSR (RC): ×0.5 = 2.0
  + Tactic (Wachsen): +3 = 5.0
  Effective: 5.0

Portulak (SR):
  Base DÜRRE: 9
  × Arena (Gehwegfuge): ×1.0 = 9.0
  × CSR (SR): ×1.5 = 13.5
  + Tactic (Halten): +0 = 13.5
  + Skill (C4-Turbo): ×3.0 = 40.5
  Effective: 40.5

Result: Portulak wins by 35.5
Coverage change: +17.75% (capped at +20%)
Löwenzahn: 50% → 32.25%
Portulak: 50% → 67.75%

Skill Triggered: C4-Turbo (DÜRRE counts 3x in heatwaves)
5.10 Comeback Mechanics
Underdog Bonus: A plant below 20% coverage gains +2 to all stats.

Momentum: Winning a round by more than 10% grants +1 to the next round's stat.

Last Stand: At 5% coverage, a plant automatically triggers its Signature Move (if unlocked).

Event Escalation: Rounds 5 and 6 have stronger events (×1.5 effect) for dramatic finishes.

5.11 Signature Moves
Unlocked at Level 3 (Phenology). Always-on passive modifiers.

Plant	Signature Move	Effect
Löwenzahn	Fallschirmwolke	When you win a round, gain +2% coverage
Breitwegerich	Trittplatte	TRITT counts double in high-disturbance arenas
Mauerraute	Kalkanker	Invincible in Mauerfuge unless opponent uses Chemie
Portulak	C4-Turbo	DÜRRE counts ×3 in heatwave events
Schöllkraut	Milchsaft	At battle start, opponent's CHEMIE is reduced by 2
5.12 Async Play
Challenge: Player A selects a plant and challenges Player B (or AI ghost).

Arena: Determined by the crack type.

Tactic Setting: Both players set tactics for all 6 rounds in advance.

Resolution: Battle resolves server-side instantly.

Replay: Both players watch the replay, round by round, with the full battle log.

Optional Live Mode: Round-by-round tactic selection with a 30-second timer.

6. Tamagotchi Layer: Fugenpflege (Crack Care)
Each Individuum has a computed state derived from real data. Notifications use this state to create emotional urgency.

Variable	Source	Range	Example Notification
Trockenstress	Weather API + days since rain	0–100%	"🚨 85% — seit 14 Tagen kein Regen"
Trittdruck	Arena type + nearby foot traffic	Low/Med/High	"⚠️ Hoch — Schulweg, 8 Uhr morgens"
Salzbelastung	Winter road salt data	0–100%	"🧂 60% — Streusalz-Zone"
Boden-pH	Substrate + species indicator	5.0–8.5	"🧪 7.2 (leicht alkalisch)"
Konkurrenz	Nearby observations	Count	"🌿 3 Nachbarn in dieser Fuge"
Phänologie	Last photo	Stage	"🌸 Blüte beginnt — Level 3 freischalten!"
Vitalität	Weighted composite	0–100%	"💚 72% — stabil, aber beobachten"
Notification Types
Trigger	Message	Action
14 days no observation	"🌿 Dein Löwenzahn hat seit deinem letzten Besuch 3 neue Blätter gebildet."	Open camera
Rain after drought	"🌧️ Endlich Regen! Hat dein Portulak sich erholt?"	Open camera
Frost event	"❄️ Frost war in deiner Gegend. Hat dein Mauerraute überlebt?"	Open camera
Phenology window	"🌸 Die Blüte deines Schöllkrauts sollte jetzt beginnen."	Open camera
Challenger appears	"⚠️ Jemand hat deine Fuge beansprucht. Verteidige sie!"	Open defense
Custody lost	"😢 Du hast die Chronistenrolle verloren. Deine Beobachtungen bleiben erhalten."	View record
7. The 14 Starter Species
#	Species	Class	Skill 1	Skill 2
1	Löwenzahn (Taraxacum officinale)	RC	Pfahlwurzelbohrer	Fallschirmwolke
2	Breitwegerich (Plantago major)	RCS	Trittplatte	Sohlenfracht
3	Einjähriges Rispengras (Poa annua)	R	Dauerblüte	—
4	Behaartes Schaumkraut (Cardamine hirsuta)	R	Schleudersitz	—
5	Zimbelkraut (Cymbalaria muralis)	SR	Lichtflucht	—
6	Mauerraute (Asplenium ruta-muraria)	S	Kalkanker	—
7	Silber-Birnmoos (Bryum argenteum)	S	Trockenstarre	—
8	Portulak (Portulaca oleracea)	SR	C4-Turbo	Samenbank
9	Kanadisches Berufkraut (Erigeron canadensis)	R	Fallschirmflotte	Resistenzfeld
10	Schöllkraut (Chelidonium majus)	CR	Milchsaft	Ameisenpost
11	Niederliegendes Mastkraut (Sagina procumbens)	SR	Polstergriff	—
12	Dänisches Löffelkraut (Cochlearia danica)	SR	Salzpumpe	—
13	Schmetterlingsflieder (Buddleja davidii)	CS	Schuttpionier	Mauerkrone
14	Götterbaum (Ailanthus altissima)	C	BANNED	Ailanthon	Wurzelbrut
8. Research Notes: Similar Games & Mechanics
8.1 The Pl@nt Game (Pl@ntNet / INRIA)
Link: https://docs.plantnet.org/de/reference/the-plant-game/ 

Mechanics:

Three modes: Training (learn to differentiate plants, system evaluates skills), The Plant Game (assigned observations to identify, complexity adapts to skill), and Duels (challenge friends or random players).

Purpose: Produce large masses of taxonomic data while training botanical skills.

22,000 registered players, hundreds of validated observations per day, 94% accuracy.

Relevance: The duel mode directly inspired Fugenduell. The adaptive complexity system is a model for our difficulty scaling. The training mode suggests a tutorial flow.

8.2 Tevi (Pl@ntNet / Eden Project)
Link: https://hal.science/hal-03603512/document#3#2 

Mechanics:

AR game built on Pokémon GO techniques.

Players use Pl@ntNet menu during gameplay to photograph plants.

Rewards: water, fertilizer, new seeds.

Quests with narrative context reward seeds and soil.

UX research tested whether users learned ecological knowledge through play.

Relevance: The reward loop (water/fertilizer/seeds) is a model for our Tamagotchi layer. The integration of real plant ID into a game loop is exactly what Crack Flora does.

8.3 Floracaching
Link: https://cris.brighton.ac.uk/ws/files/34540541/ECSM2014_proceedings_dropbox.pdf#195#24 

Mechanics:

Floracache: A specific plant (e.g., a white oak) that users create by photographing and submitting a tentative ID.

Geo-tagged, so others can find and "check into" the mapped floracache.

On check-in, users report phenological states (e.g., full flowering) and may submit photos or comments in a logbook.

Points for creating caches, checking in, and validating identifications.

Two leaderboards: one for traditional citizen scientists (skill-based competition), one for general participants (any competition).

Badges like "invasive patroller" for checking into invasive plant caches.

Relevance: This is the closest predecessor to Crack Flora's claim model. The "check-in" mechanic is exactly our revisit loop. The separate leaderboards for experts vs. casual players is a smart design choice. The phenological state reporting is our Level 3 mechanic.

8.4 QuestaGame
Link: https://apps.apple.com/kr/app/questagame/id886141835 

Mechanics:

Join quests and compete to photograph animals and plants in the wild.

Submit sightings and receive identifications, expert feedback, gold, and XP.

Features: clans, head-to-head challenges, QuestaLab (identify other players' sightings for gold and expertise levels).

All sightings are geo-tagged and submitted to national databases with permission.

Relevance: The "expertise levels" for identifying other players' sightings is a model for our Hüter role. The clan system suggests social structures. The head-to-head challenge system is similar to our custody challenges.

8.5 BioBlitz Battles (Big Rock Pool Challenge)
Link: https://nbn.org.uk/news/the-big-rock-pool-challenge-bringing-fun-community-competition-to-uk-marine-citizen-science/ 

Mechanics:

Timed, team-based competition.

Participants record species using iNaturalist.

Every species found returns a score depending on its rarity.

Data is verified before contributing to scores.

Relevance: The rarity-based scoring system is a model for our species value. The timed team event is a model for our "BioBlitz" Stelle events. Verification before scoring is a model for our observation validation.

8.6 iNatGuessr
Link: https://github.com/simonrolph/iNatGuessr 

Mechanics:

GeoGuessr-style game using iNaturalist API.

A species observation image is displayed; players guess the location on a map.

Points based on accuracy of guess.

Daily challenge mode with unique seed.

Relevance: The daily challenge mechanic is a strong retention tool. The map-based guessing game is a different genre, but the use of real biodiversity data for gameplay is relevant.

8.7 Taxosearch
Link: https://zenodo.org/records/2605745#1 

Mechanics:

Location-based augmented reality game for plant identification skills.

Location-based quizzes on handheld tablets, augmented with environmental observation and search queries.

Designed for environmental education in a 55-acre campus.

Relevance: The location-based quiz mechanic is a model for our knowledge challenges. The use of AR for field education is relevant to our camera overlay.

8.8 Botanica (Newtown Creek)
Link: https://msplvw-ctwprtla-alph.nyc.gov/assets/dep/downloads/pdf/environment/education/botanica-instructions-and-information.pdf#1#1 

Mechanics:

Multiplayer AR game built with Snapchat Lens Studio.

Up to five players build a garden together.

Each player grows five flowers, randomly selected from different families.

Watering takes 10 taps to fully grow a flower.

Upon completion, the flower's fact card is revealed with name and care tips.

Relevance: The collaborative garden-building is a model for our Stelle community. The "fact card reveal" is a model for our species unlock. The simple watering mechanic is a model for our Tamagotchi care actions.

8.9 Plant 'Em All
Link: https://devpost.com/software/plant-em-all#updates 

Mechanics:

Pokémon GO-style game for finding plants, with geocache rewards.

Relevance: Direct inspiration. The geocache reward model is relevant to our claim system.

8.10 Leafari
Link: https://devpost.com/software/leafari-pokemon-go-for-plants/updates/655131 

Mechanics:

AR-powered quest to spot, snap, and master wild plants.

Earn badges and build a living field guide.

Relevance: The "living field guide" is exactly our Collection/Dex concept. Badge earning is a retention mechanic.

8.11 Arbre Cité
Link: https://www.sciencedirect.com/science/article/pii/S0264275126002830 

Mechanics:

Flip & Write board game about urban nature.

Players draw a card and write results in a personal grid to earn points.

Focused on urban nature, its benefits, limitations, and planning.

Relevance: The board game format is non-digital, but the focus on urban nature planning is thematically aligned. The Flip & Write mechanic (simultaneous action) is a model for our async battle system.

8.12 Pokémon GO / Pikmin Bloom (Niantic)
Relevance: The location-based AR genre is the foundational inspiration. Pikmin Bloom specifically uses walking to grow virtual flowers along real-world paths. The "plant flowers on your path" mechanic is a model for our observation map layer.

9. Summary of Borrowed Mechanics
Source	Mechanic Borrowed	How Crack Flora Adapts It
Pl@nt Game	Duels, adaptive difficulty	Fugenduell, skill-based matchmaking
Tevi	Rewards for plant ID	Water/fertilizer for care actions
Floracaching	Check-in to a plant, phenology reporting	Revisit loop, Level 3 Phenology
QuestaGame	Expertise levels, clans	Hüter role, Stelle community
BioBlitz Battles	Rarity-based scoring, timed events	Species value, Stelle BioBlitz
iNatGuessr	Daily challenge	Daily observation quests
Taxosearch	Location-based quizzes	Knowledge challenges
Botanica	Collaborative garden, fact card reveal	Stelle community, species unlock
Plant 'Em All	Geocache rewards	Claim rewards
Leafari	Living field guide	Collection/Dex
Arbre Cité	Flip & Write simultaneous action	Async tactic setting
Pokémon GO	Location-based AR	Core map and camera loop
End of Mechanics Document.

