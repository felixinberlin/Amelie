import React, { useState, useEffect } from 'react';
import {
  FileText,
  Mail,
  Search,
  RefreshCw,
  ExternalLink,
  PackagePlus,
  BookmarkPlus,
  CheckCircle2,
  AlertCircle,
  Eye,
  LogOut,
  FolderSync,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Language, CandidateIdea } from '../types';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  getAccessToken,
  isFirebaseConfigured,
} from '../services/googleAuth';
import {
  searchDriveIdeas,
  searchGmailIdeas,
  fetchFileContent,
  GoogleIdeaItem,
} from '../services/googleIdeas';
import { User } from 'firebase/auth';

interface GoogleAccountImporterProps {
  lang: Language;
  onPackIdea: (draftData: any) => void;
  onAddToCandidates?: (candidate: CandidateIdea) => void;
}

export const GoogleAccountImporter: React.FC<GoogleAccountImporterProps> = ({
  lang,
  onPackIdea,
  onAddToCandidates,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Search & data state
  const [driveQuery, setDriveQuery] = useState('');
  const [gmailQuery, setGmailQuery] = useState('idea OR idee OR "app idea" OR "projekt"');
  const [activeSourceFilter, setActiveSourceFilter] = useState<'all' | 'docs' | 'drive' | 'gmail'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<GoogleIdeaItem[]>([]);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

  // Inspect document modal
  const [inspectingItem, setInspectingItem] = useState<GoogleIdeaItem | null>(null);
  const [inspectContent, setInspectContent] = useState<string>('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        // Fallback: check if we have access token
        getAccessToken().then((t) => setToken(t));
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        // Automatically perform initial scan
        fetchItems(res.accessToken);
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setAuthError(err.message || 'Failed to sign in with Google');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleSignOut();
      setUser(null);
      setToken(null);
      setItems([]);
    } catch (err: any) {
      console.error('Sign out failed:', err);
    }
  };

  const fetchItems = async (activeTok?: string) => {
    const currentTok = activeTok || token;
    if (!currentTok) return;

    setIsLoading(true);
    setAuthError(null);
    try {
      const drivePromise = searchDriveIdeas(driveQuery).catch((e) => {
        console.warn('Drive scan error:', e);
        return [] as GoogleIdeaItem[];
      });

      const gmailPromise = searchGmailIdeas(gmailQuery).catch((e) => {
        console.warn('Gmail scan error:', e);
        return [] as GoogleIdeaItem[];
      });

      const [driveResults, gmailResults] = await Promise.all([drivePromise, gmailPromise]);
      const combined = [...driveResults, ...gmailResults];

      // Sort by modified date descending
      combined.sort(
        (a, b) => new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
      );

      setItems(combined);
    } catch (err: any) {
      console.error('Error fetching Google items:', err);
      setAuthError(err.message || 'Error communicating with Google APIs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInspect = async (item: GoogleIdeaItem) => {
    setInspectingItem(item);
    setIsLoadingContent(true);
    setInspectContent('');

    try {
      if (item.source === 'gmail') {
        setInspectContent(item.snippet || 'No message body available.');
      } else {
        const text = await fetchFileContent(item.id, item.mimeType);
        setInspectContent(text || item.snippet || 'No plain text representation available.');
      }
    } catch (e: any) {
      console.error('Failed to load text:', e);
      setInspectContent(item.snippet || 'Could not fetch file content.');
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleTransferToPacker = async (item: GoogleIdeaItem) => {
    let content = item.snippet;
    if (item.source !== 'gmail') {
      try {
        const text = await fetchFileContent(item.id, item.mimeType);
        if (text) content = text.slice(0, 1200);
      } catch (e) {
        // use snippet
      }
    }

    const isDe = lang === 'de';
    const draft = {
      title: item.title,
      oneLiner: item.snippet || item.title,
      recipient: isDe
        ? 'Recherchierter Partner für diesen Entwurf'
        : 'Researched institutional recipient',
      verdict: 'gift',
      problem: content || item.title,
      whyNow: isDe
        ? `- Aus persönlichem Google-Konto importiert (${item.source.toUpperCase()})\n- Unfertiger Entwurf bereit zur Prüfung nach Amélie 1:2-Regel\n- Quelle: ${item.url}`
        : `- Imported from Google Workspace (${item.source.toUpperCase()})\n- Ready for Amélie 1:2 delivery research\n- Source: ${item.url}`,
      sketch: isDe
        ? `1. Kernmechanismus aus Entwurf "${item.title}" extrahieren\n2. Deterministische Minimallösung formulieren\n3. An passendes Team übergeben`
        : `1. Extract core mechanism from "${item.title}"\n2. Formulate turnkey zero-cost prototype\n3. Deliver to domain custodian`,
      ticketName: isDe ? 'Ticket #1: 3-Klick Prototyp' : 'Ticket #1: 3-Click Prototype',
      ticketCriteria: isDe ? 'Kernfunktion ohne Serverkosten im Browser erlebbar.' : 'Core logic interactive in browser.',
      failureMode: isDe
        ? 'Bruchstelle: Idee bleibt im Google Drive liegen, statt an Bauende verschenkt zu werden.'
        : 'Failure point: Idea stays buried in Google Drive rather than gifted to builders.',
      priorArt: `Google Workspace Import (${item.source}): ${item.url}`,
    };

    setImportedIds((prev) => new Set(prev).add(item.id));
    onPackIdea(draft);
  };

  const handleTransferToCandidates = (item: GoogleIdeaItem) => {
    if (!onAddToCandidates) return;
    const isDe = lang === 'de';

    const candidate: CandidateIdea = {
      id: `google-${item.id}`,
      title: item.title,
      round: 'Import Google',
      date: new Date(item.modifiedTime).toLocaleDateString(),
      conceptDe: item.snippet || item.title,
      conceptEn: item.snippet || item.title,
      status: 'unklar',
      suggestedVerdict: 'gift',
      recipientDe: 'Wird in Stufe 0.5 recherchiert',
      recipientEn: 'Researched during Step 0.5',
      sourceType: item.source === 'gmail' ? 'Gmail' : item.source === 'docs' ? 'Google Docs' : 'Google Drive',
      sourceDe: `Google Account Import: ${item.title}`,
      sourceEn: `Google Account Import: ${item.title}`,
      evidenceDe: `Importiert aus Google (${item.source}): ${item.url}`,
      evidenceEn: `Imported from Google (${item.source}): ${item.url}`,
      reviewDate: 'Sofort',
      problemDe: item.snippet,
      problemEn: item.snippet,
      tags: item.tags,
    };

    setImportedIds((prev) => new Set(prev).add(item.id));
    onAddToCandidates(candidate);
  };

  const filteredItems = items.filter((item) => {
    if (activeSourceFilter === 'all') return true;
    if (activeSourceFilter === 'docs') return item.source === 'docs';
    if (activeSourceFilter === 'drive') return item.source === 'drive' || item.source === 'sheets';
    if (activeSourceFilter === 'gmail') return item.source === 'gmail';
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#fbf9f4] border border-amber-900/15 rounded-xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-mono-code mb-4 border border-amber-300/80">
            <FolderSync className="w-3.5 h-3.5 text-amber-800" />
            <span>Google Workspace · Live Pipeline Import</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif-title font-bold text-stone-900 tracking-tight">
            {lang === 'de'
              ? 'Ideen aus deinem Google-Konto importieren'
              : 'Import Ideas from Your Google Account'}
          </h2>

          <p className="mt-2 text-sm sm:text-base text-stone-700 font-sans leading-relaxed">
            {lang === 'de'
              ? 'Lies unvollendete Entwürfe, Projektnotizen und Gedanken aus deinen Google Docs, Drive-Dateien und Gmail-Mails aus — und überführe sie direkt in die Amélie-Zustellpipeline.'
              : 'Scan your Google Docs, Drive files, and Gmail threads for buried concepts, raw drafts, and project outlines — then pack them into turnkey gift tins.'}
          </p>

          {/* Connected User Pill or Connect Button */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {user ? (
              <div className="flex flex-wrap items-center gap-3 bg-white px-4 py-2.5 rounded-lg border border-emerald-300 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-mono-code text-xs flex items-center justify-center font-bold">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'G'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-stone-900">{user.email || 'Google User'}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {lang === 'de' ? 'Verbunden' : 'Connected'}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-600 block">
                    Google Drive · Google Docs · Gmail
                  </span>
                </div>

                <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />

                <button
                  onClick={() => fetchItems()}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-900 hover:text-amber-950 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-800 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? (lang === 'de' ? 'Lade...' : 'Scanning...') : (lang === 'de' ? 'Neu synchronisieren' : 'Re-scan')}</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="text-stone-500 hover:text-stone-700 p-1.5 rounded hover:bg-stone-100 transition-colors"
                  title={lang === 'de' ? 'Abmelden' : 'Sign out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                {/* Official styled Sign in with Google Button */}
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg bg-white hover:bg-stone-50 text-stone-700 text-sm font-medium border border-stone-300 shadow-xs hover:shadow-sm transition-all focus:outline-hidden active:bg-stone-100"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>
                    {isSigningIn
                      ? (lang === 'de' ? 'Verbinde mit Google...' : 'Connecting to Google...')
                      : (lang === 'de' ? 'Mit Google anmelden' : 'Sign in with Google')}
                  </span>
                </button>
              </div>
            )}
          </div>

          {!user && !isFirebaseConfigured() && (
            <div className="mt-4 p-3 rounded-lg bg-[#f4ece1] border border-[#dfd1be] text-xs text-[#5c4a3d] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#8c1d40]" />
                <span>
                  {lang === 'de'
                    ? 'GitHub Pages Statik-Modus: Das Archiv, die Dosen, der Markdown/JSON-Export und der lokale Editor laufen 100% offline ohne Firebase. Live-Import aus Google Docs/Gmail erfordert optionale VITE_FIREBASE_*-Secrets.'
                    : 'GitHub Pages Static Mode: The idea archive, tins, Markdown/JSON exports, and local editor work 100% offline without Firebase. Live Google Workspace import requires optional VITE_FIREBASE_* repository secrets.'}
                </span>
              </div>
            </div>
          )}

          {authError && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
              <span>{authError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Area (Once signed in or browsing) */}
      {user ? (
        <div className="space-y-6">
          {/* Filter & Search Toolbar */}
          <div className="bg-white border border-stone-200/80 rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Drive search bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={driveQuery}
                  onChange={(e) => setDriveQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchItems()}
                  placeholder={
                    lang === 'de'
                      ? 'Drive durchsuchen (z.B. Idee, App, Projekt, Notiz)...'
                      : 'Search Drive files (e.g., idea, app, concept, note)...'
                  }
                  className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 text-stone-900 placeholder:text-stone-600"
                />
              </div>

              {/* Source selector */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg text-xs self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveSourceFilter('all')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeSourceFilter === 'all'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {lang === 'de' ? 'Alle Quellen' : 'All Sources'} ({items.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSourceFilter('docs')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                    activeSourceFilter === 'docs'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Google Docs ({items.filter((i) => i.source === 'docs').length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSourceFilter('gmail')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                    activeSourceFilter === 'gmail'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-red-600" />
                  <span>Gmail ({items.filter((i) => i.source === 'gmail').length})</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => fetchItems()}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{lang === 'de' ? 'Suchen' : 'Scan'}</span>
              </button>
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 pt-1 border-t border-stone-100">
              <span className="text-[11px] uppercase tracking-wider font-mono-code text-stone-600">
                {lang === 'de' ? 'Schnellfilter:' : 'Quick search:'}
              </span>
              {[
                { label: 'Ideen & Entwürfe', q: 'Idee' },
                { label: 'App Concepts', q: 'App' },
                { label: 'Projekte', q: 'Projekt' },
                { label: 'Drafts', q: 'Draft' },
                { label: 'Meeting Notes', q: 'Meeting' },
              ].map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setDriveQuery(pill.q);
                    setGmailQuery(`"${pill.q}"`);
                  }}
                  className="px-2 py-0.5 rounded bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 transition-colors"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          {isLoading ? (
            <div className="py-16 text-center bg-white rounded-xl border border-stone-200/80 p-8 space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-800 animate-spin mx-auto" />
              <h3 className="font-serif-title font-semibold text-stone-800">
                {lang === 'de' ? 'Durchsuche dein Google-Konto...' : 'Scanning your Google Workspace...'}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                {lang === 'de'
                  ? 'Abfrage von Google Drive (Docs, Tabellen, Notizen) und Gmail-Nachrichten nach unvollendeten Ideen.'
                  : 'Retrieving Docs, notes, and Gmail threads matching your idea queries.'}
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-dashed border-stone-300 p-8 space-y-3">
              <FileText className="w-8 h-8 text-stone-400 mx-auto" />
              <h3 className="font-serif-title font-semibold text-stone-800">
                {lang === 'de' ? 'Keine Dokumente für diese Suche gefunden' : 'No matching documents found'}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                {lang === 'de'
                  ? 'Versuche eine allgemeinere Suchanfrage (z.B. leer lassen, um alle kürzlich geänderten Dokumente anzuzeigen).'
                  : 'Try a broader search or clear the search input to list all recently modified documents.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setDriveQuery('');
                  setGmailQuery('idea OR idee OR project');
                  fetchItems();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors"
              >
                <span>{lang === 'de' ? 'Alle aktuellen Dokumente laden' : 'Load all recent documents'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const isImported = importedIds.has(item.id);

                return (
                  <div
                    key={item.id}
                    className={`bg-white border rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between ${
                      isImported ? 'border-emerald-300 bg-emerald-50/20' : 'border-stone-200/80 hover:border-amber-300'
                    }`}
                  >
                    <div>
                      {/* Top badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5">
                          {item.source === 'docs' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">
                              <FileText className="w-3 h-3" />
                              <span>Google Doc</span>
                            </span>
                          )}
                          {item.source === 'gmail' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 text-[11px] font-medium border border-red-200">
                              <Mail className="w-3 h-3" />
                              <span>Gmail Draft/Thread</span>
                            </span>
                          )}
                          {item.source === 'drive' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200">
                              <Layers className="w-3 h-3" />
                              <span>Drive File</span>
                            </span>
                          )}

                          {isImported && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{lang === 'de' ? 'Übernommen' : 'Imported'}</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-mono-code text-stone-600">
                          {new Date(item.modifiedTime).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="font-serif-title font-bold text-stone-900 text-base leading-snug line-clamp-2">
                        {item.title}
                      </h4>

                      {/* Snippet */}
                      <p className="mt-2 text-xs text-stone-700 line-clamp-3 leading-relaxed font-sans">
                        {item.snippet || (lang === 'de' ? 'Keine Vorschau verfügbar' : 'No preview available')}
                      </p>
                    </div>

                    {/* Action footer */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleInspect(item)}
                          className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 px-2 py-1 rounded hover:bg-stone-100 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{lang === 'de' ? 'Lesen' : 'Inspect'}</span>
                        </button>

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 px-2 py-1 rounded hover:bg-stone-100 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{lang === 'de' ? 'Öffnen' : 'Open'}</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        {onAddToCandidates && (
                          <button
                            type="button"
                            onClick={() => handleTransferToCandidates(item)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium transition-colors"
                            title={lang === 'de' ? 'Als ungepackte Idee vormerken' : 'Save as candidate idea'}
                          >
                            <BookmarkPlus className="w-3.5 h-3.5 text-stone-600" />
                            <span>{lang === 'de' ? 'Vormerken' : 'Save'}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleTransferToPacker(item)}
                          className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-amber-900 hover:bg-amber-950 text-white font-medium shadow-2xs transition-colors"
                        >
                          <PackagePlus className="w-3.5 h-3.5" />
                          <span>{lang === 'de' ? 'Dose packen' : 'Pack Tin'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Signed-out Explanation Guide */
        <div className="bg-white border border-stone-200/80 rounded-xl p-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-900">
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-xl font-serif-title font-bold text-stone-900">
              {lang === 'de'
                ? 'Verbinde dein Google-Konto mit der Amélie-Pipeline'
                : 'Connect Your Google Account with the Amélie Pipeline'}
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {lang === 'de'
                ? 'Jeder Erfinder hat hunderte Google Docs mit Ideen, die nie gebaut wurden. Mit dieser Verbindung durchsucht Amélie deine Dokumente schreibgeschützt, bereitet sie nach dem Kula-Verfahren auf und findet die passenden Empfänger.'
                : 'Most builders have dozens of abandoned Google Docs with ideas they will never build. By connecting read-only access, Amélie scans your notes and packages them as turnkey gifts for teams that will build them.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left text-xs text-stone-700 pt-4">
            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200/70 space-y-1">
              <span className="font-semibold text-stone-900 block flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Google Docs
              </span>
              <p>Scannt Notizen, Tabellen und Dokumente nach App-Entwürfen.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200/70 space-y-1">
              <span className="font-semibold text-stone-900 block flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-red-600" />
                Gmail Drafts
              </span>
              <p>Findet gesendete Entwürfe und E-Mails an dich selbst mit Ideen.</p>
            </div>
            <div className="p-3.5 rounded-lg bg-stone-50 border border-stone-200/70 space-y-1">
              <span className="font-semibold text-stone-900 block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Reines Lesen (Read-Only)
              </span>
              <p>Keine Schreib- oder Löschrechte. Deine Originale bleiben unberührt.</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium shadow-sm transition-all focus:outline-hidden"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              <span>
                {isSigningIn
                  ? (lang === 'de' ? 'Verbinde mit Google...' : 'Connecting to Google...')
                  : (lang === 'de' ? 'Jetzt mit Google verbinden' : 'Connect with Google Now')}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Full Document Inspector Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl border border-stone-200 overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-stone-600">
                  {inspectingItem.source === 'docs' ? 'Google Doc' : inspectingItem.source === 'gmail' ? 'Gmail Message' : 'Drive File'}
                </span>
                <h3 className="font-serif-title font-bold text-lg text-stone-900 line-clamp-1">
                  {inspectingItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="text-stone-600 hover:text-stone-800 p-1.5 rounded-lg hover:bg-stone-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 font-mono-code text-xs text-stone-800 leading-relaxed whitespace-pre-wrap bg-[#fefdfb]">
              {isLoadingContent ? (
                <div className="py-12 text-center text-stone-600 space-y-2">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto text-amber-800" />
                  <p>{lang === 'de' ? 'Lade Dokumenttext aus Google Drive...' : 'Fetching document body from Google Drive...'}</p>
                </div>
              ) : (
                inspectContent || inspectingItem.snippet || 'No text content found.'
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
              <a
                href={inspectingItem.url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{lang === 'de' ? 'Im Browser öffnen' : 'Open in browser'}</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInspectingItem(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  {lang === 'de' ? 'Schließen' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleTransferToPacker(inspectingItem);
                    setInspectingItem(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-900 hover:bg-amber-950 text-white text-xs font-medium transition-colors shadow-2xs"
                >
                  <PackagePlus className="w-3.5 h-3.5" />
                  <span>{lang === 'de' ? 'In Amélie-Dose packen' : 'Pack into Tin'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
