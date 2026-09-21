Caring, Claiming, and Custody: The Retention Engine
Your joke is actually the design brief: "Mama, the pH of my dandelion is down!" That is the exact emotional register you want. A Tamagotchi where the stats are real scientific variables, and the parent is a citizen scientist.

The key insight: you cannot own a wild plant, but you can be its Chronist. The game layer is about custody. The science layer is about continuity. They reinforce each other.

1. The Reframe: Custody, Not Ownership
A crack plant is a wild organism. Nobody owns it. But someone can be its Chronist — the person who documents its life.

Layer	What it is	Who controls it
The Plant	Real organism in a real crack	Nobody
The Crack (Fuge)	The territory/arena	Claimable custody
The Record	All observations ever made	Permanent, unowned
The Chronist	The current guardian	Transferable
Why this matters: Even if you lose custody, your observations stay in the scientific record forever. You lose the game status, not the data. This protects the science and keeps the game fair.

2. The Tamagotchi Layer: Fugenpflege (Crack Care)
Each crack has a computed state derived from real data. Not fake stats. Real estimates with confidence intervals.

The Status Variables
Variable	Source	Range	Example Notification
Trockenstress	Weather API + days since rain	0–100%	"🚨 85% — seit 14 Tagen kein Regen"
Trittdruck	Arena type + nearby foot traffic	Low/Med/High	"⚠️ Hoch — Schulweg, 8 Uhr morgens"
Salzbelastung	Winter road salt data	0–100%	"🧂 60% — Streusalz-Zone"
Boden-pH	Substrate + species indicator	5.0–8.5	"🧪 7.2 (leicht alkalisch)"
Konkurrenz	Nearby observations	Count	"🌿 3 Nachbarn in dieser Fuge"
Phänologie	Last photo	Stage	"🌸 Blüte beginnt — Level 3 freischalten!"
Vitalität	Weighted composite	0–100%	"💚 72% — stabil, aber beobachten"
These are not invented. They are estimates computed from:

Weather API (Open-Meteo, free)

Last observation timestamp

Arena type metadata

Nearby observation density

Species trait database (e.g., Portulak indicates warm, dry substrate)

The Emotional Hook
The app sends notifications like:

🚨 Dein Löwenzahn hat Trockenstress 85%
Seit 14 Tagen kein Regen in deiner Gegend.
Ein neues Foto könnte die Schätzung verbessern.
[Jetzt besuchen] [Später]

This is the "Mama, the pH of my dandelion is down!" moment — but scientifically real. The player feels parental urgency, and the action they take (visiting, photographing) produces a real data point.

3. The Custody Loop
text
CLAIM → CARE → DEFEND → PASS ON
3.1 Claim (Erstbeanspruchung)
First person to observe a crack becomes its Chronist.

Custody is logged in custody_history.

The claim is not permanent. It must be maintained.

3.2 Care (Pflege)
Custody is maintained by:

Regular observations (at least once every 21 days)

Phenology documentation (bud, flower, fruit)

Stress event documentation (frost, sweeping, drought)

Each observation:

Adds a data point to the scientific record

Updates the crack's computed state

Grants XP to the Chronist

Advances the crack's level (Lv 1–5)

3.3 Defend (Verteidigung)
If the Chronist has not observed in 21 days, the crack becomes challengeable.

A challenger can:

Claim by photo: Take a photo of the same crack. If AI confirms the same species and location, custody transfers.

Claim by battle: Challenge the Chronist to a Fugenduell. Winner gets custody.

Claim by knowledge: Answer 3 questions about the plant's history correctly. If the Chronist cannot answer their own 3 questions, custody transfers.

The Chronist can defend by:

Photo defense: Take a new photo within 48 hours. Custody retained.

Battle defense: Win the Fugenduell. Custody retained.

Knowledge defense: Answer the challenger's questions correctly. Custody retained.

This creates urgency without punishing absence. If you go on vacation, you might lose custody — but you keep your observations and XP.

3.4 Pass On (Weitergabe)
Custody can be transferred voluntarily:

Inheritance: Give a crack to a friend.

Abandonment: Declare you can no longer care for it. It becomes open for claiming.

Legacy: If you reach Lv 5, you can "retire" the crack and pass it to a successor. Your name stays in the custody history forever.

Why this matters: It creates emotional weight. A Lv 5 crack with 3 years of observations and 4 former Chronists is a living scientific monument. People will want to inherit it.

4. The Knowledge Battle (Fugenduell for Custody)
The Fugenduell I designed earlier resolves stat-based battles. For custody disputes, add a knowledge layer:

Pre-Battle Quiz
Before the battle, both players answer 3 questions about the crack:

Phenology: "What stage was the plant in on [date]?" (multiple choice)

Stress: "Which stress event was documented on [date]?" (multiple choice)

Neighbors: "How many other species were observed in this crack?" (number)

Each correct answer grants +2 to a stat of your choice in the battle.

Why this works:

It rewards people who actually observed the plant.

It prevents random players from stealing custody.

It's educational — you learn about your plant.

It creates a meritocracy of attention, not just stat power.

The Battle Itself
Use the 6-round seasonal battle system. The winner gets custody. The loser keeps their observations and XP.

Optional twist: The loser can immediately re-challenge after 7 days. This creates rivalry and drama.

5. The Retention Loop (Notifications)
The app should make the player curious, not obligated.

Notification Types
Trigger	Message	Action
14 days no observation	"🌿 Dein Löwenzahn hat seit deinem letzten Besuch 3 neue Blätter gebildet. Schau nach!"	Open camera
Rain after drought	"🌧️ Endlich Regen! Hat dein Portulak sich erholt?"	Open camera
Frost event	"❄️ Frost war in deiner Gegend. Hat dein Mauerraute überlebt?"	Open camera
Phenology window	"🌸 Die Blüte deines Schöllkrauts sollte jetzt beginnen. Dokumentiere sie für Level 3!"	Open camera
Challenger appears	"⚠️ Jemand hat deine Fuge beansprucht. Verteidige sie mit einem Foto innerhalb von 48 Stunden!"	Open defense
Custody lost	"😢 Du hast die Chronistenrolle für [crack] verloren. Deine Beobachtungen bleiben erhalten."	View record
Neighbor observation	"🔍 Jemand hat eine neue Pflanze in deiner Fuge dokumentiert. Schau sie dir an!"	Open map
The Curiosity Principle
The difference between a chore and a game:

Chore	Game
"You must take a photo or lose your plant"	"Your plant has changed — come see what happened"
"You haven't observed in 21 days"	"The frost may have killed your plant. Is it still alive?"
"Defend your custody"	"Someone thinks they can care for your plant better than you"
6. Data Model Changes
Add these tables to the Supabase schema:

sql
-- Custody history (who cared for which crack, when)
CREATE TABLE custody_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crack_id UUID REFERENCES cracks(id),
  user_id UUID REFERENCES auth.users(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  end_reason TEXT, -- 'voluntary', 'lost_battle', 'lost_photo', 'abandoned'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Current custody (fast lookup)
ALTER TABLE cracks ADD COLUMN current_chronist_id UUID REFERENCES auth.users(id);
ALTER TABLE cracks ADD COLUMN custody_started_at TIMESTAMPTZ;

-- Computed crack state (cached, updated on observation or daily)
CREATE TABLE crack_state (
  crack_id UUID PRIMARY KEY REFERENCES cracks(id),
  trockenstress INT, -- 0-100
  trittdruck TEXT, -- 'low', 'medium', 'high'
  salzbelastung INT, -- 0-100
  boden_ph NUMERIC(3,1),
  konkurrenz_count INT,
  phenology_stage TEXT,
  vitalitaet INT, -- 0-100
  confidence NUMERIC(3,2), -- 0.00-1.00
  last_computed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenges (custody disputes)
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crack_id UUID REFERENCES cracks(id),
  challenger_id UUID REFERENCES auth.users(id),
  defender_id UUID REFERENCES auth.users(id),
  challenge_type TEXT, -- 'photo', 'battle', 'knowledge'
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'resolved'
  winner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Battle log (for Fugenduell)
CREATE TABLE battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id),
  arena_type TEXT,
  plant_a_id UUID REFERENCES species(id),
  plant_b_id UUID REFERENCES species(id),
  tactics_a JSONB,
  tactics_b JSONB,
  event_deck JSONB,
  result_log JSONB,
  winner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
7. The Scientific Payoff
This system produces:

Data Type	Source	Scientific Value
Longitudinal observations	Revisit loop	Phenology shifts over years
Stress events	Notifications + photos	Drought/frost/trampling survival
Substrate estimates	pH, salt, moisture	Urban soil ecology
Custody history	Transfers	Observer effect, continuity
Knowledge quiz answers	Battles	Human perception of plant ecology
Crack state time series	Computed daily	Urban microclimate modeling
Crucially: The custody game layer never corrupts the data. Observations are always attributed to the observer, never to the Chronist. The scientific record is independent of the game status.

8. What Could Go Wrong
Risk	Mitigation
Custody disputes become toxic	Knowledge quiz prevents random theft; cooldown on re-challenges
Players feel punished for vacation	Custody loss is soft — you keep observations and XP
Notifications become spam	Cap at 1 per day per crack; user-configurable
Computed state is wrong	Show confidence interval; let users correct via observation
Custody hoarding	21-day inactivity rule; voluntary transfer encouraged
Data quality drops	Knowledge quiz rewards actual observation; verification tiers
Players game the system	No RNG in battles; deterministic resolution; audit logs
9. The Emotional Core
The reason this works is that it turns scientific variables into emotional signals.

Trockenstress 85% is not a number. It is "my plant is thirsty."

Boden-pH 5.2 is not a measurement. It is "my plant is struggling."

Custody lost is not a game state. It is "someone else is taking care of my plant now."

The Tamagotchi hook is real. The science is real. The retention is real.

"Mama, the pH of my dandelion is down!" is not a joke. It is the product.