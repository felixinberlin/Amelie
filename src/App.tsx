import React, { useState } from 'react';
import { Header } from './components/Header';
import { DosenGallery } from './components/DosenGallery';
import { DoseModal } from './components/DoseModal';
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
import { DOSEN_DATA, DISCARDED_DATA } from './data/dosen';
import { MATRIX_DATA } from './data/matrix';
import { DELIVERIES_DATA } from './data/deliveries';
import { CANDIDATE_IDEAS_DATA } from './data/unpacked';
import { DoseItem, Language, CandidateIdea } from './types';
import { getTranslation } from './i18n';
import { Gift } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dosen');
  const [activeSandbox, setActiveSandbox] = useState<'altbau' | 'glasanflug' | 'streiflicht' | 'wetink' | 'balkon' | 'regenwasser' | 'klarlokal' | 'crackflora'>('altbau');
  const [lang, setLang] = useState<Language>('en');
  const [selectedDose, setSelectedDose] = useState<DoseItem | null>(null);
  const [packerDraft, setPackerDraft] = useState<any>(null);
  const [importedCandidates, setImportedCandidates] = useState<CandidateIdea[]>([]);
  const t = getTranslation(lang);

  const handleSelectDoseById = (doseId: string) => {
    const found = DOSEN_DATA.find((d: DoseItem) => d.id === doseId);
    if (found) {
      setSelectedDose(found);
    }
  };

  const handleAddToCandidates = (newCand: CandidateIdea) => {
    setImportedCandidates((prev) => [newCand, ...prev]);
    setCurrentTab('unpacked');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSimulator = (simId: 'altbau' | 'glasanflug' | 'streiflicht' | 'wetink' | 'balkon' | 'regenwasser' | 'klarlokal' | 'crackflora') => {
    setActiveSandbox(simId);
    setCurrentTab('sandboxes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBisociationToPacker = (candidateData: Partial<CandidateIdea>) => {
    const isDe = lang === 'de';
    setPackerDraft({
      title: candidateData.title || '',
      oneLiner: (isDe ? candidateData.conceptDe : candidateData.conceptEn) || '',
      recipient: (isDe ? candidateData.recipientDe : candidateData.recipientEn) || '',
      verdict: 'gift',
      problem: (isDe ? candidateData.problemDe : candidateData.problemEn) || (isDe ? candidateData.conceptDe : candidateData.conceptEn) || '',
      whyNow: isDe
        ? '- Norm als PDF vorhanden, aber kein digitales Webtool\n- 0 Euro Serverkosten bei lokaler Berechnung\n- Unbesetzte Lücke vor kommerziellen Kopien'
        : '- Official standard exists as PDF, no digital web tool\n- Zero server cost with local computation\n- Unoccupied gap ahead of commercial copycats',
      sketch: isDe
        ? `1. Erfassung der Parameter im Browser\n2. Deterministische Formelberechnung nach Norm\n3. Exportierbarer Prüfnachweis für ${candidateData.recipientDe || 'den Empfänger'}`
        : `1. Browser parameter input\n2. Deterministic formula calculation\n3. Exportable compliance sheet for ${candidateData.recipientEn || 'recipient'}`,
      ticketName: isDe ? 'Ticket #1: 3-Klick-Rechner' : 'Ticket #1: 3-click calculator',
      ticketCriteria: isDe ? 'Liefert verifizierte Kennzahl im Browser.' : 'Outputs verified rating in client.',
      failureMode: isDe
        ? 'Bruchstelle: Fehlende personelle Kapazität beim Empfänger zur Integration.'
        : 'Failure point: Lack of staff capacity at recipient to adopt tool.',
      priorArt: (isDe ? candidateData.evidenceDe : candidateData.evidenceEn) || '',
    });
    setCurrentTab('packer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePackCandidate = (candidate: CandidateIdea) => {
    const isDe = lang === 'de';
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
      ticketName: (isDe ? candidate.firstStepTicketDe : candidate.firstStepTicketEn) || (isDe ? 'Ticket #1: Minimaler Prototyp' : 'Ticket #1: Minimal Prototype'),
      ticketCriteria: (isDe ? candidate.firstStepCriteriaDe : candidate.firstStepCriteriaEn) || (isDe ? 'Lauffähig im Browser ohne Serverkosten.' : 'Functional in browser without servers.'),
      failureMode: isDe
        ? 'Bruchstelle: Wenn der Empfänger keine organisatorische Kapazität hat, den Prototyp in die eigene IT einzubinden.'
        : 'Failure point: If the recipient organization lacks technical bandwidth to adopt the prototype.',
      priorArt: (isDe ? candidate.evidenceDe : candidate.evidenceEn) || '',
    });

    setCurrentTab('packer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Top Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        dosenCount={DOSEN_DATA.length}
        unpackedCount={CANDIDATE_IDEAS_DATA.length + importedCandidates.length}
        discardedCount={DISCARDED_DATA.length}
        mailsCount={DELIVERIES_DATA.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {currentTab === 'dosen' && (
          <DosenGallery
            dosen={DOSEN_DATA}
            lang={lang}
            onSelectDose={setSelectedDose}
            onOpenSimulator={handleOpenSimulator}
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
            dosen={DOSEN_DATA}
            lang={lang}
            onSelectDoseById={handleSelectDoseById}
            onSwitchToUnpacked={() => setCurrentTab('unpacked')}
          />
        )}

        {currentTab === 'manifest' && (
          <ManifestView lang={lang} />
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
      </main>

      {/* Modal for viewing active Dose */}
      {selectedDose && (
        <DoseModal
          dose={selectedDose}
          lang={lang}
          onClose={() => setSelectedDose(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-[#fbf9f4] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-800" />
              <span className="font-serif-title font-semibold text-stone-800">
                Amélie · Berlin
              </span>
              <span>—</span>
              <span>{t.ui.footer_text}</span>
            </div>

            <div className="flex items-center gap-4 text-stone-600">
              <span>{t.ui.footer_quote}</span>
              <span className="hidden sm:inline">·</span>
              <span className="font-mono-code">Félix (Berlin), 2026</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
