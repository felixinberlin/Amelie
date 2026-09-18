import React, { useState } from 'react';
import { Compass, Sparkles, Copy, Check, CheckCircle2, ShieldCheck, MapPin, BookOpen, HeartHandshake, Award, Shield, FileCheck } from 'lucide-react';
import { MANIFEST_RULES, AMELIE_LOOP_STEPS, AMELIE_PLEDGE, TERRITORY_ATLAS } from '../data/manifest';
import { Language } from '../types';
import { getTranslation } from '../i18n';

interface ManifestViewProps {
  lang: Language;
}

export const ManifestView: React.FC<ManifestViewProps> = ({ lang }) => {
  const [copiedPledge, setCopiedPledge] = useState(false);
  const [pillarRecipient, setPillarRecipient] = useState(true);
  const [pillarTax, setPillarTax] = useState(true);
  const [pillarPrivacy, setPillarPrivacy] = useState(true);
  const [pillarDisappear, setPillarDisappear] = useState(true);
  const [copiedCharter, setCopiedCharter] = useState(false);
  const t = getTranslation(lang);

  const copyPledge = () => {
    navigator.clipboard.writeText(AMELIE_PLEDGE[lang]);
    setCopiedPledge(true);
    setTimeout(() => setCopiedPledge(false), 2000);
  };

  const score = [pillarRecipient, pillarTax, pillarPrivacy, pillarDisappear].filter(Boolean).length;

  const charterText = lang === 'de'
    ? `### Schenkungsurkunde (Amélie-Gabe)\n\nDieses Werkzeug wurde ohne kommerzielles Interesse entwickelt und bedingungslos übergeben.\n\n1. **Zweck:** Entwickelt als freies Gut zur Entlastung des Empfängers.\n2. **Datenschutz:** Funktioniert lokal ohne Accounts, Cookies oder Tracker.\n3. **Freiheit:** CC0 1.0 Universal / Public Domain. Sie dürfen es frei nutzen, verändern, forken oder weitergeben.\n4. **Verzicht:** Der Urheber verlangt weder Vergütung noch Namensnennung.\n\n*"Die Gabe geht weiter, nicht zurück."*`
    : lang === 'es'
    ? `### Carta de Donación Incondicional (Principio Amélie)\n\nEsta herramienta fue desarrollada sin interés comercial y entregada incondicionalmente.\n\n1. **Propósito:** Creada como bien libre para empoderar al destinatario.\n2. **Privacidad:** Funciona localmente sin cuentas ni rastreadores.\n3. **Licencia:** CC0 1.0 Universal / Dominio Público.\n4. **Desprendimiento:** No se exige compensación ni crédito.\n\n*"El regalo avanza en círculo, nunca hacia atrás."*`
    : `### Unconditional Gift Charter (Amélie Principle)\n\nThis tool was engineered with zero commercial extraction intent and handed over unconditionally.\n\n1. **Purpose:** Built as a public good to erase cognitive burden for the recipient.\n2. **Privacy:** Executes on-device with zero forced accounts, cookies, or telemetry.\n3. **License:** CC0 1.0 Universal / Public Domain. Run, modify, fork, or redistribute freely.\n4. **Renunciation:** The creator claims neither equity nor demands gratitude.\n\n*"The gift travels onward, not backward."*`;

  const copyCharter = () => {
    navigator.clipboard.writeText(charterText);
    setCopiedCharter(true);
    setTimeout(() => setCopiedCharter(false), 2500);
  };

  const getRuleData = (ruleNum: number) => {
    if (ruleNum === 1) return t.manifest.rule1;
    if (ruleNum === 2) return t.manifest.rule2;
    if (ruleNum === 3) return t.manifest.rule3;
    if (ruleNum === 4) return t.manifest.rule4;
    return t.manifest.rule5;
  };

  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Editorial Hero */}
      <div className="rounded-2xl bg-amber-900/5 border border-amber-800/20 p-6 md:p-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-amber-800" />
          <span>{lang === 'de' ? 'Das Amélie-Manifest' : lang === 'es' ? 'El Manifiesto Amélie' : 'The Amélie Manifesto'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif-title text-stone-900 tracking-tight leading-tight">
          {lang === 'de' ? 'Ideen, die jemand anderem gehören.' : lang === 'es' ? 'Ideas que pertenecen a alguien más.' : 'Ideas that belong to someone else.'}
        </h2>
        <div className="prose prose-stone text-stone-700 text-base sm:text-lg leading-relaxed font-serif-title space-y-3">
          <p>
            {lang === 'de'
              ? 'Ein Verfahren, um App-Ideen, die man selbst nicht bauen wird, an die Leute zuzustellen, die sie bauen können.'
              : lang === 'es'
              ? 'Un método para entregar ideas de software que tú no construirás a las personas que sí pueden construirlas.'
              : 'A method for delivering app ideas you won\'t build yourself to the people who can.'}
          </p>
          <p className="text-sm sm:text-base text-stone-600 font-sans italic bg-white/70 p-4 rounded-xl border border-stone-200">
            {lang === 'de'
              ? 'Benannt nach Amélie Poulain: Sie findet eine alte Blechdose hinter einer Fliese, recherchiert vierzig Jahre später den Jungen, dem sie gehörte, legt sie ihm in eine Telefonzelle und verschwindet. Sie sucht sich die Person aus, bevor sie das Geschenk macht, und fragt hinterher nie nach.'
              : lang === 'es'
              ? 'Inspirado en Amélie Poulain: encuentra una vieja lata detrás de un azulejo, rastrea cuarenta años después al niño al que pertenecía, se la deja en una cabina telefónica y desaparece. Elige al destinatario antes de hacer el regalo y nunca pregunta después.'
              : 'Named after Amélie Poulain: she finds a tin box behind a bathroom tile, tracks down the boy it belonged to forty years later, leaves it in a phone booth, and disappears. She chooses the recipient before making the gift, and never follows up.'}
          </p>
        </div>
      </div>

      {/* The Pledge Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-stone-900 text-white border border-amber-900/40 relative shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono-code uppercase font-bold tracking-widest text-amber-400">
              {t.pledge.title}
            </span>
          </div>
          <button
            onClick={copyPledge}
            className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-white px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors"
          >
            {copiedPledge ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{t.pledge.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.pledge.copy}</span>
              </>
            )}
          </button>
        </div>
        <blockquote className="text-lg sm:text-xl font-serif-title italic text-amber-50 leading-relaxed border-l-2 border-amber-500 pl-4 py-1">
          "{AMELIE_PLEDGE[lang]}"
        </blockquote>
        <p className="text-xs text-stone-400 mt-4">
          {lang === 'de'
            ? 'Das ist der Kula-Ring in drei Sätzen: Die Gabe geht weiter, nicht zurück.'
            : lang === 'es'
            ? 'Ese es el anillo Kula en tres frases: el regalo avanza en círculo, nunca hacia atrás.'
            : 'That is the Kula ring in three sentences: the gift travels onward, not backward.'}
        </p>
      </div>

      {/* The 5 Rules */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono-code uppercase tracking-wider text-amber-800 font-bold">
            {lang === 'de' ? 'Grundprinzipien' : lang === 'es' ? 'Principios Fundamentales' : 'Core Principles'}
          </span>
          <h3 className="text-2xl font-bold font-serif-title text-stone-900">
            {lang === 'de' ? 'Die fünf Regeln' : lang === 'es' ? 'Las Cinco Reglas' : 'The Five Rules'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MANIFEST_RULES.map((rule) => {
            const localizedRule = getRuleData(rule.number);
            return (
              <div
                key={rule.number}
                className={`p-6 rounded-2xl border bg-[#fdfbf7] flex flex-col justify-between transition-shadow hover:shadow-md ${
                  rule.number === 1 ? 'md:col-span-2 border-amber-800/40 bg-amber-50/20' : 'border-stone-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-stone-900 text-amber-300 font-mono-code text-xs font-bold flex items-center justify-center shrink-0">
                      {rule.number}
                    </span>
                    <h4 className="text-base font-bold font-serif-title text-stone-900">
                      {localizedRule.title}
                    </h4>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed pl-10">
                    {localizedRule.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60 pl-10">
                  <span className="text-xs font-mono-code text-amber-900 font-semibold block">
                    {lang === 'de' ? 'Faustformel: ' : lang === 'es' ? 'Regla práctica: ' : 'Rule of Thumb: '}
                    <span className="font-normal italic">
                      {localizedRule.thumb}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Gifting Compass */}
      <section className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#fdfbf7] via-amber-50/40 to-stone-50 border border-amber-800/30 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-amber-900 font-bold mb-1">
              <HeartHandshake className="w-4 h-4 text-amber-800" />
              <span>{lang === 'de' ? 'Gütekompass für Ideengeber' : lang === 'es' ? 'Brújula del Don Desinteresado' : 'Gift Purity Compass'}</span>
            </div>
            <h3 className="text-2xl font-bold font-serif-title text-stone-900">
              {lang === 'de' ? 'Die 4 Säulen der reinen Gabe' : 'The 4 Pillars of Unconditional Software Gifting'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              {lang === 'de'
                ? 'Ist deine Idee ein selbstloses Werkzeug oder ein verkleidetes SaaS-Startup?'
                : 'Is your idea a genuine gift of empowerment, or a disguised SaaS startup?'}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-stone-200 shadow-2xs self-start md:self-auto">
            <Award className={`w-6 h-6 ${score === 4 ? 'text-amber-600 animate-pulse' : score >= 2 ? 'text-amber-500' : 'text-stone-400'}`} />
            <div>
              <div className="text-2xs font-mono-code uppercase text-stone-500">{lang === 'de' ? 'Amélie-Gütegrad' : 'Gift Purity Score'}</div>
              <div className="text-lg font-bold font-serif-title text-stone-900">
                {score} / 4 {score === 4 ? (lang === 'de' ? '· Reines Geschenk' : '· Pure Gift') : score >= 3 ? (lang === 'de' ? '· Stark' : '· Solid') : (lang === 'de' ? '· Kommerziell' : '· Commercial')}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Interactive Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            pillarRecipient ? 'bg-white border-amber-800/40 shadow-xs' : 'bg-stone-50/60 border-stone-200 text-stone-500'
          }`}>
            <input
              type="checkbox"
              checked={pillarRecipient}
              onChange={(e) => setPillarRecipient(e.target.checked)}
              className="mt-1 rounded text-amber-700 focus:ring-amber-600"
            />
            <div className="space-y-1">
              <span className="font-bold text-sm text-stone-900 block font-serif-title">
                {lang === 'de' ? '1. Ein konkreter Mensch aus Fleisch & Blut' : '1. A Specific, Living Human Being'}
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Kein abstraktes "B2B-Unternehmen", sondern eine reale Berufsgruppe: Die Krankenschwester, der Hobby-Imker, die Mieterin im Altbau.'
                  : 'Not an abstract "B2B user", but an actual craftsperson: night-shift nurses, hobby beekeepers, tenants in drafty flats.'}
              </p>
            </div>
          </label>

          <label className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            pillarTax ? 'bg-white border-amber-800/40 shadow-xs' : 'bg-stone-50/60 border-stone-200 text-stone-500'
          }`}>
            <input
              type="checkbox"
              checked={pillarTax}
              onChange={(e) => setPillarTax(e.target.checked)}
              className="mt-1 rounded text-amber-700 focus:ring-amber-600"
            />
            <div className="space-y-1">
              <span className="font-bold text-sm text-stone-900 block font-serif-title">
                {lang === 'de' ? '2. Tilgt eine unsichtbare kognitive Steuer' : '2. Erases an Invisible Cognitive Tax'}
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Befreit den Nutzer von einer nagenden Angst, bürokratischem Kleingedrucktem oder manueller Zeitverschwendung.'
                  : 'Liberates the user from nagging anxiety, confusing regulatory fine print, or tedious manual drudgery.'}
              </p>
            </div>
          </label>

          <label className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            pillarPrivacy ? 'bg-white border-amber-800/40 shadow-xs' : 'bg-stone-50/60 border-stone-200 text-stone-500'
          }`}>
            <input
              type="checkbox"
              checked={pillarPrivacy}
              onChange={(e) => setPillarPrivacy(e.target.checked)}
              className="mt-1 rounded text-amber-700 focus:ring-amber-600"
            />
            <div className="space-y-1">
              <span className="font-bold text-sm text-stone-900 block font-serif-title">
                {lang === 'de' ? '3. Radikale Autonomie & Null Datensammlung' : '3. Radical Local Autonomy & Zero Surveillance'}
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Läuft im Browser ohne Login, ohne Cookies, ohne Cloud-Abo. Nach dem Laden funktioniert es auch im Funkloch.'
                  : 'Runs on-device without logins, cookies, or subscriptions. Continues working offline inside a cellular dead zone.'}
              </p>
            </div>
          </label>

          <label className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            pillarDisappear ? 'bg-white border-amber-800/40 shadow-xs' : 'bg-stone-50/60 border-stone-200 text-stone-500'
          }`}>
            <input
              type="checkbox"
              checked={pillarDisappear}
              onChange={(e) => setPillarDisappear(e.target.checked)}
              className="mt-1 rounded text-amber-700 focus:ring-amber-600"
            />
            <div className="space-y-1">
              <span className="font-bold text-sm text-stone-900 block font-serif-title">
                {lang === 'de' ? '4. Das Telefonzellen-Prinzip (Loslassen)' : '4. The Phone Booth Principle (Letting Go)'}
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                {lang === 'de'
                  ? 'Du legst die Dose in die Telefonzelle, verschwindest und verlangst weder Anteile, noch Applaus, noch Gegenleistung.'
                  : 'You place the tin in the telephone booth, walk away, and demand zero equity, zero applause, and zero payback.'}
              </p>
            </div>
          </label>
        </div>

        {/* Output & Charter */}
        <div className="p-4 rounded-xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FileCheck className="w-5 h-5 text-amber-800 shrink-0" />
            <span className="text-xs text-stone-700 font-medium">
              {lang === 'de'
                ? 'Möchtest du eine standardisierte Schenkungsurkunde (CC0) in deine Dose oder dein GitHub-Repo legen?'
                : 'Attach an unconditional CC0 Gift Charter to your prototype or packaging letter?'}
            </span>
          </div>

          <button
            onClick={copyCharter}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-semibold transition-colors shrink-0 shadow-2xs"
          >
            {copiedCharter ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>{lang === 'de' ? 'Urkunde kopiert!' : 'Charter Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-200" />
                <span>{lang === 'de' ? 'Schenkungsurkunde kopieren' : 'Copy Gift Charter'}</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* The Amélie Loop */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono-code uppercase tracking-wider text-amber-800 font-bold">
            {lang === 'de' ? 'Die Praxis' : lang === 'es' ? 'La Práctica Operativa' : 'The Operational Practice'}
          </span>
          <h3 className="text-2xl font-bold font-serif-title text-stone-900">
            {lang === 'de' ? 'Der Amélie-Loop in 6 Schritten' : lang === 'es' ? 'El Bucle Amélie en 6 Pasos' : 'The Amélie Loop in 6 Steps'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {lang === 'de'
              ? 'Ein strikter Rhythmus verhindert das Verheddern in endloser Vorbereitung.'
              : lang === 'es'
              ? 'Un ritmo disciplinado que evita perderse en preparativos interminables.'
              : 'A strict cadence preventing getting trapped in endless preliminary tinkering.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AMELIE_LOOP_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-5 rounded-xl border border-stone-200 bg-[#fdfbf7] flex flex-col justify-between shadow-2xs hover:border-amber-800/30 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono-code font-bold text-amber-800">
                    {lang === 'de' ? `Schritt ${step.step}` : lang === 'es' ? `Paso ${step.step}` : `Step ${step.step}`}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-mono-code">
                    {lang === 'de' ? step.budgetDe : step.budgetEn}
                  </span>
                </div>
                <h4 className="text-base font-bold font-serif-title text-stone-900">
                  {lang === 'de' ? step.nameDe : step.nameEn}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {lang === 'de' ? step.actionDe : step.actionEn}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-emerald-950 bg-emerald-50/50 p-2 rounded-lg">
                <span className="font-bold block">
                  {lang === 'de' ? 'Ausstiegskriterium:' : lang === 'es' ? 'Criterio de salida:' : 'Exit Criterion:'}
                </span>
                <span className="text-emerald-900">
                  {lang === 'de' ? step.exitCriterionDe : step.exitCriterionEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Territory Atlas: Occupied vs. Open */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono-code uppercase tracking-wider text-amber-800 font-bold">
            {lang === 'de' ? 'Die Bilanz' : lang === 'es' ? 'El Atlas de Territorio' : 'The Territory Atlas'}
          </span>
          <h3 className="text-2xl font-bold font-serif-title text-stone-900">
            {lang === 'de' ? 'Wo es frei ist und wo besetzt' : lang === 'es' ? 'Dónde está libre y dónde ocupado' : 'Where It Is Vacant vs. Occupied'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {lang === 'de'
              ? 'Die wertvollste Lehre aus 19 geprüften Ideen: Wo lohnen sich Geschenke wirklich?'
              : lang === 'es'
              ? 'La lección más valiosa tras auditar 19 ideas: ¿Dónde aportan verdadero valor los regalos?'
              : 'The most valuable insight from 19 audited ideas: Where do software gifts truly matter?'}
          </p>
        </div>

        <div className="bg-[#fdfbf7] rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-stone-200">
            {TERRITORY_ATLAS.map((item, idx) => {
              const isOpen = idx === 3;
              return (
                <div
                  key={idx}
                  className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isOpen ? 'bg-amber-100/30' : ''
                  }`}
                >
                  <div className="space-y-1 max-w-xl">
                    <span className="text-xs font-mono-code text-stone-500 uppercase tracking-wider">
                      {lang === 'de' ? `Sektor 0${idx + 1}` : lang === 'es' ? `Sector 0${idx + 1}` : `Sector 0${idx + 1}`}
                    </span>
                    <h4 className="text-base font-bold font-serif-title text-stone-900">
                      {lang === 'de' ? item.sectorDe : item.sectorEn}
                    </h4>
                    <p className="text-xs text-stone-600">
                      {lang === 'de' ? item.lessonDe : item.lessonEn}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-mono-code font-bold uppercase whitespace-nowrap self-start md:self-auto ${
                      isOpen
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 ring-2 ring-emerald-500/20'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {lang === 'de' ? item.statusDe : item.statusEn}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 font-serif-title leading-relaxed">
          {lang === 'de'
            ? 'Frei ist genau das, womit sich kein Geld verdienen lässt und wofür keine Entwicklerszene existiert. Das ist keine Einschränkung des Modells, sondern sein Anwendungsbereich — und ausgerechnet der, in dem Geschenke am meisten bewirken.'
            : lang === 'es'
            ? 'Lo que está libre es exactamente aquello de lo que nadie puede extraer dinero y para lo cual no existe un ecosistema comercial de desarrolladores. Esa no es una limitación del modelo: es su verdadero propósito y donde los regalos tienen mayor impacto.'
            : 'What remains open is precisely what nobody can extract money from and for which no developer ecosystem exists. That is not a limitation of the model — it is its primary domain, and of all places, the one where gifts accomplish the most good.'}
        </div>
      </section>

      {/* Historical & Cultural Movements */}
      <section className="space-y-4 pt-6 border-t border-stone-200">
        <div className="flex items-center gap-2 text-stone-600 text-xs font-mono-code uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-amber-800" />
          <span>{lang === 'de' ? 'Kulturelle Wurzeln' : lang === 'es' ? 'Raíces Culturales' : 'Cultural Roots'}</span>
        </div>
        <h3 className="text-xl font-bold font-serif-title text-stone-900">
          {lang === 'de' ? 'Die Bewegungen dahinter' : lang === 'es' ? 'Los Movimientos que lo Inspiran' : 'The Movements Behind It'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
          {lang === 'de'
            ? 'Amélie knüpft an uralte Geschenk- und Reziprozitätsökonomien an: den Kula-Ring der Trobriand-Inseln (wo Gaben im Kreis wandern), den Potlatch der pazifischen Nordwestküste (Schenken als Status des Loslassens), Bhoodan in Indien (Landschenkung an Landlose), Freie Software (Copyleft & CC0), Repair Cafés, sowie Dāna im Buddhismus und Sadaqah jariyah im Islam (fortwirkende Wohltat).'
            : lang === 'es'
            ? 'Amélie se conecta con economías ancestrales del don y reciprocidad: el Anillo Kula de las islas Trobriand (donde los dones circulan sin volver al origen), el Potlatch del noroeste del Pacífico (el prestigio del desprendimiento), Bhoodan en la India (donación de tierras), Software Libre (Copyleft y CC0), Repair Cafés, así como Dāna en el budismo y Sadaqah jariyah en el islam.'
            : 'Amélie draws upon timeless gift economies: the Trobriand Kula Ring (gifts circulating continuously), Pacific Northwest Potlatch (prestige in giving away), Bhoodan in India (land gift movement), Free Software (Copyleft & CC0), Repair Cafés, Dāna in Buddhism, and Sadaqah jariyah in Islam (enduring, continuous gift).'}
        </p>
      </section>
    </div>
  );
};
