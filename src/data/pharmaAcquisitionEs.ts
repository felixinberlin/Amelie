// Spanische Fassung des Farmacia-Dossiers (nur dieses Dossier ist dreisprachig).
// Reihenfolge und IDs folgen pharmaAcquisition.ts; der Test prüft die Deckung.

export const APPROACH_ES: Record<string, { name: string; what: string; risk: string }> = {
  letters: {
    name: 'Cartas personales a titulares',
    what: '4.000 cartas al año a titulares de farmacias con muchos años abiertas. El correo postal está permitido; el correo electrónico sin consentimiento no.',
    risk: 'Hay que aclarar el origen de las direcciones y la lista Robinson. La tasa de respuesta del 0,7 % es una suposición.',
  },
  'letters-radar': {
    name: 'Cartas con radar de sucesión',
    what: 'Como las cartas, pero la lista se puntúa con datos públicos (años abiertas, banda de facturación, localidad). Es la parte de software.',
    risk: 'La edad del titular no es pública: solo se aproxima con años abiertos y bandas de facturación. Revisar antes la protección de datos.',
  },
  ads: {
    name: 'Google Ads en búsquedas de venta',
    what: 'Anuncios en búsquedas como «vender farmacia» y «valoración de farmacia», con una página que ofrece una calculadora de valoración.',
    risk: 'El volumen de búsqueda es pequeño y muchos contactos solo tienen curiosidad. El CPC de estos términos no está medido.',
  },
  field: {
    name: 'Visitas y llamadas (fuerza de ventas)',
    what: 'Una persona que visita y llama a farmacias. Las llamadas necesitan base legal; el correo electrónico, consentimiento.',
    risk: 'Es el coste fijo más alto y depende de la persona. Las llamadas en frío a farmacéuticos arriesgan la confianza.',
  },
  seo: {
    name: 'SEO y contenidos',
    what: 'Guías sobre valoración, impuestos y trámites por comunidad autónoma, más una calculadora de valoración como cebo.',
    risk: 'Los intermediarios establecidos llevan años en estas búsquedas. Es lento, pero los contactos son cálidos.',
  },
  referral: {
    name: 'Prescriptores: gestores, abogados, bancos',
    what: 'Profesionales que conocen pronto la intención de vender reciben el 15 % de la comisión al cierre.',
    risk: 'Es el arranque más lento. Distribuidores y bancos tienen sus propios intereses (financiación, suministro).',
  },
  press: {
    name: 'Prensa especializada y feria',
    what: 'Anuncios en medios de farmacia y un stand en Infarma (Madrid, Ifema). Tarifas solo bajo petición.',
    risk: 'Se pierde alcance y se gana marca, no cierres. Infarma 2026 fue en marzo; la próxima fecha no está comprobada.',
  },
  buyers: {
    name: 'Lado comprador: lista de compradores cualificados',
    what: 'Anuncios en LinkedIn a farmacéuticos adjuntos y una comprobación previa de financiación. Por sí solo no genera comisión, pero cierra mandatos.',
    risk: 'No es el cuello de botella: la demanda supera a la oferta. Los competidores ya declaran entre 1.000 y 22.000 compradores.',
  },
};

/** Gleiche Reihenfolge wie PHARMA_FACTS. */
export const FACTS_ES: string[] = [
  '22.311 farmacias en España (2024).',
  'Solo los farmacéuticos pueden ser propietarios; un titular por oficina. Cada comunidad autónoma regula la transmisión (Andalucía: al menos cinco años de funcionamiento).',
  'Andalucía: 120 ventas en 2024 frente a 148 en 2023 (−19 %); 28 fueron transmisiones parciales. Las transmisiones por herencia o donación subieron de 47 a 67.',
  'Edad media de los farmacéuticos colegiados: 50,2 años; el 12,3 % supera los 70. El 46 % de los que trabajan en farmacia comunitaria son titulares.',
  'Precio por múltiplo de ventas, normalmente de 0,8 a 1,5 veces la facturación anual, o de 4 a 7 veces el EBITDA. La facturación media en 2024 fue de 1,12 M€.',
  'Comisión del intermediario: del 3 al 5 % por parte según un portal competidor; la fuente no es neutral y los intermediarios no publican tarifas.',
  'Una transmisión tarda de 6 meses a 1 año; otras fuentes hablan de 8 a 16 semanas desde el acuerdo de precio.',
  '17 intermediarios en un listado; Farmaconsulting declara 80 profesionales y 22.000 compradores conocidos.',
  'El correo electrónico comercial no solicitado está prohibido por el art. 21 de la LSSI sin consentimiento, también entre empresas. Para llamadas puede servir el interés legítimo.',
  'Coste por lead en LinkedIn en España para B2B: de 25 a 100 €, habitualmente de 40 a 80 €.',
];

/** Gleiche Reihenfolge wie PHARMA_TEST_PLAN. */
export const TEST_ES: string[] = [
  '500 cartas a titulares de farmacias con muchos años abiertas; contar las respuestas.',
  'Página con calculadora de valoración y tres meses de Google Ads.',
  '15 conversaciones con gestores y abogados especializados en farmacia.',
  '10 conversaciones con titulares que no quieren vender: por qué no y en quién confiarían.',
];

export const TEST_STOP_ES =
  'Parar si a los 90 días hay menos de cinco conversaciones serias de venta y ningún mandato firmado.';

export const MISSING_ES: string[] = [
  'Número anual de operaciones en toda España (no encontrado).',
  'Tarifas reales de los intermediarios (ninguna publicada).',
  'Origen legal de las direcciones de los titulares (colegios, registros autonómicos).',
  'Tarifa de Correos 2026 para cartas personalizadas, tarifas de Correo Farmacéutico y El Global, precio del stand de Infarma.',
  'Fecha de la próxima Infarma.',
];
