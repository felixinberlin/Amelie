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

export type SpreadLayoutType =
  | 'linear'
  | 'cross'
  | 'circular'
  | 'symbolic'
  | 'triangular'
  | 'custom';

export type SpreadDifficulty = 'beginner' | 'easy' | 'intermediate' | 'advanced' | 'expert';

export interface SpreadInstructions {
  preDraw?: string;
  drawingOrder?: string;
  interpretationGuide?: string;
}

export interface ReadingVariant {
  id: string;
  name: string;
  nameDe?: string;
  description?: string;
}

export type RelationType =
  | 'crosses'
  | 'grounds'
  | 'crowns'
  | 'leads_to'
  | 'mirrors'
  | 'opposes'
  | 'clarifies'
  | 'synthesizes'
  | 'adjacent_to';

export interface SpreadRelation {
  source: string;
  target: string;
  type: RelationType;
  tension: number; // -1.0 to 1.0
  evaluateElementalDignity?: boolean;
}

export interface DeckContract {
  minCards: number;
  maxCards?: number;
  requiredArcana: 'any' | 'major_only' | 'minor_only' | 'full_78' | 'lenormand_36';
  allowReversals: boolean;
  significatorRequired?: boolean;
}

export interface SpreadDefinition {
  schemaVersion?: string;
  id: string;
  name: string;
  nameDe: string;
  author: string;
  tradition?: 'rws' | 'thoth' | 'marseille' | 'lenormand' | 'secular' | 'open' | 'custom';
  layoutType?: SpreadLayoutType;
  difficulty?: SpreadDifficulty;
  description: string;
  instructions?: SpreadInstructions;
  readingVariants?: ReadingVariant[];
  deckContract: DeckContract;
  slots: SpreadSlot[];
  relations: SpreadRelation[];
}

export interface TarotReadingCard {
  slotId: string;
  cardId: string;
  orientation: 'upright' | 'reversed';
  notes?: string;
}

export interface TarotReadingMetrics {
  averageTension?: number;
  dominantElement?: TarotElement | string;
  reversedRatio?: number;
}

export interface TarotReading {
  schemaVersion: string;
  readingId: string;
  spreadId: string;
  question?: string;
  drawnAt: string;
  deck?: {
    name?: string;
    reversals?: boolean;
  };
  cards: TarotReadingCard[];
  interpretation?: string;
  metrics?: TarotReadingMetrics;
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
    case 'adjacent_to':
      descDe = `Räumliche / thematische Nachbarschaft: Zwei Karten stehen im selben Bedeutungsfeld nebeneinander. ${affinityDescDe}`.trim();
      descEn = `Spatial / thematic adjacency: Two cards stand alongside each other within the same contextual field. ${affinityDescEn}`.trim();
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

export interface ReadingValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a saved TarotReading record against a spread definition.
 * Checks that all card slotIds match valid slots in the spread, orientations are valid,
 * and no duplicate slot allocations occur.
 */
export function validateReadingRecord(
  reading: TarotReading,
  spread?: SpreadDefinition
): ReadingValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!reading.readingId || reading.readingId.trim() === '') {
    errors.push('Reading record missing readingId.');
  }
  if (!reading.spreadId || reading.spreadId.trim() === '') {
    errors.push('Reading record missing spreadId.');
  }
  if (!reading.drawnAt || isNaN(Date.parse(reading.drawnAt))) {
    errors.push('Reading record drawnAt must be a valid ISO 8601 date-time string.');
  }
  if (!Array.isArray(reading.cards) || reading.cards.length === 0) {
    errors.push('Reading record must contain at least one drawn card.');
  } else {
    const assignedSlots = new Set<string>();
    const drawnCardIds = new Set<string>();

    for (const cardPlacement of reading.cards) {
      if (!cardPlacement.slotId) {
        errors.push('Card placement missing slotId.');
      } else {
        if (assignedSlots.has(cardPlacement.slotId)) {
          errors.push(`Duplicate card assignment to slot '${cardPlacement.slotId}'.`);
        }
        assignedSlots.add(cardPlacement.slotId);
      }

      if (!cardPlacement.cardId) {
        errors.push('Card placement missing cardId.');
      } else {
        if (drawnCardIds.has(cardPlacement.cardId)) {
          warnings.push(`Card '${cardPlacement.cardId}' was drawn multiple times in the same reading.`);
        }
        drawnCardIds.add(cardPlacement.cardId);
      }

      if (cardPlacement.orientation !== 'upright' && cardPlacement.orientation !== 'reversed') {
        errors.push(`Invalid card orientation '${cardPlacement.orientation}' for slot '${cardPlacement.slotId}'.`);
      }
    }

    if (spread) {
      if (spread.id !== reading.spreadId) {
        warnings.push(`Spread ID mismatch: reading references '${reading.spreadId}' but evaluated against '${spread.id}'.`);
      }
      const spreadSlotIds = new Set(spread.slots.map((s) => s.id));
      for (const slotId of assignedSlots) {
        if (!spreadSlotIds.has(slotId)) {
          errors.push(`Card placed in slot '${slotId}' which does not exist in spread '${spread.id}'.`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export interface CatalogValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  spreadCount: number;
}

/**
 * Validates a complete catalog collection of spreads.
 * Enforces cross-field uniqueness across spread IDs and validates each spread.
 */
export function validateSpreadCatalog(spreads: SpreadDefinition[]): CatalogValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const spreadIds = new Set<string>();

  for (const spread of spreads) {
    if (spreadIds.has(spread.id)) {
      errors.push(`Catalog contains duplicate spread ID: '${spread.id}'.`);
    }
    spreadIds.add(spread.id);

    const result = validateSpreadDefinition(spread);
    for (const err of result.errors) {
      errors.push(`[${spread.id}] ${err}`);
    }
    for (const warn of result.warnings) {
      warnings.push(`[${spread.id}] ${warn}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    spreadCount: spreads.length,
  };
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
/**
 * Built-in Spread Definitions matching the open JSON Schema (v2.0.0).
 * 7 canonical spreads covering all difficulty tiers and layout types.
 */
export const BUILT_IN_SPREADS: Record<string, SpreadDefinition> = {
  'single-card': {
    schemaVersion: '2.0.0',
    id: 'single-card',
    name: 'Single Card Focus',
    nameDe: 'Tageskarte / Einzelfokus',
    author: 'Traditional',
    tradition: 'open',
    layoutType: 'linear',
    difficulty: 'beginner',
    description: 'Ein Einzelkarten-Impuls für den Tag oder zur Kontemplation eines spezifischen Themas.',
    instructions: {
      preDraw: 'Formuliere einen klaren Fokus oder eine offene Frage für den Tag.',
      drawingOrder: 'Ziehe eine einzelne Karte und lege sie zentriert ab.',
      interpretationGuide: 'Betrachte Symbolik, Element und Archetyp als archetypischen Impuls.',
    },
    deckContract: { minCards: 1, requiredArcana: 'any', allowReversals: true },
    slots: [
      { id: 'focus_card', order: 1, label: 'Core Focus', labelDe: 'Tagesfokus / Kernthema', role: 'situation', layout: { x: 50, y: 50, rotation: 0, layer: 0 } },
    ],
    relations: [],
  },

  'past-present-future': {
    schemaVersion: '2.0.0',
    id: 'past-present-future',
    name: 'Past, Present, Future Timeline',
    nameDe: 'Drei-Karten-Zeitstrahl',
    author: 'Traditional',
    tradition: 'open',
    layoutType: 'linear',
    difficulty: 'beginner',
    description: '3 Slots: Ursprung (Vergangenheit) → Aktiver Zustand (Gegenwart) → Trajektorie (Zukunft).',
    instructions: {
      preDraw: 'Kläre die zeitliche Dimension der Fragestellung.',
      drawingOrder: 'Ziehe von links nach rechts: Vergangenheit, Gegenwart, Zukunft.',
      interpretationGuide: 'Analysiere die Übergangskanten und prüfe, ob Reversals den temporalen Fluss blockieren.',
    },
    deckContract: { minCards: 3, requiredArcana: 'any', allowReversals: true },
    slots: [
      { id: 'time_past', order: 1, label: 'Past / Origin', labelDe: 'Vergangenheit (Ursprung)', role: 'past', layout: { x: 20, y: 50, rotation: 0, layer: 0 } },
      { id: 'time_present', order: 2, label: 'Present / Active State', labelDe: 'Gegenwart (Aktiver Zustand)', role: 'situation', layout: { x: 50, y: 50, rotation: 0, layer: 0 } },
      { id: 'time_future', order: 3, label: 'Future / Trajectory', labelDe: 'Zukunft (Trajektorie)', role: 'outcome', layout: { x: 80, y: 50, rotation: 0, layer: 0 } },
    ],
    relations: [
      { source: 'time_past', target: 'time_present', type: 'leads_to', tension: 0.2, evaluateElementalDignity: true },
      { source: 'time_present', target: 'time_future', type: 'leads_to', tension: 0.2, evaluateElementalDignity: true },
      { source: 'time_past', target: 'time_future', type: 'mirrors', tension: 0.0, evaluateElementalDignity: false },
    ],
  },

  'three-card': {
    schemaVersion: '2.0.0',
    id: 'three-card',
    name: 'Three-Card Timeline',
    nameDe: 'Drei-Karten-Zeitstrahl',
    author: 'Traditional',
    tradition: 'open',
    layoutType: 'linear',
    difficulty: 'beginner',
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

  'decision': {
    schemaVersion: '2.0.0',
    id: 'decision',
    name: 'Two-Path Decision',
    nameDe: 'Entscheidungskreuz (Zwei Wege)',
    author: 'Traditional / Hajo Banzhaf',
    tradition: 'open',
    layoutType: 'triangular',
    difficulty: 'intermediate',
    description: '5 Slots zur Gegenüberstellung zweier Handlungsoptionen (Weg A vs. Weg B) ausgehend von der Ausgangslage.',
    deckContract: { minCards: 5, requiredArcana: 'any', allowReversals: true },
    slots: [
      { id: 'dec_root', order: 1, label: 'The Core Dilemma', labelDe: 'Die Ausgangslage (Dilemma)', role: 'situation', layout: { x: 50, y: 80, rotation: 0, layer: 0 } },
      { id: 'path_a_step', order: 2, label: 'Path A: Step', labelDe: 'Weg A: Nächster Schritt', role: 'option_a', layout: { x: 25, y: 45, rotation: 0, layer: 0 } },
      { id: 'path_a_outcome', order: 3, label: 'Path A: Outcome', labelDe: 'Weg A: Konsequenz / Ziel', role: 'outcome', layout: { x: 25, y: 15, rotation: 0, layer: 0 } },
      { id: 'path_b_step', order: 4, label: 'Path B: Step', labelDe: 'Weg B: Nächster Schritt', role: 'option_b', layout: { x: 75, y: 45, rotation: 0, layer: 0 } },
      { id: 'path_b_outcome', order: 5, label: 'Path B: Outcome', labelDe: 'Weg B: Konsequenz / Ziel', role: 'outcome', layout: { x: 75, y: 15, rotation: 0, layer: 0 } },
    ],
    relations: [
      { source: 'dec_root', target: 'path_a_step', type: 'leads_to', tension: 0.2, evaluateElementalDignity: true },
      { source: 'path_a_step', target: 'path_a_outcome', type: 'leads_to', tension: 0.3, evaluateElementalDignity: true },
      { source: 'dec_root', target: 'path_b_step', type: 'leads_to', tension: 0.2, evaluateElementalDignity: true },
      { source: 'path_b_step', target: 'path_b_outcome', type: 'leads_to', tension: 0.3, evaluateElementalDignity: true },
      { source: 'path_a_outcome', target: 'path_b_outcome', type: 'opposes', tension: -0.4, evaluateElementalDignity: true },
    ],
  },

  'celtic-cross': {
    schemaVersion: '2.0.0',
    id: 'celtic-cross',
    name: 'The Celtic Cross',
    nameDe: 'Das Keltische Kreuz',
    author: 'Arthur Edward Waite (1910)',
    tradition: 'rws',
    layoutType: 'cross',
    difficulty: 'advanced',
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

  'horseshoe': {
    schemaVersion: '2.0.0',
    id: 'horseshoe',
    name: 'The Horseshoe',
    nameDe: 'Das Hufeisen',
    author: 'Traditional (19th century)',
    tradition: 'open',
    layoutType: 'linear',
    difficulty: 'intermediate',
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

  'relationship': {
    schemaVersion: '2.0.0',
    id: 'relationship',
    name: 'Relationship Dynamics',
    nameDe: 'Beziehungs-Dynamik (6 Slots)',
    author: 'Traditional / Labyrinthos-Variation',
    tradition: 'open',
    layoutType: 'custom',
    difficulty: 'intermediate',
    description: '6 Slots: Gegenüberstellung zweier Partner (Bewusste Haltung vs. Unbewusste Wurzel) mit zentraler Schnittmenge und Entwicklungspfad.',
    deckContract: { minCards: 6, requiredArcana: 'any', allowReversals: true },
    slots: [
      { id: 'rel_querent_conscious', order: 1, label: 'You: Conscious Attitude', labelDe: 'Du: Bewusste Haltung', role: 'querent', layout: { x: 20, y: 35, rotation: 0, layer: 0 } },
      { id: 'rel_partner_conscious', order: 2, label: 'Partner: Conscious Attitude', labelDe: 'Gegenüber: Bewusste Haltung', role: 'environment', layout: { x: 80, y: 35, rotation: 0, layer: 0 } },
      { id: 'rel_querent_subconscious', order: 3, label: 'You: Subconscious Root', labelDe: 'Du: Unbewusste Wurzel', role: 'foundation', layout: { x: 20, y: 70, rotation: 0, layer: 0 } },
      { id: 'rel_partner_subconscious', order: 4, label: 'Partner: Subconscious Root', labelDe: 'Gegenüber: Unbewusste Wurzel', role: 'foundation', layout: { x: 80, y: 70, rotation: 0, layer: 0 } },
      { id: 'rel_central_bond', order: 5, label: 'The Bond / Active Connection', labelDe: 'Das Bindeglied / Aktive Verbindung', role: 'situation', layout: { x: 50, y: 35, rotation: 0, layer: 0 } },
      { id: 'rel_shared_trajectory', order: 6, label: 'Shared Trajectory / Synthesis', labelDe: 'Gemeinsame Trajektorie / Synthese', role: 'outcome', layout: { x: 50, y: 70, rotation: 0, layer: 0 } },
    ],
    relations: [
      { source: 'rel_querent_conscious', target: 'rel_partner_conscious', type: 'mirrors', tension: 0.0, evaluateElementalDignity: true },
      { source: 'rel_querent_subconscious', target: 'rel_querent_conscious', type: 'grounds', tension: 0.3, evaluateElementalDignity: true },
      { source: 'rel_partner_subconscious', target: 'rel_partner_conscious', type: 'grounds', tension: 0.3, evaluateElementalDignity: true },
      { source: 'rel_querent_conscious', target: 'rel_central_bond', type: 'leads_to', tension: 0.2, evaluateElementalDignity: true },
      { source: 'rel_partner_conscious', target: 'rel_central_bond', type: 'leads_to', tension: 0.2, evaluateElementalDignity: true },
      { source: 'rel_central_bond', target: 'rel_shared_trajectory', type: 'synthesizes', tension: 0.4, evaluateElementalDignity: true },
    ],
  },

  'relationship-cross': {
    schemaVersion: '2.0.0',
    id: 'relationship-cross',
    name: 'The Relationship Cross',
    nameDe: 'Das Beziehungskreuz (5 Slots)',
    author: 'Traditional / Labyrinthos-Variation',
    tradition: 'open',
    layoutType: 'cross',
    difficulty: 'intermediate',
    description: '5 Slots: Situation, Fragende Person, Gegenüber, Hindernis und nächster Schritt.',
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

  'tree-of-life': {
    schemaVersion: '2.0.0',
    id: 'tree-of-life',
    name: 'Tree of Life (Kabbalistic 10 Sephirot)',
    nameDe: 'Lebensbaum (10 Sephirot)',
    author: 'Hermetic Order of the Golden Dawn / Traditional',
    tradition: 'thoth',
    layoutType: 'symbolic',
    difficulty: 'expert',
    description: '10 Slots im kabbalistischen Lebensbaum: Von Kether (Urquelle) über die Säulen der Gnade und Strenge bis Malkuth (Manifestation).',
    deckContract: { minCards: 10, requiredArcana: 'any', allowReversals: true },
    slots: [
      { id: 'sephira_1_kether', order: 1, label: '1 Kether (The Crown)', labelDe: '1 Kether (Die Krone)', role: 'crown_aspiration', layout: { x: 50, y: 8, rotation: 0, layer: 0 } },
      { id: 'sephira_2_chokmah', order: 2, label: '2 Chokmah (Wisdom)', labelDe: '2 Chokmah (Weisheit)', role: 'situation', layout: { x: 75, y: 20, rotation: 0, layer: 0 } },
      { id: 'sephira_3_binah', order: 3, label: '3 Binah (Understanding)', labelDe: '3 Binah (Verstand / Form)', role: 'foundation', layout: { x: 25, y: 20, rotation: 0, layer: 0 } },
      { id: 'sephira_4_chesed', order: 4, label: '4 Chesed (Mercy)', labelDe: '4 Chesed (Gnade / Expansion)', role: 'situation', layout: { x: 75, y: 42, rotation: 0, layer: 0 } },
      { id: 'sephira_5_geburah', order: 5, label: '5 Geburah (Severity)', labelDe: '5 Geburah (Strenge / Urteil)', role: 'obstacle', layout: { x: 25, y: 42, rotation: 0, layer: 0 } },
      { id: 'sephira_6_tiphareth', order: 6, label: '6 Tiphareth (Beauty / Heart)', labelDe: '6 Tiphareth (Schönheit / Mitte)', role: 'synthesis', layout: { x: 50, y: 52, rotation: 0, layer: 0 } },
      { id: 'sephira_7_netzach', order: 7, label: '7 Netzach (Victory)', labelDe: '7 Netzach (Sieg / Emotion)', role: 'situation', layout: { x: 75, y: 68, rotation: 0, layer: 0 } },
      { id: 'sephira_8_hod', order: 8, label: '8 Hod (Splendor)', labelDe: '8 Hod (Glanz / Intellekt)', role: 'self_attitude', layout: { x: 25, y: 68, rotation: 0, layer: 0 } },
      { id: 'sephira_9_yesod', order: 9, label: '9 Yesod (Foundation)', labelDe: '9 Yesod (Fundament / Astral)', role: 'foundation', layout: { x: 50, y: 80, rotation: 0, layer: 0 } },
      { id: 'sephira_10_malkuth', order: 10, label: '10 Malkuth (Kingdom)', labelDe: '10 Malkuth (Das Reich / Materie)', role: 'outcome', layout: { x: 50, y: 94, rotation: 0, layer: 0 } },
    ],
    relations: [
      { source: 'sephira_1_kether', target: 'sephira_2_chokmah', type: 'leads_to', tension: 0.2, evaluateElementalDignity: true },
      { source: 'sephira_2_chokmah', target: 'sephira_3_binah', type: 'opposes', tension: -0.2, evaluateElementalDignity: true },
      { source: 'sephira_3_binah', target: 'sephira_4_chesed', type: 'leads_to', tension: 0.1, evaluateElementalDignity: true },
      { source: 'sephira_4_chesed', target: 'sephira_5_geburah', type: 'opposes', tension: -0.3, evaluateElementalDignity: true },
      { source: 'sephira_4_chesed', target: 'sephira_6_tiphareth', type: 'synthesizes', tension: 0.4, evaluateElementalDignity: true },
      { source: 'sephira_5_geburah', target: 'sephira_6_tiphareth', type: 'synthesizes', tension: 0.4, evaluateElementalDignity: true },
      { source: 'sephira_6_tiphareth', target: 'sephira_7_netzach', type: 'leads_to', tension: 0.2, evaluateElementalDignity: true },
      { source: 'sephira_7_netzach', target: 'sephira_8_hod', type: 'opposes', tension: -0.2, evaluateElementalDignity: true },
      { source: 'sephira_7_netzach', target: 'sephira_9_yesod', type: 'synthesizes', tension: 0.3, evaluateElementalDignity: true },
      { source: 'sephira_8_hod', target: 'sephira_9_yesod', type: 'synthesizes', tension: 0.3, evaluateElementalDignity: true },
      { source: 'sephira_9_yesod', target: 'sephira_10_malkuth', type: 'leads_to', tension: 0.4, evaluateElementalDignity: true },
    ],
  },
};

