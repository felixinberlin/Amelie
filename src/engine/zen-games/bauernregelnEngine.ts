/**
 * Bauernregeln vs. DWD (German Folk Weather Rules vs. German Weather Service)
 *
 * Engine for the Ticket 01 prototype of 'wetterregel-liga'.
 * Evaluates iconic German peasant weather lore against 30-year climatological baselines
 * and meteorological singularities with dry, pedantic German bureaucratic humor.
 */

export type RuleVerdict = 'signal' | 'rhyme_emergency' | 'tautology';

export interface WeatherRule {
  id: string;
  ruleDe: string;
  ruleEn: string;
  ruleEs: string;
  sourceRegion: string;
  timing: string; // e.g. '27. Juni', 'Mai (Eisheilige)'
  verdict: RuleVerdict;
  scientificAccuracyPercent: number; // 0..100
  brierSkillScore: number; // -1.0 to 1.0 (relative to 1991-2020 normal)
  dwdStatementDe: string;
  dwdStatementEn: string;
  dwdStatementEs: string;
  bureaucraticTitleDe: string;
  bureaucraticTitleEn: string;
  bureaucraticTitleEs: string;
}

export const WEATHER_RULES_CORPUS: WeatherRule[] = [
  {
    id: 'hahn-auf-dem-mist',
    ruleDe: 'Kräht der Hahn auf dem Mist, ändert sich das Wetter oder ’s bleibt wie ’s ist.',
    ruleEn: 'If the rooster crows on the dunghill, the weather will change or stay as it is.',
    ruleEs: 'Si el gallo canta en el estiércol, el tiempo cambiará o seguirá igual.',
    sourceRegion: 'Bundesweit (Volksmund)',
    timing: 'Ganzjährig, werktags wie feiertags',
    verdict: 'tautology',
    scientificAccuracyPercent: 100,
    brierSkillScore: 0.0,
    dwdStatementDe: 'Amtliche Feststellung: Logisch unanfechtbar, prognostisch wertlos. Der Satz deckt die vollständige Wahrscheinlichkeitsmenge P(A ∪ ¬A) = 1 ab. Null Informationsgewinn nach Shannon, aber 100 % Justiziabilität. Kein Verstoß gegen die meteorologische Fachordnung.',
    dwdStatementEn: 'Official finding: Logically indisputable, prognostically useless. Covers the full probability space P(A ∪ ¬A) = 1. Zero Shannon information gain, 100% legal defensibility.',
    dwdStatementEs: 'Dictamen oficial: Lógicamente irrebatible, predictivamente inútil. Cubre el espacio muestral completo P(A ∪ ¬A) = 1.',
    bureaucraticTitleDe: 'Prüfvermerk: Tautologischer Vollschutz',
    bureaucraticTitleEn: 'Audit Note: Tautological Immunity',
    bureaucraticTitleEs: 'Acta: Inmunidad tautológica',
  },
  {
    id: 'schwalben-tief',
    ruleDe: 'Fliegen die Schwalben in den Niederungen, ist bald mit Regen zu rechnen.',
    ruleEn: 'When swallows fly low, rain will soon follow.',
    ruleEs: 'Si las golondrinas vuelan bajo, pronto lloverá.',
    sourceRegion: 'Mitteleuropa',
    timing: 'Mai bis September',
    verdict: 'signal',
    scientificAccuracyPercent: 82,
    brierSkillScore: 0.44,
    dwdStatementDe: 'Amtliche Feststellung: Physikalischer Volltreffer. Vor Kaltfronten sinkt der Luftdruck und die relative Luftfeuchte steigt (> 80 %). Dipteren (Mücken) nehmen hygroskopisch Wasser auf, werden schwerer und meiden Scherwinde in der Höhe. Die Schwalbe folgt stur dem Futter.',
    dwdStatementEn: 'Official finding: Physical bullseye. Ahead of cold fronts, air pressure drops and humidity rises (>80%). Insects absorb moisture, get heavy, and stay near the ground. Swallows simply follow lunch.',
    dwdStatementEs: 'Dictamen oficial: Acierto físico. Antes de un frente frío, la humedad aumenta (>80%) y los insectos vuelan bajo por el peso del agua.',
    bureaucraticTitleDe: 'Prüfvermerk: Aerodynamisch-biologisch verifiziert',
    bureaucraticTitleEn: 'Audit Note: Aerodynamically Verified',
    bureaucraticTitleEs: 'Acta: Verificado aerodinámicamente',
  },
  {
    id: 'siebenschlaefer',
    ruleDe: 'Das Wetter am Siebenschläfertag (27. Juni) sieben Wochen bleiben mag.',
    ruleEn: 'As the weather is on Seven Sleepers Day (June 27), so it will remain for seven weeks.',
    ruleEs: 'El tiempo del día de los Siete Durmientes (27 de junio) durará siete semanas.',
    sourceRegion: 'Süddeutschland / Alpenvorland',
    timing: 'Ende Juni / Anfang Juli',
    verdict: 'signal',
    scientificAccuracyPercent: 68,
    brierSkillScore: 0.32,
    dwdStatementDe: 'Amtliche Feststellung: Echte meteorologische Singularität. Anfang Juli stabilisiert sich der nordatlantische Jetstream über Europa. Liegt die Frontalzone nördlich (Azorenhoch), bleibt es 7 Wochen trocken-heiß; liegt sie über uns, herrscht mitteleuropäischer Dauersommerregen. 65–75 % Eintrittswahrscheinlichkeit in Bayern.',
    dwdStatementEn: 'Official finding: Genuine meteorological singularity. Early July locks in the North Atlantic jet stream position over Europe for 5–7 weeks with 65–75% statistical persistence in Southern Germany.',
    dwdStatementEs: 'Dictamen oficial: Singularidad real. A principios de julio se estabiliza la corriente en chorro del Atlántico norte durante 5 a 7 semanas.',
    bureaucraticTitleDe: 'Prüfvermerk: Jetstream-Persistenz bestätigt',
    bureaucraticTitleEn: 'Audit Note: Jet Stream Persistence Confirmed',
    bureaucraticTitleEs: 'Acta: Persistencia de corriente en chorro confirmada',
  },
  {
    id: 'eisheilige',
    ruleDe: 'Pankraz, Servaz, Bonifaz sind drei frostige Gesellen; und zum Schluss fehlt nie die kalte Sophie.',
    ruleEn: 'Pancras, Servatius, Boniface are three frosty fellows; and cold Sophia never fails at the end.',
    ruleEs: 'Pancracio, Servacio y Bonifacio son tres compañeros helados; y al final nunca falta la fría Sofía.',
    sourceRegion: 'Mitteleuropa (11.–15. Mai)',
    timing: 'Mitte Mai',
    verdict: 'signal',
    scientificAccuracyPercent: 62,
    brierSkillScore: 0.28,
    dwdStatementDe: 'Amtliche Feststellung: Das Phänomen arktischer Spätfröste existiert real durch rasches Aufheizen des Kontinents bei noch eiskaltem Nordpolarmeer. ABER: Die gregorianische Kalenderreform von 1582 verschob das Datum um 10 Tage. Das amtliche Frostmaximum liegt meteorologisch erst um den 20.–23. Mai.',
    dwdStatementEn: 'Official finding: Real arctic polar surge phenomenon due to rapidly heating continent vs frozen polar sea. HOWEVER: The Gregorian calendar reform of 1582 shifted dates by 10 days; real frost risk peaks May 20–23.',
    dwdStatementEs: 'Dictamen oficial: Ola polar real, pero la reforma del calendario gregoriano de 1582 desplazó la fecha 10 días: el verdadero pico de heladas es del 20 al 23 de mayo.',
    bureaucraticTitleDe: 'Prüfvermerk: Kalenderverschiebung um 10 Tage festgemerkt',
    bureaucraticTitleEn: 'Audit Note: 10-Day Calendar Shift Noted',
    bureaucraticTitleEs: 'Acta: Desfase de 10 días por calendario gregoriano',
  },
  {
    id: 'oktober-warm',
    ruleDe: 'Ist der Oktober warm und fein, kommt ein scharfer Winter drein.',
    ruleEn: 'If October is warm and fine, a severe winter will follow in line.',
    ruleEs: 'Si octubre es cálido y templado, vendrá un invierno helado.',
    sourceRegion: 'Norddeutschland',
    timing: 'Oktober',
    verdict: 'rhyme_emergency',
    scientificAccuracyPercent: 12,
    brierSkillScore: -0.22,
    dwdStatementDe: 'Amtliche Feststellung: Schlichter Reimnotstand auf „fein“ und „drein“. Korrelationsanalyse des DWD über 140 Jahre Messreihe Potsdam ergibt r = -0,03 (statistisches Rauschen). Ein warmer Oktober begünstigt eher einen milden Westwindwinter durch gespeicherte Meereswärme.',
    dwdStatementEn: 'Official finding: Pure desperate rhyming. 140-year correlation at Potsdam station yields r = -0.03 (statistically insignificant noise). A warm autumn actually favors a mild winter due to heat capacity.',
    dwdStatementEs: 'Dictamen oficial: Mera rima forzada. La correlación en 140 años es r = -0,03 (ruido estadístico puro).',
    bureaucraticTitleDe: 'Prüfvermerk: Korrelation r = -0,03 (Reimzwang)',
    bureaucraticTitleEn: 'Audit Note: Correlation r = -0.03 (Pure Rhyme)',
    bureaucraticTitleEs: 'Acta: Correlación r = -0,03 (Rima forzada)',
  },
  {
    id: 'ameisenhaufen',
    ruleDe: 'Bauen die Waldameisen ihre Haufen steil, wird der Winter kalt und geil (hart).',
    ruleEn: 'If wood ants build their mounds steep and tall, a bitter winter will befall.',
    ruleEs: 'Si las hormigas apilan alto su hormiguero, el invierno será duro y severo.',
    sourceRegion: 'Süd- und Mitteldeutschland',
    timing: 'September / Oktober',
    verdict: 'rhyme_emergency',
    scientificAccuracyPercent: 8,
    brierSkillScore: -0.35,
    dwdStatementDe: 'Amtliche Feststellung: Ameisen besitzen keine meteorologische Langfrist-Sensorik. Steile Hügelkegel entstehen ausschließlich als Reaktion auf vorangegangene Starkregen im Spätsommer (Abflussoptimierung) oder Sonnenstand des aktuellen Monats. Null Prognosewert für Januar.',
    dwdStatementEn: 'Official finding: Ants lack long-range barometric sensors. Steep cones merely reflect late-summer heavy rain drainage reactions or low sun angles, carrying zero January forecast signal.',
    dwdStatementEs: 'Dictamen oficial: Las hormigas carecen de sensores meteorológicos a largo plazo. La altura del montículo solo responde a lluvias recientes.',
    bureaucraticTitleDe: 'Prüfvermerk: Entomologischer Fehlalarm',
    bureaucraticTitleEn: 'Audit Note: Entomological False Alarm',
    bureaucraticTitleEs: 'Acta: Falsa alarma entomológica',
  },
  {
    id: 'abendrot',
    ruleDe: 'Abendrot – Gutwetterbrot, Morgenrot – mit Regen droht.',
    ruleEn: 'Red sky at night, sailors’ delight; red sky in morning, sailors’ warning.',
    ruleEs: 'Cielo rojo al atardecer, buen tiempo; cielo rojo al amanecer, lluvia al caer.',
    sourceRegion: 'Mitteleuropa (Westwindzone)',
    timing: 'Ganzjährig',
    verdict: 'signal',
    scientificAccuracyPercent: 78,
    brierSkillScore: 0.39,
    dwdStatementDe: 'Amtliche Feststellung: Optisch und synoptisch fundiert. In unseren Breiten zieht das Wetter von West nach Ost. Abendrot entsteht, wenn die untergehende Sonne im Westen durch trockene, staubige Hochdruckluft strahlt (klare Luft im Anmarsch). Morgenrot im Osten beleuchtet von unten aufziehende Frontenbewölkung aus Westen.',
    dwdStatementEn: 'Official finding: Synoptically sound. Mid-latitude weather moves west-to-east. Evening red means sun shining through dry high-pressure air in the west. Morning red illuminates clouds arriving from the west.',
    dwdStatementEs: 'Dictamen oficial: Fundamentado física y ópticamente. En latitudes medias los frentes viajan de oeste a este.',
    bureaucraticTitleDe: 'Prüfvermerk: Rayleigh-Streuung & Westwinddrift verifiziert',
    bureaucraticTitleEn: 'Audit Note: Rayleigh Scattering & Westerlies Verified',
    bureaucraticTitleEs: 'Acta: Dispersión de Rayleigh y vientos del oeste confirmados',
  },
  {
    id: 'lichtmess',
    ruleDe: 'Ist’s an Lichtmess hell und rein, wird ein langer Winter sein; ist’s an Lichtmess trüb und nass, freut sich Bauer und das Fass.',
    ruleEn: 'If Candlemas is clear and bright, winter takes another flight; if Candlemas brings clouds and rain, winter will not come again.',
    ruleEs: 'Si por la Candelaria hace sol y viento, el invierno está dentro; si llueve o está nublado, el invierno ha pasado.',
    sourceRegion: 'Mitteleuropa (2. Februar)',
    timing: '2. Februar',
    verdict: 'signal',
    scientificAccuracyPercent: 64,
    brierSkillScore: 0.25,
    dwdStatementDe: 'Amtliche Feststellung: Echter physikalischer Boden. Klares Wetter am 2. Februar deutet auf ein blockierendes kontinentales Kältehoch (sibirischer Ursprung) hin, das im Spätwinter wochenlang stabil bleibt. Trübes, mildes Wetter zeigt atlantische Tiefdruckdynamik an, die den Frost bricht.',
    dwdStatementEn: 'Official finding: True synoptic foundation. Clear skies on Feb 2 indicate a blocking continental Siberian high pressure system, which tends to persist for weeks in late winter.',
    dwdStatementEs: 'Dictamen oficial: Fundamento sinóptico real. Cielo despejado el 2 de febrero indica un anticiclón siberiano bloqueante que prolonga el frío.',
    bureaucraticTitleDe: 'Prüfvermerk: Kontinentales Blockadehoch bestätigt',
    bureaucraticTitleEn: 'Audit Note: Continental Blocking High Confirmed',
    bureaucraticTitleEs: 'Acta: Anticiclón continental bloqueante confirmado',
  },
];

export interface PlayerVerdictResult {
  rule: WeatherRule;
  playerChosenVerdict: RuleVerdict;
  isCorrect: boolean;
  scoreAwarded: number;
}

export function evaluatePlayerWeatherVerdict(
  rule: WeatherRule,
  playerVerdict: RuleVerdict
): PlayerVerdictResult {
  const isCorrect = rule.verdict === playerVerdict;
  const scoreAwarded = isCorrect ? 100 : 25; // consolation 25 for bravery against German bureaucracy

  return {
    rule,
    playerChosenVerdict: playerVerdict,
    isCorrect,
    scoreAwarded,
  };
}

export function calculateBureaucraticGrade(totalScore: number): {
  gradeTitleDe: string;
  gradeTitleEn: string;
  gradeTitleEs: string;
  verdictReportDe: string;
  verdictReportEn: string;
  verdictReportEs: string;
} {
  if (totalScore >= 450) {
    return {
      gradeTitleDe: 'Staatlich geprüfter Singularitäten-Sachverständiger (Besoldungsgruppe A14)',
      gradeTitleEn: 'Certified State Singularity Expert (Senior Civil Servant A14)',
      gradeTitleEs: 'Perito estatal en singularidades meteorológicas (Funcionario A14)',
      verdictReportDe: 'Ausgezeichnet. Sie trennen meteorologische Physik und bäuerliche Reim-Notstände mit der Präzision einer geeichten DWD-Wetterhütte. Unmittelbare Berufung in die Zentrale Offenbach empfohlen.',
      verdictReportEn: 'Outstanding. You separate atmospheric physics from desperate folk rhymes with the precision of a calibrated Stevenson screen. Immediate appointment to DWD headquarters recommended.',
      verdictReportEs: 'Excelente. Separas la física atmosférica de la poesía rural con la precisión de una garita meteorológica homologada.',
    };
  } else if (totalScore >= 300) {
    return {
      gradeTitleDe: 'Amtlicher Wetterfrosch mit leichter Hanglage zum Aberglauben (Besoldung A11)',
      gradeTitleEn: 'Official Weather Frog with Occasional Superstition Drift (A11)',
      gradeTitleEs: 'Observador meteorológico oficial con tendencia al folclore (A11)',
      verdictReportDe: 'Befriedigend. Die großen Jetstream-Phänomene sitzen, aber bei krähenden Hähnen und Waldameisen ließen Sie sich von gepflegtem Endreim täuschen. Dienstliche Nachbelehrung über Scheinkorrelationen empfohlen.',
      verdictReportEn: 'Satisfactory. You grasp jet stream persistence, but roosters and wood ants tripped up your statistical vigilance. Further training in spurious correlation suggested.',
      verdictReportEs: 'Satisfactorio. Comprendes las corrientes en chorro, pero caíste en las trampas rimadas de gallos y hormigas.',
    };
  } else {
    return {
      gradeTitleDe: 'Reim-Opfer ersten Grades (Dienstbeflissen, aber verregnet)',
      gradeTitleEn: 'First-Degree Rhyme Casualty (Eager but thoroughly rained upon)',
      gradeTitleEs: 'Víctima de la rima rural de primer grado (Completamente mojado)',
      verdictReportDe: 'Mangelhaft. Sie glauben dem Hahn auf dem Mist mehr als einem Doppler-Radar. Zur Strafe 3 Monate Dienst an der Bergwetterstation Brocken ohne Gummistiefel.',
      verdictReportEn: 'Inadequate. You trust the dunghill rooster more than a Doppler radar. Sentenced to 3 months stationed at Mount Brocken weather hut without gumboots.',
      verdictReportEs: 'Deficiente. Confías más en el gallo del corral que en un radar Doppler. Condenado a 3 meses de guardia en la cumbre del Brocken sin botas de agua.',
    };
  }
}
