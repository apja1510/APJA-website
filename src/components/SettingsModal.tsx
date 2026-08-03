import React, { useState } from 'react';
import { SoftwareSetup } from '../types';
import { X, Key, Trash2, Download, Upload, RefreshCw, Shield, AlertTriangle, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubToken: string;
  onSaveToken: (token: string) => void;
  setups: SoftwareSetup[];
  onRemoveSetup: (id: string) => void;
  onResetDefaults: () => void;
  onImportSetups: (setups: SoftwareSetup[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  githubToken,
  onSaveToken,
  setups,
  onRemoveSetup,
  onResetDefaults,
  onImportSetups,
}) => {
  const [tokenInput, setTokenInput] = useState(githubToken);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveToken(tokenInput.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(setups, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'setup-hub-config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportSetups(parsed);
            alert('Successfully imported setup collection!');
          }
        } catch (err) {
          alert('Invalid JSON configuration file format.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden my-8 animate-fadeIn space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Settings & API Configuration</h3>
              <p className="text-xs text-slate-400">GitHub API authentication & tracked setup management</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto flex-1 pr-1">
          {/* GitHub Token Section */}
          <form onSubmit={handleSaveToken} className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block mb-1">
                Optional GitHub Personal Access Token (PAT)
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Unauthenticated GitHub API calls are limited to 60 requests per hour. Adding a token boosts your limit to 5,000/hr and allows tracking private repositories.
              </p>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-600"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                Token is saved strictly in your local browser storage.
              </span>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Token Saved!</span>
                  </>
                ) : (
                  <span>Save Token</span>
                )}
              </button>
            </div>
          </form>

          {/* Manage Tracked Repositories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Manage Tracked Repositories ({setups.length})
            </h4>

            <div className="divide-y divide-slate-800/80 bg-slate-950 rounded-2xl border border-slate-800 max-h-48 overflow-y-auto">
              {setups.map((s) => (
                <div key={s.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {s.iconUrl && <img src={s.iconUrl} alt={s.displayName} className="w-7 h-7 rounded-lg" />}
                    <div>
                      <p className="font-semibold text-slate-200">{s.displayName}</p>
                      <p className="text-[11px] font-mono text-slate-500">{s.owner}/{s.repo}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveSetup(s.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Remove setup"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Import / Export / Reset */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJson}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <label className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
              </label>
            </div>

            <button
              onClick={() => {
                if (confirm('Reset to default repository list?')) {
                  onResetDefaults();
                }
              }}
              className="px-3.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/20 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
