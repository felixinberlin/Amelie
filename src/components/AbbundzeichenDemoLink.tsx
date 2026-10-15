import { ExternalLink } from 'lucide-react';

export function AbbundzeichenDemoLink({ lang }: { lang: string }) {
  const isDe = lang === 'de';
  const demoLang = isDe ? 'de' : 'en';

  return (
    <section className="rounded-2xl border-2 border-[var(--m-copper)]/60 bg-[var(--m-surface)] p-5 sm:p-6 space-y-3 print:hidden">
      <h2 className="text-xl font-bold font-amelie text-[var(--m-ink)]">
        {isDe ? 'Abbundzeichen: Offline-Zählfolgenprüfer' : 'Carpenter marks: offline sequence checker'}
      </h2>
      <p className="text-sm leading-relaxed text-[var(--m-muted)]">
        {isDe
          ? 'Zählfolgen mit einem getesteten, deterministischen Regelkern prüfen. Die Demo verwendet synthetische Beispiele; die Validierung an historischen Belegen ist noch in Arbeit.'
          : 'Check sequences with a tested deterministic rule engine. The demo uses synthetic examples; validation against historical records is still in progress.'}
      </p>
      <a
        href={`${import.meta.env.BASE_URL}abbundzeichen-fundbuch/index.html?lang=${demoLang}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-[var(--m-copper)] px-4 py-3 font-bold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--m-copper)]"
      >
        {isDe ? 'Demo öffnen (neuer Tab)' : 'Open demo (new tab)'}
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
    </section>
  );
}
