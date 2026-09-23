import { Language } from '../types';
import { parseXliff, XliffDocument } from './xliffParser';
import enXlf from './messages.en.xlf?raw';
import deXlf from './messages.de.xlf?raw';
import esXlf from './messages.es.xlf?raw';

// Parse the OASIS XLIFF 1.2 XML strings directly into structured documents
const xliffDocs: Record<Language, XliffDocument> = {
  en: parseXliff(enXlf),
  de: parseXliff(deXlf),
  es: parseXliff(esXlf),
};

/**
 * Access raw XLIFF XML strings for export, inspection, or download.
 */
export function getXliffRaw(lang: Language): string {
  switch (lang) {
    case 'de':
      return deXlf;
    case 'es':
      return esXlf;
    case 'en':
    default:
      return enXlf;
  }
}

/**
 * Access the parsed XliffDocument for a given language.
 */
export function getXliffDocument(lang: Language): XliffDocument {
  return xliffDocs[lang] || xliffDocs.en;
}

/**
 * Translate a key using the XLIFF 1.2 message units.
 * Falls back to English if the translation is missing, and then to fallback text.
 */
export function t(id: string, lang: Language = 'en', fallback?: string): string {
  const currentDoc = xliffDocs[lang];
  if (currentDoc && currentDoc.units[id] !== undefined && currentDoc.units[id] !== '') {
    return currentDoc.units[id];
  }

  // Fallback to English source XLIFF unit
  const enDoc = xliffDocs.en;
  if (enDoc && enDoc.units[id] !== undefined && enDoc.units[id] !== '') {
    return enDoc.units[id];
  }

  return fallback || id;
}

/**
 * Fills a {count} placeholder in a translated string, so numbers in the UI
 * come from the data instead of being frozen into the catalog.
 */
export function withCount(text: string, count: number): string {
  return text.replace(/\{count\}/g, String(count));
}

/**
 * Resolves a localized title for any item (tin, candidate idea, worker project, simulator)
 * through the OASIS XLIFF translation catalog.
 */
export function getLocalizedTitle(
  item: { id?: string; title?: string; titleKey?: string; titleEn?: string } | undefined | null,
  lang: Language = 'en'
): string {
  if (!item) return '';

  if (item.titleKey) {
    const translated = t(item.titleKey, lang, '');
    if (translated && translated !== item.titleKey) return translated;
  }

  if (item.id) {
    const candidateKeys = [
      `tin.${item.id}.title`,
      `candidate.${item.id}.title`,
      `worker.${item.id}.title`,
      `sim.${item.id}.title`
    ];
    for (const key of candidateKeys) {
      const translated = t(key, lang, '');
      if (translated && translated !== key) return translated;
    }
  }

  if (lang !== 'de' && item.titleEn) {
    return item.titleEn;
  }

  return item.title || '';
}

/**
 * Calculate XLIFF translation coverage and metrics.
 */
export function getXliffMetrics() {
  const enTotal = Object.keys(xliffDocs.en.units).length;
  const deUnits = Object.keys(xliffDocs.de.units).length;
  const esUnits = Object.keys(xliffDocs.es.units).length;
  return {
    totalKeys: enTotal,
    deUnits,
    esUnits,
    coverageDe: `${Math.round((deUnits / enTotal) * 100)}%`,
    coverageEs: `${Math.round((esUnits / enTotal) * 100)}%`,
  };
}

export interface I18nCatalog {
  app: {
    title: string;
    tagline: string;
    subtitle: string;
    kula_french: string;
    kula_ring: string;
    cc0_stamp: string;
    par_avion: string;
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
    githubPages: string;
    musterEmails: string;
    more: string;
    tools_archive: string;
    tools_archive_desc: string;
    group: {
      concepts: string;
      tools: string;
      archive: string;
    };
    desc: {
      unpacked: string;
      sandboxes: string;
      musterEmails: string;
      normalJobs: string;
      whimsy: string;
      packer: string;
      googleImport: string;
      playbook: string;
      githubPages: string;
      discarded: string;
    };
  };
  discarded: {
    badge: string;
    verdict: string;
    original_idea: string;
    why_discarded: string;
    evidence: string;
    key_lesson: string;
    philosophy_title: string;
    philosophy_desc: string;
  };
  pledge: {
    title: string;
    text: string;
    copy: string;
    copied: string;
  };
  manifest: {
    rule1: { title: string; desc: string; thumb: string; pill: string };
    rule2: { title: string; desc: string; thumb: string; pill: string };
    rule3: { title: string; desc: string; thumb: string; pill: string };
    rule4: { title: string; desc: string; thumb: string; pill: string };
    rule5: { title: string; desc: string; thumb: string; pill: string };
  };
  pillars: {
    title: string;
    p1_title: string;
    p1_desc: string;
    p2_title: string;
    p2_desc: string;
    p3_title: string;
    p3_desc: string;
    p4_title: string;
    p4_desc: string;
    p5_title: string;
    p5_desc: string;
    p6_title: string;
    p6_desc: string;
  };
  anti: {
    heading: string;
    subheading: string;
    mistake: string;
    violation: string;
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
    verdict_discarded: string;
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
    surprise_btn: string;
    add_idea_btn: string;
    reset_defaults: string;
    why_tone: string;
    strengths: string;
    subject_line: string;
    message_text: string;
    rules_applied: string;
    target_audience: string;
    copy_template: string;
  };
}

/**
 * Creates the structured I18nCatalog dynamically from the parsed XLIFF units.
 * Guarantees that XLIFF is the single source of truth for the entire application.
 */
export function getTranslation(lang: Language): I18nCatalog {
  const tr = (key: string, fallback?: string) => t(key, lang, fallback);

  return {
    app: {
      title: tr('app.title', 'Amélie'),
      tagline: tr('app.tagline', 'Ideas that belong to someone else — after Amélie Poulain & the Kula Ring'),
      subtitle: tr('app.subtitle', 'Félix, Berlin · As of September 2026'),
      kula_french: tr('app.kula_french', '« Le Kula-Ring des Idées »'),
      kula_ring: tr('app.kula_ring', '✦ Kula Ring ✦'),
      cc0_stamp: tr('app.cc0_stamp', 'CC0 · 1974–2026'),
      par_avion: tr('app.par_avion', 'PAR AVION · XLIFF'),
    },
    nav: {
      tins: tr('nav.tins', 'The Tins'),
      normalJobs: tr('nav.normalJobs', 'Everyday Work'),
      unpacked: tr('nav.unpacked', 'Ideas Pipeline'),
      googleImport: tr('nav.googleImport', 'Google Import'),
      sandboxes: tr('nav.sandboxes', 'Simulators'),
      playbook: tr('nav.playbook', 'Prior Art Playbook'),
      matrix: tr('nav.matrix', 'Deliveries & Matrix'),
      manifest: tr('nav.manifest', 'Manifesto & Rules'),
      whimsy: tr('nav.whimsy', 'Funny & Better'),
      packer: tr('nav.packer', 'Pack a Tin'),
      discarded: tr('nav.discarded', 'Discarded Ideas'),
      githubPages: tr('nav.githubPages', 'GitHub Pages & Data'),
      musterEmails: tr('nav.musterEmails', 'Sample Emails'),
      more: tr('nav.more', 'More & Tools'),
      tools_archive: tr('nav.tools_archive', 'TOOLS & ARCHIVE'),
      tools_archive_desc: tr('nav.tools_archive_desc', 'Sample emails, search playbook, normal jobs & discarded ideas'),
      group: {
        concepts: tr('nav.group.concepts', 'Concepts & Explorations'),
        tools: tr('nav.group.tools', 'Tools & Workflows'),
        archive: tr('nav.group.archive', 'Templates & Archive'),
      },
      desc: {
        unpacked: tr('nav.desc.unpacked', 'Candidates & ideas before packaging'),
        sandboxes: tr('nav.desc.sandboxes', '{count} interactive simulators'),
        musterEmails: tr('nav.desc.musterEmails', '{count} emails following the Amélie philosophy'),
        normalJobs: tr('nav.desc.normalJobs', '{count} concepts for everyday professions'),
        whimsy: tr('nav.desc.whimsy', 'Whimsy & human warmth'),
        packer: tr('nav.desc.packer', 'Pack a new turn-key gift tin'),
        googleImport: tr('nav.desc.googleImport', 'Import ideas from Docs & Keep'),
        playbook: tr('nav.desc.playbook', 'Step 0.5: Prior art validation'),
        githubPages: tr('nav.desc.githubPages', 'GitHub Pages static data hub'),
        discarded: tr('nav.desc.discarded', 'Screened out & occupied ideas'),
      },
    },
    pledge: {
      title: tr('pledge.title', 'The Amélie Pledge (printed on every tin)'),
      text: tr('pledge.text', "This idea belongs to no one. Take it, build it, sell it — you owe me nothing, not even a reply."),
      copy: tr('pledge.copy', 'Copy pledge'),
      copied: tr('pledge.copied', 'Copied'),
    },
    manifest: {
      rule1: {
        title: tr('manifest.rule1.title', 'The delivery is the gift, not the find'),
        desc: tr('manifest.rule1.desc', 'Ideas are cheap. Everyone has thirty. The gift only starts when you research a specific team capable of building it, and deliver a turn-key package.'),
        thumb: tr('manifest.rule1.thumb', '1h discovery, 1h validation, 2h recipient research (the 1:2 budget ratio).'),
        pill: tr('manifest.rule1.pill', 'Delivery'),
      },
      rule2: {
        title: tr('manifest.rule2.title', 'Sign your name, demand nothing'),
        desc: tr('manifest.rule2.desc', 'Your name underneath, CC0 above it. No equity demands, no mandatory attribution, zero expectation of a response. The Kula ring thrives because the gift travels onward, not backward.'),
        thumb: tr('manifest.rule2.thumb', 'Explicitly grant permission not to reply.'),
        pill: tr('manifest.rule2.pill', 'Sign & CC0'),
      },
      rule3: {
        title: tr('manifest.rule3.title', 'The Phone Booth Rule (Strictly no follow-up)'),
        desc: tr('manifest.rule3.desc', 'Place the tin box in the phone booth and disappear. No follow-up emails, no "checking in", no LinkedIn requests. If you ask for feedback, it wasn\'t a gift — it was an unpaid pitch.'),
        thumb: tr('manifest.rule3.thumb', 'Send once. Then erase from your mental to-do list.'),
        pill: tr('manifest.rule3.pill', 'No Follow-up'),
      },
      rule4: {
        title: tr('manifest.rule4.title', "If they didn't ask, deliver tools, not homework"),
        desc: tr('manifest.rule4.desc', 'Unsolicited ideas without code belong only to entities with budgets and a mandate to build (companies, academic chairs, public funds). Never burden volunteer open source maintainers with feature requests; maintainers only receive ready-to-merge pull requests.'),
        thumb: tr('manifest.rule4.thumb', 'Never give volunteer maintainers unpaid homework.'),
        pill: tr('manifest.rule4.pill', 'Tools Only'),
      },
      rule5: {
        title: tr('manifest.rule5.title', "Don't make gifting an excuse not to build"),
        desc: tr('manifest.rule5.desc', 'Gifting ideas feels like building, but it isn\'t. Keep a maximum of two personal projects a year and finish them thoroughly. Gift everything else away so it doesn\'t rot.'),
        thumb: tr('manifest.rule5.thumb', 'Build max 2 personal projects. Gift the remaining 19.'),
        pill: tr('manifest.rule5.pill', 'Build Max 2'),
      },
    },
    pillars: {
      title: tr('pillar.title', 'The 6 Pillars of an Amélie Gift Email'),
      p1_title: tr('pillar.1.title', '1. Clear Gift Subject Line'),
      p1_desc: tr('pillar.1.desc', 'Explicitly marked as a free gift; zero sales hype, zero clickbait.'),
      p2_title: tr('pillar.2.title', '2. The 1:20 Ratio Relief'),
      p2_desc: tr('pillar.2.desc', 'Immediately clarifies who writes and why 19 out of 20 ideas are given away.'),
      p3_title: tr('pillar.3.title', '3. Proof of Sincere Research'),
      p3_desc: tr('pillar.3.desc', "Cites the recipient's recent paper or software tool (no blast spam)."),
      p4_title: tr('pillar.4.title', '4. The Tin Link & One-Pager'),
      p4_desc: tr('pillar.4.desc', '1 page with architecture, first milestone (Ticket #1), and critical failure point.'),
      p5_title: tr('pillar.5.title', '5. Unconditional CC0 Release'),
      p5_desc: tr('pillar.5.desc', 'Unconditionally public domain: take it, build it, sell it, zero royalties.'),
      p6_title: tr('pillar.6.title', '6. Strict Phone Booth Rule'),
      p6_desc: tr('pillar.6.desc', 'Explicit permission not to reply; promise never to follow up or nag.'),
    },
    anti: {
      heading: tr('anti.heading', 'The 3 Anti-Patterns (Forbidden by Amélie Philosophy)'),
      subheading: tr('anti.subheading', 'Committing these errors turns a selfless gift into an unwelcome burden or disguised sales pitch.'),
      mistake: tr('anti.mistake', 'Mistake'),
      violation: tr('anti.violation', 'Violates Rule'),
    },
    ui: {
      close: tr('ui.close', 'Close'),
      copy_email: tr('ui.copy_email', 'Copy email template'),
      email_copied: tr('ui.email_copied', 'Email copied!'),
      open_tin: tr('ui.open_tin', 'Open tin →'),
      recipient: tr('ui.recipient', 'Recipient:'),
      verdict_gift: tr('ui.verdict_gift', 'Gift'),
      verdict_build_first: tr('ui.verdict_build_first', 'Build first'),
      verdict_keep: tr('ui.verdict_keep', 'Keep'),
      verdict_discarded: tr('ui.verdict_discarded', 'Discarded'),
      footer_text: tr('ui.footer_text', 'All tins are dedicated to the public domain under CC0.'),
      footer_quote: tr('ui.footer_quote', '"The delivery is the gift, not the find."'),
      all_domains: tr('ui.all_domains', 'All Domains'),
      all_verdicts: tr('ui.all_verdicts', 'All Verdicts'),
      search_placeholder: tr('ui.search_placeholder', 'Search tins (title, problem, recipient, tags)...'),
      tins_heading: tr('ui.tins_heading', 'The Gifts: {count} Packed Tins'),
      tins_subheading: tr('ui.tins_subheading', 'Each tin is a one-page, ready-to-send dossier: the problem, why it is possible now, a sketch, Ticket #1, and the point where it breaks.'),
      tins_badge: tr('ui.tins_badge', '{count} turn-key dossiers ready to deliver · all CC0'),
      deliveries_heading: tr('ui.deliveries_heading', '{count} Ready-to-Send Gift Emails'),
      deliveries_subheading: tr('ui.deliveries_subheading', 'Each email goes to one researched recipient. The delivery is the gift, not the brainstorming. Send once and walk away.'),
      deliveries_badge: tr('ui.deliveries_badge', 'Q4 2026 Delivery Plan'),
      matrix_heading: tr('ui.matrix_heading', 'The Matrix: Idea → Recipient'),
      matrix_subheading: tr('ui.matrix_subheading', 'All {count} ideas mapped by recipient, channel, hook, and delivery status.'),
      discarded_heading: tr('ui.discarded_heading', '{count} Ideas Screened Out & Discarded'),
      discarded_subheading: tr('ui.discarded_subheading', 'A gift only has value when the space is genuinely open. These ideas were dropped during screening because they already exist or the market is saturated.'),
      packer_heading: tr('ui.packer_heading', 'Pack a New Tin'),
      packer_subheading: tr('ui.packer_subheading', 'Following the Amélie standard: frame the problem, locate the recipient, and draft Ticket #1 with a crisp definition of done.'),
      unpacked_heading: tr('ui.unpacked_heading', 'Candidate Pipeline: Ideas Not Yet Packed'),
      unpacked_subheading: tr('ui.unpacked_subheading', 'Every idea passes Step 0.5 (prior art verification). Unoccupied gaps from the protocol are queued for packaging.'),
      unpacked_badge: tr('ui.unpacked_badge', 'Search Protocol & Candidates'),
      unpacked_pack_btn: tr('ui.unpacked_pack_btn', 'Pack into Tin →'),
      lang_en: tr('ui.lang_en', 'English'),
      lang_de: tr('ui.lang_de', 'Deutsch'),
      lang_es: tr('ui.lang_es', 'Español'),
      surprise_btn: tr('ui.surprise_btn', '🎲 Spark Idea'),
      add_idea_btn: tr('ui.add_idea_btn', '+ Add Idea'),
      reset_defaults: tr('ui.reset_defaults', 'Reset to defaults'),
      why_tone: tr('ui.why_tone', 'Why this tone?'),
      strengths: tr('ui.strengths', 'Why this email works (Key Strengths)'),
      subject_line: tr('ui.subject_line', 'Subject line'),
      message_text: tr('ui.message_text', 'Message text'),
      rules_applied: tr('ui.rules_applied', 'Rules applied:'),
      target_audience: tr('ui.target_audience', 'Target:'),
      copy_template: tr('ui.copy_template', 'Copy Template'),
    },
    discarded: {
      badge: tr('discarded.badge', 'Negative Archive (_entsorgt.md)'),
      verdict: tr('discarded.verdict', 'Discarded'),
      original_idea: tr('discarded.original_idea', 'The Original Idea:'),
      why_discarded: tr('discarded.why_discarded', 'Why Discarded?'),
      evidence: tr('discarded.evidence', 'Prior Art Evidence:'),
      key_lesson: tr('discarded.key_lesson', 'The Key Lesson:'),
      philosophy_title: tr('discarded.philosophy_title', 'The Discipline of Discarding'),
      philosophy_desc: tr(
        'discarded.philosophy_desc',
        'Rule 1 states: ideas are cheap. Failing to verify the landscape and gifting concepts already trending on GitHub merely creates noise for recipients. The negative archive is living proof that the filter works.'
      ),
    },
  };
}
