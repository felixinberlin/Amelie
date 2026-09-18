import { Language } from '../types';

export interface I18nCatalog {
  app: {
    title: string;
    tagline: string;
    subtitle: string;
  };
  nav: {
    tins: string;
    normalJobs: string;
    unpacked: string;
    googleImport: string;
    sandboxes: string;
    playbook: string;
    matrix: string;
    manifest: string;
    whimsy: string;
    packer: string;
    discarded: string;
  };
  pledge: {
    title: string;
    text: string;
    copy: string;
    copied: string;
  };
  manifest: {
    rule1: { title: string; desc: string; thumb: string };
    rule2: { title: string; desc: string; thumb: string };
    rule3: { title: string; desc: string; thumb: string };
    rule4: { title: string; desc: string; thumb: string };
    rule5: { title: string; desc: string; thumb: string };
  };
  ui: {
    close: string;
    copy_email: string;
    email_copied: string;
    open_tin: string;
    recipient: string;
    verdict_gift: string;
    verdict_build_first: string;
    verdict_keep: string;
    footer_text: string;
    footer_quote: string;
    all_domains: string;
    all_verdicts: string;
    search_placeholder: string;
    tins_heading: string;
    tins_subheading: string;
    tins_badge: string;
    deliveries_heading: string;
    deliveries_subheading: string;
    deliveries_badge: string;
    matrix_heading: string;
    matrix_subheading: string;
    discarded_heading: string;
    discarded_subheading: string;
    packer_heading: string;
    packer_subheading: string;
    unpacked_heading: string;
    unpacked_subheading: string;
    unpacked_badge: string;
    unpacked_pack_btn: string;
    lang_en: string;
    lang_de: string;
    lang_es: string;
  };
}

export const TRANSLATIONS: Record<Language, I18nCatalog> = {
  en: {
    app: {
      title: 'Amélie',
      tagline: 'Ideas that belong to someone else — after Amélie Poulain & the Kula Ring',
      subtitle: 'Félix, Berlin · As of: September 2026',
    },
    nav: {
      tins: 'The Tins',
      normalJobs: 'Everyday Workers',
      unpacked: 'Not Yet Packed',
      googleImport: 'Google Import',
      sandboxes: 'Simulators',
      playbook: 'Search Playbook',
      matrix: 'Matrix & Deliveries',
      manifest: 'Manifesto & Loop',
      whimsy: 'Funny & Better',
      packer: 'Pack a Tin',
      discarded: 'Discarded',
    },
    pledge: {
      title: 'The Amélie Pledge (printed on every tin)',
      text: "This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply. If you ever have an idea you won't build, give it to someone who will.",
      copy: 'Copy pledge',
      copied: 'Copied',
    },
    manifest: {
      rule1: {
        title: 'The delivery is the gift, not the find',
        desc: 'Ideas are cheap. Everyone has thirty. The gift only starts when you research a specific team capable of building it, and deliver a turn-key package.',
        thumb: '1h discovery, 1h validation, 2h recipient research (the 1:2 budget ratio).',
      },
      rule2: {
        title: 'Sign your name, demand nothing',
        desc: 'Your name underneath, CC0 above it. No equity demands, no mandatory attribution, zero expectation of a response. The Kula ring thrives because the gift travels onward, not backward.',
        thumb: '"This idea belongs to no one. Take it, build it, sell it — you owe me nothing."',
      },
      rule3: {
        title: 'Deliver once, then walk away',
        desc: 'Never follow up ("Did you get a chance to read my email?"). Following up turns an unconditional gift into an uninvited task on the recipient\'s todo list.',
        thumb: 'Send once. Let go. Never follow up.',
      },
      rule4: {
        title: 'If nobody asked, give tools, not a project',
        desc: 'Bare ideas with no code belong exclusively with salaried organizations (companies, research grants, foundations). Unpaid open-source maintainers only receive working skeleton code.',
        thumb: 'Never burden unpaid volunteer maintainers with unsolicited project homework.',
      },
      rule5: {
        title: "Don't let it become an excuse",
        desc: 'Giving ideas away feels productive, yet it is still not building. Keep at most two ideas per cycle and actually finish building them.',
        thumb: 'Retain at most 2 projects for yourself. Everything else gets gifted.',
      },
    },
    ui: {
      close: 'Close',
      copy_email: 'Copy email template',
      email_copied: 'Email copied!',
      open_tin: 'Open tin →',
      recipient: 'Recipient:',
      verdict_gift: 'Gift',
      verdict_build_first: 'Build first',
      verdict_keep: 'Kept',
      footer_text: 'All tins dedicated to CC0 (Public Domain).',
      footer_quote: '"The delivery is the gift, not the discovery."',
      all_domains: 'All Domains',
      all_verdicts: 'All Verdicts',
      search_placeholder: 'Search tins (title, problem, recipient, tags)...',
      tins_heading: 'The Gifts: 15 Packaged Tins',
      tins_subheading: 'Every tin is a turn-key one-page brief with the problem, technology breakthrough ("Why now"), architecture sketch, Ticket #1, and where it might fail.',
      tins_badge: '15 ready-to-deliver one-pagers · All CC0',
      deliveries_heading: 'Three Ready-to-Send Outreach Emails',
      deliveries_subheading: 'Round one: three vetted recipient organizations, three complete emails. The delivery is the gift, not the idea. Send once, walk away.',
      deliveries_badge: 'Delivery Plan Q4 2026',
      matrix_heading: 'The Matrix: Idea → Recipient',
      matrix_subheading: 'All 19 ideas with recipient, channel, pitch hook, and status.',
      discarded_heading: 'Four Ideas That Were Dropped',
      discarded_subheading: 'A gift only carries value when the gap is genuinely unoccupied. These four ideas were discarded during preliminary screening because they have already been built multiple times or are commercially blocked.',
      packer_heading: 'Pack a New Tin',
      packer_subheading: 'According to the canonical Amélie rubric: define the problem, locate the recipient, and specify Ticket #1 with an unambiguous Done-criterion.',
      unpacked_heading: 'The Candidate Pipeline: Not Yet Packed Tins',
      unpacked_subheading: 'Every idea undergoes Step 0.5 (existence verification & evidence check before building). Surviving candidates with open gaps are ready to be packed into turn-key tins.',
      unpacked_badge: 'Search Protocol & Candidate Pipeline',
      unpacked_pack_btn: 'Pack into Tin →',
      lang_en: 'English',
      lang_de: 'Deutsch',
      lang_es: 'Español',
    },
  },
  de: {
    app: {
      title: 'Amélie',
      tagline: 'Ideen, die jemand anderem gehören — nach Amélie Poulain & dem Kula-Ring',
      subtitle: 'Félix, Berlin · Stand: September 2026',
    },
    nav: {
      tins: 'Die Dosen',
      normalJobs: 'Echte Arbeit',
      unpacked: 'Ungepackte Ideen',
      googleImport: 'Google Ideen',
      sandboxes: 'Simulatoren',
      playbook: 'Prüf-Playbook',
      matrix: 'Matrix & Zustellplan',
      manifest: 'Manifest & Loop',
      whimsy: 'Heiter & Besser',
      packer: 'Dose packen',
      discarded: 'Entsorgt',
    },
    pledge: {
      title: 'Der Amélie-Pledge (auf jeder Dose)',
      text: 'Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts, nicht einmal eine Antwort. Wenn du eines Tages eine Idee hast, die du nicht bauen wirst, gib sie jemandem, der es tut.',
      copy: 'Pledge kopieren',
      copied: 'Kopiert',
    },
    manifest: {
      rule1: {
        title: 'Die Zustellung ist das Geschenk, nicht der Fund',
        desc: 'Ideen sind billig. Jeder hat dreißig. Das Geschenk beginnt erst in dem Moment, in dem du eine Person oder Gruppe recherchierst, die genau diese Idee bauen kann, und ihr ein sendefertiges Paket schnürst.',
        thumb: 'Pro Idee 1 Stunde Suche, 1 Stunde Prüfung, 2 Stunden Empfänger-Recherche (1:2-Budgetregel).',
      },
      rule2: {
        title: 'Signieren, aber nichts verlangen',
        desc: 'Dein Name steht drunter, CC0 steht darüber. Keine Beteiligungsansprüche, keine Namensnennungspflicht, keine Erwartung einer Antwort. Der Kula-Ring funktioniert, weil die Gabe weiterwandert, nicht zurück.',
        thumb: '„Diese Idee gehört niemandem. Nimm sie, bau sie, verkauf sie — du schuldest mir nichts."',
      },
      rule3: {
        title: 'Einmal zustellen, dann weg',
        desc: 'Kein Nachfassen („Hatten Sie Gelegenheit, meine Mail zu lesen?"). Wer nachfasst, macht aus einem Geschenk eine Aufgabenliste für den Empfänger. Ein Geschenk erzeugt keine Bringschuld.',
        thumb: 'Einmal senden. Loslassen. Nie wieder nachhaken.',
      },
      rule4: {
        title: 'Wer nicht gefragt hat, kriegt Werkzeug, kein Projekt',
        desc: 'Reine Ideen ohne Code gehen nur an Organisationen mit bezahltem Bauauftrag (Firmen, Forschung, Fördertöpfe, Stiftungen). An unbezahlte Open-Source-Maintainer nur mit lauffähigem Code-Skelett.',
        thumb: 'Unbezahlte Maintainer niemals mit unerbetener Arbeit belasten.',
      },
      rule5: {
        title: 'Nicht zur Ausrede machen',
        desc: 'Verschenken fühlt sich produktiv an und ist trotzdem kein Bauen. Maximal zwei Ideen pro Jahr behalten und wirklich bis zum Ende durchziehen.',
        thumb: 'Behalte maximal 2 Ideen. Der Rest geht raus.',
      },
    },
    ui: {
      close: 'Schließen',
      copy_email: 'Mail-Vorlage kopieren',
      email_copied: 'Mail kopiert!',
      open_tin: 'Dose öffnen →',
      recipient: 'Empfänger:',
      verdict_gift: 'Verschenken',
      verdict_build_first: 'Erst bauen',
      verdict_keep: 'Behalten',
      footer_text: 'Alle Dosen stehen unter CC0 (Public Domain).',
      footer_quote: '„Die Zustellung ist das Geschenk, nicht der Fund."',
      all_domains: 'Alle Bereiche',
      all_verdicts: 'Alle Verdikte',
      search_placeholder: 'Dosen durchsuchen (Name, Problem, Empfänger, Tag)...',
      tins_heading: 'Die Geschenke: 15 verpackte Dosen',
      tins_subheading: 'Jede Dose ist ein sendefertiger Einseiter mit Problem, technologischer Wende („Warum jetzt"), Architektur-Skizze, Ticket #1 und der genauen Bruchstelle („Wo es kippt").',
      tins_badge: '15 fertige Einseiter · Alle Inhalte CC0',
      deliveries_heading: 'Drei sendefertige Kaltmails',
      deliveries_subheading: 'Die erste Runde: drei recherchierte Empfänger, drei fertige Mails. Die Zustellung ist das Geschenk, nicht der Fund. Einmal senden, nie nachfassen.',
      deliveries_badge: 'Zustellplan Q4 2026',
      matrix_heading: 'Die Matrix: Idee → Empfänger',
      matrix_subheading: 'Alle 19 Ideen mit Empfänger, Begründung, Kanal, Hook und Status.',
      discarded_heading: 'Vier Ideen, die gestrichen wurden',
      discarded_subheading: 'Ein Geschenk hat nur dann Wert, wenn die Lücke tatsächlich unbesetzt ist. Diese vier Ideen schieden in der Vorab-Prüfung aus, weil sie bereits mehrfach gebaut wurden oder kommerziell blockiert sind.',
      packer_heading: 'Eine neue Dose schnüren',
      packer_subheading: 'Nach dem standardisierten Amélie-Format: Schärfe das Problem, finde den Empfänger und formuliere Ticket #1 so konkret, dass es in zwei Tagen gebaut werden kann.',
      unpacked_heading: 'Der Ideenspeicher: Noch nicht gepackte Dosen',
      unpacked_subheading: 'Jede Idee durchläuft Schritt 0,5 (Existenzprüfung vor dem Bauen). Überlebende Lücken aus dem Prüfprotokoll können mit einem Klick in die Dosen-Werkstatt übernommen werden.',
      unpacked_badge: 'Prüfprotokoll & Kandidaten-Pipeline',
      unpacked_pack_btn: 'In Dose packen →',
      lang_en: 'English',
      lang_de: 'Deutsch',
      lang_es: 'Español',
    },
  },
  es: {
    app: {
      title: 'Amélie',
      tagline: 'Ideas que pertenecen a alguien más — según Amélie Poulain y el Anillo Kula',
      subtitle: 'Félix, Berlín · A fecha de: septiembre de 2026',
    },
    nav: {
      tins: 'Las Latas',
      normalJobs: 'Trabajos Reales',
      unpacked: 'Ideas sin empacar',
      googleImport: 'Importar de Google',
      sandboxes: 'Simuladores',
      playbook: 'Manual de Búsqueda',
      matrix: 'Matriz y Entregas',
      manifest: 'Manifiesto y Bucle',
      whimsy: 'Alegre y Mejor',
      packer: 'Empacar una Lata',
      discarded: 'Descartadas',
    },
    pledge: {
      title: 'El Compromiso Amélie (impreso en cada lata)',
      text: 'Esta idea no pertenece a nadie. Tómala, constrúyela, comercialízala — no me debes nada, ni siquiera una respuesta. Si algún día tienes una idea que no vas a construir, entrégasela a alguien que sí lo haga.',
      copy: 'Copiar compromiso',
      copied: 'Copiado',
    },
    manifest: {
      rule1: {
        title: 'La entrega es el regalo, no el hallazgo',
        desc: 'Las ideas son baratas. Cualquiera tiene treinta. El regalo solo comienza en el momento en que investigas a un equipo específico capaz de construirla y le entregas un paquete listo para usar.',
        thumb: '1h de búsqueda, 1h de validación, 2h investigando al destinatario (la regla 1:2).',
      },
      rule2: {
        title: 'Firma con tu nombre, pero no exijas nada',
        desc: 'Tu nombre debajo, CC0 arriba. Sin reclamos de participación, sin atribución forzosa, sin esperar respuesta. El Anillo Kula funciona porque el regalo avanza en círculo, nunca hacia atrás.',
        thumb: '"Esta idea no es de nadie. Tómala, constrúyela, véncela — no me debes nada."',
      },
      rule3: {
        title: 'Entrega una sola vez y retírate',
        desc: 'Jamás insistas ("¿Tuviste tiempo de leer mi correo?"). Quien insiste convierte un regalo generoso en una tarea forzada para el destinatario. Un regalo no genera deuda.',
        thumb: 'Envía una vez. Suelta. No insistas jamás.',
      },
      rule4: {
        title: 'Si no preguntaron, entrega herramientas, no una carga',
        desc: 'Las ideas puras sin código pertenecen exclusivamente a entidades con presupuesto y mandato de construcción (empresas, cátedras de investigación, fondos públicos). A los mantenedores voluntarios solo se les entrega código funcional.',
        thumb: 'Jamás cargues a mantenedores voluntarios con deberes no solicitados.',
      },
      rule5: {
        title: 'No lo conviertas en una excusa',
        desc: 'Regalar ideas se siente productivo, pero sigue sin ser construir. Quédate con un máximo de dos ideas al año y termínalas de verdad.',
        thumb: 'Quédate con máximo 2 proyectos propios. Todo lo demás se regala.',
      },
    },
    ui: {
      close: 'Cerrar',
      copy_email: 'Copiar plantilla de correo',
      email_copied: '¡Correo copiado!',
      open_tin: 'Abrir lata →',
      recipient: 'Destinatario:',
      verdict_gift: 'Regalar',
      verdict_build_first: 'Construir primero',
      verdict_keep: 'Conservar',
      footer_text: 'Todas las latas están dedicadas al dominio público CC0.',
      footer_quote: '"La entrega es el regalo, no el hallazgo."',
      all_domains: 'Todas las áreas',
      all_verdicts: 'Todos los veredictos',
      search_placeholder: 'Buscar latas (título, problema, destinatario, etiquetas)...',
      tins_heading: 'Los Regalos: 15 Latas Empacadas',
      tins_subheading: 'Cada lata es un resumen de una página con el problema, el hito tecnológico ("Por qué ahora"), esquema de arquitectura, Tarea #1 y su punto crítico de falla.',
      tins_badge: '15 resúmenes listos para entregar · Todos CC0',
      deliveries_heading: 'Tres Correos Listos para Enviar',
      deliveries_subheading: 'Primera ronda: tres organizaciones investigadas, tres correos completos. La entrega es el regalo, no la ocurrencia. Envía una vez y retírate.',
      deliveries_badge: 'Plan de Entrega Q4 2026',
      matrix_heading: 'La Matriz: Idea → Destinatario',
      matrix_subheading: 'Las 19 ideas con destinatario, canal, gancho persuasivo y estado.',
      discarded_heading: 'Cuatro Ideas que Fueron Descartadas',
      discarded_subheading: 'Un regalo solo tiene valor cuando el espacio está genuinamente libre. Estas cuatro ideas se descartaron en el filtro previo porque ya existen o están bloqueadas comercialmente.',
      packer_heading: 'Empacar una Nueva Lata',
      packer_subheading: 'Siguiendo el estándar de Amélie: delimita el problema, localiza al destinatario y formula el Ticket #1 con un criterio inequívoco de finalización.',
      unpacked_heading: 'Canal de Candidatas: Latas aún no empacadas',
      unpacked_subheading: 'Cada idea pasa por el Paso 0.5 (verificación previa de existencia). Las brechas libres del protocolo de prueba están listas para empacarse.',
      unpacked_badge: 'Protocolo de Búsqueda y Candidatas',
      unpacked_pack_btn: 'Empacar en Lata →',
      lang_en: 'English',
      lang_de: 'Deutsch',
      lang_es: 'Español',
    },
  },
};

export function getTranslation(lang: Language): I18nCatalog {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
