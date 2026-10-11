/**
 * Canal Saint-Martin Stone Skipping Physics & Zen Engine
 *
 * Simulates the hydrodynamic physics of stone skipping (ricochet) inspired by
 * the iconic scene in Amélie Poulain and fluid dynamics (Bocquet et al., Nature 2004).
 * Optimal attack angle ~20°, gyroscopic spin stability, energy dissipation,
 * and procedural ASMR water acoustic synthesis.
 */

export type PebbleType = 'slate' | 'quartz' | 'granite' | 'sandstone';

export interface PebbleConfig {
  id: PebbleType;
  nameDe: string;
  nameEn: string;
  nameEs: string;
  mass: number; // in grams
  flatness: number; // 0..1 (1 = razor flat slate)
  color: string;
  basePitch: number; // Hz for acoustic sound
  descriptionDe: string;
  descriptionEn: string;
  descriptionEs: string;
}

export const PEBBLE_CONFIGS: Record<PebbleType, PebbleConfig> = {
  slate: {
    id: 'slate',
    nameDe: 'Dunkler Schieferkiesel',
    nameEn: 'River Slate Pebble',
    nameEs: 'Guijarro de pizarra',
    mass: 38,
    flatness: 0.95,
    color: '#475569',
    basePitch: 620,
    descriptionDe: 'Flach wie eine Scherbe. Gleitet mühelos und erzeugt lange Sprungserien.',
    descriptionEn: 'Wafer-thin and aerodynamic. Glides effortlessly with long skipping chains.',
    descriptionEs: 'Plana como una teja. Se desliza sin esfuerzo y da muchos saltos.',
  },
  quartz: {
    id: 'quartz',
    nameDe: 'Geschliffener Quarzkiesel',
    nameEn: 'Polished Quartz Disc',
    nameEs: 'Disco de cuarzo pulido',
    mass: 55,
    flatness: 0.82,
    color: '#cbd5e1',
    basePitch: 540,
    descriptionDe: 'Vom Flusswasser rund gewaschen. Hohe Eigenstabilität bei Drall.',
    descriptionEn: 'Tumbled smooth by the river. Highly stable when given strong spin.',
    descriptionEs: 'Redondeado por el río. Muy estable con giro rápido.',
  },
  granite: {
    id: 'granite',
    nameDe: 'Schwerer Granitsplitter',
    nameEn: 'Heavy Granite Fragment',
    nameEs: 'Fragmento de granito',
    mass: 82,
    flatness: 0.65,
    color: '#64748b',
    basePitch: 420,
    descriptionDe: 'Schwer und wuchtig. Braucht viel Kraft, erzeugt aber tiefe Resonanzplops.',
    descriptionEn: 'Heavy and dense. Demands brute flick speed, creates deep acoustic plops.',
    descriptionEs: 'Pesado y denso. Requiere mucha fuerza y crea chasquidos graves.',
  },
  sandstone: {
    id: 'sandstone',
    nameDe: 'Pariser Sandsteinkiesel',
    nameEn: 'Paris Sandstone Pebble',
    nameEs: 'Arenisca parisina',
    mass: 45,
    flatness: 0.75,
    color: '#d97706',
    basePitch: 490,
    descriptionDe: 'Porös und griffig. Warmer Ton beim Eintauchen ins Pariser Wasser.',
    descriptionEn: 'Porous and tactile. Mellow warm acoustics as it clips the surface.',
    descriptionEs: 'Porosa y agradable al tacto. Sonido cálido al golpear el agua.',
  },
};

export interface CanalCuriosity {
  id: string;
  distanceThreshold: number; // in meters
  hopsThreshold: number; // minimum hops needed
  titleDe: string;
  titleEn: string;
  titleEs: string;
  loreDe: string;
  loreEn: string;
  loreEs: string;
  icon: string;
  discovered: boolean;
}

export const CANAL_CURIOSITIES: CanalCuriosity[] = [
  {
    id: 'passerelle-douanes',
    distanceThreshold: 12,
    hopsThreshold: 3,
    titleDe: 'Passerelle des Douanes',
    titleEn: 'Customs Footbridge',
    titleEs: 'Pasarela de la aduana',
    loreDe: 'Die eiserne Bogenbrücke über den Kanal. Hier lehnte Amélie oft mit den Händen in den Manteltaschen.',
    loreEn: 'The iconic arched cast-iron footbridge where Amélie leaned with hands tucked in her coat.',
    loreEs: 'La emblemática pasarela de hierro fundido donde Amélie se apoyaba pensativa.',
    icon: '🌉',
    discovered: false,
  },
  {
    id: 'ecluse-recollets',
    distanceThreshold: 24,
    hopsThreshold: 5,
    titleDe: 'Schleuse des Récollets',
    titleEn: 'Récollets Water Lock',
    titleEs: 'Esclusa de Récollets',
    loreDe: 'Erbaut 1825. Wenn das Schleusentor schließt, wird das Wasser für Minuten spiegelglatt wie Glas.',
    loreEn: 'Built in 1825. When the lock gates shut, the canal surface turns mirror-still for minutes.',
    loreEs: 'Construida en 1825. Cuando cierran las compuertas, el agua queda como un espejo.',
    icon: '🛶',
    discovered: false,
  },
  {
    id: 'hotel-du-nord',
    distanceThreshold: 38,
    hopsThreshold: 7,
    titleDe: 'Hôtel du Nord',
    titleEn: 'Hôtel du Nord',
    titleEs: 'Hôtel du Nord',
    loreDe: 'Legendärer Schauplatz des Films von Marcel Carné (1938): „Atmosphère ! Atmosphère ! Est-ce que j\'ai une gueule d\'atmosphère ?"',
    loreEn: 'Legendary setting of the 1938 classic film: "Atmosphère ! Atmosphère ! Do I look like an atmosphere?"',
    loreEs: 'Lugar de rodaje del clásico de 1938: «Atmosphère ! Atmosphère ! ¿Acaso tengo cara de atmósfera?»',
    icon: '🏨',
    discovered: false,
  },
  {
    id: 'zinc-metro-jeton',
    distanceThreshold: 50,
    hopsThreshold: 9,
    titleDe: 'Vergessener Zink-Metro-Jeton',
    titleEn: 'Forgotten Zinc Metro Token',
    titleEs: 'Ficha de metro de zinc olvidada',
    loreDe: 'Eine alte RATP-Fahrkarte aus den 1950ern, die ein verliebtes Paar von der Brücke ins Wasser warf.',
    loreEn: 'A vintage 1950s RATP transit token tossed from the bridge by two young lovers.',
    loreEs: 'Una ficha antigua de metro de los años 50 lanzada desde el puente por enamorados.',
    icon: '🪙',
    discovered: false,
  },
  {
    id: 'message-in-bottle',
    distanceThreshold: 65,
    hopsThreshold: 11,
    titleDe: 'Flaschenpost aus Montmartre',
    titleEn: 'Message in a Bottle from Montmartre',
    titleEs: 'Mensaje en una botella de Montmartre',
    loreDe: 'Ein handgeschriebenes Gedicht auf vergilbtem Notenpapier. Jemand wünschte sich jemanden herbei.',
    loreEn: 'A handwritten poem on aged music manuscript paper, sent drifting toward the Seine.',
    loreEs: 'Un poema manuscrito en partitura amarillenta dejado a la deriva hacia el Sena.',
    icon: '📜',
    discovered: false,
  },
];

export interface WaterRipple {
  id: number;
  x: number; // in canvas coordinate percentage 0..100
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  hopIndex: number;
}

export interface SkipPoint {
  hopNumber: number;
  distanceMeters: number;
  waterXPercent: number;
  waterYPercent: number;
  velocityRemaining: number;
  energyRatio: number;
}

export interface SimulationResult {
  hops: SkipPoint[];
  totalDistance: number;
  success: boolean;
  sinkReasonDe: string;
  sinkReasonEn: string;
  sinkReasonEs: string;
}

/**
 * Calculates physics trajectory of a thrown stone across the water surface.
 * @param force 0.1 to 1.0 (throw power)
 * @param angleDegrees Angle of attack relative to water (ideal ~20 deg)
 * @param spin 0 to 1.0 (gyroscopic spin stability)
 * @param pebbleType Type of pebble
 */
export function simulateStoneThrow(
  force: number,
  angleDegrees: number,
  spin: number,
  pebbleType: PebbleType
): SimulationResult {
  const pebble = PEBBLE_CONFIGS[pebbleType];
  const hops: SkipPoint[] = [];

  // Optimal attack angle according to Bocquet et al. (Nature, 2004) is 20°
  const optimalAngle = 20;
  const angleError = Math.abs(angleDegrees - optimalAngle);
  
  // Angle efficiency multiplier (penalty increases sharply outside 12° - 32°)
  const angleEfficiency = Math.max(0, 1 - Math.pow(angleError / 22, 2));

  // Initial velocity in m/s (10 m/s to 32 m/s based on force and mass)
  let velocity = (12 + force * 20) * (45 / Math.max(30, pebble.mass));
  let currentSpin = spin;
  let currentDistance = 0;
  let hopIndex = 1;

  let sinkReasonDe = 'Perfektes Ausgleiten im ruhigen Kanalwasser.';
  let sinkReasonEn = 'Gentle coasting to rest in the tranquil canal water.';
  let sinkReasonEs = 'Deslizamiento suave en las aguas tranquilas del canal.';

  // Minimum critical velocity for hydrodynamic lift to overcome gravity
  const criticalVelocity = 5.5 / (pebble.flatness * 1.1);

  while (velocity > criticalVelocity && hopIndex <= 20) {
    // Gyroscopic stability check: without enough spin, stone tumbles into a dive
    const minSpinNeeded = 0.18 + (hopIndex * 0.04);
    if (currentSpin < minSpinNeeded) {
      sinkReasonDe = 'Der Kiesel hat den Drall verloren und ist gekippt.';
      sinkReasonEn = 'The pebble lost its gyroscopic spin and tumbled into a dive.';
      sinkReasonEs = 'La piedra perdió el giro y se hundió.';
      break;
    }

    // Distance covered in this hop
    const hopDistance = Math.max(1.8, (velocity * 0.42 * (1 + pebble.flatness * 0.3)));
    currentDistance += hopDistance;

    // Canvas position coordinates for visualization (progressive perspective along canal)
    const progressRatio = Math.min(1, currentDistance / 75);
    const waterX = 8 + progressRatio * 84;
    // Slight sinusoidal wobble representing natural drift
    const waterY = 50 + Math.sin(hopIndex * 1.1) * (14 * (1 - progressRatio));

    hops.push({
      hopNumber: hopIndex,
      distanceMeters: Math.round(currentDistance * 10) / 10,
      waterXPercent: waterX,
      waterYPercent: waterY,
      velocityRemaining: Math.round(velocity * 10) / 10,
      energyRatio: velocity / (12 + force * 20),
    });

    // Hydrodynamic energy loss per bounce
    // Energy retained is higher with good flatness and near-optimal angle
    const retentionFactor = (0.55 + pebble.flatness * 0.32) * angleEfficiency;
    velocity *= Math.min(0.88, retentionFactor);
    currentSpin *= 0.88; // Spin slows down slightly per contact

    hopIndex++;
  }

  if (hops.length === 0) {
    sinkReasonDe = 'Zu steil eingetaucht – der Stein versank sofort wie ein Lot.';
    sinkReasonEn = 'Entered too steeply — the stone sank immediately like a plumb line.';
    sinkReasonEs = 'Entró demasiado inclinada y se hundió al instante.';
  } else if (hops.length < 3 && angleError > 15) {
    sinkReasonDe = 'Winkel zu steil oder zu flach für einen optimalen Wasser-Lift.';
    sinkReasonEn = 'Angle of attack too steep or too shallow for hydrodynamic lift.';
    sinkReasonEs = 'Ángulo demasiado inclinado o demasiado plano para rebotar.';
  }

  return {
    hops,
    totalDistance: Math.round(currentDistance * 10) / 10,
    success: hops.length >= 2,
    sinkReasonDe,
    sinkReasonEn,
    sinkReasonEs,
  };
}

export interface AcousticSkipProfile {
  fundamentalFreq: number;
  decayTime: number;
  plopGain: number;
  noiseAmount: number;
}

/**
 * Calculates procedural Web Audio parameters for the water contact sound.
 */
export function calculateAcousticSkipProfile(
  hopNumber: number,
  pebbleType: PebbleType,
  energyRatio: number
): AcousticSkipProfile {
  const pebble = PEBBLE_CONFIGS[pebbleType];
  
  // Frequency rises slightly with each subsequent bounce (skipping pitch ascent)
  const pitchMultiplier = 1 + (hopNumber * 0.12);
  const fundamentalFreq = pebble.basePitch * pitchMultiplier;

  // Lighter hops have faster acoustic decay
  const decayTime = Math.max(0.04, 0.14 * energyRatio);
  const plopGain = Math.min(0.6, 0.2 + energyRatio * 0.35);
  const noiseAmount = Math.max(0.05, 0.25 * (1 - energyRatio * 0.5));

  return {
    fundamentalFreq,
    decayTime,
    plopGain,
    noiseAmount,
  };
}

/**
 * Evaluates whether any Canal Saint-Martin curiosities were unlocked by this throw.
 */
export function evaluateCanalCuriosityDiscovery(
  curiosities: CanalCuriosity[],
  totalDistance: number,
  hopsCount: number
): { newlyDiscovered: CanalCuriosity | null; updatedCuriosities: CanalCuriosity[] } {
  let newlyDiscovered: CanalCuriosity | null = null;

  const updatedCuriosities = curiosities.map((c) => {
    if (!c.discovered && totalDistance >= c.distanceThreshold && hopsCount >= c.hopsThreshold) {
      const unlocked = { ...c, discovered: true };
      if (!newlyDiscovered) {
        newlyDiscovered = unlocked;
      }
      return unlocked;
    }
    return c;
  });

  return { newlyDiscovered, updatedCuriosities };
}
