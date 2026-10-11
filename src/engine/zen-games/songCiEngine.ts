/**
 * Song Ci Forensic Deduction Engine (1247 AD)
 *
 * Engine for the Ticket 01 prototype of 'song-ci-forensics-1247'.
 * Reconstructs authentic medieval forensic investigations from Song Ci's "Collected Cases of Washing Away of Wrongs"
 * (洗冤集录, 1247 AD) — the world's earliest systematic forensic science treatise.
 *
 * Players investigate physical clues (insect succession, light filtration, vital reaction soot,
 * chemical silver sulfide precipitation) without supernatural detective vision.
 */

export interface ForensicClue {
  id: string;
  nameDe: string;
  nameEn: string;
  nameZh: string;
  nameEs: string;
  findingDe: string;
  findingEn: string;
  findingZh: string;
  findingEs: string;
  icon: string;
}

export interface ForensicSuspectChoice {
  id: string;
  labelDe: string;
  labelEn: string;
  labelZh: string;
  labelEs: string;
  isCorrect: boolean;
  explanationDe: string;
  explanationEn: string;
  explanationZh: string;
  explanationEs: string;
}

export interface ForensicCase {
  id: string;
  titleDe: string;
  titleEn: string;
  titleZh: string;
  titleEs: string;
  eraZh: string; // e.g. '南宋 · 淳祐七年 (1247)'
  eraDe: string;
  eraEn: string;
  locationDe: string;
  locationEn: string;
  locationZh: string;
  scenarioDe: string;
  scenarioEn: string;
  scenarioZh: string;
  scenarioEs: string;
  clues: ForensicClue[];
  choices: ForensicSuspectChoice[];
  originalQuoteZh: string; // Original quotation from 洗冤集录
  originalQuoteTranslationDe: string;
  originalQuoteTranslationEn: string;
  modernScienceValidationDe: string;
  modernScienceValidationEn: string;
}

export const SONG_CI_CASES_CORPUS: ForensicCase[] = [
  {
    id: 'case-sickle-flies',
    titleDe: 'Fall 1: Die Sicheln und die Fliegen',
    titleEn: 'Case 1: The Sickles and the Blowflies',
    titleZh: '卷一 · 疑刃辩痕（镰刀聚蝇）',
    titleEs: 'Caso 1: Las hoces y los moscardones',
    eraZh: '南宋 · 淳祐年间 (约1235年)',
    eraDe: 'Südliche Song-Dynastie (ca. 1235 n. Chr.)',
    eraEn: 'Southern Song Dynasty (c. 1235 AD)',
    locationDe: 'Weizendorf bei Jianning, Provinz Fujian',
    locationEn: 'Wheat farming hamlet near Jianning, Fujian',
    locationZh: '福建建宁府村落',
    scenarioDe: 'Ein Wanderarbeiter wurde am Wegrand mit einer bogenförmigen Schnittwunde ermordet. Das Dorf zählt 70 Bauern, die alle Getreidesicheln besitzen. Der Täter wusch seine Sichel gründlich mit Flusswasser; für das menschliche Auge glänzen alle Klingen makellos silbern. Wie entlarvt Kreisrichter Song Ci die Tatwaffe?',
    scenarioEn: 'A traveler was slain on a rural path by a curved slash wound. The nearby village has 70 farmers, each owning a wheat sickle. The killer washed his tool thoroughly in running river water; to the human eye, all 70 blades gleam pristinely. How does Magistrate Song Ci reveal the weapon?',
    scenarioZh: '一路人被弧形利刃砍伤身亡。邻近村落有七十户人家，皆蓄镰刀。凶手已用河水将镰刀洗涤洁净，肉眼观之，刀刃皆如新拭。提刑官宋慈如何辨识凶器？',
    scenarioEs: 'Un viajero fue degollado con una herida curva. Setenta campesinos poseen hoces y el asesino lavó la suya con agua de río. A simple vista todas relucen limpias. ¿Cómo identifica el juez Song Ci el arma?',
    clues: [
      {
        id: 'clue-1',
        nameDe: 'Optische Prüfung',
        nameEn: 'Visual Inspection',
        nameZh: '肉眼检视',
        nameEs: 'Inspección visual',
        findingDe: 'Alle 70 Klingen sind poliert, geschärft und zeigen keinerlei sichtbare Blut- oder Schmutzreste.',
        findingEn: 'All 70 blades appear polished, sharpened, with zero macroscopically visible blood or soil residue.',
        findingZh: '七十把镰刀皆磨砺光亮，无微显血色，刀口整齐。',
        findingEs: 'Todas las hojas están pulidas y limpias, sin rastro macroscópico de sangre.',
        icon: '👁️',
      },
      {
        id: 'clue-2',
        nameDe: 'Sonnenhitze & Geruchsausgasung',
        nameEn: 'Midday Solar Heat Volatilization',
        nameZh: '盛暑烈日曝晒',
        nameEs: 'Exposición al calor solar',
        findingDe: 'Song Ci lässt alle 70 Bauern ihre Sicheln zur Mittagsstunde flach auf dem Dorfplatz in die sengende Sonne legen.',
        findingEn: 'Song Ci orders all villagers to lay their sickles flat on the ground under direct midday summer heat.',
        findingZh: '令众农人各将镰刀平铺于县衙官道空地，时当暑月，日光暴烈。',
        findingEs: 'Song Ci ordena colocar las 70 hoces en el suelo bajo el calor asfixiante del mediodía.',
        icon: '☀️',
      },
      {
        id: 'clue-3',
        nameDe: 'Insektensukzession (Kalliphoriden)',
        nameEn: 'Insect Attraction (Calliphoridae)',
        nameZh: '苍蝇聚集（昆虫趋化性）',
        nameEs: 'Atracción de dípteros',
        findingDe: 'Innerhalb weniger Minuten umschwirren hunderte Schmeißfliegen ausschließlich Sichel #42, während alle anderen 69 Klingen völlig unberührt bleiben.',
        findingEn: 'Within minutes, dozens of green blowflies swarm exclusively over sickle #42, completely ignoring the other 69.',
        findingZh: '未及食顷，成群苍蝇但聚附于一柄镰刀之上，拂之不去，余刀皆无蝇息。',
        findingEs: 'En pocos minutos, enjambres de moscardones verdes cubren exclusivamente la hoz #42, ignorando las otras 69.',
        icon: '🪰',
      },
    ],
    choices: [
      {
        id: 'opt-fly-olfaction',
        labelDe: 'Sichel #42 trägt mikroskopische Proteindünste im Stahlgefüge, die Fliegen riechen',
        labelEn: 'Sickle #42 retains invisible trace protein volatility in microscopic steel pores detected by blowflies',
        labelZh: '镰刀虽经水洗，钢铁微孔中微细血腥犹存，蝇类触角化感器极端敏锐，聚而不散',
        labelEs: 'La hoz #42 retiene micro-residuos proteicos de sangre en el poro del acero que las moscas huelen',
        isCorrect: true,
        explanationDe: 'Richtig! Song Ci begründete damit 1247 die weltweite forensische Entomologie: Selbst nach gründlichem Waschen verbleiben Hämo-Proteine in den Schnittriefen des geschmiedeten Eisens. Der Bauer gestand daraufhin weinend die Tat.',
        explanationEn: 'Correct! Song Ci established forensic entomology in 1247: microscopic heme proteins remain bound in forged iron micro-crevices. The owner broke down and confessed.',
        explanationZh: '正解！宋慈此案开创世界法医昆虫学先河：水洗难除铁缝微血，蝇逐血腥。凶手伏地认罪。',
        explanationEs: '¡Correcto! Song Ci fundó así la entomología forense en 1247. El campesino se quebró y confesó.',
      },
      {
        id: 'opt-rust-reaction',
        labelDe: 'Die Sichel roch nach frischem Schleifsteinöl, was Fliegen anlockt',
        labelEn: 'The sickle smelled of fresh whetstone mineral oil which attracts insects',
        labelZh: '磨刀石矿物油发酵吸引蝇类',
        labelEs: 'El aceite mineral de la piedra de afilar atrajo a los insectos',
        isCorrect: false,
        explanationDe: 'Falsch. Mineralisches Schleiföl stößt Dipteren eher ab. Schmeißfliegen reagieren hochempfindlich auf faulende Schwefel- und Stickstoffverbindungen in tierischem/menschlichem Hämoglobin.',
        explanationEn: 'Incorrect. Mineral oil repels blowflies. Their olfactory receptors trigger on sulfur and nitrogen breakdown products from hemoglobin.',
        explanationZh: '误判。磨石机油气味刺鼻，蝇虫避之不及，断不会群聚其上。',
        explanationEs: 'Incorrecto. El aceite mineral repele a las moscas; solo el olor a hemoglobina las atrae.',
      },
      {
        id: 'opt-coincidence',
        labelDe: 'Reiner Zufall: Die Sichel lag am Rand im Schatten des Torbogens',
        labelEn: 'Mere coincidence: that sickle happened to be placed near the shaded archway',
        labelZh: '纯属巧合，因该刀恰置于树荫阴凉之处',
        labelEs: 'Mera coincidencia: la hoz estaba en la sombra del pórtico',
        isCorrect: false,
        explanationDe: 'Falsch. Song Ci ließ die Sicheln gezielt in der prallen Sonne anordnen, um den Geruch verdunsten zu lassen. Alle Werkzeuge hatten exakt identische Temperatur- und Umgebungsbedingungen.',
        explanationEn: 'Incorrect. Song Ci explicitly placed them in full glare to vaporize scent molecules equally.',
        explanationZh: '误判。宋慈特命于烈日平地排布，光照均等，杜绝阴翳偏差。',
        explanationEs: 'Incorrecto. Todas las hoces estaban alineadas bajo la misma insolación directa.',
      },
    ],
    originalQuoteZh: '「宋慈《洗冤集录》：行者有伤，众镰并置。至午，蝇集一镰，盖微血气留于铁肤，水洗不能尽也。吏讯之，其人涕泣伏辜。」',
    originalQuoteTranslationDe: '„Song Ci, 洗冤集录: Liegen alle Sicheln zur Mittagsglut beisammen, fliegen die Fliegen zu jener einen, da der Hauch des Blutes in der Haut des Eisens bleibt, den kein Wasser fortspült. Der Beamte verhörte ihn, und der Mann weinte und bekannte seine Schuld.“',
    originalQuoteTranslationEn: '"Song Ci, Washing Away of Wrongs: When all sickles were laid together in the noon sun, flies gathered upon one alone, for the trace of blood remains in the skin of iron which water cannot wash clean."',
    modernScienceValidationDe: 'Moderne Bestätigung: Calliphoridae (Schmeißfliegen) besitzen Chemosensoren auf ihren Antennen, die verflüchtigte Amine und Eisenspuren von Hämoglobin noch in Verdünnungen von 1 : 1.000.000 riechen.',
    modernScienceValidationEn: 'Modern validation: Calliphoridae (blowflies) possess olfactory sensilla that detect volatile blood breakdown products at concentrations down to 1 part per million.',
  },
  {
    id: 'case-red-umbrella-bones',
    titleDe: 'Fall 2: Knochenspuren unter dem roten Ölpapierschirm',
    titleEn: 'Case 2: Bone Bruising Under the Red Oil-Paper Umbrella',
    titleZh: '卷二 · 验骨伤损（红伞滤光）',
    titleEs: 'Caso 2: Lesiones óseas bajo el paraguas rojo de papel aceitado',
    eraZh: '南宋 · 淳祐七年 (1247)',
    eraDe: 'Südliche Song-Dynastie (1247 n. Chr.)',
    eraEn: 'Southern Song Dynasty (1247 AD)',
    locationDe: 'Präfektur Changsha, Provinz Hunan',
    locationEn: 'Changsha Prefecture, Hunan Province',
    locationZh: '湖南长沙府',
    scenarioDe: 'Ein Exhumiertes Skelett soll auf tödliche Gewalteinwirkung untersucht werden. Das Weichgewebe ist verwest; die Knochen wirken im Tageslicht kreidig weiß und unbeschädigt. Der Angeklagte behauptet, das Opfer sei an Fieber gestorben. Wie weist Song Ci nach, dass die Knochen vor dem Tod massive Schläge erlitten?',
    scenarioEn: 'An exhumed skeleton must be inspected for fatal blunt trauma. Soft tissue has decayed; under diffuse sunlight the dry bones look chalky white and unharmed. The suspect claims the deceased died of fever. How does Song Ci prove deep antemortem trauma?',
    scenarioZh: '开棺验骨，皮肉已消，骸骨白枯，白昼常光之下骨节平整，无可见骨折。嫌犯坚称死者病热而亡。宋慈如何查验生前曾遭木棒重击之重伤？',
    scenarioEs: 'Un esqueleto exhumado no muestra fracturas evidentes en luz difusa. El sospechoso afirma que murió de fiebres. ¿Cómo demuestra Song Ci las contusiones vitales en el hueso?',
    clues: [
      {
        id: 'clue-1',
        nameDe: 'Knochenoberfläche trocken',
        nameEn: 'Dry Bone Surface',
        nameZh: '骨殖素验',
        nameEs: 'Huesos secos',
        findingDe: 'Bei direktem weißem Sonnenlicht streut das poröse Calciumphosphat das Licht diffus; die Oberfläche erscheint uniform weiß.',
        findingEn: 'Under direct white daylight, porous calcium phosphate scatters light diffusely, masking subtle hemoglobin stains.',
        findingZh: '烈日白光下，骨质多孔反射均匀，陈年渗血之暗斑难以辨别。',
        findingEs: 'Bajo luz solar directa el calcio refleja luz de forma difusa, ocultando manchas de hemoglobina.',
        icon: '🦴',
      },
      {
        id: 'clue-2',
        nameDe: 'Rotwein & Essigdampf',
        nameEn: 'Wine Dregs & Vinegar Steam Bath',
        nameZh: '热醋酒糟熏蒸',
        nameEs: 'Vaho de vinagre y vino',
        findingDe: 'Song Ci lässt die Knochen auf einer Grube mit kochendem Essig und Reisweintrub dämpfen, um Fette und Poren zu öffnen.',
        findingEn: 'Song Ci lays the bones over a pit of boiling hot vinegar and wine sediment to clear surface lipids.',
        findingZh: '掘坑焚柴，泼香油老醋，趁热覆垫白席，将骸骨置于其上微蒸。',
        findingEs: 'Song Ci coloca los huesos sobre vapores de vinagre caliente para abrir los poros óseos.',
        icon: '🍶',
      },
      {
        id: 'clue-3',
        nameDe: 'Durchscheinender roter Ölpapierschirm',
        nameEn: 'Translucent Red Oiled-Paper Umbrella Filter',
        nameZh: '张红油伞迎日反照',
        nameEs: 'Paraguas rojo aceitado como filtro',
        findingDe: 'Song Ci spannt einen geölten roten Seidenschirm zwischen Knochen und Mittagssonne. Im gefilterten monochromen Rotlicht leuchten plötzlich tiefblaue und dunkelrote Kontusionsmuster an Schädel und Rippen auf.',
        findingEn: 'Song Ci opens an oiled translucent red paper umbrella between bone and direct sun. The monochromatic red filter suddenly causes sub-periosteal hematoma bands on the skull and ribs to stand out in high contrast.',
        findingZh: '撑开透光红油纸伞，迎日照临骨殖。借红光窄谱透照，颅骨及肋骨处赫然显出数道暗红紫赤之生前受重击淤斑！',
        findingEs: 'Song Ci abre un paraguas rojo de papel aceitado. La luz filtrada resalta bandas oscuras de hematomas vitales en el cráneo.',
        icon: '☂️',
      },
    ],
    choices: [
      {
        id: 'opt-optical-filter',
        labelDe: 'Das rote Papier fungiert als optischer Bandpassfilter, der Hämoglobin-Absorptionsbanden kontraststark hervorhebt',
        labelEn: 'The red oiled paper acts as an optical bandpass filter enhancing hemoglobin absorption contrast against white bone',
        labelZh: '红油纸伞滤除蓝绿短波杂光，借长波红光穿透表层骨质，凸显深层高铁血红蛋白吸收谱暗斑',
        labelEs: 'El papel rojo actúa como filtro óptico de banda que maximiza el contraste de la hemoglobina absorbida',
        isCorrect: true,
        explanationDe: 'Richtig! Song Ci erfand 1247 den optischen Kontrastfilter der Kriminaltechnik: Rotes gefiltertes Sonnenlicht dringt in die Knochenrinde ein, während das im Hämatom gebundene Eisenoxid die Photonen absorbiert und als deutliche violette Linien sichtbar wird.',
        explanationEn: 'Correct! Song Ci pioneered optical filter examination in 1247: filtered red sunlight penetrates shallow bone cortical layers while iron oxide in bound hematomas strongly absorbs light, appearing dark purple.',
        explanationZh: '正解！宋慈此举乃现代窄带光谱滤镜法医检验之鼻祖：红光透射骨板，血红素吸光显影，骨伤无所遁形。',
        explanationEs: '¡Correcto! Pionero del filtro óptico forense en 1247: la luz roja penetra la cortical ósea y la hemoglobina destaca en púrpura.',
      },
      {
        id: 'opt-dye-staining',
        labelDe: 'Das rote Öl des Schirms tropfte auf die Knochen und färbte Bruchstellen ein',
        labelEn: 'Red oil from the umbrella dripped onto the skeleton and dyed cracks',
        labelZh: '红伞桐油受热滴落，渗入骨缝染色',
        labelEs: 'El aceite rojo goteó del paraguas tiñendo las fisuras',
        isCorrect: false,
        explanationDe: 'Falsch. Der Schirm wurde hoch über den Knochen gehalten; es fand keinerlei physikalischer Kontakt oder Farbstoffübertrag statt.',
        explanationEn: 'Incorrect. The umbrella was held overhead; no physical fluid contact occurred.',
        explanationZh: '误判。油伞高举凌空，绝无油滴坠地之理。',
        explanationEs: 'Incorrecto. El paraguas se sostenía en alto sin contacto físico.',
      },
      {
        id: 'opt-heat-crack',
        labelDe: 'Der Essigdampf zersprengte die Knochen durch thermischen Schock',
        labelEn: 'The vinegar steam shattered fragile bones via thermal shock',
        labelZh: '热醋急蒸导致骨质冷热交替开裂',
        labelEs: 'El vapor de vinagre provocó fisuras por choque térmico',
        isCorrect: false,
        explanationDe: 'Falsch. Song Ci unterscheidet penibel zwischen echten stumpfen Vitaltraumata (mit subperiostaler Hämatom-Infiltration) und künstlichen Hitzerissen.',
        explanationEn: 'Incorrect. Song Ci rigorously distinguished between vital antemortem contusions and postmortem thermal damage.',
        explanationZh: '误判。宋慈明确区分生前重击血淤与死后干裂，此痕显见深层渗血。',
        explanationEs: 'Incorrecto. Song Ci distinguía hematomas vitales de fisuras post-mortem térmicas.',
      },
    ],
    originalQuoteZh: '「宋慈《洗冤集录》：若验骨有损，于地掘坑烧红，沃以米醋，铺席将骨覆上。迎日撑开红油伞，于红影中定睛细验。若是生前受棒处，其骨必见赤色微红痕也。」',
    originalQuoteTranslationDe: '„Song Ci, 洗冤集录: Soll geprüft werden, ob ein Knochen verwundet ward, grabe eine Grube in die Erde, brenne sie heiß, gieße Reisessig hinein und bette das Gebein darauf. Spanne gegen die Sonne einen roten Ölpapierschirm und blicke scharf in den roten Schatten. War der Hieb vor dem Tode gefallen, so zeigt der Knochen ein zartes, rotes Mal.“',
    originalQuoteTranslationEn: '"Song Ci, Washing Away of Wrongs: To examine injured bones, dig a pit, heat it red-hot, pour in rice vinegar, and lay the bones over it. Open a red oiled umbrella against the sun and inspect attentively in the red shadow. Where a blow struck in life, the bone will exhibit a subtle red bruise."',
    modernScienceValidationDe: 'Moderne Bestätigung: Forensische Photolumineszenz und Kreuzpolarisationsfilter (Narrow Band Imaging) nutzen genau dieses Prinzip, um tiefere Hämatom-Spektren von der reflektierenden Knochenmatrix abzuheben.',
    modernScienceValidationEn: 'Modern validation: Alternate Light Source (ALS) and narrow-band imaging utilize this identical wavelength filtration to isolate hemoglobin absorption from calcium scattering.',
  },
  {
    id: 'case-vital-fire-smoke',
    titleDe: 'Fall 3: Der Brandfall und die Ascheprobe',
    titleEn: 'Case 3: Arson Death and the Tracheal Soot Test',
    titleZh: '卷三 · 焚死辩生（口鼻辨灰）',
    titleEs: 'Caso 3: Víctima de incendio y prueba del hollín traqueal',
    eraZh: '南宋 (1247)',
    eraDe: 'Südliche Song-Dynastie (1247 n. Chr.)',
    eraEn: 'Southern Song Dynasty (1247 AD)',
    locationDe: 'Dorf Zhangjiacun, Präfektur Huizhou',
    locationEn: 'Zhangjiacun Village, Huizhou Prefecture',
    locationZh: '徽州张家村',
    scenarioDe: 'Ein Kaufmannshaus brannte bis auf die Grundmauern nieder. In den Trümmern liegt die verkohlte Leiche des Hausherrn. Seine Witwe behauptet, ihr Mann sei im Schlaf überrascht worden und verbrannt. Nachbarn flüstern von einem Streit mit ihrem Liebhaber. Wie stellt Song Ci fest, ob der Mann lebend verbrannte oder vor dem Brand ermordet wurde?',
    scenarioEn: 'A merchant’s home burned to ashes. In the embers lies the merchant’s charred corpse. The widow claims her husband perished trapped in smoke while asleep. Villagers suspect foul play. How does Song Ci determine whether the victim was alive during the fire or killed beforehand?',
    scenarioZh: '富商住宅夜半失火化为灰烬，废墟中见富商焦黑尸骸。其妻坚称夫君夜寐不虞罹难火海。邻里则疑其妇与奸夫先谋杀而后纵火毁迹。宋慈如何确断死者乃生前入火烧死，亦或死后移尸焚尸？',
    scenarioEs: 'Un comerciante ardió en su casa. La viuda afirma que murió por el humo dormido; los vecinos sospechan que fue asesinado antes. ¿Cómo prueba Song Ci si murió quemado vivo o asesinado antes del fuego?',
    clues: [
      {
        id: 'clue-1',
        nameDe: 'Äußere Verkohlung',
        nameEn: 'External Charring Severity',
        nameZh: '尸表焦灼',
        nameEs: 'Carbonización externa',
        findingDe: 'Der Körper ist am Torso und Kopf vierten Grades verbrannt; Haut und Kleidung sind vollkommen zerstört.',
        findingEn: 'The body exhibits severe fourth-degree charring; epidermal tissues and clothes are destroyed.',
        findingZh: '头面躯干皮肉焦黑脆裂，衣冠化尽，体表难辨外伤。',
        findingEs: 'Cuerpo con quemaduras de cuarto grado en torso y cabeza; sin lesiones superficiales legibles.',
        icon: '🔥',
      },
      {
        id: 'clue-2',
        nameDe: 'Obduktion der Atemwege',
        nameEn: 'Dissection of Trachea and Lungs',
        nameZh: '剖视口鼻气道',
        nameEs: 'Disección de tráquea y boca',
        findingDe: 'Song Ci öffnet Rachen, Kehlkopf und Luftröhre: In der Mundhöhle und den tiefen Bronchien findet sich nicht ein einziges Ruß- oder Aschepartikel; die Schleimhäute sind weiß und aschefrei.',
        findingEn: 'Song Ci dissects the pharynx and windpipe: the oral cavity and deep bronchi are completely clean, devoid of black soot or ash particles.',
        findingZh: '宋慈割剖死者口、喉管及气道，见咽喉喉头深处并无黑灰，舌根洁净无尘。',
        findingEs: 'Song Ci diseca la tráquea: la boca y los bronquios están totalmente limpios, sin motas de hollín.',
        icon: '🫁',
      },
      {
        id: 'clue-3',
        nameDe: 'Experimenteller Kontrolltest mit Schweinen',
        nameEn: 'Experimental Animal Control Verification',
        nameZh: '生猪火焚对照实证',
        nameEs: 'Experimento de control con cerdos',
        findingDe: 'Um Richtern den Beweis zu liefern, ließ Song Ci einst zwei Schweine verbrennen: eines lebend (Atemwege voller Ruß und Schleim), eines zuvor getötet (Luftröhre makellos sauber).',
        findingEn: 'Song Ci famously tested this on two pigs: one burned alive (trachea packed with inhaled soot), one killed prior to ignition (windpipe immaculate).',
        findingZh: '宋慈取两猪试之：一生投火中，一先杀后烧。剖视之，生者口鼻气道满含煤灰，死者口内全无。',
        findingEs: 'Song Ci comprobó en su tratado que un cerdo quemado vivo inhala hollín, mientras que el muerto antes conserva la tráquea limpia.',
        icon: '🐖',
      },
    ],
    choices: [
      {
        id: 'opt-vital-reaction',
        labelDe: 'Fehlender Ruß in der Luftröhre beweist: Er atmete im Feuer nicht mehr und war vor dem Brand bereits tot',
        labelEn: 'Absence of inhaled soot in the trachea proves zero respiration during the fire: he was already dead before the blaze',
        labelZh: '气道无黑灰入肺，证死者未曾于浓烟中吸气，必系死后见焚，纵火实为灭迹！',
        labelEs: 'La ausencia de hollín en la tráquea demuestra que no respiró en el fuego: ya estaba muerto antes',
        isCorrect: true,
        explanationDe: 'Richtig! Song Ci begründete den forensischen Begriff der Vitalreaktion: Wer lebend brennt, inhaliert reflexartig Qualm und Asche tief in die Lunge. Keine Asche = Vorher erwürgt oder erstochen. Die Witwe gestand den Giftmord vor dem Brand.',
        explanationEn: 'Correct! Song Ci established the core principle of vital reactions: living organisms gasp smoke reflexively. Absence of soot proves postmortem burning. The widow confessed to prior poison.',
        explanationZh: '正解！宋慈确立生前伤/死后伤之“生活反应”关键准则：生焚必咳吸黑灰入内，死焚绝无吸入。妇人伏法。',
        explanationEs: '¡Correcto! Principio de reacción vital: una persona viva aspira hollín por reflejo. Si está limpia, fue quemada post-mortem.',
      },
      {
        id: 'opt-smoke-mask',
        labelDe: 'Der Mann trug wohl ein nasses Tuch vor dem Mund und erstickte an Sauerstoffmangel',
        labelEn: 'The man likely wore a wet cloth mask that filtered all soot particles',
        labelZh: '死者熟睡时掩有湿布过滤烟气窒息',
        labelEs: 'Llevaba un pañuelo húmedo que filtró todo el hollín',
        isCorrect: false,
        explanationDe: 'Falsch. Selbst mit feuchtem Tuch lagern sich mikroskopische Rußpartikel an den feuchten Bronchialschleimhäuten ab.',
        explanationEn: 'Incorrect. Even with damp cloth coverings, microscopic soot adheres to respiratory mucous membranes.',
        explanationZh: '误判。即便隔布，微粒烟熏亦必留滞于咽喉黏膜之上。',
        explanationEs: 'Incorrecto. Incluso con tela húmeda, partículas finas se adhieren a la mucosa traqueal.',
      },
      {
        id: 'opt-flash-fire',
        labelDe: 'Das Feuer brannte so heiß, dass Ruß sofort zu Kohlendioxid oxidierte',
        labelEn: 'The fire was so intense that carbon soot oxidized completely into gas',
        labelZh: '烈火温度极高，炭灰瞬间气化全消',
        labelEs: 'El fuego fue tan caliente que el hollín se gasificó',
        isCorrect: false,
        explanationDe: 'Falsch. Wohnungsbrände erzeugen extremen unvollständigen Kohlenstoff-Schwelbrand; Rußbildung ist physikalisch unvermeidbar.',
        explanationEn: 'Incorrect. Domestic fires always produce incomplete combustion products and dense carbon particulates.',
        explanationZh: '误判。木梁崩塌实为不完全燃烧，浓烟炭素势不可免。',
        explanationEs: 'Incorrecto. En fuegos de madera siempre hay combustión incompleta con denso hollín.',
      },
    ],
    originalQuoteZh: '「宋慈《洗冤集录》：若是生前烧死者，口鼻内有烟灰，两手脚皆拳缩。若死后烧者，虽焦黑，口鼻内并无烟灰。若疑死后烧，先割开口验喉管，内无灰者非真烧死。」',
    originalQuoteTranslationDe: '„Song Ci, 洗冤集录: Ward einer lebend verbrannt, so birgt sein Mund und seine Nase Rauch und Asche, und Hände und Füße sind verkrampft. Ward er nach dem Tode verbrannt, obgleich ganz verkohlt, so ist in Mund und Nase keine Asche. Hat man Zweifel, so schneide die Luftröhre auf: Ist keine Asche darin, so war es kein Feuertod.“',
    originalQuoteTranslationEn: '"Song Ci, Washing Away of Wrongs: If a person was burned alive, there is soot in the mouth and nose, and the limbs are clenched. If burned after death, though blackened, there is no soot within. If doubtful, slice open the windpipe: if no ash is found, he did not perish in the fire."',
    modernScienceValidationDe: 'Moderne Bestätigung: Die Inspektion von Rußablagerungen in Trachea und Bronchien sowie der Nachweis von Karboxyhämoglobin (CO-Hb im Blut) sind bis heute die internationalen Standardkriterien zur Abgrenzung von Brandleichen.',
    modernScienceValidationEn: 'Modern validation: Endotracheal soot examination and carboxyhemoglobin (CO-Hb) blood saturation remain the gold standard postmortem tests for antemortem fire exposure worldwide.',
  },
];

export interface ForensicPlayerScore {
  solvedCount: number;
  totalScore: number;
  rankTitleDe: string;
  rankTitleEn: string;
  rankTitleZh: string;
  rankTitleEs: string;
  verdictDe: string;
  verdictEn: string;
  verdictZh: string;
  verdictEs: string;
}

export function evaluateSongCiDeduction(totalScore: number): ForensicPlayerScore {
  if (totalScore >= 250) {
    return {
      solvedCount: 3,
      totalScore,
      rankTitleDe: 'Großrichter des Kaiserlichen Kriminalgerichtshofs (提刑按察使)',
      rankTitleEn: 'Imperial High Judicial Commissioner (Ti-Xing An-Cha-Shi)',
      rankTitleZh: '提刑按察使 · 洞悉幽微',
      rankTitleEs: 'Comisionado Judicial Imperial de Apelaciones',
      verdictDe: 'Hervorragend! Sie urteilen allein nach physischer Evidenz und wissenschaftlicher Beobachtung. Weder falsche Zeugen noch scheinbar saubere Tatwaffen konnten Sie täuschen.',
      verdictEn: 'Exemplary! You evaluate strictly by physical evidence and natural science. Neither false alibis nor washed murder weapons could deceive your analytical eye.',
      verdictZh: '明镜高悬！唯凭物理实据与科学理法断事，洗雪奇冤，洞察毫芒。',
      verdictEs: '¡Ejemplar! Juzgas únicamente mediante evidencia física y observación científica. Ni las coartadas falsas ni las armas lavadas engañaron tu perspicacia.',
    };
  } else if (totalScore >= 150) {
    return {
      solvedCount: 2,
      totalScore,
      rankTitleDe: 'Sorgfältiger Kreisrichter dritter Klasse (知县正堂)',
      rankTitleEn: 'Diligent Magistrate of the Third Rank (Zhi-Xian)',
      rankTitleZh: '知县正堂 · 明察秋毫',
      rankTitleEs: 'Magistrado de distrito diligente',
      verdictDe: 'Sehr gut. Sie beherrschen die Grundlagen der Vitalreaktionen und der Insekten-Chemosensorik. Ein ehrenvolles Zeugnis antiker Kriminalistik.',
      verdictEn: 'Very good. You have mastered antemortem vital signs and chemical entomology. An honorable certificate in historic forensic deduction.',
      verdictZh: '断案谨饬，熟稔生活反应与昆虫物候，不负百姓之托。',
      verdictEs: 'Muy bien. Dominas los signos vitales antemortem y la quimiorrecepción de insectos. Un testimonio honorable de criminalística.',
    };
  } else {
    return {
      solvedCount: 1,
      totalScore,
      rankTitleDe: 'Gerichtsschreiber-Lehrling (提刑司见习刑名师爷)',
      rankTitleEn: 'Apprentice Court Scribe (Ti-Xing Clerk)',
      rankTitleZh: '提刑司见习书吏',
      rankTitleEs: 'Escribano judicial en prácticas',
      verdictDe: 'Ausbaufähig. Sie ließen sich von sauber gewaschenem Stahl und oberflächlicher Knochenfarbe täuschen. Song Cis Lehrbuch sei Ihnen als Pflichtlektüre auferlegt.',
      verdictEn: 'Room for growth. You were tricked by surface washes and chalky bones. A full study of Song Ci’s 1247 treatise is prescribed.',
      verdictZh: '尚需研磨，切莫轻信肉眼表象，当重温《洗冤集录》五卷全文。',
      verdictEs: 'Margen de mejora. Te dejaste engañar por armas lavadas y huesos blanquecinos. El tratado de Song Ci es lectura obligatoria.',
    };
  }
}
