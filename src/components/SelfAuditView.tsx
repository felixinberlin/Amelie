import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, Info, RefreshCw, CheckCircle2, FileText, Activity, Database } from 'lucide-react';
import { AmelieHealth, AuditFinding } from '../audit/types';
import { Language } from '../types';
import { getTranslation } from '../i18n';

interface SelfAuditViewProps {
  lang: Language;
}

export const SelfAuditView: React.FC<SelfAuditViewProps> = ({ lang }) => {
  const t = getTranslation(lang);
  const [health, setHealth] = useState<AmelieHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealthData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/data/amelie-health.json');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data: AmelieHealth = await res.json();
      setHealth(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load audit data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-500 dark:text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-amber-600 dark:text-amber-400" />
        <p className="font-mono text-sm">Loading Amélie Self-Audit health data...</p>
      </div>
    );
  }

  if (error || !health) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl p-6 text-red-800 dark:text-red-300">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 shrink-0 text-red-600 dark:text-red-400" />
            <h3 className="font-bold text-lg">Self-Audit Snapshot Missing</h3>
          </div>
          <p className="text-sm mb-4">
            Could not fetch <code>/data/amelie-health.json</code>. Run <code>npm run audit</code> to generate the health snapshot.
          </p>
          <p className="font-mono text-xs bg-red-100 dark:bg-red-900/40 p-2 rounded">{error}</p>
        </div>
      </div>
    );
  }

  const errors = health.findings.filter((f) => f.severity === 'error');
  const warnings = health.findings.filter((f) => f.severity === 'warning');
  const infos = health.findings.filter((f) => f.severity === 'info');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-amber-900/10 dark:bg-amber-900/20 border border-amber-800/30 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <ShieldCheck className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
                Self-Audit / Project Cockpit
              </h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Deterministic offline self-observation of Amélie's repository, memory, and validation guards.
            </p>
          </div>
          <div className="text-right sm:text-left text-xs font-mono text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div><strong>Generated:</strong> {new Date(health.generatedAt).toLocaleString()}</div>
            <div><strong>Commit:</strong> {health.repository.commit || 'head'} ({health.repository.branch || 'main'})</div>
            <div><strong>Audit Version:</strong> v{health.auditVersion}</div>
          </div>
        </div>
      </div>

      {/* Inventory Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
          <span className="block text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{health.inventory.doses}</span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Dosen</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
          <span className="block text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{health.inventory.graves}</span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Gräber</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
          <span className="block text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{health.inventory.demos}</span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Demos</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
          <span className="block text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{health.inventory.books}</span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Books</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
          <span className="block text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{health.inventory.researchEntries}</span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Research</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
          <span className="block text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">{health.inventory.candidateIdeas}</span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Candidates</span>
        </div>
      </div>

      {/* Validation Checks Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Validation Guards Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {health.checks.map((c) => (
            <div
              key={c.id}
              className={`p-3 rounded-lg border flex items-center justify-between font-mono text-xs ${
                c.status === 'pass'
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-300'
              }`}
            >
              <span>{c.name}</span>
              <span className="font-bold flex items-center gap-1">
                {c.status === 'pass' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                {c.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Findings Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          Audit Findings ({health.findings.length})
        </h2>

        {/* Errors */}
        <div>
          <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Errors ({errors.length})
          </h3>
          {errors.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">No error-level findings detected.</p>
          ) : (
            <ul className="space-y-2">
              {errors.map((f) => (
                <li key={f.id} className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg text-xs font-mono text-red-900 dark:text-red-200">
                  <span className="font-bold">[{f.id}]</span> {f.message} {f.file && <span className="underline opacity-75">({f.file})</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Warnings */}
        <div>
          <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Warnings & Documentation Drift ({warnings.length})
          </h3>
          {warnings.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">No warning findings detected.</p>
          ) : (
            <ul className="space-y-2">
              {warnings.map((f) => (
                <li key={f.id} className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg text-xs font-mono text-amber-900 dark:text-amber-200">
                  <span className="font-bold">[{f.id}]</span> {f.message} {f.file && <span className="underline opacity-75">({f.file})</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Infos */}
        <div>
          <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Information ({infos.length})
          </h3>
          {infos.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">No informational findings.</p>
          ) : (
            <ul className="space-y-2">
              {infos.map((f) => (
                <li key={f.id} className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-lg text-xs font-mono text-blue-900 dark:text-blue-200">
                  <span className="font-bold">[{f.id}]</span> {f.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
