/**
 * Ortsnecknamen & Dorfrivalitäts-Engine (German Village Mockery & Folklore Rivalry)
 *
 * Engine for the Ticket 01 prototype of 'ortsneckname'.
 * Decodes authentic German village mockery nicknames, regional feuds, and etymological lore
 * with multi-faceted German cultural commentary (Die Ärzte, Böhse Onkelz, Die Maus, Loriot).
 */

export interface VillageMockeryEntry {
  id: string;
  mockeryNameDe: string;
  mockeryNameEn: string;
  mockeryNameEs: string;
  correctTown: string;
  regionDe: string;
  regionEn: string;
  regionEs: string;
  options: string[]; // 4 options including correctTown
  legendDe: string;
  legendEn: string;
  legendEs: string;
  etymologyDe: string;
  etymologyEn: string;
  etymologyEs: string;
  culturalVoices: {
    aerzteDe: string;
    aerzteEn: string;
    onkelzDe: string;
    onkelzEn: string;
    mausDe: string;
    mausEn: string;
    loriotDe: string;
    loriotEn: string;
  };
}

export const ORTSNECKNAMEN_CORPUS: VillageMockeryEntry[] = [
  {
    id: 'mondspritzer',
    mockeryNameDe: 'Die Mondspritzer',
    mockeryNameEn: 'The Moon Splashers',
    mockeryNameEs: 'Los rociadores de la luna',
    correctTown: 'Zeil am Main',
    regionDe: 'Unterfranken (Bayern)',
    regionEn: 'Lower Franconia (Bavaria)',
    regionEs: 'Baja Franconia (Baviera)',
    options: ['Zeil am Main', 'Kitzingen', 'Volkach', 'Schweinfurt'],
    legendDe: 'In einer klaren Herbstnacht stand der blutrote Vollmond tief hinter dem Dach der St.-Michael-Kirche. Der Nachtwächter schlug Feueralarm. Die Bürger eilten mit der hölzernen Handspritze herbei und spritzten stundenlang verzweifelt Wasser auf den Mond, um den Brand zu löschen.',
    legendEn: 'On a misty autumn night, a blood-red full moon hovered just behind the church steeple. The night watchman raised the alarm. Villagers rushed with their wooden pump cart and spent hours dousing the moon with water.',
    legendEs: 'En una noche de niebla, la luna llena roja brillaba tras la torre de la iglesia. El sereno dio la alarma y los vecinos pasaron horas tirando agua con la bomba de incendios a la luna.',
    etymologyDe: 'Seit dem 18. Jh. im Maintal bezeugt. Typischer astronomischer Spottname gegen Kleinstädte.',
    etymologyEn: 'Recorded since the 18th century along the Main river. Classic astronomical mockery archetype.',
    etymologyEs: 'Documentado desde el siglo XVIII. Típico mote astronómico burlón.',
    culturalVoices: {
      aerzteDe: '„Es ist nicht deine Schuld, dass der Mond brennt – aber deine Schuld, wenn du Wasser draufschüttest! Drei Akkorde, Schläuche ausgerollt und Westerland ist weit weg. Punkrock am Löschkübel!“',
      aerzteEn: '"It’s not your fault the moon is on fire — but it is your fault if you try to extinguish it with buckets! Three chords, unroll the hoses, pure punk rock by the pond!"',
      onkelzDe: '„Sie kämpften gegen das Licht am Horizont! Ein Schrei in der Finsternis, der Mut der Verzweifelten gegen das Universum. Fehler wurden gemacht, Narben blieben, aber sie standen treu zusammen am Strahlrohr!“',
      onkelzEn: '"They fought the burning light on the horizon! A cry in the dark, desperate courage against the cosmos. Mistakes were carved in stone, but they stood shoulder to shoulder at the hose!"',
      mausDe: '„Das hier... ist der Mond. Und das ist eine Feuerwehrspritze. Wenn man Wasser auf den Mond spritzt, wird der Mond nicht nass, aber der Herr Brandmeister. Klingt komisch, ist aber so.“',
      mausEn: '"This here... is the moon. And this is a fire pump. When you spray water at the moon, the moon doesn’t get wet, but the fire chief does. Sounds funny, but that’s how it is."',
      loriotDe: '„Bitte sagen Sie jetzt nichts, Herr Müller-Lüdenscheidt! Ein Vollmond gehört ins Arbeitszimmer, nicht brennend über die Raiffeisenbank. Die Ente bleibt draußen!“',
      loriotEn: '"Please do not utter a word, Herr Müller-Lüdenscheidt! A full moon belongs in the study, not ablaze atop the village co-op. The rubber duck stays outside!"',
    },
  },
  {
    id: 'zwiebeltreter',
    mockeryNameDe: 'Die Zwiebeltreter',
    mockeryNameEn: 'The Onion Stampers',
    mockeryNameEs: 'Los pisadores de cebollas',
    correctTown: 'Bamberg',
    regionDe: 'Oberfranken (Bayern)',
    regionEn: 'Upper Franconia (Bavaria)',
    regionEs: 'Alta Franconia (Baviera)',
    options: ['Bamberg', 'Forchheim', 'Bayreuth', 'Coburg'],
    legendDe: 'Die traditionsreichen Bamberger Gärtner banden sich flache Holzbretter unter die Stiefel und traten das saftige Zwiebelgrün um. Dadurch floss die Nährstoffkraft direkt in die Zwiebelknolle statt in die Blüte. Die Nachbardörfer spotteten über den scheinbar sinnlosen Trampeltanz.',
    legendEn: 'Bamberg market gardeners strapped flat wooden boards to their boots to stomp down the green onion tops in summer, redirecting plant energy into the bulb. Surrounding rural hamlets mocked the stomping dance.',
    legendEs: 'Los hortelanos de Bamberg se ataban tablas de madera a las botas para pisar los tallos de cebolla y engordar el bulbo. Los pueblos vecinos se burlaban de semejante baile sobre los huertos.',
    etymologyDe: 'Bis heute Ehrentitel der Bamberger Altstadtgärtner (UNESCO-Welterbe-Tradition).',
    etymologyEn: 'Today an honorary title for Bamberg urban gardeners (UNESCO world heritage craft).',
    etymologyEs: 'Hoy día es un título de honor para los hortelanos históricos de Bamberg.',
    culturalVoices: {
      aerzteDe: '„Gewalt gegen Lauchgewächse ist keine Lösung! Aber mit festen Doc-Martens-Stiefeln auf Knollen rumtrampeln hat verdammt viel Beat. Schrei nach Zwiebelsaft!“',
      aerzteEn: '"Violence against leeks is never the answer! But stomping bulbs with Doc Martens has one hell of a rhythm. Cry for onion juice!"',
      onkelzDe: '„Geboren auf dem Acker, getauft im Staub der Furche! Sie traten auf das Kraut, damit die Sippe den Winter überlebt. Nichts ist für die Ewigkeit – außer der Bamberger Zwiebel!“',
      onkelzEn: '"Born on the soil, baptized in furrow dust! They trampled the greens so their kin would survive the frost. Nothing is forever — except the Bamberg onion!"',
      mausDe: '„Warum treten die Bamberger auf die Zwiebel? Weil sie keine Schaufel hatten? Nein. Wenn der Stängel umknickt, wächst die Zwiebel unter der Erde doppelt so schnell. Klingt komisch, ist aber so.“',
      mausEn: '"Why did they stomp the onion? Because they forgot their shovel? No. Snapping the neck forces the onion underground to swell twice as fast. Sounds funny, but that’s how it is."',
      loriotDe: '„Das Ei ist hart, und die Zwiebel getreten. Ein Leben ohne Zwiebeltreten ist zwar möglich, aber sinnlos. Wollen Sie diese Zwiebel jetzt essen oder betrachten?“',
      loriotEn: '"The egg is hard, and the onion is trampled. A life without stomping onions is possible, but entirely pointless."',
    },
  },
  {
    id: 'sandhasen',
    mockeryNameDe: 'Die Sandhasen',
    mockeryNameEn: 'The Sand Hares',
    mockeryNameEs: 'Las liebres de arena',
    correctTown: 'Rastatt',
    regionDe: 'Baden-Württemberg',
    regionEn: 'Baden-Württemberg',
    regionEs: 'Baden-Wurtemberg',
    options: ['Rastatt', 'Karlsruhe', 'Baden-Baden', 'Pforzheim'],
    legendDe: 'Die Böden der Rastatter Rheinaue bestanden aus unfruchtbaren Kies- und Flugsanddünen. Getreide verkümmerten, doch Feldhasen gruben sich massenhaft in den Sand ein. Die wohlhabenden Karlsruher und Badener Nachbarn nannten die Rastatter spöttisch „Sandhasen“, die sich wie Nager vom Sand ernähren müssten.',
    legendEn: 'The Rhine floodplains around Rastatt were barren drift sand. Crops withered, while wild hares burrowed in droves. Wealthy neighbors in Karlsruhe sneered that Rastatters were mere "sand hares" digging for gravel.',
    legendEs: 'Las riberas del Rin en Rastatt eran dunas de arena estéril donde proliferaban las liebres. Los vecinos ricos de Karlsruhe se burlaban diciendo que los de Rastatt eran liebres que comían arena.',
    etymologyDe: 'Verbreitet in der Kurpfalz und am Oberrhein als Metapher für karge Dünenlandschaften.',
    etymologyEn: 'Widespread across Upper Rhine lowlands denoting sandy, nutrient-depleted soil.',
    etymologyEs: 'Mote típico del Rin superior para habitantes de llanuras arenosas pobres.',
    culturalVoices: {
      aerzteDe: '„Sand im Getriebe, Sand in der Unterwäsche! Auf Sylt kostet der Strand 12 Euro Kurtaxe am Tag, in Rastatt gibt es die Düne für lau. Oh, ich hab solche Sehnsucht nach Sandhasen!“',
      aerzteEn: '"Sand in the gears, sand in the socks! On Sylt beach tax costs 12 euros a day, in Rastatt you get the sand dunes for free. Oh, I yearn so badly for sand hares!"',
      onkelzDe: '„Wo der Sandsturm den Atem raubt, steht der Hase seinen Mann! Aus der Asche des Rheins, verachtet von den Fürsten. Wir beugen uns keinem badischen Hofschranzen!“',
      onkelzEn: '"Where drift sand chokes the breath, the hare holds the line! Out of the ash of the Rhine, despised by the princes. We bow to no court flatterers!"',
      mausDe: '„Hier hoppelt ein Hase. Fump, fump, fump. Und warum hoppelt er im Sand? Weil im Kies keine Karotten wachsen. Die Rastatter fanden das nicht lustig, haben den Hasen aber trotzdem auf ihr Wappen gemalt.“',
      mausEn: '"Here hops a hare. Thump, thump, thump. And why in the sand? Because carrots don’t grow in river gravel. Rastatters didn’t find it funny, yet put the hare right onto their town crest."',
      loriotDe: '„Mein Name ist Lohse, ich kaufe hier Sand! Zwei Zentner feinsten Rastatter Schwemmsand für den Kachelofen. Man spart doch immerhin einen Betrag.“',
      loriotEn: '"My name is Lohse, I am buying sand! Two hundredweight of pristine river sand for the parlor stove. One saves a tidy sum, after all."',
    },
  },
  {
    id: 'mueckenspritzer',
    mockeryNameDe: 'Die Mückenspritzer',
    mockeryNameEn: 'The Mosquito Dousers',
    mockeryNameEs: 'Los apagamosquitos',
    correctTown: 'Schwäbisch Hall',
    regionDe: 'Franken / Schwaben',
    regionEn: 'Franconia / Swabia',
    regionEs: 'Franconia / Suabia',
    options: ['Schwäbisch Hall', 'Crailsheim', 'Künzelsau', 'Öhringen'],
    legendDe: 'An einem heißen schwülen Sommerabend tanzten Millionen von Zuckmücken in einer gigantischen schwarzen Wolke um die Turmspitze von St. Michael. Im Gegenlicht der untergehenden Sonne sah der Schwarm wie dicker Brandrauch aus. Die Haller Bürger rückten mit Handdruckspritze und Sturmglocken aus, um den Kirchturm zu fluten.',
    legendEn: 'On a humid summer twilight, swarms of non-biting midges formed an immense funnel cloud around the spire of St. Michael church. Silhouetted against the sunset, it looked like black smoke. Citizens rang warning bells and pumped water onto the bugs.',
    legendEs: 'Una tarde calurosa de verano, millones de mosquitos formaron un remolino negro en la torre de la iglesia. A contraluz parecía humo y los vecinos corrieron con la campana de alarma a apagar el campanario.',
    etymologyDe: 'Ein Wanderlegend-Spottname, der auch für andere hohe gotische Kirchtürme im Südwesten belegt ist.',
    etymologyEn: 'A migratory folk legend trope attached to soaring Gothic towers across Southern Germany.',
    etymologyEs: 'Leyenda migratoria aplicada a torres góticas de campanarios en el suroeste alemán.',
    culturalVoices: {
      aerzteDe: '„Gegen Mücken hilft kein Autan, gegen Mücken hilft nur die Feuerwehr! Ein ganzer Kirchturm voller Insekten – das ist der beste Pogo-Pit seit 1982. Lasst die Glocken läuten!“',
      aerzteEn: '"No insect repellent can stop this — only the local volunteer brigade! A cathedral spire full of dancing bugs is the finest mosh pit since 1982!"',
      onkelzDe: '„Tausend Schwingen gegen einen Willen aus Granit! Sie sahen den Rauch der Apokalypse und griffen zu den Eimern. Keine Angst vor dem Schwarm, keine Gnade für den Zweifel!“',
      onkelzEn: '"A thousand wings against an iron will! They smelled the smoke of doom and seized the buckets. No fear of the swarm, no mercy for hesitation!"',
      mausDe: '„Das sind Zuckmücken. Die stechen gar nicht, die wollen nur tanzen. Aber wenn 100.000 Mücken tanzen, sieht das von unten aus wie brennendes Stroh. Und wer kommt? Die Feuerwehr mit Tatütata.“',
      mausEn: '"These are midges. They don’t even bite, they just dance. But when a hundred thousand midges dance, it looks like blazing straw. And who arrives? The fire truck with siren blaring."',
      loriotDe: '„Eine Mücke sticht erst dann, wenn sie von der Notwendigkeit des Vorgangs bürokratisch überzeugt ist. Ich bestehe darauf, dass dieser Turm ordnungsgemäß abgelöscht wird.“',
      loriotEn: '"A mosquito only bites once convinced of the administrative necessity. I insist this steeple be dampened according to civil regulations."',
    },
  },
  {
    id: 'grumbeerstempfler',
    mockeryNameDe: 'Die Grumbeerstempfler',
    mockeryNameEn: 'The Potato Stampers',
    mockeryNameEs: 'Los machacadores de patatas',
    correctTown: 'Simmern (Hunsrück)',
    regionDe: 'Rheinland-Pfalz',
    regionEn: 'Rhineland-Palatinate',
    regionEs: 'Renania-Palatinado',
    options: ['Simmern (Hunsrück)', 'Trier', 'Koblenz', 'Kaiserslautern'],
    legendDe: 'Im kargen Schiefergebirge des Hunsrücks gedieh im 19. Jahrhundert kaum Weizen. Die Bergbauern überlebten, indem sie morgens, mittags und abends gekochte „Grumbeere“ (Kartoffeln / Grundbirnen) mit einem dicken Holzstempel im Tontopf zu Brei stampften. Die Nachbarregionen an der Mosel spotteten über das monotone Stampfgeräusch.',
    legendEn: 'In the barren slate highlands of Hunsrück, grain rarely ripened. Peasant families survived on potatoes ("Grumbeere" = ground-pears), mashed thrice daily using heavy wooden pounders. Wealthy wine valleys laughed at the relentless thudding.',
    legendEs: 'En las frías montañas de pizarra del Hunsrück no crecía trigo. Los campesinos sobrevivían machacando patatas tres veces al día con una maza de madera.',
    etymologyDe: 'Pfälzisch-Hunsrücker Mundart: „Grumbeer“ = Grundbirne. Belegt in folkloristischen Spottversen.',
    etymologyEn: 'Palatinate dialect: "Grumbeer" translates literally as "ground-pear".',
    etymologyEs: 'Dialecto del Palatinado: "Grumbeer" significa pera de tierra (patata).',
    culturalVoices: {
      aerzteDe: '„Kartoffelbrei ist die Urform des Punkrock: Keine Struktur, keine Etikette, schmeckt immer mit Senf. Rauf mit dem Stempel, runter mit dem Beat. Drei Akkorde für ein Stampfgericht!“',
      aerzteEn: '"Mashed potato is the primordial form of punk: zero etiquette, zero polish, always works with mustard. Slam the masher, pump the beat. Three chords for a mashed meal!"',
      onkelzDe: '„Aus dunklem Schiefer geschlagen, genährt mit Brei und Schweiß! Sie nannten uns Stempfler, um uns zu brechen. Doch aus der heißen Knolle wuchs der Stolz unseres Blutes!“',
      onkelzEn: '"Hewn from dark slate, nourished by mash and sweat! They dubbed us stampers to break our spirit. Yet from that boiling root sprang the defiance in our veins!"',
      mausDe: '„Kartoffeln wachsen unter der Erde. Und damit man sie kauen kann, nimmt man einen Holzstempel und macht: Klopf, klopf, matsch. Und warum Grundbirne? Weil sie aussieht wie eine Birne aus dem Dreck. Klingt komisch, ist aber so.“',
      mausEn: '"Potatoes grow underground. And to eat them, you grab a wooden masher and go: Thud, thud, squish. Why ground-pear? Because it looks like a pear pulled from the mud. Sounds funny, but that’s how it is."',
      loriotDe: '„Berta, bitte! Der Kartoffelstampf nimmt eine unkontrollierte Konsistenz an. Ein sauber gestampfter Erdapfel verlangt Konzentration und bürgerliche Contenance.“',
      loriotEn: '"Berta, please! The potato puree is acquiring an unruly consistency. A properly mashed potato demands discipline and civil decorum."',
    },
  },
];

export interface PlayerMockeryGuessResult {
  entry: VillageMockeryEntry;
  chosenTown: string;
  isCorrect: boolean;
  scoreAwarded: number;
}

export function evaluatePlayerMockeryGuess(
  entry: VillageMockeryEntry,
  chosenTown: string
): PlayerMockeryGuessResult {
  const isCorrect = entry.correctTown === chosenTown;
  const scoreAwarded = isCorrect ? 100 : 25; // consolation 25 points for regional solidarity

  return {
    entry,
    chosenTown,
    isCorrect,
    scoreAwarded,
  };
}

export function calculateVillageFeudTitle(totalScore: number): {
  titleDe: string;
  titleEn: string;
  titleEs: string;
  verdictDe: string;
  verdictEn: string;
  verdictEs: string;
} {
  if (totalScore >= 450) {
    return {
      titleDe: 'Großmeister des Schützenfests & Unumstrittener Dorf-Schiedsrichter',
      titleEn: 'Grandmaster of the Marksmen’s Fair & Supreme Village Arbiter',
      titleEs: 'Gran maestre de la fiesta patronal y árbitro supremo del pueblo',
      verdictDe: 'Sagenhaft! Sie kennen die Schandflecken und Spottlegenden jedes Nachbardorfs zwischen Flensburg und Garmisch. Die Schützenbruderschaft ernennt Sie zum Ehren-Kommandanten mit freiem Bier auf Lebenszeit.',
      verdictEn: 'Legendary! You know the blunders and mockery legends of every neighboring hamlet. The village guild awards you honorary commander with lifetime complimentary pilsner.',
      verdictEs: '¡Legendario! Conoces las pifias y motes de cada aldea vecina. La hermandad local te nombra comandante honorario con cerveza libre de por vida.',
    };
  } else if (totalScore >= 300) {
    return {
      titleDe: 'Geselliger Feuerwehr-Hauptmann mit solider Stammtisch-Kompetenz',
      titleEn: 'Seasoned Volunteer Fire Chief with Solid Tavern Banter Skills',
      titleEs: 'Capitán de bomberos voluntarios con solidez en tertulias de taberna',
      verdictDe: 'Respektabel. Mondspritzer und Zwiebeltreter sitzen wie aus dem Effeff, aber beim Schieferboden im Hunsrück hat Sie das Nachbardorf über den Tisch gezogen. Eine Runde Schnaps zur Wiedergutmachung genügt.',
      verdictEn: 'Respectable. You nailed the Moon Splashers and Onion Stampers, but fell for deceptive tavern gossip on the Hunsrück slate. A round of schnapps will clear your slate.',
      verdictEs: 'Respetable. Acertaste con los rociadores de luna y los pisadores de cebolla, pero caíste en la trampa del Hunsrück. Una ronda de aguardiente lo compensa.',
    };
  } else {
    return {
      titleDe: 'Zugezogener Großstadt-Akademiker (Verdächtig, aber geduldet)',
      titleEn: 'Recently Relocated Urbanite (Deeply Suspicious, yet Tolerated)',
      titleEs: 'Urbanita recién mudado (Altamente sospechoso pero tolerado)',
      verdictDe: 'Oh je. Sie halten den Mondspritzer für einen Barmixer und den Zwiebeltreter für eine Tanzfigur. Zur Strafe müssen Sie beim nächsten Dorffest 500 Bratwürste wenden und drei Strophen Heimatlied mitsingen.',
      verdictEn: 'Oh dear. You thought the Moon Splasher was a cocktail bartender and the Onion Stamper a ballroom dance. As penance, you must grill 500 bratwursts at the next village fair.',
      verdictEs: 'Vaya. Creías que el rociador de luna era un cóctel y el pisador de cebollas un baile folclórico. Condenado a dar la vuelta a 500 salchichas en la fiesta del pueblo.',
    };
  }
}
