import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  ArrowRight, 
  PlusCircle, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building2,
  BookOpen,
  Send,
  X,
  Database,
  Download,
  Table,
  LayoutGrid,
  Tag,
  Dices,
  Brain
} from 'lucide-react';
import { Language, CandidateIdea, CandidateStatus, Verdict } from '../types';
import { CANDIDATE_IDEAS_DATA } from '../data/unpacked';
import { getTranslation } from '../i18n';

interface UnpackedIdeasViewProps {
  lang: Language;
  onPackIdea: (candidate: CandidateIdea) => void;
  externalCandidates?: CandidateIdea[];
}

const STORAGE_KEY = 'amelie_unpacked_candidates_v1';

export const UnpackedIdeasView: React.FC<UnpackedIdeasViewProps> = ({
  lang,
  onPackIdea,
  externalCandidates,
}) => {
  const t = getTranslation(lang);
  const [candidates, setCandidates] = useState<CandidateIdea[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge default database with saved items to ensure all 100+ database entries are present
          const parsedMap = new Map(parsed.map((item: CandidateIdea) => [item.id, item]));
          const merged = CANDIDATE_IDEAS_DATA.map((base) => parsedMap.get(base.id) || base);
          const baseIdSet = new Set(CANDIDATE_IDEAS_DATA.map((b) => b.id));
          parsed.forEach((item: CandidateIdea) => {
            if (!baseIdSet.has(item.id)) {
              merged.push(item);
            }
          });
          return merged;
        }
      }
    } catch {
      // Fallback
    }
    return CANDIDATE_IDEAS_DATA;
  });

  // Sync external candidates (e.g. from Google Account import)
  useEffect(() => {
    if (externalCandidates && externalCandidates.length > 0) {
      setCandidates((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const toAdd = externalCandidates.filter((c) => !existingIds.has(c.id));
        if (toAdd.length === 0) return prev;
        const updated = [...toAdd, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore storage error
        }
        return updated;
      });
    }
  }, [externalCandidates]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ready' | 'frei' | 'verengt' | 'unklar' | 'besetzt'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [expandedId, setExpandedId] = useState<string | null>('glasanflug-ampel');
  const [copiedMd, setCopiedMd] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Dynamic unique source types
  const uniqueSourceTypes = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      if (c.sourceType) set.add(c.sourceType);
    });
    return Array.from(set).sort();
  }, [candidates]);

  // Top/Popular tags for quick filtering
  const popularTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    candidates.forEach((c) => {
      c.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([tag]) => tag);
  }, [candidates]);

  // Download JSON
  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(candidates, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `amelie_ideas_database_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Download CSV
  const handleDownloadCsv = () => {
    const headers = ['ID', 'Title', 'Category', 'Status', 'Concept', 'Target Recipient', 'Evidence', 'Tags'];
    const rows = candidates.map(c => [
      `"${c.id}"`,
      `"${(c.title || '').replace(/"/g, '""')}"`,
      `"${(c.sourceType || '').replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${(lang === 'de' ? c.conceptDe : c.conceptEn || '').replace(/"/g, '""')}"`,
      `"${(lang === 'de' ? c.recipientDe : c.recipientEn || '').replace(/"/g, '""')}"`,
      `"${(lang === 'de' ? c.evidenceDe : c.evidenceEn || '').replace(/"/g, '""')}"`,
      `"${(c.tags || []).join('; ')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `amelie_ideas_database_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // New Idea Form State
  const [newTitle, setNewTitle] = useState('');
  const [newConcept, setNewConcept] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [newStatus, setNewStatus] = useState<CandidateStatus>('frei');
  const [newSourceType, setNewSourceType] = useState<CandidateIdea['sourceType']>('Typ A');
  const [newSource, setNewSource] = useState('');
  const [newEvidence, setNewEvidence] = useState('');
  const [newReviewDate, setNewReviewDate] = useState('09/2027');
  const [newProblem, setNewProblem] = useState('');
  const [newWhyNow, setNewWhyNow] = useState('');
  const [newTicket, setNewTicket] = useState('');
  const [newCriteria, setNewCriteria] = useState('');
  const [newTags, setNewTags] = useState('');

  // Save to localStorage when candidates list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
    } catch {
      // Ignore
    }
  }, [candidates]);

  // Update candidate status interactively
  const handleStatusChange = (id: string, newStatusVal: CandidateStatus) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: newStatusVal,
            suggestedVerdict: newStatusVal === 'besetzt' ? 'discarded' : 'gift',
          };
        }
        return c;
      })
    );
  };

  // Add custom idea to candidate pipeline
  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCandidate: CandidateIdea = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      round: `Runde 2+ (${new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US')})`,
      date: new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US'),
      conceptDe: newConcept.trim() || newTitle.trim(),
      conceptEn: newConcept.trim() || newTitle.trim(),
      status: newStatus,
      suggestedVerdict: newStatus === 'besetzt' ? 'discarded' : 'gift',
      recipientDe: newRecipient.trim() || (lang === 'de' ? 'Offen / Recherche nötig' : 'Open / Research needed'),
      recipientEn: newRecipient.trim() || 'Open / Research needed',
      sourceType: newSourceType,
      sourceDe: newSource.trim() || 'Eigene Recherche',
      sourceEn: newSource.trim() || 'Custom Research',
      evidenceDe: newEvidence.trim() || 'Vorab-Prüfung durchgeführt.',
      evidenceEn: newEvidence.trim() || 'Preliminary gap check performed.',
      reviewDate: newReviewDate.trim() || '–',
      problemDe: newProblem.trim() || undefined,
      problemEn: newProblem.trim() || undefined,
      whyNowDe: newWhyNow.trim() ? [newWhyNow.trim()] : undefined,
      whyNowEn: newWhyNow.trim() ? [newWhyNow.trim()] : undefined,
      firstStepTicketDe: newTicket.trim() || undefined,
      firstStepTicketEn: newTicket.trim() || undefined,
      firstStepCriteriaDe: newCriteria.trim() || undefined,
      firstStepCriteriaEn: newCriteria.trim() || undefined,
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    setCandidates([newCandidate, ...candidates]);
    setExpandedId(newCandidate.id);
    setShowAddModal(false);

    // Reset form
    setNewTitle('');
    setNewConcept('');
    setNewRecipient('');
    setNewSource('');
    setNewEvidence('');
    setNewProblem('');
    setNewWhyNow('');
    setNewTicket('');
    setNewCriteria('');
    setNewTags('');
  };

  const resetToDefaults = () => {
    if (window.confirm(lang === 'de' ? 'Kandidatenliste auf Standardwerte zurücksetzen?' : 'Reset candidate list to defaults?')) {
      setCandidates(CANDIDATE_IDEAS_DATA);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Copy Markdown Table
  const handleCopyMarkdown = () => {
    const isDe = lang === 'de';
    let md = `# Amélie — Prüfprotokoll & Ideenspeicher\n\n`;
    md += `Stand: September 2026 · Format: Name · Konzept · Status · Prüfbefund · Prüfen ab\n\n`;
    md += `| Idee | Konzept | Status | Empfänger | Prüfbefund | Prüfen ab |\n`;
    md += `|---|---|---|---|---|---|\n`;

    candidates.forEach((c) => {
      const title = c.title;
      const concept = isDe ? c.conceptDe : c.conceptEn;
      const recipient = isDe ? c.recipientDe : c.recipientEn;
      const evidence = isDe ? c.evidenceDe : c.evidenceEn;
      md += `| **${title}** | ${concept} | \`${c.status}\` | ${recipient} | ${evidence} | ${c.reviewDate} |\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2500);
  };

  // Pick a random surprise gift idea
  const handleSurpriseMe = () => {
    const readyCandidates = candidates.filter((c) => c.status === 'frei' || c.status === 'verengt');
    const pool = readyCandidates.length > 0 ? readyCandidates : candidates;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];
    if (chosen) {
      setSearchQuery('');
      setSelectedTag(null);
      setStatusFilter('all');
      setSourceFilter('all');
      setExpandedId(chosen.id);
      setTimeout(() => {
        const el = document.getElementById(`candidate-card-${chosen.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Filtering
  const filteredCandidates = candidates.filter((c) => {
    // Status filter
    if (statusFilter === 'ready') {
      if (c.status !== 'frei' && c.status !== 'verengt') return false;
    } else if (statusFilter !== 'all') {
      if (c.status !== statusFilter) return false;
    }

    // Source filter
    if (sourceFilter !== 'all') {
      if (c.sourceType !== sourceFilter) return false;
    }

    // Tag filter
    if (selectedTag) {
      if (!c.tags || !c.tags.includes(selectedTag)) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchConcept =
        c.conceptDe.toLowerCase().includes(q) || c.conceptEn.toLowerCase().includes(q);
      const matchRecipient =
        c.recipientDe.toLowerCase().includes(q) || c.recipientEn.toLowerCase().includes(q);
      const matchEvidence =
        c.evidenceDe.toLowerCase().includes(q) || c.evidenceEn.toLowerCase().includes(q);
      const matchTags = c.tags?.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchConcept && !matchRecipient && !matchEvidence && !matchTags) {
        return false;
      }
    }

    return true;
  });

  const readyCount = candidates.filter((c) => c.status === 'frei' || c.status === 'verengt').length;
  const investigatingCount = candidates.filter((c) => c.status === 'unklar').length;
  const saturatedCount = candidates.filter((c) => c.status === 'besetzt').length;

  const getStatusBadge = (status: CandidateStatus) => {
    switch (status) {
      case 'frei':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'de' ? 'frei (offen)' : lang === 'es' ? 'libre' : 'free (open gap)'}</span>
          </span>
        );
      case 'verengt':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'de' ? 'verengt (Nische)' : lang === 'es' ? 'acotada' : 'narrowed (niche)'}</span>
          </span>
        );
      case 'unklar':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-200">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>{lang === 'de' ? 'unklar (in Prüfung)' : lang === 'es' ? 'en revisión' : 'in review'}</span>
          </span>
        );
      case 'besetzt':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-300">
            <XCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>{lang === 'de' ? 'besetzt (Vorarbeiten)' : lang === 'es' ? 'ocupada' : 'saturated'}</span>
          </span>
        );
    }
  };

  return (
    <div id="unpacked-ideas-view" className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#f8f5ee] to-[#f4efe4] border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>{t.ui.unpacked_badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              {t.ui.unpacked_heading}
            </h1>
            <p className="text-sm sm:text-base text-stone-700 max-w-3xl leading-relaxed">
              {t.ui.unpacked_subheading}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="surprise-idea-btn"
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-amber-300/90 bg-amber-50/90 text-amber-900 hover:bg-amber-100 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
              title={lang === 'de' ? 'Zufällige Geschenk-Idee aufdecken (Zündfunke)' : 'Reveal random gift idea (Spark)'}
            >
              <Dices className="w-4 h-4 text-amber-700" />
              <span>{lang === 'de' ? '🎲 Zündfunke' : lang === 'es' ? '🎲 Chispa' : '🎲 Spark Idea'}</span>
            </button>
            <button
              id="add-candidate-idea-btn"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-stone-50 text-sm font-medium hover:bg-stone-800 transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>{lang === 'de' ? '+ Neue Idee' : lang === 'es' ? '+ Proponer' : '+ Add Idea'}</span>
            </button>
            <button
              id="copy-markdown-protocol-btn"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-50 transition-colors shadow-2xs"
              title={lang === 'de' ? 'Prüfprotokoll als Markdown kopieren' : 'Copy search protocol as Markdown'}
            >
              {copiedMd ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
              <span>{copiedMd ? (lang === 'de' ? 'Kopiert!' : 'Copied!') : 'Markdown'}</span>
            </button>
            <button
              id="download-csv-btn"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-50 transition-colors shadow-2xs"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>CSV</span>
            </button>
            <button
              id="download-json-btn"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs sm:text-sm font-medium hover:bg-stone-50 transition-colors shadow-2xs"
              title="Download JSON"
            >
              <Database className="w-3.5 h-3.5 text-stone-500" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-200/80">
          <button
            onClick={() => setStatusFilter('ready')}
            className={`text-left p-3 rounded-xl border transition-all ${
              statusFilter === 'ready'
                ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs'
                : 'bg-white/60 border-stone-200 hover:bg-white'
            }`}
          >
            <div className="text-xs text-emerald-800 font-medium">{lang === 'de' ? 'Packfertig (Frei / Nische)' : 'Ready to Pack'}</div>
            <div className="text-xl font-bold text-emerald-950 mt-0.5">{readyCount}</div>
          </button>
          <button
            onClick={() => setStatusFilter('unklar')}
            className={`text-left p-3 rounded-xl border transition-all ${
              statusFilter === 'unklar'
                ? 'bg-sky-50/80 border-sky-300 shadow-2xs'
                : 'bg-white/60 border-stone-200 hover:bg-white'
            }`}
          >
            <div className="text-xs text-sky-800 font-medium">{lang === 'de' ? 'In Vorprüfung (Unklar)' : 'In Investigation'}</div>
            <div className="text-xl font-bold text-sky-950 mt-0.5">{investigatingCount}</div>
          </button>
          <button
            onClick={() => setStatusFilter('besetzt')}
            className={`text-left p-3 rounded-xl border transition-all ${
              statusFilter === 'besetzt'
                ? 'bg-stone-200/80 border-stone-400 shadow-2xs'
                : 'bg-white/60 border-stone-200 hover:bg-white'
            }`}
          >
            <div className="text-xs text-stone-600 font-medium">{lang === 'de' ? 'Besetzt (Atlas-Referenz)' : 'Saturated Reference'}</div>
            <div className="text-xl font-bold text-stone-800 mt-0.5">{saturatedCount}</div>
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`text-left p-3 rounded-xl border transition-all ${
              statusFilter === 'all'
                ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                : 'bg-white/60 border-stone-200 hover:bg-white'
            }`}
          >
            <div className="text-xs text-stone-600 font-medium">{lang === 'de' ? 'Gesamter Katalog' : 'Total Ideas'}</div>
            <div className="text-xl font-bold text-stone-900 mt-0.5">{candidates.length}</div>
          </button>
        </div>
      </div>

      {/* Filter, Search & View Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="candidate-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'de'
                  ? 'Katalog durchsuchen (Titel, Problem, Empfänger, Tag)...'
                  : 'Search catalog (title, problem, recipient, tags)...'
              }
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-xl px-3 py-1.5 shadow-2xs text-xs font-medium text-stone-700">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                id="status-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-transparent focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">{lang === 'de' ? 'Alle Status' : 'All Statuses'}</option>
                <option value="ready">{lang === 'de' ? '✨ Packfertig (frei / verengt)' : '✨ Ready to pack (free / narrowed)'}</option>
                <option value="frei">{lang === 'de' ? '🟢 Frei (offene Lücke)' : '🟢 Free (open gap)'}</option>
                <option value="verengt">{lang === 'de' ? '🟡 Verengt (Nische)' : '🟡 Narrowed (niche)'}</option>
                <option value="unklar">{lang === 'de' ? '🔵 Unklar (Prüfung nötig)' : '🔵 In review'}</option>
                <option value="besetzt">{lang === 'de' ? '⚪ Besetzt (Atlas)' : '⚪ Saturated'}</option>
              </select>
            </div>

            {/* Dynamic Source / Domain Filter */}
            <select
              id="source-filter-select"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-white border border-stone-300 rounded-xl px-3 py-1.5 shadow-2xs text-xs font-medium text-stone-700 focus:outline-none cursor-pointer max-w-[180px] truncate"
            >
              <option value="all">{lang === 'de' ? `Alle Kategorien (${candidates.length})` : `All Categories (${candidates.length})`}</option>
              {uniqueSourceTypes.map((st) => (
                <option key={st} value={st}>
                  {st} ({candidates.filter((c) => c.sourceType === st).length})
                </option>
              ))}
            </select>

            {/* View Mode Toggle: Cards vs Table */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-300 shadow-2xs">
              <button
                type="button"
                id="view-mode-cards-btn"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'cards' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
                }`}
                title={lang === 'de' ? 'Kartenansicht' : 'Card View'}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="view-mode-table-btn"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'table' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-500 hover:text-stone-800'
                }`}
                title={lang === 'de' ? 'Tabellenansicht' : 'Table View'}
              >
                <Table className="w-4 h-4" />
              </button>
            </div>

            {candidates.length !== CANDIDATE_IDEAS_DATA.length && (
              <button
                onClick={resetToDefaults}
                className="text-xs text-stone-500 hover:text-stone-800 underline px-2 py-1"
              >
                {lang === 'de' ? 'Standard' : 'Reset'}
              </button>
            )}
          </div>
        </div>

        {/* Quick Tag Pill Chips */}
        {popularTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none text-xs">
            <span className="text-stone-400 flex items-center gap-1 shrink-0 font-medium pl-0.5">
              <Tag className="w-3 h-3 text-stone-400" />
              <span>{lang === 'de' ? 'Themen:' : 'Themes:'}</span>
            </span>
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                selectedTag === null
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {lang === 'de' ? 'Alle' : 'All'}
            </button>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                  selectedTag === tag
                    ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-900'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Result Count and Active Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-500 px-1">
        <div>
          {lang === 'de' ? (
            <span>
              Zeige <strong>{filteredCandidates.length}</strong> von {candidates.length} Ideen
              {selectedTag && <> · Thema: <span className="font-semibold text-amber-700">#{selectedTag}</span></>}
              {sourceFilter !== 'all' && <> · Kategorie: <span className="font-semibold text-amber-700">{sourceFilter}</span></>}
              {statusFilter !== 'all' && <> · Status: <span className="font-semibold text-stone-800">{statusFilter}</span></>}
            </span>
          ) : (
            <span>
              Showing <strong>{filteredCandidates.length}</strong> of {candidates.length} ideas
              {selectedTag && <> · Tag: <span className="font-semibold text-amber-700">#{selectedTag}</span></>}
              {sourceFilter !== 'all' && <> · Category: <span className="font-semibold text-amber-700">{sourceFilter}</span></>}
              {statusFilter !== 'all' && <> · Status: <span className="font-semibold text-stone-800">{statusFilter}</span></>}
            </span>
          )}
        </div>
        {(selectedTag || searchQuery || sourceFilter !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setSourceFilter('all');
              setSelectedTag(null);
            }}
            className="text-amber-700 hover:text-amber-900 font-medium hover:underline self-start sm:self-auto"
          >
            {lang === 'de' ? 'Alle Filter zurücksetzen' : 'Reset all filters'}
          </button>
        )}
      </div>

      {/* Ideas Listing: Table vs Cards */}
      {viewMode === 'table' && filteredCandidates.length > 0 ? (
        <div className="bg-white border border-stone-200/90 rounded-2xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#faf8f5] border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-3xs">
                  <th className="py-3 px-4 w-[28%]">{lang === 'de' ? 'Idee & Domäne' : 'Idea & Domain'}</th>
                  <th className="py-3 px-3 w-[14%]">Status</th>
                  <th className="py-3 px-4 w-[36%]">{lang === 'de' ? 'Konzept & Empfänger' : 'Concept & Recipient'}</th>
                  <th className="py-3 px-3 w-[12%]">{lang === 'de' ? 'Prüfdatum' : 'Review'}</th>
                  <th className="py-3 px-3 text-right w-[10%]">{lang === 'de' ? 'Aktion' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCandidates.map((candidate) => {
                  const isExpanded = expandedId === candidate.id;
                  const isReadyToPack = candidate.status === 'frei' || candidate.status === 'verengt';
                  const concept = lang === 'de' ? candidate.conceptDe : candidate.conceptEn;
                  const recipient = lang === 'de' ? candidate.recipientDe : candidate.recipientEn;
                  const problem = lang === 'de' ? candidate.problemDe : candidate.problemEn;
                  const whyNow = lang === 'de' ? candidate.whyNowDe : candidate.whyNowEn;
                  const ticket = lang === 'de' ? candidate.firstStepTicketDe : candidate.firstStepTicketEn;
                  const evidence = lang === 'de' ? candidate.evidenceDe : candidate.evidenceEn;

                  return (
                    <React.Fragment key={candidate.id}>
                      <tr className={`hover:bg-stone-50/80 transition-colors ${isExpanded ? 'bg-amber-50/30' : ''}`}>
                        <td className="py-3 px-4 align-top">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : candidate.id)}
                            className="text-left font-semibold text-stone-900 hover:text-amber-800 text-sm leading-snug flex items-center gap-1.5"
                          >
                            <span>{candidate.title}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-stone-400 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />}
                          </button>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 text-3xs font-mono border border-amber-200/50">
                              {candidate.sourceType}
                            </span>
                            {candidate.tags?.slice(0, 2).map((t) => (
                              <span key={t} className="text-3xs text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 align-top">
                          <div className="scale-90 origin-left">
                            {getStatusBadge(candidate.status)}
                          </div>
                        </td>
                        <td className="py-3 px-4 align-top text-stone-700 leading-relaxed">
                          <p className="line-clamp-2">{concept}</p>
                          <p className="text-stone-500 text-3xs mt-1">
                            <strong>{lang === 'de' ? 'Empfänger: ' : 'Target: '}</strong>
                            {recipient}
                          </p>
                        </td>
                        <td className="py-3 px-3 align-top text-stone-500 font-mono text-3xs">
                          {candidate.reviewDate}
                        </td>
                        <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                          {isReadyToPack && (
                            <button
                              onClick={() => onPackIdea(candidate)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-2xs"
                              title={t.ui.unpacked_pack_btn}
                            >
                              <Send className="w-3 h-3" />
                              <span>{lang === 'de' ? 'Packen' : 'Pack'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-[#fcfaf6] border-b border-stone-200">
                          <td colSpan={5} className="p-4 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-stone-200/80">
                              <div>
                                <span className="font-semibold text-stone-900 block mb-1">
                                  {lang === 'de' ? 'Prüfbefund & Vorarbeiten:' : 'Evidence & Prior Art:'}
                                </span>
                                <p className="text-stone-600 leading-relaxed">{evidence}</p>
                                {problem && (
                                  <div className="mt-2.5">
                                    <span className="font-semibold text-stone-900 block mb-0.5">
                                      {lang === 'de' ? 'Kernproblem:' : 'Core Problem:'}
                                    </span>
                                    <p className="text-stone-600 leading-relaxed">{problem}</p>
                                  </div>
                                )}
                              </div>
                              <div>
                                {ticket && (
                                  <div className="mb-2">
                                    <span className="font-semibold text-stone-900 block mb-0.5">
                                      {lang === 'de' ? 'Ticket #1 (Erster Schritt):' : 'Ticket #1 (First step):'}
                                    </span>
                                    <p className="font-mono text-stone-800 bg-stone-50 p-2 rounded border border-stone-200">{ticket}</p>
                                  </div>
                                )}
                                {whyNow && whyNow.length > 0 && (
                                  <div>
                                    <span className="font-semibold text-stone-900 block mb-0.5">
                                      {lang === 'de' ? 'Warum jetzt:' : 'Why Now:'}
                                    </span>
                                    <ul className="list-disc pl-4 text-stone-600 space-y-0.5">
                                      {whyNow.map((w, i) => <li key={i}>{w}</li>)}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Ideas Card List */
        <div className="space-y-4">
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200/80 rounded-2xl p-8">
            <p className="text-stone-500 text-sm">
              {lang === 'de'
                ? 'Keine Ideen für diese Filterkriterien gefunden.'
                : 'No ideas found matching the current filter criteria.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setSourceFilter('all');
              }}
              className="mt-3 text-xs font-semibold text-amber-700 hover:underline"
            >
              {lang === 'de' ? 'Filter zurücksetzen' : 'Reset filters'}
            </button>
          </div>
        ) : (
          filteredCandidates.map((candidate) => {
            const isExpanded = expandedId === candidate.id;
            const isReadyToPack = candidate.status === 'frei' || candidate.status === 'verengt';
            const concept = lang === 'de' ? candidate.conceptDe : candidate.conceptEn;
            const recipient = lang === 'de' ? candidate.recipientDe : candidate.recipientEn;
            const evidence = lang === 'de' ? candidate.evidenceDe : candidate.evidenceEn;
            const source = lang === 'de' ? candidate.sourceDe : candidate.sourceEn;
            const problem = lang === 'de' ? candidate.problemDe : candidate.problemEn;
            const whyNow = lang === 'de' ? candidate.whyNowDe : candidate.whyNowEn;
            const ticket = lang === 'de' ? candidate.firstStepTicketDe : candidate.firstStepTicketEn;
            const criteria = lang === 'de' ? candidate.firstStepCriteriaDe : candidate.firstStepCriteriaEn;

            return (
              <div
                key={candidate.id}
                id={`candidate-card-${candidate.id}`}
                className={`bg-white border rounded-2xl transition-all shadow-2xs overflow-hidden ${
                  isReadyToPack
                    ? 'border-amber-200/70 hover:border-amber-400/80'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {/* Main Card Header */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(candidate.status)}
                        <span className="px-2 py-0.5 text-xs rounded-md bg-stone-100 text-stone-600 font-mono">
                          {candidate.round}
                        </span>
                        <span className="px-2 py-0.5 text-xs rounded-md bg-amber-50 text-amber-800 font-mono border border-amber-200/60">
                          {candidate.sourceType}
                        </span>
                        {(candidate.round.includes('AI') || candidate.tags?.includes('AI-Native')) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono-code font-bold bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-2xs">
                            <Brain className="w-3 h-3 text-indigo-700" />
                            <span>AI-Native</span>
                          </span>
                        )}
                        {candidate.reviewDate !== '–' && (
                          <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                            <Calendar className="w-3 h-3" />
                            <span>{lang === 'de' ? 'Prüfen ab:' : 'Review after:'} {candidate.reviewDate}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
                        {candidate.title}
                      </h3>

                      <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-sans">
                        {concept}
                      </p>

                      {/* Recipient & Evidence Snippet */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                        <div className="bg-[#fcfaf6] border border-stone-200/70 rounded-xl p-3">
                          <div className="font-semibold text-stone-800 flex items-center gap-1.5 mb-1">
                            <Building2 className="w-3.5 h-3.5 text-amber-700" />
                            <span>{lang === 'de' ? 'Empfänger / Mandat:' : 'Target Recipient:'}</span>
                          </div>
                          <p className="text-stone-600 leading-normal">{recipient}</p>
                        </div>

                        <div className="bg-[#fcfaf6] border border-stone-200/70 rounded-xl p-3">
                          <div className="font-semibold text-stone-800 flex items-center gap-1.5 mb-1">
                            <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                            <span>{lang === 'de' ? 'Prüfbefund / Vorarbeiten:' : 'Evidence / Prior Art:'}</span>
                          </div>
                          <p className="text-stone-600 leading-normal">{evidence}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Column */}
                    <div className="flex md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-stone-100">
                      {isReadyToPack && (
                        <button
                          id={`pack-btn-${candidate.id}`}
                          onClick={() => onPackIdea(candidate)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow"
                        >
                          <Send className="w-3.5 h-3.5 text-amber-200" />
                          <span>{t.ui.unpacked_pack_btn}</span>
                        </button>
                      )}

                      {/* Interactive Status Changer */}
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <span>{lang === 'de' ? 'Status:' : 'Status:'}</span>
                        <select
                          value={candidate.status}
                          onChange={(e) => handleStatusChange(candidate.id, e.target.value as CandidateStatus)}
                          className="bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                        >
                          <option value="frei">{lang === 'de' ? 'frei' : 'free'}</option>
                          <option value="verengt">{lang === 'de' ? 'verengt' : 'narrowed'}</option>
                          <option value="unklar">{lang === 'de' ? 'unklar' : 'in review'}</option>
                          <option value="besetzt">{lang === 'de' ? 'besetzt' : 'saturated'}</option>
                        </select>
                      </div>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : candidate.id)}
                        className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 font-medium px-2 py-1 rounded-md hover:bg-stone-100"
                      >
                        <span>{isExpanded ? (lang === 'de' ? 'Weniger Details' : 'Less') : (lang === 'de' ? 'Mehr Details' : 'Details')}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  {candidate.tags && candidate.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      {candidate.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-2xs rounded-md bg-stone-100 text-stone-600 border border-stone-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="border-t border-stone-100 bg-[#faf8f4] p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-stone-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Problem Statement */}
                      {problem && (
                        <div className="bg-white border border-stone-200/80 rounded-xl p-4 space-y-1.5 shadow-2xs">
                          <h4 className="font-semibold text-stone-900 flex items-center gap-1.5">
                            <span className="text-amber-700">●</span>
                            <span>{lang === 'de' ? 'Das Problem im Detail' : 'The Detailed Problem'}</span>
                          </h4>
                          <p className="text-stone-700 leading-relaxed">{problem}</p>
                        </div>
                      )}

                      {/* Why Now */}
                      {whyNow && whyNow.length > 0 && (
                        <div className="bg-white border border-stone-200/80 rounded-xl p-4 space-y-1.5 shadow-2xs">
                          <h4 className="font-semibold text-stone-900 flex items-center gap-1.5">
                            <span className="text-emerald-700">●</span>
                            <span>{lang === 'de' ? 'Warum jetzt? (Technologie-Wende)' : 'Why Now? (Technological Shift)'}</span>
                          </h4>
                          <ul className="list-disc pl-4 space-y-1 text-stone-700">
                            {whyNow.map((w, idx) => (
                              <li key={idx}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Ticket #1 Specification */}
                    {ticket && (
                      <div className="bg-white border border-stone-200/80 rounded-xl p-4 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-stone-900 flex items-center gap-1.5">
                            <span className="text-blue-700">●</span>
                            <span>{lang === 'de' ? 'Vorgeschlagenes Ticket #1 (Erster Schritt)' : 'Proposed Ticket #1 (First Step)'}</span>
                          </h4>
                          <span className="text-2xs font-mono text-stone-500 uppercase">
                            {lang === 'de' ? '2-Tage-Aufwand' : '2-Day Scope'}
                          </span>
                        </div>
                        <p className="font-mono text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-800">
                          {ticket}
                        </p>
                        {criteria && (
                          <p className="text-stone-600 text-xs">
                            <span className="font-semibold text-stone-700">{lang === 'de' ? 'Fertig-Kriterium: ' : 'Done Criteria: '}</span>
                            {criteria}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Source & Protocol Reference */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 pt-2 border-t border-stone-200/60">
                      <div>
                        <span className="font-medium text-stone-600">{lang === 'de' ? 'Quelle / Suchstring: ' : 'Source / Query: '}</span>
                        <span>{source}</span>
                      </div>
                      {isReadyToPack && (
                        <button
                          onClick={() => onPackIdea(candidate)}
                          className="inline-flex items-center gap-1.5 font-semibold text-amber-700 hover:text-amber-900 hover:underline"
                        >
                          <span>{lang === 'de' ? 'Jetzt in die Werkstatt übernehmen →' : 'Transfer to Packer Workshop →'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      )}

      {/* Add New Idea Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl border border-stone-200 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                {lang === 'de' ? 'Neue Idee im Ideenspeicher erfassen' : 'Record New Idea in Candidate Pipeline'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                {lang === 'de'
                  ? 'Erfasse eine Vorab-Idee vor dem Packen. Halte den Prüfbefund und potenzielle Empfänger fest.'
                  : 'Capture an idea before packing. Log your preliminary existence check and prospective recipients.'}
              </p>
            </div>

            <form onSubmit={handleAddIdea} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-medium text-stone-800 mb-1">
                  {lang === 'de' ? 'Titel / Name der Idee *' : 'Idea Title / Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={lang === 'de' ? 'z. B. Waldbrand-Meldungsfilter' : 'e.g. Forest Fire Early Sensor Filter'}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-800 mb-1">
                  {lang === 'de' ? 'Konzept in einem Satz *' : 'One-sentence Concept *'}
                </label>
                <input
                  type="text"
                  required
                  value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                  placeholder={lang === 'de' ? 'Was tut das Werkzeug und für wen?' : 'What does the tool do and for whom?'}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-800 mb-1">
                    {lang === 'de' ? 'Status der Prüfung' : 'Verification Status'}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as CandidateStatus)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  >
                    <option value="frei">{lang === 'de' ? 'frei (offene Lücke / kein Tool)' : 'free (open gap)'}</option>
                    <option value="verengt">{lang === 'de' ? 'verengt (spezifische Nische)' : 'narrowed (specific niche)'}</option>
                    <option value="unklar">{lang === 'de' ? 'unklar (Recherche läuft)' : 'in review (researching)'}</option>
                    <option value="besetzt">{lang === 'de' ? 'besetzt (bereits gebaut)' : 'saturated (prior art exists)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-stone-800 mb-1">
                    {lang === 'de' ? 'Quellentyp (nach Amélie-Playbook)' : 'Source Type'}
                  </label>
                  <select
                    value={newSourceType}
                    onChange={(e) => setNewSourceType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  >
                    <option value="Typ A">Typ A — Fachgremium mit PDF-Schema ohne Software</option>
                    <option value="Typ B">Typ B — Citizen Science mit manuellem Engpass</option>
                    <option value="Typ C">Typ C — Organisation mit KI-Werkstattbericht</option>
                    <option value="Typ D">Typ D — Bauauftrag / Stiftung</option>
                    <option value="Besetzungsatlas">Besetzungsatlas (Vorarbeiten)</option>
                    <option value="Community">Community / Eigener Fund</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-800 mb-1">
                    {lang === 'de' ? 'Empfänger / Ziel-Organisation' : 'Target Recipient / Mandate'}
                  </label>
                  <input
                    type="text"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    placeholder={lang === 'de' ? 'z. B. BUND / Senatsverwaltung' : 'e.g. Open NGO / Civic Lab'}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-800 mb-1">
                    {lang === 'de' ? 'Wiedervorlage / Prüfen ab' : 'Review Date'}
                  </label>
                  <input
                    type="text"
                    value={newReviewDate}
                    onChange={(e) => setNewReviewDate(e.target.value)}
                    placeholder="09/2027"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-stone-800 mb-1">
                  {lang === 'de' ? 'Prüfbefund / Vorarbeiten (Was existiert bereits?)' : 'Evidence / Prior Art Findings'}
                </label>
                <textarea
                  rows={2}
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  placeholder={lang === 'de' ? 'PDF-Schema existiert, aber keine Web-App oder Rechner...' : 'Guideline exists in PDF, but zero web tools...'}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-stone-800 mb-1">
                    {lang === 'de' ? 'Ticket #1 (Minimaler erster Schritt)' : 'Ticket #1 (Minimum first step)'}
                  </label>
                  <input
                    type="text"
                    value={newTicket}
                    onChange={(e) => setNewTicket(e.target.value)}
                    placeholder={lang === 'de' ? 'Foto-Upload + Berechnung des Scores' : 'Upload photo and calculate score'}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-stone-800 mb-1">
                    {lang === 'de' ? 'Stichworte / Tags (kommagetrennt)' : 'Tags (comma separated)'}
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Klima, Artenschutz, OCR"
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-50 font-medium"
                >
                  {t.ui.close}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-stone-50 rounded-xl hover:bg-stone-800 font-medium transition-colors shadow-xs"
                >
                  {lang === 'de' ? 'Idee speichern' : 'Save Idea'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
