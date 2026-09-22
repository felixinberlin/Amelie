/**
 * Utility functions for permanent Dose URLs and deep linking
 */

export function getBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin && window.location.origin !== 'null' && window.location.origin !== 'file://'
      ? window.location.origin
      : '';
    const pathname = window.location.pathname || '/';
    return `${origin}${pathname}`;
  }
  return '';
}

/**
 * Returns a permanent canonical URL for a dose
 * e.g. https://domain.app/#dose=altbau-thermal
 */
export function getDoseUrl(doseId: string): string {
  const base = getBaseUrl();
  return `${base}#dose=${encodeURIComponent(doseId)}`;
}

/**
 * Returns a permanent canonical URL for a simulator in the sandboxes tab
 * e.g. https://domain.app/#sim=glasanflug
 */
export function getSimulatorUrl(simKey: string): string {
  const base = getBaseUrl();
  return `${base}#sim=${encodeURIComponent(simKey)}`;
}

/**
 * Parses the current URL to find if a dose is requested
 * Supports:
 * - Hash: #dose=altbau-thermal or #/dose/altbau-thermal
 * - Search params: ?dose=altbau-thermal
 */
export function parseDoseIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Check Hash
    const hash = window.location.hash;
    if (hash) {
      const matchDoseParam = hash.match(/#(?:\/)?dose=([^&]+)/i);
      if (matchDoseParam && matchDoseParam[1]) {
        return decodeURIComponent(matchDoseParam[1]);
      }
      const matchSlashDose = hash.match(/#(?:\/)?dose\/([^/?&]+)/i);
      if (matchSlashDose && matchSlashDose[1]) {
        return decodeURIComponent(matchSlashDose[1]);
      }
    }

    // 2. Check Search query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const doseQuery = searchParams.get('dose');
    if (doseQuery) {
      return doseQuery;
    }
  } catch (err) {
    console.error('Error parsing dose from URL:', err);
  }

  return null;
}

/**
 * Permanente URL auf ein Kapitel im Buch zur Dose
 * z. B. https://domain.app/#dose=eurobirdcast&buch=besetzung
 */
export function getBookChapterUrl(doseId: string, slug: string): string {
  return `${getDoseUrl(doseId)}&buch=${encodeURIComponent(slug)}`;
}

/**
 * Liest das gewünschte Buchkapitel aus der URL.
 * Unterstützt #dose=<id>&buch=<slug> sowie ?buch=<slug> / ?chapter=<slug>
 */
export function parseBookSlugFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const hash = window.location.hash;
    if (hash) {
      const match = hash.match(/[#&](?:buch|chapter|book)=([^&]+)/i);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }

    const searchParams = new URLSearchParams(window.location.search);
    const query = searchParams.get('buch') || searchParams.get('chapter') || searchParams.get('book');
    if (query) return query;
  } catch (err) {
    console.error('Error parsing book chapter from URL:', err);
  }

  return null;
}

/**
 * Parses the current URL to find if a simulator/sandbox tab is requested
 * Supports:
 * - Hash: #sim=glasanflug or #simulator=glasanflug or #sandbox=glasanflug
 * - Search params: ?sim=glasanflug or ?simulator=glasanflug
 */
export function parseSimulatorFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const hash = window.location.hash;
    if (hash) {
      const matchSim = hash.match(/#(?:\/)?(?:sim|simulator|sandbox)=([^&]+)/i);
      if (matchSim && matchSim[1]) {
        return decodeURIComponent(matchSim[1]);
      }
      const matchSlashSim = hash.match(/#(?:\/)?(?:sim|simulator|sandbox)\/([^/?&]+)/i);
      if (matchSlashSim && matchSlashSim[1]) {
        return decodeURIComponent(matchSlashSim[1]);
      }
    }

    const searchParams = new URLSearchParams(window.location.search);
    const simQuery = searchParams.get('sim') || searchParams.get('simulator') || searchParams.get('sandbox');
    if (simQuery) {
      return simQuery;
    }
  } catch (err) {
    console.error('Error parsing simulator from URL:', err);
  }

  return null;
}

/**
 * Updates the browser's URL hash to reflect the dose or clear it
 */
export function setDoseUrl(doseId: string | null): void {
  if (typeof window === 'undefined') return;

  try {
    const currentBase = window.location.pathname + window.location.search;
    if (doseId) {
      const newHash = `#dose=${encodeURIComponent(doseId)}`;
      if (window.location.hash !== newHash) {
        window.history.pushState({ doseId }, '', `${currentBase}${newHash}`);
      }
    } else {
      if (window.location.hash && window.location.hash.includes('dose=')) {
        window.history.pushState({}, '', currentBase);
      }
    }
  } catch (err) {
    // Fallback if pushState fails
    if (doseId) {
      window.location.hash = `dose=${encodeURIComponent(doseId)}`;
    } else {
      window.location.hash = '';
    }
  }
}

export function clearDoseUrl(): void {
  setDoseUrl(null);
}

/**
 * Replaces placeholder [Link zur Dose...] or [Link to tin...] in email text
 * with real, clickable URLs using the current origin
 */
export function resolveEmailBodyDoseUrls(body: string, doseLinks?: string[]): string {
  if (!doseLinks || doseLinks.length === 0) return body;

  let resolved = body;

  // If there is only one dose link and a generic or named placeholder
  if (doseLinks.length === 1) {
    const url = getDoseUrl(doseLinks[0]);
    resolved = resolved.replace(/\[Link zur Dose:[^\]]+\]/gi, url);
    resolved = resolved.replace(/\[Link to Dose:[^\]]+\]/gi, url);
    resolved = resolved.replace(/\[Link to tin:[^\]]+\]/gi, url);
    resolved = resolved.replace(/\[Link zur Dose\]/gi, url);
    resolved = resolved.replace(/\[Link to tin\]/gi, url);
  } else if (doseLinks.length >= 2) {
    // Multiple dose links: e.g. Sperrmüll-Radar & Kiez-Lärmkarte
    // In mail-2:
    // - Sperrmüll-Radar: [Link zur Dose]
    // - Kiez-Lärmkarte: [Link zur Dose]
    doseLinks.forEach((id) => {
      const url = getDoseUrl(id);
      // Replace case where dose ID or key is in placeholder
      const escapedId = id.replace(/-/g, '[-\\s]?');
      const specificRegex = new RegExp(`\\[(?:Link zur Dose|Link to tin):?\\s*${escapedId}[^\\]]*\\]`, 'gi');
      resolved = resolved.replace(specificRegex, url);
    });

    // Sequential fallback for lines like "- Name: [Link zur Dose]"
    let linkIdx = 0;
    resolved = resolved.replace(/\[(?:Link zur Dose|Link to tin)\]/gi, () => {
      if (linkIdx < doseLinks.length) {
        const url = getDoseUrl(doseLinks[linkIdx]);
        linkIdx++;
        return url;
      }
      return getDoseUrl(doseLinks[0]);
    });
  }

  return resolved;
}
