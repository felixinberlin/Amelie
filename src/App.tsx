import React, { lazy, useState, useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import metadata from 'virtual:site-metadata';
import { parsePageRoute, legacyDestination, tabPath, simulatorPath } from './routing/routes';
import { RouteEffects } from './routing/RouteEffects';
import { PageBoundary } from './components/PageBoundary';
import { Header } from './components/Header';
const DosenGallery = lazy(() => import('./components/DosenGallery').then(m => ({ default: m.DosenGallery })));
const DoseModal = lazy(() => import('./components/DoseModal').then(m => ({ default: m.DoseModal })));
const DoseSinglePage = lazy(() => import('./components/DoseSinglePage').then(m => ({ default: m.DoseSinglePage })));
const MatrixView = lazy(() => import('./components/MatrixView').then(m => ({ default: m.MatrixView })));
const ManifestView = lazy(() => import('./components/ManifestView').then(m => ({ default: m.ManifestView })));
const DosePacker = lazy(() => import('./components/DosePacker').then(m => ({ default: m.DosePacker })));
const DiscardedGallery = lazy(() => import('./components/DiscardedGallery').then(m => ({ default: m.DiscardedGallery })));
const UnpackedIdeasView = lazy(() => import('./components/UnpackedIdeasView').then(m => ({ default: m.UnpackedIdeasView })));
const InteractiveTinSandboxes = lazy(() => import('./components/InteractiveTinSandboxes').then(m => ({ default: m.InteractiveTinSandboxes })));
const SearchPlaybookStudio = lazy(() => import('./components/SearchPlaybookStudio').then(m => ({ default: m.SearchPlaybookStudio })));
const GoogleAccountImporter = lazy(() => import('./components/GoogleAccountImporter').then(m => ({ default: m.GoogleAccountImporter })));
const NormalJobsExplorer = lazy(() => import('./components/NormalJobsExplorer').then(m => ({ default: m.NormalJobsExplorer })));
const WhimsyAndGoodnessView = lazy(() => import('./components/WhimsyAndGoodnessView').then(m => ({ default: m.WhimsyAndGoodnessView })));
const GitHubPagesDataHub = lazy(() => import('./components/GitHubPagesDataHub').then(m => ({ default: m.GitHubPagesDataHub })));
const MusterEmailsSection = lazy(() => import('./components/MusterEmailsSection').then(m => ({ default: m.MusterEmailsSection })));
const SelfAuditView = lazy(() => import('./components/SelfAuditView').then(m => ({ default: m.SelfAuditView })));
const FundingCompass = lazy(() => import('./components/FundingCompass').then(m => ({ default: m.FundingCompass })));
const GamesView = lazy(() => import('./components/GamesView').then(m => ({ default: m.GamesView })));
const RedditView = lazy(() => import('./components/RedditView').then(m => ({ default: m.RedditView })));
const SisterProjectsView = lazy(() => import('./components/SisterProjectsView').then(m => ({ default: m.SisterProjectsView })));
const QuellenView = lazy(() => import('./components/QuellenView').then(m => ({ default: m.QuellenView })));
const VectorCompareView = lazy(() => import('./components/VectorCompareView').then(m => ({ default: m.VectorCompareView })));
const VenturesTab = lazy(() => import('./components/VenturesTab').then(m => ({ default: m.VenturesTab })));
import { DoseItem, Language, CandidateIdea } from './types';
import { getTranslation } from './i18n';
import { getActiveDosen } from './services/doseStorage';
import { getDoseUrl } from './utils/doseUrl';
import { SimulatorKey, DOSE_SIMULATOR_MAP } from './data/doseSimulators';
import { Gift, FolderGit2 } from 'lucide-react';

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const route = parsePageRoute(location.pathname, location.search);
  const currentTab = route.tab;
  const activeSandbox = route.kind === 'simulator' ? route.simulator : 'altbau';
  const lang = (new URLSearchParams(location.search).get('lang')?.match(/^(de|en|es)$/)?.[0] ?? 'en') as Language;
  const navigateTo = (path: string, replace = false) => {
    const target = new URL(path, window.location.origin);
    const existing = new URLSearchParams(location.search);
    for (const key of ['lang', 'admin', 'mood']) {
      const value = existing.get(key);
      if (value !== null && !target.searchParams.has(key)) target.searchParams.set(key, value);
    }
    navigate(target.pathname + target.search + target.hash, { replace });
  };
  const setCurrentTab = (tab: string) => navigateTo(tabPath(tab));
  const setLang = (language: Language) => {
    const query = new URLSearchParams(location.search);
    query.set('lang', language);
    navigate({ pathname: location.pathname, search: '?' + query.toString(), hash: location.hash }, { replace: true });
  };
  const [selectedDose, setSelectedDose] = useState<DoseItem | null>(null);
  useEffect(() => { setSelectedDose(null); }, [location.pathname]);
  const [packerDraft, setPackerDraft] = useState<any>(null);
  const [importedCandidates, setImportedCandidates] = useState<CandidateIdea[]>([]);
  const [dosenList, setDosenList] = useState<DoseItem[]>(getActiveDosen);
  const [candidatesList, setCandidatesList] = useState<CandidateIdea[]>([]);
  const [candidateError, setCandidateError] = useState(false);

  const [selectedGalleryTag, setSelectedGalleryTag] = useState<string | null>(null);

  const requestedDose = route.kind === 'dose' ? route.doseId : null;
  const activeDosePage = requestedDose ? dosenList.find(d => d.id === requestedDose) ?? null : null;
  const missing = route.kind === 'not-found' || (route.kind === 'dose' && (!activeDosePage || (route.chapter && !metadata.chapters[route.doseId]?.includes(route.chapter)))) || (route.kind === 'venture' && !metadata.ventureIds.includes(route.ventureId));
  let localCandidateCount = 0;
  try {
    const records = JSON.parse(localStorage.getItem('amelie_custom_candidates') ?? '[]');
    if (Array.isArray(records)) localCandidateCount = new Set(records.filter(c => c?.id && !metadata.candidateIds.includes(c.id) && !c.packedDoseId).map(c => c.id)).size;
  } catch { /* Unavailable or invalid storage uses source counts. */ }
  const t = getTranslation(lang);

  const localQueryId = new URLSearchParams(location.search).get('dose');
  const isLocalQuery = location.pathname === '/dosen/' && localQueryId !== null && !metadata.doseIds.includes(localQueryId);
  let legacyTarget = isLocalQuery ? null : legacyDestination(location.search, location.hash);
  if (legacyTarget) {
    const target = new URL(legacyTarget, window.location.origin);
    const legacyRoute = parsePageRoute(target.pathname, target.search);
    if (legacyRoute.kind === 'dose' && !legacyRoute.chapter && !metadata.doseIds.includes(legacyRoute.doseId)) {
      target.searchParams.set('dose', legacyRoute.doseId);
      legacyTarget = '/dosen/' + target.search + target.hash;
    }
  }

  useEffect(() => {
    setCandidateError(false);
    if (!['compare', 'data-hub'].includes(currentTab)) return;
    let cancelled = false;
    import('./services/candidateStorage').then(m => { if (!cancelled) setCandidatesList(m.getActiveCandidates()); }).catch(() => { if (!cancelled) setCandidateError(true); });
    return () => { cancelled = true; };
  }, [currentTab]);

  const refreshData = () => {
    setDosenList(getActiveDosen());
    import('./services/candidateStorage').then(m => setCandidatesList(m.getActiveCandidates())).catch(() => setCandidateError(true));
  };

  const handleOpenSinglePage = (dose: DoseItem) => {
    const url = new URL(getDoseUrl(dose.id), window.location.origin);
    const base = import.meta.env.BASE_URL;
    navigateTo('/' + url.pathname.slice(base.length) + url.search);
    setSelectedDose(null);
  };

  const handleOpenSinglePageById = (doseId: string) => {
    const found = dosenList.find((d: DoseItem) => d.id === doseId);
    if (found) {
      handleOpenSinglePage(found);
    }
  };

  const handleCloseSinglePage = () => {
    setCurrentTab('dosen');
  };

  const handleSelectDoseById = (doseId: string) => {
    const found = dosenList.find((d: DoseItem) => d.id === doseId);
    if (found) {
      setSelectedDose(found);
    }
  };

  const handleAddToCandidates = async (newCand: CandidateIdea) => {
    try {
      const { saveCandidateLocal } = await import('./services/candidateStorage');
      saveCandidateLocal(newCand);
    } catch { setCandidateError(true); return; }
    import('./services/candidateStorage').then(m => setCandidatesList(m.getActiveCandidates())).catch(() => setCandidateError(true));
    setImportedCandidates((prev) => [newCand, ...prev]);
    setCurrentTab('unpacked');
  };

  const handleOpenSimulator = (simId: SimulatorKey) => {
    navigateTo(simulatorPath(simId));
  };

  const handleBisociationToPacker = (candidateData: Partial<CandidateIdea>) => {
    const isDe = lang === 'de';
    const isEs = lang === 'es';
    setPackerDraft({
      title: candidateData.title || '',
      oneLiner: (isDe ? candidateData.conceptDe : candidateData.conceptEn) || '',
      recipient: (isDe ? candidateData.recipientDe : candidateData.recipientEn) || '',
      verdict: 'gift',
      problem: (isDe ? candidateData.problemDe : candidateData.problemEn) || (isDe ? candidateData.conceptDe : candidateData.conceptEn) || '',
      whyNow: isDe
        ? '- Norm als PDF vorhanden, aber kein digitales Webtool\n- 0 Euro Serverkosten bei lokaler Berechnung\n- Unbesetzte Lücke vor kommerziellen Kopien'
        : isEs ? '- Existe la norma oficial en PDF, pero ninguna herramienta web\n- Cero coste de servidor gracias al cálculo local\n- Hueco libre antes de que lleguen las copias comerciales' : '- Official standard exists as PDF, no digital web tool\n- Zero server cost with local computation\n- Unoccupied gap ahead of commercial copycats',
      sketch: isDe
        ? `1. Erfassung der Parameter im Browser\n2. Deterministische Formelberechnung nach Norm\n3. Exportierbarer Prüfnachweis für ${candidateData.recipientDe || 'den Empfänger'}`
        : `1. Browser parameter input\n2. Deterministic formula calculation\n3. Exportable compliance sheet for ${candidateData.recipientEn || 'recipient'}`,
      ticketName: isDe ? 'Ticket #1: 3-Klick-Rechner' : isEs ? 'Ticket #1: calculadora de 3 clics' : 'Ticket #1: 3-click calculator',
      ticketCriteria: isDe ? 'Liefert verifizierte Kennzahl im Browser.' : isEs ? 'Devuelve una cifra verificada en el navegador.' : 'Outputs verified rating in client.',
      failureMode: isDe
        ? 'Bruchstelle: Fehlende personelle Kapazität beim Empfänger zur Integration.'
        : isEs ? 'Punto de ruptura: falta de personal en el destinatario para adoptar la herramienta.' : 'Failure point: Lack of staff capacity at recipient to adopt tool.',
      priorArt: (isDe ? candidateData.evidenceDe : candidateData.evidenceEn) || '',
    });
    setCurrentTab('packer');
  };

  const handlePackCandidate = (candidate: CandidateIdea) => {
    const isDe = lang === 'de';
    const isEs = lang === 'es';
    const whyList = isDe ? candidate.whyNowDe : candidate.whyNowEn;
    const whyFormatted = whyList && whyList.length > 0 ? whyList.map((w) => `- ${w}`).join('\n') : '';

    setPackerDraft({
      title: candidate.title,
      oneLiner: isDe ? candidate.conceptDe : candidate.conceptEn,
      recipient: isDe ? candidate.recipientDe : candidate.recipientEn,
      verdict: candidate.suggestedVerdict || 'gift',
      problem: (isDe ? candidate.problemDe : candidate.problemEn) || (isDe ? candidate.conceptDe : candidate.conceptEn),
      whyNow: whyFormatted,
      sketch: isDe
        ? `Architektur-Entwurf für ${candidate.title}:\n1. Daten-/Fotoeingabe über Web-Oberfläche\n2. Deterministische Berechnung oder lokales KI-Modell (datensparsam)\n3. Strukturierter Prüfbericht für den Empfänger (${candidate.recipientDe})`
        : `Architecture sketch for ${candidate.title}:\n1. Input capture via mobile/web UI\n2. Deterministic scoring or lightweight local inference\n3. Structured verification report for recipient (${candidate.recipientEn})`,
      ticketName: (isDe ? candidate.firstStepTicketDe : candidate.firstStepTicketEn) || (isDe ? 'Ticket #1: Minimaler Prototyp' : isEs ? 'Ticket #1: prototipo mínimo' : 'Ticket #1: Minimal Prototype'),
      ticketCriteria: (isDe ? candidate.firstStepCriteriaDe : candidate.firstStepCriteriaEn) || (isDe ? 'Lauffähig im Browser ohne Serverkosten.' : isEs ? 'Funciona en el navegador sin servidores.' : 'Functional in browser without servers.'),
      failureMode: isDe
        ? 'Bruchstelle: Wenn der Empfänger keine organisatorische Kapazität hat, den Prototyp in die eigene IT einzubinden.'
        : isEs ? 'Punto de ruptura: que la organización destinataria no tenga capacidad técnica para adoptar el prototipo.' : 'Failure point: If the recipient organization lacks technical bandwidth to adopt the prototype.',
      priorArt: (isDe ? candidate.evidenceDe : candidate.evidenceEn) || '',
    });

    setCurrentTab('packer');
  };

  if (legacyTarget) return <Navigate to={legacyTarget} replace />;
  if (!location.pathname.endsWith('/')) return <Navigate to={location.pathname + '/' + location.search + location.hash} replace />;

  return (
    <div className="min-h-screen bg-[var(--m-bg)] text-[var(--m-ink)] flex flex-col font-sans selection:bg-[var(--m-gold)]/40 selection:text-[var(--m-accent-strong)]">
      {/* Top Navigation */}
      <Header
        currentTab={currentTab}
        lang={lang}
        setLang={setLang}
        dosenCount={dosenList.length}
        unpackedCount={metadata.counts.unpacked + localCandidateCount}
        discardedCount={metadata.counts.discarded}
        mailsCount={metadata.counts.matrix}
      />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="outline-none flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <PageBoundary resetKey={location.pathname + location.search}>
        {candidateError ? <section role="alert"><p>Ideas could not load.</p><button className="underline" onClick={() => window.location.reload()}>Reload and retry</button></section> : missing ? <section><h1 className="text-2xl">Page not found</h1><p>The requested page is unavailable.</p><Link to="/dosen/" className="underline">Browse gifts</Link></section> : activeDosePage ? (
          <DoseSinglePage
            key={activeDosePage.id}
            dose={activeDosePage}
            allDosen={dosenList}
            lang={lang}
            onBack={handleCloseSinglePage}
            onOpenPopup={(d) => setSelectedDose(d)}
            onSelectDoseById={handleOpenSinglePageById}
            onOpenSimulatorTab={(simId) => {
              handleOpenSimulator(simId);
            }}
            onOpenEmailsTab={() => {
              setCurrentTab('muster-emails');
            }}
            onSelectTag={(tag) => {
              setSelectedGalleryTag(tag);
              setCurrentTab('dosen');
            }}
          />
        ) : (
          <>
            {currentTab === 'dosen' && (
              <DosenGallery
                dosen={dosenList}
                lang={lang}
                onSelectDose={setSelectedDose}
                onOpenSinglePage={handleOpenSinglePage}
                onOpenSimulator={handleOpenSimulator}
                initialSelectedTag={selectedGalleryTag}
                onSelectTag={setSelectedGalleryTag}
                onOpenManifest={() => {
                  setCurrentTab('manifest');
                }}
                onOpenEmails={() => {
                  setCurrentTab('muster-emails');
                }}
              />
            )}

            {currentTab === 'normal-jobs' && (
              <NormalJobsExplorer
                lang={lang}
                onOpenDose={handleOpenSinglePageById}
              />
            )}

            {currentTab === 'whimsy' && (
              <WhimsyAndGoodnessView
                lang={lang}
                onOpenGames={() => {
                  setCurrentTab('games');
                }}
              />
            )}

            {currentTab === 'games' && (
              <GamesView
                lang={lang}
                dosen={dosenList}
                onOpenDose={handleOpenSinglePageById}
              />
            )}

            {currentTab === 'compare' && (
              <VectorCompareView
                lang={lang}
                dosen={dosenList}
                candidates={candidatesList}
                onOpenDose={handleOpenSinglePageById}
              />
            )}

            {currentTab === 'unpacked' && (
              <UnpackedIdeasView
                lang={lang}
                onPackIdea={handlePackCandidate}
                externalCandidates={importedCandidates}
              />
            )}

            {currentTab === 'data-hub' && (
              <GitHubPagesDataHub
                lang={lang}
                dosen={dosenList}
                candidates={candidatesList}
                onDataChanged={refreshData}
              />
            )}

            {currentTab === 'audit' && (
              <SelfAuditView lang={lang} />
            )}

            {currentTab === 'google-import' && (
              <GoogleAccountImporter
                lang={lang}
                onPackIdea={(draft) => {
                  setPackerDraft(draft);
                  setCurrentTab('packer');
                }}
                onAddToCandidates={handleAddToCandidates}
              />
            )}

            {currentTab === 'sandboxes' && (
              <InteractiveTinSandboxes
                lang={lang}
                initialSandbox={activeSandbox}
                onOpenDose={handleOpenSinglePageById}
              />
            )}

            {currentTab === 'playbook' && (
              <SearchPlaybookStudio
                lang={lang}
                onSendToPipeline={handleBisociationToPacker}
                onNavigateToDose={(doseId) => handleSelectDoseById(doseId)}
              />
            )}

            {currentTab === 'matrix' && (
              <MatrixView
                dosen={dosenList}
                lang={lang}
                onSelectDoseById={handleSelectDoseById}
                onOpenSinglePageById={handleOpenSinglePageById}
                onSwitchToUnpacked={() => setCurrentTab('unpacked')}
              />
            )}

            {currentTab === 'muster-emails' && (
              <MusterEmailsSection
                lang={lang}
                dosen={dosenList}
                onOpenSinglePage={handleOpenSinglePage}
                onOpenModal={(dose) => setSelectedDose(dose)}
              />
            )}

            {currentTab === 'funding' && <FundingCompass lang={lang} />}

            {currentTab === 'ventures' && <VenturesTab lang={lang} />}

            {currentTab === 'quellen' && <QuellenView lang={lang} />}

            {currentTab === 'relatives' && <SisterProjectsView lang={lang} />}

            {currentTab === 'reddit' && <RedditView lang={lang} />}

            {currentTab === 'manifest' && (
              <ManifestView
                lang={lang}
                onOpenEmails={() => {
                  setCurrentTab('muster-emails');
                }}
              />
            )}

            {currentTab === 'packer' && (
              <DosePacker lang={lang} initialData={packerDraft} />
            )}

            {currentTab === 'discarded' && (
              <DiscardedGallery
                lang={lang}
              />
            )}
          </>
        )}
        <RouteEffects missing={Boolean(missing)} title={route.kind === 'dose' && !route.chapter ? activeDosePage?.title : undefined} />
        </PageBoundary>
      </main>

      {/* Modal for viewing active Dose */}
      {selectedDose && (
        <PageBoundary resetKey={selectedDose.id}><DoseModal
          dose={selectedDose}
          lang={lang}
          onClose={() => setSelectedDose(null)}
          onOpenSinglePage={handleOpenSinglePage}
          onOpenSimulator={(simId) => {
            setSelectedDose(null);
            handleOpenSimulator(simId);
          }}
          onSelectTag={(tag) => {
            setSelectedDose(null);
            setSelectedGalleryTag(tag);
            setCurrentTab('dosen');
          }}
        /></PageBoundary>
      )}

      {/* Footer */}
      <footer className="border-t border-[var(--m-line)] bg-gradient-to-b from-[var(--m-bg-2)] to-[var(--m-sunk)] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--m-ink-2)]">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-[var(--m-accent)]/10 text-[var(--m-accent)]">
                <Gift className="w-4 h-4" />
              </span>
              <span className="font-amelie font-bold text-sm text-[var(--m-ink)]">
                Amélie Poulain · Kula-Ring
              </span>
              <span className="text-[var(--m-muted)]">✦</span>
              <span>{t.ui.footer_text}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[var(--m-ink-2)] font-typewriter">
              <button
                onClick={() => {
                  setCurrentTab('data-hub');
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[var(--m-line)] hover:border-[var(--m-accent)] text-[var(--m-ink)] text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-[var(--m-green-2)]" />
                <span>GitHub Pages (JSON & Markdown)</span>
              </button>
              <span className="hidden sm:inline text-[var(--m-muted)]">·</span>
              <span className="italic font-amelie text-xs text-[var(--m-ink-2)]">« {t.ui.footer_quote} »</span>
              <span className="hidden sm:inline text-[var(--m-muted)]">·</span>
              <span className="text-[var(--m-accent)] font-bold">Félix (Berlin), 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
