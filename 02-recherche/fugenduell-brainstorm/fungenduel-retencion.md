Let me design this deeply. This is actually a really elegant retention hook because it converts the passive "revisit" loop into a social loop with stakes. Let me think carefully.

Key concepts to work with:

Claiming/challenging ownership of a crack

Care mechanics — tending a plant

Ownership transfer/exchange

The 2-3 week deadline as a re-engagement trigger

Let me think about the design tensions:

If someone can steal your plant, that's frustrating → needs to feel fair, not punishing

The 2-3 week window is exactly the retention interval the science wants

Ownership needs to be meaningful but not permanent-feeling

Cracks are the real asset, not species (per spec: "collects Cracks, not just species")

Let me design a full system.

I'll call it something. "Fugenpacht" (crack lease) or "Revier" (territory). Let me use German terms consistent with the spec.

The Stewardship Model

Instead of "ownership," use "Pacht" (lease/stewardship). You don't own a crack; you hold a stewardship claim on it. This is legally thematic (Labbé law, public space) and emotionally softer than ownership.

Actually let me think about the layers:

Crack (the arena/asset)

Species within crack

Steward (the user holding the claim)

Care actions

Challenges

Transfer

Let me build a proper system.

1. The Stewardship Claim
When you discover a crack and ID a plant, you become its Pächter (steward/leaseholder). Not owner — steward. This distinction matters:

Public space, so "ownership" is philosophically wrong

Stewardship implies responsibility, not property

It makes losing it less like theft and more like a lease expiring

Claim levels:

Entdecker (Discoverer) — first to log it. Permanent badge, can never be taken.

Pächter (Steward) — current active caretaker. Can be contested.

Chronist (Chronicler) — all-time most observations on this crack.

So even if you lose stewardship, you keep the discoverer badge forever. This removes the "I lost everything" sting.

2. Claim Decay (The Revisit Engine)
Every crack has a Pflegezustand (care status) that decays over time.

Claim is "Fest" (secure) for 2 weeks after your last observation.

After 14 days without an observation, it becomes "Bröckelig" (crumbling) — visually shown as cracks in the UI.

After 21 days, it becomes "Offen" (open) — anyone can challenge.

After 28 days, it becomes "Verwaist" (abandoned) — anyone can claim directly with one photo.

This is exactly the 2-3 week window the user proposed. It's not arbitrary: it matches the phenology window (plants change visibly in 2 weeks) and the science need (time-series).

Notifications at day 10 and day 17. "Deine Fuge bröckelt" (Your crack is crumbling). Push notification with a photo of the plant.

3. Challenge Types (How Someone Takes Your Crack)
When a crack is "Offen," a challenger has three options:

A. Fotobeweis (Photo Proof) — The Peaceful Route

Challenger uploads a photo of the crack within 48h

Defender has 48h to respond with their own photo

Both photos go to community/AI vote

Winner: the photo with better quality, correct species ID, and phenology documentation

This is the science-positive path. It generates data.

B. Fugenduell (Battle) — The Game Route

Standard 6-round battle using the plants in the crack

Challenger picks which species in the crack to fight with

Defender picks their species

Winner takes stewardship

Fast, fun, doesn't require travel.

C. Pflegevorsprung (Care Lead) — The Time Route

Challenger must document the crack for 3 consecutive weeks

If defender doesn't respond at all, challenger wins by default

Slow, but rewards persistence.

The defender chooses which challenge type to accept — or refuses, which auto-transfers after 7 days. Refusing costs reputation but is allowed.

Wait — that gives the defender too much power. Let me reconsider.

Better: The challenger chooses the challenge type when issuing. The defender can respond in kind or counter-propose. If they don't respond in 48h, they lose.

Hmm, but "Fotobeweis" requires travel. That's a big ask. Let me think.

Actually the elegant thing: the challenge type should be determined by distance. If challenger is physically near the crack, photo routes are available. If not, only battles. This is realistic and prevents griefing from across the world.

Within 500m: All three routes available

500m–5km: Battle or photo (with travel warning)

Beyond 5km: Battle only, and only if challenger has a "Fernverbindung" (remote link) — earned by having observed the crack before

4. Care Actions (The Retention Loop)
This is the "caring for a plant" part. Between challenges, you perform Pflegehandlungen (care actions):

Care Action	Cooldown	Effect	Requires
Gießen (Water)	3 days	+5% coverage, +1 Pflegezustand	Photo of dry soil
Messen (Measure)	7 days	+1 stat randomly, data point	Photo with ruler/coin
Jäten (Weed rival)	7 days	-10% opponent coverage	Photo of removed competitor
Dokumentieren (Document)	2 weeks	Phenology progress, +XP	Photo of bud/flower/fruit
Säen (Seed)	30 days	Plants a new crack nearby	Photo of seed
Care actions are how you hold the claim. Without them, decay accelerates.

Crucially: care actions generate the exact data the science needs. Watering teaches drought stress. Measuring teaches growth rate. Jäten teaches competition. This is the genius overlap.

5. Ownership Exchange (The Social Layer)
The user mentioned "exchanging owners." Let me design Tausch (exchange):

A. Freiwilliger Tausch (Voluntary Exchange)

Two stewards can trade cracks directly

Must be within same city (prevents absurd trades)

Both must have held their claim for 14+ days

Trade is logged publicly (transparency)

B. Pflegschaft (Foster Care)

You can hand a crack to another user temporarily

Useful when traveling, sick, or busy

Foster steward keeps it alive, gets 50% XP

You can reclaim within 60 days, or it transfers permanently

This solves the "I'm going on vacation" problem that would otherwise kill retention

C. Erbe (Inheritance)

If a user is inactive for 90+ days, their cracks go to their "Fugenkreis" (crack circle — their friend group)

Chosen by the user in advance

Creates a legacy mechanic and social bonds

D. Gemeinschaftsfuge (Community Crack)

Up to 5 users can co-steward a crack

Each contributes care actions

XP split, but claim is much harder to take

Creates guild-like play

6. Reputation (The Anti-Grief Layer)
Pflegeruf (Steward Reputation) — 0 to 100.

+1 per care action

+5 per successful defense

-10 per abandoned crack

-20 per refused challenge without response

-50 per confirmed false ID

Low reputation:

Cannot challenge others

Cannot hold more than 3 cracks

Cannot use battle routes

High reputation:

Can hold 20+ cracks

Unlocks "Meisterpfleger" badge

Gets early access to new species

Can adjudicate community disputes

7. The Emotional Design (Why This Retains)
The user's instinct is right. Here's the psychological loop:

Loss aversion: "Someone wants MY crack." → immediate re-engagement

Deadline pressure: 2-3 weeks is long enough to not feel nagging, short enough to matter

Care ritual: Watering, measuring, documenting becomes a habit loop

Social stakes: Another human is involved, not just a system

Narrative: Each crack has a story — discovered by X, defended by Y, now held by Z

Legacy: Discoverer badge is forever. Erbe gives meaning beyond your own play.

8. The Notification Ladder
This is the practical retention execution:

Day	Trigger	Message
0	Discovery	"Neue Fuge beansprucht! Pflege sie, um sie zu behalten."
3	Care reminder	"Deine Fuge ist durstig."
10	Decay warning	"Deine Fuge bröckelt. Noch 4 Tage bis sie offen ist."
14	Open	"Deine Fuge ist offen! Jeder kann sie jetzt fordern."
17	Challenge warning	"[Name] hat deine Fuge gefordert. 48h!"
21	Critical	"Letzte Chance! Deine Fuge verwaist in 7 Tagen."
28	Lost	"Deine Fuge wurde übernommen. Du bleibst Entdecker."
Notice: the loss message softens with "Du bleibst Entdecker" (you remain the discoverer). Retention isn't just about keeping people — it's about keeping them after losing.

9. The Anti-Punishment Principle
The big risk: if people lose cracks constantly, they quit. Rules to prevent this:

Never lose everything at once. One challenge at a time per user.

Grace period: New users have 30 days of protected claims.

Recovery: If you lose a crack, you can re-challenge after 14 days with a +2 stat bonus ("Revanche-Bonus").

Discoverer badge is permanent. You always have a piece.

Losing gives XP too. "Trotz-Punkte" (defiance points) — you learn something.

10. The Data Model Additions
sql
-- Stewardship
CREATE TABLE crack_stewardship (
  crack_id UUID REFERENCES cracks(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT, -- 'entdecker', 'paechter', 'chronist', 'foerderer'
  claimed_at TIMESTAMPTZ,
  last_care_at TIMESTAMPTZ,
  decay_state TEXT, -- 'fest', 'broeckelig', 'offen', 'verwaist'
  reputation_at_claim INT,
  PRIMARY KEY (crack_id, user_id, role)
);

-- Challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY,
  crack_id UUID REFERENCES cracks(id),
  challenger_id UUID REFERENCES auth.users(id),
  defender_id UUID REFERENCES auth.users(id),
  challenge_type TEXT, -- 'fotobeweis', 'fugenduell', 'pflegevorsprung'
  status TEXT, -- 'pending', 'accepted', 'resolved', 'expired'
  created_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  winner_id UUID,
  battle_id UUID
);

-- Care Actions
CREATE TABLE care_actions (
  id UUID PRIMARY KEY,
  crack_id UUID REFERENCES cracks(id),
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT, -- 'giessen', 'messen', 'jaeten', 'dokumentieren'
  image_url TEXT,
  performed_at TIMESTAMPTZ,
  effect_json JSONB
);

-- Exchanges
CREATE TABLE crack_exchanges (
  id UUID PRIMARY KEY,
  from_user UUID,
  to_user UUID,
  crack_id UUID,
  exchange_type TEXT, -- 'tausch', 'pflegschaft', 'erbe'
  status TEXT,
  created_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Reputation
CREATE TABLE steward_reputation (
  user_id UUID PRIMARY KEY,
  score INT DEFAULT 50,
  successful_defenses INT DEFAULT 0,
  abandoned_cracks INT DEFAULT 0,
  false_ids INT DEFAULT 0,
  updated_at TIMESTAMPTZ
);
11. What This Solves
Problem	Solution
Users don't revisit	Decay forces care actions within 14 days
Retention dies after week 1	Challenge system creates week 2–4 engagement
No social stakes	Other humans can claim your crack
Revisit feels pointless	Care actions generate science data
Loss feels punishing	Discoverer badge, Revanche-Bonus, foster care
Travel breaks retention	Pflegschaft (foster care)
No endgame	Reputation, Erbe, Gemeinschaftsfuge
Data quality low	Challenges require photos, care actions require proof
12. The Deeper Point
The user's instinct — "someone can claim your plant and you have to battle or re-photo" — is essentially turning the revisit into a social obligation instead of a solo chore. That's the retention unlock.

A solo reminder says "come back." A rival says "come back or lose it." The second is far stronger, and it's thematically perfect: cracks are contested spaces. Plants fight for them. Now players do too.

And the elegant part: the mechanic that creates retention is the same mechanic that creates data. Every challenge, every care action, every defense produces a photo, a timestamp, a phenology stage. The game loop and the science loop are the same loop.
