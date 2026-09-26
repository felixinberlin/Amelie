export type TarotElement = 'fire' | 'water' | 'air' | 'earth';

export interface TarotCard {
  id: string;
  name: string;
  nameDe: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number: number;
  element: TarotElement;
  keywordsDe: string[];
  keywordsEn: string[];
  reversedKeywordsDe: string[];
  reversedKeywordsEn: string[];
  archetype: string;
  symbolism: string;
}

export interface SpreadSlotLayout {
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  rotation: number; // degrees
  layer: number; // z-index
}

export interface SpreadSlot {
  id: string;
  order: number;
  label: string;
  labelDe: string;
  role: string;
  layout: SpreadSlotLayout;
}

export type RelationType =
  | 'crosses'
  | 'grounds'
  | 'crowns'
  | 'leads_to'
  | 'mirrors'
  | 'opposes'
  | 'clarifies'
  | 'synthesizes';

export interface SpreadRelation {
  source: string;
  target: string;
  type: RelationType;
  tension: number; // -1.0 to 1.0
  evaluateElementalDignity?: boolean;
}

export interface DeckContract {
  minCards: number;
  requiredArcana: 'any' | 'major_only' | 'minor_only' | 'full_78' | 'lenormand_36';
  allowReversals: boolean;
  significatorRequired?: boolean;
}

export interface SpreadDefinition {
  id: string;
  name: string;
  nameDe: string;
  author: string;
  description: string;
  deckContract: DeckContract;
  slots: SpreadSlot[];
  relations: SpreadRelation[];
}

export interface DrawnCardPlacement {
  slotId: string;
  card: TarotCard;
  isReversed: boolean;
}

export type ElementalAffinity = 'friendly' | 'hostile' | 'neutral' | 'identical';

export interface EvaluatedEdge {
  relation: SpreadRelation;
  sourcePlacement?: DrawnCardPlacement;
  targetPlacement?: DrawnCardPlacement;
  elementalAffinity?: ElementalAffinity;
  effectiveTension: number;
  descriptionDe: string;
  descriptionEn: string;
}

/**
 * 22 Major Arcana + 8 representative Minor Arcana (total 30 curated cards for interactive simulation).
 * Minor Arcana cover all 4 suits (Wands/Fire, Cups/Water, Swords/Air, Pentacles/Earth)
 * with variety in rank: Aces, Pips (3, 4, 10), and Court cards (Page, Knight, Queen, King).
 */
export const TAROT_DECK: TarotCard[] = [
  {
    id: 'fool',
    name: '0 The Fool',
    nameDe: '0 Der Narr',
    arcana: 'major',
    number: 0,
    element: 'air',
    keywordsDe: ['Neubeginn', 'Spontaneität', 'Urvertrauen'],
    keywordsEn: ['New Beginning', 'Spontaneity', 'Pure Potential'],
    reversedKeywordsDe: ['Leichtsinn', 'Naivität', 'Blindes Risiko'],
    reversedKeywordsEn: ['Recklessness', 'Hesitation', 'Foolishness'],
    archetype: 'Der Suchende an der Klippe',
    symbolism: 'Weißer Hund, Abgrund, kleine Bündeltasche',
  },
  {
    id: 'magician',
    name: 'I The Magician',
    nameDe: 'I Der Magier',
    arcana: 'major',
    number: 1,
    element: 'air',
    keywordsDe: ['Schöpferkraft', 'Fokus', 'Manifestation'],
    keywordsEn: ['Manifestation', 'Resourcefulness', 'Power'],
    reversedKeywordsDe: ['Manipulation', 'Ungeschick', 'Verkrampfung'],
    reversedKeywordsEn: ['Illusion', 'Blocked Creativity', 'Manipulation'],
    archetype: 'Der Kanal zwischen Oben und Unten',
    symbolism: 'Stab nach oben, Hand nach unten, 4 Werkzeuge',
  },
  {
    id: 'high_priestess',
    name: 'II The High Priestess',
    nameDe: 'II Die Hohepriesterin',
    arcana: 'major',
    number: 2,
    element: 'water',
    keywordsDe: ['Intuition', 'Stille', 'Unbewusstes'],
    keywordsEn: ['Intuition', 'Sacred Knowledge', 'Subconscious'],
    reversedKeywordsDe: ['Verdrängung', 'Geheimniskrämerei', 'Oberflächlichkeit'],
    reversedKeywordsEn: ['Secrets', 'Repressed Feelings', 'Superficiality'],
    archetype: 'Die Wächterin der Schwelle',
    symbolism: 'B & J Säulen, Granatäpfel, Mondsichel',
  },
  {
    id: 'empress',
    name: 'III The Empress',
    nameDe: 'III Die Herrscherin',
    arcana: 'major',
    number: 3,
    element: 'earth',
    keywordsDe: ['Fruchtbarkeit', 'Fülle', 'Sinnlichkeit'],
    keywordsEn: ['Abundance', 'Nurturing', 'Sensuality'],
    reversedKeywordsDe: ['Erstarrung', 'Überbehütung', 'Mangelgefühl'],
    reversedKeywordsEn: ['Creative Block', 'Smothering', 'Scarcity'],
    archetype: 'Die nährende Naturkraft',
    symbolism: 'Kornfeld, Venus-Schild, Sternenkrone',
  },
  {
    id: 'emperor',
    name: 'IV The Emperor',
    nameDe: 'IV Der Herrscher',
    arcana: 'major',
    number: 4,
    element: 'fire',
    keywordsDe: ['Struktur', 'Autorität', 'Grenzen setzen'],
    keywordsEn: ['Structure', 'Authority', 'Firm Foundation'],
    reversedKeywordsDe: ['Tyrannei', 'Rigidität', 'Kontrollverlust'],
    reversedKeywordsEn: ['Tyranny', 'Domination', 'Lack of Discipline'],
    archetype: 'Der Gesetzgeber und Architekt',
    symbolism: 'Steiniger Thron, Widderköpfe, Zepter',
  },
  {
    id: 'hierophant',
    name: 'V The Hierophant',
    nameDe: 'V Der Hierophant',
    arcana: 'major',
    number: 5,
    element: 'earth',
    keywordsDe: ['Tradition', 'Lehre', 'Gemeinsamer Glaube'],
    keywordsEn: ['Tradition', 'Institutions', 'Spiritual Wisdom'],
    reversedKeywordsDe: ['Dogmatismus', 'Heuchelei', 'Rebellion'],
    reversedKeywordsEn: ['Personal Beliefs', 'Rigid Dogma', 'Rebellion'],
    archetype: 'Der Brückenbauer zur Lehre',
    symbolism: 'Dreifachkreuz, gekreuzte Schlüssel, zwei Novizen',
  },
  {
    id: 'lovers',
    name: 'VI The Lovers',
    nameDe: 'VI Die Liebenden',
    arcana: 'major',
    number: 6,
    element: 'air',
    keywordsDe: ['Wahl', 'Ausrichtung', 'Tiefe Resonanz'],
    keywordsEn: ['Choice', 'Alignment', 'Deep Resonance'],
    reversedKeywordsDe: ['Zerrissenheit', 'Falsche Kompromisse', 'Selbstverrat'],
    reversedKeywordsEn: ['Disharmony', 'Bad Choice', 'Misalignment'],
    archetype: 'Die Scheideweg-Wahl aus dem Herzen',
    symbolism: 'Engel Raphael, Baum des Lebens und der Erkenntnis',
  },
  {
    id: 'chariot',
    name: 'VII The Chariot',
    nameDe: 'VII Der Wagen',
    arcana: 'major',
    number: 7,
    element: 'water',
    keywordsDe: ['Fokus', 'Triumph', 'Bändigung von Gegensätzen'],
    keywordsEn: ['Momentum', 'Willpower', 'Controlled Drive'],
    reversedKeywordsDe: ['Orientierungslosigkeit', 'Aggression', 'Blockierter Impuls'],
    reversedKeywordsEn: ['Loss of Control', 'Aggression', 'Stalled Drive'],
    archetype: 'Der Sieger im Harnisch',
    symbolism: 'Schwarze und weiße Sphinx, Baldachin mit Sternen',
  },
  {
    id: 'strength',
    name: 'VIII Strength',
    nameDe: 'VIII Die Kraft',
    arcana: 'major',
    number: 8,
    element: 'fire',
    keywordsDe: ['Sanfte Beharrlichkeit', 'Mitgefühl', 'Löwenbändigung'],
    keywordsEn: ['Gentle Strength', 'Compassion', 'Courage'],
    reversedKeywordsDe: ['Selbstzweifel', 'Verbitterung', 'Rohe Kraftmeierei'],
    reversedKeywordsEn: ['Self-Doubt', 'Raw Force', 'Insecurity'],
    archetype: 'Die sanfte Beherrschung der Bestie',
    symbolism: 'Frau mit Lemniskate, Löwenmaul sanft gehalten',
  },
  {
    id: 'hermit',
    name: 'IX The Hermit',
    nameDe: 'IX Der Eremit',
    arcana: 'major',
    number: 9,
    element: 'earth',
    keywordsDe: ['Rückzug', 'Innere Laterne', 'Reife'],
    keywordsEn: ['Introspection', 'Solitude', 'Inner Light'],
    reversedKeywordsDe: ['Isolation', 'Verbitterte Einsamkeit', 'Weltabgewandtheit'],
    reversedKeywordsEn: ['Loneliness', 'Paranoia', 'Withdrawal'],
    archetype: 'Der einsame Wegweiser auf dem Gipfel',
    symbolism: 'Laterne mit Sechsstern, Stab, schneebedeckter Berg',
  },
  {
    id: 'wheel_of_fortune',
    name: 'X Wheel of Fortune',
    nameDe: 'X Das Rad des Schicksals',
    arcana: 'major',
    number: 10,
    element: 'fire',
    keywordsDe: ['Wendepunkt', 'Zyklus', 'Unausweichlicher Wandel'],
    keywordsEn: ['Turning Point', 'Cycles', 'Inevitable Change'],
    reversedKeywordsDe: ['Widerstand gegen Wandel', 'Pechsträhne', 'Klammern'],
    reversedKeywordsEn: ['Bad Luck', 'Resisting Cycles', 'Stagnation'],
    archetype: 'Die Drehung der kosmischen Achse',
    symbolism: 'Sphinx, Anubis, Typhon, hebräische Buchstaben',
  },
  {
    id: 'justice',
    name: 'XI Justice',
    nameDe: 'XI Die Gerechtigkeit',
    arcana: 'major',
    number: 11,
    element: 'air',
    keywordsDe: ['Klarheit', 'Ursache & Wirkung', 'Wahrheit'],
    keywordsEn: ['Truth', 'Cause and Effect', 'Balance'],
    reversedKeywordsDe: ['Ungerechtigkeit', 'Voreingenommenheit', 'Fehlurteil'],
    reversedKeywordsEn: ['Dishonesty', 'Bias', 'Unfair Blame'],
    archetype: 'Die unbestechliche Waage',
    symbolism: 'Zweischneidiges Schwert, Waagschalen, purpurner Vorhang',
  },
  {
    id: 'hanged_man',
    name: 'XII The Hanged Man',
    nameDe: 'XII Der Gehängte',
    arcana: 'major',
    number: 12,
    element: 'water',
    keywordsDe: ['Perspektivwechsel', 'Loslassen', 'Freiwillige Pause'],
    keywordsEn: ['Surrender', 'New Perspective', 'Suspension'],
    reversedKeywordsDe: ['Sinnloser Stillstand', 'Opferrolle', 'Märtyrertum'],
    reversedKeywordsEn: ['Stalling', 'Martyrdom', 'Resistance to Pause'],
    archetype: 'Der Sehende im Kopfstand',
    symbolism: 'Am T-Kreuz kopfüber, Glorie um das Haupt',
  },
  {
    id: 'death',
    name: 'XIII Death',
    nameDe: 'XIII Der Tod',
    arcana: 'major',
    number: 13,
    element: 'water',
    keywordsDe: ['Radikaler Abschied', 'Metamorphose', 'Befreiender Schnitt'],
    keywordsEn: ['Endings', 'Transformation', 'Transition'],
    reversedKeywordsDe: ['Festhalten am Toten', 'Verfaulung', 'Todesangst'],
    reversedKeywordsEn: ['Fear of Change', 'Clinging', 'Decay'],
    archetype: 'Der Schnitter, der Platz für Neues schafft',
    symbolism: 'Schwarzer Ritter, weiße Rose, aufgehende Sonne am Horizont',
  },
  {
    id: 'temperance',
    name: 'XIV Temperance',
    nameDe: 'XIV Die Mäßigkeit',
    arcana: 'major',
    number: 14,
    element: 'fire',
    keywordsDe: ['Alchemistische Synthese', 'Geduld', 'Goldener Mittelweg'],
    keywordsEn: ['Alchemy', 'Synthesis', 'Patience & Balance'],
    reversedKeywordsDe: ['Exzess', 'Ungeduld', 'Ungleiche Mischung'],
    reversedKeywordsEn: ['Imbalance', 'Excess', 'Discord'],
    archetype: 'Der Engel, der zwei Kelche verbindet',
    symbolism: 'Ein Fuß im Wasser, einer an Land, Sonnenpfad',
  },
  {
    id: 'devil',
    name: 'XV The Devil',
    nameDe: 'XV Der Teufel',
    arcana: 'major',
    number: 15,
    element: 'earth',
    keywordsDe: ['Ketten', 'Schattenbindung', 'Illusionäre Gefangenschaft'],
    keywordsEn: ['Shadow Self', 'Entrapment', 'Material Fixation'],
    reversedKeywordsDe: ['Ketten sprengen', 'Schatten erkennen', 'Befreiung'],
    reversedKeywordsEn: ['Breaking Free', 'Reclaiming Power', 'Awakening'],
    archetype: 'Der Hüter der unbewussten Begierden',
    symbolism: 'Baphomet auf Würfel, lose Ketten um Hals zweier Gefangener',
  },
  {
    id: 'tower',
    name: 'XVI The Tower',
    nameDe: 'XVI Der Turm',
    arcana: 'major',
    number: 16,
    element: 'fire',
    keywordsDe: ['Blitzschlag', 'Einsturz von Illusionen', 'Katharsis'],
    keywordsEn: ['Sudden Upheaval', 'Disillusionment', 'Cataclysm'],
    reversedKeywordsDe: ['Vermeidung des Unausweichlichen', 'Schleichender Verfall'],
    reversedKeywordsEn: ['Disaster Avoided', 'Delaying the Inevitable'],
    archetype: 'Der Blitz, der das falsche Fundament zerschmettert',
    symbolism: 'Blitz zerschlägt Krone, Gestürzte im Feuersturm',
  },
  {
    id: 'star',
    name: 'XVII The Star',
    nameDe: 'XVII Der Stern',
    arcana: 'major',
    number: 17,
    element: 'air',
    keywordsDe: ['Hoffnung', 'Heilung', 'Kosmische Inspiration'],
    keywordsEn: ['Hope', 'Inspiration', 'Serenity & Renewal'],
    reversedKeywordsDe: ['Hoffnungslosigkeit', 'Zynismus', 'Erschöpfung'],
    reversedKeywordsEn: ['Despair', 'Lost Faith', 'Disconnection'],
    archetype: 'Die Tränkerin der Erde und Gewässer',
    symbolism: 'Großer Stern mit 7 Begleitern, nackte Frau gießt zwei Krüge',
  },
  {
    id: 'moon',
    name: 'XVIII The Moon',
    nameDe: 'XVIII Der Mond',
    arcana: 'major',
    number: 18,
    element: 'water',
    keywordsDe: ['Illusion', 'Täuschung', 'Traumwelt & Ängste'],
    keywordsEn: ['Illusion', 'The Unknown', 'Fears & Subconscious'],
    reversedKeywordsDe: ['Aufklärung', 'Nachtschrecken schwinden', 'Klarheit'],
    reversedKeywordsEn: ['Release of Fear', 'Unveiling Secrets', 'Clarity'],
    archetype: 'Die Wildnis im Zwielicht',
    symbolism: 'Krebs steigt aus Teich, Wolf und Hund heulen, zwei Türme',
  },
  {
    id: 'sun',
    name: 'XIX The Sun',
    nameDe: 'XIX Die Sonne',
    arcana: 'major',
    number: 19,
    element: 'fire',
    keywordsDe: ['Lebensfreude', 'Klarer Tag', 'Strahlender Erfolg'],
    keywordsEn: ['Vitality', 'Joy', 'Enlightenment & Success'],
    reversedKeywordsDe: ['Getrübter Schein', 'Übermut', 'Vorübergehende Wolken'],
    reversedKeywordsEn: ['Temporary Cloud', 'Overoptimism', 'Blocked Joy'],
    archetype: 'Das unbeschwerte Kind im Sonnenlicht',
    symbolism: 'Kind auf weißem Pferd, Sonnenblumen, rote Fahne',
  },
  {
    id: 'judgement',
    name: 'XX Judgement',
    nameDe: 'XX Das Gericht',
    arcana: 'major',
    number: 20,
    element: 'fire',
    keywordsDe: ['Erwachen', 'Berufung', 'Erlösender Posaunenstoß'],
    keywordsEn: ['Rebirth', 'Inner Calling', 'Absolution'],
    reversedKeywordsDe: ['Selbstanklage', 'Verweigerung des Rufs', 'Schuldgefühle'],
    reversedKeywordsEn: ['Self-Doubt', 'Ignoring Call', 'Fear of Verdict'],
    archetype: 'Die Auferstehung in ein höheres Bewusstsein',
    symbolism: 'Engel Gabriel bläst Posaune, Menschen steigen aus Gräbern',
  },
  {
    id: 'world',
    name: 'XXI The World',
    nameDe: 'XXI Die Welt',
    arcana: 'major',
    number: 21,
    element: 'earth',
    keywordsDe: ['Vollendung', 'Integration', 'Zyklus-Schluss'],
    keywordsEn: ['Completion', 'Integration', 'Wholeness'],
    reversedKeywordsDe: ['Offenes Ende', 'Mangelnder Abschluss', 'Stolpern am Ziel'],
    reversedKeywordsEn: ['Incomplete', 'Stagnation at Finish', 'Delayed Closure'],
    archetype: 'Die Tänzerin im Lorbeerkranz',
    symbolism: 'Lorbeerkranz, 4 Wesen in den Ecken (Tetramorph)',
  },
  // Representative Minor Cards for elemental contrast testing
  {
    id: 'ace_wands',
    name: 'Ace of Wands',
    nameDe: 'Ass der Stäbe',
    arcana: 'minor',
    suit: 'wands',
    number: 1,
    element: 'fire',
    keywordsDe: ['Funke', 'Urimpuls', 'Kreatives Feuer'],
    keywordsEn: ['Spark', 'Raw Drive', 'Creative Breakthrough'],
    reversedKeywordsDe: ['Fehlzündung', 'Erloschene Glut', 'Verzögerung'],
    reversedKeywordsEn: ['False Start', 'Burnout', 'Lack of Motivation'],
    archetype: 'Der kreative Urblitz',
    symbolism: 'Hand aus Wolke reicht knospenden Stab',
  },
  {
    id: 'three_swords',
    name: 'Three of Swords',
    nameDe: 'Drei der Schwerter',
    arcana: 'minor',
    suit: 'swords',
    number: 3,
    element: 'air',
    keywordsDe: ['Herzensbruch', 'Schmerzhafte Wahrheit', 'Ernüchterung'],
    keywordsEn: ['Heartbreak', 'Painful Truth', 'Grief'],
    reversedKeywordsDe: ['Erholung', 'Verzeihen', 'Alte Wunden öffnen'],
    reversedKeywordsEn: ['Healing', 'Forgiveness', 'Releasing Pain'],
    archetype: 'Der Verstand sticht das Gefühl',
    symbolism: 'Herz durchbohrt von 3 Schwertern unter Gewitterwolken',
  },
  {
    id: 'ten_cups',
    name: 'Ten of Cups',
    nameDe: 'Zehn der Kelche',
    arcana: 'minor',
    suit: 'cups',
    number: 10,
    element: 'water',
    keywordsDe: ['Seelischer Frieden', 'Familienharmonie', 'Regenbogen'],
    keywordsEn: ['Emotional Fulfillment', 'Harmony', 'Home Sanctuary'],
    reversedKeywordsDe: ['Häuslicher Zwist', 'Fassade', 'Gebrochenes Nest'],
    reversedKeywordsEn: ['Domestic Strain', 'Shattered Peace', 'Isolation'],
    archetype: 'Der Regenbogen der Zufriedenheit',
    symbolism: 'Paar umarmt sich, Kinder tanzen, 10 Kelche im Himmelsbogen',
  },
  {
    id: 'four_pentacles',
    name: 'Four of Pentacles',
    nameDe: 'Vier der Münzen',
    arcana: 'minor',
    suit: 'pentacles',
    number: 4,
    element: 'earth',
    keywordsDe: ['Festhalten', 'Sicherheitswahn', 'Geiz & Schutzmauer'],
    keywordsEn: ['Conservation', 'Frugality', 'Guarded Boundaries'],
    reversedKeywordsDe: ['Loslassen', 'Ausgabe', 'Gier & Ruin'],
    reversedKeywordsEn: ['Openness', 'Reckless Spending', 'Letting Go'],
    archetype: 'Der Festungsbauer, der sich selbst einsperrt',
    symbolism: 'Mann hält Münzen krampfhaft auf Kopf, Händen und Füßen',
  },
  {
    id: 'knight_wands',
    name: 'Knight of Wands',
    nameDe: 'Ritter der Stäbe',
    arcana: 'minor',
    suit: 'wands',
    number: 12,
    element: 'fire',
    keywordsDe: ['Abenteuerlust', 'Impulsiver Aufbruch', 'Leidenschaftliche Energie'],
    keywordsEn: ['Adventure', 'Impulsive Action', 'Passionate Energy'],
    reversedKeywordsDe: ['Rücksichtslosigkeit', 'Übermut', 'Flüchtige Begeisterung'],
    reversedKeywordsEn: ['Recklessness', 'Haste', 'Scattered Energy'],
    archetype: 'Der feurige Reiter, der zuerst losreitet und dann denkt',
    symbolism: 'Gepanzerter Reiter auf steigendem Pferd, Wüstenlandschaft, Salamander-Tunika',
  },
  {
    id: 'queen_cups',
    name: 'Queen of Cups',
    nameDe: 'Königin der Kelche',
    arcana: 'minor',
    suit: 'cups',
    number: 13,
    element: 'water',
    keywordsDe: ['Emotionale Tiefe', 'Empathie', 'Intuitive Weisheit'],
    keywordsEn: ['Emotional Depth', 'Empathy', 'Intuitive Wisdom'],
    reversedKeywordsDe: ['Emotionale Verstrickung', 'Launenhaftigkeit', 'Abhängigkeit'],
    reversedKeywordsEn: ['Emotional Instability', 'Codependency', 'Inner Turbulence'],
    archetype: 'Die Herrscherin über das emotionale Meer',
    symbolism: 'Thron am Wasser, verschlossener Kelch mit Engelsdeckel, Kieselstrand',
  },
  {
    id: 'page_swords',
    name: 'Page of Swords',
    nameDe: 'Page der Schwerter',
    arcana: 'minor',
    suit: 'swords',
    number: 11,
    element: 'air',
    keywordsDe: ['Neugier', 'Scharfe Beobachtung', 'Ungestümer Intellekt'],
    keywordsEn: ['Curiosity', 'Sharp Observation', 'Restless Intellect'],
    reversedKeywordsDe: ['Geschwätz', 'Zynismus', 'Hinterhältigkeit'],
    reversedKeywordsEn: ['Gossip', 'Cynicism', 'All Talk No Action'],
    archetype: 'Der rastlose Wächter auf dem windigen Hügel',
    symbolism: 'Junger Mensch mit erhobenem Schwert auf Anhöhe, stürmische Wolken',
  },
  {
    id: 'king_pentacles',
    name: 'King of Pentacles',
    nameDe: 'König der Münzen',
    arcana: 'minor',
    suit: 'pentacles',
    number: 14,
    element: 'earth',
    keywordsDe: ['Wohlstand', 'Verlässlichkeit', 'Meisterhafte Verwaltung'],
    keywordsEn: ['Abundance', 'Reliability', 'Masterful Stewardship'],
    reversedKeywordsDe: ['Materialismus', 'Gier', 'Korruption'],
    reversedKeywordsEn: ['Greed', 'Indulgence', 'Financial Mismanagement'],
    archetype: 'Der Patriarch auf dem Münzenthron',
    symbolism: 'Schwerer Thron mit Stierrelief, Weinreben, Rüstung unter Mantel',
  },
];

/**
 * Evaluates elemental dignity between two elements (Golden Dawn tradition)
 */
export function getElementalAffinity(e1: TarotElement, e2: TarotElement): ElementalAffinity {
  if (e1 === e2) return 'identical';

  // Compatible pairs (supportive)
  if ((e1 === 'fire' && e2 === 'air') || (e1 === 'air' && e2 === 'fire')) return 'friendly';
  if ((e1 === 'water' && e2 === 'earth') || (e1 === 'earth' && e2 === 'water')) return 'friendly';

  // Inimical pairs (opposites / conflict)
  if ((e1 === 'fire' && e2 === 'water') || (e1 === 'water' && e2 === 'fire')) return 'hostile';
  if ((e1 === 'air' && e2 === 'earth') || (e1 === 'earth' && e2 === 'air')) return 'hostile';

  // Neutral pairs
  return 'neutral';
}

/**
 * Computes modified edge tension based on:
 * 1. Base topological tension in the spread relation
 * 2. Reversal status (reversals damp or distort transition edges)
 * 3. Elemental dignity modulation (friendly softens/nurtures, hostile aggravates conflict)
 */
export function evaluateSpreadEdge(
  relation: SpreadRelation,
  source?: DrawnCardPlacement,
  target?: DrawnCardPlacement
): EvaluatedEdge {
  let tension = relation.tension;
  let affinity: ElementalAffinity | undefined = undefined;

  if (source && target && relation.evaluateElementalDignity) {
    affinity = getElementalAffinity(source.card.element, target.card.element);

    if (affinity === 'friendly') {
      tension += 0.25; // Nurturing, relieves hostile tension or boosts harmony
    } else if (affinity === 'hostile') {
      tension -= 0.35; // Friction, sharpens clash or degrades smooth transition
    } else if (affinity === 'identical') {
      tension = tension >= 0 ? tension + 0.15 : tension - 0.15; // Intensifies prevailing polarity
    }
  }

  // Modulate by reversal: If source or target is reversed on a directional edge, tension degrades
  if (source?.isReversed || target?.isReversed) {
    if (relation.type === 'leads_to') {
      tension -= 0.3; // Blocked flow
    } else if (relation.type === 'crosses') {
      tension = Math.abs(tension) * -1; // Intensifies friction
    }
  }

  // Clamp tension to [-1.0, 1.0]
  const clamped = Math.max(-1.0, Math.min(1.0, tension));

  // Natural language explanations — all 8 relation types covered
  let descDe = '';
  let descEn = '';

  const affinityDescDe = affinity === 'hostile'
    ? `Feindliche Element-Spannung (${source?.card.element} vs ${target?.card.element}) verschärft die Dynamik.`
    : affinity === 'friendly'
    ? `Verträgliche Elemente (${source?.card.element} + ${target?.card.element}) harmonisieren die Verbindung.`
    : affinity === 'identical'
    ? `Gleiches Element (${source?.card.element}) verstärkt die vorherrschende Polarität.`
    : '';

  const affinityDescEn = affinity === 'hostile'
    ? `Hostile element friction (${source?.card.element} vs ${target?.card.element}) sharpens the dynamic.`
    : affinity === 'friendly'
    ? `Compatible elements (${source?.card.element} + ${target?.card.element}) harmonize the connection.`
    : affinity === 'identical'
    ? `Identical element (${source?.card.element}) intensifies the prevailing polarity.`
    : '';

  switch (relation.type) {
    case 'crosses':
      descDe = `Orthogonale Überlagerung (90°). ${affinityDescDe || 'Direkte Reibung zwischen aktuellem Thema und Querkarte.'}`;
      descEn = `Orthogonal cross (90°). ${affinityDescEn || 'Direct tension between current core and crossing factor.'}`;
      break;
    case 'grounds':
      descDe = `Fundamentierende Wurzel: Unbewusster Unterbau speist die gegenwärtige Konstellation. ${affinityDescDe}`.trim();
      descEn = `Foundational root: Subconscious layer feeding the present state. ${affinityDescEn}`.trim();
      break;
    case 'crowns':
      descDe = `Bewusste Krone: Ausrichtung auf das höchste bewusste Ziel oder die idealisierte Möglichkeit. ${affinityDescDe}`.trim();
      descEn = `Conscious aspiration: Crowning direction toward the highest conscious goal or idealized possibility. ${affinityDescEn}`.trim();
      break;
    case 'leads_to':
      if (source?.isReversed) {
        descDe = 'Umgekehrte Ursprungskarte verzögert oder blockiert den temporalen Fluss.';
        descEn = 'Reversed origin card inhibits or stalls narrative momentum.';
      } else if (target?.isReversed) {
        descDe = 'Umgekehrte Zielkarte erschwert die Ankunft im nächsten Zustand.';
        descEn = 'Reversed target card resists arrival at the next state.';
      } else {
        descDe = `Direkte temporale Sequenz (Fortschritt zum nächsten Zustand). ${affinityDescDe}`.trim();
        descEn = `Direct temporal sequence (momentum toward next state). ${affinityDescEn}`.trim();
      }
      break;
    case 'mirrors':
      descDe = `Symmetrische Spiegelung: Zwei Perspektiven auf dasselbe Thema reflektieren sich gegenseitig. ${affinityDescDe}`.trim();
      descEn = `Symmetric reflection: Two perspectives on the same theme mirror each other. ${affinityDescEn}`.trim();
      break;
    case 'opposes':
      descDe = `Antithetische Opposition: Direkte Gegenüberstellung zweier widerstreitender Kräfte. ${affinityDescDe}`.trim();
      descEn = `Antithetical opposition: Direct confrontation between two competing forces. ${affinityDescEn}`.trim();
      break;
    case 'clarifies':
      descDe = `Erhellung: Die Quellkarte liefert zusätzlichen Kontext oder schärft die Interpretation der Zielkarte. ${affinityDescDe}`.trim();
      descEn = `Clarification: The source card provides additional context or sharpens interpretation of the target. ${affinityDescEn}`.trim();
      break;
    case 'synthesizes':
      descDe = `Synthese: Mehrere Energien verdichten sich hier zu einem integrierten Gesamtbild. ${affinityDescDe}`.trim();
      descEn = `Synthesis: Multiple energies converge here into an integrated whole. ${affinityDescEn}`.trim();
      break;
    default:
      descDe = `Beziehungstyp: ${relation.type} (Polarität: ${clamped.toFixed(2)})`;
      descEn = `Relation type: ${relation.type} (Polarity: ${clamped.toFixed(2)})`;
  }

  return {
    relation,
    sourcePlacement: source,
    targetPlacement: target,
    elementalAffinity: affinity,
    effectiveTension: Number(clamped.toFixed(2)),
    descriptionDe: descDe,
    descriptionEn: descEn,
  };
}

// ────────────────────────────────────────────────────────
// Deck Contract & Spread Validation
// ────────────────────────────────────────────────────────

export interface DeckContractResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validates whether a deck of cards satisfies a spread's deckContract.
 * Returns an object with `valid` boolean and descriptive `errors` array.
 */
export function validateDeckContract(
  deck: TarotCard[],
  contract: DeckContract
): DeckContractResult {
  const errors: string[] = [];

  // Check minimum card count
  if (deck.length < contract.minCards) {
    errors.push(
      `Deck has ${deck.length} cards but spread requires at least ${contract.minCards}.`
    );
  }

  // Check arcana requirements
  if (contract.requiredArcana === 'major_only') {
    const hasMajors = deck.some((c) => c.arcana === 'major');
    if (!hasMajors) {
      errors.push('Deck contract requires Major Arcana cards but none are present.');
    }
  } else if (contract.requiredArcana === 'full_78') {
    const majors = deck.filter((c) => c.arcana === 'major').length;
    const minors = deck.filter((c) => c.arcana === 'minor').length;
    if (majors < 22 || minors < 56) {
      errors.push(
        `Deck contract requires a full 78-card deck (22 Major + 56 Minor). Found: ${majors} Major, ${minors} Minor.`
      );
    }
  } else if (contract.requiredArcana === 'lenormand_36') {
    if (deck.length < 36) {
      errors.push(
        `Deck contract requires a 36-card Lenormand deck. Found: ${deck.length} cards.`
      );
    }
  } else if (contract.requiredArcana === 'minor_only') {
    const hasMinors = deck.some((c) => c.arcana === 'minor');
    if (!hasMinors) {
      errors.push('Deck contract requires Minor Arcana cards but none are present.');
    }
  }

  return { valid: errors.length === 0, errors };
}

export interface SpreadValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates the structural integrity of a SpreadDefinition:
 * - Unique slot IDs
 * - Sequential order numbers
 * - All relation endpoints reference existing slots
 * - No self-referencing relations
 */
export function validateSpreadDefinition(
  spread: SpreadDefinition
): SpreadValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const slotIds = new Set(spread.slots.map((s) => s.id));

  // Check for duplicate slot IDs
  if (slotIds.size !== spread.slots.length) {
    errors.push('Duplicate slot IDs detected.');
  }

  // Check sequential order
  const orders = spread.slots.map((s) => s.order).sort((a, b) => a - b);
  for (let i = 0; i < orders.length; i++) {
    if (orders[i] !== i + 1) {
      errors.push(
        `Slot order numbers are not sequential starting from 1. Expected ${i + 1}, found ${orders[i]}.`
      );
      break;
    }
  }

  // Check relation endpoint references
  for (const rel of spread.relations) {
    if (!slotIds.has(rel.source)) {
      errors.push(`Relation source '${rel.source}' does not reference an existing slot.`);
    }
    if (!slotIds.has(rel.target)) {
      errors.push(`Relation target '${rel.target}' does not reference an existing slot.`);
    }
    if (rel.source === rel.target) {
      errors.push(`Self-referencing relation detected: '${rel.source}' → '${rel.target}'.`);
    }
  }

  // Warning: orphaned slots (no relations)
  for (const slot of spread.slots) {
    const hasRelation = spread.relations.some(
      (r) => r.source === slot.id || r.target === slot.id
    );
    if (!hasRelation) {
      warnings.push(`Slot '${slot.id}' (order ${slot.order}) has no relations — it is an orphan node.`);
    }
  }

  // Warning: deck contract sanity
  if (spread.deckContract.minCards < spread.slots.length) {
    warnings.push(
      `deckContract.minCards (${spread.deckContract.minCards}) is less than the number of slots (${spread.slots.length}).`
    );
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ────────────────────────────────────────────────────────
// Reading Summary Generator
// ────────────────────────────────────────────────────────

export interface ReadingSummary {
  spreadName: string;
  totalSlots: number;
  filledSlots: number;
  reversedCount: number;
  averageTension: number;
  dominantElement: TarotElement | null;
  elementDistribution: Record<TarotElement, number>;
  hostileEdgeCount: number;
  friendlyEdgeCount: number;
  blockedFlowCount: number;
  narrativeDe: string;
  narrativeEn: string;
}

/**
 * Generates a structural summary of a complete reading, analyzing the
 * graph topology, elemental balance, reversal density, and tension landscape.
 */
export function generateReadingSummary(
  spread: SpreadDefinition,
  placements: Record<string, DrawnCardPlacement>,
  evaluatedEdges: EvaluatedEdge[]
): ReadingSummary {
  const filledSlots = Object.keys(placements).length;
  const reversedCount = Object.values(placements).filter((p) => p.isReversed).length;

  // Element distribution
  const elementDistribution: Record<TarotElement, number> = { fire: 0, water: 0, air: 0, earth: 0 };
  for (const p of Object.values(placements)) {
    elementDistribution[p.card.element]++;
  }
  const dominantElement = (Object.entries(elementDistribution) as [TarotElement, number][])
    .sort((a, b) => b[1] - a[1])[0];

  // Edge analysis
  const tensions = evaluatedEdges.map((e) => e.effectiveTension);
  const averageTension = tensions.length > 0
    ? Number((tensions.reduce((a, b) => a + b, 0) / tensions.length).toFixed(2))
    : 0;
  const hostileEdgeCount = evaluatedEdges.filter((e) => e.elementalAffinity === 'hostile').length;
  const friendlyEdgeCount = evaluatedEdges.filter((e) => e.elementalAffinity === 'friendly').length;
  const blockedFlowCount = evaluatedEdges.filter(
    (e) => e.relation.type === 'leads_to' && e.effectiveTension < -0.1
  ).length;

  // Narrative tone
  const reversalRatio = filledSlots > 0 ? reversedCount / filledSlots : 0;
  let toneDe = '';
  let toneEn = '';

  if (averageTension < -0.3) {
    toneDe = 'Die Legung ist von starker innerer Spannung und Widerständen geprägt.';
    toneEn = 'The reading is marked by strong inner tension and resistance.';
  } else if (averageTension > 0.3) {
    toneDe = 'Die Legung zeigt ein harmonisches, fließendes Energiebild.';
    toneEn = 'The reading shows a harmonious, flowing energy pattern.';
  } else {
    toneDe = 'Die Legung bewegt sich in einem ausgewogenen Spannungsfeld.';
    toneEn = 'The reading operates in a balanced tension field.';
  }

  if (reversalRatio > 0.4) {
    toneDe += ' Hohe Reversal-Dichte deutet auf Blockaden und innere Umkehrprozesse hin.';
    toneEn += ' High reversal density suggests blockages and internal recalibration.';
  }

  if (dominantElement[1] >= 3) {
    const elemNamesDe: Record<TarotElement, string> = { fire: 'Feuer', water: 'Wasser', air: 'Luft', earth: 'Erde' };
    toneDe += ` Dominantes Element: ${elemNamesDe[dominantElement[0]]} (${dominantElement[1]}×).`;
    toneEn += ` Dominant element: ${dominantElement[0]} (${dominantElement[1]}×).`;
  }

  if (blockedFlowCount > 0) {
    toneDe += ` ${blockedFlowCount} temporale Übergänge sind blockiert oder verzögert.`;
    toneEn += ` ${blockedFlowCount} temporal transition(s) blocked or stalled.`;
  }

  return {
    spreadName: spread.name,
    totalSlots: spread.slots.length,
    filledSlots,
    reversedCount,
    averageTension,
    dominantElement: dominantElement[0],
    elementDistribution,
    hostileEdgeCount,
    friendlyEdgeCount,
    blockedFlowCount,
    narrativeDe: toneDe.trim(),
    narrativeEn: toneEn.trim(),
  };
}

// ────────────────────────────────────────────────────────
// Built-in Spread Definitions
// ────────────────────────────────────────────────────────

/**
 * Built-in Spread Definitions matching the open JSON Schema.
 * 4 canonical spreads covering different reading purposes and card counts.
 */
export const BUILT_IN_SPREADS: Record<string, SpreadDefinition> = {
  'celtic-cross': {
    id: 'celtic-cross',
    name: 'The Celtic Cross',
    nameDe: 'Das Keltische Kreuz',
    author: 'Arthur Edward Waite (1910)',
    description: '10 Slots: Zentrales orthogonales Kreuz, 4 Kardinal-Wurzeln, 4-Karten-Stab.',
    deckContract: { minCards: 10, requiredArcana: 'any', allowReversals: true },
    slots: [
      { id: 'heart_situation', order: 1, label: 'The Present', labelDe: 'Gegenwart', role: 'situation', layout: { x: 30, y: 50, rotation: 0, layer: 0 } },
      { id: 'cross_obstacle', order: 2, label: 'The Crossing', labelDe: 'Die Querkarte', role: 'obstacle', layout: { x: 30, y: 50, rotation: 90, layer: 1 } },
      { id: 'foundation_root', order: 3, label: 'The Foundation', labelDe: 'Wurzel', role: 'foundation', layout: { x: 30, y: 82, rotation: 0, layer: 0 } },
      { id: 'past_receding', order: 4, label: 'Past', labelDe: 'Vergangenheit', role: 'past', layout: { x: 12, y: 50, rotation: 0, layer: 0 } },
      { id: 'crown_aspiration', order: 5, label: 'The Crown', labelDe: 'Krone', role: 'crown_aspiration', layout: { x: 30, y: 18, rotation: 0, layer: 0 } },
      { id: 'near_future', order: 6, label: 'Near Future', labelDe: 'Nahe Zukunft', role: 'near_future', layout: { x: 48, y: 50, rotation: 0, layer: 0 } },
      { id: 'staff_self', order: 7, label: 'Self', labelDe: 'Das Selbst', role: 'self_attitude', layout: { x: 80, y: 82, rotation: 0, layer: 0 } },
      { id: 'staff_environment', order: 8, label: 'Environment', labelDe: 'Umfeld', role: 'environment', layout: { x: 80, y: 60, rotation: 0, layer: 0 } },
      { id: 'staff_hopes_fears', order: 9, label: 'Hopes & Fears', labelDe: 'Hoffnungen / Ängste', role: 'hopes_fears', layout: { x: 80, y: 39, rotation: 0, layer: 0 } },
      { id: 'staff_outcome', order: 10, label: 'Final Outcome', labelDe: 'Kulmination', role: 'outcome', layout: { x: 80, y: 18, rotation: 0, layer: 0 } },
    ],
    relations: [
      { source: 'cross_obstacle', target: 'heart_situation', type: 'crosses', tension: -0.8, evaluateElementalDignity: true },
      { source: 'foundation_root', target: 'heart_situation', type: 'grounds', tension: 0.5, evaluateElementalDignity: true },
      { source: 'crown_aspiration', target: 'heart_situation', type: 'crowns', tension: 0.4, evaluateElementalDignity: true },
      { source: 'past_receding', target: 'heart_situation', type: 'leads_to', tension: 0.2, evaluateElementalDignity: false },
      { source: 'heart_situation', target: 'near_future', type: 'leads_to', tension: 0.2, evaluateElementalDignity: false },
      { source: 'staff_self', target: 'staff_environment', type: 'mirrors', tension: 0.0, evaluateElementalDignity: true },
      { source: 'staff_hopes_fears', target: 'staff_outcome', type: 'leads_to', tension: -0.3, evaluateElementalDignity: true },
      { source: 'near_future', target: 'staff_outcome', type: 'synthesizes', tension: 0.6, evaluateElementalDignity: true },
    ],
  },

  'three-card': {
    id: 'three-card',
    name: 'Three-Card Timeline',
    nameDe: 'Drei-Karten-Zeitstrahl',
    author: 'Traditional',
    description: '3 Slots: Ursprung (Vergangenheit) → Aktiver Zustand (Gegenwart) → Vektor (Zukunft).',
    deckContract: { minCards: 3, requiredArcana: 'any', allowReversals: true },
    slots: [
      { id: 'past', order: 1, label: 'Past', labelDe: 'Vergangenheit', role: 'past', layout: { x: 20, y: 50, rotation: 0, layer: 0 } },
      { id: 'present', order: 2, label: 'Present', labelDe: 'Gegenwart', role: 'situation', layout: { x: 50, y: 50, rotation: 0, layer: 0 } },
      { id: 'future', order: 3, label: 'Future', labelDe: 'Zukunft', role: 'outcome', layout: { x: 80, y: 50, rotation: 0, layer: 0 } },
    ],
    relations: [
      { source: 'past', target: 'present', type: 'leads_to', tension: 0.1, evaluateElementalDignity: true },
      { source: 'present', target: 'future', type: 'leads_to', tension: 0.1, evaluateElementalDignity: true },
      { source: 'past', target: 'future', type: 'mirrors', tension: 0.0, evaluateElementalDignity: false },
    ],
  },

  'horseshoe': {
    id: 'horseshoe',
    name: 'The Horseshoe',
    nameDe: 'Das Hufeisen',
    author: 'Traditional (19th century)',
    description: '7 Slots in U-Form: Vergangenheit, Gegenwart, verborgene Einflüsse, innere Haltung, äußere Einflüsse, Rat und wahrscheinliches Ergebnis.',
    deckContract: { minCards: 7, requiredArcana: 'any', allowReversals: true },
    slots: [
      { id: 'hs_past', order: 1, label: 'The Past', labelDe: 'Vergangenheit', role: 'past', layout: { x: 10, y: 20, rotation: 0, layer: 0 } },
      { id: 'hs_present', order: 2, label: 'The Present', labelDe: 'Gegenwart', role: 'situation', layout: { x: 10, y: 50, rotation: 0, layer: 0 } },
      { id: 'hs_hidden', order: 3, label: 'Hidden Influences', labelDe: 'Verborgene Einflüsse', role: 'foundation', layout: { x: 10, y: 80, rotation: 0, layer: 0 } },
      { id: 'hs_attitude', order: 4, label: 'Your Attitude', labelDe: 'Innere Haltung', role: 'self_attitude', layout: { x: 50, y: 80, rotation: 0, layer: 0 } },
      { id: 'hs_external', order: 5, label: 'External Influences', labelDe: 'Äußere Einflüsse', role: 'environment', layout: { x: 90, y: 80, rotation: 0, layer: 0 } },
      { id: 'hs_advice', order: 6, label: 'Advice', labelDe: 'Rat / Empfehlung', role: 'advice', layout: { x: 90, y: 50, rotation: 0, layer: 0 } },
      { id: 'hs_outcome', order: 7, label: 'Likely Outcome', labelDe: 'Wahrscheinliches Ergebnis', role: 'outcome', layout: { x: 90, y: 20, rotation: 0, layer: 0 } },
    ],
    relations: [
      { source: 'hs_past', target: 'hs_present', type: 'leads_to', tension: 0.2, evaluateElementalDignity: true },
      { source: 'hs_present', target: 'hs_hidden', type: 'grounds', tension: 0.3, evaluateElementalDignity: true },
      { source: 'hs_hidden', target: 'hs_attitude', type: 'clarifies', tension: 0.1, evaluateElementalDignity: true },
      { source: 'hs_attitude', target: 'hs_external', type: 'mirrors', tension: 0.0, evaluateElementalDignity: true },
      { source: 'hs_external', target: 'hs_advice', type: 'leads_to', tension: 0.2, evaluateElementalDignity: false },
      { source: 'hs_advice', target: 'hs_outcome', type: 'leads_to', tension: 0.4, evaluateElementalDignity: true },
      { source: 'hs_past', target: 'hs_outcome', type: 'mirrors', tension: -0.1, evaluateElementalDignity: false },
    ],
  },

  'relationship-cross': {
    id: 'relationship-cross',
    name: 'The Relationship Cross',
    nameDe: 'Das Beziehungskreuz',
    author: 'Traditional / Labyrinthos-Variation',
    description: '5 Slots: Situation, Fragende Person, Gegenüber, Hindernis und nächster Schritt — für Beziehungsfragen.',
    deckContract: { minCards: 5, requiredArcana: 'any', allowReversals: true },
    slots: [
      { id: 'rc_situation', order: 1, label: 'The Relationship', labelDe: 'Die Beziehung', role: 'situation', layout: { x: 50, y: 50, rotation: 0, layer: 0 } },
      { id: 'rc_querent', order: 2, label: 'You', labelDe: 'Du / Fragende Person', role: 'querent', layout: { x: 20, y: 50, rotation: 0, layer: 0 } },
      { id: 'rc_partner', order: 3, label: 'Them / Partner', labelDe: 'Gegenüber / Partner:in', role: 'environment', layout: { x: 80, y: 50, rotation: 0, layer: 0 } },
      { id: 'rc_obstacle', order: 4, label: 'The Obstacle', labelDe: 'Das Hindernis', role: 'obstacle', layout: { x: 50, y: 20, rotation: 0, layer: 0 } },
      { id: 'rc_advice', order: 5, label: 'Next Step / Advice', labelDe: 'Nächster Schritt', role: 'advice', layout: { x: 50, y: 80, rotation: 0, layer: 0 } },
    ],
    relations: [
      { source: 'rc_querent', target: 'rc_situation', type: 'leads_to', tension: 0.3, evaluateElementalDignity: true },
      { source: 'rc_partner', target: 'rc_situation', type: 'leads_to', tension: 0.3, evaluateElementalDignity: true },
      { source: 'rc_querent', target: 'rc_partner', type: 'mirrors', tension: 0.0, evaluateElementalDignity: true },
      { source: 'rc_obstacle', target: 'rc_situation', type: 'opposes', tension: -0.6, evaluateElementalDignity: true },
      { source: 'rc_situation', target: 'rc_advice', type: 'leads_to', tension: 0.4, evaluateElementalDignity: false },
    ],
  },
};

