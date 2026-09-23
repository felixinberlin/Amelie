import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DosenGallery } from './components/DosenGallery';
import { DoseModal } from './components/DoseModal';
import { DoseSinglePage } from './components/DoseSinglePage';
import { MatrixView } from './components/MatrixView';
import { ManifestView } from './components/ManifestView';
import { DosePacker } from './components/DosePacker';
import { DiscardedGallery } from './components/DiscardedGallery';
import { UnpackedIdeasView } from './components/UnpackedIdeasView';
import { InteractiveTinSandboxes } from './components/InteractiveTinSandboxes';
import { SearchPlaybookStudio } from './components/SearchPlaybookStudio';
import { GoogleAccountImporter } from './components/GoogleAccountImporter';
import { NormalJobsExplorer } from './components/NormalJobsExplorer';
import { WhimsyAndGoodnessView } from './components/WhimsyAndGoodnessView';
import { GitHubPagesDataHub } from './components/GitHubPagesDataHub';
import { MusterEmailsSection } from './components/MusterEmailsSection';
import { DOSEN_DATA, DISCARDED_DATA } from './data/dosen';
import { MATRIX_DATA } from './data/matrix';
import { DELIVERIES_DATA } from './data/deliveries';
import { CANDIDATE_IDEAS_DATA } from './data/unpacked';
import { DoseItem, Language, CandidateIdea } from './types';
import { getTranslation } from './i18n';
import { getActiveDosen, getActiveCandidates, saveCandidateLocal } from './services/storageService';
import { parseDoseIdFromUrl, parseSimulatorFromUrl, setDoseUrl, clearDoseUrl } from './utils/doseUrl';
import { SimulatorKey, DOSE_SIMULATOR_MAP } from './data/doseSimulators';
import { Gift, FolderGit2 } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (parseSimulatorFromUrl()) return 'sandboxes';
    return 'dosen';
  });
  const [activeSandbox, setActiveSandbox] = useState<SimulatorKey>(() => {
    const rawSim = parseSimulatorFromUrl();
    if (rawSim) {
      if (rawSim in DOSE_SIMULATOR_MAP) {
        return DOSE_SIMULATOR_MAP[rawSim].key;
      }
      return (rawSim as SimulatorKey) || 'altbau';
    }
    return 'altbau';
  });
  const [lang, setLang] = useState<Language>('en');
  const [selectedDose, setSelectedDose] = useState<DoseItem | null>(null);
  const [packerDraft, setPackerDraft] = useState<any>(null);
  const [importedCandidates, setImportedCandidates] = useState<CandidateIdea[]>([]);
  const [dosenList, setDosenList] = useState<DoseItem[]>(getActiveDosen);
  const [candidatesList, setCandidatesList] = useState<CandidateIdea[]>(getActiveCandidates);

  // Direct URL-based Dose Single Page
  const [activeDosePage, setActiveDosePage] = useState<DoseItem | null>(() => {
    const initialId = parseDoseIdFromUrl();
    if (initialId) {
      const list = getActiveDosen();
      return list.find((d: DoseItem) => d.id === initialId) || null;
    }
    return null;
  });

  const t = getTranslation(lang);

  // Listen to hash and popstate for direct link handling
  useEffect(() => {
    const handleUrlChange = () => {
      const doseId = parseDoseIdFromUrl();
      if (doseId) {
        const found = dosenList.find((d: DoseItem) => d.id === doseId);
        if (found) {
          setActiveDosePage(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      
      const rawSim = parseSimulatorFromUrl();
      if (rawSim) {
        let simKey: SimulatorKey = 'glasanflug';
        if (rawSim in DOSE_SIMULATOR_MAP) {
          simKey = DOSE_SIMULATOR_MAP[rawSim].key;
        } else {
          simKey = rawSim as SimulatorKey;
        }
        setActiveSandbox(simKey);
        setCurrentTab('sandboxes');
        setActiveDosePage(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setActiveDosePage(null);
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [dosenList]);

  const refreshData = () => {
    setDosenList(getActiveDosen());
    setCandidatesList(getActiveCandidates());
  };

  const handleOpenSinglePage = (dose: DoseItem) => {
    setDoseUrl(dose.id);
    setActiveDosePage(dose);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSinglePageById = (doseId: string) => {
    const found = dosenList.find((d: DoseItem) => d.id === doseId);
    if (found) {
      handleOpenSinglePage(found);
    }
  };

  const handleCloseSinglePage = () => {
    clearDoseUrl();
    setActiveDosePage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectDoseById = (doseId: string) => {
    const found = dosenList.find((d: DoseItem) => d.id === doseId);
    if (found) {
      setSelectedDose(found);
    }
  };

  const handleAddToCandidates = (newCand: CandidateIdea) => {
    saveCandidateLocal(newCand);
    setCandidatesList(getActiveCandidates());
    setImportedCandidates((prev) => [newCand, ...prev]);
    setCurrentTab('unpacked');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSimulator = (simId: SimulatorKey) => {
    setActiveSandbox(simId);
    setCurrentTab('sandboxes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fbf7f0] text-[#2b1e16] flex flex-col font-sans selection:bg-[#f6bd60]/40 selection:text-[#701531]">
      {/* Top Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (activeDosePage) {
            clearDoseUrl();
            setActiveDosePage(null);
          }
          setCurrentTab(tab);
        }}
        lang={lang}
        setLang={setLang}
        dosenCount={dosenList.length}
        unpackedCount={candidatesList.length + importedCandidates.length}
        discardedCount={DISCARDED_DATA.length}
        mailsCount={DELIVERIES_DATA.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {activeDosePage ? (
          <DoseSinglePage
            dose={activeDosePage}
            allDosen={dosenList}
            lang={lang}
            onBack={handleCloseSinglePage}
            onOpenPopup={(d) => setSelectedDose(d)}
            onSelectDoseById={handleOpenSinglePageById}
            onOpenSimulatorTab={(simId) => {
              handleCloseSinglePage();
              handleOpenSimulator(simId);
            }}
            onOpenEmailsTab={() => {
              handleCloseSinglePage();
              setCurrentTab('muster-emails');
              window.scrollTo({ top: 0, behavior: 'smooth' });
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
                onOpenManifest={() => {
                  setCurrentTab('manifest');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenEmails={() => {
                  setCurrentTab('muster-emails');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentTab === 'normal-jobs' && (
              <NormalJobsExplorer
                lang={lang}
              />
            )}

            {currentTab === 'whimsy' && (
              <WhimsyAndGoodnessView
                lang={lang}
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

            {currentTab === 'google-import' && (
              <GoogleAccountImporter
                lang={lang}
                onPackIdea={(draft) => {
                  setPackerDraft(draft);
                  setCurrentTab('packer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onAddToCandidates={handleAddToCandidates}
              />
            )}

            {currentTab === 'sandboxes' && (
              <InteractiveTinSandboxes
                lang={lang}
                initialSandbox={activeSandbox}
                onOpenDose={(doseId) => handleSelectDoseById(doseId)}
              />
            )}

            {currentTab === 'playbook' && (
              <SearchPlaybookStudio
                lang={lang}
                onSendToPipeline={handleBisociationToPacker}
              />
            )}

            {currentTab === 'matrix' && (
              <MatrixView
                matrix={MATRIX_DATA}
                deliveries={DELIVERIES_DATA}
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

            {currentTab === 'manifest' && (
              <ManifestView
                lang={lang}
                onOpenEmails={() => {
                  setCurrentTab('muster-emails');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentTab === 'packer' && (
              <DosePacker lang={lang} initialData={packerDraft} />
            )}

            {currentTab === 'discarded' && (
              <DiscardedGallery
                discarded={DISCARDED_DATA}
                lang={lang}
              />
            )}
          </>
        )}
      </main>

      {/* Modal for viewing active Dose */}
      {selectedDose && (
        <DoseModal
          dose={selectedDose}
          lang={lang}
          onClose={() => setSelectedDose(null)}
          onOpenSinglePage={handleOpenSinglePage}
          onOpenSimulator={(simId) => {
            setSelectedDose(null);
            handleOpenSimulator(simId);
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[#dfd1be] bg-gradient-to-b from-[#f8f1e5] to-[#f0e3ce] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#5c4a3d]">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-full bg-[#8c1d40]/10 text-[#8c1d40]">
                <Gift className="w-4 h-4" />
              </span>
              <span className="font-amelie font-bold text-sm text-[#2b1e16]">
                Amélie Poulain · Kula-Ring
              </span>
              <span className="text-[#8b6f57]">✦</span>
              <span>{t.ui.footer_text}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[#5c4a3d] font-typewriter">
              <button
                onClick={() => {
                  setCurrentTab('data-hub');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#dfd1be] hover:border-[#8c1d40] text-[#2b1e16] text-[11px] font-semibold transition-colors cursor-pointer"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-[#2e7d32]" />
                <span>GitHub Pages (JSON & Markdown)</span>
              </button>
              <span className="hidden sm:inline text-[#8b6f57]">·</span>
              <span className="italic font-amelie text-xs text-[#4a3b2c]">« {t.ui.footer_quote} »</span>
              <span className="hidden sm:inline text-[#8b6f57]">·</span>
              <span className="text-[#8c1d40] font-bold">Félix (Berlin), 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
