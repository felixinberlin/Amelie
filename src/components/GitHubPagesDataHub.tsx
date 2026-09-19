import React, { useState } from 'react';
import {
  FileCode,
  FileText,
  Download,
  Copy,
  Check,
  Upload,
  RefreshCw,
  GitBranch,
  Globe,
  Database,
  Flame,
  ShieldCheck,
  HardDrive,
  Info,
  ExternalLink,
  Code2,
  FolderGit2,
  BookOpen,
  Users,
  Compass,
  Shield,
  FileCheck
} from 'lucide-react';
import { DoseItem, CandidateIdea, Language, StorageProvider } from '../types';
import {
  getStorageProvider,
  setStorageProvider,
  exportDatabaseAsJson,
  exportDoseAsMarkdown,
  downloadFile,
  importDatabaseFromJson,
  resetLocalDatabase
} from '../services/storageService';

interface GitHubPagesDataHubProps {
  lang: Language;
  dosen: DoseItem[];
  candidates: CandidateIdea[];
  onDataChanged?: () => void;
}

export const GitHubPagesDataHub: React.FC<GitHubPagesDataHubProps> = ({
  lang,
  dosen,
  candidates,
  onDataChanged,
}) => {
  const isDe = lang === 'de';
  const [activeProvider, setActiveProviderState] = useState<StorageProvider>(getStorageProvider());
  const [activeFormatTab, setActiveFormatTab] = useState<'json' | 'markdown' | 'guide' | 'docs'>('json');
  const [selectedDoseId, setSelectedDoseId] = useState<string>(dosen[0]?.id || '');
  const [copiedState, setCopiedState] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const selectedDose = dosen.find((d) => d.id === selectedDoseId) || dosen[0];

  const jsonContent = exportDatabaseAsJson(dosen, candidates);
  const markdownContent = selectedDose ? exportDoseAsMarkdown(selectedDose, isDe ? 'de' : 'en') : '';

  const handleProviderSwitch = (newProvider: StorageProvider) => {
    setStorageProvider(newProvider);
    setActiveProviderState(newProvider);
    if (onDataChanged) onDataChanged();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(id);
    setTimeout(() => setCopiedState(null), 2500);
  };

  const handleDownloadJson = () => {
    downloadFile('amelie-ideas.json', jsonContent, 'application/json');
  };

  const handleDownloadMarkdown = () => {
    if (!selectedDose) return;
    const filename = `${selectedDose.id}.md`;
    downloadFile(filename, markdownContent, 'text/markdown');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const result = importDatabaseFromJson(text);
        setImportStatus(
          isDe
            ? `✓ Erfolgreich importiert: ${result.importedDosen} Dosen, ${result.importedCandidates} unverpackte Ideen.`
            : `✓ Successfully imported: ${result.importedDosen} tins, ${result.importedCandidates} unpacked ideas.`
        );
        if (onDataChanged) onDataChanged();
        setTimeout(() => setImportStatus(null), 4000);
      } catch (err: any) {
        setImportStatus(isDe ? `Fehler beim Importieren: ${err.message}` : `Import error: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      window.confirm(
        isDe
          ? 'Möchtest du die lokalen Änderungen auf den Standard-Datensatz zurücksetzen?'
          : 'Reset all local edits back to repository default dataset?'
      )
    ) {
      resetLocalDatabase();
      if (onDataChanged) onDataChanged();
      setImportStatus(isDe ? 'Standard-Daten wiederhergestellt.' : 'Repository defaults restored.');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editorial Header */}
      <div className="border border-[#dfd1be] bg-gradient-to-br from-[#fffdf9] to-[#fbf6ee] rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#f6bd60]/10 pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-typewriter font-semibold bg-[#8c1d40]/10 text-[#8c1d40] border border-[#8c1d40]/20">
                {isDe ? 'GitHub Pages & Statische Persistenz' : 'GitHub Pages & Static Persistence'}
              </span>
              <span className="text-xs font-typewriter text-[#8b6f57]">· CC0 / Public Domain</span>
            </div>
            <h1 className="font-amelie text-2xl sm:text-3xl font-bold text-[#2b1e16] tracking-tight">
              {isDe ? 'Ideen-Datenbank & GitHub Pages Export' : 'Ideas Database & GitHub Pages Export'}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#5c4a3d] max-w-3xl leading-relaxed">
              {isDe
                ? 'Volle Unabhängigkeit von Cloud-Datenbanken. Die Ideen liegen als sauberes, strukturiertes JSON und Markdown mit Frontmatter vor — 100 % statisch lauffähig auf GitHub Pages ohne Serverkosten oder API-Schlüssel.'
                : 'Zero vendor lock-in. All ideas are structured as clean JSON and Markdown with YAML frontmatter — 100% static, running natively on GitHub Pages with zero server fees or API keys.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8c1d40] hover:bg-[#741533] text-white font-medium text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#f6bd60]" />
              <span>{isDe ? 'amelie-ideas.json laden' : 'Download amelie-ideas.json'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Storage Architecture Selector: GitHub Pages vs Firebase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option A: GitHub Pages / Local-First */}
        <div
          onClick={() => handleProviderSwitch('github_pages')}
          className={`border rounded-2xl p-5 cursor-pointer transition-all ${
            activeProvider === 'github_pages'
              ? 'bg-[#fffefb] border-[#8c1d40] ring-2 ring-[#8c1d40]/20 shadow-xs'
              : 'bg-[#fbf7f0]/60 border-[#dfd1be] hover:bg-[#fffefb]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2e7d32]/10 text-[#2e7d32] border border-[#2e7d32]/20 flex items-center justify-center">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-amelie font-bold text-base text-[#2b1e16]">
                    {isDe ? 'GitHub Pages (Statisch / Local-First)' : 'GitHub Pages (Static / Local-First)'}
                  </h3>
                  {activeProvider === 'github_pages' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-typewriter font-semibold bg-[#2e7d32]/10 text-[#2e7d32] border border-[#2e7d32]/20">
                      {isDe ? 'AKTIV' : 'ACTIVE'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5c4a3d] mt-0.5">
                  {isDe ? 'Keine Datenbank nötig · 0 € Kosten · Git-Versioniert' : 'No database needed · $0 cost · Git versioned'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#dfd1be]/60 text-xs text-[#5c4a3d] space-y-1.5 font-sans">
            <div className="flex items-center gap-2 text-[#2b1e16]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>{isDe ? '100 % privat im Browser (LocalStorage & Static JSON)' : '100% private in browser (LocalStorage & Static JSON)'}</span>
            </div>
            <div className="flex items-center gap-2 text-[#2b1e16]">
              <Globe className="w-3.5 h-3.5 text-[#2e7d32]" />
              <span>{isDe ? 'Publizierbar via GitHub Pages mit einer einzigen Actions-Datei' : 'Deployable to GitHub Pages with one simple workflow'}</span>
            </div>
          </div>
        </div>

        {/* Option B: Firebase Cloud Sync (Optional) */}
        <div
          onClick={() => handleProviderSwitch('firebase')}
          className={`border rounded-2xl p-5 cursor-pointer transition-all ${
            activeProvider === 'firebase'
              ? 'bg-[#fffefb] border-[#8c1d40] ring-2 ring-[#8c1d40]/20 shadow-xs'
              : 'bg-[#fbf7f0]/60 border-[#dfd1be] hover:bg-[#fffefb]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e65100]/10 text-[#e65100] border border-[#e65100]/20 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-amelie font-bold text-base text-[#2b1e16]">
                    {isDe ? 'Firebase / Google Sync (Optional)' : 'Firebase / Google Sync (Optional)'}
                  </h3>
                  {activeProvider === 'firebase' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-typewriter font-semibold bg-[#e65100]/10 text-[#e65100] border border-[#e65100]/20">
                      {isDe ? 'AKTIV' : 'ACTIVE'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#5c4a3d] mt-0.5">
                  {isDe ? 'Cloud Auth & Firestore Anbindung' : 'Cloud Auth & Firestore connection'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#dfd1be]/60 text-xs text-[#5c4a3d] space-y-1.5 font-sans">
            <div className="flex items-center gap-2 text-[#2b1e16]">
              <HardDrive className="w-3.5 h-3.5 text-[#e65100]" />
              <span>{isDe ? 'Bleibt erhalten: Google Drive Import & Firebase Auth funktionieren' : 'Preserved: Google Drive Import & Firebase Auth remain functional'}</span>
            </div>
            <div className="flex items-center gap-2 text-[#2b1e16]">
              <Database className="w-3.5 h-3.5 text-[#e65100]" />
              <span>{isDe ? 'Konfiguration via VITE_FIREBASE_* oder lokales firebase-applet-config.json' : 'Configured via VITE_FIREBASE_* or optional firebase-applet-config.json'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Format Explorer: JSON vs Markdown vs GitHub Guide */}
      <div className="border border-[#dfd1be] bg-[#fffefb] rounded-2xl overflow-hidden shadow-xs">
        <div className="border-b border-[#dfd1be] bg-[#fbf6ee] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFormatTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFormatTab === 'json'
                  ? 'bg-[#8c1d40] text-white'
                  : 'bg-white text-[#5c4a3d] border border-[#dfd1be] hover:bg-[#f6ebd9]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{isDe ? 'JSON-Format (amelie-ideas.json)' : 'JSON Format (amelie-ideas.json)'}</span>
            </button>

            <button
              onClick={() => setActiveFormatTab('markdown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFormatTab === 'markdown'
                  ? 'bg-[#8c1d40] text-white'
                  : 'bg-white text-[#5c4a3d] border border-[#dfd1be] hover:bg-[#f6ebd9]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isDe ? 'Markdown-Dossier (.md mit Frontmatter)' : 'Markdown Dossier (.md with Frontmatter)'}</span>
            </button>

            <button
              onClick={() => setActiveFormatTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFormatTab === 'guide'
                  ? 'bg-[#8c1d40] text-white'
                  : 'bg-white text-[#5c4a3d] border border-[#dfd1be] hover:bg-[#f6ebd9]'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>{isDe ? 'GitHub Pages Anleitung' : 'GitHub Pages Guide'}</span>
            </button>

            <button
              onClick={() => setActiveFormatTab('docs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFormatTab === 'docs'
                  ? 'bg-[#8c1d40] text-white'
                  : 'bg-white text-[#5c4a3d] border border-[#dfd1be] hover:bg-[#f6ebd9]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isDe ? 'Docs & Mitmachen' : 'Docs & Contributors'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-typewriter text-[#8b6f57]">
            <span>{dosen.length} {isDe ? 'Dosen' : 'Tins'}</span>
            <span>·</span>
            <span>{candidates.length} {isDe ? 'Kandidaten' : 'Candidates'}</span>
          </div>
        </div>

        {/* Tab 1: JSON Format */}
        {activeFormatTab === 'json' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5c4a3d]">
              <div>
                <p className="font-semibold text-[#2b1e16]">
                  {isDe ? 'Strukturiertes Datenformat für public/data/amelie-ideas.json' : 'Structured data format for public/data/amelie-ideas.json'}
                </p>
                <p className="text-[11px] text-[#8b6f57] font-typewriter">
                  {isDe
                    ? 'Kann direkt von statischen Pages oder API-Routen gefetcht werden. CC0 lizenziert.'
                    : 'Can be fetched directly by static pages or static site generators. CC0 licensed.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(jsonContent, 'json')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#dfd1be] hover:bg-[#fbf6ee] text-[#2b1e16] text-xs font-typewriter transition-colors cursor-pointer"
                >
                  {copiedState === 'json' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2e7d32]" />
                      <span className="text-[#2e7d32]">{isDe ? 'Kopiert!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isDe ? 'JSON Kopieren' : 'Copy JSON'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8c1d40] text-white hover:bg-[#741533] text-xs font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#f6bd60]" />
                  <span>{isDe ? 'Herunterladen' : 'Download'}</span>
                </button>
              </div>
            </div>

            <div className="relative rounded-xl border border-[#dfd1be] bg-[#2b1e16] text-[#fff9f5] p-4 max-h-96 overflow-y-auto font-mono text-xs shadow-inner">
              <pre className="whitespace-pre">{jsonContent}</pre>
            </div>
          </div>
        )}

        {/* Tab 2: Markdown Format */}
        {activeFormatTab === 'markdown' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5c4a3d]">
              <div className="flex items-center gap-2">
                <label htmlFor="dose-select" className="font-semibold text-[#2b1e16]">
                  {isDe ? 'Dose wählen:' : 'Select Tin:'}
                </label>
                <select
                  id="dose-select"
                  value={selectedDoseId}
                  onChange={(e) => setSelectedDoseId(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#dfd1be] text-xs text-[#2b1e16] font-medium"
                >
                  {dosen.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(markdownContent, 'md')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#dfd1be] hover:bg-[#fbf6ee] text-[#2b1e16] text-xs font-typewriter transition-colors cursor-pointer"
                >
                  {copiedState === 'md' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#2e7d32]" />
                      <span className="text-[#2e7d32]">{isDe ? 'Kopiert!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isDe ? 'Markdown Kopieren' : 'Copy Markdown'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8c1d40] text-white hover:bg-[#741533] text-xs font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#f6bd60]" />
                  <span>{isDe ? `${selectedDose?.id}.md laden` : `Download ${selectedDose?.id}.md`}</span>
                </button>
              </div>
            </div>

            <div className="relative rounded-xl border border-[#dfd1be] bg-[#fbf7f0] text-[#2b1e16] p-4 max-h-96 overflow-y-auto font-mono text-xs shadow-inner">
              <pre className="whitespace-pre-wrap">{markdownContent}</pre>
            </div>
          </div>
        )}

        {/* Tab 3: GitHub Pages Publishing Guide */}
        {activeFormatTab === 'guide' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="font-amelie font-bold text-lg text-[#2b1e16]">
                {isDe ? 'In 3 Schritten auf GitHub Pages veröffentlichen' : 'Deploy to GitHub Pages in 3 Simple Steps'}
              </h3>
              <p className="text-xs text-[#5c4a3d] leading-relaxed">
                {isDe
                  ? 'Das Projekt ist bereits mit relativen Asset-Pfaden (base: "./") konfiguriert und enthält eine fertige GitHub Actions Workflow-Datei (.github/workflows/deploy.yml).'
                  : 'The repository is already configured with relative asset URLs (base: "./") and includes an automated GitHub Actions deployment workflow (.github/workflows/deploy.yml).'}
              </p>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-[#fbf6ee] border border-[#dfd1be] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#8c1d40] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-[#2b1e16]">
                    {isDe ? 'Repository auf GitHub pushen' : 'Push Repository to GitHub'}
                  </h4>
                  <p className="text-xs text-[#5c4a3d]">
                    {isDe
                      ? 'Committe die Änderungen inklusive der Workflow-Datei und pushe auf den main-Branch.'
                      : 'Commit your project changes including .github/workflows/deploy.yml and push to main.'}
                  </p>
                  <div className="mt-2 bg-[#2b1e16] text-[#f6bd60] p-2.5 rounded-lg font-mono text-[11px] flex items-center justify-between">
                    <code>git add . && git commit -m "Publish to GitHub Pages" && git push origin main</code>
                    <button
                      onClick={() => handleCopy('git add . && git commit -m "Publish to GitHub Pages" && git push origin main', 'git')}
                      className="text-white hover:text-[#f6bd60] ml-2"
                    >
                      {copiedState === 'git' ? <Check className="w-3.5 h-3.5 text-[#2e7d32]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-[#fbf6ee] border border-[#dfd1be] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#8c1d40] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-[#2b1e16]">
                    {isDe ? 'GitHub Pages Quell-Einstellung aktivieren' : 'Enable GitHub Pages Source'}
                  </h4>
                  <p className="text-xs text-[#5c4a3d]">
                    {isDe
                      ? 'Gehe auf GitHub in dein Repo → Settings → Pages → Build and deployment → Source auf "GitHub Actions" stellen.'
                      : 'Navigate in your repo to Settings → Pages → Build and deployment → select "GitHub Actions" as the Source.'}
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-[#fbf6ee] border border-[#dfd1be] flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#8c1d40] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-xs text-[#2b1e16]">
                    {isDe ? 'Fertig! URL öffnen' : 'Done! Open your Live App'}
                  </h4>
                  <p className="text-xs text-[#5c4a3d]">
                    {isDe
                      ? 'GitHub Actions baut das Projekt automatisch und publiziert es unter https://<dein-nutzername>.github.io/<repo-name>/.'
                      : 'GitHub Actions automatically compiles and deploys the app to https://<username>.github.io/<repo>/.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Contributors & Project Growth Documentation */}
        {activeFormatTab === 'docs' && (
          <div className="p-4 sm:p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="font-amelie font-bold text-lg text-[#2b1e16]">
                {isDe ? 'Projekt-Dokumentation & Leitfäden für Mitwirkende' : 'Project Documentation & Contributor Guides'}
              </h3>
              <p className="text-xs text-[#5c4a3d] leading-relaxed">
                {isDe
                  ? 'Amélie wächst als Kula-Ring für unkommerzielle Software-Ideen. Hier findest du alle Richtlinien, Triage-Protokolle, die Projekt-Roadmap und Entwickler-Dokumentationen im Repository.'
                  : 'Amélie is growing as a public-domain Kula-Ring for civic and open-source software ideas. Explore our contribution standards, triage protocols, roadmap, and developer architecture.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Doc 1: CONTRIBUTING.md */}
              <div className="p-4 rounded-xl border border-[#dfd1be] bg-[#fbf6ee] flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#8c1d40]/10 text-[#8c1d40] border border-[#8c1d40]/20">
                      <Users className="w-4 h-4" />
                    </span>
                    <h4 className="font-amelie font-bold text-sm text-[#2b1e16]">CONTRIBUTING.md</h4>
                  </div>
                  <p className="text-xs text-[#5c4a3d] leading-normal">
                    {isDe
                      ? 'Wie man eine Dose nach dem 7-teiligen Standard packt, Kandidaten prüft, Empfänger recherchiert und XLIFF-Übersetzungen pflegt.'
                      : 'How to pack a tin with the mandatory 7 sections, research prior art, match recipients, and maintain XLIFF translations.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#dfd1be]/60 text-[11px] font-typewriter">
                  <span className="text-[#8b6f57]">Standard: 1:2 Budgetregel</span>
                  <button
                    onClick={() => handleCopy('git clone https://github.com/felixinberlin/amelie.git && cat CONTRIBUTING.md', 'c-doc')}
                    className="inline-flex items-center gap-1 text-[#8c1d40] hover:text-[#741533] font-semibold cursor-pointer"
                  >
                    {copiedState === 'c-doc' ? <Check className="w-3.5 h-3.5 text-[#2e7d32]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isDe ? 'Befehl kopieren' : 'Copy command'}</span>
                  </button>
                </div>
              </div>

              {/* Doc 2: ROADMAP.md */}
              <div className="p-4 rounded-xl border border-[#dfd1be] bg-[#fbf6ee] flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#2e7d32]/10 text-[#2e7d32] border border-[#2e7d32]/20">
                      <Compass className="w-4 h-4" />
                    </span>
                    <h4 className="font-amelie font-bold text-sm text-[#2b1e16]">ROADMAP.md</h4>
                  </div>
                  <p className="text-xs text-[#5c4a3d] leading-normal">
                    {isDe
                      ? 'Strategische Phasen 2026–2028: Föderierte Feeds, automatisierte TDCommons/Zenodo DOI-Publikation, Förderungs-Matching (Prototype Fund/NLnet) und Amélie CLI.'
                      : 'Strategic phases 2026–2028: Federated feeds, automated TDCommons/Zenodo DOI defensive publication, grant matching (Prototype Fund/NLnet), and Amélie CLI.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#dfd1be]/60 text-[11px] font-typewriter">
                  <span className="text-[#8b6f57]">Phasen 1–5</span>
                  <span className="text-[#2e7d32] font-semibold">2026–2028</span>
                </div>
              </div>

              {/* Doc 3: GOVERNANCE.md */}
              <div className="p-4 rounded-xl border border-[#dfd1be] bg-[#fbf6ee] flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#f6bd60]/20 text-[#8c1d40] border border-[#f6bd60]/30">
                      <FileCheck className="w-4 h-4" />
                    </span>
                    <h4 className="font-amelie font-bold text-sm text-[#2b1e16]">GOVERNANCE.md</h4>
                  </div>
                  <p className="text-xs text-[#5c4a3d] leading-normal">
                    {isDe
                      ? 'Das Amélie-Triage-Protokoll: Warum Entsorgen ein voller Erfolg ist, wie das Kuratorium arbeitet und wie der Schutz vor Patent-Trolls gewährleistet wird.'
                      : 'The Amélie Triage Protocol: why discarding is celebrated as a victory, how curators evaluate ideas, and how public domain protection is guaranteed.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#dfd1be]/60 text-[11px] font-typewriter">
                  <span className="text-[#8b6f57]">Triage: Gift / Build / Discard</span>
                  <span className="text-[#8c1d40] font-semibold">CC0 Konsens</span>
                </div>
              </div>

              {/* Doc 4: ARCHITECTURE.md */}
              <div className="p-4 rounded-xl border border-[#dfd1be] bg-[#fbf6ee] flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#2e7d32]/10 text-[#2e7d32] border border-[#2e7d32]/20">
                      <Code2 className="w-4 h-4" />
                    </span>
                    <h4 className="font-amelie font-bold text-sm text-[#2b1e16]">ARCHITECTURE.md</h4>
                  </div>
                  <p className="text-xs text-[#5c4a3d] leading-normal">
                    {isDe
                      ? 'Entwickler-Guide: Statische Auslieferung auf GitHub Pages, Local-First Persistenzmodell, JSON-Schema Validierung und XLIFF-Lokalisierung.'
                      : 'Developer guide: Static zero-cost delivery on GitHub Pages, local-first storage engine, JSON Schema validation, and XLIFF localization pipeline.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#dfd1be]/60 text-[11px] font-typewriter">
                  <span className="text-[#8b6f57]">React · Vite · TypeScript</span>
                  <span className="text-[#2e7d32] font-semibold">100% Statisch</span>
                </div>
              </div>
            </div>

            {/* Code of Conduct & Pledge Banner */}
            <div className="p-4 rounded-xl border border-[#8c1d40]/20 bg-gradient-to-r from-[#8c1d40]/5 via-white to-[#f6bd60]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8c1d40] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-amelie font-bold text-sm text-[#2b1e16]">
                    {isDe ? 'CODE_OF_CONDUCT.md · Der Amélie-Ehrenkodex' : 'CODE_OF_CONDUCT.md · The Amélie Conduct Invariants'}
                  </h4>
                  <p className="text-xs text-[#5c4a3d]">
                    {isDe
                      ? 'Null-Spam-Garantie, Respekt vor der Zeit ehrenamtlicher Maintainer und bedingungslose Großzügigkeit ohne Dankesschulden.'
                      : 'Zero-pressure guarantee, respect for maintainer attention, and giving once without following up or imposing moral debt.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Import & Backup Management */}
      <div className="border border-[#dfd1be] bg-[#fffefb] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-amelie font-bold text-base text-[#2b1e16]">
              {isDe ? 'Lokale Datenverwaltung & Import' : 'Local Data Management & Import'}
            </h3>
            <p className="text-xs text-[#5c4a3d] mt-0.5">
              {isDe
                ? 'Lade eine exportierte JSON-Datei hoch, um Ideen im Browser zu aktualisieren oder zu ergänzen.'
                : 'Upload an exported JSON database file to update or append ideas in your browser.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#dfd1be] hover:bg-[#fbf6ee] text-[#2b1e16] font-medium text-xs shadow-2xs transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-[#8c1d40]" />
              <span>{isDe ? 'JSON Importieren' : 'Import JSON'}</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[#8b6f57] hover:text-[#8c1d40] text-xs font-typewriter hover:bg-[#8c1d40]/5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isDe ? 'Auf Standard zurücksetzen' : 'Reset to Defaults'}</span>
            </button>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-[#2e7d32]/10 border border-[#2e7d32]/30 text-[#2e7d32] text-xs font-medium animate-fade-in">
            {importStatus}
          </div>
        )}
      </div>
    </div>
  );
};
