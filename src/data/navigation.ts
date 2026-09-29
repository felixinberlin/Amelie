/**
 * Navigationsstruktur: fünf Bereiche nach Nutzerabsicht, je 2 bis 6 Unterseiten.
 * Die Tab-IDs sind die `currentTab`-Werte der App. Labels und Zähler kommen im Header.
 * "Werkstatt" ist Betreiber-Sicht und wird nur im Admin-Modus in der Leiste gezeigt.
 */
export type NavLang = 'de' | 'en' | 'es';
export type NavSectionId = 'gifts' | 'ideas' | 'play' | 'research' | 'workshop';

export interface NavSection {
  id: NavSectionId;
  label: Record<NavLang, string>;
  hint: Record<NavLang, string>;
  tabs: string[];
  /** nur im Admin-Modus sichtbar (außer der aktuelle Tab liegt darin) */
  admin?: boolean;
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'gifts',
    label: { de: 'Geschenke', en: 'Gifts', es: 'Regalos' },
    hint: { de: 'Was verschenkt wird', en: 'What is given away', es: 'Lo que se regala' },
    tabs: ['dosen', 'compare', 'manifest'],
  },
  {
    id: 'ideas',
    label: { de: 'Ideen', en: 'Ideas', es: 'Ideas' },
    hint: { de: 'Was noch reift und was gestorben ist', en: 'What is still ripening and what died', es: 'Lo que madura y lo que murió' },
    tabs: ['unpacked', 'normal-jobs', 'discarded'],
  },
  {
    id: 'play',
    label: { de: 'Ausprobieren', en: 'Try it', es: 'Probar' },
    hint: { de: 'Spielen und Simulatoren', en: 'Games and simulators', es: 'Juegos y simuladores' },
    tabs: ['games', 'sandboxes', 'whimsy'],
  },
  {
    id: 'research',
    label: { de: 'Recherche', en: 'Research', es: 'Investigación' },
    hint: { de: 'Quellen, Geldgeber, Empfänger', en: 'Sources, funders, recipients', es: 'Fuentes, financiadores, destinatarios' },
    tabs: ['quellen', 'reddit', 'funding', 'playbook', 'matrix', 'muster-emails'],
  },
  {
    id: 'workshop',
    label: { de: 'Werkstatt', en: 'Workshop', es: 'Taller' },
    hint: { de: 'Betrieb: Packen, Import, Daten, Audit', en: 'Operations: packing, import, data, audit', es: 'Operación: empaquetar, importar, datos, auditoría' },
    tabs: ['packer', 'google-import', 'data-hub', 'audit'],
    admin: true,
  },
];

export const DEFAULT_TAB = 'dosen';

export const sectionOfTab = (tab: string): NavSection | undefined => NAV_SECTIONS.find((s) => s.tabs.includes(tab));

/** Sichtbare Bereiche: Admin-Bereiche nur im Admin-Modus oder wenn der aktuelle Tab darin liegt. */
export function visibleSections(currentTab: string, adminMode: boolean): NavSection[] {
  return NAV_SECTIONS.filter((s) => !s.admin || adminMode || s.tabs.includes(currentTab));
}

export const ALL_NAV_TABS: string[] = NAV_SECTIONS.flatMap((s) => s.tabs);
